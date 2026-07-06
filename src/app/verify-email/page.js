"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Link from 'next/link';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmailToken } = useAuthStore();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token.');
        return;
      }

      const result = await verifyEmailToken(token);
      if (result && result.success) {
        setStatus('success');
        setMessage(result.message || 'Email verified successfully!');
      } else {
        setStatus('error');
        setMessage(result.message || 'Verification failed. The token may be expired or invalid.');
      }
    };

    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="bg-primary min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center relative">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-accent-hover"></div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Verification</h2>

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="animate-spin text-accent mb-4" size={48} />
              <p className="text-gray-600">Verifying your email address...</p>
              <p className="text-sm text-gray-400 mt-2">Please wait a moment.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Successful!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {message}
              </p>
              <Link href="/login" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded transition-colors inline-block">
                Continue to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <XCircle className="text-red-500" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {message}
              </p>
              <Link href="/login" className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3 rounded transition-colors inline-block">
                Back to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
