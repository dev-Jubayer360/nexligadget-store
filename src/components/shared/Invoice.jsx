import React from 'react';

const Invoice = ({ order }) => {
  if (!order) return null;

  const orderId = order._id.substring(order._id.length - 6).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString();

  return (
    <div id="invoice-template" className="bg-[#ffffff] text-[#111827] p-10 hidden-in-ui" style={{ display: 'none', width: '190mm', maxWidth: '100%' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12 border-b-2 border-[#f3f4f6] pb-8">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/NexliGadgetLogo.png" alt="Nexli Gadgets" className="h-14 object-contain mb-4" />
          <h2 className="text-xl font-black text-[#0b0c1b]">Nexli Gadgets</h2>
          <p className="text-sm text-[#6b7280] mt-1">123 Tech Street, Dhaka, Bangladesh</p>
          <p className="text-sm text-[#6b7280]">Phone: +880 1935-615672</p>
          <p className="text-sm text-[#6b7280]">Email: support@nexligadgets.com</p>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-black text-[#e5e7eb] tracking-widest uppercase">Invoice</h1>
          <div className="mt-4">
            <p className="text-sm font-bold text-[#374151]">Invoice No: <span className="text-[#111827] font-black">#{orderId}</span></p>
            <p className="text-sm font-bold text-[#374151] mt-1">Date: <span className="text-[#111827]">{date}</span></p>
          </div>
        </div>
      </div>

      {/* Billing Info */}
      <div className="flex justify-between mb-12">
        <div className="w-1/2 pr-4">
          <h3 className="text-xs font-bold text-[#E2136E] uppercase tracking-wider mb-2">Billed To / Shipped To</h3>
          <p className="font-bold text-[#111827] text-lg mb-1">{order.shippingAddress?.fullName}</p>
          <p className="text-sm text-[#4b5563] mb-1">{order.shippingAddress?.phone}</p>
          <p className="text-sm text-[#4b5563]">{order.shippingAddress?.addressLine1} {order.shippingAddress?.addressLine2}</p>
          <p className="text-sm text-[#4b5563]">{order.shippingAddress?.city}, {order.shippingAddress?.division}</p>
        </div>
        <div className="w-1/2 pl-4 text-right">
          <h3 className="text-xs font-bold text-[#E2136E] uppercase tracking-wider mb-2">Payment Status</h3>
          <p className="font-bold text-[#16a34a] text-lg mb-1">{order.paymentStatus}</p>
          <p className="text-sm text-[#4b5563] mb-1">Method: <span className="font-bold">{order.paymentMethod.replace('_', ' ')}</span></p>
          {order.transactionId && (
            <p className="text-sm text-[#4b5563]">TrxID: <span className="font-mono">{order.transactionId}</span></p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] text-[#4b5563] border-b-2 border-[#e5e7eb]">
              <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider">Item Description</th>
              <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider text-center">Qty</th>
              <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider text-right">Unit Price</th>
              <th className="py-3 px-4 font-bold text-sm uppercase tracking-wider text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {order.items?.map((item, idx) => (
              <tr key={idx}>
                <td className="py-4 px-4">
                  <p className="font-bold text-[#111827]">{item.name}</p>
                  {item.variant && <p className="text-xs text-[#6b7280] mt-1">Variant: {item.variant}</p>}
                </td>
                <td className="py-4 px-4 text-center text-[#374151]">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-[#374151]">৳ {item.price}</td>
                <td className="py-4 px-4 text-right font-bold text-[#111827]">৳ {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-16">
        <div className="w-80">
          <div className="flex justify-between py-2 text-sm text-[#4b5563]">
            <span>Subtotal</span>
            <span>৳ {order.subtotal}</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-[#4b5563] border-t border-[#f9fafb]">
            <span>Delivery Fee</span>
            <span>৳ {order.deliveryCharge}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between py-2 text-sm font-bold text-[#16a34a] border-t border-[#f9fafb]">
              <span>Discount</span>
              <span>- ৳ {order.discount}</span>
            </div>
          )}
          <div className="flex justify-between py-4 mt-2 border-t-2 border-[#e5e7eb] text-xl font-black text-[#0b0c1b]">
            <span>Total</span>
            <span className="text-[#E2136E]">৳ {order.total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-[#f3f4f6] pt-8 text-center">
        <p className="text-sm font-bold text-[#1f2937] mb-1">Thank you for shopping with Nexli Gadgets!</p>
        <p className="text-xs text-[#6b7280]">If you have any questions about this invoice, please contact support@nexligadgets.com</p>
      </div>
    </div>
  );
};

export default Invoice;
