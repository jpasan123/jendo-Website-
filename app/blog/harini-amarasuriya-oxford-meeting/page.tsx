"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function HariniAmarasuriyaOxfordMeetingArticle() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to News
      </button>

      <div className="mb-8 rounded-2xl overflow-hidden shadow-xl bg-white">
        <div className="relative aspect-[16/9] w-full bg-white">
          <Image
            src="https://i.ibb.co/DD77KNc8/1779534055264.jpg"
            alt="Meeting Hon. Dr. Harini Amarasuriya at the University of Oxford"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          Meeting Hon. Dr. Harini Amarasuriya at Oxford
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>2026</span>
        </div>
      </div>

      <div className="article-content prose prose-slate prose-lg mx-auto">
        <p>
          It was a great honour for the leadership of Jendo Innovations to meet Harini Amarasuriya during her visit to the University of Oxford.
        </p>

        <p>
          As Chevening Scholarship CRISP Fellows 2026 at St Cross College the meeting took place at St Antony's College, where discussions focused on strengthening future collaboration between the UK and Sri Lanka in the areas of innovation, entrepreneurship, healthcare transformation and biomedical engineering. The conversation also highlighted the vision behind initiatives connected to Jendo Innovations, particularly the long-term goal of establishing a Centre of Excellence in Biomedical Engineering to support healthcare innovation and AI-driven solutions in Sri Lanka.
        </p>

        <p>
          The meeting was facilitated by Eleanor Walton with the support of the Sri Lankan High Commission in the United Kingdom and the British High Commission Colombo. We were also pleased to meet Diego Sanchez-Ancochea and Nimal Senadheera during the occasion.
        </p>

        <p>
          This meeting reflected a shared commitment towards fostering international collaboration, advancing healthcare innovation and creating meaningful impact through technology and research.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/GvFqSB8z/1779561247013.jpg"
            alt="Oxford meeting moment 1"
            width={900}
            height={900}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/s9NrRPQj/1779561247423.jpg"
            alt="Oxford meeting moment 2"
            width={900}
            height={900}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/4Zv2dGTC/1779561242585.jpg"
            alt="Oxford meeting moment 3"
            width={900}
            height={900}
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
    </div>
  );
}