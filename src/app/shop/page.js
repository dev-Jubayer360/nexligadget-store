"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/shared/ProductCard';
import { Star, LayoutGrid, List as ListIcon, ChevronRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const badgeParam = searchParams.get('badge') || '';
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(categoryParam);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoriesList, setCategoriesList] = useState([]);
  
  // Filtering & Sorting State
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [rating, setRating] = useState(0);
  const [stock, setStock] = useState(''); // 'inStock', 'outOfStock', or ''
  const [sort, setSort] = useState('newest');


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategoriesList(res.data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryParam !== category) {
      setCategory(categoryParam);
      setPage(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?page=${page}`;
        if (category) url += `&category=${category}`;
        if (minPrice > 0) url += `&minPrice=${minPrice}`;
        if (maxPrice < 50000) url += `&maxPrice=${maxPrice}`;
        if (rating > 0) url += `&rating=${rating}`;
        if (stock) url += `&stock=${stock}`;
        if (sort) url += `&sort=${sort}`;
        if (badgeParam) url += `&badge=${badgeParam}`;

        const res = await api.get(url);
        setProducts(res.data.data.products || []);
        setTotalPages(res.data.data.pagination.pages || 1);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Add a small debounce to prevent rapid firing when dragging slider
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [page, category, minPrice, maxPrice, rating, stock, sort, badgeParam]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Page Header */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
              SHOP <span className="text-gray-400">/</span> <span className="text-accent">ALL PRODUCTS</span>
            </h1>
            <div className="flex items-center text-sm text-gray-400 gap-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
              <ChevronRight size={14} />
              <span className="text-white">All Products</span>
            </div>
          </div>
          
          {/* Promo Banner in Header */}
          <div className="hidden md:flex bg-gradient-to-r from-primary-dark to-primary border border-gray-700 rounded-lg p-4 items-center gap-6 w-96 relative overflow-hidden">
             <div className="z-10">
               <div className="text-accent text-xs font-bold mb-1">BIG SAVINGS!</div>
               <div className="text-xl font-bold mb-2">Up to 30% Off</div>
               <button className="bg-accent text-white text-xs font-bold py-1.5 px-4 rounded hover:bg-accent-hover">Shop Now</button>
             </div>
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 z-10">
                <span className="text-xl font-bold">100%</span>
             </div>
             <div className="absolute right-0 top-0 w-32 h-32 bg-accent/20 blur-2xl rounded-full -mr-16 -mt-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <div className="flex items-center gap-2 mb-6 text-primary font-bold border-b border-gray-100 pb-4">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            FILTER PRODUCTS
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-bold text-sm text-gray-800 mb-4">CATEGORIES</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-between items-center text-accent font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="category" checked={category === ''} onChange={() => {setCategory(''); setPage(1);}} className="accent-accent" /> All Products
                </label>
              </li>
              {categoriesList.map((cat) => (
                <li key={cat._id} className="flex justify-between items-center hover:text-accent transition-colors">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" checked={category === cat._id} onChange={() => {setCategory(cat._id); setPage(1);}} className="accent-accent" /> {cat.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-bold text-sm text-gray-800 mb-4">MAX PRICE</h3>
            <div className="text-xs text-gray-500 mb-4">Up to {maxPrice} BDT</div>
            <div className="mb-6">
              <input 
                type="range" 
                min="0" 
                max="50000" 
                step="500"
                value={maxPrice} 
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                className="w-full accent-accent h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 flex items-center border border-gray-200 rounded px-2 py-1.5 bg-gray-50">
                <span className="text-xs text-gray-500">Min: 0 BDT</span>
              </div>
              <span className="text-gray-400">-</span>
              <div className="flex-1 flex items-center border border-gray-200 rounded px-2 py-1.5">
                <input type="number" min="0" max="50000" value={maxPrice} onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }} className="w-full text-xs outline-none" />
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="mb-8">
            <h3 className="font-bold text-sm text-gray-800 mb-4">RATINGS</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-between items-center hover:text-accent transition-colors">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rating" checked={rating === 0} onChange={() => { setRating(0); setPage(1); }} className="accent-accent text-accent" />
                  <span className="text-gray-600">All Ratings</span>
                </label>
              </li>
              {[5, 4, 3, 2].map((stars) => (
                <li key={stars} className="flex justify-between items-center hover:text-accent transition-colors">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rating" checked={rating === stars} onChange={() => { setRating(stars); setPage(1); }} className="accent-accent text-accent" />
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < stars ? "currentColor" : "none"} stroke={i < stars ? "currentColor" : "#d1d5db"} />
                      ))}
                    </div>
                    {stars < 5 && <span className="text-xs">& Up</span>}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h3 className="font-bold text-sm text-gray-800 mb-4">AVAILABILITY</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-between items-center hover:text-accent transition-colors">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="stock" checked={stock === ''} onChange={() => { setStock(''); setPage(1); }} className="accent-accent text-accent" /> All
                </label>
              </li>
              <li className="flex justify-between items-center hover:text-accent transition-colors">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="stock" checked={stock === 'inStock'} onChange={() => { setStock('inStock'); setPage(1); }} className="accent-accent text-accent" /> In Stock
                </label>
              </li>
              <li className="flex justify-between items-center hover:text-accent transition-colors">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="stock" checked={stock === 'outOfStock'} onChange={() => { setStock('outOfStock'); setPage(1); }} className="accent-accent text-accent" /> Out of Stock
                </label>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setCategory('');
                setMinPrice(0);
                setMaxPrice(50000);
                setRating(0);
                setStock('');
                setSort('newest');
                setPage(1);
                if (badgeParam) router.push('/shop');
              }}
              className="flex-1 py-2 border border-gray-200 text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="text-sm text-gray-500">
              Showing page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <select 
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="border-none bg-gray-50 outline-none font-medium text-gray-700 py-1 px-2 rounded cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="bestRated">Best Rated</option>
                </select>
              </div>
              <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                <button className="p-1.5 bg-accent text-white rounded"><LayoutGrid size={18} /></button>
                <button className="p-1.5 text-gray-400 hover:text-primary transition-colors"><ListIcon size={18} /></button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded font-medium transition-colors ${
                    page === i + 1 
                    ? 'bg-accent text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:text-accent hover:border-accent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
