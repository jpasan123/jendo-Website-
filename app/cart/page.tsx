'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Truck, RefreshCw, CreditCard, ChevronRight, Package } from 'lucide-react';
import Image from 'next/image';

const font = 'var(--font-red-hat-display),sans-serif';

export default function Cart() {
  const router = useRouter();
  const cart = useCart();

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    cart.updateQuantity(productId, newQuantity);
  };

  const removeItem = (productId: string) => {
    cart.removeItem(productId);
  };

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.products.price * item.quantity,
    0
  );
  const total = subtotal;

  const trustBadges = [
    { icon: ShieldCheck, label: 'Secure Payment', sub: 'SSL Encrypted' },
    { icon: Truck, label: 'Free Shipping', sub: 'On all orders' },
    { icon: RefreshCw, label: 'Easy Returns', sub: '30-day policy' },
    { icon: CreditCard, label: 'Flexible Pay', sub: 'Multiple methods' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f7f5fb', fontFamily: font }}>

      {/* Page hero strip */}
      <div style={{ background: 'linear-gradient(135deg,#2d0a3e 0%,#4a1260 45%,#893A9F 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-28">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium mb-4 transition-all hover:gap-3"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
          <div className="flex items-end gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Shopping Cart</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {cart.items.length === 0
                  ? 'Your cart is currently empty'
                  : `${cart.items.reduce((a, i) => a + i.quantity, 0)} item${cart.items.reduce((a, i) => a + i.quantity, 0) > 1 ? 's' : ''} in your cart`}
              </p>
            </div>
            {cart.items.length > 0 && (
              <div className="ml-auto hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}>
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Checkout
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#a78bca' }}>
          <span className="cursor-pointer hover:underline" onClick={() => router.push('/')}>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="cursor-pointer hover:underline" onClick={() => router.push('/products')}>Products</span>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#893A9F', fontWeight: 600 }}>Cart</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {cart.items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl mt-4" style={{ background: '#fff', border: '1px solid #ede8f5' }}>
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg,#f3edf8,#e9e0f5)' }}>
              <Package className="w-10 h-10" style={{ color: '#893A9F' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1f2937' }}>Your cart is empty</h2>
            <p className="text-sm mb-8 text-center max-w-xs" style={{ color: '#6b7280' }}>Looks like you have not added any items to your cart yet. Explore our products and find something you love.</p>
            <button
              onClick={() => router.push('/products')}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#4a1260,#893A9F)', boxShadow: '0 8px 24px rgba(137,58,159,0.35)' }}
            >
              Explore Products
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

            {/* ── Left: Cart items ── */}
            <div className="space-y-4">

              {/* Items card */}
              <div className="rounded-3xl overflow-hidden" style={{ background: '#fff', border: '1px solid #ede8f5', boxShadow: '0 4px 24px rgba(137,58,159,0.06)' }}>
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f0eaf8' }}>
                  <h2 className="font-bold text-base" style={{ color: '#1f2937' }}>Cart Items</h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#f3edf8', color: '#893A9F' }}>
                    {cart.items.reduce((a, i) => a + i.quantity, 0)} item{cart.items.reduce((a, i) => a + i.quantity, 0) > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="divide-y" style={{ borderColor: '#f5f0fb' }}>
                  {cart.items.map((item) => (
                    <div key={item.product_id} className="flex items-center gap-4 px-6 py-5">
                      {/* Product image */}
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: '#f7f5fb', border: '1px solid #ede8f5' }}>
                        <Image
                          src={item.products.image_url}
                          alt={item.products.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-snug truncate" style={{ color: '#1f2937' }}>{item.products.name}</h3>
                        <p className="text-xs mt-0.5 mb-3" style={{ color: '#9ca3af' }}>Medical Device · JENDO Inc.</p>
                        <div className="flex items-center gap-3">
                          {/* Qty control */}
                          <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid #e2d8f0', background: '#f7f5fb' }}>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center transition-all hover:bg-purple-50"
                              style={{ color: '#893A9F' }}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-sm font-bold" style={{ color: '#1f2937' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center transition-all hover:bg-purple-50"
                              style={{ color: '#893A9F' }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all hover:bg-red-50"
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold" style={{ color: '#1f2937' }}>
                          ${(item.products.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs" style={{ color: '#9ca3af' }}>${item.products.price.toLocaleString()} × {item.quantity}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {trustBadges.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl p-4" style={{ background: '#fff', border: '1px solid #ede8f5' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f3edf8,#e9e0f5)' }}>
                      <Icon className="w-4 h-4" style={{ color: '#893A9F' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight" style={{ color: '#1f2937' }}>{label}</p>
                      <p className="text-[10px]" style={{ color: '#9ca3af' }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Order summary ── */}
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden sticky top-24" style={{ background: '#fff', border: '1px solid #ede8f5', boxShadow: '0 4px 24px rgba(137,58,159,0.06)' }}>
                <div className="px-6 py-4" style={{ borderBottom: '1px solid #f0eaf8' }}>
                  <h2 className="font-bold text-base" style={{ color: '#1f2937' }}>Order Summary</h2>
                </div>

                <div className="px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm" style={{ color: '#6b7280' }}>
                    <span>Subtotal</span>
                    <span className="font-semibold" style={{ color: '#1f2937' }}>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: '#6b7280' }}>
                    <span>Shipping</span>
                    <span className="font-semibold" style={{ color: '#22c55e' }}>Free</span>
                  </div>
                  <div className="h-px my-1" style={{ background: '#f0eaf8' }} />
                  <div className="flex justify-between">
                    <span className="font-bold text-base" style={{ color: '#1f2937' }}>Total</span>
                    <span className="font-bold text-xl" style={{ color: '#893A9F' }}>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-[10px]" style={{ color: '#9ca3af' }}>Inclusive of all applicable taxes · USD</p>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6 space-y-3">
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg,#4a1260 0%,#893A9F 100%)', boxShadow: '0 8px 28px rgba(137,58,159,0.38)' }}
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push('/products')}
                    className="w-full py-3 rounded-2xl text-sm font-semibold transition-all hover:bg-purple-50"
                    style={{ color: '#893A9F', border: '1.5px solid #e2d8f0' }}
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Secure badge */}
                <div className="flex items-center justify-center gap-2 pb-5">
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#a78bca' }} />
                  <p className="text-[10px] font-medium" style={{ color: '#a78bca' }}>
                    256-bit SSL Encryption · PCI DSS Compliant
                  </p>
                </div>
              </div>


            </div>
          </div>
        )}
      </div>
    </div>
  );
}