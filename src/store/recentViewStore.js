import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_RECENT = 5;

const useRecentViewStore = create(
  persist(
    (set) => ({
      recentProducts: [],
      
      addRecentProduct: (product) => set((state) => {
        if (!product || !product._id) return state;
        
        // Remove the product if it already exists to move it to the front
        const filtered = state.recentProducts.filter(p => p._id !== product._id);
        
        // Add to front and limit to MAX_RECENT
        const newProducts = [product, ...filtered].slice(0, MAX_RECENT);
        
        return { recentProducts: newProducts };
      }),
      
      clearRecentProducts: () => set({ recentProducts: [] })
    }),
    {
      name: 'nexligadget-recent-views',
    }
  )
);

export default useRecentViewStore;
