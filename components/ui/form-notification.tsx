'use client';

import { Info } from 'lucide-react';

export function FormNotification() {
  return (
    <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 bg-purple-50 p-4 rounded-lg border border-purple-100">
      <Info className="h-5 w-5 text-purple-600 flex-shrink-0" />
      <p>Our representative will contact you officially within 24-48 business hours.</p>
    </div>
  );
}