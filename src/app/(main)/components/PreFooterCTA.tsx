"use client";

import { useState } from "react";
import { ChevronsUp, User, Sparkles, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PreFooterCTA() {
  const [activeSocial, setActiveSocial] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      name: "Instagram",
      handle: "@bookmyadspace",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      handle: "/bookmyadspace",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      handle: "@bookmyadspace",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      handle: "BookmyadSpace Official",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full bg-[#0B111A] flex flex-col items-center pt-10 border-t border-[#1E293B] relative overflow-hidden">
      <motion.button
        type="button"
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.96 }}
        className="group relative z-20 mb-8 px-6 py-2.5 rounded-full bg-[#0F1621] border border-[#2A3441] hover:border-[#E5A93D] text-[#E5A93D] flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-colors duration-300"
      >
        Move To Top
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronsUp className="w-4 h-4" strokeWidth={3} />
        </motion.span>
      </motion.button>

      <div className="w-full bg-[#0F1621] border-t border-[#2A3441] relative flex justify-center py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden md:min-h-[340px]">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#E5A93D]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="max-w-[1200px] w-full flex flex-col items-center md:items-start relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A222C] border border-[#2A3441] text-[#E5A93D] text-[11px] font-black uppercase tracking-[0.2em] mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Stay Connected
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-8 w-full max-w-[760px] text-center md:text-left"
          >
            <div>
              <h3 className="text-white text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tighter leading-[1.1] mb-3">
                Follow Us on{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93D] to-[#F2B950]">
                  Social Media
                </span>
              </h3>
              <p className="text-gray-400 text-sm sm:text-base font-medium max-w-xl">
                Join our growing community for daily outdoor media trends, prime billboard drops, and live campaign showcases.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full h-px bg-gradient-to-r from-[#E5A93D]/40 via-[#2A3441] to-transparent mb-8 max-w-[720px] origin-left"
          />

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 md:gap-7 text-white w-full max-w-[720px] justify-center md:justify-start"
          >
            <div className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4 text-[#E5A93D]" />
              <span className="font-black text-sm uppercase tracking-[0.2em] text-gray-300">
                Our Channels
              </span>
            </div>

            <div className="flex items-center gap-3.5 sm:gap-4">
              {socialLinks.map((social, idx) => {
                const isSelected = activeSocial === social.name;
                return (
                  <motion.button
                    key={social.name}
                    type="button"
                    onClick={() =>
                      setActiveSocial(isSelected ? null : social.name)
                    }
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.35 + idx * 0.08 }}
                    whileHover={{ y: -4, scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                      isSelected
                        ? "bg-[#E5A93D] text-[#0B111A] border-[#E5A93D] shadow-[0_0_25px_rgba(229,169,61,0.45)]"
                        : "bg-[#1A222C] text-white border-[#2A3441] hover:border-[#E5A93D] hover:text-[#E5A93D] shadow-lg"
                    }`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.button>
                );
              })}
            </div>

            {activeSocial && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-4 py-2 rounded-full bg-[#1A222C] border border-[#E5A93D]/40 text-xs font-bold text-[#E5A93D] tracking-wide"
              >
                {
                  socialLinks.find((item) => item.name === activeSocial)
                    ?.handle
                }
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex absolute bottom-0 right-[5%] lg:right-[10%] w-[240px] lg:w-[280px] h-[290px] bg-gradient-to-b from-[#1A222C]/90 to-[#0B111A]/90 rounded-t-full items-center justify-center backdrop-blur-md border-t border-x border-[#2A3441] z-0 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#E5A93D]/10 via-transparent to-transparent opacity-60" />

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <User
              className="w-36 h-36 text-gray-500/25 group-hover:text-[#E5A93D]/35 transition-colors duration-500"
              strokeWidth={1}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}