"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingCart, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import useWishlistStore from '@/store/wishlistStore';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import useRecentViewStore from '@/store/recentViewStore';

export default function WishlistPage() {
  const { wishlist, loading, fetchWishlist, removeWishlistItem, clearWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { recentProducts } = useRecentViewStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [fetchWishlist, isAuthenticated]);

  const wishlistItems = wishlist?.products || [];

  const handleAddToCart = async (productId, itemInStock) => {
    if (!isAuthenticated) return alert('Please login to add to cart');
    if (!itemInStock) return;
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Added to cart!');
    }
  };

  const handleMoveAllToCart = async () => {
    if (!isAuthenticated) return alert('Please login');
    for (const item of wishlistItems) {
      if (item.stock > 0) {
        await addToCart(item._id, 1);
      }
    }
    alert('All in-stock items moved to cart!');
  };

  if (loading && !wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 gap-2 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">My Wishlist</span>
        </div>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary mb-2">MY WISHLIST</h1>
            <p className="text-gray-500">You have {wishlistItems.length} items in your wishlist</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-gray-600 hover:text-accent transition-colors flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded">
              <span className="w-4 h-4 border border-gray-400 rounded-sm"></span> Select All
            </button>
            <button onClick={handleMoveAllToCart} className="text-sm font-bold text-white hover:bg-accent-hover transition-colors flex items-center gap-2 bg-accent px-4 py-2 rounded shadow-sm">
              <ShoppingCart size={16} /> Move All to Cart
            </button>
          </div>
        </div>

        {/* Wishlist Items Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-1"></div>
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Stock Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
          {/* Items */}
          <div className="divide-y divide-gray-100">
            {wishlistItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Your wishlist is empty.</div>
            ) : (
              wishlistItems.map((item) => {
                const inStock = item.stock > 0;
                return (
                  <div key={item._id} className="p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center group hover:bg-gray-50 transition-colors">
                    <div className="col-span-1 hidden md:flex items-center justify-center">
                      <input type="checkbox" className="accent-accent w-4 h-4 rounded cursor-pointer" />
                    </div>
                    <div className="col-span-5 flex items-start gap-4 w-full">
                        {/* Mobile Checkbox */}
                        <div className="md:hidden mt-2">
                          <input type="checkbox" className="accent-accent w-4 h-4 rounded cursor-pointer" />
                        </div>
                        <div className="w-20 h-20 bg-white rounded-lg border border-gray-100 flex-shrink-0 relative overflow-hidden">
                          <Image src={(typeof item.images?.[0] === 'string' ? item.images[0] : item.images?.[0]?.url) || 'https://via.placeholder.com/150'} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{item.category?.name || 'Gadget'}</div>
                          <Link href={`/shop/${item.slug}`} className="font-bold text-sm text-gray-900 hover:text-accent line-clamp-2 mb-1">{item.name}</Link>
                        </div>
                    </div>
                    
                    <div className="col-span-2 text-center font-bold text-gray-900 w-full md:w-auto flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-normal">Price:</span>
                      {item.price} BDT
                    </div>
                    
                    <div className="col-span-2 text-center w-full md:w-auto flex justify-between md:block">
                      <span className="md:hidden text-gray-500 font-normal">Status:</span>
                      {inStock ? (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">In Stock</span>
                      ) : (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                      )}
                    </div>

                    <div className="col-span-2 flex justify-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <button 
                          onClick={() => handleAddToCart(item._id, inStock)}
                          disabled={!inStock}
                          className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors ${inStock ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          Add to Cart
                        </button>
                        <button onClick={() => removeWishlistItem(item._id)} className="text-gray-400 hover:text-red-500 p-2 border border-gray-200 rounded bg-white transition-colors">
                          <Trash2 size={18}/>
                        </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
             <Link href="/shop" className="text-sm font-bold text-primary flex items-center gap-2 hover:text-accent transition-colors w-fit">
               <ArrowLeft size={16} /> Continue Shopping
             </Link>
          </div>
        </div>

        {/* Recently Viewed */}
        {mounted && recentProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-primary mb-8 uppercase">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
