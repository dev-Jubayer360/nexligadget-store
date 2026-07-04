"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-500 text-sm font-medium">Total Revenue</div>
              <div className="text-2xl font-black text-gray-900 mt-1">৳ {stats?.totalRevenue || 0}</div>
            </div>
            <div className="w-10 h-10 rounded bg-green-50 text-green-500 flex items-center justify-center"><TrendingUp size={20}/></div>
          </div>
          <div className="text-sm font-bold text-green-600 bg-green-50 w-fit px-3 py-1 rounded-full mt-auto">
            Profit: ৳ {stats?.totalProfit || 0}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-500 text-sm font-medium">Total Orders</div>
              <div className="text-2xl font-black text-gray-900 mt-1">{stats?.totalOrders || 0}</div>
            </div>
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex items-center justify-center"><ShoppingBag size={20}/></div>
          </div>
          <div className="text-xs text-gray-500 font-medium">{stats?.pendingOrders || 0} pending, {stats?.processingOrders || 0} processing</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-500 text-sm font-medium">Total Products</div>
              <div className="text-2xl font-black text-gray-900 mt-1">{stats?.totalProducts || 0}</div>
            </div>
            <div className="w-10 h-10 rounded bg-purple-50 text-purple-500 flex items-center justify-center"><Package size={20}/></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-gray-500 text-sm font-medium">Low Stock Alerts</div>
              <div className="text-2xl font-black text-gray-900 mt-1">{stats?.lowStockProducts || 0}</div>
            </div>
            <div className="w-10 h-10 rounded bg-red-50 text-red-500 flex items-center justify-center"><AlertTriangle size={20}/></div>
          </div>
          <div className="text-xs text-red-500 font-bold hover:underline cursor-pointer">{stats?.outOfStockProducts || 0} Out of Stock</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">Recent Orders</h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-gray-100">Order ID</th>
                  <th className="p-4 font-bold border-b border-gray-100">Customer</th>
                  <th className="p-4 font-bold border-b border-gray-100">Status</th>
                  <th className="p-4 font-bold border-b border-gray-100">Amount</th>
                  <th className="p-4 font-bold border-b border-gray-100">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {stats?.recentOrders?.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center text-gray-500">No orders found.</td></tr>
                ) : (
                  stats?.recentOrders?.map(order => (
                    <tr key={order._id}>
                      <td className="p-4 font-bold text-primary">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                      <td className="p-4">{order.shippingAddress?.fullName || 'Unknown'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 font-bold">৳ {order.total}</td>
                      <td className="p-4">
                        <span className="text-gray-500">{order.paymentStatus}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products / Low Stock */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Low Stock Alerts</h3>
          </div>
          <div className="p-4 space-y-4">
            {stats?.topSellingProducts?.length === 0 ? (
              <div className="text-sm text-gray-500 text-center">No products found.</div>
            ) : (
              stats?.topSellingProducts?.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded border border-gray-100 p-1 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={(typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url) || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</div>
                    <div className={`text-xs font-bold mt-1 ${product.stock <= 10 ? 'text-red-500' : 'text-gray-500'}`}>
                      {product.stock} left in stock
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
