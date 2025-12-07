import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { authAPI } from '../services/api';
import useAuthStore from '../context/authStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'mechanic'
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      if (response.success) {
        // Verify role matches (optional, but good for UX)
        if (role === 'mechanic' && response.data.user.role !== 'mechanic') {
          setError('This account is not registered as a mechanic.');
          setIsLoading(false);
          return;
        }

        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={role === 'mechanic' ? "Mechanic Login" : "User Login"}
      subtitle="Sign in to your account"
    >
      {/* Role Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === 'user' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => setRole('user')}
          type="button"
        >
          User
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === 'mechanic' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => setRole('mechanic')}
          type="button"
        >
          Mechanic
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-gray-600 mt-4">
        {role === 'mechanic' ? (
          <>
            New mechanic?{' '}
            <a href="/register-mechanic" className="text-blue-600 font-medium hover:underline">
              Register your shop
            </a>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 font-medium hover:underline">
              Register here
            </a>
          </>
        )}
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
