"use client";

import { useEffect, useState, useRef } from "react";
import { getLatestMediaStories } from "@/actions/media";
import StoryCarousel from "./StoryCarousel";

type Story = {
  id: number;
  city: string;
  location: string;
  image_url?: string;
};

export default function LatestMediaStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for animation elements
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await getLatestMediaStories();
        if (res.success && Array.isArray(res.data)) {
          setStories(res.data as Story[]);
        }
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    // Animation logic matching professional UI standard
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-12");
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = [headerRef.current, titleRef.current, descRef.current, carouselRef.current];
    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [stories]); // Re-attach observer when data loads

  if (isLoading || stories.length === 0) return null;

  return (
    <section className="w-full bg-[#F8FAFC] py-16 md:py-24 border-y border-gray-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#0B111A]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <div 
              ref={headerRef}
              className="opacity-0 translate-y-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <h3 className="text-sm font-black text-[#0B111A] uppercase tracking-[0.25em] flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E5A93D]"></span>
                </span>
                Fresh on the Market
              </h3>
            </div>
            
            <h2 
              ref={titleRef}
              className="opacity-0 translate-y-12 transition-all duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] text-3xl md:text-5xl lg:text-6xl font-black text-[#0B111A] tracking-tighter"
            >
              Latest <span className="text-[#E5A93D]">Ad Spaces</span>
            </h2>
          </div>
          
          <p 
            ref={descRef}
            className="opacity-0 translate-y-12 transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-gray-500 font-semibold text-sm md:text-base max-w-sm md:text-right leading-relaxed"
          >
            Explore the newest and most premium hoarding locations added to our platform this week.
          </p>
        </div>
        
        <div 
          ref={carouselRef}
          className="opacity-0 translate-y-12 transition-all duration-1000 delay-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white rounded-[2rem] p-4 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-shadow"
        >
          <StoryCarousel stories={stories} />
        </div>
      </div>
    </section>
  );
}