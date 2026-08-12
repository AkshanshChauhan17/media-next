"use client";

import { useRef } from "react";
import { ChevronRight, ChevronLeft, Image as ImageIcon } from "lucide-react";

export default function LatestAddition() {
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

  const latestItems = [
    { id: 1, title: "Red Bus", category: "BTL" },
    { id: 2, title: "ZingBus", category: "BTL" },
    { id: 3, title: "Gopalan Arcade Mall", category: "BTL" },
    { id: 4, title: "Evyo Electric", category: "BTL" },
    { id: 5, title: "Delhi Metro", category: "Transit" },
    { id: 6, title: "DLF Cyber Hub", category: "Outdoor" },
  ];

  return (
    <section className="max-w-[1600px] bg-white mx-auto px-4 py-8 md:py-12 w-full relative">
      <h2 className="text-xl md:text-2xl font-bold text-[#142642] mb-6">
        Latest Addition
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
          {latestItems.map((item) => (
            <div
              key={item.id}
              className="min-w-[280px] md:min-w-[320px] h-[160px] md:h-[180px] bg-gray-200 rounded-md relative flex-shrink-0 cursor-pointer overflow-hidden group/card flex items-center justify-center"
            >
              <ImageIcon className="w-8 h-8 text-gray-400 absolute z-0" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent top-1/4 z-10 transition-opacity group-hover/card:opacity-90" />

              <div className="absolute bottom-4 left-4 right-4 z-20">
                <h3 className="font-bold text-white text-[16px] mb-0.5 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-[12px] font-semibold tracking-wider">
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