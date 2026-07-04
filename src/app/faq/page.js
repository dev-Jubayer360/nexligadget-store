import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'FAQ - Nexli Gadget',
  description: 'Frequently Asked Questions about Nexli Gadget orders, shipping, and returns.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by browsing our products, adding your desired items to the cart, and proceeding to checkout. You will need to provide your delivery address and choose a payment method (Cash on Delivery or Mobile Banking like bKash/Nagad)."
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer: "Yes, we offer Cash on Delivery across Bangladesh. For orders outside Dhaka, you may need to pay the delivery charge in advance as a confirmation token via bKash/Nagad."
    },
    {
      question: "How much is the delivery charge?",
      answer: "Inside Dhaka: 60 BDT. Outside Dhaka: 120 BDT. Delivery charges may vary slightly depending on the weight and size of the package."
    },
    {
      question: "How long does delivery take?",
      answer: "For deliveries inside Dhaka, it usually takes 1-2 working days. For outside Dhaka, it takes 3-5 working days depending on the courier service (e.g., Pathao, Steadfast, or Sundarban Courier)."
    },
    {
      question: "Are your products authentic?",
      answer: "Absolutely. We pride ourselves on selling 100% original and authentic products. We source directly from authorized distributors and verified suppliers."
    },
    {
      question: "Can I return or exchange a product?",
      answer: "Yes, we have a 3-day replacement policy in case of manufacturing defects. Please check our Return Policy page for detailed terms and conditions."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive an SMS from our courier partner with a tracking link. You can also track your order status from the 'My Account' section on our website."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4">FREQUENTLY ASKED QUESTIONS</h1>
          <div className="flex items-center justify-center text-sm text-gray-300 gap-2">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">FAQ</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center border border-gray-100">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href="/contact" className="inline-block bg-accent text-white font-bold px-6 py-2 rounded hover:bg-accent-hover transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
