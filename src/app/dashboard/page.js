"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Package, MapPin, CreditCard, Heart, LogOut, Bell, Star, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';
import OverviewTab from './components/OverviewTab';
import OrdersTab from './components/OrdersTab';
import AddressesTab from './components/AddressesTab';
import ProfileTab from './components/ProfileTab';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && user === null) {
      const timer = setTimeout(() => {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          router.push('/login');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    
    if (!user) return; // Prevent fetch if not logged in

    const fetchStats = async () => {
      try {
        const res = await api.get('/user/dashboard-stats');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, router, isMounted]);

  if (!isMounted || !user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }
  const menuItems = [
    { id: 'overview', icon: <User size={20} />, label: 'Dashboard Overview' },
    { id: 'orders', icon: <Package size={20} />, label: 'My Orders' },
    { id: 'addresses', icon: <MapPin size={20} />, label: 'Shipping Addresses' },
    { id: 'profile', icon: <CreditCard size={20} />, label: 'Profile Settings' },
    { id: 'wishlist', icon: <Heart size={20} />, label: 'Wishlist', href: '/wishlist' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-sm uppercase">
                  {user.name.substring(0, 2)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{user.name}</h2>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <ul className="p-4 space-y-1">
                {menuItems.map((item, i) => (
                  <li key={i}>
                    {item.href ? (
                      <Link 
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-primary"
                      >
                        {item.icon} {item.label}
                      </Link>
                    ) : (
                      <button 
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-orange-50 text-accent' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
                      >
                        {item.icon} {item.label}
                      </button>
                    )}
                  </li>
                ))}
                <li className="pt-4 mt-4 border-t border-gray-100">
                  <button onClick={() => { logout(); router.push('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={20} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {activeTab === 'overview' && <OverviewTab stats={stats} setTab={setActiveTab} />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
