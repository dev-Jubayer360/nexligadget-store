import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions - Nexli Gadget',
  description: 'Terms and Conditions for using Nexli Gadget services in Bangladesh.',
};

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4">TERMS & CONDITIONS</h1>
          <div className="flex items-center justify-center text-sm text-gray-300 gap-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Terms</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 prose max-w-none">
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Welcome to Nexli Gadget. By accessing our website and placing an order, you agree to be bound by the following terms and conditions. These terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Product Information and Pricing</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We strive to display our products, including their colors and specifications, as accurately as possible. However, the actual colors you see depend on your monitor. All prices are in Bangladeshi Taka (BDT). We reserve the right to change prices and discontinue products at any time without prior notice.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Order Acceptance and Cancellation</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Receiving an order confirmation does not guarantee the acceptance of an order. We reserve the right to cancel any order for reasons including, but not limited to, product unavailability, pricing errors, or suspected fraudulent activity. If we cancel an order for which you have already paid, we will fully refund the amount.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Payment Terms</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We accept Cash on Delivery (COD) and mobile banking payments (bKash/Nagad). For deliveries outside Dhaka, a partial advance payment for shipping fees is required. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. User Accounts</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            When you create an account with us, you must provide information that is accurate and complete. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Governing Law</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            These Terms shall be governed and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Changes to Terms</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

        </div>
      </div>
    </div>
  );
}
