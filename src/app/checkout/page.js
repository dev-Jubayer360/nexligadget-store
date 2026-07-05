"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, Lock, PhoneCall, ChevronRight, Edit2, CheckCircle2, Loader2, Copy, ClipboardPaste, X } from 'lucide-react';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

const bdCities = [
  { city: 'Dhaka', division: 'Dhaka' },
  { city: 'Faridpur', division: 'Dhaka' },
  { city: 'Gazipur', division: 'Dhaka' },
  { city: 'Gopalganj', division: 'Dhaka' },
  { city: 'Kishoreganj', division: 'Dhaka' },
  { city: 'Madaripur', division: 'Dhaka' },
  { city: 'Manikganj', division: 'Dhaka' },
  { city: 'Munshiganj', division: 'Dhaka' },
  { city: 'Narayanganj', division: 'Dhaka' },
  { city: 'Narsingdi', division: 'Dhaka' },
  { city: 'Rajbari', division: 'Dhaka' },
  { city: 'Shariatpur', division: 'Dhaka' },
  { city: 'Tangail', division: 'Dhaka' },
  { city: 'Bogra', division: 'Rajshahi' },
  { city: 'Joypurhat', division: 'Rajshahi' },
  { city: 'Naogaon', division: 'Rajshahi' },
  { city: 'Natore', division: 'Rajshahi' },
  { city: 'Nawabganj', division: 'Rajshahi' },
  { city: 'Pabna', division: 'Rajshahi' },
  { city: 'Rajshahi', division: 'Rajshahi' },
  { city: 'Sirajganj', division: 'Rajshahi' },
  { city: 'Dinajpur', division: 'Rangpur' },
  { city: 'Gaibandha', division: 'Rangpur' },
  { city: 'Kurigram', division: 'Rangpur' },
  { city: 'Lalmonirhat', division: 'Rangpur' },
  { city: 'Nilphamari', division: 'Rangpur' },
  { city: 'Panchagarh', division: 'Rangpur' },
  { city: 'Rangpur', division: 'Rangpur' },
  { city: 'Thakurgaon', division: 'Rangpur' },
  { city: 'Barguna', division: 'Barisal' },
  { city: 'Barisal', division: 'Barisal' },
  { city: 'Bhola', division: 'Barisal' },
  { city: 'Jhalokati', division: 'Barisal' },
  { city: 'Patuakhali', division: 'Barisal' },
  { city: 'Pirojpur', division: 'Barisal' },
  { city: 'Bandarban', division: 'Chittagong' },
  { city: 'Brahmanbaria', division: 'Chittagong' },
  { city: 'Chandpur', division: 'Chittagong' },
  { city: 'Chittagong', division: 'Chittagong' },
  { city: 'Comilla', division: 'Chittagong' },
  { city: 'Cox\'s Bazar', division: 'Chittagong' },
  { city: 'Feni', division: 'Chittagong' },
  { city: 'Khagrachhari', division: 'Chittagong' },
  { city: 'Lakshmipur', division: 'Chittagong' },
  { city: 'Noakhali', division: 'Chittagong' },
  { city: 'Rangamati', division: 'Chittagong' },
  { city: 'Habiganj', division: 'Sylhet' },
  { city: 'Moulvibazar', division: 'Sylhet' },
  { city: 'Sunamganj', division: 'Sylhet' },
  { city: 'Sylhet', division: 'Sylhet' },
  { city: 'Bagerhat', division: 'Khulna' },
  { city: 'Chuadanga', division: 'Khulna' },
  { city: 'Jessore', division: 'Khulna' },
  { city: 'Jhenaidah', division: 'Khulna' },
  { city: 'Khulna', division: 'Khulna' },
  { city: 'Kushtia', division: 'Khulna' },
  { city: 'Magura', division: 'Khulna' },
  { city: 'Meherpur', division: 'Khulna' },
  { city: 'Narail', division: 'Khulna' },
  { city: 'Satkhira', division: 'Khulna' },
  { city: 'Jamalpur', division: 'Mymensingh' },
  { city: 'Mymensingh', division: 'Mymensingh' },
  { city: 'Netrokona', division: 'Mymensingh' },
  { city: 'Sherpur', division: 'Mymensingh' }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, fetchCart, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    address: '',
    addressLine2: '',
    city: '',
    division: '',
    addressType: 'Home',
    country: 'Bangladesh',
    paymentMethod: 'bKash_Partial'
  });
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // bKash Modal State
  const [showBkashModal, setShowBkashModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const bkashNumber = "01934341707";

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasteTrx = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTransactionId(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  useEffect(() => {
    fetchCart();
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        fullName: user.name || '',
      }));
      
      api.get('/user/addresses')
        .then(res => {
          const fetchedAddresses = res.data.data || [];
          setAddresses(fetchedAddresses);
          const defaultAddr = fetchedAddresses.find(a => a.isDefault);
          if (defaultAddr) handleAddressSelect(defaultAddr._id, fetchedAddresses);
          else if (fetchedAddresses.length > 0) handleAddressSelect(fetchedAddresses[0]._id, fetchedAddresses);
        })
        .catch(err => console.error("Failed to fetch addresses:", err));
    } else {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCart, user, router]);

  function handleAddressSelect(addrId, addrList = addresses) {
    setSelectedAddressId(addrId);
    if (addrId === 'new') {
      setFormData(prev => ({ ...prev, address: '', addressLine2: '', city: '', division: '', addressType: 'Home' }));
      return;
    }
    const addr = addrList.find(a => a._id === addrId);
    if (addr) {
      setFormData(prev => ({
        ...prev,
        fullName: addr.fullName || prev.fullName,
        phone: addr.phone || prev.phone,
        address: addr.addressLine1 || '',
        addressLine2: addr.addressLine2 || '',
        city: addr.city || '',
        division: addr.division || '',
        addressType: addr.addressType || 'Home',
      }));
    }
  };

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
  
  let deliveryCharge = 120;
  if (formData.city) {
    const isDhaka = formData.city.toLowerCase().trim() === 'dhaka' || formData.city.toLowerCase().trim() === 'dhaka city';
    deliveryCharge = isDhaka ? 60 : 120;
  }
  
  const discount = 0;
  const total = subtotal + deliveryCharge - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-update division when city is selected
    if (name === 'city') {
      const matchedCity = bdCities.find(c => c.city.toLowerCase() === value.toLowerCase());
      if (matchedCity) {
        setFormData({ ...formData, city: value, division: matchedCity.division });
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleProceedToPayment = () => {
    setError('');
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.division) {
      return setError('Please fill all required shipping fields');
    }
    if (cartItems.length === 0) return setError('Your cart is empty');
    
    // Open bKash modal
    setShowBkashModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!transactionId.trim()) {
      return alert('Please enter your bKash Transaction ID');
    }

    setLoading(true);
    try {
      const orderData = {
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.address,
          addressLine2: formData.addressLine2,
          city: formData.city,
          division: formData.division,
          addressType: formData.addressType,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        transactionId: transactionId.trim()
      };

      await api.post('/orders', orderData);
      await clearCart();
      setShowBkashModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      
      {/* Checkout Progress Header */}
      <div className="bg-white border-b border-gray-100 py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black text-primary mb-2 text-center uppercase tracking-tight">Checkout</h1>
          <p className="text-gray-500 text-center text-sm mb-8">Complete your order in just a few simple steps.</p>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-0.5 bg-accent -z-10"></div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent text-white font-bold flex items-center justify-center shadow-sm">1</div>
              <span className="text-xs font-bold text-accent">Customer Info</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold flex items-center justify-center">2</div>
              <span className="text-xs font-bold text-gray-400">Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold flex items-center justify-center">3</div>
              <span className="text-xs font-bold text-gray-400">Payment</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 font-bold flex items-center justify-center">4</div>
              <span className="text-xs font-bold text-gray-400">Review & Place Order</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Forms */}
        <div className="flex-1 space-y-6">
          
          {/* 1. Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-primary text-white text-sm flex items-center justify-center">1</span>
                  CONTACT INFORMATION
                </h2>
                <div className="text-sm text-gray-500">
                  {!user && (
                    <span>Already have an account? <Link href="/login" className="text-accent hover:underline font-bold">Log in</Link></span>
                  )}
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john.doe@example.com" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+880 1712-345678" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm transition-colors" />
                </div>
             </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                 <span className="w-6 h-6 rounded bg-primary text-white text-sm flex items-center justify-center">2</span>
                 SHIPPING ADDRESS
               </h2>
               {user && addresses.length > 0 && (
                 <select 
                   value={selectedAddressId}
                   onChange={(e) => handleAddressSelect(e.target.value)}
                   className="border border-gray-200 rounded px-3 py-1.5 outline-none focus:border-accent text-sm text-gray-600 font-medium"
                 >
                   <option value="new">+ Enter New Address</option>
                   {addresses.map(addr => (
                     <option key={addr._id} value={addr._id}>
                       {addr.city}, {addr.division} {addr.isDefault ? '(Default)' : ''}
                     </option>
                   ))}
                 </select>
               )}
             </div>
             
             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Address Line 1 <span className="text-red-500">*</span></label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="House 12, Road 5, Dhanmondi" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Apartment, suite, unit etc." className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm transition-colors" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">City / Area <span className="text-red-500">*</span></label>
                    <input 
                      list="bd-cities-checkout"
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      placeholder="Dhaka" 
                      autoComplete="off"
                      className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm transition-colors" 
                    />
                    <datalist id="bd-cities-checkout">
                      {bdCities.map(c => (
                        <option key={c.city} value={c.city} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">State / Division <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="division" 
                      value={formData.division} 
                      onChange={handleInputChange} 
                      readOnly 
                      placeholder="Dhaka"
                      className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm transition-colors bg-gray-50 text-gray-500 cursor-not-allowed" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Address Type <span className="text-red-500">*</span></label>
                    <select name="addressType" value={formData.addressType} onChange={handleInputChange} className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm transition-colors text-gray-600 bg-white">
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                  <select className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm transition-colors text-gray-600 bg-white">
                    <option>Bangladesh</option>
                  </select>
                </div>
             </div>
             <div className="mt-4 flex items-center gap-2">
               <input type="checkbox" id="save-addr" className="accent-accent w-4 h-4 rounded" defaultChecked />
               <label htmlFor="save-addr" className="text-sm text-gray-600 cursor-pointer">Save this address for next time</label>
             </div>
          </div>

          {/* 3. Delivery Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
               <span className="w-6 h-6 rounded bg-primary text-white text-sm flex items-center justify-center">3</span>
               DELIVERY OPTIONS
             </h2>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="border-2 border-accent rounded-lg p-4 cursor-pointer relative bg-orange-50/30 transition-all">
                  <div className="absolute top-4 left-4">
                     <input type="radio" name="delivery" defaultChecked className="accent-accent w-4 h-4" />
                  </div>
                  <div className="text-center mt-2">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-accent mx-auto mb-2"><Truck size={20} /></div>
                    <div className="font-bold text-gray-900 text-sm">Standard Delivery</div>
                    <div className="text-xs text-gray-500 mb-2">2-3 Business Days</div>
                    <div className="font-bold text-accent">{deliveryCharge} BDT</div>
                  </div>
                </label>
             </div>
          </div>

          {/* 4. Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
               <span className="w-6 h-6 rounded bg-primary text-white text-sm flex items-center justify-center">4</span>
               PAYMENT METHOD (bKash)
             </h2>
             
             <div className="space-y-3">
                <label className={`flex items-center gap-4 border ${formData.paymentMethod === 'bKash_Partial' ? 'border-accent bg-orange-50/30' : 'border-gray-200 hover:border-accent'} rounded-lg p-4 cursor-pointer transition-colors`}>
                  <input type="radio" name="paymentMethod" value="bKash_Partial" checked={formData.paymentMethod === 'bKash_Partial'} onChange={handleInputChange} className="accent-accent w-4 h-4" />
                  <div className="text-[#E2136E] font-black text-xl italic" style={{fontFamily:"Arial"}}>bKash</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">Partial Payment <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Recommended</span></div>
                    <div className="text-xs text-gray-500 mt-0.5">Pay 200 BDT now, remaining balance on delivery</div>
                  </div>
                </label>
                
                <label className={`flex items-center gap-4 border ${formData.paymentMethod === 'bKash_Full' ? 'border-accent bg-orange-50/30' : 'border-gray-200 hover:border-accent'} rounded-lg p-4 cursor-pointer transition-colors`}>
                  <input type="radio" name="paymentMethod" value="bKash_Full" checked={formData.paymentMethod === 'bKash_Full'} onChange={handleInputChange} className="accent-accent w-4 h-4" />
                  <div className="text-[#E2136E] font-black text-xl italic" style={{fontFamily:"Arial"}}>bKash</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900">Full Payment</div>
                    <div className="text-xs text-gray-500 mt-0.5">Pay the complete amount securely now</div>
                  </div>
                </label>
             </div>
             
             <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-6">
                <Lock size={14} className="text-gray-400" /> Your payment information is secure and encrypted
             </div>
          </div>
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="sticky top-6 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-end mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 uppercase tracking-wider">Order Summary <span className="text-gray-500 normal-case font-normal text-sm">({cartItems.length} items)</span></h3>
                <Link href="/cart" className="text-accent text-xs font-bold hover:underline">Edit Cart</Link>
              </div>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.productId?._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</div>
                      <div className="text-xs text-gray-500">Variant: {item.variant} | Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold text-sm text-gray-900 py-0.5 text-right whitespace-nowrap">{item.price} BDT</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold text-gray-900">{subtotal} BDT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="font-bold text-gray-900">{deliveryCharge} BDT</span>
                </div>
                <div className="flex justify-between items-center text-green-600 font-bold">
                  <span>Discount</span>
                  <span>-{discount} BDT</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6 bg-gray-50 -mx-6 px-6 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-gray-900 text-lg">Total</span>
                  <span className="font-black text-accent text-xl">{total} BDT</span>
                </div>
                {total > 0 && formData.paymentMethod === 'bKash_Partial' && (
                  <div className="mt-4 space-y-2 border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-900">Pay Now (bKash)</span>
                      <span className="font-black text-[#E2136E]">200 BDT</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Due on Delivery (Cash)</span>
                      <span className="font-bold text-gray-900">{total - 200} BDT</span>
                    </div>
                  </div>
                )}
                {total > 0 && formData.paymentMethod === 'bKash_Full' && (
                  <div className="mt-4 space-y-2 border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-900">Pay Now (bKash)</span>
                      <span className="font-black text-[#E2136E]">{total} BDT</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Due on Delivery</span>
                      <span className="font-bold text-gray-900">0 BDT</span>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded text-sm text-center">
                  {error}
                </div>
              )}

              <button onClick={handleProceedToPayment} className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded flex items-center justify-center gap-2 transition-colors shadow-md text-lg">
                PROCEED TO PAYMENT
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">You will be able to securely enter your payment details in the next step.</p>
            </div>

            {/* Need Help Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-2">NEED HELP?</h3>
              <p className="text-xs text-gray-500 mb-4">Our customer support team is here to help you 24/7</p>
              <div className="space-y-3 text-sm font-medium text-gray-700">
                <div className="flex items-center gap-3">
                  <PhoneCall size={16} className="text-accent" /> +880 1935-615672
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-accent" /> nexligadget@gmail.com
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>

      {/* bKash Payment Modal */}
      {showBkashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#E2136E] p-6 relative text-center">
              <button 
                onClick={() => setShowBkashModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="text-white font-black text-3xl italic tracking-wider mb-1" style={{fontFamily:"Arial"}}>bKash</div>
              <p className="text-white/90 text-sm font-medium">
                {formData.paymentMethod === 'bKash_Partial' ? 'Pay 200 BDT to Confirm Order' : `Pay ${total} BDT to Confirm Order`}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2 font-medium">Please send the exact amount to this Personal Number:</p>
                <div 
                  onClick={handleCopyNumber}
                  className="inline-flex items-center gap-3 bg-gray-50 hover:bg-pink-50 border-2 border-dashed border-gray-200 hover:border-[#E2136E] rounded-xl px-6 py-3 cursor-pointer transition-all group"
                  title="Click to copy"
                >
                  <span className="font-bold text-gray-900 text-xl tracking-wider group-hover:text-[#E2136E]">{bkashNumber}</span>
                  {copied ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : (
                    <Copy size={20} className="text-gray-400 group-hover:text-[#E2136E]" />
                  )}
                </div>
                {copied && <p className="text-green-600 text-xs font-bold mt-2 animate-in slide-in-from-bottom-1">Number Copied to Clipboard!</p>}
              </div>

              <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg border border-orange-200">
                <p className="font-bold mb-1">Instructions:</p>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>Go to your bKash Menu or App</li>
                  <li>Select <strong>Send Money</strong></li>
                  <li>Enter the number <strong>{bkashNumber}</strong></li>
                  <li>Enter amount <strong>{formData.paymentMethod === 'bKash_Partial' ? '200' : total} BDT</strong></li>
                  <li>Copy the <strong>Transaction ID (TrxID)</strong></li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Please enter Transaction ID <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 9F5A4B2C1X"
                    className="flex-1 border-2 border-gray-200 focus:border-[#E2136E] rounded-lg px-4 py-3 outline-none uppercase font-mono transition-colors"
                  />
                  <button 
                    onClick={handlePasteTrx}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 rounded-lg flex items-center justify-center transition-colors"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste size={20} />
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0">
              <button 
                onClick={handlePlaceOrder}
                disabled={loading || !transactionId.trim()}
                className="w-full bg-[#E2136E] hover:bg-[#d01060] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck size={20} />}
                {loading ? 'VERIFYING...' : 'CONFIRM ORDER'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300 text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Your order has been placed successfully. Please wait for the payment verification by the admin.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-accent/30"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
