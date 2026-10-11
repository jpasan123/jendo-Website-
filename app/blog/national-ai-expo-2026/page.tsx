"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageSlider, { type SliderImage } from "@/components/news/ImageSlider";

const HERO_IMAGES: SliderImage[] = [
  { src: "/news/national-ai-expo-2026-1.jpg", alt: "Jendo Innovations presenting its vascular health technology at the National AI Expo 2026", fit: "cover" },
  { src: "/news/national-ai-expo-2026-2.jpg", alt: "Visitors at the Jendo Innovations stand at the National AI Expo 2026", fit: "cover" },
];

const BODY_PHOTOS = {
  stand: { src: "/news/national-ai-expo-2026-2.jpg", alt: "Jendo team explaining the technology to visitors at the National AI Expo 2026", caption: "Explaining Jendo\u2019s technology to visitors at the National AI Expo 2026.", width: 1179, height: 895 },
};

function BodyPhoto({ photo }: { photo: { src: string; alt: string; caption: string; width: number; height: number; narrow?: boolean } }) {
  return (
    <figure className={`not-prose my-8 ${photo.narrow ? "max-w-sm mx-auto" : ""}`}>
      <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(max-width:768px) 100vw, 768px"
          className="w-full h-auto"
        />
      </div>
      <figcaption className="mt-2 text-center text-sm text-gray-500">{photo.caption}</figcaption>
    </figure>
  );
}

export default function NationalAiExpo2026Article() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
      <Link
        href="/#blog"
        className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to News
      </Link>

      <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl bg-white aspect-video">
        <ImageSlider images={HERO_IMAGES} intervalMs={6500} sizes="(max-width:768px) 100vw, 768px" priority />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          Jendo Innovations Showcased at the National AI Expo 2026
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>2026</span>
        </div>
      </div>

      <div className="article-content prose prose-slate sm:prose-lg mx-auto prose-headings:text-purple-800 break-words">
        <p>
          <b>Jendo Innovations Inc.</b> was showcased at the <b>National AI Expo 2026</b>, where the team presented its patented AI-powered vascular health technology and shared progress on its development.
        </p>
        <h2>Presenting to National Leaders</h2>
        <p>
          At the Jendo stand, the team explained the technology and the company&rsquo;s progress to <b>Hon. Chathuranga Abeysinghe FCMA CGMA</b>, Deputy Minister of Industry and Entrepreneurship Development; <b>Hon. Eranga Weeraratne</b>, Deputy Minister of Digital Economy; and <b>Dr Mothilal De Silva</b>, Chairman and Director of Mobitel (Pvt) Ltd.
        </p>
        <p>
          They took a keen interest in how the technology has been developed and the impact it can have on preventive cardiovascular care.
        </p>
        <BodyPhoto photo={BODY_PHOTOS.stand} />
        <h2>Locally Developed, Globally Relevant</h2>
        <p>
          Jendo&rsquo;s non-invasive vascular health technology combines physiological signal analysis with artificial intelligence to support earlier identification of vascular dysfunction. Taking part in a national platform such as the National AI Expo gives Sri Lanka&rsquo;s AI and HealthTech community an opportunity to show what locally developed, science-based innovation can achieve.
        </p>
        <p>
          <b>Jendo Innovations thanks the organisers and all the visitors who took the time to engage with the technology.</b>
        </p>
      </div>
    </div>
  );
}
