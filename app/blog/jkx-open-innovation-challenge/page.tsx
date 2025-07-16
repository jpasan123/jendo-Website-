"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function JkxOpenInnovationChallenge() {
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
          src="https://i.ibb.co/m5vqfsLm/277253930-4924701910944785-4382205761829635155-n.jpg"
          alt="JKX Open Innovation Challenge Grand Finale"
          width={800}
          height={400}
          className="object-cover w-full h-64"
        />
      </div>
      {/* Title & Meta */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          🎉 John Keells X Open Innovation Challenge – Grand Finale Recap
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By JKX Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>November 2, 2023</span>
        </div>
      </div>
      {/* Blog Content */}
      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <p>
          This Wednesday marked the grand finale of the <b>John Keells X (JKX) Open Innovation Challenge</b>, a first-of-its-kind initiative by John Keells Holdings PLC to spark innovation and support Sri Lanka’s startup ecosystem. After months of rigorous development and mentorship, ten exceptional teams took center stage to pitch their ideas, aiming to secure seed funding and industry recognition.
        </p>
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 my-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-purple-700 mb-2">Quick Summary</h2>
          <ul className="list-disc pl-6 text-base">
            <li>🔍 <b>148 teams</b> applied; <b>10 finalists</b> were selected</li>
            <li>⏳ Teams had <b>60 days</b> to develop their startups with mentorship</li>
            <li>🎤 Final event: <b>November 2</b></li>
            <li>🥇 <b>Winner</b>: Jendo – noninvasive cardiovascular health platform (Rs. 2 million)</li>
            <li>🥈 <b>Runner-up</b>: Markify – voice-driven analytics (Rs. 1 million)</li>
            <li>💼 Judges from JKH, Dialog Axiata, and HNB</li>
            <li>🤝 Supported by <b>SLASSCOM</b>, <b>ICTA</b>, <b>Ceylon Chamber of Commerce</b>, and <b>Roar.lk</b></li>
          </ul>
        </div>
        <h2>🚀 About the Challenge</h2>
        <p>
          The JKX Challenge was designed to empower startups with disruptive business models, offering them mentorship, funding, and industry exposure. The competition drew <b>148 applicants</b> from Sri Lanka and abroad, of which <b>10 teams</b> were shortlisted for a 60-day acceleration program.
        </p>
        <ul>
          <li>Dedicated mentors from the John Keells Group and relevant industries</li>
          <li>Weekly feedback sessions</li>
          <li>Access to subject-matter experts from sectors such as <b>tourism</b>, <b>retail</b>, <b>finance</b>, and <b>tech</b></li>
        </ul>
        <h2>🧠 The Grand Finale – November 2</h2>
        <p>
          The final pitch event, held on <b>November 2</b>, was the culmination of <b>four months</b> of hard work and collaboration. Finalists had:
        </p>
        <ul>
          <li>15 minutes for their pitch and product demo</li>
          <li>5 minutes of Q&amp;A with a prestigious judging panel</li>
        </ul>
        <p>
          The judging panel featured a distinguished lineup including:
        </p>
        <ul>
          <li><b>Dr. Hans Wijesuriya</b> – Group CEO, Dialog Axiata PLC</li>
          <li><b>Jonathan Alles</b> – MD &amp; CEO, Hatton National Bank PLC</li>
          <li>Senior executives from <b>John Keells Holdings PLC</b> including Ajit Gunewardene, Ronnie Peiris, Krishan Balendra, Gihan Cooray, and Ramesh Shanmuganathan</li>
        </ul>
        <h2>💡 The Finalist Teams &amp; Their Innovations</h2>
        <ol>
          <li><b>Jendo</b> <i>(Winner – Rs. 2 million)</i>: A noninvasive cardiovascular health monitoring system using pulse oximetry. Data is stored in the cloud for easy access across clinics and users.</li>
          <li><b>Markify</b> <i>(Runner-up – Rs. 1 million)</i>: A voice-controlled SaaS platform for business analytics, enabling natural language data searches and visualization.</li>
          <li><b>Inzurely</b>: An online insurance aggregator connecting users with the best insurance quotes submitted by agents.</li>
          <li><b>NicNac</b>: An AI-powered on-demand “e-butler” service that allows users to request any item and have it delivered via bike couriers.</li>
          <li><b>Acrux</b>: Travel Sphere – a virtual reality app that lets users explore destinations before visiting, powered by crowdsourced panoramic content.</li>
          <li><b>Kart</b>: A smart supermarket navigation app that plans efficient shopping routes and provides real-time loyalty options.</li>
          <li><b>Onsbay</b>: A marketplace to connect homeowners with skilled service professionals for home maintenance and repairs.</li>
          <li><b>Synergen</b>: A gesture-controlled smart ring for managing devices like computers and phones via Bluetooth.</li>
          <li><b>BotFactory</b>: AI bots that automatically reply to routine emails using deep learning to fetch relevant information from previous conversations.</li>
          <li><b>Grubz</b>: A restaurant discovery app offering real-time deals based on a user’s GPS location.</li>
        </ol>
        <h2>🏆 And the Winners Are...</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-yellow-700 mb-2">🥇 Team Jendo – Grand Prize Winner</h3>
          <p>
            Co-founded by <b>Keerthi Kodithuwakku</b>, <b>Isuru Rajakaruna</b>, and <b>Charith Vithanage</b>, Team Jendo took the top prize for their breakthrough in noninvasive health tech. Their research was guided by senior medical professionals, and they walked away with a <b>Rs. 2 million</b> prize and the admiration of the judges.
          </p>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-2">🥈 Team Markify – Runner-up</h3>
          <p>
            For their impressive use of speech-to-insight tech in business analytics, Markify won <b>Rs. 1 million</b> and high praise from the judges for their innovation and real-world applicability.
          </p>
        </div>
        <h2>📷 Highlights</h2>
        <div className="grid grid-cols-1 gap-6 my-6">
          <Image src="https://i.ibb.co/ns7r2RNC/Screenshot-2024-10-26-082843.png" alt="Team Jendo with JKH Leadership" width={800} height={400} className="rounded-xl shadow-lg" />
          <Image src="https://i.ibb.co/20x0pzsZ/Whats-App-Image-2025-01-15-at-19-56-35-3b4cc881.jpg" alt="Team Markify with JKH Leadership" width={800} height={400} className="rounded-xl shadow-lg" />
          <Image src="https://i.ibb.co/F4xjVVy5/Whats-App-Image-2025-01-15-at-19-58-15-514a1467.jpg" alt="Finalists with John Keells Board Members" width={800} height={400} className="rounded-xl shadow-lg" />
        </div>
        <h2>🌱 The Bigger Picture</h2>
        <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-700 my-6">
          “We are encouraged by the pool of young entrepreneurial talent we witnessed during the four-month engagement with John Keells X. We look forward to continuing to support the Sri Lankan startup ecosystem by incentivising and investing in young entrepreneurs.”
          <br />
          <span className="text-sm text-gray-500">— Chairman Susantha Ratnayake</span>
        </blockquote>
        <h2>✨ Final Thoughts</h2>
        <p>
          The JKX Open Innovation Challenge has proven to be more than just a competition — it’s a launching pad for Sri Lanka’s next generation of tech-driven entrepreneurs. With impressive ideas, professional execution, and real-world relevance, the teams showcased the immense potential in the island nation’s innovation landscape.
        </p>
        <p>
          Here’s to more bold ideas, better solutions, and a thriving startup ecosystem in Sri Lanka. 💡🌍
        </p>
      </div>
    </div>
  );
}