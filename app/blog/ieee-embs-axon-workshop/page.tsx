"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function IeeeEmbsAxonWorkshop() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to News
      </button>
      {/* Header Image */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
        <Image
          src="https://i.ibb.co/Zb72PxJ/IEEE-2.png"
          alt="Jendo CEO at IEEE EMBS AXON Workshop"
          width={800}
          height={400}
          className="object-cover w-full h-64"
        />
      </div>
      {/* Title & Meta */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          🌐 Jendo CEO Shares Vision for AI-Driven Healthcare Innovation at IEEE EMBS AXON Workshop
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By IEEE EMBS</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>April 12, 2024</span>
        </div>
      </div>
      {/* Blog Content */}
      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <p>
          We are proud to announce a significant milestone in Jendo’s journey of innovation. Our CEO,{" "}
          <b>Mr. Keerthi Kodithuwakku</b>, was honored as a <b>distinguished guest speaker</b> at the prestigious{" "}
          <b>IEEE EMBS AXON Workshop</b>—a global gathering of the brightest minds in biomedical engineering and healthcare technology.
        </p>
        <p>
          This recognition by the <b>IEEE Engineering in Medicine & Biology Society (EMBS)</b> is a testament to Jendo’s growing impact in the international health-tech space and a celebration of our continued mission to revolutionize cardiovascular healthcare through AI-driven innovation.
        </p>
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 my-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-purple-700 mb-2">Quick Highlights</h2>
          <ul className="list-disc pl-6 text-base">
            <li>🎤 CEO Mr. Keerthi Kodithuwakku invited as a distinguished guest speaker</li>
            <li>🌍 Jendo’s AI-powered vascular health monitoring showcased globally</li>
            <li>🤝 New international collaborations and partnerships initiated</li>
            <li>🏆 Recognition by IEEE EMBS for innovation in preventive healthcare</li>
          </ul>
        </div>
        <h2>🎤 Speaking at the Forefront of Biomedical Innovation</h2><br></br>
        <p>
          The <b>IEEE EMBS AXON Workshop</b>, supported by the <b>Major Project Initiative Fund</b>, convened top-tier innovators, researchers, and healthcare leaders from around the world. This exclusive forum served as a vibrant stage for exchanging ideas on the future of healthcare technology.
        </p>
        <p>
          As a guest speaker, Mr. Kodithuwakku shared Jendo’s inspiring journey and breakthrough work in <b>non-invasive, AI-based vascular health monitoring systems</b>. His presentation focused on:
        </p>
        <ul>
          <li>How AI is transforming preventive cardiovascular care</li>
          <li>The importance of early detection and accessibility in healthcare</li>
          <li>Jendo’s vision of creating scalable, affordable health solutions</li>
        </ul>
        <h2>🌍 Global Recognition for Local Innovation</h2>
        <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-700 my-6">
          “The recognition from IEEE EMBS reinforces our belief that accessible, preventive healthcare powered by AI is not just the future—it’s a global need we can fulfill.”
          <br />
          <span className="text-sm text-gray-500">— Keerthi Kodithuwakku, CEO, Jendo</span>
        </blockquote>
        <h2>🔬 Driving the Future of Healthcare Innovation</h2><br></br>
        <p>
          The AXON workshop focused on <b>transformative technologies</b> shaping modern healthcare. For Jendo, this aligns perfectly with our purpose: to <b>democratize cardiovascular health monitoring</b> through intelligent, non-invasive tools.
        </p>
        <ul>
          <li>AI’s role in data-driven diagnostics</li>
          <li>Cloud-based health ecosystems</li>
          <li>Cross-border collaboration in medical tech development</li>
        </ul>
        <h2>🤝 Building Global Bridges in Health-Tech</h2><br></br>
        <p>
          Beyond the keynote, Mr. Kodithuwakku engaged in vibrant conversations with <b>industry pioneers, academic researchers, and med-tech entrepreneurs</b>. These interactions opened doors for future international collaborations, R&amp;D partnerships, and scaling Jendo’s solutions globally.
        </p><br></br>
        <h2>📈 Looking Ahead: Shaping the Future of Preventive Healthcare</h2><br></br>
        <p>
          This opportunity at <b>IEEE EMBS AXON</b> marks another defining chapter in Jendo’s vision to lead the next generation of AI-powered healthcare. As we move forward, we remain committed to innovating at the intersection of AI and medicine, creating solutions that save lives through early intervention, and partnering with global thought leaders to scale impact.
        </p>
        <p>
          We extend our heartfelt thanks to <b>IEEE EMBS</b> for this incredible platform and their continued support in spotlighting innovation that matters.
        </p><br></br>
        <h2>🌟 Stay Connected with Jendo</h2><br></br>
        <p>
          Join us as we continue pushing the boundaries of biomedical engineering and making healthcare smarter, simpler, and more inclusive.
        </p>
        <ul>
          <li>➡️ Follow our journey</li>
          <li>➡️ Engage with us on LinkedIn / Twitter / Medium</li>
          <li>
            ➡️ Learn more at{" "}
            <a href="https://jendohealth.com" className="text-purple-700 underline">
              jendohealth.com
            </a>
          </li>
        </ul>
        <p>
          <b>Together, let’s shape a future where advanced cardiovascular monitoring is accessible to everyone—everywhere.</b>
        </p>
      </div>
    </div>
  );
}