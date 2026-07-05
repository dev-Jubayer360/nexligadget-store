"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import useAuthStore from '@/store/authStore';

export default React.memo(function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { wishlist, addToWishlist, removeWishlistItem } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Support both mock data and MongoDB document structures
  const p = product || {};
  
  const id = p._id || p.id || '1';
  const name = p.name || 'Unknown Product';
  const slug = p.slug || 'product';
  const price = p.price || 0;
  const oldPrice = p.oldPrice;
  const rating = p.averageRating !== undefined ? p.averageRating : (p.rating || 0);
  const reviews = p.reviewsCount !== undefined ? p.reviewsCount : (p.numReviews !== undefined ? p.numReviews : (p.reviews || 0));
  
  // Handle image: MongoDB uses images array, mocks use image string. Handle null values.
  const image = (p.images && p.images.length > 0 && p.images[0] !== null) 
    ? p.images[0] 
    : (p.image || 'https://via.placeholder.com/300?text=No+Image');
    
  const badge = p.badge;
  const inStock = p.stock !== undefined ? p.stock > 0 : (p.inStock !== undefined ? p.inStock : true);

  const discountPercentage = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const inWishlist = mounted && wishlist?.products?.some(item => item._id === id || item === id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return alert('Please login to use wishlist');
    setIsWishlisting(true);
    if (inWishlist) {
      await removeWishlistItem(id);
    } else {
      await addToWishlist(id);
    }
    setIsWishlisting(false);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return alert('Please login to add to cart');
    setIsAddingToCart(true);
    await addToCart(id, 1);
    setIsAddingToCart(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col group hover:shadow-md transition-shadow relative">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {badge && badge !== 'None' && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ${badge === 'New' || badge === 'NEW' ? 'bg-blue-500' : badge === 'Bestseller' || badge === 'BESTSELLER' ? 'bg-primary' : 'bg-accent'}`}>
            {badge}
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-500 text-white">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistClick}
        disabled={isWishlisting}
        className={`absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors ${inWishlist ? 'text-accent' : 'text-gray-400 hover:text-accent'}`}
      >
        {isWishlisting ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />}
      </button>

      {/* Image */}
      <Link href={`/shop/${slug}`} className="relative h-48 w-full mb-4 flex items-center justify-center overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={image} 
          alt={name} 
          loading="lazy"
          decoding="async"
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <Link href={`/shop/${slug}`}>
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-accent transition-colors mb-2">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2 text-xs">
          <div className="flex items-center text-yellow-400">
            <Star size={12} fill="currentColor" />
            <span className="text-gray-600 font-medium ml-1">{rating}</span>
          </div>
          <span className="text-gray-400">({reviews})</span>
          <span className="text-gray-300">|</span>
          {inStock ? (
            <span className="text-green-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> In Stock
            </span>
          ) : (
            <span className="text-red-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Out of Stock
            </span>
          )}
        </div>

        <div className="flex items-end gap-2 mb-4">
          <span className="font-bold text-gray-900">{price} BDT</span>
          {oldPrice && (
            <span className="text-xs text-gray-400 line-through mb-0.5">{oldPrice} BDT</span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2">
          <button 
            disabled={!inStock || isAddingToCart}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded font-medium text-sm transition-colors ${
              inStock 
                ? 'bg-accent text-white hover:bg-accent-hover' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAddingToCart ? <Loader2 size={16} className="animate-spin" /> : 'Add to Cart'}
          </button>
          <Link href={`/shop/${slug}`} className="p-2 rounded border border-gray-200 text-gray-600 hover:text-primary hover:border-primary transition-colors">
            <ShoppingCart size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
});
