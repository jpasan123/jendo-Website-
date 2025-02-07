'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FileText, Scale, AlertCircle } from 'lucide-react';

export default function TermsOfService() {
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
                Terms of Service
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-900/20 blur-lg -z-10 animate-pulse-slow" />
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services
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
                  <FileText className="w-8 h-8 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Agreement to Terms</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  By accessing or using JENDO's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
                <div className="flex items-center mb-6">
                  <Scale className="w-8 h-8 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Use License</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Permission is granted to temporarily use our products and services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software</li>
                  <li>Remove any copyright or proprietary notations</li>
                  <li>Transfer the materials to another person</li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
                <div className="flex items-center mb-6">
                  <AlertCircle className="w-8 h-8 text-purple-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Disclaimer</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Our services are provided "as is". JENDO makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
                  <li>Warranties or merchantability</li>
                  <li>Fitness for a particular purpose</li>
                  <li>Non-infringement of intellectual property</li>
                  <li>Accuracy, reliability, and availability of the service</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}