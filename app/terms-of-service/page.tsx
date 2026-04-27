'use client';

import { FileText, Scale, AlertCircle, Ban, CreditCard, RefreshCw, Mail, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const font = 'var(--font-red-hat-display),sans-serif';

const sections = [
  { id: 'agreement',    label: 'Agreement to Terms',           icon: <FileText className="w-5 h-5" />,    no: '01' },
  { id: 'license',      label: 'Use License',                  icon: <Scale className="w-5 h-5" />,        no: '02' },
  { id: 'obligations',  label: 'User Responsibilities',        icon: <Ban className="w-5 h-5" />,          no: '03' },
  { id: 'ip',           label: 'Intellectual Property',        icon: <FileText className="w-5 h-5" />,     no: '04' },
  { id: 'payments',     label: 'Payments & Refunds',           icon: <CreditCard className="w-5 h-5" />,   no: '05' },
  { id: 'disclaimer',   label: 'Disclaimer & Liability',       icon: <AlertCircle className="w-5 h-5" />,  no: '06' },
  { id: 'changes',      label: 'Changes to Terms',             icon: <RefreshCw className="w-5 h-5" />,    no: '07' },
  { id: 'contact',      label: 'Contact Us',                   icon: <Mail className="w-5 h-5" />,         no: '08' },
];

function SectionCard({ id, no, icon, title, children }: { id: string; no: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-28">
      <div className="bg-white rounded-2xl p-8 md:p-10" style={{ border: '1px solid #ede8f5', boxShadow: '0 1px 3px rgba(137,58,159,0.06)' }}>
        <div className="flex items-start gap-5 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: '#893A9F' }}>
            {icon}
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#893A9F', fontFamily: font }}>Section {no}</p>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: font }}>{title}</h2>
          </div>
        </div>
        <div className="text-gray-600 leading-relaxed space-y-4" style={{ fontFamily: font }}>{children}</div>
      </div>
    </div>
  );
}

export default function TermsOfService() {
  const [active, setActive] = useState('agreement');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: font }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#2d0a3e 0%,#4a1260 45%,#893A9F 100%)' }} className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.2)' }}>Legal Document</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Effective: January 1, 2025 &nbsp;·&nbsp; Last updated: February 26, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-lg max-w-2xl" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Please read these terms carefully before accessing or using any of JENDO&apos;s products and services.
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: '#f9f9fb' }} className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex gap-10">

            {/* Sticky TOC */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div className="sticky top-24">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#893A9F' }}>Contents</p>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg transition-all"
                      style={{
                        color: active === s.id ? '#893A9F' : '#6b7280',
                        background: active === s.id ? '#f3edf8' : 'transparent',
                        fontWeight: active === s.id ? '600' : '400',
                        borderLeft: active === s.id ? '2px solid #893A9F' : '2px solid transparent',
                      }}
                    >
                      <ChevronRight className="w-3 h-3 flex-shrink-0" />
                      {s.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 p-4 rounded-xl" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                  <p className="text-xs text-gray-500 leading-relaxed">Questions about these terms? <a href="mailto:info@jendoinnovations.com" className="font-semibold" style={{ color: '#893A9F' }}>Contact us</a></p>
                </div>
              </div>
            </aside>

            {/* Sections */}
            <main className="flex-1 space-y-8">

              <SectionCard id="agreement" no="01" icon={<FileText className="w-5 h-5" />} title="Agreement to Terms">
                <p>By accessing or using JENDO&apos;s products, website, or services, you confirm that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                <p>If you do not agree with any part of these terms, you are prohibited from accessing or using our services. These terms apply to all visitors, users, and others who access the service.</p>
                <div className="p-4 rounded-xl text-sm" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                  <p className="font-semibold text-gray-700 mb-1">Important Note</p>
                  <p className="text-gray-600">JENDO&apos;s health monitoring devices are intended as wellness monitoring tools. They are not intended to diagnose, treat, cure, or prevent any disease. Please consult your healthcare provider for medical advice.</p>
                </div>
              </SectionCard>

              <SectionCard id="license" no="02" icon={<Scale className="w-5 h-5" />} title="Use License">
                <p>Subject to your compliance with these terms, JENDO grants you a limited, non-exclusive, non-transferable, revocable licence to access and use our services for personal, non-commercial purposes.</p>
                <p className="font-semibold text-gray-700">Under this licence, you may not:</p>
                <ul className="space-y-2 text-sm">
                  {['Modify, copy, or create derivative works from our software or content','Use the materials for any commercial purpose or public display','Attempt to decompile, reverse engineer, or disassemble any software','Remove any copyright, trademark, or proprietary notices','Transfer, sublicence, or otherwise assign the licence to another party','Use our platform in any way that violates applicable laws or regulations'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#893A9F' }} />{i}</li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard id="obligations" no="03" icon={<Ban className="w-5 h-5" />} title="User Responsibilities">
                <p>When using our services, you agree to:</p>
                <ul className="space-y-2 text-sm">
                  {['Provide accurate, current, and complete registration information','Maintain the security and confidentiality of your account credentials','Promptly notify us of any unauthorised access to your account','Use the service only for lawful purposes','Not transmit any harmful, offensive, or disruptive content','Comply with all applicable local, national, and international laws'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#893A9F' }} />{i}</li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard id="ip" no="04" icon={<FileText className="w-5 h-5" />} title="Intellectual Property">
                <p>The JENDO platform, including all content, features, and functionality — such as text, graphics, logos, software, algorithms, and design — is owned by JENDO Innovations and is protected by international copyright, trademark, patent, and other intellectual property laws.</p>
                <p>You may not use our trademarks, service marks, or trade names without prior written permission. Feedback or suggestions you provide may be used by us without any obligation to you.</p>
              </SectionCard>

              <SectionCard id="payments" no="05" icon={<CreditCard className="w-5 h-5" />} title="Payments & Refunds">
                <p>All purchases through our platform are subject to our pricing and payment terms. We use secure payment processors and do not store your full payment card details.</p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {['Prices are shown in USD unless stated otherwise','All fees are exclusive of applicable taxes','Subscriptions auto-renew unless cancelled','Pre-orders may be cancelled before shipping','Defective devices are eligible for replacement','Refunds processed within 5–10 business days'].map((i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm px-4 py-2.5 rounded-lg" style={{ background: '#f9f9fb', border: '1px solid #ede8f5' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#893A9F' }} />
                      {i}
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id="disclaimer" no="06" icon={<AlertCircle className="w-5 h-5" />} title="Disclaimer & Limitation of Liability">
                <p>Our services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
                <p>To the maximum extent permitted by applicable law, JENDO Innovations shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, revenue, or profits, arising from your use of or inability to use our services.</p>
                <div className="p-4 rounded-xl text-sm" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                  <p className="text-gray-600">Our total liability to you for all claims arising from or relating to these terms or your use of the service shall not exceed the amount you paid to JENDO in the twelve (12) months preceding the claim.</p>
                </div>
              </SectionCard>

              <SectionCard id="changes" no="07" icon={<RefreshCw className="w-5 h-5" />} title="Changes to Terms">
                <p>We reserve the right to modify or replace these Terms of Service at any time. We will provide notice of material changes by updating the &quot;Last updated&quot; date at the top of this page and, where appropriate, by sending you an email notification.</p>
                <p>Your continued use of our services after any changes constitutes your acceptance of the new terms. If you disagree with the updated terms, you should discontinue use of our services.</p>
              </SectionCard>

              <SectionCard id="contact" no="08" icon={<Mail className="w-5 h-5" />} title="Contact Us">
                <p>If you have any questions, concerns, or disputes regarding these Terms of Service, please contact our legal team:</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#893A9F' }}>Legal Team</p>
                    <p className="text-sm text-gray-700 font-medium">JENDO Innovations</p>
                    <a href="mailto:info@jendoinnovations.com" className="text-sm" style={{ color: '#893A9F' }}>info@jendoinnovations.com</a>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#893A9F' }}>Registered Address</p>
                    <p className="text-sm text-gray-700">8614 Mahogany Place<br/>Newark, CA 94560</p>
                  </div>
                </div>
              </SectionCard>

              {/* Related links */}
              <div className="pt-4">
                <p className="text-sm font-semibold text-gray-500 mb-3">Related Legal Documents</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/privacy-policy" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: 'white', border: '1px solid #ede8f5', color: '#893A9F' }}>Privacy Policy <ChevronRight className="w-4 h-4" /></Link>
                  <Link href="/cookie-policy" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: 'white', border: '1px solid #ede8f5', color: '#893A9F' }}>Cookie Policy <ChevronRight className="w-4 h-4" /></Link>
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}