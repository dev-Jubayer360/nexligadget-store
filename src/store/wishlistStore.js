import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import useAuthStore from './authStore';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: { products: [] },
      loading: false,
      error: null,

      fetchWishlist: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        set({ loading: true, error: null });
        try {
          const response = await api.get('/wishlist');
          set({ wishlist: response.data.data, loading: false });
        } catch (error) {
          set({ error: error.response?.data?.message || 'Failed to fetch wishlist', loading: false });
        }
      },

      addToWishlist: async (product) => {
        const { isAuthenticated } = useAuthStore.getState();
        const productId = typeof product === 'object' ? product._id : product;

        if (!isAuthenticated) {
           set((state) => {
             const products = state.wishlist?.products || [];
             if (!products.some(p => (p._id || p) === productId)) {
               products.push(typeof product === 'object' ? product : { _id: productId });
             }
             return { wishlist: { ...state.wishlist, products } };
           });
           return true;
        }

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
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
           set((state) => {
             const products = state.wishlist?.products || [];
             const filtered = products.filter(p => (p._id || p) !== productId);
             return { wishlist: { ...state.wishlist, products: filtered } };
           });
           return true;
        }

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
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
           set({ wishlist: { products: [] }, loading: false });
           return true;
        }

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
    }),
    {
      name: 'nexligadget-wishlist-storage',
    }
  )
);

export default useWishlistStore;
