import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Return Policy - Nexli Gadget',
  description: 'Return, refund, and replacement policy for Nexli Gadget in Bangladesh.',
};

export default function ReturnsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4">RETURN & REPLACEMENT POLICY</h1>
          <div className="flex items-center justify-center text-sm text-gray-300 gap-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Returns</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 prose max-w-none">
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">3-Day Replacement Guarantee</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            At Nexli Gadget, customer satisfaction is our top priority. We offer a 3-Day Replacement Guarantee if you receive a product with manufacturing defects, functional issues, or if the wrong product was delivered.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Conditions for Return/Replacement</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-3 mb-6">
            <li>The issue must be reported within 3 days of receiving the delivery.</li>
            <li>The product must be in its original packaging, intact, with all accessories, manuals, and warranty cards included.</li>
            <li>The product must not be physically damaged by the user (e.g., broken, burnt, scratched due to mishandling).</li>
            <li>An unboxing video is highly recommended to validate claims for missing items or physical damage during transit.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">How to Request a Return</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            If your product meets the above conditions, please follow these steps:
          </p>
          <ol className="list-decimal pl-5 text-gray-600 space-y-3 mb-6">
            <li>Contact our customer support team at <strong>nexligadget@gmail.com</strong> or call us at <strong>+880 1935-615672</strong> within 3 days of delivery.</li>
            <li>Provide your Order ID, phone number, and a clear video/picture of the defect.</li>
            <li>Once approved, you will need to send the product back to us via courier (e.g., Sundarban, SA Paribahan, or Steadfast) to our Mirpur office.</li>
          </ol>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Refund Policy</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We generally offer replacements for defective items. However, if a replacement is unavailable in stock, we will issue a full refund for the product price. Refunds are processed via bKash, Nagad, or Bank Transfer within 3-5 working days after the returned product is received and inspected.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Warranty Claims</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            For products that come with a brand warranty (e.g., 6 months or 1 year), you must preserve the purchase invoice and the original box. After the initial 3 days, any issues will be handled under the standard brand warranty terms, and it may take 15-30 days to process warranty claims.
          </p>

        </div>
      </div>
    </div>
  );
}
