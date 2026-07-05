"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Zap, ShieldCheck, Mail, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const router = useRouter();
  const { login, register, googleLogin, loading, error, clearError } = useAuthStore();
  const [formError, setFormError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result && result.success) {
        if (result.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setFormError('Google Login failed');
      }
    } catch (err) {
      console.error('Google Success Error:', err);
      setFormError(err.message || 'An unexpected error occurred');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');
    if (!email || !password) return setFormError('Please fill all fields');
    
    const result = await login(email, password);
    if (result && result.success) {
      if (result.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');
    if (!name || !email || !phone || !password || !confirmPassword) {
      return setFormError('Please fill all fields');
    }
    if (password !== confirmPassword) {
      return setFormError('Passwords do not match');
    }

    const result = await register({ name, email, phone, password });
    if (result && result.success) {
      if (result.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="bg-primary min-h-screen py-12 flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col-reverse md:flex-row gap-8 items-center">
        
        {/* Left Column: Branding / Info */}
        <div className="w-full md:w-1/2 text-white p-6 relative">
          <div className="absolute top-10 left-10 w-64 h-64 bg-accent/20 blur-3xl rounded-full -z-10"></div>
          
          <h2 className="text-xl font-bold text-accent mb-2 uppercase tracking-widest">Welcome Back To</h2>
          <div className="bg-white p-4 rounded-xl inline-block mb-6 mt-4 w-fit shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/NexliGadgetLogo.png" alt="Nexli Gadget Logo" className="h-12 md:h-16 object-contain" />
          </div>
          
          <p className="text-gray-300 text-lg mb-12 max-w-sm leading-relaxed">
            Your next level destination for smart gadgets & accessories.
          </p>

          <div className="space-y-8 max-w-sm">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-gray-700 bg-white/5 flex items-center justify-center text-accent flex-shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">100% Secure Login</h3>
                <p className="text-sm text-gray-400">We keep your data safe & secure</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-gray-700 bg-white/5 flex items-center justify-center text-accent flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Fast & Easy Access</h3>
                <p className="text-sm text-gray-400">Login to track orders & manage account</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-gray-700 bg-white/5 flex items-center justify-center text-accent flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Exclusive Member Benefits</h3>
                <p className="text-sm text-gray-400">Enjoy special offers & member-only deals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto w-full">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${activeTab === 'login' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Login
              </button>
              <button 
                onClick={() => { setActiveTab('register'); clearError(); setFormError(''); }}
                className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${activeTab === 'register' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-gray-800'}`}
              >
                Create Account
              </button>
            </div>

            <div className="p-8">
              {(error || formError) && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
                  <span className="block sm:inline">{error || formError}</span>
                </div>
              )}

              {activeTab === 'login' ? (
                /* Login Form */
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Login to your account</h3>
                  <p className="text-sm text-gray-500 mb-6">Welcome back! Please enter your details.</p>
                  
                  <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-accent rounded w-4 h-4" />
                        <span className="text-xs text-gray-600">Remember me</span>
                      </label>
                      <Link href="#" className="text-xs text-accent font-bold hover:underline">Forgot password?</Link>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded transition-colors mt-6 disabled:opacity-50">
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>

                  <div className="mt-6">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                      <div className="relative bg-white px-4 text-xs text-gray-400">or continue with</div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setFormError('Google Login Failed')}
                      />
                    </div>
                  </div>

                  <div className="mt-8 text-center text-sm text-gray-500">
                    Don&apos;t have an account? <button onClick={() => setActiveTab('register')} className="text-accent font-bold hover:underline">Create one</button>
                  </div>
                </div>
              ) : (
                /* Register Form */
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Create your account</h3>
                  <p className="text-sm text-gray-500 mb-6">Join Nexli Gadget and enjoy exclusive benefits.</p>
                  
                  <form className="space-y-4" onSubmit={handleRegister}>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full border border-gray-200 rounded px-4 py-3 outline-none focus:border-accent text-sm" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-start mt-2">
                      <input type="checkbox" id="terms" className="accent-accent rounded w-4 h-4 mt-1 mr-2" />
                      <label htmlFor="terms" className="text-xs text-gray-600 leading-tight">
                        I agree to the <Link href="#" className="text-accent hover:underline">Terms & Conditions</Link> and <Link href="#" className="text-accent hover:underline">Privacy Policy</Link>
                      </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded transition-colors mt-6 disabled:opacity-50">
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>

                  <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <button onClick={() => setActiveTab('login')} className="text-accent font-bold hover:underline">Login</button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
