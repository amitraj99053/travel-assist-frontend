import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import { serviceAPI, bookingAPI, reviewAPI } from '../services/api';
import {
  initializeSocket,
  joinUserRoom,
  onRequestAccepted,
  onBookingUpdated,
  onBookingCompleted,
  disconnectSocket
} from '../services/socket';
import { FaMapMarkerAlt, FaPhone, FaStar, FaCreditCard, FaSync, FaTimesCircle } from 'react-icons/fa';
import ServiceRequestModal from '../components/ServiceRequestModal';
import MapTracking from '../components/MapTracking';
import RatingModal from '../components/RatingModal';

const DashboardPage = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [nearbyMechanics, setNearbyMechanics] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [mechanicLocation, setMechanicLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    fetchNearbyMechanics();
    fetchUserRequests();

    if (user) {
      // Initialize socket connection
      initializeSocket();
      joinUserRoom(user._id);

      // Listen for request acceptance
      onRequestAccepted((data) => {
        console.log('Request accepted:', data);
        alert(`Your request has been accepted by ${data.mechanic.name}!`);
        fetchUserRequests();
        fetchActiveBooking();
      });

      // Listen for booking updates
      onBookingUpdated((data) => {
        console.log('Booking updated:', data);
        fetchActiveBooking();
      });

      // Listen for booking completion
      onBookingCompleted((data) => {
        console.log('Booking completed:', data);
        alert('Your service has been completed! Please proceed to payment.');
        fetchActiveBooking();
        fetchUserRequests();
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  const fetchActiveBooking = async () => {
    try {
      const [bookingsResponse, reviewsResponse] = await Promise.all([
        bookingAPI.getUserBookings(token),
        reviewAPI.getUserReviews(token)
      ]);

      if (bookingsResponse.success) {
        setUserBookings(bookingsResponse.data);
        const reviews = reviewsResponse.success ? reviewsResponse.data : [];
        setUserReviews(reviews);

        // Find active, pending payment, or unrated completed booking
        const active = bookingsResponse.data.find(b => {
          const isRated = reviews.some(r => {
            const reviewBookingId = r.bookingId && (r.bookingId._id || r.bookingId);
            return reviewBookingId && reviewBookingId.toString() === b._id.toString();
          });

          // Treat missing paymentStatus as 'pending'
          const paymentStatus = b.paymentStatus || 'pending';

          return (
            ['scheduled', 'en_route', 'arrived', 'in_progress'].includes(b.status) ||
            (b.status === 'completed' && paymentStatus === 'pending') ||
            (b.status === 'completed' && (paymentStatus === 'completed' || paymentStatus === 'declined') && !isRated)
          );
        });
        setActiveBooking(active || null);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleRatingSubmit = async (ratingData) => {
    if (!activeBooking) return;
    try {
      const response = await reviewAPI.submitReview({
        mechanicId: activeBooking.mechanicId._id || activeBooking.mechanicId,
        bookingId: activeBooking._id,
        ...ratingData
      }, token);

      if (response.success) {
        alert('Review submitted successfully!');
        setIsRatingModalOpen(false);
        setActiveBooking(null); // Hide the booking card as it's now completed and rated
        fetchUserRequests(); // Refresh requests list
      }
    } catch (error) {
      alert('Failed to submit review: ' + error.message);
    }
  };



  const handleDeclinePayment = async () => {
    if (!activeBooking) return;
    if (window.confirm('Are you sure you want to decline payment?')) {
      try {
        const response = await bookingAPI.declinePayment(activeBooking._id, token);
        if (response.success) {
          await fetchActiveBooking();
          setIsRatingModalOpen(true);
        }
      } catch (error) {
        alert('Failed to decline payment: ' + error.message);
      }
    }
  };

  const fetchNearbyMechanics = async () => {
    try {
      setIsLoading(true);
      const query = new URLSearchParams({
        latitude: 28.7041,
        longitude: 77.1025,
        maxDistance: 10,
      });
      const response = await serviceAPI.getNearbyMechanics(query.toString(), token);
      if (response.success) {
        setNearbyMechanics(response.data);
      }
    } catch (error) {
      console.error('Error fetching mechanics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRequests = async () => {
    try {
      const response = await serviceAPI.getUserRequests(token);
      if (response.success) {
        setUserRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
            <p className="text-gray-600 mt-2">Find the best mechanics near you</p>
          </div>
          <button
            onClick={() => { fetchActiveBooking(); fetchUserRequests(); }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <FaSync /> Refresh
          </button>
        </div>

        {/* Active Service Section */}
        {activeBooking && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Service</h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-lg font-semibold text-gray-800">Status: <span className="text-blue-600 uppercase">{activeBooking.status.replace('_', ' ')}</span></p>
                <p className="text-gray-600 mt-1">Mechanic ID: {activeBooking.mechanicId?._id || activeBooking.mechanicId}</p>
                <p className="text-gray-600">Service: {activeBooking.serviceDescription}</p>
                {activeBooking.totalCost > 0 && (
                  <p className="text-xl font-bold text-gray-900 mt-2">Total Cost: ₹{activeBooking.totalCost}</p>
                )}
              </div>

              {activeBooking.status === 'completed' && (!activeBooking.paymentStatus || activeBooking.paymentStatus === 'pending') && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => navigate(`/payment/${activeBooking._id}`)}
                    className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 font-bold flex items-center gap-2 w-full justify-center shadow-md transition-all transform hover:scale-105"
                  >
                    <FaCreditCard /> Pay Now
                  </button>
                  <button
                    onClick={handleDeclinePayment}
                    className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity mt-1"
                  >
                    <FaTimesCircle /> Decline Payment
                  </button>
                </div>
              )}

              {activeBooking.status === 'completed' && (activeBooking.paymentStatus === 'completed' || activeBooking.paymentStatus === 'declined') && (
                <button
                  onClick={() => setIsRatingModalOpen(true)}
                  className="bg-yellow-500 text-white px-8 py-3 rounded-md hover:bg-yellow-600 font-bold flex items-center gap-2"
                >
                  <FaStar /> Rate Mechanic
                </button>
              )}

              {['en_route', 'arrived'].includes(activeBooking.status) && (
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md animate-pulse">
                  Tracking Live Location...
                </div>
              )}
            </div>

            {/* Map Tracking */}
            {['scheduled', 'en_route', 'arrived', 'in_progress'].includes(activeBooking.status) && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Live Tracking</h3>
                <MapTracking
                  userLocation={{ latitude: 28.7041, longitude: 77.1025 }} // Mock user location
                  mechanicLocation={mechanicLocation}
                />
              </div>
            )}
          </div>
        )}

        {/* Create Service Request */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Need assistance?</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Create Service Request
          </button>
        </div>

        {/* Service Request Modal */}
        <ServiceRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchUserRequests();
            alert('Service request created successfully!');
          }}
        />

        {/* Rating Modal */}
        {activeBooking && (
          <RatingModal
            isOpen={isRatingModalOpen}
            onClose={() => setIsRatingModalOpen(false)}
            onSubmit={handleRatingSubmit}
            mechanicName={activeBooking.mechanicId?.userId?.firstName || 'Mechanic'}
          />
        )}



        {/* Nearby Mechanics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Mechanics</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyMechanics.map((mechanic) => (
                <div key={mechanic.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{mechanic.name}</h3>
                      <p className="text-gray-600 text-sm">{mechanic.shopName}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaStar className="text-yellow-400" />
                      <span>{mechanic.rating} ({mechanic.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaPhone />
                      <span>{mechanic.phone}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {mechanic.skills.map((skill) => (
                        <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`You can contact ${mechanic.name} at ${mechanic.phone}`)}
                    className="w-full bg-blue-100 text-blue-700 py-2 rounded-md hover:bg-blue-200 font-medium"
                  >
                    Contact Mechanic
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking History */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking History</h2>
          {userBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
              No bookings found.
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mechanic</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.mechanicId?.userId?.firstName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.serviceDescription}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.totalCost ? `₹${booking.totalCost}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Your Requests */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Service Requests</h2>
          {userRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
              No service requests yet. Create one to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {userRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{request.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
