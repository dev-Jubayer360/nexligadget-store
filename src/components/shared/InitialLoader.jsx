"use client";
import React, { useEffect, useState } from 'react';

export default function InitialLoader() {
  const [fadeOut, setFadeOut] = useState(false);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    // Check if it's the first visit in this session
    if (!sessionStorage.getItem('hasVisited')) {
      // Hold the spinner for 5 seconds to let background load
      const timer = setTimeout(() => {
        setFadeOut(true);
        sessionStorage.setItem('hasVisited', 'true');
        
        // Unmount after fade transition completes
        setTimeout(() => {
          setUnmount(true);
        }, 500); 
      }, 5000); 
      
      return () => clearTimeout(timer);
    } else {
      // Unmount immediately if already visited
      setUnmount(true);
    }
  }, []);

  if (unmount) return null;

  return (
    <div 
      id="initial-loader" 
      className={`fixed inset-0 z-[99999] bg-[#0b0c1b] flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px]"></div>
      
      <div className="relative flex flex-col items-center justify-center z-10">
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
           <div className="absolute inset-0 border-t-2 border-r-2 border-accent rounded-full animate-[spin_3s_linear_infinite] opacity-80"></div>
           <div className="absolute inset-2 border-b-2 border-l-2 border-white/20 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
           <div className="absolute inset-4 border-t-2 border-l-2 border-orange-400/50 rounded-full animate-[spin_4s_linear_infinite]"></div>
           
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(248,86,6,0.3)] animate-pulse">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f85606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                 </svg>
              </div>
           </div>
        </div>
        
        <h2 className="text-white text-2xl font-black tracking-widest mb-2">
          NEXLI<span className="text-accent">GADGET</span>
        </h2>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="text-gray-400 text-xs mt-6 tracking-[0.2em] uppercase font-bold">Booting System...</p>
      </div>
    </div>
  );
}
