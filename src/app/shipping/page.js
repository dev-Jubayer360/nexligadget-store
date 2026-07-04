import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery - Nexli Gadget',
  description: 'Shipping and Delivery policy for Nexli Gadget in Bangladesh.',
};

export default function ShippingPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4">SHIPPING & DELIVERY</h1>
          <div className="flex items-center justify-center text-sm text-gray-300 gap-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Shipping</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 prose max-w-none">
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Coverage</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We deliver products all across Bangladesh using reputed courier services such as Pathao, Steadfast, and Sundarban Courier Service. Home delivery is available in almost all major cities and upazilas.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Delivery Charges</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-3 mb-6">
            <li><strong>Inside Dhaka City:</strong> 60 BDT</li>
            <li><strong>Outside Dhaka / Anywhere in Bangladesh:</strong> 120 BDT</li>
            <li>Heavy or bulky items may incur additional delivery charges, which will be communicated during order confirmation.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Delivery Timeframe</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We strive to process and dispatch orders as quickly as possible.
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-3 mb-6">
            <li><strong>Inside Dhaka:</strong> 24 to 48 hours (1-2 working days).</li>
            <li><strong>Outside Dhaka:</strong> 72 to 120 hours (3-5 working days).</li>
          </ul>
          <p className="text-sm text-gray-500 italic mb-6">Note: Delivery times may be delayed during public holidays, severe weather conditions, or unforeseen political situations.</p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Advance Payment (Outside Dhaka)</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            For orders outside Dhaka, we may require an advance payment of the delivery charge (120 BDT) via bKash or Nagad to confirm the order. The remaining product price can be paid as Cash on Delivery when receiving the parcel.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Order Tracking</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Once your order is handed over to the courier, you will receive an SMS containing your tracking number and a tracking link.
          </p>

        </div>
      </div>
    </div>
  );
}
