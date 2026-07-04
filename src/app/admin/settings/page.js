"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, Upload, Plus, Trash2, Edit } from 'lucide-react';
import api from '@/lib/api';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Hero Banner State
  const [heroData, setHeroData] = useState({
    title: '', subtitle: '', description: '', image: '',
    badge: 'NEW', badgeText: '', buttonText: '', buttonLink: '', discountText: ''
  });
  const [imageFile, setImageFile] = useState(null);

  // Social Links State
  const [socialLinks, setSocialLinks] = useState({
    facebook: '#', instagram: '#', youtube: '#', linkedin: '#'
  });

  // Coupon State
  const [coupons, setCoupons] = useState([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponData, setCouponData] = useState({
    code: '', discountType: 'Percentage', discountValue: '', minimumOrder: 0, expiryDate: '', usageLimit: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [settingsRes, couponsRes] = await Promise.all([
        api.get('/settings'),
        api.get('/admin/coupons')
      ]);
      if (settingsRes.data.data?.heroBanner) {
        setHeroData(settingsRes.data.data.heroBanner);
      }
      if (settingsRes.data.data?.socialLinks) {
        setSocialLinks(settingsRes.data.data.socialLinks);
      }
      setCoupons(couponsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch settings data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = heroData.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.data.url;
      }
      
      await api.patch('/admin/settings', {
        heroBanner: { ...heroData, image: finalImageUrl }
      });
      alert('Hero settings updated successfully!');
      fetchData();
    } catch (error) {
      alert('Failed to update hero settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/admin/settings', { socialLinks });
      alert('Social links updated successfully!');
      fetchData();
    } catch (error) {
      alert('Failed to update social links');
    } finally {
      setSaving(false);
    }
  };

  const openCouponModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrder: coupon.minimumOrder || 0,
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
        usageLimit: coupon.usageLimit || ''
      });
    } else {
      setEditingCoupon(null);
      setCouponData({
        code: '', discountType: 'Percentage', discountValue: '', minimumOrder: 0, expiryDate: '', usageLimit: ''
      });
    }
    setIsCouponModalOpen(true);
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...couponData,
        discountValue: Number(couponData.discountValue),
        minimumOrder: Number(couponData.minimumOrder),
        usageLimit: couponData.usageLimit ? Number(couponData.usageLimit) : null
      };
      
      if (editingCoupon) {
        await api.patch(`/admin/coupons/${editingCoupon._id}`, payload);
      } else {
        await api.post('/admin/coupons', payload);
      }
      setIsCouponModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete coupon');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-accent" /></div>;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button onClick={() => setActiveTab('hero')} className={`py-3 px-4 font-bold border-b-2 transition-colors ${activeTab === 'hero' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
          Hero Banner Settings
        </button>
        <button onClick={() => setActiveTab('social')} className={`py-3 px-4 font-bold border-b-2 transition-colors ${activeTab === 'social' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
          Social Links
        </button>
        <button onClick={() => setActiveTab('coupons')} className={`py-3 px-4 font-bold border-b-2 transition-colors ${activeTab === 'coupons' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
          Coupons Management
        </button>
      </div>

      {/* Hero Banner Tab */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-6">Homepage Hero Settings</h2>
          <form onSubmit={handleHeroSubmit} className="space-y-6 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Discount Text</label>
                <input required type="text" value={heroData.discountText} onChange={(e) => setHeroData({...heroData, discountText: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="BIG SAVINGS!" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                <input required type="text" value={heroData.title} onChange={(e) => setHeroData({...heroData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="Up to 30% Off" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                <input required type="text" value={heroData.subtitle} onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="on selected gadgets" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea required rows="3" value={heroData.description} onChange={(e) => setHeroData({...heroData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent"></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Floating Badge Status</label>
                <input type="text" value={heroData.badge} onChange={(e) => setHeroData({...heroData, badge: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="NEW" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Badge Text Inside Image</label>
                <input type="text" value={heroData.badgeText} onChange={(e) => setHeroData({...heroData, badgeText: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="SMART LIVING" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Button Text</label>
                <input required type="text" value={heroData.buttonText} onChange={(e) => setHeroData({...heroData, buttonText: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="Shop Now" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Button Link</label>
                <input required type="text" value={heroData.buttonLink} onChange={(e) => setHeroData({...heroData, buttonLink: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="/shop" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Hero Product Image (Transparent PNG recommended)</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                  <Upload size={32} className="mb-2 text-gray-400" />
                  <span className="text-sm">Click to upload new banner image</span>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                {(imageFile || heroData.image) && (
                  <div className="mt-3 w-32 h-32 bg-primary rounded-xl overflow-hidden flex items-center justify-center p-2">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageFile ? URL.createObjectURL(imageFile) : heroData.image} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
            <button type="submit" disabled={saving} className="bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />} Save Hero Settings
            </button>
          </form>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-6">Social Media Links</h2>
          <form onSubmit={handleSocialSubmit} className="space-y-6 max-w-xl">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Facebook URL</label>
              <input type="url" value={socialLinks.facebook} onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="https://facebook.com/yourpage" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Instagram URL</label>
              <input type="url" value={socialLinks.instagram} onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="https://instagram.com/yourpage" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">YouTube URL</label>
              <input type="url" value={socialLinks.youtube} onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="https://youtube.com/c/yourchannel" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">LinkedIn URL</label>
              <input type="url" value={socialLinks.linkedin} onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-accent" placeholder="https://linkedin.com/company/yourcompany" />
            </div>
            <button type="submit" disabled={saving} className="bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />} Save Social Links
            </button>
          </form>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Discount Coupons</h2>
            <button onClick={() => openCouponModal()} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
              <Plus size={18} /> Generate Coupon
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="p-4 font-bold border-b border-gray-100">Code</th>
                  <th className="p-4 font-bold border-b border-gray-100">Discount</th>
                  <th className="p-4 font-bold border-b border-gray-100">Min Order</th>
                  <th className="p-4 font-bold border-b border-gray-100">Expiry</th>
                  <th className="p-4 font-bold border-b border-gray-100">Status</th>
                  <th className="p-4 font-bold border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {coupons.map(c => (
                  <tr key={c._id}>
                    <td className="p-4 font-black text-accent">{c.code}</td>
                    <td className="p-4 font-bold">{c.discountType === 'Percentage' ? `${c.discountValue}%` : `৳${c.discountValue}`}</td>
                    <td className="p-4">৳{c.minimumOrder}</td>
                    <td className="p-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${new Date(c.expiryDate) < new Date() ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {new Date(c.expiryDate) < new Date() ? 'Expired' : c.status}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => openCouponModal(c)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                      <button onClick={() => deleteCoupon(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h3>
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Coupon Code *</label>
                <input required type="text" value={couponData.code} onChange={e => setCouponData({...couponData, code: e.target.value.toUpperCase()})} className="w-full border border-gray-300 rounded p-2 outline-none uppercase font-bold" placeholder="E.g. EID30" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Discount Type</label>
                  <select value={couponData.discountType} onChange={e => setCouponData({...couponData, discountType: e.target.value})} className="w-full border border-gray-300 rounded p-2 outline-none">
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Discount Amount *</label>
                  <input required type="number" min="1" value={couponData.discountValue} onChange={e => setCouponData({...couponData, discountValue: e.target.value})} className="w-full border border-gray-300 rounded p-2 outline-none" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Minimum Order (৳)</label>
                  <input type="number" min="0" value={couponData.minimumOrder} onChange={e => setCouponData({...couponData, minimumOrder: e.target.value})} className="w-full border border-gray-300 rounded p-2 outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Usage Limit (Optional)</label>
                  <input type="number" min="1" value={couponData.usageLimit} onChange={e => setCouponData({...couponData, usageLimit: e.target.value})} className="w-full border border-gray-300 rounded p-2 outline-none" placeholder="Unlimited" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Expiry Date *</label>
                <input required type="date" value={couponData.expiryDate} onChange={e => setCouponData({...couponData, expiryDate: e.target.value})} className="w-full border border-gray-300 rounded p-2 outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="px-4 py-2 font-bold text-gray-600 bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 font-bold text-white bg-accent rounded">{saving ? 'Saving...' : 'Save Coupon'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
