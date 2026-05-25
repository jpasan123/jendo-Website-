"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function JendoPatentsArticle() {
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
      <div className="mb-10 rounded-2xl overflow-hidden shadow-xl flex justify-center">
        <Image
          src="https://i.ibb.co/g85CZcp/unnamed-1.png"
          alt="Jendo Patent"
          width={400}
          height={400}
          className="object-contain rounded-2xl"
        />
      </div>
      {/* Article Content */}
      <div className="article-content prose prose-slate prose-lg mx-auto prose-headings:text-purple-800 space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-purple-900 mb-2">
            Global Recognition for Innovation in Vascular Health
          </h1>
          <p>
            At <b>Jendo</b>, innovation fuels our mission to reshape the future of cardiovascular care. Through relentless research and breakthrough development, our team has created a non-invasive vascular health monitoring solution that is transforming the landscape of preventive medicine.
          </p>
          <p>
            We’re proud to share that our technology has received <b>prestigious patent recognition</b> in the following countries:
          </p>
        </div>
        <hr />
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-purple-800">United States Patent</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><b>Issued By</b>: U.S. Patent and Trademark Office</li>
            <li><b>Significance</b>: Validates the originality and strength of our innovation in one of the most rigorous and respected global markets.</li>
          </ul>
          <p className="italic text-purple-700 mt-2">A symbol of trust and innovation at the heart of global medtech.</p>
        </div>
        <hr />
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-purple-800">Japan Patent</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><b>Issued By</b>: Japan Patent Office</li>
            <li><b>Significance</b>: Reflects compliance with Japan’s high standards of precision and innovation, and confirms our position as a leader in cutting-edge healthcare technology.</li>
          </ul>
          <p className="italic text-purple-700 mt-2">A proud achievement in the world’s epicenter of technological excellence.</p>
        </div>
        <hr />
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-purple-800">Sri Lanka Patent</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><b>Issued By</b>: National Intellectual Property Office of Sri Lanka</li>
            <li><b>Significance</b>: Endorses our expanding impact across Asia and affirms our technology's relevance in developing healthcare ecosystems.</li>
          </ul>
          <p className="italic text-purple-700 mt-2">Empowering preventive care where it matters most.</p>
        </div>
        <hr />
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-purple-800">Why This Matters</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><b>Global Validation</b> of our proprietary solution</li>
            <li><b>Recognition of Clinical Relevance</b> in real-world applications</li>
            <li><b>Trust in Our Mission</b> to revolutionize cardiovascular diagnostics</li>
          </ul>
        </div>
        <hr />
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-purple-800">Innovation. Protection. Impact.</h2>
          <p>
            With every new country that recognizes our work, Jendo strengthens its mission to deliver accessible, accurate, and non-invasive health monitoring solutions. We’re building a healthier world—<b>one heartbeat, one breakthrough, and one patent at a time.</b>
          </p>
        </div>
      </div>
    </div>
  );
}