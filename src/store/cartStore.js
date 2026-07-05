import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import useAuthStore from './authStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: { items: [], total: 0 },
      loading: false,
      error: null,

      fetchCart: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return; // Keep local cart

        set({ loading: true, error: null });
        try {
          const response = await api.get('/cart');
          set({ cart: response.data.data, loading: false });
        } catch (error) {
          // If unauthorized, it just means user isn't logged in, which is fine to ignore or handle silently
          set({ error: error.response?.data?.message || 'Failed to fetch cart', loading: false });
        }
      },

      addToCart: async (product, quantity = 1, variant = '') => {
        const { isAuthenticated } = useAuthStore.getState();
        const productId = typeof product === 'object' ? product._id : product;

        if (!isAuthenticated) {
           // Local Cart Logic
           set((state) => {
             const items = state.cart?.items || [];
             const existingItemIndex = items.findIndex(item => (item.productId?._id === productId || item.productId === productId) && item.variant === variant);
             
             let newItems = [...items];
             if (existingItemIndex >= 0) {
               newItems[existingItemIndex].quantity += quantity;
             } else {
               const image = typeof product === 'object' ? (product.images?.[0]?.url || product.images?.[0] || product.image) : '';
               const name = typeof product === 'object' ? product.name : 'Unknown Product';
               const price = typeof product === 'object' ? product.price : 0;
               
               newItems.push({
                 productId: typeof product === 'object' ? product : { _id: productId },
                 quantity,
                 variant,
                 image,
                 name,
                 price
               });
             }
             return { cart: { ...state.cart, items: newItems } };
           });
           return true;
        }

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
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
           set((state) => {
             const items = state.cart?.items || [];
             const newItems = items.map(item => {
               const id = item.productId?._id || item.productId;
               if (id === productId && item.variant === variant) {
                 return { ...item, quantity };
               }
               return item;
             });
             return { cart: { ...state.cart, items: newItems } };
           });
           return true;
        }

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
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
           set((state) => {
             const items = state.cart?.items || [];
             const newItems = items.filter(item => {
               const id = item.productId?._id || item.productId;
               return !(id === productId && item.variant === variant);
             });
             return { cart: { ...state.cart, items: newItems } };
           });
           return true;
        }

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
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
           set({ cart: { items: [] }, loading: false });
           return true;
        }

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
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return { success: false, message: 'Please login to apply coupon' };
        
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
    }),
    {
      name: 'nexligadget-cart-storage',
    }
  )
);

export default useCartStore;
