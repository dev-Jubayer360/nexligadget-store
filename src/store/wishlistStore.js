import { create } from 'zustand';
import api from '../lib/api';

const useWishlistStore = create((set, get) => ({
  wishlist: null,
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/wishlist');
      set({ wishlist: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch wishlist', loading: false });
    }
  },

  addToWishlist: async (productId) => {
    set({ loading: true, error: null });
    try {
      await api.post('/wishlist/add', { productId });
      await get().fetchWishlist();
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add to wishlist', loading: false });
      return false;
    }
  },

  removeWishlistItem: async (productId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      await get().fetchWishlist();
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to remove from wishlist', loading: false });
      return false;
    }
  },

  clearWishlist: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete('/wishlist/clear');
      set({ wishlist: null, loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to clear wishlist', loading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useWishlistStore;
