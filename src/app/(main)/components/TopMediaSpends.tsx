"use client";

import { useRef } from "react";
import { ChevronRight, ChevronLeft, Image as ImageIcon } from "lucide-react";

export default function TopMediaSpends() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const mediaItems = [
    { id: 1, rank: 1, title: "Jio Hotstar", category: "Digital" },
    { id: 2, rank: 2, title: "Mumbai Airport", category: "Airport" },
    { id: 3, rank: 3, title: "Youtube", category: "Digital" },
    { id: 4, rank: 4, title: "Delhi Airport", category: "Airport" },
    { id: 5, rank: 5, title: "Times of India", category: "Newspaper" },
    { id: 6, rank: 6, title: "Indigo Airlines", category: "Airline" },
  ];

  return (
    <section className="max-w-[1600px] mx-auto px-4 py-8 md:py-12 w-full relative">
      <h2 className="text-xl md:text-2xl font-bold text-[#243839] mb-6">
        Top Media Spends
      </h2>

      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_2px_15px_rgb(0,0,0,0.1)] flex items-center justify-center z-20 hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex text-gray-400 hover:text-[#0A4D28] hover:border-[#0A4D28]/20 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 px-2 pt-2"
        >
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl relative flex-shrink-0 border border-gray-100 cursor-pointer group/card hover:shadow-[0_8px_20px_rgba(10,77,40,0.08)] hover:-translate-y-1 hover:border-[#C58B24]/40 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 bg-[#C58B24] text-white font-bold text-sm px-3 py-1.5 z-10 rounded-tr-xl rounded-bl-lg shadow-sm">
                #{item.rank}
              </div>

              <div className="w-full h-[150px] bg-gray-50 rounded-t-xl relative flex items-center justify-center overflow-hidden group-hover/card:bg-[#0A4D28]/5 transition-colors duration-300">
                <ImageIcon className="w-8 h-8 text-gray-300 group-hover/card:text-[#0A4D28]/40 transition-colors duration-300" />
                <span className="absolute bottom-2 text-xs text-gray-400 font-medium group-hover/card:text-[#0A4D28]/60 transition-colors duration-300">
                  Image Placeholder
                </span>
              </div>

              <div className="p-4 border-t border-gray-50">
                <h3 className="font-bold text-[#243839] text-[15px] mb-0.5 group-hover/card:text-[#0A4D28] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-[13px] font-medium group-hover/card:text-[#C58B24] transition-colors">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_2px_15px_rgb(0,0,0,0.1)] flex items-center justify-center z-20 hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex text-gray-400 hover:text-[#0A4D28] hover:border-[#0A4D28]/20 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}