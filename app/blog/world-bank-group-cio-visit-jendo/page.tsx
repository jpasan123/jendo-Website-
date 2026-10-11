"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageSlider, { type SliderImage } from "@/components/news/ImageSlider";

const HERO_IMAGES: SliderImage[] = [
  { src: "/news/world-bank-cio-visit-1.jpg", alt: "The World Bank Group CIO at Jendo Innovations being introduced to the Jendo device", fit: "cover" },
  { src: "/news/world-bank-cio-visit-2.jpg", alt: "Presenting the Jendo device and its capabilities to the World Bank Group CIO", fit: "cover" },
];

const BODY_PHOTOS = {
  demo: { src: "/news/world-bank-cio-visit-2.jpg", alt: "Presenting Jendo Innovation to the World Bank Group CIO", caption: "Presenting the Jendo device and its key capabilities to the World Bank Group CIO.", width: 1179, height: 875 },
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

export default function WorldBankCioVisitArticle() {
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
          World Bank Group CIO Visits Jendo Innovations
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>2026</span>
        </div>
      </div>

      <div className="article-content prose prose-slate sm:prose-lg mx-auto prose-headings:text-purple-800 break-words">
        <p>
          Jendo Innovations Inc. was pleased to host a visit by the <b>World Bank Group Chief Information Officer (CIO)</b>, during which the Jendo device was introduced along with its key features and capabilities.
        </p>
        <BodyPhoto photo={BODY_PHOTOS.demo} />
        <p>
          The visit was an opportunity to showcase Jendo&rsquo;s innovation, exchange ideas, and discuss the potential of the technology.
        </p>
        <p>
          <b>Jendo Innovations thanks the World Bank Group delegation for their time and interest.</b>
        </p>
      </div>
    </div>
  );
}
