'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { PayhereForm } from '@/components/ui/payhere-form';

export default function Cart() {
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          userId: 'user-id', // Replace with actual user ID from auth
          shippingAddress: {
            firstName: 'John', // Replace with form data
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '1234567890',
            address: 'shipping-address',
            city: 'Colombo',
          },
        }),
      });

      const { payment } = await response.json();
      setPayment(payment);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    cart.updateQuantity(productId, newQuantity);
  };

  const removeItem = (productId: string) => {
    cart.removeItem(productId);
  };

  const total = cart.items.reduce(
    (acc, item) => acc + item.products.price * item.quantity,
    0
  );

  if (payment) {
    return <PayhereForm payment={payment} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between border-b border-gray-200 pb-6"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.products.name}
                        </h3>
                        <p className="text-gray-500">${item.products.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity - 1)
                          }
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product_id, item.quantity + 1)
                          }
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="flex justify-between text-xl font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="mt-8 w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}