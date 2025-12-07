import React from 'react';
import { FaShieldAlt, FaClock, FaMapMarkedAlt, FaHandshake, FaAward } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
                        Driving the Future of <span className="text-blue-300">Roadside Assistance</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10">
                        We connect stranded travelers with trusted mechanics instantly. No memberships, no waiting on hold—just help when you need it most.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
                            Join Now
                        </Link>
                        <Link to="/services" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                            Explore Services
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-blue-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="p-4">
                            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                            <div className="text-gray-600 font-medium">Verified Mechanics</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
                            <div className="text-gray-600 font-medium">Happy Travelers</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-blue-600 mb-2">15m</div>
                            <div className="text-gray-600 font-medium">Avg. Arrival Time</div>
                        </div>
                        <div className="p-4">
                            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                            <div className="text-gray-600 font-medium">Support Available</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Story & Mission */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-50 rounded-full opacity-50"></div>
                            <img
                                src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Mechanic working"
                                className="relative rounded-2xl shadow-2xl z-10 w-full object-cover h-[400px]"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2">Our Story</h2>
                        <h3 className="text-4xl font-bold text-gray-900 mb-6">Revolutionizing How You Get Help on the Road</h3>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            Founded in 2024, Travel Assist Portal was born from a simple frustration: getting stuck on the highway with no one to call. We realized that while everything else is on-demand, roadside assistance was stuck in the past.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Today, we are building the largest network of independent mechanics and towing services, empowering them with technology to reach customers faster and more efficiently than ever before.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <FaHandshake className="text-blue-500 text-2xl" />
                                <span className="font-medium text-gray-800">Trusted Partnerships</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaAward className="text-blue-500 text-2xl" />
                                <span className="font-medium text-gray-800">Quality Guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We are not just another directory. We are a technology-first platform committed to your safety and convenience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                <FaClock />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our algorithm matches you with the nearest available mechanic instantly. No call centers, no long wait times.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                <FaMapMarkedAlt />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Tracking</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Watch your help arrive in real-time on the map. Share your location with family for added peace of mind.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                <FaShieldAlt />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Safe</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Every mechanic is vetted. Payments are secure. We prioritize your safety above all else.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-900 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">Ready to hit the road with confidence?</h2>
                    <p className="text-xl text-blue-200 mb-10">
                        Join thousands of users who trust Travel Assist Portal for their roadside safety.
                    </p>
                    <Link to="/register" className="inline-block bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-transform transform hover:scale-105 shadow-xl">
                        Get Started Today
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
