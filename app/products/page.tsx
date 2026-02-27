'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle, Package, CreditCard, Shield, Clock, Download, Heart, Activity, Brain, Microscope, BarChart3, ShieldCheck, PieChart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

export default function Products() {
  const cart = useCart();

  const addToCart = (product: any) => {
    cart.addItem({
      product_id: product.id,
      quantity: 1,
      products: product
    });
    toast.success('Added to cart');
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Heart,
      title: "Advanced Heart Monitoring",
      description: "Continuous monitoring of cardiovascular health indicators"
    },
    {
      icon: Activity,
      title: "Real-time Analysis",
      description: "Instant analysis of vascular health data"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms for predictive analysis"
    },
    {
      icon: Microscope,
      title: "Precision Measurements",
      description: "Highly accurate non-invasive measurements"
    },
    {
      icon: BarChart3,
      title: "Comprehensive Reports",
      description: "Detailed health reports and trends analysis"
    },
    {
      icon: ShieldCheck,
      title: "Data Security",
      description: "Enterprise-grade security for patient data"
    },
    {
      icon: PieChart,
      title: "Analytics Dashboard",
      description: "Interactive dashboard for data visualization"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Fully compliant with healthcare regulations"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-gray-900 via-black to-purple-900/20 text-white overflow-hidden section-scroll">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse-slow" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl font-bold mb-8 relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 bg-clip-text text-transparent animate-shine">
                Our Products
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-900/20 blur-lg -z-10 animate-pulse-slow" />
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Revolutionary vascular monitoring solutions for healthcare professionals
            </p>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600">Advanced technology for superior vascular monitoring</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
                  <feature.icon className="w-12 h-12 text-purple-600 mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Comparison */}
      <section className="py-24 bg-gray-50 section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Product Comparison</h2>
            <p className="text-xl text-gray-600">Choose the right JENDO solution for your needs</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Standard Package */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur-sm opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-purple-400 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm z-10">
                  Most Popular
                </div>
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Image Section */}
                  <div className="relative w-full md:w-48 h-40 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg"
                      alt="JENDO Pro Device"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">Standard Package</h3>
                      <div className="text-3xl font-bold text-purple-600 mb-4">$2,400<span className="text-base text-gray-600">/year</span></div>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm">JENDO Pro Device</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm">1 Year Software License</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm">Priority Support</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm">Advanced Analytics</span>
                        </li>
                      </ul>
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
              </div>
            </div>

            {/* Enterprise Package */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur-sm opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-purple-100 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Image Section */}
                  <div className="relative w-full md:w-48 h-40 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg"
                      alt="JENDO Enterprise Package"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">Enterprise Package</h3>
                      <div className="text-3xl font-bold text-purple-600 mb-4">Custom</div>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm">Multiple JENDO Devices</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm">Enterprise Software License</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm">24/7 Premium Support</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm">Custom Integration</span>
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => addToCart({
                        id: 'enterprise-package',
                        name: 'JENDO Enterprise Package',
                        price: 4999,
                        image_url: 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg',
                        description: 'Enterprise-level vascular monitoring solution'
                      })}
                      className="mt-4 w-full bg-purple-600 text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Contact Sales</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
            <p className="text-xl text-gray-600">Detailed specifications of our monitoring devices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Hardware Specifications</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <span className="font-semibold">Sensor Type:</span>
                      <p className="text-gray-600">Advanced optical sensors with multi-wavelength capability</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <span className="font-semibold">Resolution:</span>
                      <p className="text-gray-600">High-precision 24-bit ADC for accurate measurements</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <span className="font-semibold">Connectivity:</span>
                      <p className="text-gray-600">Bluetooth 5.0, Wi-Fi 6, USB-C</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <span className="font-semibold">Battery Life:</span>
                      <p className="text-gray-600">Up to 12 hours continuous operation</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Software Capabilities</h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <span className="font-semibold">Analysis Algorithms:</span>
                      <p className="text-gray-600">Advanced AI-powered analysis with real-time processing</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <span className="font-semibold">Data Storage:</span>
                      <p className="text-gray-600">Secure cloud storage with local backup options</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <span className="font-semibold">Integration:</span>
                      <p className="text-gray-600">API support for EMR/EHR systems</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <span className="font-semibold">Reporting:</span>
                      <p className="text-gray-600">Customizable reports with trend analysis</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}