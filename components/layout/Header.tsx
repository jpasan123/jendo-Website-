'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { usePathname } from 'next/navigation';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const cart = useCart();
  const pathname = usePathname();

  const navigation = [
    { name: 'Ecosystem', href: '#ecosystem' },
    { name: 'Technology', href: '#technology' },
    { name: 'Recognition', href: '#recognition' },
    { name: 'Research', href: '#research' },
    { name: 'Our Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      setIsScrolled(scrollPosition > 50);

      if (pathname === '/') {
        const sections = document.querySelectorAll("section[id]");
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionHeight = rect.height;
          const sectionId = section.getAttribute("id");

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(sectionId || "");
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('mobile-nav');
      const button = document.getElementById('mobile-menu-button');
      if (isOpen && nav && button && !nav.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== '/') {
      e.preventDefault();
      window.location.href = `/${href}`;
    } else {
      const section = document.querySelector(href);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-black/60 backdrop-blur-3xl border-b border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
          : "bg-black/40 backdrop-blur-2xl border-b border-white/5"
      )}
    >
      {/* no background overlay, keep nav fully transparent */}
      
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 font-[var(--font-red-hat-display)]">
        <div className="flex h-[88px] items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 relative z-10">
            <Link 
              href="/" 
              className="flex items-center gap-2 outline-none focus:outline-none [-webkit-tap-highlight-color:transparent]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="relative w-[120px] h-[120px]">
                <Image
                  src="/jendo-icon.png"
                  alt="JENDO Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1 lg:gap-3 relative z-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavigation(e, item.href)}
                className={cn(
                  "px-3 py-2 text-[13px] lg:text-[14px] tracking-[0.08em] font-[var(--font-red-hat-display)] transition-colors duration-200 whitespace-nowrap text-white/90 hover:text-purple-300",
                  activeSection === item.href.replace('#', '') && "text-purple-300 border-b border-purple-400"
                )}
              >
                <span>{item.name}</span>
              </Link>
            ))}

{/* Cart Icon - hidden
            <Link 
              href="/cart"
              className={cn(
                "relative p-2 rounded-full transition-all duration-300 flex-shrink-0 ml-3",
                "text-white/80 hover:text-purple-300"
              )}
            >
              <ShoppingCart className="h-6 w-6 lg:h-7 lg:w-7" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#893A9F] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>
            */}

            {/* Visit My Jendo Portal button */}
            <a
              href="http://188.166.240.119:5173/login"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex items-center gap-2 px-4 py-2 rounded-full text-[13px] lg:text-[14px] font-[var(--font-red-hat-display)] text-white whitespace-nowrap transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#893A9F,#4a1260)', border: '1px solid rgba(192,132,252,0.3)' }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit My Jendo Portal
            </a>
          </div>

          {/* Mobile Menu Button and Cart Icon */}
          <div className="md:hidden flex items-center space-x-4 relative z-10">
            {/* Mobile Cart Icon - hidden
            <Link 
              href="/cart"
              className={cn(
                "relative p-2 rounded-full transition-all duration-300",
                "text-white/80 hover:text-purple-300"
              )}
            >
              <ShoppingCart className="h-7 w-7" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#893A9F] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>
            */}

            <button
              id="mobile-menu-button"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "text-white/80 hover:text-purple-300"
              )}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation — staggered dropdown */}

        {/* Blurred backdrop (behind menu, over page content) */}
        <div
          onClick={() => setIsOpen(false)}
          className={cn(
            'md:hidden fixed inset-0 top-[88px] z-30 backdrop-blur-md bg-black/40 transition-opacity duration-300',
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
          aria-hidden="true"
        />

        {/* Dropdown panel */}
        <div
          id="mobile-nav"
          className={cn(
            'md:hidden fixed left-0 right-0 top-[88px] z-40',
            'bg-[#0c0c0c]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl',
            'transition-all duration-300 ease-in-out overflow-hidden',
            isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          )}
        >
          <ul className="flex flex-col px-4 pt-4 pb-6">
            {navigation.map((item, i) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <li
                  key={item.name}
                  className={cn(
                    'transition-all duration-300',
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                  )}
                  style={{ transitionDelay: isOpen ? `${i * 60}ms` : '0ms' }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => { handleNavigation(e, item.href); setIsOpen(false); }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 rounded-lg text-[15px] font-[var(--font-red-hat-display)] transition-colors duration-200',
                      isActive
                        ? 'text-white'
                        : 'text-white/60 hover:text-white'
                    )}
                  >
                    <span
                      className="w-1 h-4 rounded-full flex-shrink-0 transition-opacity duration-200"
                      style={{ background: '#893A9F', opacity: isActive ? 1 : 0 }}
                    />
                    {item.name}
                  </Link>
                  {i < navigation.length - 1 && (
                    <div className="mx-4 h-px bg-white/5" />
                  )}
                </li>
              );
            })}

            {/* Portal CTA */}
            <li
              className={cn(
                'mt-4 transition-all duration-300',
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              )}
              style={{ transitionDelay: isOpen ? `${navigation.length * 60}ms` : '0ms' }}
            >
              <a
                href="https://app.jendo.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-xl text-[15px] font-[var(--font-red-hat-display)] text-white transition-all duration-200 active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg,#893A9F,#4a1260)', border: '1px solid rgba(192,132,252,0.25)' }}
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                Visit My Jendo Portal
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}