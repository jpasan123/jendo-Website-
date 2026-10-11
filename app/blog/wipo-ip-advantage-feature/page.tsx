"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ImageSlider, { type SliderImage } from "@/components/news/ImageSlider";

const HERO_IMAGES: SliderImage[] = [
  { src: "/news/wipo-ip-advantage-jendo.jpg", alt: "Jendo featured in WIPO's IP Advantage collection: predicting heart disease with machine learning", fit: "cover", position: "center 20%" },
  { src: "/news/wipo-ip-advantage-cover.jpg", alt: "WIPO IP Advantage: case studies and stories showing how intellectual property contributes to business success", fit: "cover", position: "center 30%" },
];

const BODY_PHOTOS = {
  card: { src: "/news/wipo-ip-advantage-jendo.jpg", alt: "Jendo's entry in WIPO's IP Advantage collection", caption: "Jendo\u2019s entry in the WIPO IP Advantage collection.", width: 958, height: 1200, narrow: true },
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

const LINKS = [
  { label: "WIPO IP Advantage", href: "https://www.wipo.int/ipadvantage" },
  { label: "Read the original LinkedIn post", href: "https://lnkd.in/p/gy6aPY2F" },
];

export default function WipoIpAdvantageArticle() {
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
          Jendo&rsquo;s AI-Powered Cardiac Risk Prediction Featured in WIPO&rsquo;s IP Advantage Collection
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>2026</span>
        </div>
      </div>

      <div className="article-content prose prose-slate sm:prose-lg mx-auto prose-headings:text-purple-800 break-words">
        <p>
          Some ideas are worth protecting because of the difference they can make in people&rsquo;s lives.
        </p>
        <p>
          Jendo&rsquo;s work in <b>AI-powered cardiac risk prediction</b> has been featured in <b>WIPO&rsquo;s IP Advantage</b> collection, a database of case studies and stories showing how intellectual property contributes to business success. The feature recognises the role of innovation and intellectual property in advancing healthcare.
        </p>
        <BodyPhoto photo={BODY_PHOTOS.card} />
        <p>
          Jendo is proud to be part of Sri Lanka&rsquo;s growing HealthTech landscape.
        </p>
        <p>
          <b>Explore the feature on the WIPO IP Advantage website.</b>
        </p>
        <div className="not-prose mt-8 space-y-3">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 font-semibold text-purple-700 hover:text-purple-900 hover:underline"
            >
              <ExternalLink className="w-4 h-4 mt-1 shrink-0" />
              <span>{l.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
