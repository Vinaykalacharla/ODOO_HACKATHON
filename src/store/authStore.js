import { create } from 'zustand';
import api from '../lib/axios';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const user = data.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true });
    try {
      await api.post('/auth/signup', { name, email, password });
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
      window.location.href = '/login';
    }
  },

  checkAuth: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      set({ user, isAuthenticated: true });
    }
  }
}));
