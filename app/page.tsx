'use client';

import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { Heart, Shield, ArrowRight, Users, Activity, Download, MapPin, Mail, Clock, User, LineChart, FlaskRound as Flask, Building2, Stethoscope, FileHeart, ChartBar, Brain, Microscope, BarChart3, ShieldCheck, PieChart, HandHeart, Facebook, Twitter, Linkedin, CreditCard, Package, CheckCircle, ShoppingCart, X, Calendar, FileText, BedDouble, Waves, Cloud, Instagram, FacebookIcon } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { FormNotification } from '@/components/ui/form-notification';
import { Play, Pause } from "lucide-react"
import emailjs from '@emailjs/browser';
import { AppointmentSuccess } from '@/components/ui/appointment-success';
import { SuccessModal } from '@/components/SuccessModal';
import gsap from 'gsap';


export default function Home() {
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [isLabPartnerModalOpen, setIsLabPartnerModalOpen] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const cart = useCart();
  

  // Add these lines here
  const [currentImage, setCurrentImage] = useState(0);

  //Add the vide section here
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const videoSectionRef = useRef<HTMLElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const videoElement1 = videoRef1.current;
    const videoElement2 = videoRef2.current;
    const sectionElement = videoSectionRef.current;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVideoPlaying(true);
          videoElement1?.play().catch(error => console.log("Video 1 autoplay failed:", error));
          videoElement2?.play().catch(error => console.log("Video 2 autoplay failed:", error));
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
      title: "Jendo CEO Speaks at IEEE EMBS AXON Workshop on AI in Healthcare",
      excerpt: "Mr. Keerthi Kodithuwakku highlights Jendo's innovation in AI-powered vascular health monitoring and preventive healthcare.",
      date: "April 12, 2024",
      author: "IEEE EMBS",
      image: "https://i.ibb.co/Zb72PxJ/IEEE-2.png",
      url: "https://docs.google.com/document/d/1JKBsun40koXUQVNlIIzibPbXGScFxp1DngaUcoGZOlM/edit?usp=sharing",
    },
    {
    title: "John Keells X Open Innovation Challenge – Grand Finale Recap",
    excerpt: "Jendo wins the JKX Open Innovation Challenge for their noninvasive cardiovascular health platform. Read the full story of the event, the teams, and the winners.",
    date: "November 2, 2023",
    author: "JKX Team",
    image: "https://i.ibb.co/whCSMgMQ/Whats-App-Image-2025-01-15-at-19-56-35-3b4cc881.jpg", // or your external image link
    url: "/blog/jkx-open-innovation-challenge", // <-- internal link
  },
    {
      title: "John Keells X announces winners of the Open Innovation Challenge",
      excerpt: "How AI and machine learning are transforming cardiac care.",
      date: "March 10, 2024",
      author: "Ada Derana Team",
      image: "https://i.ibb.co/2DJxy9g/JKX-1-1.png",
      url: "http://bizenglish.adaderana.lk/john-keells-x-announces-winners-of-the-open-innovation-challenge/",
    },
    {
      title: "The JKX Open Innovation Challenge Finale",
      excerpt: "Early detection and prevention of cardiovascular diseases.",
      date: "March 5, 2024",
      author: "Andre Howson",
      image: "https://i.ibb.co/bMqByFXT/JKX-3-1024x425.jpg",
      url: "http://bizenglish.adaderana.lk/john-keells-x-announces-winners-of-the-open-innovation-challenge/",
    },
    {
      title: "John Keells X rewards winners of Innovation Challenge",
      excerpt: "Early detection and prevention of cardiovascular diseases.",
      date: "March 20, 2024",
      author: "Sunday Oberver",
      image: "https://i.ibb.co/bMqByFXT/JKX-3-1024x425.jpg",
      url: "https://archives1.sundayobserver.lk/2016/11/13/business/john-keells-x-rewards-winners-innovation-challenge",
    },
    {
      title: "Sri Lankan team in early major breakthrough on early detection of NCDs",
      excerpt: "The 'Jendo' hardware device that is clipped to the patient and to the computer",
      date: "August 5, 2018",
      author: " Quintus Perera",
      image: "https://i.ibb.co/6RDDJyL7/img.webp",
      url: "http://bizenglish.adaderana.lk/john-keells-x-announces-winners-of-the-open-innovation-challenge/",
    },
    {
      title: "A Hybrid Approach for Screening Endothelial Dysfunction using Photoplethysmography",
      excerpt: "A Hybrid Approach for Screening Endothelial Dysfunction using Photoplethysmography and Digital Thermal Monitoring",
      date: "March 20, 2024",
      author: "Vendys",
      image: "https://i.ibb.co/fdCnj2Qt/dac531-73bbe4c4b6594048bd41440f335212c2-mv2.jpg",
      url: "https://www.vendys2.com/post/a-hybrid-approach-for-screening-endothelial-dysfunction-using-photoplethysmography",
    },
    {
      title: "Srilanka Patent for Jendo",
      excerpt: "In addition to the home country Sri Lanka, we managed to expand our presence to Japan at the moment and the discussions are in progress with potential partners in Malaysia, UK, US, Jordan and india.",
      date: "March 20, 2024",
      author: "Vendys",
      image: "https://i.ibb.co/MxLrpccS/Screen-Shot-2022-12-22-at-00-01-06-1.png",
      url: "https://www.wipo.int/ipadvantage/en/details.jsp?id=12463",
    },
    {
      title: "Non-invasive assessment of endothelial dysfunction",
      excerpt: "The COVID-19 pandemic caused by the SARS-CoV-2 virus has infected millions and overburdened the healthcare infrastructure globally.",
      date: "May 20, 2021",
      author: "Pub Med",
      image: "https://i.ibb.co/Zzqmty9N/unnamed-1.png",
      url: "https://pubmed.ncbi.nlm.nih.gov/33254535/#article-details",
    },
    {
      title: "Jendo – Heart Disease Prediction using Machine Learning",
      excerpt: "AI in cardiology – A Steppingstone for Jendo Innovations.",
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

const handlePreOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  setIsSubmitting(true);

  try {
    const formData = new FormData(form);
    const response = await fetch('/api/pre-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (!response.ok) throw new Error('Submission failed');
    
    // Show success modal and close form after delay
    setShowPreOrderSuccess(true);
    setTimeout(() => {
      setIsPreOrderModalOpen(false);
      form.reset();
    }, 2000); // Keep form open for 2 seconds before closing
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to submit');
  } finally {
    setIsSubmitting(false);
  }
};

// In your component JSX:
{isPreOrderModalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    {/* Your existing form */}
  </div>
)}

