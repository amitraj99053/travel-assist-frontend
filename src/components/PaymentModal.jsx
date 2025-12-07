import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FaTimes, FaCheckCircle, FaMobileAlt } from 'react-icons/fa';

const PaymentModal = ({ isOpen, onClose, amount, mechanicName, onConfirm }) => {
    if (!isOpen) return null;

    // Mock UPI ID - in a real app, this would come from the mechanic's profile
    const mechanicUpiId = "mechanic@upi";
    const upiUrl = `upi://pay?pa=${mechanicUpiId}&pn=${encodeURIComponent(mechanicName || 'Mechanic')}&am=${amount}&cu=INR`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaMobileAlt /> Scan & Pay
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <FaTimes size={24} />
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

                    <div className="text-center mb-6">
                        <p className="text-gray-600 mb-1">Total Amount</p>
                        <p className="text-4xl font-bold text-gray-900">₹{amount}</p>
                        <p className="text-sm text-gray-500 mt-2">Paying to: <span className="font-semibold text-gray-800">{mechanicName || 'Travel Assist Mechanic'}</span></p>
                    </div>

                    <div className="w-full bg-blue-50 p-4 rounded-md mb-6 text-sm text-blue-800">
                        <p className="font-semibold mb-1">Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Open any UPI App (GPay, PhonePe, Paytm)</li>
                            <li>Scan the QR code above</li>
                            <li>Complete the payment on your phone</li>
                            <li>Click "Confirm Payment" below</li>
                        </ol>
                    </div>

                    <button
                        onClick={onConfirm}
                        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-transform transform hover:scale-105"
                    >
                        <FaCheckCircle /> Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
