import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { FaCheckCircle, FaMobileAlt, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { bookingAPI } from '../services/api';
import useAuthStore from '../context/authStore';
import AuthLayout from '../components/AuthLayout'; // Or just a simple layout

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await bookingAPI.getBookingById(bookingId, token);
                if (response.success) {
                    setBooking(response.data);
                } else {
                    setError('Failed to load booking details');
                }
            } catch (err) {
                setError(err.message || 'Error loading booking');
            } finally {
                setLoading(false);
            }
        };

        if (bookingId && token) {
            fetchBooking();
        }
    }, [bookingId, token]);

    const handlePaymentConfirm = async () => {
        setProcessing(true);
        try {
            // Mock payment processing
            // In a real app, you'd verify the transaction with the payment gateway
            const response = await bookingAPI.processPayment({
                bookingId: booking._id,
                paymentMethod: 'UPI',
                amount: booking.totalCost
            }, token);

            if (response.success) {
                alert('Payment Successful!');
                navigate('/dashboard');
            }
        } catch (err) {
            alert('Payment failed: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                    <FaArrowLeft /> Back to Dashboard
                </button>
            </div>
        );
    }

    if (!booking) return null;

    // Generate UPI URL
    const mechanicName = booking.mechanicId?.userId?.firstName
        ? `${booking.mechanicId.userId.firstName} ${booking.mechanicId.userId.lastName}`
        : 'Mechanic';

    // Mock UPI ID - in a real app, this would come from the mechanic's profile
    // const mechanicUpiId = "mechanic@upi";
    const mechanicUpiId = "amitraj990531@ybl";
    const upiUrl = `upi://pay?pa=${mechanicUpiId}&pn=${encodeURIComponent(mechanicName)}&am=${booking.totalCost}&cu=INR`;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaMobileAlt /> Secure Payment
                    </h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-white hover:text-gray-200 text-sm"
                    >
                        Cancel
                    </button>
                </div>

                <div className="p-8 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg shadow-inner border border-gray-200 mb-6">
                        <QRCodeCanvas
                            value={upiUrl}
                            size={200}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>

                    <div className="text-center mb-8 w-full">
                        <p className="text-gray-500 text-sm uppercase tracking-wide mb-1">Total Amount Due</p>
                        <p className="text-4xl font-extrabold text-gray-900 mb-2">₹{booking.totalCost}</p>

                        <div className="bg-gray-50 rounded-lg p-3 mt-4 text-left">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Service:</span>
                                <span className="font-medium text-gray-900">{booking.serviceDescription || 'Vehicle Repair'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Pay To:</span>
                                <span className="font-medium text-gray-900">{mechanicName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-blue-50 p-4 rounded-md mb-6 text-sm text-blue-800 border border-blue-100">
                        <p className="font-semibold mb-2 flex items-center gap-2">
                            <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">i</span>
                            How to Pay:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 ml-1">
                            <li>Open <strong>GPay, PhonePe, or Paytm</strong></li>
                            <li>Scan the QR code above</li>
                            <li>Complete the payment</li>
                            <li>Click <strong>Confirm Payment</strong> below</li>
                        </ol>
                    </div>

                    <button
                        onClick={handlePaymentConfirm}
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-3.5 rounded-lg hover:bg-green-700 font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-all transform hover:translate-y-[-2px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <FaSpinner className="animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <FaCheckCircle /> Confirm Payment
                            </>
                        )}
                    </button>

                    <p className="text-xs text-gray-400 mt-4 text-center">
                        Secure 256-bit encrypted transaction
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
