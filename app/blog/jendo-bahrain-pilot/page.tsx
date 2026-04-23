"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function JendoBahrainPilotArticle() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to News
      </button>

      <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
        <Image
          src="https://i.ibb.co/Q3Pmmq5z/Whats-App-Image-2026-03-03-at-08-31-39.jpg"
          alt="JENDO Bahrain pilot — King Hamad American Mission Hospital"
          width={1200}
          height={675}
          className="object-cover w-full h-64"
          priority
        />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          Sri Lankan AI Medical Device JENDO Successfully Piloted in Bahrain
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>February 2026</span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <p>
          A Sri Lankan-invented medical device, <b>JENDO</b>, designed for non-invasive early detection of cardiovascular
          conditions using AI, was successfully piloted at the <b>King Hamad American Mission Hospital</b> in Bahrain in
          February.
        </p>
        <p>
          Developed by engineer <b><a href="https://www.keerthikodithuwakku.com/" target="_blank" rel="noopener noreferrer" className="text-inherit hover:underline">Keerthi Kodithuwakku</a></b> and his team, the device enables preventive screening through
          physiological signal analysis.
        </p>
      </div>
    </div>
  );
}
