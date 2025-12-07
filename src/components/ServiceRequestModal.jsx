import React, { useState } from 'react';
import { serviceAPI } from '../services/api';
import useAuthStore from '../context/authStore';

const ServiceRequestModal = ({ isOpen, onClose, onSuccess }) => {
    const { token } = useAuthStore();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        issueType: 'breakdown',
        priority: 'medium',
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        registrationNumber: '',
        address: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Get user's current location (using default Delhi coordinates for now)
            const requestData = {
                title: formData.title,
                description: formData.description,
                issueType: formData.issueType,
                priority: formData.priority,
                vehicleInfo: {
                    make: formData.vehicleMake,
                    model: formData.vehicleModel,
                    year: formData.vehicleYear ? parseInt(formData.vehicleYear) : undefined,
                    registrationNumber: formData.registrationNumber,
                },
                location: {
                    latitude: 28.7041, // Default Delhi coordinates
                    longitude: 77.1025,
                    address: formData.address,
                },
            };

            const response = await serviceAPI.createRequest(requestData, token);

            if (response.success) {
                onSuccess();
                onClose();
                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    issueType: 'breakdown',
                    priority: 'medium',
                    vehicleMake: '',
                    vehicleModel: '',
                    vehicleYear: '',
                    registrationNumber: '',
                    address: '',
                });
            }
        } catch (err) {
            setError(err.message || 'Failed to create service request');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create Service Request</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Car won't start"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Issue Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Issue Type *
                            </label>
                            <select
                                name="issueType"
                                value={formData.issueType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="breakdown">Breakdown</option>
                                <option value="accident">Accident</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="repair">Repair</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority *
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the issue in detail..."
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Vehicle Information */}
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Information</h3>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Make
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicleMake"
                                        value={formData.vehicleMake}
                                        onChange={handleChange}
                                        placeholder="e.g., Toyota"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Model
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicleModel"
                                        value={formData.vehicleModel}
                                        onChange={handleChange}
                                        placeholder="e.g., Camry"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        name="vehicleYear"
                                        value={formData.vehicleYear}
                                        onChange={handleChange}
                                        placeholder="e.g., 2020"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleChange}
                                        placeholder="e.g., DL01AB1234"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location/Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your current location"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                            >
                                {isLoading ? 'Creating...' : 'Create Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ServiceRequestModal;
