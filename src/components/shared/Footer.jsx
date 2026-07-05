"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import api from '@/lib/api';

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '#', instagram: '#', youtube: '#', linkedin: '#'
  });
  const pathname = usePathname();

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data?.data?.socialLinks) {
        setSocialLinks(res.data.data.socialLinks);
      }
    }).catch(err => console.error(err));
  }, [pathname]);

  return (
    <footer className="bg-primary text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info */}
          <div>
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 mb-6 bg-white p-2 rounded w-fit">
              <Image src="/NexliGadgetLogo.png" alt="Nexli Gadget Logo" width={150} height={32} className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Your premier destination for high-quality gadgets and accessories. We bring the future to your doorstep.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.facebook !== '#' && socialLinks.facebook !== '' && (
                <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {socialLinks.instagram !== '#' && socialLinks.instagram !== '' && (
                <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {socialLinks.youtube !== '#' && socialLinks.youtube !== '' && (
                <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                </a>
              )}
              {socialLinks.linkedin !== '#' && socialLinks.linkedin !== '' && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm">CUSTOMER SERVICE</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-accent transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-accent transition-colors">Return Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Column 3: My Account */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm">MY ACCOUNT</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/dashboard" className="hover:text-accent transition-colors">My Account</Link></li>
              <li><Link href="/dashboard?tab=orders" className="hover:text-accent transition-colors">Order History</Link></li>
              <li><Link href="/wishlist" className="hover:text-accent transition-colors">Wishlist</Link></li>
              <li><Link href="/dashboard?tab=orders" className="hover:text-accent transition-colors">Track Order</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm">CONTACT INFO</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <div>
                  <p>+880 1935-615672</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <div>
                  <p>nexligadget@gmail.com</p>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin size={18} className="text-accent flex-shrink-0" />
                <div>
                  <p>Mirpur 10, Dhaka 1216</p>
                  <p>Bangladesh</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock size={18} className="text-accent flex-shrink-0" />
                <div>
                  <p>Mon - Sat: 9AM - 9PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 NEXLI GADGET. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {/* Payment Method */}
            <div className="bg-white px-3 py-1 rounded flex items-center justify-center">
              <Image src="https://freelogopng.com/images/all_img/1656227518bkash-logo-png.png" alt="bKash" width={60} height={24} className="h-6 w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
