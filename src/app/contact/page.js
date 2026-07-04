"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Mail, PhoneCall, Clock, Send, ChevronDown } from 'lucide-react';
import api from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });
    
    try {
      await api.post('/contact', formData);
      setStatusMsg({ type: 'success', text: 'Message sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatusMsg({ type: 'error', text: error.response?.data?.message || 'Failed to send message.' });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: "What is your return policy?",
      a: "We offer a 7-day hassle-free return policy. If you are not satisfied with your purchase, you can return it within 7 days of delivery in its original packaging."
    },
    {
      q: "How long does delivery take?",
      a: "Delivery inside Dhaka takes 1-2 business days. For outside Dhaka, it typically takes 2-4 business days depending on the location."
    },
    {
      q: "Do you offer warranty on products?",
      a: "Yes, most of our smart gadgets come with a 1-year official brand warranty. Please check individual product details for specific warranty information."
    },
    {
      q: "How can I track my order?",
      a: "You can track your order by logging into your account and visiting the 'Track Order' section in your dashboard."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      
      {/* Hero Section */}
      <div className="bg-primary pt-16 pb-24 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Get in Touch</h1>
            <p className="text-gray-300 text-lg">Have a question or need assistance? We&apos;re here to help.</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-accent flex-shrink-0">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Phone Number</h4>
                    <p className="text-gray-600 text-sm">+880 1935-615672</p>
                    <p className="text-gray-500 text-xs mt-1">Mon-Sat 9am-9pm</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-accent flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Email Address</h4>
                    <p className="text-gray-600 text-sm">nexligadget@gmail.com</p>
                    <p className="text-gray-500 text-xs mt-1">We&apos;ll reply within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-accent flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Office Address</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Mirpur 10, Dhaka 1216<br />
                      Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-accent flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Store Hours</h4>
                    <p className="text-gray-600 text-sm">Monday - Saturday</p>
                    <p className="text-accent font-medium text-sm mt-0.5">09:00 AM - 09:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat Support Card */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-md p-8 text-white text-center">
               <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
               <p className="text-sm text-gray-300 mb-6">Our support team is active on live chat.</p>
               <a 
                 href="https://wa.me/8801935615672" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-accent hover:bg-accent-hover text-white font-bold py-3 px-6 rounded transition-colors w-full flex items-center justify-center gap-2"
               >
                 Start Live Chat
               </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 h-full">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Send us a Message</h3>
              <p className="text-gray-500 mb-8">Please fill out the form below and we will get back to you as soon as possible.</p>
              
              {statusMsg.text && (
                <div className={`mb-6 p-4 rounded-lg font-bold text-sm ${statusMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {statusMsg.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name <span className="text-accent">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address <span className="text-accent">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition-all" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject <span className="text-accent">*</span></label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="How can we help you?" className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition-all" required />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message <span className="text-accent">*</span></label>
                  <textarea rows="6" name="message" value={formData.message} onChange={handleInputChange} placeholder="Write your message here..." className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition-all resize-none" required></textarea>
                </div>
                
                <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg shadow-sm w-full md:w-auto disabled:opacity-50">
                  {loading ? 'Sending...' : <><Send size={20} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
          
        </div>

        {/* FAQs Section */}
        <div className="mb-16 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500">Find answers to common questions about our products and services.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 last:border-0 group">
                <button className="w-full text-left px-6 py-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-gray-900 group-hover:text-accent transition-colors">{faq.q}</span>
                  <ChevronDown size={20} className="text-gray-400 group-hover:text-accent transition-colors" />
                </button>
                {/* Simplified visual state for mockup - normally controlled by state */}
                {index === 0 && (
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 bg-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Store Map placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 h-96 w-full flex items-center justify-center mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-200/50 flex flex-col items-center justify-center">
              <MapPin size={48} className="text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Nexli Gadget Store Location</h3>
              <p className="text-gray-500 mb-4">Mirpur 10, Dhaka 1216</p>
              <button className="bg-white text-primary font-bold py-2 px-6 rounded shadow hover:bg-gray-50">Open in Maps</button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://via.placeholder.com/1200x400?text=Map" alt="Map" className="w-full h-full object-cover opacity-50" />
        </div>

      </div>
    </div>
  );
}
