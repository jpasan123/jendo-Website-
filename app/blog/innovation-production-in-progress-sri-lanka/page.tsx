"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function InnovationProductionInProgressSriLankaArticle() {
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
          src="https://i.ibb.co/B5CGB1VS/4061e00e-5407-4198-9690-080b10d33844.jpg"
          alt="New production in progress: science-based innovation in Sri Lanka"
          width={1200}
          height={675}
          className="object-cover w-full h-64"
          priority
        />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          New Production in Progress: Advancing Science-Based Innovation in Sri Lanka
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>March 2026</span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <p>
          Pleased to share that a new production is currently in progress, focusing on advancing science-based
          innovations in Sri Lanka.
        </p>
        <p>
          This initiative is being carried out in collaboration with the <b>TV Derana</b> and the <b>National Academy of
          Sciences Sri Lanka</b>, with the aim of strengthening the role of research-driven solutions in national
          development.
        </p>
        <p>It is encouraging to see science, innovation, and industry coming together to create meaningful impact.</p>
        <p>Looking forward to contributing towards a stronger, innovation-driven Sri Lanka.</p>
        <p className="text-sm text-gray-500">#Innovation #Science #SriLanka #HealthTech #Research #FutureOfHealthcare</p>
      </div>
    </div>
  );
}
