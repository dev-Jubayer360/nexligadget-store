import { create } from 'zustand';
import api from '../lib/api';

const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/cart');
      set({ cart: response.data.data, loading: false });
    } catch (error) {
      // If unauthorized, it just means user isn't logged in, which is fine to ignore or handle silently
      set({ error: error.response?.data?.message || 'Failed to fetch cart', loading: false });
    }
  },

  addToCart: async (productId, quantity = 1, variant = '') => {
    set({ loading: true, error: null });
    try {
      await api.post('/cart/add', { productId, quantity, variant });
      await get().fetchCart();
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add to cart', loading: false });
      return false;
    }
  },

  updateCartItem: async (productId, quantity, variant = '') => {
    set({ loading: true, error: null });
    try {
      await api.patch('/cart/update', { productId, quantity, variant });
      await get().fetchCart();
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update cart', loading: false });
      return false;
    }
  },

  removeCartItem: async (productId, variant = '') => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/cart/remove/${productId}${variant ? `?variant=${variant}` : ''}`);
      await get().fetchCart();
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to remove item', loading: false });
      return false;
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete('/cart/clear');
      set({ cart: null, loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to clear cart', loading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  applyCoupon: async (code) => {
    set({ loading: true, error: null });
    try {
      await api.post('/coupons/apply', { code });
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to apply coupon', loading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to apply coupon' };
    }
  },
}));

export default useCartStore;
