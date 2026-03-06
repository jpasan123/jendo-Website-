'use client';

import { Shield, Lock, Eye, Database, Clock, UserCheck, Mail, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const font = 'var(--font-red-hat-display),sans-serif';

const sections = [
  { id: 'collection',  label: 'Information We Collect',      icon: <Database className="w-5 h-5" />,   no: '01' },
  { id: 'use',         label: 'How We Use Your Information', icon: <Eye className="w-5 h-5" />,         no: '02' },
  { id: 'sharing',     label: 'Data Sharing & Disclosure',   icon: <Shield className="w-5 h-5" />,      no: '03' },
  { id: 'security',    label: 'Data Security',               icon: <Lock className="w-5 h-5" />,        no: '04' },
  { id: 'rights',      label: 'Your Rights',                 icon: <UserCheck className="w-5 h-5" />,   no: '05' },
  { id: 'retention',   label: 'Data Retention',              icon: <Clock className="w-5 h-5" />,       no: '06' },
  { id: 'contact',     label: 'Contact Us',                  icon: <Mail className="w-5 h-5" />,        no: '07' },
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

export default function PrivacyPolicy() {
  const [active, setActive] = useState('collection');

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-lg max-w-2xl" style={{ color: 'rgba(255,255,255,0.72)' }}>
            How JENDO Innovations collects, uses, and protects your personal information in accordance with applicable data protection laws.
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
                  <p className="text-xs text-gray-500 leading-relaxed">Questions about this policy? <a href="mailto:info@jendoinnovations.com" className="font-semibold" style={{ color: '#893A9F' }}>Contact us</a></p>
                </div>
              </div>
            </aside>

            {/* Sections */}
            <main className="flex-1 space-y-8">

              <SectionCard id="collection" no="01" icon={<Database className="w-5 h-5" />} title="Information We Collect">
                <p>We collect information that you provide directly to us, including when you create an account, make a purchase, register a device, or contact us for support.</p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {['Name and contact information','Payment and billing details','Device health monitoring data','Usage statistics and preferences','Account credentials','Communication records'].map((i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm px-4 py-2.5 rounded-lg" style={{ background: '#f9f9fb', border: '1px solid #ede8f5' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#893A9F' }} />
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm pt-2 text-gray-500">We also collect information automatically when you use our services, including log data, device information, and usage patterns through cookies and similar technologies.</p>
              </SectionCard>

              <SectionCard id="use" no="02" icon={<Eye className="w-5 h-5" />} title="How We Use Your Information">
                <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you about your account and updates.</p>
                <ul className="space-y-2 text-sm">
                  {['Provide and operate the JENDO platform and connected devices','Process payments and fulfil orders','Send service-related communications and updates','Personalise your experience and improve our AI health algorithms','Comply with legal obligations and enforce our terms','Conduct research and analytics to improve patient outcomes'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#893A9F' }} />{i}</li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard id="sharing" no="03" icon={<Shield className="w-5 h-5" />} title="Data Sharing & Disclosure">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:</p>
                <ul className="space-y-2 text-sm">
                  {['With service providers who assist in operating our platform (under strict confidentiality agreements)','With healthcare providers you have authorised to access your data','In response to lawful requests by public authorities, including national security requirements','In connection with a merger, acquisition, or sale of assets (with prior notice)','With your explicit consent for any other purpose'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#893A9F' }} />{i}</li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard id="security" no="04" icon={<Lock className="w-5 h-5" />} title="Data Security">
                <p>We implement industry-leading technical and organisational security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction.</p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {['AES-256 encryption at rest','TLS 1.3 encryption in transit','Multi-factor authentication','Regular third-party security audits','ISO 27001-aligned controls','Role-based access control'].map((i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm px-4 py-2.5 rounded-lg" style={{ background: '#f9f9fb', border: '1px solid #ede8f5' }}>
                      <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#893A9F' }} />
                      {i}
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id="rights" no="05" icon={<UserCheck className="w-5 h-5" />} title="Your Rights">
                <p>Depending on your jurisdiction, you may have the following rights regarding your personal information. To exercise any of these rights, please contact our Data Protection Officer.</p>
                <ul className="space-y-2 text-sm">
                  {['Right of access — obtain a copy of your personal data','Right to rectification — correct inaccurate or incomplete data','Right to erasure — request deletion of your data (&quot;right to be forgotten&quot;)','Right to restriction — limit how we process your data','Right to data portability — receive your data in a machine-readable format','Right to object — object to processing based on legitimate interests','Right to withdraw consent — withdraw consent at any time','Right to lodge a complaint — with your local supervisory authority'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#893A9F' }} /><span dangerouslySetInnerHTML={{ __html: i }} /></li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard id="retention" no="06" icon={<Clock className="w-5 h-5" />} title="Data Retention">
                <p>We retain personal information only for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required by law.</p>
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-sm">
                    <thead><tr style={{ borderBottom: '2px solid #ede8f5' }}><th className="text-left py-3 pr-4 font-semibold text-gray-700">Data Type</th><th className="text-left py-3 font-semibold text-gray-700">Retention Period</th></tr></thead>
                    <tbody className="divide-y" style={{ borderColor: '#ede8f5' }}>
                      {[['Account data','Duration of account + 3 years'],['Health monitoring data','7 years (medical records standard)'],['Payment records','7 years (financial compliance)'],['Communication logs','2 years'],['Analytics data','24 months (anonymised)']].map(([type, period]) => (
                        <tr key={type}><td className="py-3 pr-4 text-gray-600">{type}</td><td className="py-3 font-medium" style={{ color: '#893A9F' }}>{period}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <SectionCard id="contact" no="07" icon={<Mail className="w-5 h-5" />} title="Contact Us">
                <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer:</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#893A9F' }}>Data Protection Officer</p>
                    <p className="text-sm text-gray-700 font-medium">JENDO Innovations</p>
                    <a href="mailto:info@jendoinnovations.com" className="text-sm" style={{ color: '#893A9F' }}>info@jendoinnovations.com</a>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#893A9F' }}>Registered Address</p>
                    <p className="text-sm text-gray-700">251, Little Falls Drive,<br/>Wilmington, Delaware, USA</p>
                  </div>
                </div>
              </SectionCard>

              {/* Related links */}
              <div className="pt-4">
                <p className="text-sm font-semibold text-gray-500 mb-3">Related Legal Documents</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/terms-of-service" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: 'white', border: '1px solid #ede8f5', color: '#893A9F' }}>Terms of Service <ChevronRight className="w-4 h-4" /></Link>
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