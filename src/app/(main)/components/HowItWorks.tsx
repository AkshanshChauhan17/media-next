"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Calendar, TrendingUp } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Browse & Discover",
    desc: "Search our global billboard inventory. Filter by city, size, format, and budget.",
    badgeBg: "bg-[#151934]/90",
    badgeBorder: "border-indigo-500/40",
    badgeText: "text-indigo-400",
    badgeGlow: "shadow-[0_0_35px_rgba(99,102,241,0.35)]",
    cardHoverBorder: "hover:border-indigo-500/50",
    cardGlow: "from-indigo-500/10",
  },
  {
    id: "02",
    title: "Check Availability",
    desc: "View real-time availability on our interactive calendar and select your dates.",
    badgeBg: "bg-[#231F23]/90",
    badgeBorder: "border-[#E5A93D]/40",
    badgeText: "text-[#E5A93D]",
    badgeGlow: "shadow-[0_0_35px_rgba(229,169,61,0.35)]",
    cardHoverBorder: "hover:border-[#E5A93D]/50",
    cardGlow: "from-[#E5A93D]/10",
  },
  {
    id: "03",
    title: "Book & Confirm",
    desc: "Submit your booking and get instant confirmation. Your ad goes live on schedule.",
    badgeBg: "bg-[#0D2838]/90",
    badgeBorder: "border-cyan-400/50",
    badgeText: "text-cyan-400",
    badgeGlow: "shadow-[0_0_40px_rgba(34,211,238,0.45)]",
    cardHoverBorder: "hover:border-cyan-400/50",
    cardGlow: "from-cyan-500/10",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative w-full bg-[#070B14] py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-y border-[#1E293B]">
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1E293B 1px, transparent 1px),
            linear-gradient(to bottom, #1E293B 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 35%, rgba(99, 102, 241, 0.18), transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(229, 169, 61, 0.12), transparent 45%),
            radial-gradient(circle at 80% 60%, rgba(6, 182, 212, 0.18), transparent 40%)
          `,
        }}
      />

      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-[192px] left-0 w-96 h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-60 pointer-events-none"
      />
      <motion.div
        animate={{ x: ["200%", "-100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[128px] left-0 w-96 h-[1px] bg-gradient-to-r from-transparent via-[#E5A93D] to-transparent opacity-60 pointer-events-none"
      />
      <motion.div
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-[25%] w-[1px] h-80 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40 pointer-events-none"
      />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="hidden lg:flex absolute top-14 left-12 text-indigo-500/15 pointer-events-none"
      >
        <Calendar className="w-16 h-16" strokeWidth={1.2} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        animate={{ y: [0, -8, 0] }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.7 },
        }}
        className="hidden lg:flex items-center gap-3.5 absolute top-14 right-12 bg-[#0D1F22]/90 border border-emerald-500/30 backdrop-blur-xl px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.15)] z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-white font-black text-xs tracking-wide">
            Booking Confirmed!
          </p>
          <p className="text-emerald-400/70 font-semibold text-[11px]">
            Marine Drive · 4 weeks
          </p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="hidden lg:flex items-center gap-2 absolute bottom-10 left-12 text-indigo-400/30 font-black text-xs tracking-wider pointer-events-none"
      >
        <TrendingUp className="w-5 h-5" />
        <span>+340% ROI</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        animate={{ y: [0, -8, 0] }}
        transition={{
          y: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          opacity: { duration: 0.7 },
        }}
        className="hidden lg:flex flex-col items-center justify-center absolute bottom-8 right-12 bg-[#1F1A1C]/90 border border-[#E5A93D]/30 backdrop-blur-xl px-6 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(229,169,61,0.15)] z-20"
      >
        <span className="text-[#E5A93D] font-black text-xl leading-none tracking-tight">
          2,000+
        </span>
        <span className="text-[#E5A93D]/60 font-bold text-[10px] mt-1 tracking-wide">
          brands advertised
        </span>
      </motion.div>

      <div className="max-w-[1350px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16 md:mb-24"
        >
          <span className="px-5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-[11px] font-black uppercase tracking-[0.22em] mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            Simple Process
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-5">
            How Our <span className="text-[#E5A93D]">Platform</span> works
          </h2>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg font-medium max-w-xl leading-relaxed">
            From discovery to live campaign in minutes. No calls. No
            negotiations. Just results.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-[36px] left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-indigo-500/30 via-[#E5A93D]/40 to-cyan-400/30 z-0 overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1/3 h-full bg-gradient-to-r from-transparent via-white to-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className={`w-[72px] h-[72px] rounded-2xl ${step.badgeBg} border ${step.badgeBorder} ${step.badgeGlow} flex items-center justify-center mb-8 relative backdrop-blur-xl transition-transform duration-300`}
                >
                  <span
                    className={`font-black text-xl tracking-tight ${step.badgeText}`}
                  >
                    {step.id}
                  </span>
                </motion.div>

                <div
                  className={`w-full bg-[#0F1424]/85 backdrop-blur-xl border border-[#1E293B] ${step.cardHoverBorder} rounded-[28px] p-8 md:p-10 text-center transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${step.cardGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  <h3 className="text-xl md:text-2xl font-black text-white mb-3.5 tracking-tight relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-[15px] font-medium leading-relaxed relative z-10">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}