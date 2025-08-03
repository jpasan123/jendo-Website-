'use client';

import { useEffect } from 'react';
import type { PayherePayment } from '@/lib/payhere';
import { PAYHERE_BASE_URL } from '@/lib/payhere';
import { Shield, CreditCard, CheckCircle } from 'lucide-react';

interface PayhereFormProps {
  payment: PayherePayment;
}

export function PayhereForm({ payment }: PayhereFormProps) {
  useEffect(() => {
    // Automatically submit the form immediately when component mounts
    const form = document.getElementById('payhere-form') as HTMLFormElement;
    if (form) {
      // Submit immediately without delay
      form.submit();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-purple-900/20 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse-slow" />
      </div>
      
      <div className="relative max-w-lg w-full">
        {/* Main card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
          <div className="relative bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-900 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Secure Payment
              </h2>
              <p className="text-gray-600 text-lg mb-2">
                Redirecting to PayHere Gateway
              </p>
              <p className="text-sm text-gray-500">
                Please wait while we securely redirect you to complete your payment...
              </p>
            </div>

            {/* Payment details card */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Payment Amount</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {payment.currency} {typeof payment.amount === 'number' ? payment.amount.toFixed(2) : payment.amount}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                    {payment.order_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="text-right max-w-48 truncate">
                    {payment.items}
                  </span>
                </div>
              </div>
            </div>

            {/* Loading animation */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute inset-0"></div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="text-sm text-gray-500">
                  Preparing secure connection...
                </p>
              </div>
            </div>

            {/* Security badges */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PayHere form - hidden */}
        <form
          id="payhere-form"
          method="post"
          action={PAYHERE_BASE_URL}
          className="hidden"
        >
          {Object.entries(payment).map(([key, value]) => (
            <input
              key={key}
              type="hidden"
              name={key}
              value={value?.toString() || ''}
            />
          ))}
        </form>

        {/* Powered by Jendo */}
        <div className="text-center mt-6">
          <p className="text-white/70 text-sm">
            Powered by <span className="font-semibold text-purple-300">JENDO</span>
          </p>
        </div>
      </div>
    </div>
  );
}