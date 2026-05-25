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

      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <p>
          It was a special opportunity to meet Hon. Dr. Harini Amarasuriya, Prime Minister of Sri Lanka, during her
          visit to the University of Oxford.
        </p>

        <p>
          As Chevening CRISP Fellows 2026 at St Cross College, Oxford, we met her at St Antony&apos;s College,
          University of Oxford, and shared our thoughts on strengthening future collaboration between the UK and Sri
          Lanka, particularly through initiatives related to innovation, Neo Ventures, Jendo Innovations Inc., and
          the vision of building a Centre of Excellence in Biomedical Engineering.
        </p>

        <p>
          The meeting was facilitated by Eleanor Walton from the Foreign, Commonwealth and Development Office, with the
          support of the Sri Lankan High Commission in the UK and the British High Commission in Colombo.
        </p>

        <p>
          We were also pleased to be joined by Prof. Diego Sanchez-Ancochea and His Excellency Nimal Senadheera,
          High Commissioner of Sri Lanka to the UK.
        </p>

        <p>
          #Chevening #Oxford #StCrossCollege #SriLanka #UKSriLanka #BiomedicalEngineering #HealthcareInnovation
          #AIinHealthcare
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