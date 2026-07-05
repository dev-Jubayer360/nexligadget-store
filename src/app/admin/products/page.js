"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, X, Upload } from 'lucide-react';
import api from '@/lib/api';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('react-simple-wysiwyg').then(mod => mod.DefaultEditor), { ssr: false });

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shortDescriptionText: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    stock: '',
    badge: 'None',
    images: [],
    specificationsText: '',
    whatsInTheBoxText: '',
    qaText: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/categories'),
        api.get('/brands')
      ]);
      setProducts(prodRes.data.data.products || []);
      setCategories(catRes.data.data || []);
      setBrands(brandRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        shortDescriptionText: product.shortDescription ? (Array.isArray(product.shortDescription) ? product.shortDescription.join('\n') : product.shortDescription) : '',
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || '',
        category: product.category?._id || product.category,
        brand: product.brand?._id || product.brand,
        stock: product.stock,
        badge: product.badge || 'None',
        images: product.images || [],
        specificationsText: product.specifications?.map(s => `${s.title}: ${s.value}`).join('\n') || '',
        whatsInTheBoxText: product.whatsInTheBox?.join('\n') || '',
        qaText: product.qa?.map(q => `${q.question} | ${q.answer}`).join('\n') || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        shortDescriptionText: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        brand: '',
        stock: '',
        badge: 'None',
        images: [],
        specificationsText: '',
        whatsInTheBoxText: '',
        qaText: ''
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete product', error);
      alert('Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let uploadedImages = formData.images;
      
      // Handle Image Upload if new file selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImages = [uploadRes.data.data.url];
      }

      const payload = {
        ...formData,
        shortDescription: formData.shortDescriptionText.split('\n').filter(Boolean).map(s => s.trim()),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        badge: formData.badge,
        images: uploadedImages,
        specifications: formData.specificationsText.split('\n').filter(Boolean).map(line => {
          const [title, ...val] = line.split(':');
          return { title: title?.trim(), value: val.join(':')?.trim() };
        }),
        whatsInTheBox: formData.whatsInTheBoxText.split('\n').filter(Boolean).map(s => s.trim()),
        qa: formData.qaText.split('\n').filter(Boolean).map(line => {
          const [q, ...a] = line.split('|');
          return { question: q?.trim(), answer: a.join('|')?.trim() };
        })
      };

      if (editingProduct) {
        await api.patch(`/admin/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }

      setIsModalOpen(false);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to save product', error);
      alert(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
          <p className="text-sm text-gray-500">Manage your store products and inventory</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-gray-100">Product</th>
                <th className="p-4 font-bold border-b border-gray-100">Category</th>
                <th className="p-4 font-bold border-b border-gray-100">Price</th>
                <th className="p-4 font-bold border-b border-gray-100">Stock</th>
                <th className="p-4 font-bold border-b border-gray-100">Status</th>
                <th className="p-4 font-bold border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No products found.</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.brand?.name || 'No Brand'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{product.category?.name || 'Uncategorized'}</td>
                    <td className="p-4 font-bold text-gray-900">৳ {product.price}</td>
                    <td className="p-4">
                      <span className={`font-bold ${product.stock <= 10 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Short Description (Line by line) <span className="text-red-500">*</span></label>
                  <textarea required rows="4" value={formData.shortDescriptionText} onChange={(e) => setFormData({...formData, shortDescriptionText: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="Feature 1&#10;Feature 2"></textarea>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Description *</label>
                  <div className="bg-white">
                    <Editor 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      containerProps={{ style: { height: '250px', overflowY: 'auto' } }}
                    />
                  </div>
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Specifications (1 per line, format `Title: Value`)</label>
                  <textarea rows="4" value={formData.specificationsText} onChange={(e) => setFormData({...formData, specificationsText: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="Color: Green&#10;Weight: 125g"></textarea>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">What&apos;s in the Box (1 item per line)</label>
                  <textarea rows="4" value={formData.whatsInTheBoxText} onChange={(e) => setFormData({...formData, whatsInTheBoxText: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="1x Fan&#10;1x Cable"></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Q&A (1 per line, format `Question | Answer`)</label>
                  <textarea rows="3" value={formData.qaText} onChange={(e) => setFormData({...formData, qaText: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="Is it original? | Yes, 100% original."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (৳) *</label>
                  <input required type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Original Price (৳) (Cost)</label>
                  <input type="number" min="0" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Badge</label>
                  <select required value={formData.badge} onChange={(e) => setFormData({...formData, badge: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent bg-white">
                    <option value="None">None</option>
                    <option value="New">New</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Discount">Discount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                  <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent bg-white">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Brand *</label>
                  <select required value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent bg-white">
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity *</label>
                  <input required type="number" min="0" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Image</label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                    <Upload size={32} className="mb-2 text-gray-400" />
                    <span className="text-sm">Click to upload or drag & drop</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {(imageFile || (formData.images && formData.images.length > 0)) && (
                    <div className="mt-3 text-sm font-medium text-green-600 flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageFile ? URL.createObjectURL(imageFile) : formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      {imageFile ? imageFile.name : 'Current Image Retained'}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg font-bold text-white bg-accent hover:bg-orange-600 transition-colors flex items-center gap-2">
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
