"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Star, MessageSquare, CheckCircle2, Package, Truck, ShieldCheck, MapPin, X } from 'lucide-react';
import api from '@/lib/api';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const handleOpenReview = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setHoverRating(0);
    setComment('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) return alert('Please select a rating');
    if (!comment.trim()) return alert('Please write a comment');
    
    setSubmittingReview(true);
    try {
      await api.post(`/products/${selectedProduct.productId}/reviews`, {
        rating,
        comment
      });
      alert('Thank you! Your review has been submitted for approval.');
      setShowReviewModal(false);
      
      // Update local state to mark this item as reviewed so the button disappears instantly
      setOrder(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.productId === selectedProduct.productId ? { ...item, isReviewed: true } : item
        )
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
        <button onClick={() => router.push('/dashboard')} className="bg-accent text-white px-6 py-2 rounded-lg font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const isDelivered = order.orderStatus === 'Delivered';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              Order Details
              {order.orderStatus === 'Delivered' && <CheckCircle2 size={24} className="text-green-500" />}
            </h1>
            <p className="text-sm text-gray-500 font-medium">#{order._id.substring(order._id.length - 6).toUpperCase()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Placed on</p>
          <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-accent" />
              Items in your Order
            </h3>
            
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 border border-gray-100 p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      {item.variant && <p className="text-xs text-gray-500 mt-1">Variant: {item.variant}</p>}
                      <p className="text-sm font-bold text-accent mt-1">৳ {item.price} <span className="text-xs text-gray-400 font-normal ml-1">x {item.quantity}</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center sm:justify-end gap-3 w-full sm:w-auto">
                    {isDelivered && !item.isReviewed && (
                      <button 
                        onClick={() => handleOpenReview(item)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-sm font-bold transition-colors"
                      >
                        <Star size={16} />
                        Write Review
                      </button>
                    )}
                    {isDelivered && item.isReviewed && (
                      <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold">
                        <CheckCircle2 size={16} />
                        Reviewed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={20} className="text-accent" />
              Order Status Timeline
            </h3>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
              {order.orderTimeline?.map((timeline, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                    idx === order.orderTimeline.length - 1 ? 'bg-accent shadow-[0_0_0_3px_rgba(226,19,110,0.2)]' : 'bg-gray-300'
                  }`}></div>
                  <h4 className={`font-bold text-sm ${idx === order.orderTimeline.length - 1 ? 'text-gray-900' : 'text-gray-500'}`}>{timeline.status}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(timeline.date).toLocaleString()}</p>
                  {timeline.note && <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg inline-block">{timeline.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-accent" />
              Order Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳ {order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>৳ {order.deliveryCharge}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Discount</span>
                  <span>- ৳ {order.discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-accent">৳ {order.total}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Payment Details</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Method:</span>
                <span className="text-sm font-bold text-gray-900">{order.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  order.paymentStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.transactionId && (
                <div className="mt-3 bg-pink-50 p-3 rounded-lg border border-pink-100">
                  <p className="text-xs text-pink-600 font-bold mb-1">bKash TrxID</p>
                  <p className="font-mono text-sm font-bold text-gray-900">{order.transactionId}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-accent" />
              Shipping Address
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-bold text-gray-900 text-base">{order.shippingAddress.fullName}</p>
              <p className="flex items-center gap-2 mt-1"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-600">{order.shippingAddress.addressType}</span></p>
              <p className="mt-2">{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.division}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Review Modal */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-900 p-6 relative">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-white mb-1">Write a Review</h3>
              <p className="text-gray-400 text-sm">Share your experience with this product</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedProduct.image || 'https://via.placeholder.com/150'} alt={selectedProduct.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight">{selectedProduct.name}</h4>
                  {selectedProduct.variant && <p className="text-xs text-gray-500 mt-1">Variant: {selectedProduct.variant}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 text-center">How would you rate this product?</label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star 
                          size={32} 
                          className={`${
                            star <= (hoverRating || rating) 
                              ? 'fill-orange-400 text-orange-400' 
                              : 'fill-gray-100 text-gray-300'
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-center mt-2 h-5">
                    {rating > 0 && (
                      <span className="text-sm font-bold text-orange-500">
                        {rating === 1 ? 'Very Poor' : rating === 2 ? 'Poor' : rating === 3 ? 'Average' : rating === 4 ? 'Good' : 'Excellent!'}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Review <span className="text-red-500">*</span></label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or disliked about this product..."
                    className="w-full border-2 border-gray-200 focus:border-accent rounded-xl px-4 py-3 outline-none resize-none h-32 transition-colors text-sm"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setShowReviewModal(false)}
                disabled={submittingReview}
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="flex-[2] py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {submittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare size={18} />}
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
