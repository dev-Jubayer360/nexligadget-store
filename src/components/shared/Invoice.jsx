import React from 'react';

const Invoice = ({ order }) => {
  if (!order) return null;

  const orderId = order._id.substring(order._id.length - 6).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString();

  return (
    <div id="invoice-template" className="bg-white text-gray-900 p-10 w-[800px] hidden-in-ui" style={{ display: 'none' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12 border-b-2 border-gray-100 pb-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/NexliGadgetLogo.png" alt="Nexli Gadgets" className="h-14 object-contain mb-4" />
          <h2 className="text-xl font-black text-primary">Nexli Gadgets</h2>
          <p className="text-sm text-gray-500 mt-1">123 Tech Street, Dhaka, Bangladesh</p>
          <p className="text-sm text-gray-500">Phone: +880 1935-615672</p>
          <p className="text-sm text-gray-500">Email: support@nexligadgets.com</p>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-black text-gray-200 tracking-widest uppercase">Invoice</h1>
          <div className="mt-4">
            <p className="text-sm font-bold text-gray-700">Invoice No: <span className="text-gray-900 font-black">#{orderId}</span></p>
            <p className="text-sm font-bold text-gray-700 mt-1">Date: <span className="text-gray-900">{date}</span></p>
          </div>
        </div>
      </div>

      {/* Billing Info */}
      <div className="flex justify-between mb-12">
        <div className="w-1/2 pr-4">
          <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Billed To / Shipped To</h3>
          <p className="font-bold text-gray-900 text-lg mb-1">{order.shippingAddress?.fullName}</p>
          <p className="text-sm text-gray-600 mb-1">{order.shippingAddress?.phone}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.division}</p>
        </div>
        <div className="w-1/2 pl-4 text-right">
          <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Payment Status</h3>
          <p className="font-bold text-green-600 text-lg mb-1">{order.paymentStatus}</p>
          <p className="text-sm text-gray-600 mb-1">Method: <span className="font-bold">{order.paymentMethod.replace('_', ' ')}</span></p>
          {order.transactionId && (
            <p className="text-sm text-gray-600">TrxID: <span className="font-mono">{order.transactionId}</span></p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b-2 border-gray-200">
              <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider">Item Description</th>
              <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider text-center">Qty</th>
              <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider text-right">Unit Price</th>
              <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items?.map((item, idx) => (
              <tr key={idx}>
                <td className="py-4 px-4">
                  <p className="font-bold text-gray-900">{item.name}</p>
                  {item.variant && <p className="text-xs text-gray-500 mt-1">Variant: {item.variant}</p>}
                </td>
                <td className="py-4 px-4 text-center text-gray-700">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-gray-700">৳ {item.price}</td>
                <td className="py-4 px-4 text-right font-bold text-gray-900">৳ {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-16">
        <div className="w-80">
          <div className="flex justify-between py-2 text-sm text-gray-600">
            <span>Subtotal</span>
            <span>৳ {order.subtotal}</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-gray-600 border-t border-gray-50">
            <span>Delivery Fee</span>
            <span>৳ {order.deliveryCharge}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between py-2 text-sm font-bold text-green-600 border-t border-gray-50">
              <span>Discount</span>
              <span>- ৳ {order.discount}</span>
            </div>
          )}
          <div className="flex justify-between py-4 mt-2 border-t-2 border-gray-200 text-xl font-black text-primary">
            <span>Total</span>
            <span className="text-accent">৳ {order.total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-100 pt-8 text-center">
        <p className="text-sm font-bold text-gray-800 mb-1">Thank you for shopping with Nexli Gadgets!</p>
        <p className="text-xs text-gray-500">If you have any questions about this invoice, please contact support@nexligadgets.com</p>
      </div>
    </div>
  );
};

export default Invoice;
