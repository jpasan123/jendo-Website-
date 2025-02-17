'use client';

import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <div className="relative w-[200px] h-[80px]">
                <Image
                  src="https://i.ibb.co/cbTZ66m/OIP-8-removebg-preview.png"
                  alt="JENDO Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm">
              Empowering healthcare with cutting-edge vascular monitoring solutions.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-purple-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="hover:text-purple-400 transition-colors">
                  About & More
                </Link>
              </li>
              <li>
                <Link href="#preorder" className="hover:text-purple-400 transition-colors">
                  Pre Order
                </Link>
              </li>
              <li>
                <Link href="#blog" className="hover:text-purple-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#team" className="hover:text-purple-400 transition-colors">
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>Bay X, Trace Expert City</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-400" />
                <a href="mailto:info@jendoinnovations.com" className="hover:text-purple-400 transition-colors">
                info@jendoinnovations.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-purple-400" />
                <span>0766210120</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to stay updated with our latest innovations</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500 text-white"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm flex items-center">
              © {new Date().getFullYear()} JENDO. Made with <Heart className="h-4 w-4 mx-1 text-purple-400" /> in Sri Lanka
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="hover:text-purple-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}