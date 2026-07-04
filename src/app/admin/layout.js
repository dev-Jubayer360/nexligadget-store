"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Settings, Tag, MessageSquare, LogOut, Package, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (user === null) {
        const timer = setTimeout(() => {
          const currentUser = useAuthStore.getState().user;
          if (!currentUser || currentUser.role !== 'admin') {
            router.push('/login');
          }
        }, 100);
        return () => clearTimeout(timer);
      } else if (user && user.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [isMounted, user, router]);

  if (!isMounted || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard Overview', href: '/admin' },
    { icon: <ShoppingBag size={20} />, label: 'Order Management', href: '/admin/orders' },
    { icon: <Package size={20} />, label: 'Product Management', href: '/admin/products' },
    { icon: <Tag size={20} />, label: 'Category & Brand', href: '/admin/categories' },
    { icon: <Users size={20} />, label: 'User Management', href: '/admin/users' },
    { icon: <MessageSquare size={20} />, label: 'Reviews & Contacts', href: '/admin/reviews' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800 flex items-center justify-center">
          <Link href="/admin" className="bg-white p-2 rounded w-full flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/NexliGadgetLogo.png" alt="Nexli Gadget Logo" className="h-8 object-contain" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item, i) => {
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <li key={i}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                  >
                    {item.icon} {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-4 border-t border-gray-800">
          <button onClick={() => { logout(); router.push('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-xl font-black text-gray-800">
            {menuItems.find(item => item.href === pathname)?.label || 'Dashboard Overview'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary text-white border-2 border-primary flex items-center justify-center font-bold uppercase overflow-hidden shadow-sm">
              {user.name.substring(0, 2)}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
}
