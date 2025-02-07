'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye } from 'lucide-react';

export default function PrivacyPolicy() {
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
                Privacy Policy
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-900/20 blur-lg -z-10 animate-pulse-slow" />
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              How we protect and handle your personal information
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
                  <Shield className="w-8 h-8 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Information Collection and Use</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We collect information that you provide directly to us, including when you create an account, make a purchase, or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Name and contact information</li>
                  <li>Payment information</li>
                  <li>Device health monitoring data</li>
                  <li>Usage statistics and preferences</li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
                <div className="flex items-center mb-6">
                  <Lock className="w-8 h-8 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Data Security</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data centers and infrastructure</li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
                <div className="flex items-center mb-6">
                  <Eye className="w-8 h-8 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Your Rights</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}