"use client";

import { useRef } from "react";
import { ChevronRight, ChevronLeft, ArrowRightCircle, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function PopularBlogPosts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const blogPosts = [
    {
      id: 1,
      title: "How IPL Sponsorships Boost Searches: Real Success Stories from 2024",
    },
    {
      id: 2,
      title: "IPL 2025 Advertising on JioHotstar & Star Sports: A Complete Guide",
    },
    {
      id: 3,
      title: "BookmyadSpace's Blueprint for Effective Media Planning and Campaign Execution",
    },
    {
      id: 4,
      title: "The New Disney-Reliance Merger: What it Means for Advertisers in India",
    },
    {
      id: 5,
      title: "Top 10 Outdoor Advertising Trends to Watch Out For This Festive Season",
    },
  ];

  return (
    <section className="max-w-[1600px] bg-white mx-auto px-4 py-8 md:py-12 w-full relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#243839]">
          Popular Blog Posts
        </h2>
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-[#C58B24] hover:text-[#0A4D28] transition-colors font-semibold text-sm md:text-[15px]"
        >
          View All <ArrowRightCircle className="w-5 h-5" strokeWidth={2} />
        </Link>
      </div>

      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="absolute left-2 md:left-4 top-[40%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_2px_15px_rgb(0,0,0,0.1)] flex items-center justify-center z-20 hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex text-gray-400 hover:text-[#0A4D28] hover:border-[#0A4D28]/20 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 px-2 pt-2"
        >
          {blogPosts.map((post) => (
            <Link
              href={`/blog/${post.id}`}
              key={post.id}
              className="min-w-[280px] md:min-w-[380px] flex-shrink-0 cursor-pointer group/card flex flex-col gap-3"
            >
              <div className="w-full h-[160px] md:h-[200px] bg-gray-50 rounded-xl relative flex items-center justify-center overflow-hidden border border-gray-100 group-hover/card:shadow-[0_8px_20px_rgba(10,77,40,0.08)] group-hover/card:-translate-y-1 group-hover/card:border-[#C58B24]/40 transition-all duration-300 group-hover/card:bg-[#0A4D28]/5">
                <ImageIcon className="w-10 h-10 text-gray-300 group-hover/card:text-[#0A4D28]/40 transition-colors duration-300" />
                <span className="absolute bottom-3 text-xs text-gray-400 font-medium group-hover/card:text-[#0A4D28]/60 transition-colors duration-300">
                  Blog Image Placeholder
                </span>
              </div>
              <h3 className="font-bold text-[#243839] text-[15px] md:text-[16px] leading-snug group-hover/card:text-[#0A4D28] transition-colors px-1">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-2 md:right-4 top-[40%] -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_2px_15px_rgb(0,0,0,0.1)] flex items-center justify-center z-20 hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex text-gray-400 hover:text-[#0A4D28] hover:border-[#0A4D28]/20 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}