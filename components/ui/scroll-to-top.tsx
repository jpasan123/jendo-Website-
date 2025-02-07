'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed z-40 p-3 rounded-full shadow-lg transition-all duration-300",
        "bg-purple-600 hover:bg-purple-700 text-white",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        "bottom-20 right-4 sm:bottom-6 sm:right-20", // Adjusted positioning for mobile
        isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}