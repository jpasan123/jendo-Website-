'use client';

import { Cookie, Clock, Settings, Shield, RefreshCw, Mail, ChevronRight, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const font = 'var(--font-red-hat-display),sans-serif';

const sections = [
  { id: 'what',       label: 'What Are Cookies',          icon: <Cookie className="w-5 h-5" />,   no: '01' },
  { id: 'types',      label: 'Types of Cookies We Use',   icon: <Info className="w-5 h-5" />,     no: '02' },
  { id: 'howweuse',   label: 'How We Use Cookies',        icon: <Clock className="w-5 h-5" />,    no: '03' },
  { id: 'managing',   label: 'Managing Your Cookies',     icon: <Settings className="w-5 h-5" />, no: '04' },
  { id: 'thirdparty', label: 'Third-Party Cookies',       icon: <Shield className="w-5 h-5" />,   no: '05' },
  { id: 'updates',    label: 'Updates to This Policy',    icon: <RefreshCw className="w-5 h-5" />,no: '06' },
  { id: 'contact',    label: 'Contact Us',                icon: <Mail className="w-5 h-5" />,     no: '07' },
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

const cookieTypes = [
  { name: 'Essential Cookies', desc: 'Required for the website to function properly. Cannot be disabled.', duration: 'Session / 1 year', example: 'Authentication, security tokens' },
  { name: 'Analytics Cookies', desc: 'Help us understand how visitors interact with our website.', duration: 'Up to 24 months', example: 'Google Analytics, Hotjar' },
  { name: 'Preference Cookies', desc: 'Remember your settings and personalise your experience.', duration: 'Up to 12 months', example: 'Language, theme, region' },
  { name: 'Marketing Cookies', desc: 'Used to deliver relevant advertising and track campaign performance.', duration: 'Up to 90 days', example: 'Meta Pixel, Google Ads' },
];

export default function CookiePolicy() {
  const [active, setActive] = useState('what');

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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-lg max-w-2xl" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Understanding how JENDO Innovations uses cookies and similar tracking technologies to improve your browsing experience.
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
                  <p className="text-xs text-gray-500 leading-relaxed">Questions about cookies? <a href="mailto:info@jendoinnovations.com" className="font-semibold" style={{ color: '#893A9F' }}>Contact us</a></p>
                </div>
              </div>
            </aside>

            {/* Sections */}
            <main className="flex-1 space-y-8">

              <SectionCard id="what" no="01" icon={<Cookie className="w-5 h-5" />} title="What Are Cookies">
                <p>Cookies are small text files placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work efficiently, enhance user experience, and provide information to the site owners.</p>
                <p>Similar technologies include web beacons, pixels, local storage, and session storage. This policy covers all such technologies collectively referred to as &quot;cookies&quot;.</p>
                <div className="p-4 rounded-xl text-sm" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                  <p className="text-gray-600">Cookies cannot access other information on your device, install software, or carry viruses. They are simply data files that help make your web experience better.</p>
                </div>
              </SectionCard>

              <SectionCard id="types" no="02" icon={<Info className="w-5 h-5" />} title="Types of Cookies We Use">
                <p>We use the following categories of cookies on our platform:</p>
                <div className="space-y-3 pt-2">
                  {cookieTypes.map((ct) => (
                    <div key={ct.name} className="p-5 rounded-xl" style={{ background: '#f9f9fb', border: '1px solid #ede8f5' }}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">{ct.name}</p>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#f3edf8', color: '#893A9F' }}>{ct.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{ct.desc}</p>
                      <p className="text-xs text-gray-400 mt-1.5">Examples: {ct.example}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard id="howweuse" no="03" icon={<Clock className="w-5 h-5" />} title="How We Use Cookies">
                <p>We use cookies for the following purposes on the JENDO platform:</p>
                <ul className="space-y-2 text-sm">
                  {['Keep you signed in to your account securely','Remember your preferences and personalisation settings','Understand how you navigate and use our website','Measure the effectiveness of our marketing campaigns','Detect and prevent fraudulent or abusive activity','Improve the performance and reliability of our services','Provide you with relevant content and product recommendations'].map((i) => (
                    <li key={i} className="flex items-start gap-2"><ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#893A9F' }} />{i}</li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard id="managing" no="04" icon={<Settings className="w-5 h-5" />} title="Managing Your Cookies">
                <p>You have control over the cookies placed on your device. Most browsers allow you to view, manage, and delete cookies. Please note that disabling certain cookies may affect the functionality of our website.</p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {[['Chrome','chrome://settings/cookies'],['Firefox','about:preferences#privacy'],['Safari','Preferences → Privacy'],['Edge','edge://settings/privacy'],['Opera','Settings → Privacy'],['Mobile','Device Settings → Browser']].map(([browser, path]) => (
                    <div key={browser} className="flex items-start gap-2.5 text-sm px-4 py-3 rounded-lg" style={{ background: '#f9f9fb', border: '1px solid #ede8f5' }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#893A9F' }} />
                      <div><p className="font-medium text-gray-700">{browser}</p><p className="text-xs text-gray-500">{path}</p></div>
                    </div>
                  ))}
                </div>
                <p className="text-sm pt-2 text-gray-500">You can also opt out of specific analytics tools: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="font-medium" style={{ color: '#893A9F' }}>Google Analytics Opt-out</a></p>
              </SectionCard>

              <SectionCard id="thirdparty" no="05" icon={<Shield className="w-5 h-5" />} title="Third-Party Cookies">
                <p>Some cookies on our website are placed by third-party services we use. These third parties may use cookies independently and have their own privacy policies, which we encourage you to review.</p>
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-sm">
                    <thead><tr style={{ borderBottom: '2px solid #ede8f5' }}><th className="text-left py-3 pr-4 font-semibold text-gray-700">Provider</th><th className="text-left py-3 pr-4 font-semibold text-gray-700">Purpose</th><th className="text-left py-3 font-semibold text-gray-700">Type</th></tr></thead>
                    <tbody className="divide-y" style={{ borderColor: '#ede8f5' }}>
                      {[['Google Analytics','Usage analytics','Analytics'],['Google Ads','Advertising','Marketing'],['Meta Pixel','Ad performance','Marketing'],['Stripe','Payments','Essential'],['Supabase','Authentication','Essential']].map(([provider, purpose, type]) => (
                        <tr key={provider}><td className="py-3 pr-4 font-medium text-gray-700">{provider}</td><td className="py-3 pr-4 text-gray-600">{purpose}</td><td className="py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#f3edf8', color: '#893A9F' }}>{type}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <SectionCard id="updates" no="06" icon={<RefreshCw className="w-5 h-5" />} title="Updates to This Policy">
                <p>We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons.</p>
                <p>We will notify you of material changes by updating the &quot;Last updated&quot; date at the top of this page and, where required, by sending a notification to your registered email address. Continued use of our website following notification of changes constitutes acceptance of the updated policy.</p>
              </SectionCard>

              <SectionCard id="contact" no="07" icon={<Mail className="w-5 h-5" />} title="Contact Us">
                <p>If you have any questions about this Cookie Policy or how we use cookies and similar technologies, please contact us:</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#893A9F' }}>Privacy Team</p>
                    <p className="text-sm text-gray-700 font-medium">JENDO Innovations</p>
                    <a href="mailto:info@jendoinnovations.com" className="text-sm" style={{ color: '#893A9F' }}>info@jendoinnovations.com</a>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#f3edf8', border: '1px solid #ede8f5' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#893A9F' }}>Registered Address</p>
                    <p className="text-sm text-gray-700">Jendo Innovations INC,
9220 Rumsey Road Suite 100<br/>Columbia MD 21045</p>
                  </div>
                </div>
              </SectionCard>

              {/* Related links */}
              <div className="pt-4">
                <p className="text-sm font-semibold text-gray-500 mb-3">Related Legal Documents</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/privacy-policy" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: 'white', border: '1px solid #ede8f5', color: '#893A9F' }}>Privacy Policy <ChevronRight className="w-4 h-4" /></Link>
                  <Link href="/terms-of-service" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: 'white', border: '1px solid #ede8f5', color: '#893A9F' }}>Terms of Service <ChevronRight className="w-4 h-4" /></Link>
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}