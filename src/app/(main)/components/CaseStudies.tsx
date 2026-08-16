"use client";

import { useRef } from "react";
import { ChevronRight, ChevronLeft, ArrowRightCircle } from "lucide-react";
import Link from "next/link";

export default function CaseStudies() {
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

  const caseStudies = [
    {
      id: 1,
      brand: "MOVADO",
      title: "Dissecting Movado's Awareness & Consideration Marketing Campaign",
    },
    {
      id: 2,
      brand: "POPEYES",
      title: "Dissecting Popeyes Influencer Marketing Campaign",
    },
    {
      id: 3,
      brand: "Nepa Rudraksha",
      title: "Dissecting Nepa Rudraksha Influencer Marketing Campaign",
    },
    {
      id: 4,
      brand: "Brand Name",
      title: "Lead Generation Performance Campaign Success Story",
    },
  ];

  return (
    <section className="max-w-[1600px] mx-auto px-4 py-8 md:py-12 w-full relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#243839]">
          Case Studies
        </h2>
        <Link
          href="/case-studies"
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
          {caseStudies.map((study) => (
            <Link
              href={`/case-study/${study.id}`}
              key={study.id}
              className="min-w-[280px] md:min-w-[380px] flex-shrink-0 cursor-pointer group/card flex flex-col gap-3"
            >
              <div className="w-full h-[160px] md:h-[200px] bg-[#0A4D28] rounded-xl relative flex items-center justify-center overflow-hidden border border-[#0A4D28]/80 group-hover/card:shadow-[0_8px_20px_rgba(10,77,40,0.15)] group-hover/card:-translate-y-1 transition-all duration-300">

                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-4 right-8 w-32 h-[2px] bg-white rotate-45"></div>
                  <div className="absolute bottom-8 left-12 w-40 h-[2px] bg-white -rotate-12"></div>
                  <div className="absolute top-1/2 right-1/4 w-48 h-[2px] bg-white rotate-[15deg]"></div>
                  <div className="absolute bottom-4 right-4 w-0 h-0 border-l-[40px] border-l-transparent border-b-[60px] border-b-white/40 border-r-[40px] border-r-transparent"></div>
                </div>

                <div className="absolute top-4 left-4 flex flex-col leading-none">
                  <span className="text-[10px] md:text-[11px] font-black text-white tracking-widest">BM</span>
                  <span className="text-[10px] md:text-[11px] font-black text-[#C58B24] tracking-widest">AS</span>
                </div>

                <div className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-full flex items-center justify-center shadow-lg z-10 p-2 text-center group-hover/card:scale-105 transition-transform duration-300 border-4 border-white/10 bg-clip-padding">
                  <span className="font-extrabold text-[#243839] text-[16px] md:text-[22px] leading-tight px-2">
                    {study.brand}
                  </span>
                </div>
                
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1px] bg-[#C58B24]/30 z-0"></div>
              </div>
              
              <h3 className="font-bold text-[#243839] text-[14px] md:text-[15px] leading-snug group-hover/card:text-[#0A4D28] transition-colors mt-1 pr-4 px-1">
                {study.title}
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