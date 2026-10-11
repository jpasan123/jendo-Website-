import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blogs | Jendo Innovations",
  description:
    "Stories, milestones and updates from Jendo Innovations: partnerships, events, recognition and progress in AI-powered cardiovascular health.",
};

export default function BlogIndexPage() {
  return (
    <div className="bg-[#f9f9fb] min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2d0a3e] via-[#4a1260] to-[#893A9F] pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#d8b4fe]" />
            <span className="text-sm font-semibold tracking-widest text-[#d8b4fe] uppercase">Blogs</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
            Stories from the Jendo journey
          </h1>
          <p className="text-lg text-purple-100/90 max-w-2xl">
            Partnerships, events, recognition and milestones as we build AI-powered cardiovascular health technology
            from Sri Lanka.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <Link href="/" className="inline-block mb-8 text-sm font-medium text-purple-700 hover:text-purple-900">
          &larr; Back to home
        </Link>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post, i) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{ border: "1px solid #ede8f5" }}
              >
                <div className="relative h-52 overflow-hidden bg-[#f4effa]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className={`${post.fit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
                    priority={i < 3}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#893A9F] uppercase">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.date}
                  </span>
                  <h2 className="mb-3 text-lg font-bold leading-snug text-[#2d0a3e] group-hover:text-[#893A9F] transition-colors">
                    {post.title}
                  </h2>
                  <p className="mb-5 text-sm leading-relaxed text-gray-500 line-clamp-4">{post.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[#893A9F]">
                    Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
