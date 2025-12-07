import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions or need assistance? We're here to help you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-white p-8 rounded-xl shadow-lg h-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl shrink-0">
                                    <FaPhone />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Phone</h3>
                                    <p className="text-gray-600">+91 12345 67890</p>
                                    <p className="text-sm text-gray-500">Available 24/7 for emergencies</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl shrink-0">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email</h3>
                                    <p className="text-gray-600">support@travelassist.com</p>
                                    <p className="text-sm text-gray-500">We reply within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl shrink-0">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Office</h3>
                                    <p className="text-gray-600">Gamma 1, Greater Noida, Uttar Pradesh</p>
                                    <p className="text-gray-600">India, 201310</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
                            <h3 className="font-semibold text-blue-800 mb-2">Need Immediate Help?</h3>
                            <p className="text-blue-600 text-sm">
                                For roadside emergencies, please use the "Create Service Request" button on your dashboard for the fastest response.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors">
                                    <option>General Inquiry</option>
                                    <option>Support</option>
                                    <option>Feedback</option>
                                    <option>Partnership</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button
                                type="button"
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <FaPaperPlane /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
