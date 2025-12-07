import React from 'react';
import { FaCarCrash, FaTruck, FaTools, FaBatteryFull, FaKey, FaOilCan } from 'react-icons/fa';

const ServicesPage = () => {
    const services = [
        {
            icon: <FaCarCrash />,
            title: 'Emergency Breakdown',
            description: 'Immediate assistance for engine failures, overheating, and other critical breakdowns.',
            color: 'bg-red-100 text-red-600'
        },
        {
            icon: <FaTruck />,
            title: 'Towing Service',
            description: 'Safe and secure towing to the nearest certified garage or your preferred location.',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: <FaTools />,
            title: 'On-Site Repair',
            description: 'Minor repairs like tire changes, belt replacements, and fluid top-ups handled on the spot.',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: <FaBatteryFull />,
            title: 'Battery Jumpstart',
            description: 'Dead battery? We will get your car started and check your charging system.',
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            icon: <FaKey />,
            title: 'Lockout Service',
            description: 'Locked your keys inside? Our experts can unlock your vehicle without damage.',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: <FaOilCan />,
            title: 'Fuel Delivery',
            description: 'Ran out of gas? We deliver fuel directly to your location to get you to the next station.',
            color: 'bg-orange-100 text-orange-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Comprehensive roadside assistance services designed to get you back on the road safely and quickly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className={`w - 14 h - 14 ${service.color} rounded - lg flex items - center justify - center text - 2xl mb - 6`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
