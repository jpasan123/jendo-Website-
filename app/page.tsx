'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { Heart, Shield, ArrowRight, Users, Activity, Download, MapPin, Mail, Clock, User, LineChart, FlaskRound as Flask, Building2, Stethoscope, FileHeart, ChartBar, Brain, Microscope, BarChart3, ShieldCheck, PieChart, HandHeart, Facebook, Twitter, Linkedin, CreditCard, Package, CheckCircle, ShoppingCart, X, Calendar, FileText, BedDouble, Waves, Cloud, Instagram, FacebookIcon, Award, Globe, BookOpen, Lock, Eye, Database, Cpu, TrendingUp, Target, Zap, Fingerprint, HeartPulse, ClipboardCheck, UserCheck, Building, Share2, BarChart2, ExternalLink, AlertTriangle, ScanLine, Ban } from 'lucide-react';
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
    // professional: { amount: 2400, currency: "USD" },
    enterprise: { amount: 0, currency: "USD" }, // Custom, handle as needed
  };

  return (
    <>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-start sm:items-center section-scroll overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/jendo1.jpeg"
            alt="Jendo Background"
            fill
            className="object-cover"
            priority
            quality={100}
            unoptimized
          />
          {/* Left-side gradient for text legibility, right stays clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          {/* Subtle purple accent */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,hsla(276,46%,42%,0.22),transparent_55%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 pt-28 pb-16 sm:pt-16 sm:pb-28 md:pt-10">
          <div className="flex flex-col items-start max-w-3xl">


            {/* Main heading — Red Hat Display via CSS variable */}
            <h1
              className="text-left text-white tracking-tight mt-4 sm:mt-10 md:mt-32 mb-4 sm:mb-6"
              style={{
                fontFamily: "var(--font-red-hat-display), sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(2.2rem, 7vw, 4rem)',
                lineHeight: 1.1,
              }}
            >
              {/* first line */}
              <span className="block">
                Assuring{' '}
                <span
                  style={{
                    display: 'inline',
                    color: '#b588d9',
                  }}
                >
                  Vascular Health
                </span>
              </span>
              {/* second line */}
              <span className="block">for a Quality Life</span>
            </h1>

            {/* Sub-copy */}
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mb-7 sm:mb-10">
              A clinically validated, non-invasive vascular health test &mdash; designed as an alternative
              to costly, operator-dependent cardiovascular assessments. Built to transform primary
              care and prevention at scale.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mb-7 sm:mb-10">
              {[
                { value: '15 min', label: 'Test Duration' },
                { value: 'Non-invasive', label: 'Procedure' },
                { value: 'AI-powered', label: 'Analysis' },
              ].map((stat) => (
                <div key={stat.value} className="text-left">
                  <p
                    className="text-white text-xl sm:text-2xl"
                    style={{ fontFamily: 'var(--font-red-hat-display), sans-serif', fontWeight: 700 }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a
                href="#for-clinicians"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: '#893A9F' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7a3390')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#893A9F')}
              >
                <Stethoscope className="h-4 w-4" />
                For Clinicians
              </a>
              <a
                href="#for-individuals"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
              >
                <Heart className="h-4 w-4" />
                For Individuals
              </a>
              <button
                onClick={handlePreOrderClick}
                className="inline-flex items-center gap-2 bg-white text-sm font-bold px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-md"
                style={{ color: '#893A9F' }}
              >
                <ShoppingCart className="h-4 w-4" />
                Pre-Order Now
              </button>
            </div>
          </div>
        </div>


      </section>

      {/* Problem & Solution Section */}
      <section className="py-14 bg-[#f9f9fb] section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

            {/* ── LEFT: The Problem ── */}
            <div className="relative overflow-hidden rounded-2xl flex flex-col" style={{background:"linear-gradient(145deg,#fff5f7 0%,#fff 55%,#fff 100%)",border:"1px solid #fecdd3"}}>

              {/* Decorative background circle */}
              <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full opacity-[0.04]" style={{background:"#f6d6e7"}} />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-[0.04]" style={{background:"#f6d6e7"}} />

              <div className="relative p-8 flex flex-col space-y-6 flex-1">
                {/* Label pill */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#c97ba8]" style={{background:"rgba(201,123,168,0.10)",fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                    <AlertTriangle className="w-3.5 h-3.5 text-[#c97ba8]" />
                    The Problem
                  </span>
                </div>
                {/* Heading */}
                <div>
                  <h2 className="text-[1.75rem] sm:text-3xl font-extrabold text-gray-900 mb-3 leading-tight" style={{fontFamily:"var(--font-red-hat-display),sans-serif",letterSpacing:"-0.02em"}}>
                    Cardiovascular disease remains the{" "}
                    <span style={{color:"#c97ba8"}}>leading cause</span>{" "}
                    of death worldwide.
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                    Despite medical advances, most risk goes undetected until it's too late.
                  </p>
                </div>

                {/* Stat callout */}
                <div className="flex items-center gap-4 rounded-xl px-4 py-3.5" style={{background:"rgba(225,29,72,0.06)",border:"1px solid rgba(225,29,72,0.12)"}}>
                  <div className="text-[2rem] font-extrabold leading-none text-[#c97ba8]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>17.9M</div>
                  <p className="text-xs text-gray-500 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                    deaths per year attributed to cardiovascular disease — <span className="font-semibold text-gray-700">32% of all global deaths</span>
                  </p>
                </div>

                {/* Problem items — 2×2 grid */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {/* Item 1 */}
                  <div className="group rounded-xl p-4 transition-all duration-200 hover:shadow-sm" style={{background:"rgba(201,123,168,0.06)",border:"1px solid rgba(201,123,168,0.13)"}}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{background:"rgba(201,123,168,0.13)"}}>
                      <Clock className="w-4.5 h-4.5 text-[#c97ba8]" style={{width:"1.1rem",height:"1.1rem"}} />
                    </div>
                    <p className="font-bold text-gray-900 mb-1 text-sm" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Silent Progression</p>
                    <p className="text-gray-500 text-xs leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Risk often develops silently over decades</p>
                  </div>

                  {/* Item 2 */}
                  <div className="group rounded-xl p-4 transition-all duration-200 hover:shadow-sm" style={{background:"rgba(201,123,168,0.06)",border:"1px solid rgba(201,123,168,0.13)"}}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{background:"rgba(201,123,168,0.13)"}}>
                      <ScanLine className="text-[#c97ba8]" style={{width:"1.1rem",height:"1.1rem"}} />
                    </div>
                    <p className="font-bold text-gray-900 mb-1 text-sm" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Delayed Detection</p>
                    <p className="text-gray-500 text-xs leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Most care models rely on late detection and episodic intervention</p>
                  </div>

                  {/* Item 3 */}
                  <div className="group rounded-xl p-4 transition-all duration-200 hover:shadow-sm" style={{background:"rgba(201,123,168,0.06)",border:"1px solid rgba(201,123,168,0.13)"}}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{background:"rgba(201,123,168,0.13)"}}>
                      <Ban className="text-[#c97ba8]" style={{width:"1.1rem",height:"1.1rem"}} />
                    </div>
                    <p className="font-bold text-gray-900 mb-1 text-sm" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Limited Insight</p>
                    <p className="text-gray-500 text-xs leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Individuals and clinicians lack tools for early functional insight</p>
                  </div>

                  {/* Item 4 */}
                  <div className="group rounded-xl p-4 transition-all duration-200 hover:shadow-sm" style={{background:"rgba(201,123,168,0.06)",border:"1px solid rgba(201,123,168,0.13)"}}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{background:"rgba(201,123,168,0.13)"}}>
                      <Activity className="text-[#c97ba8]" style={{width:"1.1rem",height:"1.1rem"}} />
                    </div>
                    <p className="font-bold text-gray-900 mb-1 text-sm" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Reactive Care</p>
                    <p className="text-gray-500 text-xs leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Treatment begins only after symptoms appear, missing prevention windows</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: The Jendo Solution ── */}
            <div className="bg-white border border-[#e8dff0] rounded-2xl p-8 flex flex-col space-y-5">
              {/* Label */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#893A9F]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>The Jendo Solution</span>
                </div>
                <div className="w-full h-px bg-[#e8dff0] mt-2" />
              </div>

              {/* Heading + intro */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                  A smarter approach to cardiovascular health monitoring.
                </h2>
                <p className="text-gray-500 text-sm" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                  Jendo enables proactive, continuous care before problems become crises.
                </p>
              </div>

              {/* 2×2 feature grid */}
              <div className="grid grid-cols-2 gap-5 flex-1">
                {/* Item 1 */}
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#f3edf8] flex items-center justify-center mb-2.5">
                    <HeartPulse className="w-5 h-5 text-[#893A9F]" />
                  </div>
                  <p className="font-bold text-gray-900 mb-1 text-base" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Serial, Non-Invasive Monitoring</p>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Ongoing vascular monitoring</p>
                </div>

                {/* Item 2 */}
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#f3edf8] flex items-center justify-center mb-2.5">
                    <Database className="w-5 h-5 text-[#893A9F]" />
                  </div>
                  <p className="font-bold text-gray-900 mb-1 text-base" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Longitudinal Data</p>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Health data organization over time</p>
                </div>

                {/* Item 3 */}
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#f3edf8] flex items-center justify-center mb-2.5">
                    <BookOpen className="w-5 h-5 text-[#893A9F]" />
                  </div>
                  <p className="font-bold text-gray-900 mb-1 text-base" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Evidence-Based Guidance</p>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Clinical guidance and care coordination</p>
                </div>

                {/* Item 4 */}
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#f3edf8] flex items-center justify-center mb-2.5">
                    <Users className="w-5 h-5 text-[#893A9F]" />
                  </div>
                  <p className="font-bold text-gray-900 mb-1 text-base" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Shared Responsibility</p>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Earlier awareness, structured monitoring for long-term heart health</p>
                </div>
              </div>

              {/* Divider + CTA */}
              <div className="w-full h-px bg-[#e8dff0]" />
              <a
                href="#technology"
                className="flex items-center justify-between w-full bg-[#893A9F] hover:bg-[#7a3390] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors duration-200"
                style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}
              >
                <span className="uppercase tracking-wider">Discover the Technology</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Jendo Ecosystem Section */}
      <section id="ecosystem" className="py-20 bg-[#f9f9fb] section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Our Platform</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>The Jendo Ecosystem</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              More than a single test — a connected ecosystem that brings together vascular health data, longitudinal insights, and structured care coordination.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            {/* Card 1: Personal Health Data */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#f3edf8] flex items-center justify-center mb-5">
                <Database className="w-6 h-6 text-[#893A9F]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Personal Cardiovascular Health Data</h3>
              <p className="text-gray-500 text-base leading-relaxed flex-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                A centralized, longitudinal record of lifestyle, clinical history, and cardiovascular-relevant data.
              </p>
            </div>

            {/* Card 2: Evidence-Based Guidance */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#f3edf8] flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6 text-[#893A9F]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Evidence-Based Health Guidance</h3>
              <p className="text-gray-500 text-base leading-relaxed flex-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                Trusted educational content and decision-support tools designed to complement clinical care.
              </p>
            </div>

            {/* Card 3: Care Coordination */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#f3edf8] flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-[#893A9F]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Care Coordination</h3>
              <p className="text-gray-500 text-base leading-relaxed flex-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                Structured engagement with clinicians, enabling better-prepared consultations and shared decision-making.
              </p>
            </div>

            {/* Card 4: Serial Monitoring */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#f3edf8] flex items-center justify-center mb-5">
                <Activity className="w-6 h-6 text-[#893A9F]" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Serial Vascular Monitoring</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                Ongoing assessment of vascular reactivity to track change over time and support early evaluation.
              </p>
            </div>

          </div>

          {/* Bottom callout */}
          <div className="bg-white border border-[#ede8f5] rounded-2xl px-8 py-6 shadow-sm text-center">
            <p className="text-base font-semibold text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              A unified platform that connects data, insight, and care coordination to support a more proactive and continuous approach to cardiovascular health.
            </p>
          </div>

        </div>
      </section>

      {/* Technology Section - Vascular Health Test */}
      <section id="technology" className="py-20 relative overflow-hidden section-scroll" style={{background:"linear-gradient(135deg,#2d0a3e 0%,#4a1260 40%,#893A9F 100%)"}}>
        {/* Subtle radial glow accents */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20" style={{background:"radial-gradient(circle,#c77dff 0%,transparent 70%)",transform:"translate(-30%,-30%)"}} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-15" style={{background:"radial-gradient(circle,#e0aaff 0%,transparent 70%)",transform:"translate(30%,30%)"}} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-white/40" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Clinical Technology</span>
              <div className="h-px w-8 bg-white/40" />
            </div>
            <h2 className="text-5xl font-bold text-white mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>The Jendo Vascular Health Test</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              Clear, objective insight into vascular function using a safe, non-invasive approach.
            </p>
          </div>

          {/* Two feature cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">

            {/* Card: What Is It */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:bg-white/15 transition-colors duration-300 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>What Is It?</h3>
              </div>
              <p className="text-white/80 text-base leading-relaxed mb-6" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                The Jendo Vascular Health Test is a <span className="font-semibold text-white">non-invasive vascular reactivity assessment</span> that evaluates how blood vessels respond to a brief, controlled physiological stimulus.
              </p>
              <div className="space-y-3 mt-auto">
                {[
                  { label: "Non-invasive", desc: "No needles, injections, or contrast agents" },
                  { label: "Cost-effective", desc: "No reagents or consumables needed" },
                  { label: "Clinician-guided", desc: "Supports, not replaces, clinical judgment" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-base text-white/75" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}><span className="font-semibold text-white">{item.label}:</span> {item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card: Why It Matters */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:bg-white/15 transition-colors duration-300 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Why Vascular Reactivity Matters</h3>
              </div>
              <p className="text-white/80 text-base leading-relaxed mb-6" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                Long before structural disease becomes apparent, <span className="font-semibold text-white">functional changes in vascular behavior</span> may occur.
              </p>
              <div className="space-y-3 mt-auto">
                {[
                  { icon: TrendingUp, text: "Ability of blood vessels to respond to changes in blood flow" },
                  { icon: Target, text: "Early alterations that precede overt cardiovascular disease" },
                  { icon: Eye, text: "Physiological dimension not captured by traditional risk factors" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-base text-white/75" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* How the Test Works — horizontal numbered steps */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>How the Test Works</h3>
              <p className="text-white/60 mt-2 text-lg" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>A simple, 5-step protocol — completed in under 15 minutes</p>
            </div>

            {/* Steps */}
            <div className="relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-white/20" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { step: 1, title: "Sensor Placement", icon: Fingerprint, desc: "Optical and thermal sensors placed on fingertips" },
                  { step: 2, title: "Baseline", icon: LineChart, desc: "Recording resting signals under controlled conditions" },
                  { step: 3, title: "Cuff Occlusion", icon: Activity, desc: "Standard arm cuff inflated briefly to alter blood flow" },
                  { step: 4, title: "Recovery", icon: TrendingUp, desc: "Recording vascular responses as flow normalizes" },
                  { step: 5, title: "Assessment", icon: BarChart2, desc: "Deriving quantitative vascular reactivity indices" },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center text-center">
                    {/* Circle with step number */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-white/15 border-2 border-white/50 flex flex-col items-center justify-center mb-4 shadow-md">
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider leading-none" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Step</span>
                      <span className="text-xl font-black text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.step}</span>
                    </div>
                    <item.icon className="w-5 h-5 text-white/70 mb-2" />
                    <p className="font-bold text-white text-base mb-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.title}</p>
                    <p className="text-sm text-white/60 leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer bar */}
          <div className="flex items-start gap-3 bg-white/10 border border-white/20 rounded-xl px-6 py-4">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-3 h-3 text-white" />
            </div>
            <p className="text-base text-white/70" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              <span className="font-semibold text-white">Clinical Note:</span> The test does not provide a diagnosis. Results are intended to be interpreted in the context of the patient's overall clinical picture by a qualified healthcare professional.
            </p>
          </div>

        </div>
      </section>

      {/* For Clinicians Section */}
      <section id="for-clinicians" className="py-20 bg-[#f9f9fb] section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>For Healthcare Professionals</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Empowering Clinicians with Actionable Insights</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              Earlier insight, structured patient categorization, and long-term cardiovascular risk management
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            {/* Card 1: Earlier Insight */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#f3edf8] flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-[#893A9F]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Earlier Insight</h3>
              <p className="text-gray-500 text-base mb-5 leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Identify functional vascular changes before symptoms emerge or structural disease becomes apparent.</p>
              <div className="space-y-3 mt-auto">
                {[
                  "Objective assessment of vascular reactivity",
                  "Evaluation in asymptomatic individuals",
                  "Observation of silent physiological patterns",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f3edf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#893A9F]" />
                    </div>
                    <p className="text-base text-gray-600 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Patient Categorization */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#f3edf8] flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6 text-[#893A9F]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Patient Categorization</h3>
              <p className="text-gray-500 text-base mb-5 leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Structured data to support meaningful patient grouping and personalized follow-up planning.</p>
              <div className="space-y-3 mt-auto">
                {[
                  "Group by functional response patterns",
                  "Distinguish stable vs. changing profiles",
                  "Personalized follow-up intervals",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f3edf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#893A9F]" />
                    </div>
                    <p className="text-base text-gray-600 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Workflow Integration */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#f3edf8] flex items-center justify-center mb-5">
                <ClipboardCheck className="w-6 h-6 text-[#893A9F]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Workflow Integration</h3>
              <p className="text-gray-500 text-base mb-5 leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Designed to fit naturally within outpatient clinical workflows without disrupting existing processes.</p>
              <div className="space-y-3 mt-auto">
                {[
                  "Outpatient-friendly assessments",
                  "Digital reports during consultations",
                  "Longitudinal data organization",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f3edf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#893A9F]" />
                    </div>
                    <p className="text-base text-gray-600 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom CTA */}
          <div className="rounded-2xl px-8 py-8 text-center flex flex-col items-center" style={{background:"linear-gradient(135deg,#2d0a3e 0%,#4a1260 50%,#893A9F 100%)"}}>
            <h3 className="text-2xl font-bold text-white mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Ready to Partner with Jendo?</h3>
            <p className="text-white/70 text-lg mb-6 max-w-xl" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Join healthcare professionals transforming cardiovascular care with objective vascular insights.</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-md"
              style={{color:"#893A9F", fontFamily:"var(--font-red-hat-display),sans-serif"}}
            >
              <ArrowRight className="w-4 h-4" />
              Request a Demo
            </a>
          </div>

        </div>
      </section>

      {/* For Individuals Section */}
      <section id="for-individuals" className="py-20 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>For Individuals &amp; Families</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Take an Active Role in Your Heart Health</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              Understanding your cardiovascular health doesn&apos;t have to be complicated
            </p>
          </div>

          {/* Two feature cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Card: Why It Matters Early */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#f3edf8] flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-[#893A9F]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Why It Matters Early</h3>
              </div>
              <p className="text-gray-500 text-base leading-relaxed mb-6" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                Your heart and blood vessels work quietly every day. Changes often develop gradually without obvious symptoms.
              </p>
              <div className="space-y-4 mt-auto">
                {[
                  { icon: Zap, title: "Build Healthier Habits", desc: "Before issues arise" },
                  { icon: TrendingUp, title: "Understand Impact", desc: "How lifestyle choices affect your body" },
                  { icon: UserCheck, title: "Take a Proactive Role", desc: "In your long-term wellbeing" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f3edf8] flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-[#893A9F]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.title}</p>
                      <p className="text-gray-500 text-sm" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card: How Jendo Supports You */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#f3edf8] flex items-center justify-center flex-shrink-0">
                  <HandHeart className="w-6 h-6 text-[#893A9F]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>How Jendo Supports You</h3>
              </div>
              <p className="text-gray-500 text-base leading-relaxed mb-6" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                Clear information and trends rather than isolated numbers — so you can have more meaningful conversations with your care team.
              </p>
              <div className="space-y-3 mt-auto">
                {[
                  "View vascular health measurements in one place",
                  "Track changes over time vs. one-off readings",
                  "See how lifestyle relates to your health journey",
                  "Come to visits better prepared and informed",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f3edf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#893A9F]" />
                    </div>
                    <p className="text-base text-gray-600 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Privacy bar */}
          <div className="rounded-2xl px-8 py-7 mb-8" style={{background:"linear-gradient(135deg,#5a1a7a 0%,#7a2a9a 50%,#a855c8 100%)"}}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Your Privacy &amp; Data Protection</h3>
            </div>
            <p className="text-white/70 text-base mb-6 max-w-2xl" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              Your health information is personal — and Jendo treats it that way.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, title: "Secure Storage", desc: "Industry-standard data protections" },
                { icon: UserCheck, title: "You Control", desc: "How your information is used & shared" },
                { icon: Eye, title: "Transparency", desc: "Clear and accessible privacy practices" },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.title}</p>
                    <p className="text-white/65 text-sm" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-md"
              style={{backgroundColor:"#893A9F", fontFamily:"var(--font-red-hat-display),sans-serif"}}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7a3390')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#893A9F')}
            >
              <ArrowRight className="w-4 h-4" />
              Get Started with Jendo
            </a>
          </div>

        </div>
      </section>


      {/* Product Showcase Section */}
      <section className="py-20 bg-[#f9f9fb] overflow-hidden section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left: Product Image */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="h-px w-8 bg-[#893A9F]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>The Device</span>
                <div className="h-px w-8 bg-[#893A9F]" />
              </div>
              <div className="bg-white border border-[#ede8f5] rounded-2xl p-5 shadow-sm">
                <Image
                  src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg"
                  alt="JENDO Device"
                  width={800}
                  height={600}
                  className="rounded-xl w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { value: "15 min", label: "Quick Results" },
                  { value: "87%+", label: "Sensitivity" },
                  { value: "Non-Invasive", label: "Painless Process" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-[#ede8f5] rounded-xl px-4 py-3 text-center shadow-sm">
                    <p className="font-black text-lg leading-tight" style={{color:"#893A9F", fontFamily:"var(--font-red-hat-display),sans-serif"}}>{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Description */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 mb-5">
                <div className="h-px w-8 bg-[#893A9F]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Our Technology</span>
                <div className="h-px w-8 bg-[#893A9F]" />
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                JENDO: The Future of Cardiovascular Health
              </h2>
              <div className="space-y-4 mb-8">
                <p className="text-gray-500 text-base leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                  Jendo is an advanced, AI-powered vascular health monitoring system designed to detect endothelial dysfunction — the earliest indicator of cardiovascular diseases. Using non-invasive technology, Jendo provides real-time analysis of vascular function in just 15 minutes, enabling early intervention and preventive care.
                </p>
                <p className="text-gray-500 text-base leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                  Integrated with AI and cloud computing, it ensures accuracy, consistency, and efficiency. Ideal for hospitals, clinics, and health-conscious individuals — Jendo empowers proactive healthcare, reduces treatment costs, and enhances patient outcomes.
                </p>
              </div>
              <div className="space-y-3 mb-8">
                {[
                  { icon: Microscope, text: "Detects endothelial dysfunction before symptoms appear" },
                  { icon: HeartPulse, text: "Non-invasive, operator-independent vascular assessment" },
                  { icon: BarChart2, text: "AI-driven analysis with quantitative reactivity indices" },
                  { icon: ShieldCheck, text: "Designed for primary care, clinics, and prevention programs" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#f3edf8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-[#893A9F]" />
                    </div>
                    <p className="text-gray-600 text-base leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#technology"
                  className="inline-flex items-center gap-2 text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-md"
                  style={{backgroundColor:"#893A9F", fontFamily:"var(--font-red-hat-display),sans-serif"}}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7a3390')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#893A9F')}
                >
                  <ArrowRight className="w-4 h-4" />
                  Explore the Technology
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-white border border-[#ede8f5] text-gray-700 font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                  style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}
                >
                  Request a Demo
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Jendo Patents Section */}
      <section id="jendo-patents" className="py-20 section-scroll" style={{background:"linear-gradient(135deg,#f3edf8 0%,#ede8f5 40%,#f9f5fc 100%)"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Intellectual Property</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              Jendo Patents: A Legacy of Global Innovation
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              Worldwide recognition in non-invasive vascular health diagnostics
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Patent image */}
            <div>
              <div className="bg-white border border-[#ede8f5] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <img
                  src="https://i.ibb.co/g85CZcp/unnamed-1.png"
                  alt="Jendo Patent Certificate"
                  className="w-full rounded-xl object-contain"
                  style={{maxHeight: 340}}
                />
              </div>
              <div className="mt-4 text-center">
                <a
                  href="/blog/jendo-patents"
                  className="inline-flex items-center gap-2 text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-md"
                  style={{backgroundColor:"#893A9F", fontFamily:"var(--font-red-hat-display),sans-serif"}}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7a3390')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#893A9F')}
                >
                  <ArrowRight className="w-4 h-4" />
                  View Patent Details
                </a>
              </div>
            </div>

            {/* Right: Description + stats */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-base text-gray-600 leading-relaxed mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                  At Jendo, our pursuit of excellence in cardiovascular innovation has earned us prestigious patents across the globe. From the United States to Japan and Sri Lanka, our patented technology is transforming preventive vascular care.
                </p>
                <p className="text-base text-gray-600 leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                  These recognitions are a testament to our vision, precision, and global impact in redefining how vascular health is monitored and managed.
                </p>
              </div>

              {/* Patent jurisdiction cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { country: "United States", detail: "USPTO Granted Patent" },
                  { country: "Japan", detail: "JPO Granted Patent" },
                  { country: "Sri Lanka", detail: "NIPO Granted Patent" },
                ].map((item) => (
                  <div key={item.country} className="bg-white border border-[#ede8f5] rounded-xl p-4 shadow-sm text-center">
                    <p className="font-bold text-gray-900 text-base mb-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.country}</p>
                    <p className="text-xs text-gray-500" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.detail}</p>
                  </div>
                ))}
              </div>

              {/* Feature bullets */}
              <div className="space-y-3">
                {[
                  { icon: ShieldCheck, text: "Clinically validated non-invasive vascular reactivity assessment" },
                  { icon: Globe, text: "Protected intellectual property across multiple jurisdictions" },
                  { icon: Award, text: "Recognized for original contribution to preventive cardiology" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#ede8f5] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <item.icon className="w-4 h-4 text-[#893A9F]" />
                    </div>
                    <p className="text-base text-gray-600 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Clinical Demonstration</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Experience JENDO in Action</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              Watch how our technology is transforming cardiovascular health monitoring.
            </p>
          </div>

          <div ref={videoSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video 1 */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300" data-video-container="1">
              <div className="relative aspect-video bg-black">
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor:"#893A9F"}}>
                    {isVideoPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-[#f3edf8] flex items-center justify-center flex-shrink-0">
                    <HeartPulse className="w-4 h-4 text-[#893A9F]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Real-Time Monitoring</h3>
                </div>
                <p className="text-base text-gray-500 ml-11" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>See how JENDO captures cardiovascular data in real-time</p>
              </div>
            </div>

            {/* Video 2 */}
            <div className="bg-white border border-[#ede8f5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300" data-video-container="2">
              <div className="relative aspect-video bg-black">
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{backgroundColor:"#893A9F"}}>
                    {isVideoPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-[#f3edf8] flex items-center justify-center flex-shrink-0">
                    <Microscope className="w-4 h-4 text-[#893A9F]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Clinical Device Setup</h3>
                </div>
                <p className="text-base text-gray-500 ml-11" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Professional-grade equipment for accurate vascular assessments</p>
              </div>
            </div>
          </div>

          {/* Bottom callout */}
          <div className="mt-8 bg-[#f9f9fb] border border-[#ede8f5] rounded-2xl px-8 py-5 text-center">
            <p className="text-base font-semibold text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              JENDO&apos;s non-invasive technology provides accurate cardiovascular health assessments in just 15 minutes — enabling early detection and preventive care at scale.
            </p>
          </div>

        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Products</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Jendo Products Available Now</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Clinical-grade vascular health monitoring for every setting</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Standard Package */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col" style={{border:"1px solid #e8dff0"}}>
              {/* Card Header — dark purple + image overlay */}
              <div className="relative overflow-hidden" style={{background:"linear-gradient(135deg,#2d0a3e 0%,#4a1260 55%,#6b1a8a 100%)"}}>
                <div className="absolute inset-0">
                  <Image
                    src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-[0.25] scale-110"
                  />
                </div>
                <div className="relative z-10 p-8 pb-9">
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{color:"#d4a8e8", fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                      <Stethoscope className="w-3.5 h-3.5" />
                      For Clinics
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{background:"rgba(255,255,255,0.15)", color:"#fff", fontFamily:"var(--font-red-hat-display),sans-serif", border:"1px solid rgba(255,255,255,0.25)"}}>Most Popular</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Standard Package</h3>
                  <div className="flex items-baseline gap-1.5">
                    {/* <span className="text-5xl font-black text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>$2,400</span>
                    <span className="text-base font-medium" style={{color:"#d4a8e8", fontFamily:"var(--font-red-hat-display),sans-serif"}}>/year</span> */}
                  </div>
                </div>
                {/* Bottom wave divider */}
                <div className="relative h-6 overflow-hidden" style={{marginTop:"-2px"}}>
                  <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{fill:"#fff"}}>
                    <path d="M0,24 C100,0 300,0 400,24 L400,24 L0,24 Z" />
                  </svg>
                </div>
              </div>
              {/* Card Body */}
              <div className="bg-white px-8 pt-5 pb-8 flex flex-col flex-1">
                <div className="space-y-3.5 mb-8 flex-1">
                  {[
                    {label:"JENDO Pro Device", icon:Package},
                    {label:"1 Year Software License", icon:FileText},
                    {label:"Priority Support", icon:HeartPulse},
                    {label:"Advanced Analytics", icon:BarChart2},
                  ].map(({label, icon: Icon}) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                        <Icon className="w-3.5 h-3.5" style={{color:"#893A9F"}} />
                      </div>
                      <span className="text-sm font-medium text-gray-700" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{label}</span>
                    </div>
                  ))}
                </div>
{/* Add to Cart button - hidden
                <button
                  onClick={() => addToCart({
                    id: 'pro-package',
                    name: 'JENDO Pro Device',
                    price: 2400,
                    image_url: 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg',
                    description: 'Professional vascular monitoring system for clinics'
                  })}
                  className="w-full text-white font-bold text-sm px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{background:"linear-gradient(135deg,#893A9F,#6b1a8a)", fontFamily:"var(--font-red-hat-display),sans-serif"}}
                  onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg,#7a3390,#5a1478)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg,#893A9F,#6b1a8a)')}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                */}
              </div>
            </div>

            {/* Enterprise Package */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col" style={{border:"1px solid #e8dff0"}}>
              {/* Card Header — deep charcoal-purple + image overlay */}
              <div className="relative overflow-hidden" style={{background:"linear-gradient(135deg,#0f0a1a 0%,#1e0a2e 55%,#2d0a3e 100%)"}}>
                <div className="absolute inset-0">
                  <Image
                    src="https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-[0.20] scale-110"
                  />
                </div>
                <div className="relative z-10 p-8 pb-9">
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{color:"#b8a8cc", fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                      <Building className="w-3.5 h-3.5" />
                      For Hospitals &amp; Networks
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{background:"rgba(137,58,159,0.3)", color:"#d4a8e8", fontFamily:"var(--font-red-hat-display),sans-serif", border:"1px solid rgba(137,58,159,0.5)"}}>Enterprise</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Enterprise Package</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-black text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Custom</span>
                    <span className="text-base font-medium" style={{color:"#b8a8cc", fontFamily:"var(--font-red-hat-display),sans-serif"}}>pricing</span>
                  </div>
                </div>
                {/* Bottom wave divider */}
                <div className="relative h-6 overflow-hidden" style={{marginTop:"-2px"}}>
                  <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{fill:"#fff"}}>
                    <path d="M0,24 C100,0 300,0 400,24 L400,24 L0,24 Z" />
                  </svg>
                </div>
              </div>
              {/* Card Body */}
              <div className="bg-white px-8 pt-5 pb-8 flex flex-col flex-1">
                <div className="space-y-3.5 mb-8 flex-1">
                  {[
                    {label:"Multiple JENDO Devices", icon:Package},
                    {label:"Enterprise Software License", icon:FileText},
                    {label:"24/7 Premium Support", icon:HeartPulse},
                    {label:"Custom Integration", icon:Cpu},
                  ].map(({label, icon: Icon}) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                        <Icon className="w-3.5 h-3.5" style={{color:"#893A9F"}} />
                      </div>
                      <span className="text-sm font-medium text-gray-700" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{label}</span>
                    </div>
                  ))}
                </div>
{/* Contact Sales button - hidden
                <button
                  onClick={() => addToCart({
                    id: 'enterprise-package',
                    name: 'JENDO Enterprise Package',
                    price: 4999,
                    image_url: 'https://i.ibb.co/Jz3yM3F/jendo-medical-device-845.jpg',
                    description: 'Enterprise-level monitoring solution for hospitals'
                  })}
                  className="w-full font-bold text-sm px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
                  style={{background:"#fff", color:"#2d0a3e", border:"2px solid #2d0a3e", fontFamily:"var(--font-red-hat-display),sans-serif"}}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2d0a3e'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2d0a3e'; }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Contact Sales
                </button>
                */}
              </div>
            </div>

          </div>

          {/* Bottom note */}
          <p className="text-center text-sm text-gray-400 mt-8" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
            All packages include setup support &amp; onboarding. Contact us for volume discounts.
          </p>

        </div>
      </section>


      {/* Step-by-Step Section */}
      <section className="py-20 bg-[#f9f9fb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>How It Works</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Step-by-Step JENDO Test Procedure</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>A complete walkthrough of the non-invasive vascular assessment process</p>
          </div>

          {(() => {
            const steps = [
              {
                title: "Patient Preparation",
                bullets: [
                  "Patient lies in a supine (flat) position",
                  "Calm environment to reduce external influences"
                ],
                icon: BedDouble,
                image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=400&h=300&q=80",
              },
              {
                title: "Signal Extraction",
                bullets: [
                  "Pressure cuff wrapped around patient's arm",
                  "Cuff inflated 30 mmHg above systolic for 5 min"
                ],
                icon: Waves,
                image: "https://images.unsplash.com/photo-1516069677018-378515003435?auto=format&fit=crop&w=400&h=300&q=80",
              },
              {
                title: "Data Collection",
                bullets: [
                  "PPG: Captures pulse signals from vascular system",
                  "DTM: Measures temperature variations in blood flow",
                  "ECG: Records electrical activity of the heart"
                ],
                icon: LineChart,
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&h=300&q=80",
              },
              {
                title: "Cloud-Based Analysis",
                bullets: [
                  "Data securely uploaded to JENDO's cloud platform",
                  "AI algorithms evaluate vascular condition",
                  "Encrypted handling of patient data"
                ],
                icon: Cloud,
                image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=400&h=300&q=80",
              },
              {
                title: "Report Generation",
                bullets: [
                  "Detailed Vascular Health Report generated",
                  "Highlights current conditions and risk factors"
                ],
                icon: FileText,
                image: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=400&h=300&q=80",
              },
              {
                title: "Consultation",
                bullets: [
                  "Report reviewed with a physician",
                  "Preventive measures or treatment recommendations"
                ],
                icon: Stethoscope,
                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&h=300&q=80",
              },
            ];

            const StepRow = ({ items, startIndex }: { items: typeof steps; startIndex: number }) => (
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Horizontal connector line — desktop only */}
                <div className="hidden md:block absolute top-6 h-0.5 z-0" style={{left:"calc(16.66% + 24px)", right:"calc(16.66% + 24px)", background:"linear-gradient(90deg,#e8dff0,#893A9F,#e8dff0)"}} />
                {items.map((step, i) => {
                  const Icon = step.icon;
                  const num = startIndex + i + 1;
                  return (
                    <div key={num} className="flex flex-col items-center text-center">
                      {/* Circle number */}
                      <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-black shadow-md mb-5 flex-shrink-0" style={{background:"linear-gradient(135deg,#893A9F,#4a1260)", fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                        {num < 10 ? `0${num}` : num}
                      </div>
                      {/* Card */}
                      <div className="bg-white border border-[#ede8f5] rounded-2xl p-5 w-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-left flex-1">
                        {/* optional image */}
                        {step.image && (
                          <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                            <img
                              src={step.image}
                              alt={step.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              crossOrigin="anonymous"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                        )}
                        <div className="w-10 h-10 rounded-xl bg-[#f3edf8] flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5" style={{color:"#893A9F"}} />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 mb-2.5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{step.title}</h4>
                        <ul className="space-y-1.5">
                          {step.bullets.map((b, bi) => (
                            <li key={bi} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{background:"#893A9F"}} />
                              <span className="text-sm text-gray-500 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            );

            return (
              <>
                <StepRow items={steps.slice(0, 3)} startIndex={0} />
                <StepRow items={steps.slice(3, 6)} startIndex={3} />
              </>
            );
          })()}

        </div>
      </section>

      {/* Jendo Gallery Section */}
      <section id="emma-gallery" className="py-24 bg-[#f9f9fb] section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Our Journey</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Jendo Gallery</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              Memorable moments and milestones from Jendo&apos;s journey in transforming cardiovascular health.
            </p>
          </div>

          {(() => {
            const galleryImages = [
              { src: "https://i.ibb.co/9mDYzKp8/Whats-App-Image-2026-03-03-at-08-31-17.jpg", alt: "Jendo Health Camp Event" },
              { src: "https://i.ibb.co/hJ5kqKCX/Whats-App-Image-2026-03-03-at-08-31-17-1.jpg", alt: "Cardiovascular Screening Session" },
              { src: "https://i.ibb.co/3mN1mtqj/Whats-App-Image-2026-03-03-at-08-31-18.jpg", alt: "Medical Professionals Collaboration" },
              { src: "https://i.ibb.co/HfXt87DS/Whats-App-Image-2026-03-03-at-08-31-18-1.jpg", alt: "Community Health Initiative" },
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
              { src: "https://i.ibb.co/rf0RzYvm/Whats-App-Image-2025-07-14-at-14-22-26-621a4f6a.jpg", alt: "Team Achievement Moment" },
            ];

            const GalleryCard = ({ image, index }: { image: typeof galleryImages[0]; index: number }) => (
              <div
                className="relative group overflow-hidden rounded-2xl cursor-pointer border border-[#ede8f5] shadow-sm hover:shadow-xl transition-all duration-300 break-inside-avoid mb-4"
                onClick={() => { setLightboxImage(image); setLightboxOpen(true); }}
              >
                <img src={image.src} alt={image.alt} className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d0a3e]/75 via-[#2d0a3e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-semibold" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{image.alt}</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
            );

            return (
              <div>
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                  {galleryImages.map((img, i) => (
                    <GalleryCard key={i} image={img} index={i + 1} />
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#ede8f5] rounded-2xl px-8 py-5 mt-4">
                  <div>
                    <p className="text-base font-bold text-gray-900" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Showing {galleryImages.length} moments</p>
                    <p className="text-sm text-gray-400" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Click any image to view full screen</p>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#893A9F]" />
                    <span className="text-sm font-semibold text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>JENDO Health Milestones</span>
                    <div className="w-2 h-2 rounded-full bg-[#893A9F]" />
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
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

      {/* CVD Impact Section */}
      <section id="stats" className="relative py-24 overflow-hidden section-scroll" style={{background:"linear-gradient(135deg,#2d0a3e 0%,#4a1260 45%,#893A9F 100%)"}}>
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 20% 50%, #c77dff 0%, transparent 60%), radial-gradient(circle at 80% 20%, #e0aaff 0%, transparent 50%)"}} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)"}} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)"}} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-white/40" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Global Health Crisis</span>
              <div className="h-px w-8 bg-white/40" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Cardiovascular Disease Impact</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              War is not the number one killer in the world — cardiovascular diseases are. The data demands action.
            </p>
          </div>

          {/* Stat cards row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { value: "17.7M+", label: "Deaths per year from CVD globally", icon: HeartPulse },
              { value: "50%", label: "Of CVD deaths preventable with early diagnosis", icon: ShieldCheck },
              { value: "80%", label: "Of premature heart disease is preventable", icon: Target },
              { value: "#1", label: "Leading cause of death worldwide", icon: Activity },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="group relative rounded-2xl p-7 flex flex-col items-start gap-4 transition-all duration-300 hover:-translate-y-1" style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", backdropFilter:"blur(8px)"}}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(255,255,255,0.12)"}}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white mb-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{stat.value}</div>
                    <p className="text-sm text-white/60 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{stat.label}</p>
                  </div>
                  <div className="absolute bottom-0 left-6 right-6 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)"}} />
                </div>
              );
            })}
          </div>

          {/* Full-width impact banner */}
          <div className="rounded-2xl px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)"}}>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(255,255,255,0.12)"}}>
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Every 2 seconds, someone dies from a cardiovascular disease.</p>
                <p className="text-sm text-white/60 mt-0.5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Source: World Health Organization (WHO) — Global Health Estimates</p>
              </div>
            </div>
            <div className="h-px md:h-12 w-full md:w-px" style={{background:"rgba(255,255,255,0.15)"}} />
            <div className="text-center md:text-right flex-shrink-0">
              <p className="text-3xl font-black text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>31%</p>
              <p className="text-sm text-white/60" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>of all global deaths</p>
            </div>
          </div>

        </div>
      </section>

      {/* Value Proposition Section */}
      <section id="benefits" className="py-24 bg-white section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Why Jendo</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Value Proposition of Jendo</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Empowering every stakeholder in the healthcare ecosystem through innovation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                label: "For Patients",
                tagline: "Your heart health, personalised.",
                points: [
                  "Early detection of cardiovascular diseases",
                  "Personalized vascular health reports",
                  "Non-invasive, pain-free assessment",
                  "Proactive, preventive healthcare solutions",
                ],
                cta: "Check Your Vascular Health",
              },
              {
                icon: Flask,
                label: "For Labs & Clinics",
                tagline: "Expand your diagnostic capabilities.",
                points: [
                  "Expand your service portfolio instantly",
                  "Cutting-edge AI-powered monitoring",
                  "Non-invasive testing — no blood required",
                  "Seamless integration with existing workflows",
                ],
                cta: "Become a Lab Partner",
                featured: true,
              },
              {
                icon: Shield,
                label: "For Insurance Partners",
                tagline: "Smarter underwriting, fewer claims.",
                points: [
                  "Enhanced, data-driven risk assessment",
                  "Reduced cardiovascular claim exposure",
                  "Objective, clinical-grade biomarker data",
                  "Improved policyholder engagement",
                ],
                cta: "Partner With Us",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                  card.featured
                    ? "text-white shadow-xl"
                    : "bg-white border border-[#ede8f5] shadow-sm hover:shadow-md"
                }`} style={card.featured ? {background:"linear-gradient(135deg,#2d0a3e 0%,#4a1260 45%,#893A9F 100%)"} : {}}>
                  {card.featured && (
                    <div className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Most Popular</div>
                  )}
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                    card.featured ? "bg-white/15" : "bg-[#f3edf8]"
                  }`}>
                    <Icon className={`w-6 h-6 ${card.featured ? "text-white" : ""}`} style={!card.featured ? {color:"#893A9F"} : {}} />
                  </div>
                  {/* Label */}
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${card.featured ? "text-white/60" : "text-[#893A9F]"}` } style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{card.label}</p>
                  <h3 className={`text-xl font-bold mb-1 ${card.featured ? "text-white" : "text-gray-900"}`} style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{card.label}</h3>
                  <p className={`text-sm mb-6 ${card.featured ? "text-white/60" : "text-gray-400"}`} style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{card.tagline}</p>
                  {/* Divider */}
                  <div className={`h-px mb-6 ${card.featured ? "bg-white/15" : "bg-[#ede8f5]"}`} />
                  {/* Points */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {card.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${card.featured ? "bg-white/20" : "bg-[#f3edf8]"}`}>
                          <CheckCircle className={`w-3 h-3 ${card.featured ? "text-white" : ""}`} style={!card.featured ? {color:"#893A9F"} : {}} />
                        </div>
                        <span className={`text-sm leading-snug ${card.featured ? "text-white/80" : "text-gray-500"}`} style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  {/* CTA */}
                  <button
                    onClick={handlePreOrderClick}
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                      card.featured
                        ? "bg-white text-[#4a1260] hover:bg-white/90"
                        : "border border-[#893A9F] text-[#893A9F] hover:bg-[#893A9F] hover:text-white"
                    }`}
                    style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}
                  >
                    {card.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-[#f9f9fb] section-scroll">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>People</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Our Team</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Meet the world-class experts, advisors and builders behind JENDO</p>
          </div>

          {(() => {
            const MemberCard = ({ member, showCredentials = false }: { member: any; showCredentials?: boolean }) => (
              <div className="group bg-white border border-[#ede8f5] rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                {/* Avatar */}
                <div className="relative w-24 h-24 mb-4 flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#ede8f5] group-hover:border-[#893A9F] transition-colors duration-300">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} width={96} height={96} className="object-cover w-full h-full" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white" style={{background:"linear-gradient(135deg,#893A9F,#4a1260)"}} />
                </div>
                {/* Info */}
                <h3 className="text-base font-bold text-gray-900 mb-0.5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{member.name}</h3>
                <p className="text-sm font-semibold mb-0.5" style={{color:"#893A9F", fontFamily:"var(--font-red-hat-display),sans-serif"}}>{member.role}</p>
                {showCredentials && member.credentials && (
                  <p className="text-xs text-gray-500 mb-0.5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{member.credentials}</p>
                )}
                {showCredentials && member.additionalRole && (
                  <p className="text-xs text-gray-400 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{member.additionalRole}</p>
                )}
                {/* Social */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-[#ede8f5] w-full">
                  {member.social?.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-[#f3edf8] flex items-center justify-center hover:bg-[#893A9F] transition-colors group/icon">
                      <Linkedin className="h-3.5 w-3.5 text-[#893A9F] group-hover/icon:text-white transition-colors" />
                    </a>
                  )}
                  {member.social?.twitter && (
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-[#f3edf8] flex items-center justify-center hover:bg-[#893A9F] transition-colors group/icon">
                      <Twitter className="h-3.5 w-3.5 text-[#893A9F] group-hover/icon:text-white transition-colors" />
                    </a>
                  )}
                  {member.social?.facebook && (
                    <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-[#f3edf8] flex items-center justify-center hover:bg-[#893A9F] transition-colors group/icon">
                      <Facebook className="h-3.5 w-3.5 text-[#893A9F] group-hover/icon:text-white transition-colors" />
                    </a>
                  )}
                  {member.social?.instagram && (
                    <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-[#f3edf8] flex items-center justify-center hover:bg-[#893A9F] transition-colors group/icon">
                      <Instagram className="h-3.5 w-3.5 text-[#893A9F] group-hover/icon:text-white transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            );

            const SubHeader = ({ label }: { label: string }) => (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-[#ede8f5]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-[#ede8f5] text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{label}</span>
                <div className="flex-1 h-px bg-[#ede8f5]" />
              </div>
            );

            return (
              <div className="space-y-16">
                {/* Senior Advisors */}
                <div>
                  <SubHeader label="Senior Advisors" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {seniorAdvisors.map((member, index) => (
                      <MemberCard key={index} member={member} showCredentials />
                    ))}
                  </div>
                </div>

                {/* Board Members */}
                <div>
                  <SubHeader label="Board Members" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {boardMembers.map((member, index) => (
                      <MemberCard key={index} member={member} />
                    ))}
                  </div>
                </div>

                {/* Development Team */}
                <div>
                  <SubHeader label="Jendo Development Team" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {developmentTeam.map((member, index) => (
                      <MemberCard key={index} member={member} showCredentials />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* Recognition & Awards Section */}
      <section id="recognition" className="py-24 overflow-hidden section-scroll" style={{background:"linear-gradient(135deg,#2d0a3e 0%,#4a1260 45%,#893A9F 100%)"}}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)"}} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)"}} />

        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-white/40" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>International Recognition</span>
              <div className="h-px w-8 bg-white/40" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Global Innovation &amp; Clinical Excellence</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              Recognized worldwide for advancing cardiovascular prevention through responsible AI and clinical innovation.
            </p>
          </div>
        </div>

        {/* Horizontal scroll timeline */}
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10" style={{background:"linear-gradient(90deg,#2d0a3e,transparent)"}} />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10" style={{background:"linear-gradient(270deg,#2d0a3e,transparent)"}} />

          <div className="overflow-x-auto pb-6 hide-scrollbar" style={{scrollbarWidth:"none"}}>
            <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>

            {/* Connector line */}
            <div className="relative px-16" style={{minWidth:"max-content"}}>
              <div className="absolute top-[52px] left-0 right-0 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.2),rgba(255,255,255,0.2),transparent)"}} />

              <div className="flex gap-5 items-start">
                {[
                  { year: "2025", title: "Presidential Gold Award", org: "Government of Sri Lanka", icon: Award },
                  { year: "2025", title: "ICT Leader of the Year", org: "CSSL", icon: Award },
                  { year: "2025", title: "Global Initiative on AI for Health", org: "ITU / WHO / WIPO — Panelist & Contributor", icon: Globe },
                  { year: "2023", title: "WIPO Global Innovation Awards", org: "Nominee", icon: Award },
                  { year: "2022", title: "CEO of the Year — AI Category", org: "National ICT Awards", icon: Award },
                  { year: "2021", title: "Patents Granted", org: "United States & Japan", icon: FileText },
                  { year: "2021", title: "IEEE Research Publication", org: "Biomedical Engineering World Congress", icon: BookOpen },
                  { year: "2018", title: "Best Startup of the Year", org: "National ICT Awards", icon: Award },
                  { year: "2018", title: "MetLife CEO Award", org: "Regional Innovation Competition", icon: Award },
                  { year: "2017", title: "Top 10 Innovations", org: "Cambridge Innovations Forum — University of Cambridge", icon: Award },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex flex-col items-center" style={{width:"220px", flexShrink:0}}>
                      {/* Timeline dot */}
                      <div className="relative z-10 w-[26px] h-[26px] rounded-full border-2 border-white/30 flex items-center justify-center mb-5 flex-shrink-0" style={{background:"linear-gradient(135deg,#893A9F,#4a1260)"}}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      {/* Card */}
                      <div className="w-full rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl" style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", backdropFilter:"blur(8px)"}}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(255,255,255,0.12)"}}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white/50 uppercase tracking-widest" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.year}</span>
                          <h4 className="text-sm font-bold text-white mt-0.5 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.title}</h4>
                          <p className="text-xs text-white/50 mt-1 leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item.org}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Research Publications */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="h-px mb-10" style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)"}} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: BookOpen, label: "IEEE Xplore", sub: "Peer-reviewed clinical research publication", href: "https://ieeexplore.ieee.org/document/9629748" },
              { icon: BookOpen, label: "PubMed", sub: "Indexed medical research database", href: "https://pubmed.ncbi.nlm.nih.gov/33254535/" },
            ].map((pub, i) => {
              const Icon = pub.icon;
              return (
                <a key={i} href={pub.href} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-0.5"
                  style={{background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)"}}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(255,255,255,0.12)"}}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pub.label}</p>
                    <p className="text-xs text-white/50" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pub.sub}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy, Security & Ethics Section */}
      <section id="privacy" className="py-24 section-scroll" style={{background:"#f3edf8"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-sm font-semibold tracking-widest text-[#893A9F] uppercase" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Privacy & Ethics</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d0a3e] mb-5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Privacy, Security & Ethics</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Core principles—not afterthoughts. Built into every layer of the platform.</p>
          </div>

          {/* 4 Principle Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

            {/* Data Confidentiality */}
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md" style={{border:"1px solid #ede8f5"}}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                <Lock className="w-7 h-7 text-[#893A9F]" />
              </div>
              <h3 className="text-lg font-bold text-[#2d0a3e]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Data Confidentiality</h3>
              <ul className="space-y-2">
                {["Personal & health data treated as confidential","Restricted access to authorized users only","Used only for intended purposes"].map((pt,j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#893A9F] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Secure Infrastructure */}
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md" style={{border:"1px solid #ede8f5"}}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                <ShieldCheck className="w-7 h-7 text-[#893A9F]" />
              </div>
              <h3 className="text-lg font-bold text-[#2d0a3e]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Secure Infrastructure</h3>
              <ul className="space-y-2">
                {["Secure server environments with controlled access","Encrypted data transmission","Protection at rest and in transit"].map((pt,j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#893A9F] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Control */}
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md" style={{border:"1px solid #ede8f5"}}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                <UserCheck className="w-7 h-7 text-[#893A9F]" />
              </div>
              <h3 className="text-lg font-bold text-[#2d0a3e]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>User Control</h3>
              <ul className="space-y-2">
                {["Users can view their own health information","Sharing occurs with user consent","No selling of personal health data"].map((pt,j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#893A9F] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ethical AI */}
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md" style={{border:"1px solid #ede8f5"}}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                <Brain className="w-7 h-7 text-[#893A9F]" />
              </div>
              <h3 className="text-lg font-bold text-[#2d0a3e]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Ethical AI Use</h3>
              <ul className="space-y-2">
                {["Supportive, not autonomous decision-making","Non-diagnostic outputs only","No autonomous treatment decisions"].map((pt,j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#893A9F] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Commitment Banner */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm" style={{border:"1px solid #ede8f5"}}>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                <ShieldCheck className="w-7 h-7 text-[#893A9F]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#2d0a3e] mb-3" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Our Commitment to Responsible Health Technology</h3>
                <p className="text-gray-500 mb-7 leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                  Jendo recognizes that trust is essential in health technology. Privacy, security, and ethics are integrated into how the platform is designed, developed, and deployed.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["Respect individual privacy","Protect sensitive health data","Use technology responsibly"].map((item,i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-5 py-4" style={{background:"#f3edf8"}}>
                      <CheckCircle className="w-5 h-5 text-[#893A9F] flex-shrink-0" />
                      <span className="text-sm font-semibold text-[#2d0a3e]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Research & Evidence Section */}
      <section id="research" className="py-24 section-scroll" style={{background:"#f9f9fb"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-sm font-semibold tracking-widest text-[#893A9F] uppercase" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Evidence-Based</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d0a3e] mb-5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Research & Evidence</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Grounded in peer-reviewed biomedical research and evidence-based principles</p>
          </div>

          {/* Core Research Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">

            <div className="bg-white rounded-2xl border border-[#ede8f5] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                  <BookOpen className="w-6 h-6 text-[#893A9F]" />
                </div>
                <span className="text-xs font-bold tracking-widest text-[#893A9F] uppercase" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Core Jendo Research</span>
              </div>
              <h3 className="text-xl font-bold text-[#2d0a3e] mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>A Hybrid Approach for Screening Endothelial Dysfunction</h3>
              <p className="text-gray-500 mb-7 leading-relaxed flex-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                This study presents the scientific rationale and technical framework for combining non-invasive physiological signals to assess vascular reactivity and support early cardiovascular health insight.
              </p>
              <a
                href="https://ieeexplore.ieee.org/document/9629748"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm self-start transition-opacity hover:opacity-90"
                style={{background:"linear-gradient(135deg,#893A9F,#4a1260)",fontFamily:"var(--font-red-hat-display),sans-serif"}}
              >
                Read Published Research <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-[#ede8f5] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                  <Microscope className="w-6 h-6 text-[#893A9F]" />
                </div>
                <span className="text-xs font-bold tracking-widest text-[#893A9F] uppercase" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Ongoing Research</span>
              </div>
              <h3 className="text-xl font-bold text-[#2d0a3e] mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Continuous Validation & Clinical Evaluation</h3>
              <p className="text-gray-500 mb-5 leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Jendo continues to engage in ongoing research and validation activities:</p>
              <ul className="space-y-4 flex-1">
                {[
                  "Exploratory clinical evaluations under real-world conditions",
                  "Methodological refinement of signal acquisition and analysis",
                  "Collaboration with clinicians and academic partners"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#893A9F] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Scientific Foundation Band */}
          <div className="rounded-2xl p-8 md:p-10 mb-16" style={{background:"linear-gradient(135deg,#2d0a3e 0%,#4a1260 45%,#893A9F 100%)"}}>
            <h3 className="text-xl font-bold text-white mb-7" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Scientific Foundation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(255,255,255,0.14)"}}>
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Photoplethysmography (PPG)</h4>
                  <p className="text-purple-200 text-sm leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Assesses vascular tone, pulse waveform characteristics, and peripheral blood flow dynamics.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"rgba(255,255,255,0.14)"}}>
                  <Waves className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Digital Thermal Monitoring (DTM)</h4>
                  <p className="text-purple-200 text-sm leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Evaluates microvascular responses by measuring temperature changes following transient blood flow occlusion.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Research Publications */}
          <div className="mb-14">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-[#893A9F]" />
                <span className="text-sm font-semibold tracking-widest text-[#893A9F] uppercase" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Literature</span>
                <div className="h-px w-8 bg-[#893A9F]" />
              </div>
              <h3 className="text-3xl font-bold text-[#2d0a3e] mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Related Research Publications</h3>
              <p className="text-gray-500 text-lg" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Peer-reviewed studies supporting cardiovascular assessment and vascular health monitoring</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {title:"Arterial Stiffness and Wave Reflection",journal:"PMC — Cardiovascular Research",year:"2015",description:"Comprehensive review of arterial stiffness as a marker of cardiovascular disease and its clinical implications.",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC4553666/"},
                {title:"Endothelial Function and Cardiovascular Disease",journal:"PubMed — Circulation",year:"2007",description:"Assessment of endothelial function in clinical practice and its role in cardiovascular risk prediction.",url:"https://pubmed.ncbi.nlm.nih.gov/17430168/"},
                {title:"Photoplethysmography Signal Processing",journal:"MDPI Electronics",year:"2019",description:"Advanced signal processing techniques for PPG-based cardiovascular monitoring systems.",url:"https://www.mdpi.com/2079-9292/8/3/271"},
                {title:"Vascular Aging and Assessment Methods",journal:"MDPI Sensors",year:"2018",description:"Non-invasive methods for assessing vascular aging and arterial health using sensor technologies.",url:"https://www.mdpi.com/1424-8220/18/6/1894"},
                {title:"Digital Thermal Monitoring in Vascular Assessment",journal:"PubMed — Vascular Medicine",year:"2010",description:"Clinical validation of digital thermal monitoring for vascular reactivity assessment.",url:"https://pubmed.ncbi.nlm.nih.gov/20459206/"},
                {title:"Cardiovascular Risk Prediction Models",journal:"PubMed — Clinical Research",year:"2016",description:"Novel approaches to cardiovascular risk stratification using physiological biomarkers.",url:"https://pubmed.ncbi.nlm.nih.gov/27830091/"},
              ].map((pub, i) => (
                <a
                  key={i}
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl border border-[#ede8f5] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                      <FileText className="w-5 h-5 text-[#893A9F]" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:"#f3edf8",color:"#893A9F",fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pub.year}</span>
                  </div>
                  <h4 className="font-bold text-[#2d0a3e] mb-1 group-hover:text-[#893A9F] transition-colors text-sm leading-snug" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pub.title}</h4>
                  <p className="text-xs font-semibold text-[#893A9F] mb-3" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pub.journal}</p>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1 mb-5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{pub.description}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#893A9F] mt-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                    <ExternalLink className="w-4 h-4" />
                    <span>View Publication</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Endothelial Dysfunction Note */}
          <div className="rounded-2xl p-8 border border-[#ede8f5]" style={{background:"#f3edf8"}}>
            <p className="text-[#2d0a3e] text-lg leading-relaxed text-center" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
              <strong>Endothelial dysfunction</strong> represents an early functional abnormality in the cardiovascular disease continuum, consistently shown in peer-reviewed studies to be associated with increased risk even when individuals appear clinically stable or asymptomatic.
            </p>
          </div>

        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 section-scroll" style={{background:"#f9f9fb"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-sm font-semibold tracking-widest text-[#893A9F] uppercase" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Latest News</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d0a3e] mb-5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Stay in the Know</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Follow Jendo's breakthroughs, partnerships, and milestones as we redefine cardiovascular health.</p>
          </div>

          {/* Featured Post */}
          {blogPosts.length > 0 && (
            <a
              href={blogPosts[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block mb-10 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
              style={{border:"1px solid #ede8f5"}}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 lg:h-auto overflow-hidden" style={{minHeight:"280px"}}>
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:1024px) 100vw, 50vw"
                    quality={90}
                    priority
                    unoptimized={false}
                  />
                  <div className="absolute inset-0" style={{background:"linear-gradient(to right,transparent,rgba(255,255,255,0.15))"}} />
                </div>
                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#893A9F] uppercase mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                    <Award className="w-3.5 h-3.5" /> Featured
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#2d0a3e] mb-4 leading-tight group-hover:text-[#893A9F] transition-colors" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                    {blogPosts[0].title}
                  </h3>
                  <p className="text-gray-500 mb-6 leading-relaxed" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}><User className="w-4 h-4 text-[#893A9F]" />{blogPosts[0].author}</span>
                    <span className="flex items-center gap-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}><Clock className="w-4 h-4 text-[#893A9F]" />{blogPosts[0].date}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[#893A9F]" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
                    Read Article <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* Remaining Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post, index) => (
              <a
                key={index}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col bg-white shadow-sm hover:shadow-md"
                style={{border:"1px solid #ede8f5"}}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                    quality={85}
                    unoptimized={false}
                  />
                  <div className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(45,10,62,0.4),transparent)"}} />
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-[#2d0a3e] mb-3 text-sm leading-snug group-hover:text-[#893A9F] transition-colors line-clamp-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{post.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3 flex-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4" style={{borderTop:"1px solid #ede8f5"}}>
                    <span className="flex items-center gap-1.5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}><User className="w-3.5 h-3.5 text-[#893A9F]" />{post.author}</span>
                    <span className="flex items-center gap-1.5" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}><Clock className="w-3.5 h-3.5 text-[#893A9F]" />{post.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 section-scroll" style={{background:"linear-gradient(135deg,#2d0a3e 0%,#4a1260 45%,#893A9F 100%)",position:"relative",overflow:"hidden"}}>
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{background:"radial-gradient(circle,#c084fc,transparent)"}} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10" style={{background:"radial-gradient(circle,#c084fc,transparent)"}} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[#c084fc]" />
            <span className="text-xs font-bold tracking-widest text-[#c084fc] uppercase" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Newsletter</span>
            <div className="h-px w-8 bg-[#c084fc]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Subscribe to Our Newsletter</h2>
          <p className="text-lg text-purple-200 mb-10 max-w-xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>
            Get the latest breakthroughs and news in cardiovascular health delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl text-[#2d0a3e] text-sm font-medium placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#c084fc] transition-all"
              style={{background:"rgba(255,255,255,0.95)",fontFamily:"var(--font-red-hat-display),sans-serif",border:"none"}}
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl font-bold text-sm text-[#2d0a3e] transition-all hover:opacity-90 whitespace-nowrap"
              style={{background:"#c084fc",fontFamily:"var(--font-red-hat-display),sans-serif"}}
            >
              Subscribe
            </button>
          </form>
          <p className="mt-5 text-purple-300 text-xs" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>No spam. Unsubscribe anytime.</p>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-24 section-scroll" style={{background:"#f9f9fb"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#893A9F]" />
              <span className="text-sm font-semibold tracking-widest text-[#893A9F] uppercase" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Get In Touch</span>
              <div className="h-px w-8 bg-[#893A9F]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d0a3e] mb-4" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Contact Us</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Reach out to our team — we'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm" style={{border:"1px solid #ede8f5"}}>
              <h3 className="text-xl font-bold text-[#2d0a3e] mb-6" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Book an Appointment</h3>
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
              }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#2d0a3e] mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="block w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#893A9F] transition-all"
                      style={{background:"#f9f9fb",border:"1px solid #ede8f5",fontFamily:"var(--font-red-hat-display),sans-serif"}}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#2d0a3e] mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="block w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#893A9F] transition-all"
                      style={{background:"#f9f9fb",border:"1px solid #ede8f5",fontFamily:"var(--font-red-hat-display),sans-serif"}}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#2d0a3e] mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Phone <span className="font-normal text-gray-400">(Optional)</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="block w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#893A9F] transition-all"
                    style={{background:"#f9f9fb",border:"1px solid #ede8f5",fontFamily:"var(--font-red-hat-display),sans-serif"}}
                    placeholder="+94 77 000 0000"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#2d0a3e] mb-2" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#893A9F] transition-all resize-none"
                    style={{background:"#f9f9fb",border:"1px solid #ede8f5",fontFamily:"var(--font-red-hat-display),sans-serif"}}
                    required
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{background:"linear-gradient(135deg,#893A9F,#4a1260)",fontFamily:"var(--font-red-hat-display),sans-serif"}}
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <><ArrowRight className="w-4 h-4" /><span>Book Appointment</span></>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Contact Info + Map */}
            <div className="flex flex-col gap-6">
              {/* Info Cards */}
              <div className="bg-white rounded-2xl p-7 shadow-sm" style={{border:"1px solid #ede8f5"}}>
                <h3 className="text-xl font-bold text-[#2d0a3e] mb-6" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Contact Information</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                      <MapPin className="w-5 h-5 text-[#893A9F]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#893A9F] uppercase tracking-wider mb-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Address</p>
                      <p className="text-sm text-gray-600" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Bay X, Trace Expert City<br/>Colombo 10, Sri Lanka</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                      <Mail className="w-5 h-5 text-[#893A9F]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#893A9F] uppercase tracking-wider mb-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Email</p>
                      <a href="mailto:keerthi@jendoinnovations.com" className="text-sm text-gray-600 hover:text-[#893A9F] transition-colors" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>keerthi@jendoinnovations.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#f3edf8"}}>
                      <Download className="w-5 h-5 text-[#893A9F]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#893A9F] uppercase tracking-wider mb-1" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Phone</p>
                      <a href="tel:0766210120" className="text-sm text-gray-600 hover:text-[#893A9F] transition-colors" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>+94 76 621 0120</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex-1" style={{border:"1px solid #ede8f5"}}>
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8661325756734!2d79.85888677489614!3d6.930059893067721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591076e625a3%3A0xad34e9e40449036b!2sTrace%20Expert%20City!5e0!3m2!1sen!2sus!4v1706579876041!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{border:0}}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="px-5 py-4 flex items-center justify-between gap-4" style={{borderTop:"1px solid #ede8f5"}}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#893A9F] flex-shrink-0" />
                    <span className="text-sm text-gray-600" style={{fontFamily:"var(--font-red-hat-display),sans-serif"}}>Trace Expert City, Colombo 10, Sri Lanka</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Trace+Expert+City/@6.9300599,79.8588868,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold px-4 py-2 rounded-full text-white flex-shrink-0 transition-opacity hover:opacity-90"
                    style={{background:"linear-gradient(135deg,#893A9F,#4a1260)",fontFamily:"var(--font-red-hat-display),sans-serif"}}
                  >
                    Get Directions
                  </a>
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
                  {/* <option value="professional">Standard Package ($2,400/year)</option> */}
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
