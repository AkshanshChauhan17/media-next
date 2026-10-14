"use client";

import Link from "next/link";
import { HelpCircle, User, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsultationBanner() {
  return (
    <section className="w-full bg-[#0B111A] py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-[#1E293B]">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#0F1621] border border-[#2A3441] rounded-[36px] md:rounded-[48px] px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden md:min-h-[400px] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        >
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E5A93D]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 max-w-2xl text-white flex flex-col items-start gap-5 py-12 md:py-16 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A222C] border border-[#2A3441] text-[#E5A93D] text-xs font-black uppercase tracking-[0.2em]"
            >
              <Sparkles className="w-3.5 h-3.5" /> Expert Media Support
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tighter text-white"
            >
              Confused? <br />
              We can help you plan the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93D] to-[#F2B950]">
                perfect campaign!
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-base md:text-lg text-gray-400 font-medium mb-2 max-w-xl leading-relaxed"
            >
              Connect with our expert media planners to find, plan, and place your next high-impact outdoor promotion.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2"
            >
              <Link
                href="/contact"
                className="bg-[#E5A93D] hover:bg-[#F2B950] transition-all duration-300 text-[#0B111A] font-black text-sm px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(229,169,61,0.25)] hover:shadow-[0_15px_40px_rgba(229,169,61,0.4)] hover:-translate-y-0.5 tracking-wide flex items-center justify-center gap-3 group"
              >
                CONTACT MEDIA PLANNERS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </Link>

              <Link
                href="/contact"
                className="bg-[#1A222C] hover:bg-[#2A3441] transition-colors text-white font-bold text-xs sm:text-sm px-7 py-4 rounded-full tracking-widest uppercase text-center border border-[#2A3441] flex items-center justify-center gap-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                COMPLETELY FREE!
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full md:w-auto flex justify-center md:justify-end md:self-end mt-4 md:mt-0"
          >
            <Link
              href="/contact"
              className="w-[260px] sm:w-[300px] md:w-[320px] h-[260px] sm:h-[300px] md:h-[340px] bg-gradient-to-b from-[#1A222C]/90 to-[#0B111A]/90 rounded-t-full border-t border-x border-[#2A3441] hover:border-[#E5A93D]/50 transition-colors duration-500 flex flex-col items-center justify-end pb-8 relative overflow-hidden backdrop-blur-md group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#E5A93D]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <motion.div
                animate={{ y: [0, -10, 0], rotate: [12, 18, 12] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-14 right-14 md:right-16 bg-[#0F1621] p-2.5 rounded-2xl border border-[#2A3441] shadow-lg"
              >
                <HelpCircle className="w-7 h-7 text-[#E5A93D]" strokeWidth={2.5} />
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0], rotate: [-12, -18, -12] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-24 left-12 md:left-14 bg-[#0F1621] p-2 rounded-xl border border-[#2A3441] shadow-lg"
              >
                <HelpCircle className="w-5 h-5 text-[#E5A93D]" strokeWidth={2.5} />
              </motion.div>

              <User
                className="w-36 h-36 md:w-44 md:h-44 text-gray-600/40 group-hover:text-[#E5A93D]/40 group-hover:scale-105 transition-all duration-500"
                strokeWidth={1}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}