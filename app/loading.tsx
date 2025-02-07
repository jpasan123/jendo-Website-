'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] z-50 flex items-center justify-center">
      <div className="text-center -mt-20">
        <div className="relative w-[300px] h-[150px] mx-auto mb-12">
          <Image
            src="https://i.ibb.co/cbTZ66m/OIP-8-removebg-preview.png"
            alt="JENOO Logo"
            fill
            className="object-contain animate-pulse-slow"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-[#9333EA] tracking-wider mb-8 animate-fade-in">
          JENDO INNOVATIONS
        </h1>
        <div className="flex justify-center space-x-4">
          <div className="w-3 h-3 bg-[#9333EA] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-[#9333EA] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-[#9333EA] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}