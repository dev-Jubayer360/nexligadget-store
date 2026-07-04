import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.data || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-gray-100">Order ID</th>
                <th className="p-4 font-bold border-b border-gray-100">Date</th>
                <th className="p-4 font-bold border-b border-gray-100">Items</th>
                <th className="p-4 font-bold border-b border-gray-100">Order Status</th>
                <th className="p-4 font-bold border-b border-gray-100">Payment Status</th>
                <th className="p-4 font-bold border-b border-gray-100">Total</th>
                <th className="p-4 font-bold border-b border-gray-100">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">You haven&apos;t placed any orders yet.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td className="p-4 font-bold text-primary">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                      {order.transactionId && (
                        <div className="text-[10px] font-mono text-gray-500 mt-1 font-normal">TrxID: {order.transactionId}</div>
                      )}
                    </td>
                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{order.items.length} item(s)</td>
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
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.paymentStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                        order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 font-bold">{order.total} BDT</td>
                    <td className="p-4">
                      <Link href={`/dashboard/orders/${order._id}`} className="text-accent hover:underline font-bold">Details</Link>
                    </td>
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
