"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function JendoPoliceHealthCampArticle() {
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
          src="https://i.ibb.co/WvtJW21S/Whats-App-Image-2025-07-14-at-13-51-07-d33c7810.jpg"
          alt="Sri Lankan police officers participating in the Jendo Health Camp"
          width={1200}
          height={675}
          className="object-cover w-full h-64"
          priority
        />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          Sri Lankan Innovation Meets Public Service: The Jendo Health Camp
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>July 14, 2025</span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-800 mx-auto">
        <p>
          When we see police officers on duty, we rarely consider how the stress and demands of their roles impact their
          heart health. This invisible issue has silently affected thousands of Sri Lankan officers. Thanks to Jendo,
          it is finally being brought to light.
        </p>

        <h2>When Innovation Meets Public Service</h2>
        <p>
          The recent police health screening event marked a milestone for Sri Lanka, blending senior leadership with
          cutting-edge technology to tackle a vital health issue. With the presence of Inspector General of Police
          Mr. Priyantha Weerasooriya, the event showcased how Jendo is revolutionizing early risk detection through
          AI-powered innovation.
        </p>
        <p>
          This pioneering initiative introduced first-of-its-kind healthcare technology in Sri Lanka, bringing advanced,
          proactive care directly to those who serve on the front lines of public safety.
        </p>

        <h2>The Game-Changer: 16 Minutes That Could Save Lives</h2>
        <p>
          This was not a routine checkup. Jendo's 16-minute vascular assessment provides insights into cardiovascular
          health long before symptoms emerge. What usually takes multiple appointments and invasive testing can now be
          done in a single, quick, non-invasive session.
        </p>
        <p>
          With over 100 police officers undergoing Jendo's vascular screenings, the program moved far beyond a small
          pilot. It became a landmark health initiative showcasing the real-world potential of Sri Lankan innovation.
          One by one, officers participated in the screening, taking proactive steps toward long-term heart health.
        </p>
        <p>
          The large turnout reflects both trust in Jendo's technology and growing awareness of the unique health risks
          faced by law enforcement officers. Coordinating such a large-scale effort for a high-demand profession further
          underlines the importance and impact of the initiative.
        </p>

        <h2>Proudly Sri Lankan, Globally Validated</h2>
        <p>
          The Jendo screening device is the result of years of research and collaboration between healthcare experts and
          engineers. Their work has led to clinically validated, patent-protected technology, now recognized in
          international markets including the United States, Japan, and Sri Lanka.
        </p>

        <h2>A Heartfelt Thank You</h2>
        <p>
          Jendo extends its deepest gratitude to all officers who took part. Amid demanding schedules, they made time
          to prioritize their health and support local innovation. Their trust and participation were central to the
          event's success.
        </p>

        <h2>Looking Ahead</h2>
        <p>
          Jendo remains committed to making early detection and preventive healthcare accessible to all Sri Lankans.
          This health camp was not just a one-time event. It was a powerful demonstration of what is possible when Sri
          Lankan innovation meets meaningful public service.
        </p>
        <p>
          As Jendo continues to grow, its mission is clear: to deliver AI-powered, compassionate, and accessible
          healthcare that empowers people to take control of their well-being before symptoms ever appear. Because
          healthcare should be a right, not a luxury.
        </p>
        <p>This is just the beginning.</p>
      </div>
    </div>
  );
}
