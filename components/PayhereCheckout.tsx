// components/PayhereCheckout.tsx
'use client';

import { useEffect } from 'react';

interface PayherePayment {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hash: string;
}

interface PayhereCheckoutProps {
  payment: PayherePayment;
}

export default function PayhereCheckout({ payment }: PayhereCheckoutProps) {
  useEffect(() => {
    if (!payment) return;

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://sandbox.payhere.lk/pay/checkout'; // or production URL

    Object.entries(payment).forEach(([key, value]) => {
      if (value) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();

    return () => {
      document.body.removeChild(form);
    };
  }, [payment]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <h3 className="text-xl font-bold mb-4">Redirecting to PayHere</h3>
        <p className="mb-6">Please wait while we redirect you to the secure payment gateway...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    </div>
  );
}