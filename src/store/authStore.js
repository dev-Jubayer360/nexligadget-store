import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import Cookies from 'js-cookie';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { data } = response.data;
          
          Cookies.set('token', data.token, { expires: 7 }); // 7 days
          localStorage.setItem('token', data.token);

          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true, user: data };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Login failed',
            loading: false,
          });
          return false;
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          const { data } = response.data;
          
          Cookies.set('token', data.token, { expires: 7 });
          localStorage.setItem('token', data.token);

          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true, user: data };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            loading: false,
          });
          return false;
        }
      },

      googleLogin: async (tokenId) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/google', { tokenId });
          const { data } = response.data;
          
          Cookies.set('token', data.token, { expires: 7 });
          localStorage.setItem('token', data.token);

          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true, user: data };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Google login failed',
            loading: false,
          });
          return { success: false };
        }
      },

      logout: () => {
        Cookies.remove('token');
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;
