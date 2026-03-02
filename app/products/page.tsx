'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CheckCircle, Package, Heart, Activity, Brain, Microscope,
  BarChart3, ShieldCheck, PieChart, Shield, Wifi, BatteryFull,
  Cpu, Database, Plug, FileText, ChevronRight, Zap, Award,
  Globe, Stethoscope, ArrowRight, Star
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

const font = 'var(--font-red-hat-display),sans-serif';

export default function Products() {
  const router = useRouter();
  const cart = useCart();

  const addToCart = (product: any) => {
    cart.addItem({ product_id: product.id, quantity: 1, products: product });
    toast.success(`${product.name} added to cart`);
  };

  const features = [
    { icon: Heart,       title: 'Advanced Heart Monitoring',  desc: 'Continuous real-time monitoring of cardiovascular health indicators with clinical-grade precision.' },
    { icon: Activity,    title: 'Real-Time Analysis',         desc: 'Instant waveform analysis of vascular health data — zero-latency insights at your fingertips.' },
    { icon: Brain,       title: 'AI-Powered Insights',        desc: 'Three-tier machine learning engine delivering predictive analysis and early anomaly detection.' },
    { icon: Microscope,  title: 'Precision Measurements',     desc: 'Non-invasive, highly accurate photoplethysmography with multi-wavelength optical sensing.' },
    { icon: BarChart3,   title: 'Comprehensive Reports',      desc: 'Exportable clinical reports with longitudinal trend analysis and patient progress tracking.' },
    { icon: ShieldCheck, title: 'Data Security',              desc: 'Enterprise-grade AES-256 encryption and role-based access for full patient data protection.' },
    { icon: PieChart,    title: 'Analytics Dashboard',        desc: 'Interactive clinical dashboard for data visualisation, filtering, and cohort comparison.' },
    { icon: Shield,      title: 'HIPAA Compliant',            desc: 'Certified compliant with HIPAA, GDPR, and international healthcare data regulations.' },
  ];

  const hwSpecs = [
    { icon: Cpu,        label: 'Sensor Type',    value: 'Advanced optical sensors with multi-wavelength capability' },
    { icon: Zap,        label: 'Resolution',     value: 'High-precision 24-bit ADC for accurate measurements' },
    { icon: Wifi,       label: 'Connectivity',   value: 'Bluetooth 5.0 · Wi-Fi 6 · USB-C' },
    { icon: BatteryFull,label: 'Battery Life',   value: 'Up to 12 hours continuous operation' },
  ];

  const swSpecs = [
    { icon: Brain,    label: 'AI Algorithms',  value: 'Advanced AI-powered analysis with real-time processing' },
    { icon: Database, label: 'Data Storage',   value: 'Secure cloud storage with local backup options' },
    { icon: Plug,     label: 'Integration',    value: 'Full API support for EMR / EHR systems' },
    { icon: FileText, label: 'Reporting',      value: 'Customisable PDF & Excel reports with trend analysis' },
  ];

  const certBadges = [
    { label: 'CE Marked', sub: 'EU Medical Devices' },
    { label: 'HIPAA', sub: 'Data Compliance' },
    { label: 'GDPR', sub: 'Privacy Compliant' },
    { label: 'ISO 13485', sub: 'Quality Management' },
    { label: 'FDA 510(k)', sub: 'Clearance Pending' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f7f5fb', fontFamily: font }}>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#2d0a3e 0%,#4a1260 45%,#893A9F 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative orb */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(192,132,252,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(137,58,159,0.25) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => router.push('/')}>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Products</span>
          </div>

          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(255,255,255,0.1)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' }}>
              <Stethoscope className="w-3.5 h-3.5" />
              Clinical-Grade Vascular Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
              Our Products
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '540px' }}>
              Revolutionary AI-powered vascular monitoring solutions trusted by healthcare professionals worldwide.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
              >
                View Pricing <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/#contact')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: '#fff', color: '#893A9F' }}
              >
                Request Demo
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '99.7%', label: 'Measurement Accuracy' },
              { value: '12h+', label: 'Battery Life' },
              { value: '3-Tier', label: 'AI Intelligence' },
              { value: 'HIPAA', label: 'Certified Compliant' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Certification strip ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ede8f5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-3 justify-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#a78bca' }}>Certifications &amp; Compliance</p>
          <div className="flex flex-wrap gap-2">
            {certBadges.map(c => (
              <div key={c.label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: '#f3edf8', border: '1px solid #e2d8f0' }}>
                <Award className="w-3 h-3" style={{ color: '#893A9F' }} />
                <span className="text-[11px] font-bold" style={{ color: '#1f2937' }}>{c.label}</span>
                <span className="text-[10px]" style={{ color: '#9ca3af' }}>{c.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Key Features ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#893A9F' }}>Why Choose JENDO</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1f2937' }}>Key Features</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#6b7280' }}>Advanced technology for superior vascular monitoring — built for clinicians, designed for patients.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ background: '#fff', border: '1px solid #ede8f5', boxShadow: '0 2px 12px rgba(137,58,159,0.05)' }}
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#f3edf8,#e9e0f5)' }}>
                <f.icon className="w-5 h-5" style={{ color: '#893A9F' }} />
              </div>
              <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: '#1f2937' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pricing / Product Comparison ── */}
      <div id="pricing" style={{ background: 'linear-gradient(180deg,#f7f5fb 0%,#fff 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#893A9F' }}>Transparent Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1f2937' }}>Choose Your Plan</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#6b7280' }}>Select the JENDO solution that best fits your clinical practice or organisation.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">

            {/* Standard */}
            <div className="relative rounded-3xl overflow-hidden" style={{ background: '#fff', border: '2px solid #c084fc', boxShadow: '0 12px 40px rgba(137,58,159,0.14)' }}>
              {/* Popular badge */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right,#4a1260,#893A9F,#c084fc)' }} />
              <div className="absolute top-4 right-5">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold" style={{ background: 'linear-gradient(135deg,#4a1260,#893A9F)', color: '#fff' }}>
                  <Star className="w-3 h-3 fill-current" /> Most Popular
                </div>
              </div>

              <div className="p-7 pt-8">
                <div className="flex gap-5 mb-6">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0" style={{ border: '1px solid #ede8f5' }}>
                    <Image src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg" alt="JENDO Pro Device" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a78bca' }}>Standard Package</p>
                    <h3 className="text-2xl font-bold leading-tight mb-1" style={{ color: '#1f2937' }}>JENDO Pro</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold" style={{ color: '#893A9F' }}>$2,400</span>
                      <span className="text-sm" style={{ color: '#9ca3af' }}>/year</span>
                    </div>
                    <button
                      onClick={() => addToCart({
                        id: 'pro-package',
                        name: 'JENDO Pro Device',
                        // price: 2400,
                        image_url: 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg',
                        description: 'Professional vascular monitoring system for clinics'
                      })}
                      className="mt-4 w-full bg-purple-600 text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

                <div className="h-px mb-5" style={{ background: '#f0eaf8' }} />

                <ul className="space-y-3 mb-6">
                  {['JENDO Pro Device', '1-Year Software License', 'Priority Support', 'Advanced Analytics', 'Clinical Report Generator', 'Cloud Data Backup'].map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f0eaf8' }}>
                        <CheckCircle className="w-3.5 h-3.5" style={{ color: '#893A9F' }} />
                      </div>
                      <span className="text-sm" style={{ color: '#374151' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => addToCart({ id: 'pro-package', name: 'JENDO Pro Device', price: 2400, image_url: 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg', description: 'Professional vascular monitoring system' })}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#4a1260 0%,#893A9F 100%)', boxShadow: '0 8px 24px rgba(137,58,159,0.35)' }}
                >
                  <Package className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </div>

            {/* Enterprise */}
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e0533 0%,#2d0a3e 60%,#4a1260 100%)', border: '2px solid rgba(192,132,252,0.25)', boxShadow: '0 12px 40px rgba(45,10,62,0.35)' }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right,#c084fc,#e879f9,#c084fc)' }} />

              <div className="p-7 pt-8">
                <div className="flex gap-5 mb-6">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                    <Image src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg" alt="JENDO Enterprise" fill className="object-cover" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(45,10,62,0.6) 100%)' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(192,132,252,0.7)' }}>Enterprise Package</p>
                    <h3 className="text-2xl font-bold leading-tight mb-1 text-white">JENDO Enterprise</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold" style={{ color: '#c084fc' }}>Custom</span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Tailored to your organisation</p>
                  </div>
                </div>

                <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.08)' }} />

                <ul className="space-y-3 mb-6">
                  {['Multiple JENDO Devices', 'Enterprise Software License', '24/7 Premium Support', 'Custom EMR/EHR Integration', 'Dedicated Account Manager', 'On-site Training & Setup'].map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(192,132,252,0.15)' }}>
                        <CheckCircle className="w-3.5 h-3.5" style={{ color: '#c084fc' }} />
                      </div>
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => router.push('/contact')}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                >
                  <Globe className="w-4 h-4" /> Contact Sales
                </button>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs mt-6" style={{ color: '#a78bca' }}>
            All prices in USD · Volume discounts available · Free shipping worldwide
          </p>
        </div>
      </div>

      {/* ── Technical Specifications ── */}
      <div style={{ background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#893A9F' }}>Under the Hood</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1f2937' }}>Technical Specifications</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#6b7280' }}>Detailed specifications of our monitoring devices — engineered for clinical environments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hardware */}
            <div className="rounded-3xl p-7" style={{ background: '#f7f5fb', border: '1px solid #ede8f5' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4a1260,#893A9F)' }}>
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#1f2937' }}>Hardware Specifications</h3>
              </div>
              <div className="space-y-4">
                {hwSpecs.map(s => (
                  <div key={s.label} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid #ede8f5' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f3edf8,#e9e0f5)' }}>
                      <s.icon className="w-4 h-4" style={{ color: '#893A9F' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-0.5" style={{ color: '#893A9F' }}>{s.label}</p>
                      <p className="text-sm" style={{ color: '#374151' }}>{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Software */}
            <div className="rounded-3xl p-7" style={{ background: '#f7f5fb', border: '1px solid #ede8f5' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4a1260,#893A9F)' }}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#1f2937' }}>Software Capabilities</h3>
              </div>
              <div className="space-y-4">
                {swSpecs.map(s => (
                  <div key={s.label} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid #ede8f5' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f3edf8,#e9e0f5)' }}>
                      <s.icon className="w-4 h-4" style={{ color: '#893A9F' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-0.5" style={{ color: '#893A9F' }}>{s.label}</p>
                      <p className="text-sm" style={{ color: '#374151' }}>{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{ background: 'linear-gradient(135deg,#2d0a3e 0%,#4a1260 50%,#893A9F 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%,rgba(192,132,252,0.15) 0%,transparent 60%)', pointerEvents: 'none' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: 'rgba(255,255,255,0.1)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' }}>
            <Zap className="w-3.5 h-3.5" /> Transform Your Practice Today
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">Ready to elevate patient care?</h2>
          <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Join clinicians worldwide leveraging JENDO&apos;s AI-powered vascular intelligence for earlier diagnosis and better outcomes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
            >
              View Pricing <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/#contact')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{ background: '#fff', color: '#893A9F' }}
            >
              Book a Demo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}