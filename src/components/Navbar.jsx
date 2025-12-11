import React from 'react';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import useAuthStore from '../context/authStore';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🚗 Travel Assist
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/about" className="text-gray-700 hover:text-blue-600">
                  About
                </Link>
                <Link to="/services" className="text-gray-700 hover:text-blue-600">
                  Services
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600">
                  Contact
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/bookings" className="text-gray-700 hover:text-blue-600">
                  Bookings
                </Link>
                {user.role === 'mechanic' && (
                  <Link to="/mechanic-dashboard" className="text-gray-700 hover:text-blue-600">
                    Mechanic Hub
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin-panel" className="text-gray-700 hover:text-blue-600">
                    Admin Panel
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FaUser />
                    </div>
                    <span className="font-medium">{user.firstName}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full capitalize">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600">
                  About
                </Link>
                <Link to="/services" className="block py-2 text-gray-700 hover:text-blue-600">
                  Services
                </Link>
                <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-600">
                  Contact
                </Link>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/bookings" className="block py-2 text-gray-700 hover:text-blue-600">
                  Bookings
                </Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600 hover:text-red-800">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-gray-700 hover:text-blue-600">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
