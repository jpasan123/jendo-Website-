'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart } from 'lucide-react';
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
    { name: 'ABOUT & MORE', href: '#about' },
    { name: 'PRE ORDER', href: '#preorder' },
    { name: 'BLOG', href: '#blog' },
    { name: 'OUR TEAM', href: '#team' },
    { name: 'CONTACT US', href: '#contact' },
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-[#1a1a1a]/95 backdrop-blur-md border-b border-purple-900/20" : "bg-[#1a1a1a]/95"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-black/10 pointer-events-none" />
      
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 sm:h-24 md:h-28 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 relative z-10 group">
            <Link href="/" className="flex items-center">
              <div className="relative w-[200px] h-[80px] sm:w-[250px] sm:h-[90px] md:w-[300px] md:h-[100px] transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src="https://i.ibb.co/cbTZ66m/OIP-8-removebg-preview.png"
                  alt="JENOO Logo"
                  fill
                  className="object-contain transition-all duration-500 group-hover:brightness-110 animate-float mix-blend-luminosity"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 animate-shine" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 relative z-10">
            <div className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavigation(e, item.href)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    isScrolled 
                      ? "text-gray-300 hover:text-purple-400 hover:bg-purple-900/20" 
                      : "text-white hover:text-purple-300 hover:bg-white/10",
                    activeSection === item.href.replace('#', '') && 
                      (isScrolled 
                        ? "text-purple-400 bg-purple-900/20" 
                        : "text-purple-300 bg-white/10"),
                    "relative overflow-hidden group"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-900/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </Link>
              ))}
            </div>

            {/* Cart Icon */}
            <Link 
              href="/cart"
              className={cn(
                "relative p-2 rounded-full transition-all duration-300",
                isScrolled 
                  ? "text-gray-300 hover:text-purple-400 " 
                  : "text-white hover:text-purple-300"
              )}
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button and Cart Icon */}
          <div className="md:hidden flex items-center space-x-4 relative z-10">
            <Link 
              href="/cart"
              className={cn(
                "relative p-2 rounded-full transition-all duration-300",
                isScrolled 
                  ? "text-gray-300 hover:text-purple-400" 
                  : "text-white hover:text-purple-300"
              )}
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>

            <button
              id="mobile-menu-button"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isScrolled 
                  ? "text-gray-300 hover:text-purple-400" 
                  : "text-white hover:text-purple-300"
              )}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-nav"
          className={cn(
            'md:hidden fixed inset-0 top-[80px] sm:top-[96px] bg-[#1a1a1a]/98 backdrop-blur-md transition-all duration-300 ease-in-out z-50',
            isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-full invisible'
          )}
        >
          <div className="h-[calc(100vh-80px)] sm:h-[calc(100vh-96px)] overflow-y-auto px-4 py-6">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleNavigation(e, item.href);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "relative px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300",
                    "border border-purple-500/20 backdrop-blur-sm",
                    "hover:border-purple-500/50 hover:bg-purple-500/10",
                    "active:scale-[0.98] active:bg-purple-500/20",
                    activeSection === item.href.replace('#', '')
                      ? "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/50 shadow-[inset_0_1px_0_0_rgba(147,51,234,0.1)]"
                      :  "text-purple-500 bg-[#1a1a1a]"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/10 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}