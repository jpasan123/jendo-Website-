"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ImageSlider, { type SliderImage } from "@/components/news/ImageSlider";

const HERO_IMAGES: SliderImage[] = [
  {
    src: "https://i.ibb.co/ZpvdrdkN/1790050772196.jpg",
    alt: "Participants of the Third Meeting of the Global Initiative on AI for Health, Hangzhou, China",
    fit: "cover",
  },
  {
    src: "https://i.ibb.co/MxkQ8jd9/1790050770546.jpg",
    alt: "Jendo Innovations at the Third Meeting of the WHO Global Initiative on AI for Health, Hangzhou",
    fit: "cover",
  },
  {
    src: "https://i.ibb.co/Y7tkqg88/1789903003286.jpg",
    alt: "Jendo's vascular health technology presented at the GI-AI4H meeting in Hangzhou",
    fit: "cover",
  },
];

const BODY_PHOTOS = {
  venue: {
    src: "https://i.ibb.co/vCz7b2rC/1789903000363.jpg",
    alt: "Third Meeting of the Global Initiative on AI for Health, Hangzhou, China",
    caption: "The Third Meeting of the Global Initiative on AI for Health, Hangzhou, China.",
  },
  speaker: {
    src: "https://i.ibb.co/dJXg2KKv/1790050761875.jpg",
    alt: "Keerthi Kodithuwakku speaking at the GI-AI4H meeting",
    caption: "Keerthi Kodithuwakku, Chairman and CEO of Jendo Innovations, at the meeting.",
  },
  team: {
    src: "https://i.ibb.co/4wn9d0yQ/1789903002098.jpg",
    alt: "Jendo Innovations team with delegates in Hangzhou",
    caption: "Jendo Innovations with delegates in Hangzhou.",
  },
};

function BodyPhoto({ photo }: { photo: { src: string; alt: string; caption: string } }) {
  return (
    <figure className="not-prose my-8">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={1280}
          height={720}
          sizes="(max-width:768px) 100vw, 768px"
          className="w-full h-auto"
        />
      </div>
      <figcaption className="mt-2 text-center text-sm text-gray-500">{photo.caption}</figcaption>
    </figure>
  );
}

const LINKS = [
  {
    label: "WHO — Third Meeting of the Global Initiative on AI for Health",
    href: "https://www.who.int/news-room/events/detail/2026/09/16/default-calendar/third-meeting-of-the-global-initiative-on-ai-for-health",
  },
  {
    label: "WIPO — Global Initiative on AI for Health",
    href: "https://www.wipo.int/en/web/wipo-and-ai/global-initiative-on-ai-for-health",
  },
];

