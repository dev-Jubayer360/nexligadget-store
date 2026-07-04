"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, MessageSquare, Star, Mail, Check, X, Reply } from 'lucide-react';
import api from '@/lib/api';

export default function AdminReviewsContactsPage() {
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'contacts'
  
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reply Modal State
  const [replyModal, setReplyModal] = useState({ isOpen: false, type: '', id: '', replyText: '' });

  async function fetchData() {
    setLoading(true);
    try {
      const [reviewsRes, contactsRes] = await Promise.all([
        api.get('/admin/reviews'),
        api.get('/admin/contact')
      ]);
      setReviews(reviewsRes.data.data || []);
      setContacts(contactsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleReviewStatus = async (id, status) => {
    try {
      await api.patch(`/admin/reviews/${id}/status`, { status });
      setReviews(reviews.map(r => r._id === id ? { ...r, status } : r));
    } catch (error) {
      alert('Failed to update review status');
    }
  };

  const openReplyModal = (type, id, existingReply = '') => {
    setReplyModal({ isOpen: true, type, id, replyText: existingReply || '' });
  };

  const closeReplyModal = () => {
    setReplyModal({ isOpen: false, type: '', id: '', replyText: '' });
  };

  const handleSubmitReply = async () => {
    if (!replyModal.replyText.trim()) return alert('Reply cannot be empty');
    
    try {
      if (replyModal.type === 'review') {
        const res = await api.patch(`/admin/reviews/${replyModal.id}/reply`, { reply: replyModal.replyText });
        setReviews(reviews.map(r => r._id === replyModal.id ? res.data.data : r));
      } else if (replyModal.type === 'contact') {
        const res = await api.patch(`/admin/contact-messages/${replyModal.id}/reply`, { reply: replyModal.replyText });
        setContacts(contacts.map(c => c._id === replyModal.id ? res.data.data : c));
      }
      closeReplyModal();
    } catch (error) {
      alert('Failed to submit reply');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={14} className={star <= rating ? 'fill-orange-400 text-orange-400' : 'fill-gray-200 text-gray-200'} />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-black text-gray-900">Customer Interactions</h2>
          <p className="text-sm text-gray-500 mt-1">Manage product reviews and contact messages</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'reviews' ? 'bg-white text-accent shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Star size={16} /> Reviews ({reviews.filter(r => r.status === 'Pending').length} Pending)
          </button>
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'contacts' ? 'bg-white text-accent shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Mail size={16} /> Contact Forms ({contacts.filter(c => c.status === 'New').length} New)
          </button>
        </div>
      </div>

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No reviews found.</div>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-900">{review.userId?.name || 'Unknown User'}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        review.status === 'Approved' ? 'bg-green-50 text-green-700' :
                        review.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {review.status}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                    <p className="text-gray-700 mt-3 text-sm">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">Product: <span className="text-accent font-medium">{review.productId?.name}</span></p>
                    
                    {/* Admin Reply Box */}
                    {review.adminReply && (
                      <div className="mt-4 bg-blue-50/50 border-l-2 border-accent p-4 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-accent text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Admin Reply</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.adminReply}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {review.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleReviewStatus(review._id, 'Approved')} className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-bold transition-colors">
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => handleReviewStatus(review._id, 'Rejected')} className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-lg text-xs font-bold transition-colors">
                          <X size={14} /> Reject
                        </button>
                      </div>
                    )}
                    <button 
                      onClick={() => openReplyModal('review', review._id, review.adminReply)}
                      className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-gray-200"
                    >
                      <Reply size={14} /> {review.adminReply ? 'Edit Reply' : 'Add Reply'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No contact messages found.</div>
          ) : (
            contacts.map(contact => (
              <div key={contact._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-900">{contact.name}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-blue-600 font-medium">{contact.email}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{new Date(contact.createdAt).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        contact.status === 'Replied' ? 'bg-green-50 text-green-700' :
                        contact.status === 'Read' ? 'bg-blue-50 text-blue-700' :
                        'bg-orange-50 text-orange-700'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{contact.subject}</h4>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">{contact.message}</p>
                    
                    {/* Admin Reply Box */}
                    {contact.adminReply && (
                      <div className="mt-4 bg-blue-50/50 border-l-2 border-accent p-4 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-accent text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Your Reply</span>
                        </div>
                        <p className="text-sm text-gray-700">{contact.adminReply}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-[140px]">
                    <button 
                      onClick={() => window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}&su=${encodeURIComponent('Re: ' + contact.subject)}&body=${encodeURIComponent('\n\n\n------------------------\nOriginal Message:\n' + contact.message)}`, '_blank')}
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-black px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
                    >
                      <Reply size={16} /> Reply via Gmail
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-900 p-6 relative">
              <button 
                onClick={closeReplyModal}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-white mb-1">
                {replyModal.type === 'review' ? 'Reply to Review' : 'Reply to Contact Message'}
              </h3>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Reply Message <span className="text-red-500">*</span></label>
              <textarea 
                value={replyModal.replyText}
                onChange={(e) => setReplyModal({ ...replyModal, replyText: e.target.value })}
                placeholder="Type your official reply here..."
                className="w-full border-2 border-gray-200 focus:border-accent rounded-xl px-4 py-3 outline-none resize-none h-40 transition-colors text-sm"
              ></textarea>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={closeReplyModal}
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReply}
                className="flex-[2] py-3.5 bg-accent hover:bg-[#c90d5d] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare size={18} />
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
