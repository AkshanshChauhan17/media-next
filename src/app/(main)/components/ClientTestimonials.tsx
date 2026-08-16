"use client";

import { useRef } from "react";
import { ChevronRight, ChevronLeft, Hourglass, Activity, Zap } from "lucide-react";

export default function ClientTestimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: "smooth" });
    }
  };

  const testimonials = [
    {
      id: 1,
      theme: {
        bg: "bg-[#0A4D28]/10",
        text: "text-[#0A4D28]",
      },
      quote:
        "BookmyadSpace has been our one point of solution for all marketing needs. We have been using BookmyadSpace for Planning and executing our radio campaigns. BookmyadSpace is like a marketing team member with zero cost.",
      author: "Manjunath Talwar,",
      role: "Cofounder, Hiree.com",
      company: "Hiree",
      logoIcon: Hourglass,
    },
    {
      id: 2,
      theme: {
        bg: "bg-[#C58B24]/15",
        text: "text-[#C58B24]",
      },
      quote:
        "BookmyadSpace is phenomenal in terms of opening a marketeer's mind to the whole range media option especially the not so well known ones. Whats even more valuable is it one stop place to quickly get information to access the reach, cost estimates and put together a basic plan.",
      author: "N.Mohan,",
      role: "VP Marketing, Practo",
      company: "practo",
      logoIcon: Activity,
    },
    {
      id: 3,
      theme: {
        bg: "bg-[#243839]/10",
        text: "text-[#243839]",
      },
      quote:
        "Our experience with BookmyadSpace has been that of a very professional agency that understands the brief perfectly. Their team is extremely prompt, proactive and easy-to-work with. Highly recommended for any of real-time campaigns.",
      author: "Ravi Kumar,",
      role: "Director, Future Grp",
      company: "FUTURE",
      logoIcon: Zap,
    },
  ];

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-white">
      <div className="absolute left-[-10%] top-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-[#0A4D28]/5 z-0 pointer-events-none opacity-60"></div>
      <div className="absolute right-[-5%] top-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] rounded-full bg-transparent z-0 pointer-events-none opacity-60 border-[60px] border-[#C58B24]/5"></div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 w-full relative z-10">
        <h2 className="text-xl md:text-[28px] font-bold text-[#243839] mb-8 md:mb-12">
          What Our Clients Say
        </h2>

        <div className="relative group">
          <button
            onClick={scrollLeft}
            className="absolute left-[-16px] md:left-[-24px] top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_2px_15px_rgb(0,0,0,0.1)] flex items-center justify-center z-20 hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex text-gray-400 hover:text-[#0A4D28] hover:border-[#0A4D28]/20 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-8 px-2 pt-2"
          >
            {testimonials.map((testimonial) => {
              const LogoIcon = testimonial.logoIcon;
              return (
                <div
                  key={testimonial.id}
                  className="min-w-[300px] md:min-w-[460px] w-full max-w-[460px] bg-white rounded-xl shadow-[0_4px_25px_rgb(0,0,0,0.04)] border border-gray-100 flex-shrink-0 flex flex-col relative overflow-hidden hover:shadow-[0_8px_20px_rgba(10,77,40,0.08)] hover:-translate-y-1 hover:border-[#C58B24]/40 transition-all duration-300 group/card"
                >
                  <div
                    className={`absolute top-0 left-0 w-24 h-24 rounded-br-[60px] ${testimonial.theme.bg} z-0 transition-colors duration-300 group-hover/card:opacity-80`}
                  ></div>

                  <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
                    <div className="mb-4">
                      <span
                        className={`text-6xl md:text-7xl font-serif leading-none tracking-tighter ${testimonial.theme.text}`}
                      >
                        “
                      </span>
                    </div>

                    <p className="text-[#243839]/80 text-[14px] md:text-[15px] leading-relaxed mb-8 flex-grow font-medium group-hover/card:text-[#243839] transition-colors">
                      {testimonial.quote}
                    </p>

                    <div className="border-t border-gray-100 pt-5 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <LogoIcon
                          className={`w-6 h-6 md:w-7 md:h-7 ${testimonial.theme.text}`}
                          strokeWidth={2.5}
                        />
                        <span className="font-bold text-[18px] md:text-[22px] tracking-tight text-[#243839]">
                          {testimonial.company}
                        </span>
                      </div>

                      <div className="text-right">
                        <h4 className="font-bold text-[#243839] text-[15px] md:text-[16px]">
                          {testimonial.author}
                        </h4>
                        <p className="text-[#C58B24] text-[12px] md:text-[13px] font-semibold">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-[-16px] md:right-[-24px] top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-[0_2px_15px_rgb(0,0,0,0.1)] flex items-center justify-center z-20 hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex text-gray-400 hover:text-[#0A4D28] hover:border-[#0A4D28]/20 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}