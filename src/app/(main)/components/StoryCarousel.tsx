"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Image as ImageIcon, ChevronLeft, ChevronRight, Zap } from "lucide-react";

type Story = {
  id: number;
  city: string;
  location: string;
  image_url?: string;
};

export default function StoryCarousel({ stories }: { stories: Story[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [stories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {showLeft && (
        <button 
          onClick={() => scroll("left")}
          className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-2.5 rounded-full text-[#243839] hover:text-[#C58B24] transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {showRight && (
        <button 
          onClick={() => scroll("right")}
          className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 z-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-2.5 rounded-full text-[#243839] hover:text-[#C58B24] transition-all opacity-0 group-hover:opacity-100 group-hover:-translate-x-2"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex items-start justify-start gap-5 md:gap-8 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 pt-4 px-2 scroll-smooth min-h-[160px]"
      >
        {stories?.map((story, index) => (
          <Link 
            key={story.id} 
            href={`/media/${story.id}`}
            className="flex flex-col items-center gap-3 group/story flex-shrink-0 relative w-[80px] md:w-[100px]"
          >
            {index < 3 && (
              <div className="absolute -top-2 -right-1 z-10 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 animate-pulse shadow-sm border border-white">
                <Zap className="w-2.5 h-2.5" fill="currentColor" /> NEW
              </div>
            )}
            
            <div className="bg-gradient-to-tr from-[#C58B24] via-[#f0b54f] to-[#243839] p-[3px] rounded-full group-hover/story:scale-105 transition-all duration-300 shadow-md">
              <div className="bg-white p-[3px] rounded-full">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-100 relative flex items-center justify-center">
                  {story.image_url ? (
                    <img 
                      src={story.image_url} 
                      alt={story.city} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/story:scale-110"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center w-full">
              <span className="text-xs md:text-sm font-black text-[#243839] truncate w-full text-center group-hover/story:text-[#C58B24] transition-colors">
                {story.city}
              </span>
            </div>

            <div className="absolute top-[90px] md:top-[100px] w-max max-w-[150px] bg-[#243839] text-white text-[10px] font-bold px-3 py-2 rounded-lg opacity-0 group-hover/story:opacity-100 group-hover/story:-translate-y-1 transition-all duration-300 pointer-events-none shadow-xl z-20 text-center">
              {story.location}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#243839]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}