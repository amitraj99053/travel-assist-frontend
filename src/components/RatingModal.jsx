import React, { useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';

const RatingModal = ({ isOpen, onClose, onSubmit, mechanicName }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit({ rating, title, comment });
            onClose();
        } catch (error) {
            console.error('Rating submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Rate Your Experience</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <FaTimes size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-gray-600 mb-4 text-center">
                        How was your service with <span className="font-semibold">{mechanicName}</span>?
                    </p>

                    <div className="flex justify-center mb-6">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                        className="hidden"
                                    />
                                    <FaStar
                                        className="transition-colors duration-200"
                                        size={40}
                                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Great Service!"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share details about your experience..."
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-bold mt-6 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
