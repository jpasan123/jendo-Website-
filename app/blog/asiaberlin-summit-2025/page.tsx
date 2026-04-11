"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AsiaBerlinSummit2025Article() {
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

      <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
        <Image
          src="https://i.ibb.co/zhWCvzPS/1764872070468.jpg"
          alt="Jendo Innovations at AsiaBerlin Summit 2025"
          width={1400}
          height={800}
          className="object-cover w-full h-72"
          priority
        />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          Jendo Innovations at AsiaBerlin Summit 2025
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>2025</span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <p>
          It was a privilege for Jendo Innovations to take part in the AsiaBerlin Summit 2025, engaging with German
          medical product distributors and ecosystem leaders to explore pathways for global expansion of Sri Lankan
          med-tech.
        </p>

        <p>
          We extend our heartfelt appreciation to the AsiaBerlin team, the event organizers, and the Sri Lanka Pavilion
          for their outstanding support with special thanks to Dr. Dr. Hans Wijayasuriya, Manori Unambuwe, Sachindra
          Samararatne, Carl R. Hartlein, Rainer Seider, Marten Rauschenberg, TRACE - Sri Lanka, and Heminda Jayaweera
          for enabling this platform.
        </p>

        <p>
          Proud to have stood alongside the Sri Lankan delegation Kanishka Weeramunda, Sampath Jayasundara, CD
          Athuraliya, Chamara Philips, Maheshika Dinushi Bandara, Indunil Udara Palihawadana and the many Sri Lankan
          founders and innovators who showcased the spirit of #AnIslandRising.
        </p>

        <p>
          Together, we continue strengthening the bridge between Sri Lanka and Germany, advancing partnerships,
          co-creation, and new market opportunities for deep-tech healthcare.
        </p>

        <p>
          Special thanks for the staff at Sri Lankan Embassy Germany and the H.E. Ambassador Varuni Muthukumarana.
        </p>

        <p>
          #AsiaBerlin2025 #SriLanka #JendoInnovations #DeepTech #MedTech #GlobalPartnerships #AnIslandRising
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/9m9WWB7G/1764872069770.jpg"
            alt="AsiaBerlin Summit networking moment 1"
            width={900}
            height={900}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/Ng5RJ1vp/1764872070038.jpg"
            alt="AsiaBerlin Summit networking moment 2"
            width={900}
            height={900}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/RkCpBBDf/1764872068606.jpg"
            alt="AsiaBerlin Summit delegation photo"
            width={900}
            height={900}
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
