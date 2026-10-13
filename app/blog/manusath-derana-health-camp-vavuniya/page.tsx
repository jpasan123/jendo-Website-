"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageSlider, { type SliderImage } from "@/components/news/ImageSlider";

const HERO_IMAGES: SliderImage[] = [
  { src: "/news/vavuniya-health-camp-cover.jpg", alt: "Jendo Innovations at TV Derana's 88th Manusath Derana Health Camp in Vavuniya", fit: "cover", position: "center 40%" },
  { src: "/news/vavuniya-health-camp-2.jpg", alt: "Jendo Innovations speaking with TV Derana at the Manusath Derana Health Camp, Vavuniya", fit: "blur" },
  { src: "/news/vavuniya-health-camp-3.jpg", alt: "Jendo Innovations meeting residents at the Manusath Derana Health Camp, Vavuniya", fit: "blur" },
];

const BODY_PHOTOS = {
  podium: { src: "/news/vavuniya-health-camp-1.jpg", alt: "Addressing the gathering at the Manusath Derana Health Camp, Vavuniya", caption: "Addressing the gathering at the 88th Manusath Derana Health Camp in Vavuniya.", width: 900, height: 1200, narrow: true },
  interview: { src: "/news/vavuniya-health-camp-2.jpg", alt: "Speaking with TV Derana at the health camp", caption: "Speaking with TV Derana at the health camp.", width: 675, height: 1200, narrow: true },
  community: { src: "/news/vavuniya-health-camp-3.jpg", alt: "Meeting residents at the health camp", caption: "Meeting residents at the health camp.", width: 900, height: 1200, narrow: true },
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

export default function ManusathDeranaVavuniyaArticle() {
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
          Health, Care &amp; Community &ndash; Together: Jendo at Manusath Derana Health Camp, Vavuniya
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>August 2026</span>
        </div>
      </div>

      <div className="article-content prose prose-slate sm:prose-lg mx-auto prose-headings:text-purple-800 break-words">
        <p>
          <b>Health, Care &amp; Community &ndash; Together.</b>
        </p>
        <p>
          Jendo Innovations Inc. joined TV Derana&rsquo;s <b>88th Manusath Derana Health Camp in Vavuniya</b>, supporting a meaningful initiative dedicated to bringing healthcare and care closer to the community.
        </p>
        <BodyPhoto photo={BODY_PHOTOS.podium} />
        <p>
          Manusath Derana health camps bring medical services to communities that often have limited access to them. Being part of this effort allowed Jendo to meet people in Vavuniya and share the work being done in Sri Lanka on preventive cardiovascular health.
        </p>
        <BodyPhoto photo={BODY_PHOTOS.interview} />
        <BodyPhoto photo={BODY_PHOTOS.community} />
        <p>
          <b>Jendo Innovations thanks TV Derana and the Manusath Derana team for the opportunity to be part of this initiative.</b>
        </p>
      </div>
    </div>
  );
}
