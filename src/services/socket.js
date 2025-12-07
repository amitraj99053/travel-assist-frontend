import io from 'socket.io-client';

let socket = null;

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const updateLocation = (data) => {
  if (socket) {
    socket.emit('update-location', data);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinTracking = (bookingId) => {
  const sock = getSocket();
  sock.emit('join-tracking', bookingId);
};

export const sendLocationUpdate = (bookingId, latitude, longitude) => {
  const sock = getSocket();
  sock.emit('location-update', { bookingId, latitude, longitude });
};

export const joinChat = (conversationId) => {
  const sock = getSocket();
  sock.emit('join-chat', conversationId);
};

export const sendMessage = (conversationId, message) => {
  const sock = getSocket();
  sock.emit('send-message', { conversationId, message });
};

export const onMechanicLocation = (callback) => {
  const sock = getSocket();
  sock.on('mechanic-location', callback);
};

export const onNewMessage = (callback) => {
  const sock = getSocket();
  sock.on('new-message', callback);
};

// New functions for real-time requests
export const joinUserRoom = (userId) => {
  const sock = getSocket();
  sock.emit('join-user-room', userId);
};

export const joinMechanicRoom = () => {
  const sock = getSocket();
  sock.emit('join-mechanic-room');
};

export const onNewRequest = (callback) => {
  const sock = getSocket();
  sock.on('new-request', callback);
};

export const onRequestAccepted = (callback) => {
  const sock = getSocket();
  sock.on('request-accepted', callback);
};

export const onRequestUnavailable = (callback) => {
  const sock = getSocket();
  sock.on('request-unavailable', callback);
};

export const onBookingUpdated = (callback) => {
  const sock = getSocket();
  sock.on('booking-updated', callback);
};

export const onBookingCompleted = (callback) => {
  const sock = getSocket();
  sock.on('booking-completed', callback);
};
