import React from 'react';
import Link from 'next/link';
import { Package, CreditCard } from 'lucide-react';

export default function OverviewTab({ stats, setTab }) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Package size={24}/></div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Total Orders</div>
            <div className="text-2xl font-black text-gray-900">{stats?.totalOrders || 0}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-accent flex items-center justify-center"><Package size={24}/></div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Pending Orders</div>
            <div className="text-2xl font-black text-gray-900">{stats?.pendingOrders || 0}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><CreditCard size={24}/></div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Total Spent</div>
            <div className="text-2xl font-black text-gray-900">{stats?.totalSpent || 0} BDT</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <button onClick={() => setTab('orders')} className="text-sm font-bold text-accent hover:underline">View All</button>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-gray-100">Order ID</th>
                <th className="p-4 font-bold border-b border-gray-100">Date</th>
                <th className="p-4 font-bold border-b border-gray-100">Status</th>
                <th className="p-4 font-bold border-b border-gray-100">Total</th>
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
                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 font-bold">{order.total} BDT</td>
                    <td className="p-4"><Link href={`/dashboard/orders/${order._id}`} className="text-accent hover:underline font-bold">View</Link></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
