'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { PayhereForm } from '@/components/ui/payhere-form';
import type { PayherePayment } from '@/lib/payhere';
import { ShoppingCart, CreditCard, User, Mail, Phone, MapPin, Building2, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const router = useRouter();
  const cart = useCart();
  const [showPayhere, setShowPayhere] = useState(false);
  const [payment, setPayment] = useState<PayherePayment | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      alert('Please fill out all fields.');
      return;
    }

    // Call backend to get PayHere payment object
    fetch('/api/book-checkup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        phone: formData.phone,
        checkup_type: 'checkout',
        payment_method: 'payhere',
        amount: cart.items.reduce((acc, item) => acc + item.products.price * item.quantity, 0),
        currency: 'LKR',
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.payherePayment) {
          setPayment(data.payherePayment);
          setShowPayhere(true);
        } else {
          alert('Payment initiation failed.');
        }
      })
      .catch(() => alert('Payment initiation failed.'));
  };

  if (showPayhere && payment) {
    return <PayhereForm payment={payment} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </button>
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 flex flex-col md:flex-row gap-12">
          {/* Left: Order Summary */}
          <div className="md:w-2/5 w-full">
            <div className="mb-8 flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
            </div>
            <div className="space-y-6">
              {cart.items.length === 0 ? (
                <div className="text-gray-400 text-center py-12">Your cart is empty.</div>
              ) : (
                cart.items.map((item, idx) => (
                  <div key={item.product_id || idx} className="flex items-center gap-4 border-b pb-4">
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-16 h-16 rounded-xl object-cover border"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{item.products.name}</div>
                      <div className="text-gray-500 text-sm">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold text-purple-700 text-lg">
                      ${(item.products.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between text-xl font-semibold text-gray-900">
                <span>Total</span>
                <span>
                  ${cart.items.reduce((acc, item) => acc + item.products.price * item.quantity, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div className="md:w-3/5 w-full">
            <div className="mb-8 flex items-center gap-3">
              <CreditCard className="w-7 h-7 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Checkout Details</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <User className="w-4 h-4 text-purple-400" /> First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50/40"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <User className="w-4 h-4 text-purple-400" /> Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50/40"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Mail className="w-4 h-4 text-purple-400" /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50/40"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Phone className="w-4 h-4 text-purple-400" /> Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50/40"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-purple-400" /> Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50/40"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-purple-400" /> City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-purple-50/40"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg mt-4 text-lg flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to PayHere
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}