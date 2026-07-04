import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'About Us - Nexli Gadget',
  description: 'Learn more about Nexli Gadget, your premier destination for high-quality smart gadgets and accessories in Bangladesh.',
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Page Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4">ABOUT US</h1>
          <div className="flex items-center justify-center text-sm text-gray-300 gap-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">About Us</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Nexli Gadget</h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Welcome to <strong>Nexli Gadget</strong>, your premier destination for authentic, high-quality smart gadgets and lifestyle accessories in Bangladesh. Based in Mirpur 10, Dhaka, we are dedicated to bringing you the very best of technology, with a focus on dependability, customer service, and uniqueness.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Founded with a passion for tech innovation, our mission is to make smart living accessible to everyone in Bangladesh. We understand the thrill of unboxing a new gadget, which is why we meticulously source our products from trusted manufacturers to ensure you get 100% original items at the most competitive prices.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Why Choose Us?</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-3 mb-6">
            <li><strong>Authentic Products:</strong> We guarantee the authenticity of every product we sell. No replicas, no compromises.</li>
            <li><strong>Fast Delivery:</strong> We offer Cash on Delivery (COD) across Bangladesh. Delivery within Dhaka in 24-48 hours and outside Dhaka in 3-5 days.</li>
            <li><strong>Secure Payments:</strong> Seamless payment options including bKash, Nagad, and Cash on Delivery.</li>
            <li><strong>Dedicated Support:</strong> Our customer support team is always ready to assist you with any inquiries or post-purchase support.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Our Vision</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We hope you enjoy our products as much as we enjoy offering them to you. As we continue to grow, our vision remains unchanged: to build a trustworthy and reliable tech community in Bangladesh where customers can shop with absolute peace of mind.
          </p>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-2">Get in Touch</h4>
            <p className="text-gray-600 text-sm">
              If you have any questions or comments, please don&apos;t hesitate to <Link href="/contact" className="text-accent font-bold hover:underline">contact us</Link> at <strong>nexligadget@gmail.com</strong> or call us at <strong>+880 1935-615672</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
