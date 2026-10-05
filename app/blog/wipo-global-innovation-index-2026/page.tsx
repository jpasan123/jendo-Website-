"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ImageSlider, { type SliderImage } from "@/components/news/ImageSlider";

const GII_URL =
  "https://www.wipo.int/web-publications/global-innovation-index-2026/en/gii-2026-at-a-glance.html";

const HERO_IMAGES: SliderImage[] = [
  {
    src: "https://i.ibb.co/m501bTRT/Global-Innovation-Index-2026-Invitation.png",
    alt: "WIPO Global Innovation Index 2026 — Powering entrepreneurs at the frontier of science",
    fit: "contain",
  },
  {
    src: "https://i.ibb.co/V7F7kBz/Whats-App-Image-2026-10-05-at-10-19-27.jpg",
    alt: "Jendo Innovations listed in the WIPO table of top deep-science patent holders",
    fit: "cover",
    position: "center 52%",
  },
];

export default function WipoGlobalInnovationIndexArticle() {
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
          Jendo Innovations Featured Among 20 Deep-Science Patent Holders in WIPO Global Innovation Index 2026
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-4">
          Sri Lankan MedTech company recognized in WIPO&rsquo;s global deep-science landscape
        </p>
        <div className="flex items-center gap-3 justify-center text-gray-500 text-sm">
          <span>By Jendo Team</span>
          <span className="w-1 h-1 bg-purple-400 rounded-full" />
          <span>October 2026</span>
        </div>
      </div>

      <div className="article-content prose prose-slate sm:prose-lg mx-auto prose-headings:text-purple-800 prose-img:rounded-xl break-words">
        <p>
          <b>Jendo Innovations Inc.</b> has been featured in the World Intellectual Property Organization (WIPO)
          <b> Global Innovation Index 2026</b>, marking an important milestone for the company and for Sri
          Lanka&rsquo;s growing deep-science and MedTech ecosystem.
        </p>
        <p>
          In the 2026 report, WIPO lists Jendo in its table{" "}
          <i>&ldquo;The top deep science patent holders in middle-income economies, by economy, 2010&ndash;2025.&rdquo;</i>{" "}
          Jendo is one of only <b>20 companies</b> in this global table and represents Sri Lanka in the
          <b> Medical Devices and Digital Health</b> sector.
        </p>

        <div className="not-prose my-8 rounded-2xl overflow-hidden shadow-xl bg-white flex justify-center">
          <Image
            src="https://i.ibb.co/XZ2VtmNW/Whats-App-Image-2026-10-05-at-10-19-27-1.jpg"
            alt="WIPO table: the top deep science patent holders in middle-income economies, 2010–2025"
            width={346}
            height={639}
            className="object-contain h-auto w-full max-w-sm"
          />
        </div>

        <p>
          The list brings together deep-science innovators from economies including China, Malaysia, India, Brazil,
          South Africa, T&uuml;rkiye, Egypt, Indonesia, Thailand and Mexico, highlighting how science-based companies
          from emerging economies are building protected intellectual property and turning research into commercially
          relevant technologies.
        </p>

        <h2>What is the Global Innovation Index?</h2>
        <p>
          Published annually by WIPO, the Global Innovation Index is one of the world&rsquo;s leading references for
          understanding innovation performance and ecosystems. The 2026 edition focuses on deep-science
          entrepreneurship under the theme <b>&ldquo;Powering entrepreneurs at the frontier of science: Turning pilots
          into pipelines.&rdquo;</b>
        </p>
        <p>
          WIPO reports that more than 30,000 deep-science startups have been created globally since 2000, and that
          they are now collectively valued at approximately <b>USD 7.6 trillion</b>.
        </p>

        <h2>Why Jendo&rsquo;s Inclusion Matters</h2>
        <p>
          Patents play a central role in deep-science commercialization. According to WIPO, around <b>50%</b> of
          deep-science startups hold patents, compared with only 15.4% of other startups, and Medical Devices and
          Digital Health is the most patent-intensive deep-science sector. Because these companies often need years of
          R&amp;D before reaching the market, patents become key assets for investment, partnerships, licensing and
          international expansion. For Jendo, intellectual property protection has been part of the strategy from the
          earliest stages of development.
        </p>

        <h2>From Sri Lankan Research to Global Recognition</h2>
        <p>
          Jendo&rsquo;s journey began with a fundamental healthcare question: can vascular dysfunction be identified
          early enough to support preventive cardiovascular care? The company went on to develop a non-invasive
          vascular health screening technology that combines biomedical sensing, signal processing, artificial
          intelligence and data analytics. It assesses vascular endothelial function from physiological signals
          collected at a patient&rsquo;s fingertip, helping identify abnormalities associated with cardiovascular risk.
        </p>
        <p>
          WIPO has previously highlighted Jendo&rsquo;s journey and its patented cardiovascular screening technology on
          its Global Health and IP Advantage platforms.
        </p>

        <h2>One of 20 Companies Highlighted by WIPO</h2>
        <p>
          The GII 2026 table includes 20 companies from 20 middle-income economies, among them Changxin Memory
          Technologies (China), Lemonex (Malaysia), Qure.AI (India), HiLab (Brazil), LIQID Medical (South Africa),
          Mogassam (Egypt), Octavia Carbon (Kenya) and <b>Jendo Innovations (Sri Lanka)</b>. Being listed alongside
          them shows what is possible when research, engineering, clinical science and intellectual property are
          developed with a long-term vision.
        </p>

        <h2>More Than a Recognition</h2>
        <p>
          This milestone reflects more than a decade of research, biomedical engineering, clinical validation,
          intellectual property development and regulatory work, and the collective contribution of researchers,
          engineers, doctors, universities, team members, investors, mentors, institutions, partners and families.
        </p>
        <p>
          Sri Lanka has the scientific and engineering talent to build more globally relevant deep-science companies.
          The challenge now is to create the research infrastructure, investment pathways, IP strategies, regulatory
          frameworks and entrepreneurial ecosystem to build many more.
        </p>
        <p>
          <b>For Jendo, this recognition is another milestone, not the destination.</b> We will continue building the
          next chapter of Sri Lankan deep-science innovation and taking locally developed healthcare technology to
          the world.
        </p>

        <p className="not-prose mt-8">
          <a
            href={GII_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-purple-700 hover:text-purple-900 hover:underline"
          >
            Read the WIPO Global Innovation Index 2026 <ExternalLink className="w-4 h-4" />
          </a>
        </p>
      </div>
    </div>
  );
}
