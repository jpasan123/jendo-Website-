'use client';

import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const font = 'var(--font-red-hat-display),sans-serif';

export function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', fontFamily: font }}>
      {/* Top accent line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(to right,transparent,#893A9F,transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Col 1 — Brand (spans 2 on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/">
              <div className="relative w-[160px] h-[64px]">
                <Image
                  src="https://i.ibb.co/cbTZ66m/OIP-8-removebg-preview.png"
                  alt="JENDO Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#9ca3af' }}>
              Empowering healthcare with cutting-edge AI-powered vascular monitoring — designed in Sri Lanka &amp; Japan, manufactured in Switzerland.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="w-4 h-4" />, href: '#' },
                { icon: <Twitter className="w-4 h-4" />, href: '#' },
                { icon: <Instagram className="w-4 h-4" />, href: '#' },
                { icon: <Linkedin className="w-4 h-4" />, href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: '#1a1a1a', color: '#9ca3af', border: '1px solid #2a2a2a' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#893A9F'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1a1a1a'; (e.currentTarget as HTMLElement).style.color = '#9ca3af'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#893A9F' }}>Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '#about' },
                { label: 'Technology', href: '#technology' },
                { label: 'Products', href: '#products' },
                { label: 'Pre-Order', href: '#preorder' },
                { label: 'Our Team', href: '#team' },
                { label: 'Latest News', href: '#blog' },
                { label: 'Contact Us', href: '#contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm flex items-center gap-1.5 transition-colors group"
                    style={{ color: '#9ca3af' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c084fc'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9ca3af'}
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#893A9F]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Jendo Inc. */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#893A9F' }}>Jendo Inc.</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#893A9F' }} />
                <span className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                  251, Little Falls Drive,<br/>Wilmington, Delaware, USA
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#893A9F' }} />
                <a href="mailto:info@jendoinnovations.com" className="text-sm transition-colors" style={{ color: '#9ca3af' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c084fc'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9ca3af'}>
                  info@jendoinnovations.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#893A9F' }} />
                <a href="tel:+94766210120" className="text-sm transition-colors" style={{ color: '#9ca3af' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c084fc'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9ca3af'}>
                  +94 76 621 0120
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 — R&D Centre */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#893A9F' }}>AI Health R&amp;D Centre</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#893A9F' }} />
                <span className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                  Bay 09, Trace Expert City,<br/>Colombo 10, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#893A9F' }} />
                <a href="mailto:keerthi@jendoinnovations.com" className="text-sm transition-colors" style={{ color: '#9ca3af' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c084fc'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9ca3af'}>
                  keerthi@jendoinnovations.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#893A9F' }} />
                <a href="tel:+94766210120" className="text-sm transition-colors" style={{ color: '#9ca3af' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c084fc'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9ca3af'}>
                  +94 76 621 0120
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col md:flex-row items-center justify-between gap-5" style={{ borderTop: '1px solid #1f1f1f' }}>
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#6b7280' }}>
            &copy; {new Date().getFullYear()} JENDO Innovations. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms-of-service' },
              { label: 'Cookie Policy', href: '/cookie-policy' },
            ].map((l, i) => (
              <Link key={i} href={l.href} className="text-xs transition-colors" style={{ color: '#6b7280' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c084fc'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6b7280'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}