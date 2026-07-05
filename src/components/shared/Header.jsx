"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingCart, Menu, PhoneCall, Truck } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';

export default function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { wishlist, fetchWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  const accountLink = isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/login';
  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-primary text-white text-sm py-2 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-accent">
            <Truck size={16} />
            <span className="text-white hidden sm:inline">Free Delivery on orders over 1999 BDT</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span className="text-gray-300">|</span>
            <span className="text-white ml-2">7 Days Easy Returns</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-300 hidden sm:inline">Need help?</span>
          <div className="flex items-center gap-1 text-accent font-medium">
            <PhoneCall size={14} />
            <span>+880 1935-615672</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4 px-4 md:px-8 flex items-center justify-between border-b border-gray-100">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/NexliGadgetLogo.png" alt="Nexli Gadget Logo" className="h-10 sm:h-12 object-contain" />
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="flex w-full border-2 border-primary rounded-full overflow-hidden focus-within:border-accent transition-colors">
            <select className="bg-gray-50 px-4 py-2 border-r border-gray-200 text-sm outline-none text-gray-600 font-medium cursor-pointer">
              <option>All Categories</option>
              <option>Smart Gadgets</option>
              <option>Audio</option>
              <option>Charging</option>
            </select>
            <input 
              type="text" 
              placeholder="Search for gadgets, accessories..." 
              className="flex-1 px-4 py-2 outline-none text-sm"
            />
            <button className="bg-accent hover:bg-accent-hover text-white px-6 py-2 transition-colors flex items-center justify-center">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href={mounted ? accountLink : "/login"} className="flex flex-col items-center gap-1 text-gray-600 hover:text-accent transition-colors">
            <User size={24} />
            <span className="text-[10px] sm:text-xs font-medium">{mounted && isAuthenticated ? 'Dashboard' : 'Account'}</span>
          </Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-1 text-gray-600 hover:text-accent transition-colors relative">
            <div className="relative">
              <Heart size={24} />
              {mounted && isAuthenticated && wishlist?.products?.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlist.products.length}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-medium">Wishlist</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center gap-1 text-gray-600 hover:text-accent transition-colors relative">
            <div className="relative">
              <ShoppingCart size={24} />
              {mounted && isAuthenticated && cart?.items?.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cart.items.length}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-medium">Cart</span>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm hidden md:block">
        <div className="px-8 py-3 flex justify-center space-x-8 text-sm font-bold text-primary">
          <Link href="/" className="hover:text-accent transition-colors">HOME</Link>
          <div className="group relative">
            <Link href="/shop" className="text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
              SHOP
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </Link>
          </div>
          <Link href="/shop" className="hover:text-accent transition-colors">CATEGORIES</Link>
          <Link href="/shop?badge=Bestseller" className="hover:text-accent transition-colors">BEST SELLERS</Link>
          <Link href="/shop?badge=New" className="hover:text-accent transition-colors">NEW ARRIVALS</Link>
          <Link href="/shop" className="hover:text-accent transition-colors">COMBO OFFERS</Link>

          <Link href="/contact" className="hover:text-accent transition-colors">CONTACT US</Link>
        </div>
      </div>
      
      {/* Mobile Search - Visible only on mobile */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex w-full border-2 border-primary rounded-full overflow-hidden focus-within:border-accent">
          <input 
            type="text" 
            placeholder="Search..." 
            className="flex-1 px-4 py-2 outline-none text-sm"
          />
          <button className="bg-accent text-white px-4 py-2 flex items-center justify-center">
            <Search size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
