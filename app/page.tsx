'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { Heart, Shield, ArrowRight, Users, Activity, Download, MapPin, Mail, Clock, User, LineChart, FlaskRound as Flask, Building2, Stethoscope, FileHeart, ChartBar, Brain, Microscope, BarChart3, ShieldCheck, PieChart, HandHeart, Facebook, Twitter, Linkedin, CreditCard, Package, CheckCircle, ShoppingCart, X, Calendar, FileText, BedDouble, Waves, Cloud, Instagram, FacebookIcon, Award, Globe, BookOpen, Lock, Eye, Database, Cpu, TrendingUp, Target, Zap, Fingerprint, HeartPulse, ClipboardCheck, UserCheck, Building, Share2, BarChart2, ExternalLink, AlertTriangle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { FormNotification } from '@/components/ui/form-notification';
import { Play, Pause } from "lucide-react"
import emailjs from '@emailjs/browser';
import { AppointmentSuccess } from '@/components/ui/appointment-success';
import { SuccessModal } from '@/components/SuccessModal';
import gsap from 'gsap';
import type { PayherePayment } from "@/lib/payhere";
import { createPaymentForm } from "@/lib/payhere";
import { PayhereForm } from '@/components/ui/payhere-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';




export default function Home() {
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [isLabPartnerModalOpen, setIsLabPartnerModalOpen] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const cart = useCart();


  // show the payhere connect
  const [showPayhere, setShowPayhere] = useState(false);
  const [payment, setPayment] = useState<PayherePayment | null>(null);


  // Add these lines here
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState({ src: '', alt: '' });

  //Add the vide section here
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const videoSectionRef = useRef<HTMLDivElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // New state variables for date range
  const [preOrderStart, setPreOrderStart] = useState<Date | null>(null);
  const [preOrderEnd, setPreOrderEnd] = useState<Date | null>(null);
  const [checkupStart, setCheckupStart] = useState<Date | null>(null);
  const [checkupEnd, setCheckupEnd] = useState<Date | null>(null);

  // New state for booking error
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const videoElement1 = videoRef1.current;
    const videoElement2 = videoRef2.current;
    const sectionElement = videoSectionRef.current;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVideoPlaying(true);
          // Add a small delay to ensure videos are ready
          setTimeout(() => {
            videoElement1?.play().catch(error => console.log("Video 1 autoplay failed:", error));
            videoElement2?.play().catch(error => console.log("Video 2 autoplay failed:", error));
          }, 100);
        } else {
          setIsVideoPlaying(false);
          videoElement1?.pause();
          videoElement2?.pause();
        }
      });
    }, options);

    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
  }, [])

  const toggleVideo = () => {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    if (video1 && video2) {
      if (isVideoPlaying) {
        video1.pause()
        video2.pause()
      } else {
        video1.play()
        video2.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }


  const seniorAdvisors = [
    {
      name: "Prof. Saroj Jayasinghe",
      role: "Professor of Medicine",
      credentials: "University of Colombo",
      additionalRole: "Honorary Consultant Physician, National Hospital, Sri Lanka",
      image: "https://i.ibb.co/CKmznk7v/th.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/saroj-jayasinghe-54308b33/",
        twitter: "https://twitter.com/sarojjayasinghe",
        facebook: "https://web.facebook.com/saroj.jayasinghe.3",
        instagram: "https://instagram.com/sarojjayasinghe",
      },
    },
    {
      name: "Dr. Bandula Wijay PhD., PE.",
      role: "Ambassador",
      credentials: "Science Technology and Innovation for Sri Lanka",
      additionalRole: "CEO, Leomed Llc & BinLab Inc.",
      image: "https://i.ibb.co/xgW3jpR/9-1.png",
      social: {
        linkedin: "https://www.linkedin.com/in/bandula-wijay-phd-dsc-b7581224/",
        twitter: "https://twitter.com/bandulawijay",
        facebook: "https://web.facebook.com/bandula.wijay",
        instagram: "https://instagram.com/bandulawijay",
      },
    },
    {
      name: "Prof. Godwin Constantine",
      role: "Consultant Physician (Cardiologist)",
      credentials: "National Hospital, Sri Lanka",
      additionalRole: "Head of Department of Clinical Medicine, University of Colombo",
      image: "https://i.ibb.co/Qv5Wf41k/Whats-App-Image-2025-02-13-at-20-44-02-649bd8d3.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/godwin-constantine-ab751a8/",
        twitter: "https://twitter.com/godwinconstantine",
        facebook: "https://web.facebook.com/godwin.constantine.7",
        instagram: "https://instagram.com/godwinconstantine",
      },
    },
  ]

  const boardMembers = [
    {
      name: "Keerthi Kodithuwakku",
      role: "Chairman & CEO",
      image: "https://i.ibb.co/b13kVX2/4-1.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/keerthi-kodithuwakku-b98149219/",
        twitter: "https://twitter.com/keerthikodithuwakku",
        facebook: "https://web.facebook.com/keerthi.priyankara.3",
        instagram: "https://instagram.com/keerthikodithuwakku",
      },
    },
    // {
    //   name: "Dr. Manjula Karunaratne",
    //   role: "Group CEO - Asiri Hospitals PLC",
    //   image: "https://i.ibb.co/jhMkKbZ/11-1.png",
    //   social: {
    //     linkedin: "https://linkedin.com/in/manjula-karunaratne",
    //     twitter: "https://twitter.com/manjulakarunaratne",
    //     facebook: "https://facebook.com/manjula.karunaratne",
    //     instagram: "https://instagram.com/manjulakarunaratne",
    //   },
    // },
    {
      name: "Vinod Samarawickrama",
      role: "Manager Connectivity Program Meta Inc.",
      image: "https://i.ibb.co/n7xdCBm/8-1.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/vinod-samarawickrama-767bb273/",
        twitter: "https://twitter.com/vinodsamarawickrama",
        facebook: "https://web.facebook.com/vinod.samarawickrama",
        instagram: "https://instagram.com/vinodsamarawickrama",
      },
    },
    {
      name: "Dilan Christostom",
      role: "Head of Investment - Softlogic Holdings PLC",
      image: "https://i.ibb.co/hxStrttQ/image-7bc6206568.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/dilan-christostom-b18a1854/",
        // twitter: "https://twitter.com/niloojayatilake",
        // facebook: "https://facebook.com/niloo.jayatilake",
        // instagram: "https://instagram.com/niloojayatilake",
      },
    },
    {
      name: "Heminda Jayaweera",
      role: "Executive Director - TRACE Expert City",
      image: "https://i.ibb.co/W5g1BHQ/3-1.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/heminda/",
        twitter: "https://twitter.com/hemindajayaweera",
        facebook: "https://web.facebook.com/heminda",
        instagram: "https://instagram.com/hemindajayaweera",
      },
    },
    {
      name: "Palitha Gamage",
      role: "CEO - Lanka Ventures PLC",
      image: "https://i.ibb.co/4nL9gMST/2cea9ab7-faea-476c-8bf5-5a0f3b4825cd-thumb-1.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/palitha-gamage-8b47b510b/",
        twitter: "https://twitter.com/chandriendemel",
        facebook: "https://www.facebook.com/palitha.gamage.1/",
        instagram: "https://instagram.com/chandriendemel",
      },
    },
  ]

  const developmentTeam = [
    {
      name: "Keerthi Kodithuwakku",
      role: "Chief Executive Officer",
      credentials: "BSc. Eng",
      image: "https://i.ibb.co/b13kVX2/4-1.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/keerthi-kodithuwakku-b98149219/",
        twitter: "https://twitter.com/keerthikodithuwakku",
        facebook: "https://web.facebook.com/keerthi.priyankara.3",
        instagram: "https://instagram.com/keerthikodithuwakku",
      },
    },
    {
      name: "Janith Kodithuwakku",
      role: "Chief Technology Officer",
      credentials: "BSc. Eng",
      image: "https://i.ibb.co/5gttd5PJ/1635531926171.jpg",
      social: {
        linkedin: "https://linkedin.com/in/charith-vithanage",
        twitter: "https://twitter.com/charithvithanage",
        facebook: "https://facebook.com/charith.vithanage",
        instagram: "https://instagram.com/charithvithanage",

      },
    },
    // {
    //   name: "Shashika Chamod Munasinghe",
    //   role: "Chief Technical Officer",
    //   credentials: "BSc. Eng, MSc. Eng",
    //   image: "https://i.ibb.co/fzS4dJSV/1535565006985.jpg",
    //   social: {
    //     linkedin: "https://www.linkedin.com/in/shashika-chamod-munasingha-685b3482/",
    //     twitter: "https://twitter.com/shashikachamod",
    //     facebook: "https://web.facebook.com/shashika.chamodmunasingha",
    //     instagram: "https://instagram.com/shashikachamod",
    //   },
    // },
    {
      name: "Dr.Danushi Hettiarachchi",
      role: "Chief Medical Officer",
      credentials: "MBBS",
      image: "https://i.ibb.co/WQFm1hg/1707784294034.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/dr-dhanushi-hettiarachchi-b0955853/",
        twitter: "https://twitter.com/danushihettiarachchi",
        facebook: "https://web.facebook.com/dhanushi.thathsarahettiarachchi",
        instagram: "https://instagram.com/danushihettiarachchi",
      },
    },
    // {
    //   name: "Gimantha Upasena",
    //   role: "R & D Engineer",
    //   credentials: "BSc. Eng",
    //   image: "https://i.ibb.co/ksz2JGTF/Untitled2.jpg",
    //   social: {
    //     linkedin: "https://www.linkedin.com/in/ravindu-gimantha-upasena-2b9017189/",
    //     twitter: "https://twitter.com/gimantha-upasena",
    //     facebook: "https://facebook.com/gimantha.upasena",
    //     instagram: "https://instagram.com/gimantha-upasena",
    //   },
    // },
    // {
    //   name: "Azfa Rassaq",
    //   role: "Data Scientist",
    //   credentials: "BSc.Math",
    //   image: "https://i.ibb.co/wFhw7125/Screenshot-2025-02-05-102620.png",
    //   social: {
    //     linkedin: "https://www.linkedin.com/in/azfa-razzaq/",
    //     twitter: "https://twitter.com/azfa-rassaq",
    //     facebook: "https://web.facebook.com/afi.razzaq",
    //     instagram: "https://instagram.com/azfa-rassaq",
    //   },
    // },
  ]

  const blogPosts = [
    {
      title: "Breakthrough for deep tech in Sri Lanka, Jendo closes new investment round ",
      excerpt: "Jendo secures new funding, marking a major milestone for Sri Lankan deep tech and accelerating innovation in AI-powered cardiovascular health.",
      date: "April 12, 2024",
      author: "IEEE EMBS",
      image: "https://i.ibb.co/Kx8CP8Fg/image-6d9f420cc4.jpg",
      url: "https://www.ft.lk/front-page/Breakthrough-for-deep-tech-in-Sri-Lanka-Jendo-closes-new-investment-round/44-781375 ",
    },
    {
      title: "Jendo CEO Speaks at IEEE EMBS AXON Workshop on AI in Healthcare",
      excerpt: "Jendo's CEO shares insights on AI-driven healthcare solutions and the impact of non-invasive vascular diagnostics at the IEEE EMBS AXON Workshop.",
      date: "April 12, 2024",
      author: "IEEE EMBS",
      image: "https://i.ibb.co/Zb72PxJ/IEEE-2.png",
      url: "https://docs.google.com/document/d/1JKBsun40koXUQVNlIIzibPbXGScFxp1DngaUcoGZOlM/edit?usp=sharing",
    },
    {
      title: "John Keells X Open Innovation Challenge – Grand Finale Recap",
      excerpt: "Jendo wins the JKX Open Innovation Challenge, showcasing its pioneering non-invasive cardiovascular health platform among top innovators.",
      date: "November 2, 2023",
      author: "JKX Team",
      image: "https://i.ibb.co/whCSMgMQ/Whats-App-Image-2025-01-15-at-19-56-35-3b4cc881.jpg",
      url: "/blog/jkx-open-innovation-challenge",
    },
    {
      title: "John Keells X announces winners of the Open Innovation Challenge",
      excerpt: "Jendo recognized as a winner for its AI and machine learning advancements in cardiac care at the JKX Open Innovation Challenge.",
      date: "March 10, 2024",
      author: "Ada Derana Team",
      image: "https://i.ibb.co/2DJxy9g/JKX-1-1.png",
      url: "http://bizenglish.adaderana.lk/john-keells-x-announces-winners-of-the-open-innovation-challenge/",
    },
    {
      title: "The JKX Open Innovation Challenge Finale",
      excerpt: "Jendo's early detection and prevention technology for cardiovascular diseases shines at the JKX Innovation Challenge finale.",
      date: "March 5, 2024",
      author: "Andre Howson",
      image: "https://i.ibb.co/bMqByFXT/JKX-3-1024x425.jpg",
      url: "http://bizenglish.adaderana.lk/john-keells-x-announces-winners-of-the-open-innovation-challenge/",
    },
    {
      title: "John Keells X rewards winners of Innovation Challenge",
      excerpt: "Jendo receives recognition and rewards for its innovative approach to cardiovascular disease prevention at the JKX Innovation Challenge.",
      date: "March 20, 2024",
      author: "Sunday Oberver",
      image: "https://i.ibb.co/bMqByFXT/JKX-3-1024x425.jpg",
      url: "https://archives1.sundayobserver.lk/2016/11/13/business/john-keells-x-rewards-winners-innovation-challenge",
    },
    {
      title: "Sri Lankan team in early major breakthrough on early detection of NCDs",
      excerpt: "Jendo's hardware device enables early detection of non-communicable diseases, marking a breakthrough for Sri Lankan medical technology.",
      date: "August 5, 2018",
      author: "Quintus Perera",
      image: "https://i.ibb.co/6RDDJyL7/img.webp",
      url: "http://bizenglish.adaderana.lk/john-keells-x-announces-winners-of-the-open-innovation-challenge/",
    },
    {
      title: "A Hybrid Approach for Screening Endothelial Dysfunction using Photoplethysmography",
      excerpt: "Jendo introduces a hybrid screening method for endothelial dysfunction, combining photoplethysmography and digital thermal monitoring.",
      date: "March 20, 2024",
      author: "Vendys",
      image: "https://i.ibb.co/fdCnj2Qt/dac531-73bbe4c4b6594048bd41440f335212c2-mv2.jpg",
      url: "https://www.vendys2.com/post/a-hybrid-approach-for-screening-endothelial-dysfunction-using-photoplethysmography",
    },
    {
      title: "Srilanka Patent for Jendo",
      excerpt: "Jendo secures a Sri Lankan patent, expanding its global presence and advancing non-invasive vascular health diagnostics.",
      date: "March 20, 2024",
      author: "Vendys",
      image: "https://i.ibb.co/MxLrpccS/Screen-Shot-2022-12-22-at-00-01-06-1.png",
      url: "/blog/jendo-patents",
    },
    {
      title: "Non-invasive assessment of endothelial dysfunction",
      excerpt: "Jendo's technology enables non-invasive assessment of endothelial dysfunction, supporting global healthcare during the COVID-19 pandemic.",
      date: "May 20, 2021",
      author: "Pub Med",
      image: "https://i.ibb.co/Zzqmty9N/unnamed-1.png",
      url: "https://pubmed.ncbi.nlm.nih.gov/33254535/#article-details",
    },
    {
      title: "Jendo – Heart Disease Prediction using Machine Learning",
      excerpt: "Jendo leverages machine learning for heart disease prediction, setting new standards in AI-driven cardiology.",
      date: "April 21, 2022",
      author: "WIPO",
      image: "https://i.ibb.co/rfQQqBgr/Screenshot-2025-07-09-155342.png",
      url: "https://www.wipo.int/en/web/ip-advantage/w/stories/jendo-heart-disease-prediction-using-machine-learning",
    },
  ]


  const handlePreOrderClick = () => {
    setIsPreOrderModalOpen(true);
  };

  const handleLabPartnerClick = () => {
    setIsLabPartnerModalOpen(true);
  };

  const handleInsuranceClick = () => {
    setIsInsuranceModalOpen(true);
  };

  // For Pre-order Form
  const [showPreOrderSuccess, setShowPreOrderSuccess] = useState(false);

  type PreOrderPackageType = 'starter' | 'professional' | 'enterprise';

  const handlePreOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setBookingError(null);

    // Show success message immediately
    setShowSuccess(true);
    // Close the modal
    setIsPreOrderModalOpen(false);

    try {
      const formData = new FormData(form);
      const packageType = formData.get("package_type") as PreOrderPackageType;
      const { amount, currency } = preOrderPrices[packageType] || { amount: 0, currency: "USD" };

      // Create payment object
      const payherePayment: PayherePayment = {
        merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!,
        return_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
        notify_url: `${window.location.origin}/api/payhere-notify`,
        order_id: `JENDO_${Date.now()}`,
        items: `JENDO ${packageType} Package`,
        currency: currency,
        amount: amount,
        first_name: formData.get('full_name') as string,
        last_name: '', // Add if you collect last name
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('delivery_address') as string || '',
        city: '', // Add if you collect city
        country: 'Sri Lanka',
        custom_1: packageType,
        hash: '' // You'll need to generate this server-side
      };

      // For security, you should generate the hash server-side
      // Here's a client-side example (not recommended for production):
      // const hash = CryptoJS.MD5(/* concatenated string */).toString();
      // payherePayment.hash = hash;

      // setPayment(payherePayment);
      // setShowPayhere(true);

      // Optionally save to your database
      // const response = await fetch('/api/pre-order', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...Object.fromEntries(formData),
      //     payment_amount: amount,
      //     payment_currency: currency,
      //     payment_status: 'pending'
      //   }),
      // });
       const parts = (formData.get('full_name') as string).trim().split(/\s+/); // Splits by any whitespace

      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");  // Joins everything after the first word

      // First save to Google Sheets
      try {
        const response = await fetch('/api/pre-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...Object.fromEntries(formData),
            start_time: preOrderStart ? preOrderStart.toISOString() : '',
            end_time: preOrderEnd ? preOrderEnd.toISOString() : '',
            payment_amount: amount,
            payment_currency: currency,
            payment_status: 'pending'
          }),
        });
        if (response.status === 409) {
          setBookingError('Use a time already booked');
          setIsSubmitting(false);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to save to Google Sheets');
        }
      } catch (sheetError) {
        console.error('Failed to save to Google Sheets:', sheetError);
        toast.error('Failed to process your request. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      // Then initiate payment
      const response2 = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...Object.fromEntries(formData),
          amount: amount,
          items: `JENDO ${packageType} Package`,
          first_name: firstName,
          last_name: lastName,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          address: formData.get('delivery_address') as string || 'Not provided',
          start_time: preOrderStart ? preOrderStart.toISOString() : '',
          end_time: preOrderEnd ? preOrderEnd.toISOString() : '',
        })
      });
      const result = await response2.json();
      if (result.success && result.payherePayment) {
        setPayment(result.payherePayment);
        setShowPayhere(true);
        // Form is already reset earlier for immediate feedback
      } else {
        alert('Payment initiation failed. Please try again.');
      }

      // console.log('Pre-order response:', response);
      // if (!response.ok) throw new Error('Submission failed');

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  // In your component JSX:
  {
    isPreOrderModalOpen && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        {/* Your existing form */}
      </div>
    )
  }

  <SuccessModal
    isOpen={showPreOrderSuccess}
    onClose={() => setShowPreOrderSuccess(false)}
    title="Pre-order Submitted!"
    message="Thank you for your pre-order! We'll contact you within 24 hours to confirm details."
  />

  const handleLabPartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Show success message immediately
    setShowSuccess(true);
    // Close the modal
    setIsLabPartnerModalOpen(false);
    // Reset the form right away
    form.reset();

    const checkupType = formData.get("checkup_type") as CheckupType;
    const amount = checkupPrices[checkupType];
    const currency = checkupType === 'trial' ? 'USD' : 'LKR';

    const data = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      checkup_type: checkupType,
      payment_method: formData.get("payment_method"),
      message: formData.get("message"),
      start_time: checkupStart ? checkupStart.toISOString() : '',
      end_time: checkupEnd ? checkupEnd.toISOString() : '',
    };

    try {
      const parts = (data.full_name as string).trim().split(/\s+/); // Splits by any whitespace

      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");  // Joins everything after the first word

      // 1. Save to Google Sheets
      // const response = await fetch("/api/book-checkup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      const response2 = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...Object.fromEntries(formData),
          amount: 17.5,
          items: 'Test trial + Consultation',
          first_name: firstName,
          last_name: lastName,
          email: data.email,
          phone: data.phone,
          address: 'dont know',
          start_time: data.start_time,
          end_time: data.end_time,
        })
      });

      // if (!response.ok) throw new Error("Failed to book check up");

      // // 2. Prepare PayHere payment
      // const payherePayment: PayherePayment = {
      //   merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!,
      //   return_url: window.location.origin + "/checkout/success",
      //   cancel_url: window.location.origin + "/checkout/cancel",
      //   notify_url: window.location.origin + "/api/payhere-notify",
      //   order_id: "CHECKUP_" + Date.now(),
      //   items: `Jendo ${checkupType}`,
      //   currency: "USD",
      //   amount,
      //   first_name: data.full_name as string,
      //   last_name: "",
      //   email: data.email as string,
      //   phone: data.phone as string,
      //   address: "",
      //   city: "",
      //   country: "Sri Lanka",
      //   hash: "", // If required by your PayHere config
      // };

      const result = await response2.json();
      console.log('Checkout response:', result);
      if (result.success && result.payherePayment) {
        // Save data to Google Sheets directly as well for redundancy
        try {
          const response = await fetch("/api/book-checkup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...data,
              amount,
              currency
            }),
          });
          if (response.status === 409) {
            setBookingError('Use a time already booked');
            setIsSubmitting(false);
            return;
          }
          if (!response.ok) {
            throw new Error('Failed to save to Google Sheets');
          }
        } catch (sheetError) {
          console.error("Failed to save to Google Sheets:", sheetError);
          toast.error('Failed to process your request. Please try again.');
          setIsSubmitting(false);
          return;
        }
        
        setPayment(result.payherePayment);
        setShowPayhere(true);
        // Form is already reset earlier for immediate feedback
      } else {
        alert('Payment initiation failed. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to book check up');
      console.error("Book check up error:", error);
    }
  };
  const handleInsuranceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Show success message immediately
    setShowSuccess(true);
    // Close the modal
    setIsInsuranceModalOpen(false);
    // Reset form right away
    form.reset();
    
    const data = {
      company_name: formData.get('company_name'),
      contact_person: formData.get('contact_person'),
      email: formData.get('email'),
      phone: formData.get('phone')
    };

    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'insurance',
          formData: data,
        }),
      });

      if (!response.ok) {
        console.error('API call failed but user already got success message');
        // We won't throw an error here since the user already got success message
      }

      // Toast is still shown in addition to the success modal
      toast.success('Insurance partner application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit insurance partner application');
      console.error('Insurance partner error:', error);
    }
  };

  const addToCart = async (product: any) => {
    try {
      cart.addItem({
        product_id: product.id,
        quantity: 1,
        products: product,
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    }
  };

  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');
  }, []);

  // Emma Gallery GSAP animation
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      gsap.from(".emma-gallery-img", {
        opacity: 0,
        y: 60,
        scale: 0.95,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#emma-gallery",
          start: "top 80%",
        },
      });
    });
    return () => ctx.revert();
  }, []);
  type CheckupType = 'consultation' | 'full' | 'trial';

  const checkupPrices: Record<CheckupType, number> = {
    consultation: 5000, // LKR
    full: 8000,         // LKR
    trial: 17.5         // USD
  };

  const preOrderPrices = {
    starter: { amount: 225, currency: "USD" },
    professional: { amount: 2250, currency: "USD" },
    enterprise: { amount: 0, currency: "USD" }, // Custom, handle as needed
  };

  return (
    <>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center section-scroll overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/jendo_background.jpg"
            alt="Jendo Background"
            fill
            className="object-cover"
            priority
            quality={100}
            unoptimized
          />
          {/* Gradient Overlay - Lighter to show background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/50" />
          {/* Purple Glow Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsla(267, 89.00%, 50.00%, 0.20),transparent_60%)] animate-pulse-slow" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32">
          <div className="animate-fade-in">
            <div className="relative mb-8 sm:mb-10 pb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 text-center px-2 pb-6" style={{ lineHeight: '1.4' }}>
              <span className="bg-gradient-to-r from-purple-100 via-white to-purple-100 bg-clip-text text-transparent animate-shine block mb-1 break-words py-1">
                Assuring Vascular Health
              </span>
              <span className="bg-gradient-to-r from-purple-100 via-white to-purple-100 bg-clip-text text-transparent animate-shine block mb-2 sm:mb-3 break-words py-1">
                for a Quality Life
              </span>
              </h1>
              
              {/* Animated Heart Icon */}
              <div className="flex justify-center my-6 sm:my-8">
                <div className="relative">
                  <Heart 
                    className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-purple-400 fill-purple-400 opacity-50" 
                  />
                  <div className="absolute inset-0 animate-ping">
                    <Heart className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-purple-300 fill-purple-300 opacity-30" />
                  </div>
                </div>
              </div>

              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-6xl mx-auto mb-8 sm:mb-10 text-center leading-relaxed px-2 sm:px-4 break-words">
                A clinically validated, non-invasive vascular health test designed as an alternative to costly, time-intensive, operator-dependent cardiovascular assessments - built to transform primary care and prevention at scale.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#for-clinicians"
                className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center space-x-2 animate-pulse-slow"
              >
                <Stethoscope className="h-5 w-5" />
                <span>For Clinicians</span>
              </a>
              <a
                href="#for-individuals"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2 animate-pulse-slow"
              >
                <Heart className="h-5 w-5" />
                <span>For Individuals</span>
              </a>
              <button
                onClick={handlePreOrderClick}
                className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Pre-Order</span>
              </button>
              <button
                onClick={handleLabPartnerClick}
                className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Test</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImage
                  ? 'bg-purple-600 scale-110'
                  : 'bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* The Problem */}
            <div className="relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl blur opacity-25 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-red-100 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">The Problem</h2>
                </div>
                <p className="text-xl text-gray-800 mb-6 font-semibold">
                  Cardiovascular disease remains the leading cause of death worldwide.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <X className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Risk often develops <strong>silently over decades</strong></span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <X className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Most care models rely on <strong>late detection and episodic intervention</strong></span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <X className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Individuals and clinicians lack tools for <strong>early functional insight and longitudinal tracking</strong></span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <p className="text-gray-800 font-medium">
                    As a result, opportunities for meaningful prevention are frequently missed.
                  </p>
                </div>
              </div>
            </div>

            {/* The Jendo Solution */}
            <div className="relative h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">The Jendo Solution</h2>
                </div>
                <p className="text-lg text-gray-700 mb-6">
                  Jendo is a cardiovascular health platform designed to support <strong>earlier awareness</strong>, <strong>structured monitoring</strong>, and <strong>shared responsibility</strong> for long-term heart health.
                </p>
                <div className="mb-6">
                  <p className="text-gray-800 font-semibold mb-3">Built around the Jendo Vascular Health Test, the platform combines:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700"><strong>Serial, non-invasive</strong> vascular monitoring</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700"><strong>Longitudinal</strong> health data organization</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700"><strong>Evidence-based</strong> guidance and care coordination</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                  <p className="text-gray-800 font-medium">
                    Together, these elements enable a shift from one-time assessments to <strong>continuous, trend-based cardiovascular insight</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jendo Ecosystem Section */}
      <section id="ecosystem" className="py-24 bg-gradient-to-b from-gray-50 to-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">The Jendo Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              More than a single test a connected ecosystem that brings together vascular health data, longitudinal insights, and structured care coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Card 1: Personal Health Data */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-purple-100 h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Cardiovascular Health Data</h3>
                <p className="text-gray-600">
                  A centralized, longitudinal record of lifestyle, clinical history, and cardiovascular-relevant data.
                </p>
              </div>
            </div>

            {/* Card 2: Evidence-Based Guidance */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-purple-100 h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Evidence-Based Health Guidance</h3>
                <p className="text-gray-600">
                  Trusted educational content and decision-support tools designed to complement clinical care.
                </p>
              </div>
            </div>

            {/* Card 3: Care Coordination */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-purple-100 h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Care Coordination</h3>
                <p className="text-gray-600">
                  Structured engagement with clinicians, enabling better-prepared consultations and shared decision-making.
                </p>
              </div>
            </div>

            {/* Card 4: Serial Monitoring */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-purple-100 h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Serial Vascular Monitoring</h3>
                <p className="text-gray-600">
                  Ongoing assessment of vascular reactivity to track change over time and support early evaluation.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-block bg-purple-50 px-8 py-6 rounded-2xl border border-purple-200">
              <p className="text-lg text-purple-900 font-semibold">
                A unified platform that connects data, insight, and care coordination to support a more proactive and continuous approach to cardiovascular health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section - Vascular Health Test */}
      <section id="technology" className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">The Jendo Vascular Health Test</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Clear, objective insight into vascular function using a safe, non-invasive approach
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* What Is It */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Microscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">What Is It?</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  The Jendo Vascular Health Test is a <strong>non-invasive vascular reactivity assessment</strong> that evaluates how blood vessels respond to a brief, controlled physiological stimulus.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Non-invasive:</strong> No needles, injections, or contrast agents</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Cost-effective:</strong> No reagents or consumables needed</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Clinician-guided:</strong> Supports, not replaces, clinical judgment</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Why It Matters */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <HeartPulse className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Why Vascular Reactivity Matters</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Long before structural disease becomes apparent, <strong>functional changes in vascular behavior</strong> may occur.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Ability of blood vessels to respond to changes in blood flow</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Early alterations that precede overt cardiovascular disease</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Eye className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Physiological dimension not captured by traditional risk factors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 5-Step Protocol */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-purple-900 mb-12">How the Test Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { step: 1, title: "Sensor Placement", icon: Fingerprint, desc: "Optical and thermal sensors placed on fingertips" },
                { step: 2, title: "Baseline", icon: LineChart, desc: "Recording resting signals under controlled conditions" },
                { step: 3, title: "Cuff Occlusion", icon: Activity, desc: "Standard arm cuff inflated briefly to alter blood flow" },
                { step: 4, title: "Recovery", icon: TrendingUp, desc: "Recording vascular responses as flow normalizes" },
                { step: 5, title: "Assessment", icon: BarChart2, desc: "Deriving quantitative vascular reactivity indices" }
              ].map((item) => (
                <div key={item.step} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-xl blur opacity-20 group-hover:opacity-100 transition duration-700 animate-pulse-slow"></div>
                  <div className="relative bg-white p-6 rounded-xl shadow-lg border border-purple-100 h-full transform transition-all duration-500 group-hover:scale-105">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                        {item.step}
                      </div>
                      <item.icon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-8 rounded-2xl border-l-4 border-purple-600">
            <p className="text-gray-800 text-center">
              <strong>Important:</strong> The test does not provide a diagnosis. Results are intended to be interpreted in the context of the patient's overall clinical picture.
            </p>
          </div>
        </div>
      </section>

      {/* For Clinicians Section */}
      <section id="for-clinicians" className="py-24 bg-gradient-to-b from-gray-50 to-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-100 px-4 py-2 rounded-full mb-4">
              <span className="text-purple-800 font-semibold">For Healthcare Professionals</span>
            </div>
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Empowering Clinicians with Actionable Insights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earlier insight, structured patient categorization, and long-term cardiovascular risk management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Earlier Insight */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Earlier Insight</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Objective assessment of vascular reactivity</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Evaluation in asymptomatic individuals</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Observation of silent physiological patterns</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Risk Stratification */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Patient Categorization</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Group by functional response patterns</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Distinguish stable vs. changing profiles</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Personalized follow-up intervals</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Workflow Integration */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <ClipboardCheck className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Workflow Integration</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Outpatient-friendly assessments</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Digital reports during consultations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm">Longitudinal data organization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-900 text-white p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Partner with Jendo?</h3>
            <p className="text-lg mb-6">Join healthcare professionals worldwide in transforming cardiovascular care</p>
            <a href="#contact" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Request a Demo
            </a>
          </div>
        </div>
      </section>

      {/* For Individuals Section */}
      <section id="for-individuals" className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-100 px-4 py-2 rounded-full mb-4">
              <span className="text-purple-800 font-semibold">For Individuals & Families</span>
            </div>
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Take an Active Role in Your Heart Health</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding your cardiovascular health doesn't have to be complicated
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Why It Matters Early */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Why It Matters Early</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Your heart and blood vessels work quietly every day. Changes often develop gradually without obvious symptoms.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Build Healthier Habits</p>
                      <p className="text-sm text-gray-600">Before issues arise</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Understand Impact</p>
                      <p className="text-sm text-gray-600">How lifestyle choices affect your body</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <UserCheck className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Take Proactive Role</p>
                      <p className="text-sm text-gray-600">In long-term wellbeing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How Jendo Supports You */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <HandHeart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">How Jendo Supports You</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Clear information and trends rather than isolated numbers.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">View vascular health measurements in one place</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Track changes over time vs. one-off readings</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">See how lifestyle relates to your health journey</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Come to visits better prepared and informed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Card */}
          <div className="relative group max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-purple-900 text-white p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <Lock className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold">Your Privacy & Data Protection</h3>
              </div>
              <p className="text-purple-100 mb-6">
                Your health information is personal—and Jendo treats it that way.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <ShieldCheck className="w-6 h-6 mb-2" />
                  <p className="font-semibold mb-1">Secure Storage</p>
                  <p className="text-sm text-purple-100">Industry-standard protections</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <UserCheck className="w-6 h-6 mb-2" />
                  <p className="font-semibold mb-1">You Control</p>
                  <p className="text-sm text-purple-100">How info is used & shared</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <Eye className="w-6 h-6 mb-2" />
                  <p className="font-semibold mb-1">Transparency</p>
                  <p className="text-sm text-purple-100">Clear privacy practices</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="#contact" className="inline-block bg-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-700 transition-colors text-lg">
              Get Started with Jendo
            </a>
          </div>
        </div>
      </section>


      {/* Product Showcase Section */}
      <section className="py-24 bg-gradient-to-b from-black to-purple-900/20 text-white overflow-hidden section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Product Image */}
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-3xl blur-lg opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow" />
              <div className="relative bg-black/50 backdrop-blur-xl p-8 rounded-3xl border border-purple-900/20 overflow-hidden transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2 group-hover:rotate-1">
                <Image
                  src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg"
                  alt="JENDO Device"
                  width={800}
                  height={600}
                  className="rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-4xl font-bold mb-6 relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-purple-100 via-purple-100 to-purple-300 bg-clip-text text-transparent animate-shine">
                  JENDO: The Future of Cardiovascular Health
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-900/20 blur-lg -z-10 animate-pulse-slow" />
              </h2>
              <div className="space-y-4 text-white-300 leading-relaxed">
                <p>
                  Jendo is an advanced, AI-powered vascular health monitoring system designed to detect endothelial dysfunction, the earliest indicator of cardiovascular diseases (CVDs). Using non-invasive technology, Jendo provides real-time analysis of vascular function in just 15 minutes, enabling early intervention and preventive care.
                </p>
                <p>
                  Integrated with AI and cloud computing, it ensures accuracy, consistency, and efficiency in diagnosing vascular health. Ideal for hospitals, clinics, and health-conscious individuals, Jendo empowers proactive healthcare, reduces treatment costs, and enhances patient outcomes.
                </p>
                <p>
                  With a seamless implementation process, Jendo is set to revolutionize preventive cardiology and reshape the future of vascular health management.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-purple-600 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-500/30">
                  <span className="text-white-900">15 Minutes</span>
                  <p className="text-sm text-white">Quick Results</p>
                </div>
                <div className="bg-purple-600 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-500/30">
                  <span className="text-white-900">87%+</span>
                  <p className="text-sm text-white">Sensitivity</p>
                </div>
                <div className="bg-purple-600 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-500/30">
                  <span className="text-white-900">Non-Invasive</span>
                  <p className="text-sm text-white">Painless Process</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section
        className="relative py-16 bg-gradient-to-b from-white to-purple-50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse-slow"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Jendo Patents Section */}
          <section id="jendo-patents" className="py-24 bg-white section-scroll">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14">
                <div className="flex flex-col items-center justify-center mb-4">
                  <span className="text-5xl md:text-6xl mb-2 animate-bounce">🏆</span>
                  <h2
                    className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 bg-clip-text text-transparent"
                    style={{
                      WebkitTextStroke: '2px #a855f7',
                      lineHeight: '1.1',
                      padding: '0.1em 0',
                      letterSpacing: '0.01em',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      textShadow: '0 2px 8px #c4b5fd, 0 1px 0 #fff'
                    }}
                  >
                    Jendo Patents: A Legacy of Global Innovation
                  </h2>
                </div>
                <p className="text-lg md:text-xl text-purple-700 font-semibold mb-2 flex items-center justify-center gap-2">
                  <span className="text-2xl">🌐</span>
                  Discover our worldwide recognition in non-invasive vascular health diagnostics
                </p>
                <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto mt-4">
                  At Jendo, our pursuit of excellence in cardiovascular innovation has earned us prestigious patents across the globe. From the cutting-edge labs of the United States to the high-tech hubs of Japan and the vibrant healthcare landscape of Sri Lanka, our patented technology is transforming preventive care.
                </p>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mt-2">
                  These recognitions are more than accolades—they are a testament to our vision, precision, and global impact in redefining how vascular health is monitored and managed.
                </p>
              </div>
              <div className="flex justify-center">
                <div
                  className="relative group perspective-1000"
                  style={{ width: 540, height: 380, maxWidth: '100%' }}
                >
                  {/* Enhanced animated purple glow border (thicker) */}
                  <div
                    className="absolute -inset-5 rounded-3xl pointer-events-none z-10"
                    style={{
                      boxShadow: '0 0 120px 40px #a78bfa, 0 0 0 24px #fff',
                      filter: 'blur(6px)',
                      opacity: 0.9,
                      animation: 'patent-glow 3s ease-in-out infinite alternate',
                      transition: 'opacity 0.3s'
                    }}
                  />
                  {/* Device image with 3D tilt and shadow, larger */}
                  <div
                    tabIndex={0}
                    role="button"
                    aria-label="Read more about Jendo Patents"
                    onClick={() => window.location.href = "/blog/jendo-patents"}
                    className="relative bg-black/50 backdrop-blur-xl p-0 rounded-3xl border-4 border-purple-300/60 overflow-hidden shadow-2xl cursor-pointer transition-transform duration-700 group-hover:scale-[1.06] group-hover:-translate-y-4 group-hover:rotate-2"
                    style={{
                      width: 520,
                      height: 360,
                      maxWidth: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      perspective: 1200,
                    }}
                  >
                    <img
                      src="https://i.ibb.co/g85CZcp/unnamed-1.png"
                      alt="Jendo Patent"
                      className="object-contain rounded-2xl shadow-xl border-8 border-white bg-white transition-transform duration-700"
                      style={{
                        width: 480,
                        height: 320,
                        objectFit: 'contain',
                        transform: 'rotateY(-10deg) rotateX(4deg) scale(1.04)',
                        boxShadow: '0 16px 64px 0 rgba(139,92,246,0.22), 0 8px 32px 0 rgba(0,0,0,0.12)',
                      }}
                    />
                    {/* Overlay for hover effect */}
                    <div className="absolute inset-0 rounded-3xl bg-purple-100/40 opacity-0 group-hover:opacity-100 transition duration-300 z-10"></div>
                    {/* Read More Button */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-14 py-3 rounded-full font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 z-20 text-base min-w-[180px] text-center">
                      Read More
                    </div>
                  </div>
                  {/* Custom keyframes for enhanced glow */}
                  <style jsx>{`
                      @keyframes patent-glow {
                        0% {
                          box-shadow: 0 0 120px 40px #a78bfa, 0 0 0 24px #fff;
                          opacity: 0.9;
                        }
                        50% {
                          box-shadow: 0 0 180px 60px #c4b5fd, 0 0 0 32px #ede9fe;
                          opacity: 1;
                        }
                        100% {
                          box-shadow: 0 0 120px 40px #a78bfa, 0 0 0 24px #fff;
                          opacity: 0.9;
                        }
                      }
                    `}</style>
                </div>
              </div>
            </div>
          </section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">Experience JENDO in Action</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Watch how our revolutionary technology is changing cardiovascular health monitoring.
            </p>
          </div>
          <div ref={videoSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Video 1 - Tablet Mockup */}
            <div className="relative group" data-video-container="1">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-white p-6 rounded-3xl shadow-2xl border border-purple-200">
                <div className="relative mx-auto max-w-2xl">
                  <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-3 shadow-2xl">
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-10"></div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                      <video
                        ref={videoRef1}
                        className="w-full h-full object-cover"
                        poster="/video-thumbnail.jpg"
                        playsInline
                        muted
                        loop
                      >
                        <source src="/jendo-showcase.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-purple-600/90 backdrop-blur-sm text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110">
                          {isVideoPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-purple-900/20 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">Real-Time Monitoring</h3>
                  <p className="text-sm text-gray-600">See how JENDO captures cardiovascular data in real-time</p>
                </div>
              </div>
            </div>

            {/* Video 2 - Tablet Mockup */}
            <div className="relative group" data-video-container="2">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-purple-50 to-white p-6 rounded-3xl shadow-2xl border border-purple-200">
                <div className="relative mx-auto max-w-2xl">
                  <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-3 shadow-2xl">
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-10"></div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                      <video
                        ref={videoRef2}
                        className="w-full h-full object-cover"
                        poster="/video_thumbnail2.png"
                        playsInline
                        muted
                        loop
                      >
                        <source src="/jendo_device.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-purple-600/90 backdrop-blur-sm text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110">
                          {isVideoPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-purple-900/20 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">Clinical Device Setup</h3>
                  <p className="text-sm text-gray-600">Professional-grade equipment for accurate assessments</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-base md:text-lg font-bold text-purple-700 max-w-2xl mx-auto">
              JENDO&apos;s non-invasive technology provides accurate cardiovascular health assessments in just 15 minutes,
              revolutionizing early detection and prevention of heart diseases.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Jendo Products Available Now!</h2>
            <p className="text-xl text-gray-600">Simple steps to monitor your cardiovascular health</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg"
                    alt="JENDO Basic Device"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Starter Package</h3>
                <div className="text-4xl font-bold text-purple-600 mb-6">$225</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>JENDO Basic Device</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>1 Month Software License</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>Basic Support</span>
                  </li>
                </ul>
                <button
                  onClick={() => addToCart({
                    id: 'basic-package',
                    name: 'JENDO Basic Device',
                    price: 225,
                    image_url: 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg',
                    description: 'Basic vascular monitoring device for home use'
                  })}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Professional Package */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-400 h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg"
                    alt="JENDO Pro Device"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Standard Package</h3>
                <div className="text-4xl font-bold text-purple-600 mb-6">$2250</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>JENDO Pro Device</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>1 Year Software License</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>Advanced Analytics</span>
                  </li>
                </ul>
                <button
                  onClick={() => addToCart({
                    id: 'pro-package',
                    name: 'JENDO Pro Device',
                    price: 2250,
                    image_url: 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg',
                    description: 'Professional vascular monitoring system for clinics'
                  })}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Enterprise Package */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
                  <Image
                    src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg"
                    alt="JENDO Enterprise Package"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Enterprise Package</h3>
                <div className="text-4xl font-bold text-purple-600 mb-6">Custom</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>Multiple JENDO Devices</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>Enterprise Software License</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>24/7 Premium Support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span>Custom Integration</span>
                  </li>
                </ul>
                <button
                  onClick={() => addToCart({
                    id: 'enterprise-package',
                    name: 'JENDO Enterprise Package',
                    price: 4999,
                    image_url: 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg',
                    description: 'Enterprise-level monitoring solution for hospitals'
                  })}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-24">
        {/* Steps */}
        {/* <div className="space-y-8">
              {[
                // {
                //   step: 1,
                //   title: "Book Your Test",
                //   description: "Pre-order online or visit certified labs",
                //   icon: Calendar,
                //   delay: "0s"
                // },
                // {
                //   step: 2,
                //   title: "Undergo Non-Invasive Testing",
                //   description: "15-minute painless procedure",
                //   icon: Activity,
                //   delay: "0.2s"
                // },
                // {
                //   step: 3,
                //   title: "Receive Your Report",
                //   description: "AI-driven insights delivered securely",
                //   icon: FileText,
                //   delay: "0.4s"
                // },
                // {
                //   step: 4,
                //   title: "Consult a Doctor",
                //   description: "Professional advice based on your results",
                //   icon: Stethoscope,
                //   delay: "0.6s"
                // }
              ].map((item) => (
                <div 
                  key={item.step}
                  className="relative group"
                  style={{ animationDelay: item.delay }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                  <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-purple-100 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                          {item.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}

      </div>


      <div className="mt-32">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-purple-900 mb-4">Step-by-Step JENDO Test Procedure</h3>
          <p className="text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Detailed walkthrough of the testing process
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Timeline Line with Numbers */}
          <div className="absolute left-10 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600/20 via-purple-600 to-purple-600/20 transform md:-translate-x-1/2"></div>

          {[
            {
              title: "Patient Preparation",
              steps: [
                "Patient is placed in a supine position (lying down comfortably on their back)",
                "Ensure a calm environment to reduce external factors influencing results"
              ],
              icon: BedDouble,
              color: "from-blue-600 to-blue-900"
            },
            {
              title: "Signal Extraction",
              steps: [
                "A pressure cuff is wrapped around the patient's arm",
                "The cuff is inflated to maintain 30 mmHg above the systolic pressure for 5 minutes"
              ],
              icon: Waves,
              color: "from-purple-600 to-purple-900"
            },
            {
              title: "Data Collection",
              steps: [
                "PPG (Photoplethysmography): Captures pulse signals from the vascular system",
                "DTM (Digital Thermal Monitoring): Measures temperature variations in the blood flow",
                "ECG (Electrocardiography): Records the electrical activity of the heart"
              ],
              icon: LineChart,
              color: "from-green-600 to-green-900"
            },
            {
              title: "Cloud-Based Analysis",
              steps: [
                "The extracted data is uploaded securely to JENDO's cloud platform",
                "AI-powered algorithms process the signals to evaluate vascular condition",
                "Data encryption ensures secure handling of patient information"
              ],
              icon: Cloud,
              color: "from-indigo-600 to-indigo-900"
            },
            {
              title: "Report Generation",
              steps: [
                "A detailed Vascular Health Report is generated",
                "Highlights current vascular conditions and future cardiovascular risk factors"
              ],
              icon: FileText,
              color: "from-red-600 to-red-900"
            },
            {
              title: "Consultation with Doctor",
              steps: [
                "The report can be reviewed by a physician",
                "Recommendations for preventive measures or further treatments"
              ],
              icon: Stethoscope,
              color: "from-yellow-600 to-yellow-900"
            }
          ].map((item, index) => (
            <div
              key={index}
              className={`relative mb-16 pl-16 md:pl-0 
          ${index % 2 === 0
                  ? 'md:ml-[calc(50%+2rem)] md:pr-8'
                  : 'md:mr-[calc(50%+2rem)] md:pl-8 md:text-right'} 
          md:w-[calc(50%-4rem)] animate-fade-in`}
            >
              {/* Number directly on the timeline */}
              <div
                className="absolute top-0 left-10 md:left-1/2 transform md:-translate-x-1/2 z-10"
              >
                <div className="bg-purple-600 text-white font-bold rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                  0{index + 1}
                </div>
              </div>

              {/* Timeline Node - Empty circle, no number */}
              <div
                className={`absolute top-0 left-10 md:left-1/2 transform md:-translate-x-1/2
            w-3 h-3 md:w-4 md:h-4 rounded-full bg-white border-2 border-purple-600 z-5 mt-16`}
              >
              </div>

              {/* Content Card */}
              <div className="relative group mt-12 md:mt-0">
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow`}></div>
                <div className="relative bg-white p-4 md:p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                      <item.icon className="w-8 h-8 md:w-12 md:h-12 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">{item.title}</h4>
                      <ul className="space-y-3">
                        {item.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-600 mt-1 flex-shrink-0" />
                            <span className="text-sm md:text-base text-gray-600">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emma Gallery Section */}
      <section id="emma-gallery" className="py-20 bg-gradient-to-b from-purple-50 to-white section-scroll relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">Jendo Gallery</h2>
            <p className="text-lg text-gray-600">
              Explore memorable moments and milestones from Jendo’s journey in transforming cardiovascular health.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8" id="emma-gallery-images">
            {[
              { src: "https://i.ibb.co/1tSm4mkJ/Whats-App-Image-2025-07-14-at-13-51-07-40106ee2.jpg", alt: "Health Camp Team Consultation" },
              { src: "https://i.ibb.co/ymS4bvYM/Whats-App-Image-2025-07-14-at-13-51-07-72813403.jpg", alt: "Healthcare Professional Assessment" },
              { src: "https://i.ibb.co/fz8hvcwW/Whats-App-Image-2025-07-14-at-13-51-07-d33c7810.jpg", alt: "Cardiovascular Screening Process" },
              { src: "https://i.ibb.co/hJ7TcWZx/Whats-App-Image-2025-07-14-at-13-51-08-2c551ce7.jpg", alt: "Medical Team Collaboration" },
              { src: "https://i.ibb.co/dwfnDPDT/Whats-App-Image-2025-07-14-at-13-51-08-38e09f3b.jpg", alt: "Patient Care Session" },
              { src: "https://i.ibb.co/G4wDD4xS/Whats-App-Image-2025-07-14-at-13-51-36-160dfb2a.jpg", alt: "Health Monitoring Setup" },
              { src: "https://i.ibb.co/zYn5mwS/Whats-App-Image-2025-07-14-at-13-51-38-1604ef8d.jpg", alt: "Community Health Event" },
              { src: "https://i.ibb.co/Y4tJ9dvK/Whats-App-Image-2025-07-14-at-13-51-36-5255e477.jpg", alt: "Professional Training Session" },
              { src: "https://i.ibb.co/39kCjbJw/Whats-App-Image-2025-07-14-at-13-51-35-6ef53381.jpg", alt: "Clinical Assessment Demo" },
              { src: "https://i.ibb.co/5XWpWYSZ/Whats-App-Image-2025-07-14-at-13-51-38-780c184c.jpg", alt: "Healthcare Innovation" },
              { src: "https://i.ibb.co/rf0RzYvm/Whats-App-Image-2025-07-14-at-14-22-26-621a4f6a.jpg", alt: "Team Achievement Moment" }
            ].map((image, index) => (
              <div 
                key={index} 
                className="gallery-item relative group overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                onClick={() => {
                  setLightboxImage(image);
                  setLightboxOpen(true);
                }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-900 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500 -z-10"></div>
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-white p-1">
                  <div className="relative overflow-hidden rounded-xl">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-gradient-to-r from-purple-600/95 to-purple-900/95 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white text-sm font-semibold text-center">{image.alt}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg">
                  <Heart className="w-4 h-4 inline-block mr-1" />
                  View
                </div>
              </div>
            ))}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes popIn {
            0% { opacity: 0; transform: scale(0.8) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .gallery-item {
            animation: popIn 0.6s ease-out forwards;
            opacity: 0;
          }
          .gallery-item:nth-child(1) { animation-delay: 0ms; }
          .gallery-item:nth-child(2) { animation-delay: 100ms; }
          .gallery-item:nth-child(3) { animation-delay: 200ms; }
          .gallery-item:nth-child(4) { animation-delay: 300ms; }
          .gallery-item:nth-child(5) { animation-delay: 400ms; }
          .gallery-item:nth-child(6) { animation-delay: 500ms; }
          .gallery-item:nth-child(7) { animation-delay: 600ms; }
          .gallery-item:nth-child(8) { animation-delay: 700ms; }
          .gallery-item:nth-child(9) { animation-delay: 800ms; }
          .gallery-item:nth-child(10) { animation-delay: 900ms; }
          .gallery-item:nth-child(11) { animation-delay: 1000ms; }
        `}</style>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={lightboxImage.src}
                  alt={lightboxImage.alt}
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                />
              </div>
              <div className="mt-4 bg-purple-600/90 backdrop-blur-sm rounded-lg px-6 py-3 max-w-2xl">
                <p className="text-white text-center font-semibold">{lightboxImage.alt}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <section id="stats" className="relative py-32 bg-gradient-to-b from-gray-900 via-black to-purple-900/20 text-white overflow-hidden section-scroll">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse-slow" />
          <style jsx>{`
            @keyframes float-element {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
            }
            .float-orb {
              animation: float-element var(--animation-duration) infinite ease-in-out;
            }
          `}</style>
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => {
              const seed = i;
              const width = (seed * 73) % 300 + 50;
              const height = (seed * 157) % 300 + 50;
              const top = (seed * 41) % 100;
              const left = (seed * 89) % 100;
              const duration = (seed * 11) % 10 + 5;
              const delay = (seed * 23) % 10;
              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-purple-600/10 float-orb"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${top}%`,
                    left: `${left}%`,
                    '--animation-duration': `${duration}s`,
                    animationDelay: `-${delay}s`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 bg-clip-text text-transparent animate-shine">
                Cardiovascular Disease Impact
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-900/20 blur-lg -z-10 animate-pulse-slow" />
            </h2>
            <p className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              War is not the number one killer in the world, but cardiovascular diseases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur-lg opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow" />
              <div className="relative bg-black/50 backdrop-blur-xl p-12 rounded-2xl border border-purple-900/20 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2 group-hover:rotate-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-900/5 rounded-2xl" />
                <div className="relative flex flex-col items-center space-y-6">
                  <div className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 animate-float animate-shine">
                    17.7M+
                  </div>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse-slow" />
                  <p className="text-lg sm:text-2xl text-gray-300 text-center">
                    People die every year from CVD
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur-lg opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow" />
              <div className="relative bg-black/50 backdrop-blur-xl p-12 rounded-2xl border border-purple-900/20 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2 group-hover:rotate-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-900/5 rounded-2xl" />
                <div className="relative flex flex-col items-center space-y-6">
                  <div className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 animate-float animate-shine" style={{ animationDelay: '0.2s' }}>
                    50%
                  </div>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse-slow" />
                  <p className="text-lg sm:text-2xl text-gray-300 text-center">
                    Of CVD deaths can be prevented with early diagnosis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Value preposition of jendo</h2>
            <p className="text-xl text-gray-600">Empowering healthcare through innovation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Patients */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-purple-600 mb-6">
                <Heart className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Patients</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Early detection of cardiovascular diseases</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Personalized health reports</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Proactive healthcare solutions</span>
                </li>
              </ul>
              <button
                onClick={handlePreOrderClick}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Get Started Now</span>
              </button>
            </div>

            {/* For Labs */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-purple-600 mb-6">
                <Flask className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Labs</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Expand your service portfolio</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Cutting-edge monitoring solutions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Non-invasive testing methods</span>
                </li>
              </ul>
              <button
                onClick={handlePreOrderClick}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Get Started Now</span>
              </button>
            </div>

            {/* For Insurance Partners */}
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="text-purple-600 mb-6">
                <Shield className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Insurance Partners</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Enhanced risk assessment</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Reduced claim risks</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-600">Improved customer engagement</span>
                </li>
              </ul>
              <button
                onClick={handlePreOrderClick}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Get Started Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-50 section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600">Meet the experts behind JENDO</p>
          </div>

          {/* Senior Advisors */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-purple-600 mb-8 text-center">SENIOR ADVISORS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seniorAdvisors.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center p-6"
                >
                  <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  {member.credentials && <p className="text-sm text-purple-600 mb-2">{member.credentials}</p>}
                  <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                  {member.additionalRole && <p className="text-sm text-gray-500 mb-4">{member.additionalRole}</p>}
                  <div className="flex space-x-4">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.facebook && (
                      <a
                        href={member.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.instagram && (
                      <a
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Board Members */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-purple-600 mb-8 text-center">BOARD MEMBERS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center p-6"
                >
                  <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{member.role}</p>
                  <div className="flex space-x-4">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.facebook && (
                      <a
                        href={member.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.instagram && (
                      <a
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Development Team */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-purple-600 mb-8 text-center">JENDO DEVELOPMENT TEAM</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {developmentTeam.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center p-6"
                >
                  <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  {member.credentials && <p className="text-sm text-purple-600 mb-2">{member.credentials}</p>}
                  <p className="text-sm text-gray-600 mb-4">{member.role}</p>
                  <div className="flex space-x-4">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.facebook && (
                      <a
                        href={member.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.instagram && (
                      <a
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recognition & Awards Section */}
      <section id="recognition" className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white section-scroll relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.08),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-white/5 px-4 py-2 rounded-full mb-4 backdrop-blur-sm border border-white/10">
              <span className="text-purple-300 font-semibold">International Recognition</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">Global Innovation & Clinical Excellence</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Recognized worldwide for advancing cardiovascular prevention through responsible AI and clinical innovation
            </p>
          </div>

          {/* Awards Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400/40 via-indigo-400/40 to-purple-400/40 transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-12">
              {[
                { year: "2025", title: "Presidential Gold Award", org: "Government of Sri Lanka", icon: Award, color: "from-yellow-500 to-yellow-600" },
                { year: "2025", title: "ICT Leader of the Year", org: "CSSL", icon: Award, color: "from-purple-500 to-purple-600" },
                { year: "2025", title: "Global Initiative on AI for Health", org: "ITU / WHO / WIPO - Panelist & Contributor", icon: Globe, color: "from-blue-500 to-blue-600" },
                { year: "2023", title: "WIPO Global Innovation Awards", org: "Nominee", icon: Award, color: "from-purple-500 to-indigo-600" },
                { year: "2022", title: "CEO of the Year - AI Category", org: "National ICT Awards", icon: Award, color: "from-purple-500 to-purple-600" },
                { year: "2021", title: "Patents Granted", org: "United States & Japan", icon: FileText, color: "from-green-500 to-green-600" },
                { year: "2021", title: "IEEE Research Publication", org: "Biomedical Engineering World Congress", icon: BookOpen, color: "from-blue-500 to-cyan-600" },
                { year: "2018", title: "Best Startup of the Year", org: "National ICT Awards", icon: Award, color: "from-purple-500 to-purple-600" },
                { year: "2018", title: "MetLife CEO Award", org: "Regional Innovation Competition", icon: Award, color: "from-blue-500 to-blue-600" },
                { year: "2017", title: "Top 10 Innovations", org: "Cambridge Innovations Forum - University of Cambridge", icon: Award, color: "from-purple-500 to-pink-600" }
              ].map((item, index) => (
                <div key={index} className={`relative ${index % 2 === 0 ? 'md:pr-[50%] md:text-right' : 'md:pl-[50%] md:text-left'}`}>
                  <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>
                    <div className="relative bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 shadow-lg">
                      <div className={`flex items-center gap-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-purple-400 font-semibold mb-1 text-sm">{item.year}</div>
                          <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                          <p className="text-slate-400">{item.org}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="absolute top-6 left-1/2 w-4 h-4 bg-purple-400 rounded-full transform -translate-x-1/2 border-4 border-slate-900 hidden md:block shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Publications */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full flex flex-col shadow-lg">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-400 mr-3" />
                  <h4 className="text-lg font-bold text-white">IEEE Xplore</h4>
                </div>
                <p className="text-slate-400 mb-4">Peer-reviewed clinical research publication</p>
                <a href="https://ieeexplore.ieee.org/document/9629748" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mt-auto">
                  View Publication <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full flex flex-col shadow-lg">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 text-green-400 mr-3" />
                  <h4 className="text-lg font-bold text-white">PubMed</h4>
                </div>
                <p className="text-slate-400 mb-4">Indexed medical research database</p>
                <a href="https://pubmed.ncbi.nlm.nih.gov/33254535/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors mt-auto">
                  View Publication <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy, Security & Ethics Section */}
      <section id="privacy" className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Privacy, Security & Ethics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Core principles—not afterthoughts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Data Confidentiality */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-purple-100 h-full">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Data Confidentiality</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Personal & health data treated as confidential</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Restricted access to authorized users only</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Used only for intended purposes</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Secure Infrastructure */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-purple-100 h-full">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Infrastructure</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Secure server environments with controlled access</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Encrypted data transmission</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Protection at rest and in transit</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* User Control */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-purple-100 h-full">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">User Control</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Users can view their own health information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Sharing occurs with user consent</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>No selling of personal health data</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Ethical AI */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-purple-100 h-full">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ethical AI Use</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Supportive, not autonomous</strong></span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Non-diagnostic outputs</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>No autonomous treatment decisions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Our Commitment to Responsible Health Technology</h3>
                <p className="text-gray-700 mb-4">
                  Jendo recognizes that trust is essential in health technology. Privacy, security, and ethics are integrated into how the platform is designed, developed, and deployed.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">Respect individual privacy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">Protect sensitive health data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">Use technology responsibly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research & Evidence Section */}
      <section id="research" className="py-24 bg-gradient-to-b from-gray-50 to-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Research & Evidence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Grounded in biomedical research and evidence-based principles
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Core Research */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Core Jendo Research</h3>
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-3">A Hybrid Approach for Screening Endothelial Dysfunction</h4>
                <p className="text-gray-700 mb-6">
                  This study presents the scientific rationale and technical framework for combining non-invasive physiological signals to assess vascular reactivity and support early cardiovascular health insight.
                </p>
                <a 
                  href="https://ieeexplore.ieee.org/document/9629748" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                >
                  Read Published Research <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            {/* Ongoing Validation */}
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 animate-pulse-slow"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-purple-100 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Microscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Ongoing Research</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  Jendo continues to engage in ongoing research and validation activities:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Exploratory clinical evaluations under real-world conditions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Methodological refinement of signal acquisition and analysis</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Collaboration with clinicians and academic partners</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* External Research Publications */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-purple-900 mb-4">Related Research Publications</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Peer-reviewed studies supporting cardiovascular assessment and vascular health monitoring
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Arterial Stiffness and Wave Reflection",
                  journal: "PMC - Cardiovascular Research",
                  year: "2015",
                  description: "Comprehensive review of arterial stiffness as a marker of cardiovascular disease and its clinical implications.",
                  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4553666/",
                  imageUrl: "https://i.ibb.co/C5vwTMxM/research1.jpg"
                },
                {
                  title: "Endothelial Function and Cardiovascular Disease",
                  journal: "PubMed - Circulation",
                  year: "2007",
                  description: "Assessment of endothelial function in clinical practice and its role in cardiovascular risk prediction.",
                  url: "https://pubmed.ncbi.nlm.nih.gov/17430168/",
                  imageUrl: "https://i.ibb.co/d4r9Y60B/research2-blue.jpg"
                },
                {
                  title: "Photoplethysmography Signal Processing",
                  journal: "MDPI Electronics",
                  year: "2019",
                  description: "Advanced signal processing techniques for PPG-based cardiovascular monitoring systems.",
                  url: "https://www.mdpi.com/2079-9292/8/3/271",
                  imageUrl: "https://i.ibb.co/wNh5BnPP/research3.jpg"
                },
                {
                  title: "Vascular Aging and Assessment Methods",
                  journal: "MDPI Sensors",
                  year: "2018",
                  description: "Non-invasive methods for assessing vascular aging and arterial health using sensor technologies.",
                  url: "https://www.mdpi.com/1424-8220/18/6/1894",
                  imageUrl: "https://i.ibb.co/C5vwTMxM/research1.jpg"
                },
                {
                  title: "Digital Thermal Monitoring in Vascular Assessment",
                  journal: "PubMed - Vascular Medicine",
                  year: "2010",
                  description: "Clinical validation of digital thermal monitoring for vascular reactivity assessment.",
                  url: "https://pubmed.ncbi.nlm.nih.gov/20459206/",
                  imageUrl: "https://i.ibb.co/d4r9Y60B/research2-blue.jpg"
                },
                {
                  title: "Cardiovascular Risk Prediction Models",
                  journal: "PubMed - Clinical Research",
                  year: "2016",
                  description: "Novel approaches to cardiovascular risk stratification using physiological biomarkers.",
                  url: "https://pubmed.ncbi.nlm.nih.gov/27830091/",
                  imageUrl: "https://i.ibb.co/wNh5BnPP/research3.jpg"
                }
              ].map((research, index) => (
                <a
                  key={index}
                  href={research.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] flex flex-col h-full border border-gray-100"
                >
                  {/* Gradient Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500 -z-10"></div>
                  
                  {/* Research Image with Enhanced Quality */}
                  <div className="relative h-72 w-full bg-white overflow-hidden flex items-center justify-center p-4">
                    <div className="relative w-full h-full">
                      <Image
                        src={research.imageUrl}
                        alt={research.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={100}
                        priority={index < 3}
                        unoptimized={true}
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl z-20 border border-white/20">
                      {research.year}
                    </div>
                    {/* Enhanced Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/95 via-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 z-20">
                      <span className="text-white text-lg font-bold flex items-center gap-2 animate-fade-in">
                        <FileText className="w-5 h-5" />
                        Read Full Paper 
                        <ExternalLink className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="p-8 flex-1 flex flex-col bg-gradient-to-b from-white to-purple-50/30">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm text-purple-700 font-semibold tracking-wide uppercase">{research.journal}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
                      {research.title}
                    </h4>
                    <p className="text-gray-700 text-base mb-6 line-clamp-4 flex-1 leading-relaxed">
                      {research.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t-2 border-gray-200">
                      <span className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        External Publication
                      </span>
                      <div className="w-10 h-10 rounded-full bg-purple-100 group-hover:bg-purple-600 flex items-center justify-center transition-all duration-300">
                        <ExternalLink className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Technology Foundation */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-900 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Scientific Foundation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Activity className="w-6 h-6 mr-3" />
                  <h4 className="text-xl font-bold">Photoplethysmography (PPG)</h4>
                </div>
                <p className="text-purple-100">
                  Assesses vascular tone, pulse waveform characteristics, and peripheral blood flow dynamics.
                </p>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Waves className="w-6 h-6 mr-3" />
                  <h4 className="text-xl font-bold">Digital Thermal Monitoring (DTM)</h4>
                </div>
                <p className="text-purple-100">
                  Evaluates microvascular responses by measuring temperature changes following transient blood flow occlusion.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center bg-purple-50 p-8 rounded-2xl border border-purple-200">
            <p className="text-gray-800 text-lg">
              <strong>Endothelial dysfunction</strong> represents an early functional abnormality in the cardiovascular disease continuum, consistently shown in peer-reviewed studies to be associated with increased risk even when individuals appear clinically stable or asymptomatic.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">Latest News</h2>
            <p className="text-lg text-gray-600">Stay updated with our latest developments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] h-full flex flex-col border border-gray-100"
              >
                <div className="block h-full">
                  {/* Gradient Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500 -z-10"></div>
                  
                  <div className="relative h-[280px] w-full bg-gradient-to-br from-purple-50 to-white overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"></div>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                      quality={100}
                      loading="eager"
                      unoptimized={false}
                    />
                  </div>
                  <div className="p-8 flex-1 flex flex-col bg-gradient-to-b from-white to-purple-50/30">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 text-base mb-6 line-clamp-3 flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-auto pb-6 border-b-2 border-gray-200">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-purple-600" />
                        <span className="truncate max-w-[120px] font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">{post.date}</span>
                      </div>
                    </div>
                    {/* Read More Button */}
                    <a
                      href={
                        index === 0
                          ? 'https://www.ft.lk/front-page/Breakthrough-for-deep-tech-in-Sri-Lanka-Jendo-closes-new-investment-round/44-781375'
                          : post.url
                      }
                      className="mt-6 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-full font-bold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                      target={index === 0 ? undefined : "_blank"}
                      rel={index === 0 ? undefined : "noopener noreferrer"}
                    >
                      Read More
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-purple-900/100 to-black text-white relative overflow-hidden section-scroll">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(129, 13, 238, 0.68),)] animate-pulse-slow" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Get the latest articles and news about cardiovascular health delivered to your inbox.
          </p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600">Get in touch with our team</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Book an appointment</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);

                const formData = new FormData(e.target as HTMLFormElement);

                try {
                  // Format the current time for the template
                  const now = new Date();
                  const timeString = now.toLocaleString();

                  // Create template parameters to match your template variables
                  const templateParams = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    time: timeString,
                    // These will be empty but included to match the template
                    phone: '',
                    date: '',
                    to_email: 'keerthi@effectivesolutions.lk, keerthi.office1990@gmail.com'
                  };

                  const result = await emailjs.send(
                    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
                    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
                    templateParams,
                    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
                  );

                  if (result.text === 'OK') {
                    setShowSuccess(true);  // Show the success modal instead of just toast
                    (e.target as HTMLFormElement).reset();
                  } else {
                    throw new Error('Failed to send message');
                  }
                } catch (error) {
                  toast.error('Failed to send message');
                  console.error('Error:', error);
                } finally {
                  setIsSubmitting(false);
                }
              }} className="space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl blur-sm opacity-10 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="block w-full px-4 py-3 rounded-xl border-0 bg-white/80 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white"
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl blur-sm opacity-10 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="block w-full px-4 py-3 rounded-xl border-0 bg-white/80 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl blur-sm opacity-10 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="block w-full px-4 py-3 rounded-xl border-0 bg-white/80 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl blur-sm opacity-10 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="block w-full px-4 py-3 rounded-xl border-0 bg-white/80 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white resize-none"
                      required
                      placeholder="Enter your message"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 group"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <span className="group-hover:translate-x-1 transition-transform">Book Appointment</span>
                  )}
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
              <div className="space-y-4">
                <p className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Bay X, Trace Expert City</span>
                </p>
                <p className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>keerthi@jendoinnovations.com</span>
                </p>
                <p className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-purple-600" />
                  <span>0766210120</span>
                </p>
              </div>
              {/* Google Maps Integration */}
              <div className="relative group mt-6">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl blur-sm opacity-10 group-hover:opacity-25 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
                  <div className="aspect-[21/9] w-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8661325756734!2d79.85888677489614!3d6.930059893067721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591076e625a3%3A0xad34e9e40449036b!2sTrace%20Expert%20City!5e0!3m2!1sen!2sus!4v1706579876041!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <span className="text-sm text-gray-900">Trace Expert City, Colombo 10, Sri Lanka</span>
                      </div>
                      <a
                        href="https://www.google.com/maps/place/Trace+Expert+City/@6.9300599,79.8588868,17z/data=!3m1!4b1!4m6!3m5!1s0x3ae2591076e625a3:0xad34e9e40449036b!8m2!3d6.9300599!4d79.8614617!16s%2Fg%2F1q6j8f3r1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 text-sm border border-transparent font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-order Modal */}
      {isPreOrderModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Pre-order JENDO</h3>
              <button
                onClick={() => setIsPreOrderModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              formData.set('start_time', preOrderStart ? preOrderStart.toISOString() : '');
              formData.set('end_time', preOrderEnd ? preOrderEnd.toISOString() : '');
              handlePreOrderSubmit(e);
            }} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="full_name"
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="package" className="block text-sm font-medium text-gray-700">Preferred Package</label>
                <select
                  id="package"
                  name="package_type"
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                >
                  <option value="">Select a package</option>
                  <option value="starter">Starter Package ($225)</option>
                  <option value="professional">Standard Package ($2250)</option>
                  <option value="enterprise">Enterprise Package (Custom)</option>
                </select>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                <textarea
                  id="address"
                  name="delivery_address"
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Time Range</label>
                <div className="flex gap-2">
                  <DatePicker
                    selected={preOrderStart}
                    onChange={date => setPreOrderStart(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Start Date & Time"
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  />
                  <DatePicker
                    selected={preOrderEnd}
                    onChange={date => setPreOrderEnd(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="End Date & Time"
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>
              {bookingError && (
                <div className="mb-4 text-center text-red-600 font-semibold">
                  {bookingError}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Complete Pre-order</span>
              </button>
            </form>
          </div>
        </div>
      )}


      {isLabPartnerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Book a Check Up</h3>
              <button
                onClick={() => setIsLabPartnerModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              // Always set start_time and end_time in FormData before submit
              formData.set('start_time', checkupStart ? checkupStart.toISOString() : '');
              formData.set('end_time', checkupEnd ? checkupEnd.toISOString() : '');
              // Call the handler with the event only
              handleLabPartnerSubmit(e);
            }} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="full_name"
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="checkup_type" className="block text-sm font-medium text-gray-700">
                  Check Up Type
                </label>
                <select
                  id="checkup_type"
                  name="checkup_type"
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                >
                  <option value="">Select a check up type</option>
                  {/* <option value="consultation">Jendo Consultation Patient Checkup (Rs. 5000)</option> */}
                  {/* <option value="full">Jendo Full Check Up (Rs. 8000)</option> */}
                  <option value="trial">Test trial + Consultation (USD 17.5)</option>
                </select>
              </div>
              {/* <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div> */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Check Up</span>
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Time Range</label>
                <div className="flex gap-2">
                  <DatePicker
                    selected={checkupStart}
                    onChange={date => setCheckupStart(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Start Date & Time"
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  />
                  <DatePicker
                    selected={checkupEnd}
                    onChange={date => setCheckupEnd(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="End Date & Time"
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>
              {bookingError && (
                <div className="mb-4 text-center text-red-600 font-semibold">
                  {bookingError}
                </div>
              )}
              <FormNotification /> {/* Add this line */}
            </form>
          </div>
        </div>
      )}

      {isInsuranceModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Insurance Partner Ship</h3>
              <button
                onClick={() => setIsInsuranceModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleInsuranceSubmit} className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="company_name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contact_person"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="insuranceEmail" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="insuranceEmail"
                  name="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="insurancePhone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  id="insurancePhone"
                  name="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
              >
                Submit Partnership Request
              </button>
              <FormNotification /> {/* Add this line */}
            </form>
          </div>
        </div>
      )}

      {showSuccess && (
        <AppointmentSuccess onClose={() => setShowSuccess(false)} />
      )}

      {showPayhere && payment && (
        <PayhereForm payment={payment} />
      )}
    </>
  );
}