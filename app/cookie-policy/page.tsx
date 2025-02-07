'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Clock, Settings } from 'lucide-react';

export default function CookiePolicy() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white overflow-hidden section-scroll">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_80%)] animate-pulse-slow" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl font-bold mb-8 relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 bg-clip-text text-transparent animate-shine">
                Cookie Policy
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-900/20 blur-lg -z-10 animate-pulse-slow" />
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Understanding how we use cookies to improve your experience
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white section-scroll">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
                <div className="flex items-center mb-6">
                  <Cookie className="w-8 h-8 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">What Are Cookies</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide a better user experience.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
                <div className="flex items-center mb-6">
                  <Clock className="w-8 h-8 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">How We Use Cookies</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We use different types of cookies for various purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand user behavior</li>
                  <li>Preference cookies to remember your settings</li>
                  <li>Marketing cookies for targeted advertising</li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
                <div className="flex items-center mb-6">
                  <Settings className="w-8 h-8 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Managing Cookies</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  You can control and manage cookies in various ways:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Browser settings to block or delete cookies</li>
                  <li>Our cookie consent tool to manage preferences</li>
                  <li>Third-party opt-out tools</li>
                  <li>Device-specific settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}