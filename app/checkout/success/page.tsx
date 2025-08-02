'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccess() {
  const router = useRouter();
  const cart = useCart();

  useEffect(() => {
    // Clear cart after successful payment
    cart.clearCart();
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-100 py-32">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            You will receive a confirmation email with your order details.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/products')}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue Shopping
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}