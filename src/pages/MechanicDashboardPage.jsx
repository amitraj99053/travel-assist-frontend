import React, { useState, useEffect } from 'react';
import useAuthStore from '../context/authStore';
import { mechanicAPI, serviceAPI } from '../services/api';
import {
    initializeSocket,
    joinMechanicRoom,
    onNewRequest,
    onRequestUnavailable,
    disconnectSocket,
    updateLocation
} from '../services/socket';
import { FaTools, FaMapMarkerAlt, FaPhone, FaCheckCircle, FaClock, FaStar } from 'react-icons/fa';

const MechanicDashboardPage = () => {
    const { user, token } = useAuthStore();
    const [dashboardData, setDashboardData] = useState(null);
    const [currentJob, setCurrentJob] = useState(null);
    const [mechanicBookings, setMechanicBookings] = useState([]);
    const [nearbyRequests, setNearbyRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAccepting, setIsAccepting] = useState(null);
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
        fetchNearbyRequests();
        fetchCurrentJob();

        // Initialize socket connection
        const socket = initializeSocket();
        joinMechanicRoom();

        // Listen for new requests
        onNewRequest((newRequest) => {
            console.log('New request received:', newRequest);
            setNearbyRequests(prev => [newRequest, ...prev]);

            // Play notification sound
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(error => console.log('Audio play failed:', error));
            } catch (error) {
                console.error('Error initializing audio:', error);
            }
        });

        // Listen for requests taken by others
        onRequestUnavailable((data) => {
            console.log('Request unavailable:', data.requestId);
            setNearbyRequests(prev => prev.filter(req => req._id !== data.requestId));
        });

        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        // Simulate location updates if on active job
        let locationInterval;
        if (currentJob && ['en_route', 'arrived'].includes(currentJob.status)) {
            locationInterval = setInterval(() => {
                // Mock movement: slightly jitter the coordinates
                const lat = 28.7041 + (Math.random() - 0.5) * 0.01;
                const lng = 77.1025 + (Math.random() - 0.5) * 0.01;
                updateLocation({
                    location: { latitude: lat, longitude: lng },
                    bookingId: currentJob._id,
                    userId: currentJob.userId._id || currentJob.userId // Handle populated or ID
                });
            }, 5000);
        }

        return () => {
            if (locationInterval) clearInterval(locationInterval);
        };
    }, [currentJob]);

    const fetchCurrentJob = async () => {
        try {
            const response = await mechanicAPI.getBookings(token);
            if (response.success) {
                setMechanicBookings(response.data);
                if (response.data.length > 0) {
                    // Find active job (scheduled, en_route, arrived, in_progress)
                    const activeJob = response.data.find(job =>
                        ['scheduled', 'en_route', 'arrived', 'in_progress'].includes(job.status)
                    );
                    setCurrentJob(activeJob || null);
                }
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const response = await mechanicAPI.getDashboard(token);
            if (response.success) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        }
    };

    const fetchNearbyRequests = async () => {
        try {
            setIsLoading(true);
            const query = new URLSearchParams({
                latitude: 28.7041,
                longitude: 77.1025,
                maxDistance: 20,
            });
            const response = await serviceAPI.getNearbyRequests(query.toString(), token);
            if (response.success) {
                setNearbyRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            setIsAccepting(requestId);
            const response = await mechanicAPI.acceptRequest(requestId, token);
            if (response.success) {
                alert('Request accepted successfully!');
                fetchNearbyRequests();
                fetchDashboardData();
                fetchCurrentJob(); // Fetch the newly created booking
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Failed to accept request: ' + error.message);
        } finally {
            setIsAccepting(null);
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!currentJob) return;
        try {
            const response = await mechanicAPI.updateBookingStatus(currentJob._id, status, token);
            if (response.success) {
                setCurrentJob(prev => ({ ...prev, status }));
                alert(`Status updated to: ${status.replace('_', ' ')}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleCompleteJob = async () => {
        if (!currentJob) return;
        try {
            const cost = prompt("Enter total cost for the service:", "500");
            if (!cost) return;

            const response = await mechanicAPI.completeBooking(currentJob._id, token, { totalCost: parseInt(cost) });
            if (response.success) {
                alert('Job completed successfully!');
                setCurrentJob(null);
                fetchDashboardData();
            }
        } catch (error) {
            console.error('Error completing job:', error);
            alert('Failed to complete job');
        }
    };

    const handleToggleAvailability = async () => {
        try {
            const newStatus = !dashboardData.mechanic.isAvailable;
            const response = await mechanicAPI.updateAvailability({ isAvailable: newStatus }, token);
            if (response.success) {
                setDashboardData(prev => ({
                    ...prev,
                    mechanic: {
                        ...prev.mechanic,
                        isAvailable: response.data.isAvailable
                    }
                }));
            }
        } catch (error) {
            console.error('Error updating availability:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mechanic Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
                    </div>
                    {dashboardData && (
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-full font-medium ${dashboardData.mechanic.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {dashboardData.mechanic.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                            <button
                                onClick={handleToggleAvailability}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Change Status
                            </button>
                        </div>
                    )}
                </div>

                {/* Current Job Section */}
                {currentJob && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-green-500">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Job</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
                                <p className="text-gray-700"><span className="font-medium">Name:</span> {currentJob.userId?.firstName} {currentJob.userId?.lastName}</p>
                                <p className="text-gray-700"><span className="font-medium">Phone:</span> {currentJob.userId?.phone}</p>
                                <p className="text-gray-700"><span className="font-medium">Location:</span> {currentJob.location?.address || 'Shared Location'}</p>
                                <p className="text-gray-700 mt-2"><span className="font-medium">Issue:</span> {currentJob.serviceDescription}</p>
                            </div>
                            <div className="flex flex-col gap-3 justify-center">
                                <div className="text-center mb-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium uppercase text-sm">
                                        Status: {currentJob.status.replace('_', ' ')}
                                    </span>
                                </div>

                                {currentJob.status === 'scheduled' && (
                                    <button
                                        onClick={() => handleUpdateStatus('en_route')}
                                        className="bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 font-bold"
                                    >
                                        Start / On the Way
                                    </button>
                                )}

                                {currentJob.status === 'en_route' && (
                                    <button
                                        onClick={() => handleUpdateStatus('arrived')}
                                        className="bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 font-bold"
                                    >
                                        Arrived at Location
                                    </button>
                                )}

                                {(['arrived', 'in_progress'].includes(currentJob.status)) && (
                                    <button
                                        onClick={handleCompleteJob}
                                        className="bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-bold"
                                    >
                                        Complete Job
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                {dashboardData && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Jobs</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData.mechanic.totalJobs}</p>
                                </div>
                                <FaTools className="text-blue-500 text-2xl" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Pending Requests</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData.pendingRequests}</p>
                                </div>
                                <FaClock className="text-yellow-500 text-2xl" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Today's Jobs</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData.todaysJobs}</p>
                                </div>
                                <FaCheckCircle className="text-green-500 text-2xl" />
                            </div>
                        </div>
                        <div
                            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-transform transform hover:-translate-y-1 hover:bg-blue-50"
                            onClick={() => setIsReviewsModalOpen(true)}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Rating</p>
                                    <p className="text-2xl font-bold text-gray-900">{dashboardData.mechanic.rating} ⭐</p>
                                </div>
                                <div className="text-gray-400 text-sm">
                                    ({dashboardData.mechanic.reviews} reviews)
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Job History */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job History</h2>
                    {mechanicBookings.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
                            No jobs history found.
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mechanicBookings.map((job) => (
                                            <tr key={job._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(job.bookingDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {job.userId?.firstName} {job.userId?.lastName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {job.serviceDescription}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        job.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {job.totalCost ? `₹${job.totalCost}` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Available Jobs Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Available Jobs Nearby</h2>
                        <button
                            onClick={fetchNearbyRequests}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                        >
                            <FaClock /> Refresh List
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Loading available jobs...</div>
                    ) : nearbyRequests.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                            <p className="text-lg mb-2">No service requests found in your area right now.</p>
                            <p className="text-sm">Try refreshing the list or expanding your service radius.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {nearbyRequests.map((request) => (
                                <div key={request._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={request.title}>{request.title}</h3>
                                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase shrink-0 ml-2 ${request.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                            request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {request.priority}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{request.description}</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                            <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                                            <span className="truncate">{request.location?.address || 'Location shared'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                            <span className="font-medium shrink-0">Vehicle:</span>
                                            <span className="truncate">{request.vehicleInfo?.make} {request.vehicleInfo?.model} ({request.vehicleInfo?.year})</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                            <span className="font-medium shrink-0">User:</span>
                                            <span className="truncate">{request.userId?.firstName} {request.userId?.lastName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                            <FaPhone className="text-gray-400 shrink-0" />
                                            <span className="truncate">{request.userId?.phone}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAcceptRequest(request._id)}
                                        disabled={isAccepting === request._id || currentJob}
                                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-bold shadow-sm disabled:bg-gray-400 transition-colors mt-auto"
                                    >
                                        {currentJob ? 'Finish Current Job' : isAccepting === request._id ? 'Accepting...' : 'ACCEPT JOB'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Reviews Modal */}
                {isReviewsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                                    <p className="text-sm text-gray-500 mt-1">Recent feedback from your services</p>
                                </div>
                                <button
                                    onClick={() => setIsReviewsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 p-2 rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 space-y-4">
                                {!dashboardData?.recentReviews || dashboardData.recentReviews.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <FaCheckCircle className="mx-auto text-4xl text-gray-300 mb-4" />
                                        <p className="text-lg">No reviews yet.</p>
                                        <p className="text-sm">Complete jobs to start getting rated!</p>
                                    </div>
                                ) : (
                                    dashboardData.recentReviews.map((review, index) => (
                                        <div key={review._id || index} className="border-b border-gray-100 last:border-0 pb-4 mb-4 last:pb-0 last:mb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-bold text-gray-900">{review.title}</div>
                                                        {review.verified && (
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <FaCheckCircle className="w-3 h-3" /> Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex text-yellow-400 text-sm mt-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                                                                size={14}
                                                            />
                                                        ))}
                                                        <span className="ml-2 text-gray-500 text-xs flex items-center">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                                                    {review.rating} <span className="text-sm text-gray-400 font-normal">/5</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm italic border-l-4 border-blue-400">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                                <button
                                    onClick={() => setIsReviewsModalOpen(false)}
                                    className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MechanicDashboardPage;
