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
      <h2 className="text-xl md:text-2xl font-bold text-[#142642] mb-6">
        Top Media Spends
      </h2>

      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_2px_15px_rgb(0,0,0,0.15)] flex items-center justify-center z-20 hover:bg-gray-50 transition-colors border border-gray-100 hidden sm:flex text-gray-600 hover:text-[#5B46DF] opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4 px-2"
        >
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="min-w-[280px] md:min-w-[320px] bg-[#F8F7F5] rounded-md relative flex-shrink-0 border border-gray-100 cursor-pointer group/card"
            >
              <div className="absolute top-0 right-0 bg-[#55C274] text-white font-bold text-sm px-3 py-1.5 z-10 rounded-tr-md rounded-bl-lg shadow-sm">
                #{item.rank}
              </div>

              <div className="w-full h-[150px] bg-gray-200 rounded-t-md relative flex items-center justify-center overflow-hidden">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <span className="absolute bottom-2 text-xs text-gray-400 font-medium">
                  Image Placeholder
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-[#142642] text-[15px] mb-0.5 group-hover/card:text-[#5B46DF] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-[13px] font-medium">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_2px_15px_rgb(0,0,0,0.15)] flex items-center justify-center z-20 hover:bg-gray-50 transition-colors border border-gray-100 hidden sm:flex text-gray-600 hover:text-[#5B46DF] opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}