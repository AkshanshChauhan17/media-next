"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  GitCompare,
  Calendar,
  Camera,
  Route,
  LayoutGrid,
} from "lucide-react";

// Updated content exactly as per the previous image
const features = [
  {
    id: "01",
    title: "Multiple Media Formats",
    desc: "Explore billboards, buses, autos, trucks and digital outdoor media.",
    icon: MapPin,
  },
  {
    id: "02",
    title: "Compare Before You Book",
    desc: "Evaluate available locations, formats, campaign dates and pricing.",
    icon: GitCompare,
  },
  {
    id: "03",
    title: "Simplified Booking",
    desc: "Explore availability and manage your booking journey in one place.",
    icon: Calendar,
  },
  {
    id: "04",
    title: "Campaign Execution Proof",
    desc: "Access campaign photos and execution reports where available.",
    icon: Camera,
  },
  {
    id: "05",
    title: "Campaign Tracking",
    desc: "Monitor routes and campaign progress for supported tracking-enabled media.",
    icon: Route,
  },
  {
    id: "06",
    title: "Centralized Management",
    desc: "Keep booking details, campaign updates and reports organized in one place.",
    icon: LayoutGrid,
  },
];

export default function EverythingYouNeed() {
  return (
    <section className="relative w-full bg-[#F5F3EE] py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-[1000px] mx-auto relative z-10">
        
        {/* Updated Section Header matching the new image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-14 md:mb-16 px-2"
        >
          {/* Green Badge */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#E2F0E5] text-[#1E8E3E] text-xs font-bold uppercase tracking-wider mb-6">
            Why BookMyAdSpace
          </div>

          {/* Main Heading */}
          <h2 className="text-[28px] sm:text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-[1.2] md:leading-[1.15]">
            <span className="text-[#0B1727] block">Outdoor Advertising,</span>
            <span className="text-[#D99B26] block">Made More Transparent.</span>
          </h2>

          {/* Subheading Description */}
          <p className="text-slate-500 text-[15px] md:text-lg max-w-2xl font-medium leading-relaxed">
            Discover media options, compare locations and manage your outdoor advertising campaigns — all in one platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mb-8 md:mb-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white rounded-2xl p-5 md:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-start hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                {/* Minimal Icon */}
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#D99B26] mb-4" strokeWidth={2} />

                {/* Title */}
                <h3 className="text-[15px] md:text-lg font-bold text-[#1a202c] leading-snug mb-2 md:mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-[13px] md:text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0B1727] rounded-[20px] px-6 py-8 md:px-10 md:py-10 shadow-lg text-left"
        >
          <h2 className="text-xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            One Platform. Greater Transparency.
          </h2>
          <p className="text-sm md:text-base text-gray-300 font-medium tracking-wide">
            Find. Compare. Book. Track. Verify.
          </p>
        </motion.div>

      </div>
    </section>
  );
}