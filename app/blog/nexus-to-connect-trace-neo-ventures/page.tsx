"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NexusToConnectArticle() {
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
          src="https://i.ibb.co/v6ptxVks/1770293525892.jpg"
          alt="Nexus-to-Connect session at TRACE Sri Lanka"
          width={1400}
          height={800}
          className="object-cover w-full h-72"
          priority
        />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          Nexus-to-Connect Session by Jendo Innovations at TRACE - Sri Lanka
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>2025</span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <p>
          From our Centre of Excellence in Biomedical Engineering, a program powered by Jendo Innovations, a leading
          MedTech company focused on preventing vascular diseases, we recently hosted the Nexus-to-Connect session at
          TRACE - Sri Lanka, in collaboration with Neo Ventures.
        </p>

        <p>
          The session brought together a powerful mix of intellectuals, industry veterans, clinicians, engineers, and
          innovators, all driven by one shared belief: clinical problems must translate into scalable, impactful
          healthcare innovations.
        </p>

        <p>
          We were honored to have the keynote delivered by Vidya Jothi Prof. Vajira Dissanayake, Dean - Faculty of
          Medicine - University of Colombo, whose insights strongly reinforced the need to bridge medicine,
          engineering, research and entrepreneurship.
        </p>

        <p>
          This is part of a growing collaboration with leading organizations and ecosystem partners who believe that
          meaningful innovation happens when science, systems thinking, and purpose come together.
        </p>

        <p>
          Looking forward to building a strong, values-driven MedTech community that moves beyond ideas towards real
          impact.
        </p>

        <p>
          #medtech #biomedicalengineering #HealthInnovation #clinicaltocommercial #entrepreneurship #deeptech #srilanka
          #TRACE #NeoVentures #jendoinnovations
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/Gf4pMDyz/1770293545642.jpg"
            alt="Nexus-to-Connect session image 1"
            width={1000}
            height={800}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/8nxCWJPg/1770293533073.jpg"
            alt="Nexus-to-Connect session image 2"
            width={1000}
            height={800}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/fdNGJtHy/1770293541525.jpg"
            alt="Nexus-to-Connect session image 3"
            width={1000}
            height={800}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-md">
          <Image
            src="https://i.ibb.co/YBLzFFCN/1770293526606.jpg"
            alt="Nexus-to-Connect session image 4"
            width={1000}
            height={800}
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
