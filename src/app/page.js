import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shared/ProductCard';
import api from '@/lib/api';
import { ArrowRight, Tag } from 'lucide-react';

const getCategoryImage = (name) => {
  const n = name.toLowerCase();
  if (n.includes('phone') || n.includes('mobile')) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80';
  if (n.includes('laptop') || n.includes('computer') || n.includes('pc')) return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80';
  if (n.includes('watch') || n.includes('band') || n.includes('smartwatch')) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80';
  if (n.includes('camera') || n.includes('drone') || n.includes('photo')) return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80';
  if (n.includes('audio') || n.includes('headphone') || n.includes('earphone') || n.includes('speaker') || n.includes('earbud')) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80';
  if (n.includes('power') || n.includes('battery') || n.includes('charger') || n.includes('cable')) return 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&q=80';
  if (n.includes('game') || n.includes('gaming') || n.includes('console')) return 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&q=80';
  if (n.includes('processor') || n.includes('cpu') || n.includes('component')) return 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&q=80';
  return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&q=80'; // default electronics
};

export default async function Home() {
  let newArrivals = [];
  let bestSellers = [];
  let categories = [];
  let settings = null;
  try {
    const [newRes, bestRes, catRes, settingsRes] = await Promise.all([
      api.get('/products?badge=New&limit=4'),
      api.get('/products?badge=Bestseller&limit=4'),
      api.get('/categories'),
      api.get('/settings')
    ]);
    newArrivals = newRes.data.data.products || [];
    bestSellers = bestRes.data.data.products || [];
    categories = catRes.data.data || [];
    settings = settingsRes.data.data || null;
  } catch (error) {
    console.error('Error fetching home page data:', error);
  }

  const hero = settings?.heroBanner || {
    title: 'Upgrade\nEveryday Tech',
    subtitle: '',
    description: 'Discover 100% authentic gadgets with fast delivery across Bangladesh and prices that make sense.',
    badge: 'UP TO',
    badgeText: '15%\nOFF',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    discountText: 'SMART GADGET COLLECTION',
    image: '/images/hero-gadgets.png'
  };

  return (
    <div className="bg-white">
      {/* Hero Banner Section */}
      <section className="bg-white pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0b0c1b] rounded-2xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl">
            
            {/* Background Dotted Pattern overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Left Content */}
            <div className="z-10 text-white max-w-lg mb-12 md:mb-0 w-full relative">
              <span className="text-accent font-bold tracking-wide text-xs mb-3 block uppercase">{hero.discountText || 'SMART GADGET COLLECTION'}</span>
              
              <h1 className="text-4xl md:text-5xl font-black mb-1 leading-[1.15] whitespace-pre-line">
                {hero.title || 'Upgrade\nEveryday Tech'}
                {hero.subtitle && <span className="block text-2xl md:text-3xl font-medium font-serif italic text-gray-300 mt-2">{hero.subtitle}</span>}
              </h1>
              
              {/* Short orange underline */}
              <div className="h-1 w-12 bg-accent mt-6 mb-6"></div>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                {hero.description || 'Discover 100% authentic gadgets with fast delivery across Bangladesh and prices that make sense.'}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link href={hero.buttonLink || '/shop'} className="bg-accent hover:bg-[#e05600] text-white font-bold py-3 px-6 rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-accent/20 text-sm">
                  {hero.buttonText || 'Shop Now'} <ArrowRight size={16} />
                </Link>
                <Link href="/shop?badge=Discount" className="bg-transparent border border-accent text-white hover:bg-accent/10 font-bold py-3 px-6 rounded-md flex items-center gap-2 transition-colors text-sm">
                  Explore Deals <Tag size={16} />
                </Link>
              </div>
            </div>
            
            {/* Right Content (Image & Glowing Ring) */}
            <div className="z-10 relative w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
              
              {/* Central Image Container */}
              <div className="relative z-10 w-full max-w-[400px] h-[300px] md:h-[350px] flex items-center justify-center">
                {hero.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hero.image} alt="Hero Banner" className="w-full h-full object-contain drop-shadow-2xl" style={{ mixBlendMode: 'screen' }} />
                ) : (
                  <div className="w-64 h-64 bg-white/5 rounded-full flex flex-col items-center justify-center text-accent text-center p-4 backdrop-blur-sm border border-white/10">
                     {/* Dummy 3D Pedestal Shape representing missing image */}
                     <div className="w-40 h-10 bg-indigo-900/50 rounded-[100%] border-t border-indigo-500/30 shadow-[0_10px_20px_rgba(0,0,0,0.5)] mt-auto mb-4 absolute bottom-10"></div>
                     <span className="text-sm font-bold z-10 text-white/50">Upload Banner Image</span>
                  </div>
                )}
              </div>
              
              {/* Floating Orange Discount Badge */}
              <div className="absolute top-0 right-0 md:-right-4 w-20 h-20 md:w-24 md:h-24 bg-accent rounded-full border-2 border-dashed border-white/40 flex flex-col items-center justify-center text-white shadow-xl z-20 shadow-accent/30 rotate-12">
                <span className="text-[10px] md:text-xs font-bold leading-none mb-1">{hero.badge || 'UP TO'}</span>
                <span className="text-lg md:text-xl font-black leading-none text-center whitespace-pre-line">{hero.badgeText || '15%\nOFF'}</span>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Featured Features */}
      <section className="border-b border-gray-100 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">100% Original</h4>
                <p className="text-[10px] text-gray-500">Sourced directly</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">7 Days Returns</h4>
                <p className="text-[10px] text-gray-500">Hassle-free refunds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">Fast Delivery</h4>
                <p className="text-[10px] text-gray-500">Across Bangladesh</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-accent">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800">24/7 Support</h4>
                <p className="text-[10px] text-gray-500">Dedicated help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-primary">NEW ARRIVALS</h2>
            <div className="h-1 w-16 bg-accent mt-2"></div>
          </div>
          <Link href="/shop" className="text-sm font-bold text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-primary text-center mb-8">SHOP BY CATEGORY</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link href={`/shop?category=${cat._id}`} key={cat._id} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:border-accent border border-transparent transition-all group">
                <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden shadow-inner">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={cat.image || getCategoryImage(cat.name)} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-sm text-primary group-hover:text-accent">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-primary">BEST SELLERS</h2>
            <div className="h-1 w-16 bg-accent mt-2"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
      

    </div>
  );
}
