import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Nexli Gadget',
  description: 'Privacy Policy and Data Protection guidelines for Nexli Gadget.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4">PRIVACY POLICY</h1>
          <div className="flex items-center justify-center text-sm text-gray-300 gap-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 prose max-w-none">
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            At Nexli Gadget, we respect your privacy. We collect personal information you provide to us when you register on our website, place an order, subscribe to our newsletter, or contact us. This includes your name, email address, phone number, shipping address, and payment information (handled securely through SSL encryption and our banking partners).
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-3 mb-6">
            <li>Process and fulfill your orders, including sending emails/SMS about your order status.</li>
            <li>Improve our website, customer service, and overall user experience.</li>
            <li>Send promotional emails about new products, special offers, or other information (you can unsubscribe at any time).</li>
            <li>Detect and prevent fraudulent activities.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Sharing and Third Parties</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share necessary details with trusted third parties who assist us in operating our website, conducting our business, or servicing you, such as our courier partners (e.g., Steadfast, Pathao) so they can deliver your orders. These parties are obligated to keep your information confidential.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Cookies</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Our website uses &quot;cookies&quot; to enhance your shopping experience. Cookies are small files stored on your computer&apos;s hard drive that help us remember and process the items in your shopping cart, understand your preferences for future visits, and compile aggregate data about site traffic.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Data Security</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data is encrypted via Secure Socket Layer (SSL) technology and securely stored behind industry-standard firewalls. However, please remember that no method of transmission over the internet or electronic storage is 100% secure.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Your Rights</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            You have the right to access, correct, or request deletion of your personal data stored on our platform. You can manage your information by logging into your account or by contacting us at <strong>nexligadget@gmail.com</strong>.
          </p>

        </div>
      </div>
    </div>
  );
}
