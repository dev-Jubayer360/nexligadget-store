"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Heart, Share2, ArrowLeftRight, ChevronRight, CheckCircle2, Shield, Truck, CreditCard, ChevronDown, ChevronUp, ShoppingCart, Loader2 } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import api from '@/lib/api';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';
import useAuthStore from '@/store/authStore';
import useRecentViewStore from '@/store/recentViewStore';

export default function ProductDetailsPage({ params }) {
  const router = useRouter();
  const { slug } = React.use(params);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading: cartLoading } = useCartStore();
  const { wishlist, addToWishlist, removeWishlistItem } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { addRecentProduct } = useRecentViewStore();
  
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        const prodData = res.data.data;
        setProduct(prodData);
        addRecentProduct(prodData); // Save to recently viewed
        
        // Fetch reviews
        const reviewsRes = await api.get(`/products/${prodData._id}/reviews`);
        setReviews(reviewsRes.data.data || []);

        // Fetch related products
        if (prodData.category?._id || prodData.category) {
          const catId = prodData.category._id || prodData.category;
          const relatedRes = await api.get(`/products?category=${catId}&limit=5`);
          const related = (relatedRes.data?.data?.products || []).filter(p => p._id !== prodData._id).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-700">Product Not Found</h2>
      </div>
    );
  }

  const inWishlist = mounted && wishlist?.products?.some(item => item._id === product._id || item === product._id);

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity);
    if (success) alert('Added to cart!');
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
      router.push('/cart');
    }
  };

  const handleWishlistClick = async () => {
    setIsWishlisting(true);
    if (inWishlist) {
      const success = await removeWishlistItem(product._id);
      if (success) alert('Removed from wishlist!');
    } else {
      const success = await addToWishlist(product);
      if (success) alert('Added to wishlist!');
    }
    setIsWishlisting(false);
  };
  
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Nexli Gadget!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };
  
  const discountPercentage = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 gap-2 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-primary transition-colors">Drones & Camera</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-primary transition-colors">Drones</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-10 mb-8">
          
          {/* Left: Image Gallery */}
          <div className="w-full md:w-1/2 flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 w-20">
              <button className="text-gray-400 hover:text-primary flex justify-center"><ChevronUp size={20}/></button>
              {product.images?.slice(0, 4).map((img, i) => (
                <div key={i} className={`relative w-20 h-20 rounded-lg border-2 cursor-pointer overflow-hidden ${i===0 ? 'border-accent' : 'border-gray-200'}`}>
                  <Image src={(typeof img === 'string' ? img : img?.url) || 'https://via.placeholder.com/150'} alt={`thumb-${i}`} fill sizes="80px" className="object-cover" />
                </div>
              ))}
              <button className="text-gray-400 hover:text-primary flex justify-center"><ChevronDown size={20}/></button>
            </div>
            {/* Main Image */}
            <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center relative overflow-hidden min-h-[400px]">
               <Image src={(typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url) || 'https://via.placeholder.com/600'} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-4" priority />
               {discountPercentage > 0 && <span className="absolute top-4 left-4 bg-accent text-white font-bold px-3 py-1 rounded text-sm shadow z-10">-{discountPercentage}%</span>}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex gap-2 mb-3">
              {product.badge && product.badge !== 'None' && (
                <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">{product.badge}</span>
              )}
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {product.stock === 0 ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="text-gray-900 font-bold ml-2 text-sm">{product.rating} <span className="text-gray-500 font-normal">({product.reviewsCount || 0} Reviews)</span></span>
              </div>
              <span className="text-gray-300">|</span>
              <span className={`text-sm font-bold ${
                product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-red-500' : 'text-green-500'
              }`}>
                {product.stock === 0 ? 'Out of Stock' : `${product.stock} Available in Stock`}
              </span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-black text-accent">{product.price} BDT</span>
              {product.oldPrice && <span className="text-lg text-gray-400 line-through mb-1">{product.oldPrice} BDT</span>}
              {discountPercentage > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded mb-2">-{discountPercentage}%</span>}
            </div>

            {Array.isArray(product.shortDescription) ? (
              <ul className="list-disc list-inside text-gray-600 text-sm mb-6 space-y-1">
                {product.shortDescription.map((desc, idx) => (
                  <li key={idx}>{desc}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Colors (Skipped for now as it needs variant logic) */}

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded h-12 w-32 bg-gray-50">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock === 0} className="px-4 text-gray-500 hover:text-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed">-</button>
                <input type="text" value={product.stock === 0 ? 0 : quantity} readOnly className="w-full text-center bg-transparent font-bold outline-none" />
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={product.stock === 0} className="px-4 text-gray-500 hover:text-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={cartLoading || product.stock === 0} className="flex-1 bg-accent hover:bg-accent-hover text-white font-bold h-12 rounded flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingCart size={20} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} disabled={cartLoading || product.stock === 0} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Buy Now
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-6 text-sm text-gray-600 font-medium">
              <button 
                onClick={handleWishlistClick} 
                disabled={isWishlisting}
                className={`flex items-center gap-2 transition-colors ${inWishlist ? 'text-accent hover:text-accent-hover' : 'hover:text-accent'}`}
              >
                {isWishlisting ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />} 
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              <button onClick={handleShareClick} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Feature / Trust Badges */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-accent"><Truck size={32} strokeWidth={1.5} /></div>
            <div>
              <h4 className="font-bold text-gray-900">Free Delivery</h4>
              <p className="text-xs text-gray-500">On orders over 1999 BDT</p>
            </div>
          </div>
          <div className="hidden md:block w-px bg-gray-100"></div>
          <div className="flex items-center gap-4">
            <div className="text-accent"><ArrowLeftRight size={32} strokeWidth={1.5} /></div>
            <div>
              <h4 className="font-bold text-gray-900">7 Days Returns</h4>
              <p className="text-xs text-gray-500">Hassle-free return policy</p>
            </div>
          </div>
          <div className="hidden md:block w-px bg-gray-100"></div>
          <div className="flex items-center gap-4">
            <div className="text-accent"><Shield size={32} strokeWidth={1.5} /></div>
            <div>
              <h4 className="font-bold text-gray-900">1 Year Warranty</h4>
              <p className="text-xs text-gray-500">Official brand warranty</p>
            </div>
          </div>
          <div className="hidden md:block w-px bg-gray-100"></div>
          <div className="flex items-center gap-4">
            <div className="text-accent"><CreditCard size={32} strokeWidth={1.5} /></div>
            <div>
              <h4 className="font-bold text-gray-900">Secure Payment</h4>
              <p className="text-xs text-gray-500">100% secure checkout</p>
            </div>
          </div>
        </div>

        {/* Info Grid (Features, Highlights, Delivery) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {product.features && product.features.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 size={18} className="text-accent flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Delivery</h4>
                    <p className="text-xs text-gray-500 mt-1">Inside Dhaka: 1-2 Days</p>
                    <p className="text-xs text-gray-500">Outside Dhaka: 2-4 Days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowLeftRight size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Return Policy</h4>
                    <p className="text-xs text-gray-500 mt-1">7 Days Easy Returns</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Warranty</h4>
                    <p className="text-xs text-gray-500 mt-1">1 Year Official Warranty</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Payment Options</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Cash on Delivery, bKash, Nagad, Visa/MasterCard, Rocket</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-12">
          {['Description', 'Specifications', "What's in the Box", 'Q&A', 'Reviews'].map((tab, i) => {
            // Using standard details/summary to avoid complex state management
            return (
              <details key={i} className="group border-b border-gray-100 last:border-0" open={i === 0}>
                <summary className="w-full py-4 flex justify-between items-center font-bold text-gray-900 hover:text-accent transition-colors cursor-pointer list-none">
                  <span>{tab}</span>
                  <span className="transition group-open:rotate-180">
                    <ChevronDown size={20} className="text-gray-400 group-open:text-accent" />
                  </span>
                </summary>
                <div className="pb-4 text-sm text-gray-600 leading-relaxed">
                  {tab === 'Description' && (
                    <div 
                      className="rich-text-content break-words overflow-hidden"
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      dangerouslySetInnerHTML={{ __html: product.description }} 
                    />
                  )}
                  {tab === 'Specifications' && (
                    <div className="space-y-2">
                      {product.specifications?.length > 0 ? (
                        <table className="w-full text-left text-sm">
                          <tbody className="divide-y divide-gray-100">
                            {product.specifications.map((spec, idx) => (
                              <tr key={idx}>
                                <td className="py-2 font-bold text-gray-700 w-1/3">{spec.title}</td>
                                <td className="py-2 text-gray-600">{spec.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : 'No specifications available.'}
                    </div>
                  )}
                  {tab === "What's in the Box" && (
                    <ul className="list-disc pl-5 space-y-1">
                      {product.whatsInTheBox?.length > 0 ? product.whatsInTheBox.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      )) : 'No details available.'}
                    </ul>
                  )}
                  {tab === 'Q&A' && (
                    <div className="space-y-4">
                      {product.qa?.length > 0 ? product.qa.map((qaItem, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-bold text-gray-900 mb-1">Q: {qaItem.question}</div>
                          <div className="text-gray-600">A: {qaItem.answer}</div>
                        </div>
                      )) : 'No Q&A available.'}
                    </div>
                  )}
                  {tab === 'Reviews' && (
                    <div className="space-y-6">
                      {reviews.length > 0 ? reviews.map((review, idx) => (
                        <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-3 mb-2 border-b border-gray-200 pb-2">
                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold uppercase text-xs">
                              {review.userId?.name?.substring(0, 2) || 'US'}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{review.userId?.name || 'Verified Customer'}</div>
                              <div className="flex gap-1 mt-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} size={12} className={star <= review.rating ? 'fill-orange-400 text-orange-400' : 'fill-gray-200 text-gray-200'} />
                                ))}
                              </div>
                            </div>
                            <div className="ml-auto text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                          <p className="text-gray-700 text-sm mt-3">{review.comment}</p>
                          
                          {/* Admin Reply */}
                          {review.adminReply && (
                            <div className="mt-4 ml-6 bg-white border-l-2 border-accent p-4 rounded-r-lg shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-accent text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Official Reply</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{review.adminReply}</p>
                            </div>
                          )}
                        </div>
                      )) : (
                        <div className="text-center py-10">
                          <Star size={40} className="mx-auto text-gray-300 mb-3" />
                          <h4 className="font-bold text-gray-900">No reviews yet</h4>
                          <p className="text-gray-500 text-sm">Be the first to review this product!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-primary mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
