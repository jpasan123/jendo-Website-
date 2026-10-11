export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  fit: "cover" | "contain";
};

/** Articles that have their own page under /blog/<slug>. Newest first. */
export const BLOG_POSTS: BlogListItem[] = [
  {
    "slug": "who-gi-ai4h-hangzhou-2026",
    "title": "Jendo Innovations Shares Its AI Health Journey at the WHO Global Initiative on AI for Health in Hangzhou",
    "excerpt": "Keerthi Kodithuwakku, Chairman and CEO of Jendo Innovations, presented Jendo's journey as an invited speaker at the Third Meeting of the WHO-ITU-WIPO Global Initiative on AI for Health in Hangzhou, China, while Dr. Dhanushi Hettiarachchi joined as a working-group member.",
    "date": "16–18 September 2026",
    "image": "https://i.ibb.co/nq19bQ7w/Whats-App-Image-2026-10-05-at-11-50-33.jpg",
    "fit": "cover"
  },
  {
    "slug": "wipo-global-innovation-index-2026",
    "title": "Jendo Innovations Featured Among 20 Deep-Science Patent Holders in WIPO Global Innovation Index 2026",
    "excerpt": "Jendo Innovations has been featured in WIPO's Global Innovation Index 2026 as one of only 20 deep-science patent holders from middle-income economies, representing Sri Lanka in Medical Devices and Digital Health.",
    "date": "October 2026",
    "image": "https://i.ibb.co/m501bTRT/Global-Innovation-Index-2026-Invitation.png",
    "fit": "contain"
  },
  {
    "slug": "national-ai-expo-2026",
    "title": "Jendo Innovations Showcased at the National AI Expo 2026",
    "excerpt": "Jendo's patented AI-powered vascular health technology and its progress were presented to Hon. Chathuranga Abeysinghe, Deputy Minister of Industry and Entrepreneurship Development, Hon. Eranga Weeraratne, Deputy Minister of Digital Economy, and Dr Mothilal De Silva, Chairman and Director of Mobitel (Pvt) Ltd.",
    "date": "2026",
    "image": "/news/national-ai-expo-2026-1.jpg",
    "fit": "cover"
  },
  {
    "slug": "world-bank-group-cio-visit-jendo",
    "title": "World Bank Group CIO Visits Jendo Innovations",
    "excerpt": "A valuable visit by the World Bank Group CIO to Jendo Innovations Inc., where the Jendo device was introduced along with its key features and capabilities, and the potential of the technology was discussed.",
    "date": "2026",
    "image": "/news/world-bank-cio-visit-1.jpg",
    "fit": "cover"
  },
  {
    "slug": "manusath-derana-health-camp-vavuniya",
    "title": "Health, Care & Community – Together: Jendo at the Manusath Derana Health Camp, Vavuniya",
    "excerpt": "Jendo Innovations Inc. joined TV Derana's 88th Manusath Derana Health Camp in Vavuniya, supporting a meaningful initiative dedicated to bringing healthcare and care closer to the community.",
    "date": "August 2026",
    "image": "/news/vavuniya-health-camp-cover.jpg",
    "fit": "cover"
  },
  {
    "slug": "jendo-bahrain-pilot",
    "title": "Sri Lankan AI Medical Device JENDO Successfully Piloted in Bahrain",
    "excerpt": "A Sri Lankan‑invented medical device, JENDO, designed for non‑invasive early detection of cardiovascular conditions using AI, was successfully piloted at the King Hamad American Mission Hospital in Bahrain in February. Developed by engineer Keerthi Kodithuwakku and his team, the device enables preventive screening through physiological signal analysis.",
    "date": "February 2026",
    "image": "https://i.ibb.co/Q3Pmmq5z/Whats-App-Image-2026-03-03-at-08-31-39.jpg",
    "fit": "contain"
  },
  {
    "slug": "wipo-ip-advantage-feature",
    "title": "Jendo's AI-Powered Cardiac Risk Prediction Featured in WIPO's IP Advantage Collection",
    "excerpt": "Jendo's work in AI-powered cardiac risk prediction has been featured in WIPO's IP Advantage collection, recognising the role of innovation and intellectual property in advancing healthcare.",
    "date": "2026",
    "image": "/news/wipo-ip-advantage-jendo.jpg",
    "fit": "contain"
  },
  {
    "slug": "harini-amarasuriya-oxford-meeting",
    "title": "Meeting Hon. Dr. Harini Amarasuriya at Oxford",
    "excerpt": "During her visit to the University of Oxford, we met Sri Lankan Prime Minister Hon. Dr. Harini Amarasuriya, Prime Minister of Sri Lanka, and discussed future collaboration between the UK and Sri Lanka through innovation, Neo Ventures, Jendo Innovations Inc., and a Centre of Excellence in Biomedical Engineering.",
    "date": "2026",
    "image": "https://i.ibb.co/DD77KNc8/1779534055264.jpg",
    "fit": "contain"
  },
  {
    "slug": "asiaberlin-summit-2025",
    "title": "Jendo Innovations at AsiaBerlin Summit 2025",
    "excerpt": "Jendo Innovations participated in AsiaBerlin Summit 2025, engaging German medical distributors and ecosystem leaders to expand Sri Lankan med-tech globally and strengthen collaboration between Sri Lanka and Germany.",
    "date": "2025",
    "image": "https://i.ibb.co/zhWCvzPS/1764872070468.jpg",
    "fit": "contain"
  },
  {
    "slug": "nexus-to-connect-trace-neo-ventures",
    "title": "Nexus-to-Connect Session at TRACE - Sri Lanka",
    "excerpt": "From Jendo's Centre of Excellence in Biomedical Engineering, the Nexus-to-Connect session brought together clinicians, engineers, and innovators to turn clinical challenges into scalable healthcare innovation.",
    "date": "2025",
    "image": "https://i.ibb.co/v6ptxVks/1770293525892.jpg",
    "fit": "contain"
  },
  {
    "slug": "innovation-production-in-progress-sri-lanka",
    "title": "New Production in Progress: Advancing Science-Based Innovation in Sri Lanka",
    "excerpt": "Pleased to share that a new production is currently in progress, focusing on advancing science-based innovations in Sri Lanka. This initiative is being carried out in collaboration with the TV Derana and National Academy of Sciences Sri Lanka, with the aim of strengthening the role of research-driven solutions in national development.",
    "date": "March 2026",
    "image": "https://i.ibb.co/B5CGB1VS/4061e00e-5407-4198-9690-080b10d33844.jpg",
    "fit": "contain"
  },
  {
    "slug": "sri-lankan-innovation-meets-public-service-jendo-health-camp",
    "title": "Sri Lankan Innovation Meets Public Service: The Jendo Health Camp",
    "excerpt": "Over 100 Sri Lankan police officers underwent Jendo's 16-minute non-invasive vascular screening in a landmark health initiative led with senior police leadership, highlighting early cardiovascular risk detection through AI-powered local innovation.",
    "date": "July 14, 2025",
    "image": "https://i.ibb.co/WvtJW21S/Whats-App-Image-2025-07-14-at-13-51-07-d33c7810.jpg",
    "fit": "contain"
  },
  {
    "slug": "lanka-ventures-invests-in-jendo-innovations",
    "title": "Lanka Ventures PLC invests in Jendo Innovations",
    "excerpt": "Lanka Ventures PLC announced a strategic investment in Jendo Innovations, helping accelerate a Sri Lankan biomedical engineering breakthrough in early vascular disease diagnosis and AI-enabled preventive screening.",
    "date": "October 23, 2023",
    "image": "https://i.ibb.co/KpJtFWqH/image-f336df078b.jpg",
    "fit": "contain"
  },
  {
    "slug": "seedstars-colombo-2017",
    "title": "Jendo Innovations Wins Seedstars Colombo 2017",
    "excerpt": "Keerthi Kodithuwakku, CEO of Jendo Innovations, received the winners award at Seedstars Colombo 2017. Seedstars is a global startup competition based in Switzerland that connects and invests in emerging-market startups across more than 60 countries.",
    "date": "2017",
    "image": "https://i.ibb.co/67YC29WL/Untitled-design-28-jpg.jpg",
    "fit": "contain"
  },
  {
    "slug": "jkx-open-innovation-challenge",
    "title": "John Keells X Open Innovation Challenge – Grand Finale Recap",
    "excerpt": "Jendo wins the JKX Open Innovation Challenge, showcasing its pioneering non-invasive cardiovascular health platform among top innovators.",
    "date": "November 2, 2023",
    "image": "https://i.ibb.co/whCSMgMQ/Whats-App-Image-2025-01-15-at-19-56-35-3b4cc881.jpg",
    "fit": "cover"
  },
  {
    "slug": "jendo-patents",
    "title": "Srilanka Patent for Jendo",
    "excerpt": "Jendo secures a Sri Lankan patent, expanding its global presence and advancing non-invasive vascular health diagnostics.",
    "date": "March 20, 2024",
    "image": "https://i.ibb.co/MxLrpccS/Screen-Shot-2022-12-22-at-00-01-06-1.png",
    "fit": "cover"
  }
];