<SuccessModal
  isOpen={showPreOrderSuccess}
  onClose={() => setShowPreOrderSuccess(false)}
  title="Pre-order Submitted!"
  message="Thank you for your pre-order! We'll contact you within 24 hours to confirm details."
/>

const handleLabPartnerSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const data = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    checkup_type: formData.get('checkup_type'),
    payment_method: formData.get('payment_method'),
    message: formData.get('message')
  };

  try {
    const response = await fetch("/api/book-checkup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to book check up");
    }

    toast.success("Check up booked successfully!");
    setIsLabPartnerModalOpen(false);
    form.reset();
  } catch (error) {
    toast.error("Failed to book check up");
    console.error("Book check up error:", error);
  }
}
 const handleInsuranceSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
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
      throw new Error('Failed to submit insurance partner application');
    }

    toast.success('Insurance partner application submitted successfully!');
    setIsInsuranceModalOpen(false);
    form.reset();
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

  return (
    <>

      {/* Hero Section */}
<section id="home" className="relative min-h-screen flex items-center section-scroll">
  {/* Image Carousel */}
  <div className="absolute inset-0 overflow-hidden">
    {[
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
      'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80&t=2',
    ].map((image, index) => (
      <div
        key={`slide-${index}`} // Changed key from image to a unique string
        className={`absolute inset-0 transition-opacity duration-1000 ${
          index === currentImage ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Image
          src={image}
          alt={`Background ${index + 1}`}
          fill
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>
    ))}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsla(267, 89.00%, 50.00%, 0.20),transparent_50%)] animate-pulse-slow" />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
    <div className="animate-fade-in">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
        Unlock the Future of Cardiovascular Health Today!
      </h1>
      <p className="text-xl text-gray-200 max-w-2xl mb-8">
        JENDO offers a revolutionary, non-invasive solution for early cardiovascular disease detection, delivering AI-powered health reports in 15 minutes. Perfect for patients, labs, and insurance partners seeking proactive heart health solutions.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={handlePreOrderClick}
          className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center space-x-2 animate-pulse-slow"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Pre-Order JENDO</span>
        </button>
        <button 
          onClick={handleLabPartnerClick}
          className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center space-x-2 animate-pulse-slow"
        >
          <Flask className="h-5 w-5" />
          <span>Book a Check Up</span>
        </button>
        <button 
          onClick={handleInsuranceClick}
          className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center space-x-2 animate-pulse-slow"
        >
          <Shield className="h-5 w-5" />
          <span>Insurance Partnership</span>
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
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          index === currentImage 
            ? 'bg-purple-600 scale-110' 
            : 'bg-white/50 hover:bg-white/75'
        }`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
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
        ref={videoSectionRef}
        className="relative py-16 bg-gradient-to-b from-white-900 to-black overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse-slow"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">Experience JENDO in Action</h2>
            <p className="text-lg md:text-xl text-black-200 max-w-3xl mx-auto">
              Watch how our revolutionary technology is changing cardiovascular health monitoring.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video 1 */}
            <div className="relative aspect-video rounded-md overflow-hidden shadow-md group">
              <div className="absolute inset-0 bg-purple-900/5 group-hover:bg-purple-900/0 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={toggleVideo}
                  className="bg-white/80 text-purple-900 rounded-full p-2 shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 z-10"
                >
                  {isVideoPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
              </div>
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
            </div>
            {/* Video 2 */}
            <div className="relative aspect-video rounded-md overflow-hidden shadow-md group">
              <div className="absolute inset-0 bg-purple-900/5 group-hover:bg-purple-900/0 transition-all duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={toggleVideo}
                  className="bg-white/80 text-purple-900 rounded-full p-2 shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 z-10"
                >
                  {isVideoPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
              </div>
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
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-base md:text-lg font-bold text-purple-700 mb-4-w-2xl mx-auto">
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
<section id="emma-gallery" className="py-20 bg-white section-scroll">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-purple-900 mb-4">Jendo Gallery</h2>
     <p className="text-lg text-gray-600">
  Explore memorable moments and milestones from Jendo’s journey in transforming cardiovascular health.
</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8" id="emma-gallery-images">
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/1tSm4mkJ/Whats-App-Image-2025-07-14-at-13-51-07-40106ee2.jpg" alt="Emma 1" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/ymS4bvYM/Whats-App-Image-2025-07-14-at-13-51-07-72813403.jpg" alt="Emma 2" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/fz8hvcwW/Whats-App-Image-2025-07-14-at-13-51-07-d33c7810.jpg" alt="Emma 3" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/hJ7TcWZx/Whats-App-Image-2025-07-14-at-13-51-08-2c551ce7.jpg" alt="Emma 4" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/dwfnDPDT/Whats-App-Image-2025-07-14-at-13-51-08-38e09f3b.jpg" alt="Emma 5" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/G4wDD4xS/Whats-App-Image-2025-07-14-at-13-51-36-160dfb2a.jpg" alt="Emma 6" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/zYn5mwS/Whats-App-Image-2025-07-14-at-13-51-38-1604ef8d.jpg" alt="Emma 7" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/Y4tJ9dvK/Whats-App-Image-2025-07-14-at-13-51-36-5255e477.jpg" alt="Emma 8" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/39kCjbJw/Whats-App-Image-2025-07-14-at-13-51-35-6ef53381.jpg" alt="Emma 9" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/5XWpWYSZ/Whats-App-Image-2025-07-14-at-13-51-38-780c184c.jpg" alt="Emma 10" className="w-full h-64 object-cover emma-gallery-img" />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
        <img src="https://i.ibb.co/rf0RzYvm/Whats-App-Image-2025-07-14-at-14-22-26-621a4f6a.jpg" />
      </div>
    </div>
  </div>
</section>

      {/* Statistics Section */}
      <section id="stats" className="relative py-32 bg-gradient-to-b from-gray-900 via-black to-purple-900/20 text-white overflow-hidden section-scroll">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] animate-pulse-slow" />
          <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-600/10"
            style={{
          width: Math.random() * 300 + 50 + 'px',
          height: Math.random() * 300 + 50 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
          animationDelay: `-${Math.random() * 10}s`,
            }}
          />
        ))}
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
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
              >
                <div className="block h-full">
                  <div className="relative h-[250px] w-full">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill
                      className="object-contain"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                      quality={100}
                      loading="eager"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="truncate max-w-[120px]">{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    {/* Read More Button */}
                    <a
                      href={
                        index === 0
                          ? '/blog/ieee-embs-axon-workshop'
                          : post.url
                      }
                      className="mt-6 inline-block bg-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors text-center"
                      target={index === 0 ? undefined : "_blank"}
                      rel={index === 0 ? undefined : "noopener noreferrer"}
                    >
                      Read More
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
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
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
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
      <form onSubmit={handlePreOrderSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="full_name"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
            required
          />
        </div>
        <div>
          <label htmlFor="package" className="block text-sm font-medium text-gray-700">Preferred Package</label>
          <select
            id="package"
            name="package_type"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
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
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="payment" className="block text-sm font-medium text-gray-700">Preferred Payment Method</label>
          <select
            id="payment"
            name="payment_method"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
            required
          >
            <option value="">Select payment method</option>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank-transfer">Bank Transfer</option>
          </select>
        </div>
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
            <form onSubmit={handleLabPartnerSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="full_name"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                >
                  <option value="">Select a check up type</option>
                  <option value="consultation">Jendo Consultation Patient Checkup (Rs. 5000)</option>
                  <option value="full">Jendo Full Check Up (Rs. 8000)</option>
                </select>
              </div>
              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Check Up</span>
              </button>
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
    </>
  );
}
