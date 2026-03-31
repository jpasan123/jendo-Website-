"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function LankaVenturesInvestmentArticle() {
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
          src="https://i.ibb.co/KpJtFWqH/image-f336df078b.jpg"
          alt="Lanka Ventures PLC invests in Jendo Innovations"
          width={1200}
          height={675}
          className="object-cover w-full h-64"
          priority
        />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          Lanka Ventures PLC invests in Jendo Innovations
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>October 23, 2023</span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <h2 className="text-2xl font-bold text-purple-800">A Game-Changer in Vascular Health Assessment</h2>
        <p>
          In a groundbreaking development, Lanka Ventures PLC, a prominent Sri Lankan investment firm, has announced a
          strategic investment in Jendo Innovations, a cutting-edge biomedical engineering startup based in Sri Lanka.
          Jendo Innovations has pioneered a revolutionary medical device designed to advance the early diagnosis of
          vascular diseases, and this significant investment is poised to propel their innovation into the global
          healthcare market.
        </p>

        <p>
          Jendo Innovations’ groundbreaking product, the JENDO device, has garnered widespread attention for its ability
          to analyze endothelial function, a critical indicator in the early stages of numerous cardiovascular diseases.
          By harnessing the power of non-invasive techniques such as Photoplethysmography (PPG) and Digital Thermal
          Monitoring (DTM), the device ensures a comfortable and seamless experience for patients while delivering highly
          accurate results.
        </p>

        <p>
          The device&apos;s cloud-based artificial intelligence system further amplifies its capabilities by efficiently
          processing and analyzing data. This makes it an invaluable tool for diagnosing conditions like
          atherosclerosis, nephropathy, neuropathy, and varicose veins, transforming the landscape of vascular health
          assessment.
        </p>

        <p>
          What sets Jendo Innovations apart is its pioneering diagnostics methods for vascular assessment, which has
          undergone extensive clinical testing and received patents in key markets such as the United States, Japan, and
          Sri Lanka. These patents underscore the device&apos;s uniqueness and its immense potential to revolutionize vascular
          health assessment globally.
        </p>

        <p>
          Lanka Ventures PLC, with major shareholders including Hatton National Bank and DFCC Bank, has primarily focused
          its investments in the energy and health sectors. Their decision to invest in Jendo Innovations reflects the
          firm&apos;s commitment to supporting groundbreaking innovations in healthcare technology.
        </p>

        <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-700">
          “We are excited to be a part of Jendo Innovations’ journey. Their groundbreaking technology has the potential
          to make a significant impact on global healthcare by enabling early diagnosis of vascular diseases. We believe
          in their vision and are confident that this investment will help bring their innovation to market faster.”
          <br />
          <span className="text-sm text-gray-500">— Mr. Damith Pallewatte, Chairman of Lanka Ventures PLC</span>
        </blockquote>

        <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-700">
          “We are thrilled to have Lanka Ventures as our partner. This investment will accelerate our plans to move from
          the prototype stage to production. We also aim to secure regulatory approvals in Sri Lanka, Japan, and the USA,
          bringing our groundbreaking technology to patients worldwide.”
          <br />
          <span className="text-sm text-gray-500">— Mr. Keerthi Kodithuwakku, Co-founder and CEO of Jendo Innovations</span>
        </blockquote>

        <p>
          The investment from Lanka Ventures PLC represents a pivotal moment for Jendo Innovations as they prepare to
          take their pioneering vascular health assessment technology to the global stage. With the support of this
          strategic partnership, the JENDO device is poised to become an indispensable tool in the early detection and
          management of vascular diseases, potentially saving countless lives in the process.
        </p>

        <p className="text-sm text-gray-500">
          <b>Caption:</b> Mr. Damith Pallwatte, Mr. Keerthi Kodithuwakku and Mr. Palitha Gamage at the signing and
          accepting investment to Jendo Innovations.
        </p>
      </div>
    </div>
  );
}