export default function WhoGiAi4hHangzhouArticle() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
      <Link
        href="/#blog"
        className="mb-6 sm:mb-8 inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to News
      </Link>

      <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl bg-white aspect-video">
        <ImageSlider images={HERO_IMAGES} intervalMs={6500} sizes="(max-width:768px) 100vw, 768px" priority />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-900 mb-3 leading-tight">
          Jendo Innovations Shares Its AI Health Journey at the WHO Global Initiative on AI for Health in Hangzhou
        </h1>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>16&ndash;18 September 2026</span>
        </div>
      </div>

      <div className="article-content prose prose-slate sm:prose-lg mx-auto prose-headings:text-purple-800 break-words">
        <p>
          <b>Jendo Innovations</b> was represented at the <b>Third Meeting of the Global Initiative on AI for Health
          (GI-AI4H)</b>, held in Hangzhou, China, from 16&ndash;18 September 2026, bringing Sri Lanka&rsquo;s perspective
          on AI-enabled medical innovation to an important global platform.
        </p>
        <p>
          The Global Initiative on AI for Health is convened by the <b>World Health Organization (WHO)</b>, the{" "}
          <b>International Telecommunication Union (ITU)</b> and the <b>World Intellectual Property Organization
          (WIPO)</b>. It brings together policymakers, regulators, clinicians, researchers, technology developers and
          industry leaders working to advance the responsible and effective use of artificial intelligence in
          healthcare.
        </p>

        <BodyPhoto photo={BODY_PHOTOS.venue} />

        <h2>Presenting the Jendo Journey</h2>
        <p>
          <b>Keerthi Kodithuwakku</b>, Chairman and CEO of Jendo Innovations Inc., took part as an invited speaker and
          presented the Jendo journey: building an AI-enabled medical technology in Sri Lanka and taking it from
          research and early product development toward clinical validation, intellectual property protection,
          regulatory advancement and international commercialization.
        </p>
        <BodyPhoto photo={BODY_PHOTOS.speaker} />

        <p>
          The presentation highlighted Jendo&rsquo;s experience in developing its non-invasive vascular health
          technology, and showed how innovation from an emerging economy can move through the complex pathway needed to
          become a globally relevant medical technology.
        </p>
        <p>
          It also opened a discussion on an important dimension of AI healthcare innovation: the relationship between
          scientific research, intellectual property, clinical evidence, regulation and commercialization. For deep
          science and medical technology companies, success takes much more than an algorithm or a prototype.
          Technologies must demonstrate clinical relevance, safety, responsible use of AI and regulatory compliance,
          and must work effectively within real healthcare systems.
        </p>

        <h2>Working-Group Contributions</h2>
        <p>
          Keerthi Kodithuwakku also contributes to the WHO Global Initiative on AI for Health through its working-group
          activities, taking part in international discussions on the evaluation, governance and responsible adoption of
          AI-enabled healthcare technologies.
        </p>
        <p>
          <b>Dr. Dhanushi Hettiarachchi</b>, medical doctor, HealthTech entrepreneur and Chief Medical Officer at Jendo
          Innovations, also joined the Hangzhou meeting as a GI-AI4H working-group member. Her contribution brings
          together perspectives from clinical medicine, public health, artificial intelligence and healthcare
          innovation, with a particular interest in ensuring that AI technologies can be responsibly implemented in
          real-world health systems.
        </p>

        <h2>Sri Lankan Voices in the Global AI Health Conversation</h2>
        <p>
          Having Sri Lankan innovators take an active part in these global discussions is an important development for
          the country&rsquo;s growing HealthTech ecosystem. Emerging economies face particular challenges in adopting AI
          in healthcare, including limited digital infrastructure, access to representative clinical data, regulatory
          capacity, interoperability, financing and equitable access to new technologies. At the same time, they offer
          significant opportunities for innovation that can address healthcare needs at scale.
        </p>
        <p>
          The Hangzhou meeting provided a platform for international collaboration and knowledge exchange around these
          challenges. Discussions focused on how AI innovations can move beyond research and pilot projects toward
          sustainable implementation, supported by appropriate governance, standards, clinical evaluation, regulatory
          frameworks and collaboration between public and private stakeholders.
        </p>

        <BodyPhoto photo={BODY_PHOTOS.team} />

        <h2>The Journey Continues</h2>
        <p>
          For Jendo Innovations, taking part in the Global Initiative on AI for Health is another step in a journey that
          began with biomedical research in Sri Lanka and has grown into international clinical, regulatory and
          commercial engagement. The company continues to develop its AI-enabled vascular health technology, with the
          broader goal of supporting earlier identification of vascular dysfunction and enabling more preventive
          approaches to cardiovascular health.
        </p>
        <p>
          As AI becomes part of clinical decision-making and healthcare delivery, Jendo remains committed to technologies
          grounded in scientific evidence, clinical relevance, responsible AI and strong intellectual property, while
          contributing Sri Lankan experience and expertise to the global conversation on the future of AI in health.
        </p>
        <p>
          <b>From Sri Lanka to the global AI health community, Jendo Innovations continues its journey of building
          locally developed science into healthcare technologies with global relevance.</b>
        </p>

        <div className="not-prose mt-8 space-y-3">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 font-semibold text-purple-700 hover:text-purple-900 hover:underline"
            >
              <ExternalLink className="w-4 h-4 mt-1 shrink-0" />
              <span>{l.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
