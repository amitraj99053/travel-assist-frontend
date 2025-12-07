import { create } from 'zustand';

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user && user !== 'undefined' ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getUserFromStorage(),
  token: localStorage.getItem('token'),
  isLoading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),

  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  isAuthenticated: () => {
    const state = useAuthStore.getState();
    return !!state.token && !!state.user;
  },
}));

export default useAuthStore;
