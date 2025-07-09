// app/contact/page.tsx
'use client';

import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Calendar } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { AppointmentSuccess } from '@/components/ui/appointment-success';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formRef.current) return;

    try {
      // Format the current time for the template
      const now = new Date();
      const timeString = now.toLocaleString();

      // Create template parameters with all needed variables
      const templateParams = {
        name: formRef.current.user_name.value,
        email: formRef.current.user_email.value,
        phone: formRef.current.user_phone.value,
        date: formRef.current.appointment_date.value,
        message: formRef.current.message.value,
        time: timeString, // Add current time for the template
        to_email: 'keerthi@effectivesolutions.lk, keerthi.office1990@gmail.com' // Add recipient emails
      };

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );

      if (result.text === 'OK') {
        // Show success modal
        setShowSuccess(true);
        formRef.current.reset();
      } else {
        throw new Error('Failed to send appointment request');
      }
    } catch (error) {
      toast.error('Failed to submit appointment request');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" />
      
      {/* Show success modal if appointment was successful */}
      {showSuccess && (
        <AppointmentSuccess onClose={() => setShowSuccess(false)} />
      )}
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-b from-gray-900 via-black to-purple-900/20 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Have questions or need assistance? We're here to help. Reach out to us today.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent z-0"></div>
      </section>

      {/* Contact Information */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="p-6 bg-gray-50 rounded-xl transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-5">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Phone</h3>
              <p className="text-gray-600">+94 71 303 0233</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Email</h3>
              <p className="text-gray-600">info@jendoinnovations.com</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Location</h3>
              <p className="text-gray-600">Colombo, Sri Lanka</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl transition-transform hover:scale-105">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-5">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hours</h3>
              <p className="text-gray-600">Mon-Fri: 9 AM - 5 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="relative">
              <div className="sticky top-32">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Book Your Appointment</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Schedule a consultation with our healthcare professionals. Fill out the form and we'll contact you to confirm your appointment.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    <span>Available appointment slots within 7 days</span>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                    <span>Quick confirmation via email</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <form 
                ref={formRef}
                onSubmit={handleAppointmentSubmit}
                className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100"
              >
                <div className="space-y-6">
                  <div>
                    <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="user_name"
                      name="user_name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="user_email"
                      name="user_email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="user_phone"
                      name="user_phone"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      id="appointment_date"
                      name="appointment_date"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Please share any specific concerns or questions you have..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        <span>Book Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Find Us</h2>
          <div className="h-96 w-full rounded-xl overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.81123163851!2d79.8234288!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1653865322259!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}