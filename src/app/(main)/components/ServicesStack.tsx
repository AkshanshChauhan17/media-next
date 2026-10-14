"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import ServicesHeader from "./ServicesHeader";

const SERVICES = [
  {
    id: "01",
    subtitle: "MASS REACH, BRAND RECALL",
    title: "HOARDINGS & BILLBOARDS",
    desc: "Dominate skylines with large-format outdoor displays",
    images: ["/anii1.png", "/anii2.png", "/anii3.png"]
  },
  {
    id: "02",
    subtitle: "HIGH-TRAFFIC COMMUTER ROUTES",
    title: "FLYOVER & BRIDGE ADVERTISING",
    desc: "Capture commuters on high-traffic elevated routes",
    images: ["/ani11.png", "/ani22.png", "/ani33.png"]
  },
  {
    id: "03",
    subtitle: "CITY-WIDE MOBILE COVERAGE",
    title: "TRANSIT & TRANSPORT ADVERTISING",
    desc: "Moving billboards reaching every corner of the city",
    images: ["/ani111.png", "/ani222.png", "/ani333.png"]
  },
  {
    id: "04",
    subtitle: "PREMIUM RETAIL AUDIENCES",
    title: "MALL & RETAIL ADVERTISING",
    desc: "Premium brand exposure at high-footfall retail spaces",
    images: ["/ani1111.png", "/ani2222.png", "/ani3333.png"]
  }
];

const StackCard = ({ 
  service, 
  index, 
  scrollYProgress 
}: { 
  service: typeof SERVICES[0]; 
  index: number; 
  scrollYProgress: MotionValue<number>;
}) => {
  const totalCards = SERVICES.length;
  const step = 1 / (totalCards - 1);
  
  const breakpoints = SERVICES.map((_, i) => i * step);

  const scaleValues = SERVICES.map((_, i) => {
    if (i <= index) return 1;
    return 1 - ((i - index) * 0.04);
  });

  const opacityValues = SERVICES.map((_, i) => {
    if (i <= index) return 1;
    return 1 - ((i - index));
  });

  const cardScale = useTransform(scrollYProgress, breakpoints, scaleValues);
  const cardOpacity = useTransform(scrollYProgress, breakpoints, opacityValues);

  const yInput = index === 0 ? [0, 1] : [(index - 1) * step, index * step];
  const yOutput = index === 0 ? ["0vh", "0vh"] : ["100vh", "0vh"];
  const cardY = useTransform(scrollYProgress, yInput, yOutput);

  return (
    <motion.div
      style={{
        scale: cardScale,
        opacity: cardOpacity,
        y: cardY,
        zIndex: index * 10,
        transformOrigin: "top center",
      }}
      className="w-full h-full bg-[#0F1621] border border-[#2A3441] rounded-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] flex flex-col absolute top-0 left-0 right-0"
    >
      <div className="p-8 md:p-12 border-b border-[#2A3441] flex flex-col md:flex-row md:items-start justify-between gap-6 shrink-0">
        <div className="flex gap-6 md:gap-10">
          <span className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
            {service.id}
          </span>
          <div className="pt-2">
            <p className="text-[#E5A93D] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-2">
              {service.subtitle}
            </p>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-3">
              {service.title}
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium">
              {service.desc}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 bg-gradient-to-b from-transparent to-[#0B111A]/50 rounded-b-[40px] min-h-0">
        <div className={`grid grid-cols-1 gap-4 md:gap-6 h-full ${
          index % 3 === 0 ? "md:grid-cols-3 md:grid-rows-1" :
          index % 3 === 1 ? "md:grid-cols-2 md:grid-rows-2" :
          "md:grid-cols-3 md:grid-rows-2"
        }`}>
          {service.images.map((imgSrc, i) => {
            
            // Layout classes logic
            let spanClasses = "";
            if (index % 3 === 0) {
              // 3 Equal Columns
              spanClasses = "md:col-span-1 md:row-span-1";
            } else if (index % 3 === 1) {
              // Top full stretch, bottom 2 half
              spanClasses = i === 0 ? "md:col-span-2 md:row-span-1" : "md:col-span-1 md:row-span-1";
            } else {
              // Left large, right 2 stacked
              spanClasses = i === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1";
            }

            return (
              <div 
                key={i} 
                className={`relative w-full h-full min-h-[150px] md:min-h-0 rounded-2xl overflow-hidden bg-[#1A222C] border border-[#2A3441] ${spanClasses}`}
              >
                <Image 
                  src={imgSrc} 
                  alt={`${service.title} display ${i+1}`} 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default function ServicesStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section 
      ref={containerRef}
      className="w-full bg-[#0B111A] relative"
      style={{ height: `${SERVICES.length * 100}vh` }} 
    >
      <ServicesHeader />
      <div className="sticky top-10 h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-6">
        <div className="w-full max-w-[1200px] relative h-[80vh] md:h-[75vh]">
          {SERVICES.map((service, index) => (
            <StackCard 
              key={service.id} 
              service={service} 
              index={index} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}