'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { ChatBot } from '@/components/ui/chat-bot';
import Image from 'next/image';

const font = 'var(--font-red-hat-display),sans-serif';

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) { clearInterval(interval); return 95; }
        return p + Math.random() * 12;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      {loading ? (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#0d0118 0%,#1a0530 50%,#2d0a3e 100%)', fontFamily: font }}
        >
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(137,58,159,0.18) 0%,transparent 70%)' }} />

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Logo container */}
            <div
              className="relative flex items-center justify-center"
              style={{
                width: 120, height: 120,
                borderRadius: 32,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 0 60px rgba(137,58,159,0.25)',
              }}
            >
              <Image
                src="https://i.ibb.co/cbTZ66m/OIP-8-removebg-preview.png"
                alt="JENDO Logo"
                width={88}
                height={88}
                className="object-contain"
                priority
              />
            </div>

            {/* Brand text */}
            <div className="text-center">
              <h1
                className="text-2xl font-bold tracking-[0.3em] uppercase"
                style={{ color: '#fff', letterSpacing: '0.3em' }}
              >
                JENDO
              </h1>
              <p
                className="text-xs font-medium tracking-[0.25em] uppercase mt-1.5"
                style={{ color: 'rgba(192,132,252,0.7)', letterSpacing: '0.25em' }}
              >
                INNOVATIONS
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-48 flex flex-col gap-2">
              <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(to right,#6b21a8,#c084fc)',
                    boxShadow: '0 0 8px rgba(192,132,252,0.6)',
                  }}
                />
              </div>
              <p className="text-center text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                Loading experience…
              </p>
            </div>
          </div>

          {/* Bottom tagline */}
          <p
            className="absolute bottom-10 text-[11px] font-medium tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}
          >
            AI-Powered Vascular Health
          </p>
        </div>
      ) : (
        <>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
          <ChatBot />
        </>
      )}
    </>
  );
}