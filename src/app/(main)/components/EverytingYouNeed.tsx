"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Sliders,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    id: "01",
    title: "Real-Time Map View",
    desc: "Explore billboard locations visually on an interactive world map. Filter by city, size, format, and price.",
    icon: MapPin,
  },
  {
    id: "02",
    title: "Instant Booking",
    desc: "Book your preferred billboard in minutes. Real-time availability calendar, transparent pricing, instant confirmation.",
    icon: Zap,
  },
  {
    id: "03",
    title: "Verified Agencies",
    desc: "Every agency and billboard is strictly verified on our platform. Guaranteed quality and professional service.",
    icon: Shield,
  },
  {
    id: "04",
    title: "Global Reach",
    desc: "From Mumbai to Manhattan, Tokyo to Dubai — access premium outdoor inventory in every major market.",
    icon: Globe,
  },
  {
    id: "05",
    title: "Campaign Analytics",
    desc: "Track your campaign performance with traffic data, impressions, and ROI metrics all in one dashboard.",
    icon: TrendingUp,
  },
  {
    id: "06",
    title: "Agency Tools",
    desc: "Agencies can list, manage, and monetise their billboard inventory with powerful owner dashboard tools.",
    icon: Sliders,
  },
];

const stats = [
  { value: "10,000+", label: "Billboard Locations" },
  { value: "500+", label: "Cities Worldwide" },
  { value: "2,000+", label: "Happy Clients" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function EverythingYouNeed() {
  return (
    <section className="relative w-full bg-[#F5F3EE] py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-gray-200/80">
      <div className="hidden xl:block absolute top-24 left-8 w-56 h-36 border-2 border-gray-300/40 rounded-lg pointer-events-none">
        <div className="w-full h-full border-4 border-white/50 rounded flex items-center justify-center">
          <div className="w-3/4 h-2 bg-gray-300/30 rounded" />
        </div>
        <div className="w-3 h-28 bg-gray-300/40 mx-auto" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, x: 20 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true }}
        animate={{ y: [0, -8, 0] }}
        transition={{
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.7 },
        }}
        className="hidden xl:flex flex-col justify-between absolute top-12 right-10 w-64 bg-white rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100 z-20"
      >
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2">
            Quick Search
          </span>
          <div className="bg-[#F8FAFC] border border-gray-200/80 rounded-lg px-3 py-2 text-xs font-black text-[#0B111A] tracking-wider mb-6">
            Mumbai Billboard
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200/70 rounded-xl px-3 py-2.5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
          <span className="text-[11px] font-black text-emerald-800">
            Booking Confirmed!
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        animate={{ y: [0, 8, 0] }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          opacity: { duration: 0.7 },
        }}
        className="hidden xl:flex items-center gap-3 absolute bottom-8 right-10 bg-white rounded-2xl px-5 py-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[#E5A93D]">
          <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm font-black text-[#E5A93D] leading-none">
            12.8M
          </div>
          <div className="text-[10px] font-semibold text-gray-400 mt-0.5">
            total impressions served
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1 animate-pulse" />
      </motion.div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-14 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8ECEF] border border-gray-300/80 text-[#0B111A] text-[11px] font-black uppercase tracking-[0.2em] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93D]" />
            Why Choose Us
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0F2537] tracking-tight mb-4">
            Everything You <span className="text-[#E5A93D]">Need</span>
          </h2>

          <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium max-w-xl leading-relaxed">
            Built for advertisers, agencies, and brands who demand results from
            every rupee spent.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 mb-16 md:mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative bg-white rounded-[24px] p-7 sm:p-8 border border-gray-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(15,37,55,0.08)] hover:border-[#E5A93D]/50 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                <span className="absolute top-4 right-6 text-5xl sm:text-6xl font-black text-gray-100 group-hover:text-[#E5A93D]/15 transition-colors duration-500 select-none pointer-events-none">
                  {feature.id}
                </span>

                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#E5A93D] transition-colors duration-300 absolute top-5 right-5" />

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF8EC] border border-[#E5A93D]/20 flex items-center justify-center text-[#D99B26] mb-6 group-hover:scale-110 group-hover:bg-[#E5A93D] group-hover:text-[#0B111A] transition-all duration-300 relative z-10">
                    <Icon className="w-5 h-5" strokeWidth={2.2} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-[#0F2537] group-hover:text-[#D99B26] transition-colors duration-300 mb-3 relative z-10">
                    {feature.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed font-medium relative z-10">
                    {feature.desc}
                  </p>
                </div>

                <div className="mt-5 pt-2 flex items-center gap-1.5 text-xs font-black text-[#D99B26] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto bg-[#0F2942] rounded-[24px] px-6 py-6 sm:px-10 sm:py-7 shadow-[0_20px_50px_rgba(15,41,66,0.25)] border border-white/10"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-center pt-4 sm:pt-0 first:pt-0"
              >
                <span className="text-xl sm:text-2xl md:text-[26px] font-black text-[#E5A93D] tracking-tight leading-none mb-1.5">
                  {stat.value}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-gray-300 tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}