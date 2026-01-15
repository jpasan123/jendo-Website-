'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { ChatBot } from '@/components/ui/chat-bot';
import Image from 'next/image';

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-[#1a1a1a] z-50 flex items-center justify-center">
          <div className="text-center -mt-20">
            <div className="relative w-[300px] h-[150px] mx-auto mb-8">
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
      ) : (
        <>
          <Header />
          <main className="min-h-screen pt-24">{children}</main>
          <Footer />
          <ScrollToTop />
          <ChatBot />
        </>
      )}
    </>
  );
}