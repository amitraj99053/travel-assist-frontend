import React from 'react';
import { Link } from 'react-router-dom';
import { FaTools, FaMapMarkedAlt, FaShieldAlt, FaClock } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Expert Mechanic Help, <br className="hidden md:block" />
              <span className="text-blue-400">Right Where You Are</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Stranded on the road? Need urgent repairs? Travel Assist connects you with qualified mechanics in your vicinity instantly. Fast, reliable, and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-blue-900 bg-white hover:bg-gray-100 transition duration-300 shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="inline-flex justify-center items-center px-8 py-4 border-2 border-white text-lg font-bold rounded-full text-white hover:bg-white hover:text-blue-900 transition duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 -mb-20 w-72 h-72 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
      </div>

      {/* Stats Section */}
      <div className="bg-white shadow-md relative z-10 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <h3 className="text-4xl font-bold text-blue-600 mb-2">24/7</h3>
          <p className="text-gray-600 font-medium">Emergency Assistance</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-blue-600 mb-2">500+</h3>
          <p className="text-gray-600 font-medium">Verified Mechanics</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-blue-600 mb-2">15m</h3>
          <p className="text-gray-600 font-medium">Average Response Time</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Travel Assist?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide the most reliable roadside assistance platform, designed to get you back on the road safely and quickly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<FaMapMarkedAlt className="w-8 h-8" />}
              title="Real-time Tracking"
              description="Track your mechanic's location in real-time as they approach your location."
            />
            <FeatureCard 
              icon={<FaTools className="w-8 h-8" />}
              title="Expert Mechanics"
              description="All mechanics are strictly vetted and verified to ensure high-quality service."
            />
            <FeatureCard 
              icon={<FaClock className="w-8 h-8" />}
              title="Fast Response"
              description="Our smart matching algorithm connects you with the nearest available help instantly."
            />
            <FeatureCard 
              icon={<FaShieldAlt className="w-8 h-8" />}
              title="Secure Payments"
              description="Transparent pricing and secure payment options for complete peace of mind."
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Getting help relies on a simple, efficient process.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 -z-0"></div>

            <StepCard 
              number="1"
              title="Request Help"
              description="Share your location and vehicle issue through our easy-to-use app."
            />
            <StepCard 
              number="2"
              title="Get Matched"
              description="We automatically find the nearest available mechanic for your specific problem."
            />
            <StepCard 
              number="3"
              title="Get Moving"
              description="The mechanic arrives, fixes the issue, and you are back on the road!"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Drive with Confidence?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of users who trust Travel Assist for their roadside safety.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-blue-600 bg-white hover:bg-gray-100 transition duration-300"
            >
              Sign Up Now
            </Link>
            <Link
              to="/register-mechanic"
              className="inline-flex justify-center items-center px-8 py-4 border border-white text-lg font-bold rounded-md text-white hover:bg-blue-700 transition duration-300"
            >
              Join as Mechanic
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer is handled by main App layout or can be added here if needed, usually separate component */}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 mx-auto md:mx-0">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="bg-white p-6 relative z-10 text-center">
    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 mx-auto border-4 border-white shadow-lg">
      {number}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;
