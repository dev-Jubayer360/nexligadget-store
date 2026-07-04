"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, Edit, Plus, X } from 'lucide-react';
import api from '@/lib/api';

export default function AdminCategoriesBrands() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'categories' | 'brands'
  const [activeTab, setActiveTab] = useState('categories');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get('/categories'),
        api.get('/brands')
      ]);
      setCategories(catRes.data.data || []);
      setBrands(brandRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, description: item.description || '', image: item.image || '' });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      if (type === 'categories') {
        setCategories(categories.filter(c => c._id !== id));
      } else {
        setBrands(brands.filter(b => b._id !== id));
      }
    } catch (error) {
      console.error(`Failed to delete ${type}`, error);
      alert(`Failed to delete ${type}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = activeTab === 'categories' ? '/admin/categories' : '/admin/brands';
      if (editingItem) {
        await api.patch(`${endpoint}/${editingItem._id}`, formData);
      } else {
        await api.post(endpoint, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save', error);
      alert(error.response?.data?.message || 'Failed to save');
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

  const activeData = activeTab === 'categories' ? categories : brands;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Categories & Brands</h2>
          <p className="text-sm text-gray-500">Manage product categories and brands</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'categories' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'brands' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('brands')}
          >
            Brands
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">
            All {activeTab}
          </h3>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} /> Add {activeTab === 'categories' ? 'Category' : 'Brand'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-bold w-16">Image</th>
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Description</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {activeData.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-gray-500">No {activeTab} found.</td></tr>
              ) : (
                activeData.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">N/A</div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600 max-w-md truncate">{item.description || '-'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item._id, activeTab)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'categories' ? 'Category' : 'Brand'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})} 
                  placeholder="https://example.com/icon.png"
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows="3" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg font-bold text-white bg-accent hover:bg-orange-600 transition-colors flex items-center gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
