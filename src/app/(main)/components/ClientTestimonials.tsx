"use client";

import { useRef } from "react";
import { ChevronRight, ChevronLeft, Hourglass, Activity, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

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
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
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
        bg: "bg-[#E5A93D]/15",
        text: "text-[#E5A93D]",
        border: "border-[#E5A93D]/25",
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
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        border: "border-sky-500/20",
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
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-[#0B111A] border-b border-[#1E293B]">
      <div className="absolute left-[-10%] top-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-[#E5A93D]/5 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute right-[-5%] bottom-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-500/5 blur-[120px] z-0 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93D]" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                Verified Reviews
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
              What Our <span className="text-[#E5A93D]">Clients Say</span>
            </h2>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={scrollLeft}
              className="w-12 h-12 bg-[#0F1621] rounded-full flex items-center justify-center hover:bg-[#E5A93D] text-gray-300 hover:text-[#0B111A] transition-all duration-300 border border-[#2A3441] hover:border-[#E5A93D] active:scale-95 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="w-12 h-12 bg-[#0F1621] rounded-full flex items-center justify-center hover:bg-[#E5A93D] text-gray-300 hover:text-[#0B111A] transition-all duration-300 border border-[#2A3441] hover:border-[#E5A93D] active:scale-95 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>

        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex gap-5 md:gap-7 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-8 px-1 pt-2"
          >
            {testimonials.map((testimonial, index) => {
              const LogoIcon = testimonial.logoIcon;
              return (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="min-w-[300px] sm:min-w-[380px] md:min-w-[460px] w-full max-w-[460px] bg-[#0F1621] rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[#2A3441] flex-shrink-0 flex flex-col relative overflow-hidden hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] hover:-translate-y-2 hover:border-[#E5A93D]/50 transition-all duration-500 group/card"
                >
                  <div
                    className={`absolute top-0 left-0 w-28 h-28 rounded-br-[80px] ${testimonial.theme.bg} z-0 transition-transform duration-500 group-hover/card:scale-110`}
                  />

                  <div className="p-7 md:p-9 flex flex-col flex-grow relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`text-6xl md:text-7xl font-serif leading-none tracking-tighter select-none ${testimonial.theme.text}`}
                      >
                        “
                      </span>

                      <div className="flex items-center gap-1 bg-[#1A222C] border border-[#2A3441] px-3 py-1.5 rounded-full">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 text-[#E5A93D] fill-[#E5A93D]"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 flex-grow font-medium group-hover/card:text-white transition-colors duration-300">
                      {testimonial.quote}
                    </p>

                    <div className="border-t border-[#1E293B] pt-6 flex items-center justify-between gap-4 mt-auto">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl ${testimonial.theme.bg} border ${testimonial.theme.border} flex items-center justify-center shrink-0`}
                        >
                          <LogoIcon
                            className={`w-5 h-5 ${testimonial.theme.text}`}
                            strokeWidth={2.5}
                          />
                        </div>
                        <span className="font-black text-lg md:text-xl tracking-tight text-white">
                          {testimonial.company}
                        </span>
                      </div>

                      <div className="text-right">
                        <h4 className="font-bold text-white text-sm md:text-base">
                          {testimonial.author}
                        </h4>
                        <p className="text-[#E5A93D] text-xs font-bold tracking-wide mt-0.5">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}