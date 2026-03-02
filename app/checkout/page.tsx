'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { PayhereForm } from '@/components/ui/payhere-form';
import type { PayherePayment } from '@/lib/payhere';
import {
  ShieldCheck, Lock, ArrowLeft, ChevronRight, Package,
  Loader2, CreditCard, Truck, RefreshCw, CheckCircle, Globe, Phone, Mail, MapPin, User, Building2
} from 'lucide-react';
import Image from 'next/image';

const font = 'var(--font-red-hat-display),sans-serif';

interface CheckoutFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '11px 16px',
  borderRadius: 14,
  border: '1.5px solid #e2d8f0',
  background: '#f7f5fb',
  fontSize: 14,
  color: '#1f2937',
  outline: 'none',
  fontFamily: font,
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

function Field({ label, icon: Icon, children }: { label: string; icon?: any; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: '#4b5563' }}>
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: '#893A9F' }} />}
        {label} <span style={{ color: '#893A9F' }}>*</span>
      </label>
      {children}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [payment, setPayment] = useState<PayherePayment | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    first_name: '', last_name: '', email: '', phone: '',
    address: '', city: 'Colombo', country: 'Sri Lanka'
  });

  useEffect(() => {
    const handle = () => setPayment(null);
    window.addEventListener('popstate', handle);
    return () => window.removeEventListener('popstate', handle);
  }, []);

  const subtotal = cart.items.reduce((a, i) => a + i.products.price * i.quantity, 0);
  const total = subtotal;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) return;
    const form = e.target as HTMLFormElement;
    form.reset();
    setLoading(true);
    try {
      const itemsDescription = cart.items.map(i => `${i.products.name} (${i.quantity})`).join(', ');
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, amount: total.toFixed(2), items: itemsDescription }),
      });
      const result = await response.json();
      if (result.success && result.payherePayment) {
        setFormData({ first_name: '', last_name: '', email: '', phone: '', address: '', city: 'Colombo', country: 'Sri Lanka' });
        setPayment(result.payherePayment);
      } else {
        alert('Payment initiation failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inpStyle = (name: string): React.CSSProperties => ({
    ...inputBase,
    borderColor: focusField === name ? '#893A9F' : '#e2d8f0',
    boxShadow: focusField === name ? '0 0 0 3px rgba(137,58,159,0.1)' : 'none',
  });

  if (payment) return <PayhereForm payment={payment} />;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7f5fb', fontFamily: font }}>
        <div className="flex flex-col items-center text-center p-12 rounded-3xl max-w-md w-full mx-4" style={{ background: '#fff', border: '1px solid #ede8f5', boxShadow: '0 8px 40px rgba(137,58,159,0.1)' }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg,#f3edf8,#e9e0f5)' }}>
            <Package className="w-9 h-9" style={{ color: '#893A9F' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#1f2937' }}>Your cart is empty</h1>
          <p className="text-sm mb-8" style={{ color: '#6b7280' }}>Add JENDO devices to your cart before proceeding to checkout.</p>
          <button
            onClick={() => router.push('/products')}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#4a1260,#893A9F)', boxShadow: '0 8px 24px rgba(137,58,159,0.35)' }}
          >
            Browse Products <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f7f5fb', fontFamily: font }}>

      {/* ── Hero header ── */}
      <div style={{ background: 'linear-gradient(135deg,#2d0a3e 0%,#4a1260 45%,#893A9F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => router.push('/')}>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => router.push('/cart')}>Cart</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Checkout</span>
          </div>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" style={{ color: '#c084fc' }} />
                <span className="text-xs font-semibold" style={{ color: '#c084fc' }}>Secure Checkout</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Complete Your Order</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Review your items and fill in your billing details below</p>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </button>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-8">
            {[{ n: '1', label: 'Cart' }, { n: '2', label: 'Details' }, { n: '3', label: 'Payment' }].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={i < 2
                      ? { background: '#22c55e', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                    {i < 1 ? <CheckCircle className="w-4 h-4" /> : s.n}
                  </div>
                  <span className="text-xs font-semibold hidden sm:block" style={{ color: i < 2 ? '#fff' : 'rgba(255,255,255,0.4)' }}>{s.label}</span>
                </div>
                {i < 2 && <div className="w-8 h-px" style={{ background: i < 1 ? '#22c55e' : 'rgba(255,255,255,0.2)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* ── Left: Billing form ── */}
          <div className="rounded-3xl overflow-hidden" style={{ background: '#fff', border: '1px solid #ede8f5', boxShadow: '0 4px 24px rgba(137,58,159,0.06)' }}>
            <div className="px-7 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid #f0eaf8' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#4a1260,#893A9F)' }}>2</div>
              <div>
                <h2 className="font-bold text-base" style={{ color: '#1f2937' }}>Billing &amp; Shipping Information</h2>
                <p className="text-xs" style={{ color: '#9ca3af' }}>All fields marked * are required</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" icon={User}>
                  <input type="text" name="first_name" required value={formData.first_name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusField('first_name')} onBlur={() => setFocusField(null)}
                    style={inpStyle('first_name')} placeholder="John" />
                </Field>
                <Field label="Last Name" icon={User}>
                  <input type="text" name="last_name" required value={formData.last_name}
                    onChange={handleInputChange}
                    onFocus={() => setFocusField('last_name')} onBlur={() => setFocusField(null)}
                    style={inpStyle('last_name')} placeholder="Doe" />
                </Field>
              </div>

              <Field label="Email Address" icon={Mail}>
                <input type="email" name="email" required value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)}
                  style={inpStyle('email')} placeholder="john.doe@example.com" />
              </Field>

              <Field label="Phone Number" icon={Phone}>
                <input type="tel" name="phone" required value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setFocusField('phone')} onBlur={() => setFocusField(null)}
                  style={inpStyle('phone')} placeholder="+1 (555) 123-4567" />
              </Field>

              <Field label="Shipping Address" icon={MapPin}>
                <input type="text" name="address" required value={formData.address}
                  onChange={handleInputChange}
                  onFocus={() => setFocusField('address')} onBlur={() => setFocusField(null)}
                  style={inpStyle('address')} placeholder="Street address, apartment, suite, etc." />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City" icon={Building2}>
                  <input type="text" name="city" required value={formData.city}
                    onChange={handleInputChange}
                    onFocus={() => setFocusField('city')} onBlur={() => setFocusField(null)}
                    style={inpStyle('city')} placeholder="Colombo" />
                </Field>
                <Field label="Country" icon={Globe}>
                  <select name="country" required value={formData.country}
                    onChange={handleInputChange}
                    onFocus={() => setFocusField('country')} onBlur={() => setFocusField(null)}
                    style={{ ...inpStyle('country'), cursor: 'pointer' }}>
                    <option value="Sri Lanka">🇱🇰 Sri Lanka</option>
                    <option value="India">🇮🇳 India</option>
                    <option value="United States">🇺🇸 United States</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="Singapore">🇸🇬 Singapore</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="France">🇫🇷 France</option>
                    <option value="Japan">🇯🇵 Japan</option>
                  </select>
                </Field>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <ShieldCheck className="w-5 h-5 flex-shrink-0" style={{ color: '#16a34a' }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: '#15803d' }}>Your data is protected</p>
                  <p className="text-[11px]" style={{ color: '#4ade80', filter: 'brightness(0.7)' }}>256-bit SSL encryption · PCI DSS compliant · HIPAA aligned</p>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
                style={{
                  background: loading ? '#c4b5d4' : 'linear-gradient(135deg,#4a1260 0%,#893A9F 100%)',
                  boxShadow: loading ? 'none' : '0 8px 28px rgba(137,58,159,0.38)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing Payment…</>
                ) : (
                  <><Lock className="w-4 h-4" /> Pay ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD Securely</>
                )}
              </button>
            </form>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden sticky top-24" style={{ background: '#fff', border: '1px solid #ede8f5', boxShadow: '0 4px 24px rgba(137,58,159,0.06)' }}>
              <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #f0eaf8' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#4a1260,#893A9F)' }}>1</div>
                <h2 className="font-bold text-base" style={{ color: '#1f2937' }}>Order Summary</h2>
              </div>

              {/* Items */}
              <div className="px-6 pt-4 space-y-3">
                {cart.items.map(item => (
                  <div key={item.product_id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: '#f7f5fb', border: '1px solid #ede8f5' }}>
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '1px solid #e2d8f0' }}>
                      <Image src={item.products.image_url || '/jendo.jpeg'} alt={item.products.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#1f2937' }}>{item.products.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold flex-shrink-0" style={{ color: '#893A9F' }}>
                      ${(item.products.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-6 py-4 space-y-2.5 mt-2" style={{ borderTop: '1px solid #f0eaf8' }}>
                <div className="flex justify-between text-sm" style={{ color: '#6b7280' }}>
                  <span>Subtotal</span>
                  <span className="font-semibold" style={{ color: '#1f2937' }}>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: '#6b7280' }}>
                  <span>Shipping</span>
                  <span className="font-semibold" style={{ color: '#22c55e' }}>Free</span>
                </div>
                <div className="h-px" style={{ background: '#f0eaf8' }} />
                <div className="flex justify-between">
                  <span className="font-bold text-base" style={{ color: '#1f2937' }}>Total</span>
                  <div className="text-right">
                    <span className="font-bold text-xl" style={{ color: '#893A9F' }}>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <p className="text-[10px]" style={{ color: '#9ca3af' }}>USD · incl. taxes</p>
                  </div>
                </div>
              </div>

              {/* PayHere badge */}
              <div className="mx-6 mb-5 px-4 py-3 rounded-2xl flex items-center gap-3" style={{ background: 'linear-gradient(135deg,#2d0a3e,#4a1260)', }}>
                <CreditCard className="w-5 h-5 flex-shrink-0" style={{ color: '#c084fc' }} />
                <div>
                  <p className="text-xs font-bold text-white">Powered by PayHere</p>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Secure · Encrypted · Trusted</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {['VISA', 'MC'].map(b => (
                    <span key={b} className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery promises */}
            <div className="rounded-2xl px-5 py-4" style={{ background: '#fff', border: '1px solid #ede8f5' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#a78bca' }}>Delivery Promises</p>
              <div className="space-y-3">
                {[
                  { icon: Truck, label: 'Free worldwide shipping', sub: 'On all orders' },
                  { icon: ShieldCheck, label: 'Secure payment', sub: 'SSL & PCI compliant' },
                  { icon: RefreshCw, label: '30-day returns', sub: 'Hassle-free policy' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f3edf8' }}>
                      <Icon className="w-4 h-4" style={{ color: '#893A9F' }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-tight" style={{ color: '#1f2937' }}>{label}</p>
                      <p className="text-[10px]" style={{ color: '#9ca3af' }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}