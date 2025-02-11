'use client';

import { useEffect } from 'react';
import type { PayherePayment } from '@/lib/payhere';
import { PAYHERE_FORM_FIELDS } from '@/lib/payhere';

interface PayhereFormProps {
  payment: PayherePayment;
}

export function PayhereForm({ payment }: PayhereFormProps) {
  useEffect(() => {
    // Automatically submit the form when component mounts
    const form = document.getElementById('payhere-form') as HTMLFormElement;
    if (form) {
      form.submit();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to PayHere</h2>
          <p className="text-gray-600">Please wait while we redirect you to the payment gateway...</p>
        </div>

        <form
          id="payhere-form"
          method="post"
          action="https://sandbox.payhere.lk/pay/checkout"
          className="hidden"
        >
          {PAYHERE_FORM_FIELDS.map((field) => (
            <input
              key={field}
              type="hidden"
              name={field}
              value={payment[field] as string}
            />
          ))}
        </form>

        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
}