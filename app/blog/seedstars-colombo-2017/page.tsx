"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SeedstarsColombo2017Article() {
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
            src="https://i.ibb.co/67YC29WL/Untitled-design-28-jpg.jpg"
            alt="Keerthi Kodithuwakku receiving the winners award at Seedstars Colombo 2017"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          Jendo CEO Keerthi Kodithuwakku Wins at Seedstars Colombo 2017
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>2017</span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <p>
          <a href="https://www.keerthikodithuwakku.com/" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">
            Keerthi Kodithuwakku
          </a>
          , CEO of Jendo Innovations, received the winners award at Seedstars Colombo 2017, marking an important
          early milestone in Jendo&apos;s innovation journey.
        </p>

        <p>
          Seedstars is a global startup competition founded in Switzerland that supports and connects emerging-market
          startups. The program runs in more than 60 countries and is known for helping promising founders gain
          visibility, mentorship, and access to investors.
        </p>

        <p>
          Seedstars Colombo brought together some of Sri Lanka&apos;s most ambitious founders, and this recognition helped
          highlight the potential of local innovation on a global stage.
        </p>

        <p>
          The award reflected the strength of Jendo&apos;s early vision: building science-driven solutions that can improve
          healthcare outcomes and create real-world impact.
        </p>
      </div>
    </div>
  );
}