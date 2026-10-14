"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const rowOneItems = [
  {
    id: 1,
    title: "Red Bus",
    category: "BTL",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "ZingBus",
    category: "BTL",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Gopalan Arcade Mall",
    category: "BTL",
    image: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Marine Drive Hoarding",
    category: "Outdoor",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Cyber City Digital",
    category: "DOOH",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop",
  },
];

const rowTwoItems = [
  {
    id: 6,
    title: "Evyo Electric",
    category: "BTL",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Delhi Metro",
    category: "Transit",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "DLF Cyber Hub",
    category: "Outdoor",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "Bandra Worli Sea Link",
    category: "Billboard",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "Connaught Place",
    category: "Outdoor",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function LatestAddition() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ["5%", "-25%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["-25%", "5%"]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-16 md:py-28 border-b border-gray-100 relative overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93D]" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                New Inventory
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0B111A] tracking-tighter leading-none">
              Latest <span className="text-[#E5A93D]">Addition</span>
            </h2>
          </div>
          <p className="text-gray-500 font-medium text-sm md:text-base max-w-md md:text-right">
            Explore our newly onboarded high-impact outdoor and transit media locations across prime city zones.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-6 md:gap-8">
        <motion.div
          style={{ x: xLeft }}
          className="flex gap-5 md:gap-7 w-max pl-4 sm:pl-8 will-change-transform"
        >
          {rowOneItems.map((item) => (
            <div
              key={item.id}
              className="w-[300px] sm:w-[380px] md:w-[460px] h-[220px] sm:h-[260px] md:h-[300px] rounded-[28px] relative overflow-hidden group cursor-pointer bg-gray-100 border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex-shrink-0"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B111A]/90 via-[#0B111A]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="bg-white/95 backdrop-blur-md text-[#0B111A] px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm">
                  {item.category}
                </span>
                <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md text-[#0B111A] flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-[#E5A93D] transition-all duration-300 shadow-sm">
                  <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>

              <div className="absolute bottom-5 left-6 right-6 z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          style={{ x: xRight }}
          className="flex gap-5 md:gap-7 w-max pr-4 sm:pr-8 will-change-transform"
        >
          {rowTwoItems.map((item) => (
            <div
              key={item.id}
              className="w-[300px] sm:w-[380px] md:w-[460px] h-[220px] sm:h-[260px] md:h-[300px] rounded-[28px] relative overflow-hidden group cursor-pointer bg-gray-100 border border-gray-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex-shrink-0"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B111A]/90 via-[#0B111A]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="bg-white/95 backdrop-blur-md text-[#0B111A] px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm">
                  {item.category}
                </span>
                <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md text-[#0B111A] flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-[#E5A93D] transition-all duration-300 shadow-sm">
                  <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
                </div>
              </div>

              <div className="absolute bottom-5 left-6 right-6 z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}