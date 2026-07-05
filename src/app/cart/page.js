"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Heart, ArrowLeft, ShieldCheck, RefreshCcw, Truck, ChevronRight, Loader2 } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

export default function CartPage() {
  const { cart, loading, fetchCart, updateCartItem, removeCartItem, clearCart } = useCartStore();
  const { wishlist, addToWishlist, fetchWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [appliedShippingCost, setAppliedShippingCost] = useState(null);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    // Fetch suggested products
    const fetchSuggested = async () => {
      try {
        const res = await api.get('/products?limit=5');
        setSuggestedProducts(res.data.data.products || []);
      } catch (err) {
        console.error('Failed to fetch suggested products', err);
      }
    };
    fetchSuggested();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
      api.get('/user/addresses')
        .then(res => {
          const fetchedAddresses = res.data.data || [];
          setAddresses(fetchedAddresses);
          const defaultAddr = fetchedAddresses.find(a => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr._id);
          else if (fetchedAddresses.length > 0) setSelectedAddressId(fetchedAddresses[0]._id);
        })
        .catch(err => console.error("Failed to fetch addresses:", err));
    }
  }, [fetchCart, fetchWishlist, isAuthenticated]);

  const handleMoveToWishlist = async (productId, variant) => {
    if (!isAuthenticated) return alert('Please login to use wishlist');
    await addToWishlist(productId);
    await removeCartItem(productId, variant);
  };

  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
  const discount = cart?.discount || 0;
  
  const handleCalculateShipping = () => {
    const selectedAddr = addresses.find(a => a._id === selectedAddressId);
    if (selectedAddr) {
      const isDhaka = selectedAddr.city?.toLowerCase().trim() === 'dhaka' || selectedAddr.city?.toLowerCase().trim() === 'dhaka city';
      setAppliedShippingCost(isDhaka ? 60 : 120);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponError('');
    const res = await useCartStore.getState().applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
    setApplyingCoupon(false);
  };
  
  const total = subtotal + (appliedShippingCost || 0) - discount;
  const earnedPoints = Math.floor(total * 0.05); // 5% of total as points

  if (loading && !cart) {
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
          <span className="text-gray-900 font-medium">Your Cart</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-primary mb-2">YOUR CART ({cartItems.length})</h1>
          <p className="text-gray-500">Review your items and proceed to checkout</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Cart Items & Extras */}
          <div className="flex-1">
            {/* Cart Items Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {/* Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Your cart is empty.</div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.productId?._id} className="p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 flex items-start gap-4 w-full">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 relative overflow-hidden">
                           <Image src={item.image || 'https://via.placeholder.com/150'} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                        </div>
                         <div className="flex-1">
                           <Link href={`/shop/${item.productId?.slug}`} className="font-bold text-sm text-gray-900 hover:text-accent line-clamp-2 mb-1">{item.name}</Link>
                           {item.variant && <div className="text-xs text-gray-500 mb-1">Variant: {item.variant}</div>}
                           <div className={`text-xs font-medium ${item.productId?.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                             {item.productId?.stock > 0 ? 'In Stock' : 'Out of Stock'}
                           </div>
                         </div>
                      </div>
                      
                      <div className="col-span-2 text-center font-bold text-gray-900 w-full md:w-auto flex justify-between md:block">
                        <span className="md:hidden text-gray-500 font-normal">Price:</span>
                        {item.price} BDT
                      </div>
                    
                      <div className="col-span-2 flex justify-center w-full md:w-auto">
                        <div className="flex items-center border border-gray-200 rounded h-10 w-28 bg-gray-50">
                          <button onClick={() => updateCartItem(item.productId?._id, Math.max(1, item.quantity - 1), item.variant)} className="px-3 text-gray-500 hover:text-primary font-bold">-</button>
                          <input type="text" value={item.quantity} readOnly className="w-full text-center bg-transparent font-bold outline-none text-sm" />
                          <button onClick={() => updateCartItem(item.productId?._id, Math.min(item.productId?.stock, item.quantity + 1), item.variant)} className="px-3 text-gray-500 hover:text-primary font-bold">+</button>
                        </div>
                      </div>

                      <div className="col-span-2 flex justify-between items-center md:justify-end w-full md:w-auto">
                         <span className="md:hidden text-gray-500 font-normal">Total:</span>
                         <span className="font-black text-gray-900">{item.price * item.quantity} BDT</span>
                         <div className="flex flex-col gap-2 ml-4 md:ml-0 md:absolute md:-right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                         </div>
                      </div>
                      
                      {/* Mobile/Tablet Actions */}
                      <div className="w-full flex justify-end gap-3 mt-2 md:col-span-12 md:justify-end">
                         <button 
                           onClick={() => handleMoveToWishlist(item.productId?._id, item.variant)}
                           className={`p-1.5 rounded-full border border-gray-200 transition-colors ${
                             mounted && wishlist?.products?.some(wItem => wItem._id === item.productId?._id || wItem === item.productId?._id) 
                               ? 'text-accent border-accent bg-accent/5' 
                               : 'text-gray-400 hover:text-accent'
                           }`}
                         >
                           <Heart size={16} fill={mounted && wishlist?.products?.some(wItem => wItem._id === item.productId?._id || wItem === item.productId?._id) ? "currentColor" : "none"}/>
                         </button>
                         <button onClick={() => removeCartItem(item.productId?._id, item.variant)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-full border border-gray-200"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                 <Link href="/shop" className="text-sm font-bold text-primary flex items-center gap-2 hover:text-accent transition-colors">
                   <ArrowLeft size={16} /> Continue Shopping
                 </Link>
                 <button onClick={() => clearCart()} className="text-sm font-bold text-red-500 flex items-center gap-2 hover:text-red-700 transition-colors">
                   <Trash2 size={16} /> Clear Cart
                 </button>
              </div>
            </div>

            {/* Coupons and Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                 <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                   <span className="text-accent">🎟️</span> HAVE A COUPON?
                 </h3>
                 <p className="text-xs text-gray-500 mb-4">Enter your coupon code if you have one.</p>
                 <div className="flex">
                   <input 
                     type="text" 
                     value={couponCode}
                     onChange={(e) => setCouponCode(e.target.value)}
                     placeholder="Enter coupon code" 
                     className="flex-1 border border-gray-200 rounded-l px-4 py-2 outline-none focus:border-accent text-sm uppercase" 
                   />
                   <button 
                     onClick={handleApplyCoupon}
                     disabled={applyingCoupon || !couponCode}
                     className="bg-accent text-white font-bold px-6 py-2 rounded-r hover:bg-accent-hover transition-colors text-sm flex items-center gap-2 disabled:opacity-70"
                   >
                     {applyingCoupon ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                   </button>
                 </div>
                 {couponError && <div className="text-xs text-red-500 mt-2">{couponError}</div>}
                 
                 {discount > 0 && (
                   <div className="mt-4 flex items-center justify-between border border-green-200 bg-green-50 rounded px-4 py-2">
                     <span className="text-sm font-bold text-green-700 flex items-center gap-2">Coupon Applied!</span>
                     <span className="text-xs font-bold text-green-600">You saved {discount} BDT!</span>
                   </div>
                 )}
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                 <div>
                   <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                     <span className="text-accent">🚚</span> SHIPPING ADDRESS
                   </h3>
                   <p className="text-xs text-gray-500 mb-4">Select where you want your items delivered.</p>
                   
                   {!isAuthenticated ? (
                     <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded">Please <Link href="/login" className="text-accent hover:underline font-bold">login</Link> to view your saved addresses.</div>
                   ) : addresses.length === 0 ? (
                     <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded">No saved addresses found. <Link href="/dashboard" className="text-accent hover:underline font-bold">Add one</Link> in your dashboard.</div>
                   ) : (
                     <div className="space-y-3">
                       <select 
                         value={selectedAddressId} 
                         onChange={(e) => setSelectedAddressId(e.target.value)}
                         className="w-full border border-gray-200 rounded px-4 py-2 text-sm outline-none focus:border-accent text-gray-600 cursor-pointer"
                       >
                         {addresses.map(addr => (
                           <option key={addr._id} value={addr._id}>
                             {addr.fullName} - {addr.city}, {addr.division} {addr.isDefault ? '(Default)' : ''}
                           </option>
                         ))}
                       </select>
                       
                       {selectedAddressId && addresses.find(a => a._id === selectedAddressId) && (
                         <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 border border-gray-100">
                           {(() => {
                             const addr = addresses.find(a => a._id === selectedAddressId);
                             return (
                               <>
                                 <div className="font-bold text-gray-900 mb-1">
                                   {addr.fullName} <span className="font-normal text-gray-500 ml-2">{addr.phone}</span>
                                   <span className="ml-2 inline-block bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded">{addr.addressType || 'Home'}</span>
                                 </div>
                                 <div>{addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}</div>
                                 <div>{addr.city}, {addr.division}</div>
                               </>
                             );
                           })()}
                         </div>
                       )}
                     </div>
                   )}
                 </div>
                 
                 {isAuthenticated && addresses.length > 0 && (
                   <button onClick={handleCalculateShipping} className="w-full mt-4 bg-accent text-white font-bold py-2.5 rounded hover:bg-accent-hover transition-colors text-sm">Calculate Shipping</button>
                 )}
              </div>
            </div>



          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 uppercase tracking-wider">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold text-gray-900">{subtotal} BDT</span>
                </div>
                <div className="flex justify-between items-start">
                  <div className="text-gray-600">
                    Shipping
                    {appliedShippingCost !== null ? (
                      <div className="text-[10px] text-gray-400 mt-1">Calculated for selected address</div>
                    ) : (
                      <div className="text-[10px] text-gray-400 mt-1">Select an address and click Calculate Shipping</div>
                    )}
                  </div>
                  <span className="font-bold text-gray-900">{appliedShippingCost !== null ? `${appliedShippingCost} BDT` : '—'}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-start">
                    <div className="text-green-600 font-bold">
                      Discount
                      <div className="text-[10px] text-gray-400 font-normal mt-1 text-green-500">Promo code applied</div>
                    </div>
                    <span className="font-bold text-green-600">-{discount} BDT</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-gray-900 text-lg">TOTAL</span>
                  <span className="font-black text-accent text-xl">{total} BDT</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-[#E2136E] hover:bg-[#d01060] text-white font-bold py-3.5 rounded transition-colors shadow-sm">
                  Checkout with <span className="font-black tracking-widest text-lg ml-1" style={{fontFamily: "Arial"}}>bKash</span>
                </Link>
              </div>

              <div className="space-y-4 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-800">100% Secure Payment</span>
                    <p className="text-gray-500">Your payment is safe with us</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCcw size={18} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-800">7 Days Easy Returns</span>
                    <p className="text-gray-500">Hassle-free return policy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck size={18} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-800">Cash on Delivery</span>
                    <p className="text-gray-500">Pay when you receive</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        {/* You May Also Like */}
        {suggestedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-primary mb-8 text-center uppercase">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {suggestedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
