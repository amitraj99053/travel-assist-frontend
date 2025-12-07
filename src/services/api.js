const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('Current API_BASE_URL:', API_BASE_URL);

export const apiCall = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.data ? JSON.stringify(config.data) : null,
    });

    console.log(`[API] ${method} ${endpoint} - Status: ${response.status}`);
    const result = await response.json();
    console.log(`[API] Response from ${endpoint}:`, result);

    if (!response.ok) {
      throw new Error(result.message || 'API request failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  register: (data) => apiCall('POST', '/auth/register', data),
  registerMechanic: (data) => apiCall('POST', '/auth/register-mechanic', data),
  login: (data) => apiCall('POST', '/auth/login', data),
  getCurrentUser: (token) => apiCall('GET', '/auth/me', null, token),
  updateProfile: (data, token) => apiCall('PUT', '/auth/profile', data, token),
};

// Service APIs
export const serviceAPI = {
  createRequest: (data, token) => apiCall('POST', '/services', data, token),
  getNearbyRequests: (query, token) => apiCall('GET', `/services/nearby-requests?${query}`, null, token),
  getNearbyMechanics: (query, token) => apiCall('GET', `/services/nearby-mechanics?${query}`, null, token),
  getUserRequests: (token) => apiCall('GET', '/services/my-requests', null, token),
  getRequestById: (id, token) => apiCall('GET', `/services/${id}`, null, token),
  cancelRequest: (id, token) => apiCall('PUT', `/services/${id}/cancel`, null, token),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data, token) => apiCall('POST', '/bookings', data, token),
  getBookingById: (id, token) => apiCall('GET', `/bookings/${id}`, null, token),
  getUserBookings: (token) => apiCall('GET', '/bookings/my-bookings', null, token),
  processPayment: (data, token) => apiCall('POST', '/bookings/payment', data, token),
  getPaymentDetails: (id, token) => apiCall('GET', `/bookings/payment/${id}`, null, token),
  cancelBooking: (id, token) => apiCall('DELETE', `/bookings/${id}`, null, token),
  declinePayment: (id, token) => apiCall('PUT', `/bookings/${id}/decline-payment`, null, token),
};

// Mechanic APIs
export const mechanicAPI = {
  getProfile: (id, token) => apiCall('GET', `/mechanics/profile/${id}`, null, token),
  getDashboard: (token) => apiCall('GET', '/mechanics/dashboard', null, token),
  updateAvailability: (data, token) => apiCall('PUT', '/mechanics/availability', data, token),
  acceptRequest: (requestId, token) => apiCall('PUT', `/mechanics/request/${requestId}/accept`, null, token),
  getBookings: (token) => apiCall('GET', '/mechanics/bookings', null, token),
  completeBooking: (bookingId, token, data) => apiCall('PUT', `/mechanics/booking/${bookingId}/complete`, data, token),
  updateBookingStatus: (bookingId, status, token) => apiCall('PUT', `/mechanics/booking/${bookingId}/status`, { status }, token),
};

// Review APIs
export const reviewAPI = {
  submitReview: (data, token) => apiCall('POST', '/reviews', data, token),
  getMechanicReviews: (id, token) => apiCall('GET', `/reviews/mechanic/${id}`, null, token),
  getUserReviews: (token) => apiCall('GET', '/reviews/user/my-reviews', null, token),
  deleteReview: (id, token) => apiCall('DELETE', `/reviews/${id}`, null, token),
};

// SOS APIs
export const sosAPI = {
  createSOS: (data, token) => apiCall('POST', '/sos', data, token),
  getUserAlerts: (token) => apiCall('GET', '/sos/my-alerts', null, token),
  getNearbyAlerts: (query, token) => apiCall('GET', `/sos/nearby?${query}`, null, token),
  resolveSOS: (id, token) => apiCall('PUT', `/sos/${id}/resolve`, null, token),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data, token) => apiCall('POST', '/chat/message', data, token),
  getConversation: (userId, token) => apiCall('GET', `/chat/conversation/${userId}`, null, token),
  getConversations: (token) => apiCall('GET', '/chat/list', null, token),
};

// Admin APIs
export const adminAPI = {
  getDashboard: (token) => apiCall('GET', '/admin/dashboard', null, token),
  getAllUsers: (query, token) => apiCall('GET', `/admin/users?${query}`, null, token),
  getPendingMechanics: (token) => apiCall('GET', '/admin/mechanics/pending', null, token),
  verifyMechanic: (id, token) => apiCall('PUT', `/admin/mechanic/${id}/verify`, null, token),
  rejectMechanic: (id, token) => apiCall('PUT', `/admin/mechanic/${id}/reject`, null, token),
  toggleUserBlock: (id, token) => apiCall('PUT', `/admin/user/${id}/toggle-block`, null, token),
};
