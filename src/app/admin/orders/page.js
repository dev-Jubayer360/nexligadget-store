"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, Trash2, Eye, X, Download } from 'lucide-react';
import api from '@/lib/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: status } : o));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  const handleUpdatePayment = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/payment-status`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, paymentStatus: status } : o));
    } catch (error) {
      console.error('Failed to update payment status', error);
      alert('Failed to update payment status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(`/admin/orders/${id}`);
      setOrders(orders.filter(o => o._id !== id));
      if (selectedOrder?._id === id) setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to delete order', error);
      alert('Failed to delete order');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDownloadReport = () => {
    if (orders.length === 0) {
      alert("No orders to download");
      return;
    }

    // CSV Headers
    const headers = ["Order ID", "Date", "Customer Name", "Phone", "Email", "Address", "City", "Total", "Order Status", "Payment Status", "Transaction ID"];
    
    // CSV Rows
    const csvRows = [headers.join(',')];
    
    for (const order of orders) {
      const row = [
        `#${order._id.substring(order._id.length - 6).toUpperCase()}`,
        `"${new Date(order.createdAt).toLocaleString()}"`,
        `"${order.shippingAddress?.fullName || ''}"`,
        `"${order.shippingAddress?.phone || ''}"`,
        `"${order.shippingAddress?.email || ''}"`,
        `"${order.shippingAddress?.address || ''}"`,
        `"${order.shippingAddress?.city || ''}"`,
        order.total,
        order.orderStatus,
        order.paymentStatus,
        `"${order.transactionId || ''}"`
      ];
      csvRows.push(row.join(','));
    }

    // Create Blob and trigger download
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `Orders_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
          <p className="text-sm text-gray-500">View and manage customer orders</p>
        </div>
        <button onClick={handleDownloadReport} className="bg-accent text-white px-4 py-2 rounded-lg font-bold hover:bg-accent-hover flex items-center gap-2 text-sm transition-colors shadow-sm">
          <Download size={16} /> Download Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-gray-100">Order ID & Date</th>
                <th className="p-4 font-bold border-b border-gray-100">Customer Info</th>
                <th className="p-4 font-bold border-b border-gray-100">Amount</th>
                <th className="p-4 font-bold border-b border-gray-100">Order Status</th>
                <th className="p-4 font-bold border-b border-gray-100">Payment Status</th>
                <th className="p-4 font-bold border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No orders found.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-primary">#{order._id.substring(order._id.length - 6).toUpperCase()}</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{order.shippingAddress?.fullName}</div>
                      <div className="text-xs text-gray-500">{order.shippingAddress?.phone}</div>
                      {order.transactionId && (
                        <div className="text-[10px] font-mono text-[#E2136E] mt-1 bg-pink-50 px-1.5 py-0.5 rounded inline-block">
                          TrxID: {order.transactionId}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-gray-900">৳ {order.total}</td>
                    <td className="p-4">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className={`border rounded px-2 py-1 text-xs font-bold outline-none ${
                          order.orderStatus === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <select 
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdatePayment(order._id, e.target.value)}
                        className={`border rounded px-2 py-1 text-xs font-bold outline-none ${
                          order.paymentStatus === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.paymentStatus === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleViewDetails(order)} className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleDelete(order._id)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors">
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

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">Order Details - #{selectedOrder._id.substring(selectedOrder._id.length - 6).toUpperCase()}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Customer Details</div>
                  <div className="font-bold text-gray-900">{selectedOrder.shippingAddress?.fullName}</div>
                  <div className="text-sm text-gray-600">{selectedOrder.shippingAddress?.phone}</div>
                  <div className="text-sm text-gray-600">{selectedOrder.shippingAddress?.email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Shipping Address</div>
                  <div className="text-sm text-gray-900">{selectedOrder.shippingAddress?.address}</div>
                  <div className="text-sm text-gray-900">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 uppercase font-bold mb-3">Order Items</div>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                            </div>
                            <div className="font-medium text-gray-900 line-clamp-1">{item.name}</div>
                          </td>
                          <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                          <td className="p-3 text-right font-bold">৳ {item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳ {selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>৳ {selectedOrder.deliveryCharge}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Discount</span>
                      <span>- ৳ {selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>৳ {selectedOrder.total}</span>
                  </div>
                </div>
              </div>
              
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end flex-shrink-0 bg-gray-50">
               <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
