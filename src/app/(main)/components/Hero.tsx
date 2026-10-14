"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  FileText,
  IndianRupee,
  BarChart3,
  ShoppingCart,
  X,
  ArrowRight,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  type Variants,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import StateMarquee from "./StateScrolling";
import LedBillboard from "./Billboard";

export default function Hero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [budget, setBudget] = useState("");

  const heroRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      title: "India's #1 Billboard",
      titleSpan: "Booking Platform",
      subtitle: "Discover, book and manage premium outdoor advertising spaces.",
    },
    {
      title: "Reach Your Target",
      titleSpan: "Audience Instantly",
      subtitle: "Plan data-driven campaigns that truly stand out.",
    },
    {
      title: "Maximize Your ROI",
      titleSpan: "Starting Today",
      subtitle: "Track, optimize, and scale your brand performance.",
    },
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const gridX = useTransform(smoothMouseX, [0, 2000], [15, -15]);
  const gridY = useTransform(smoothMouseY, [0, 1000], [15, -15]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left); // Fixed missing minus sign
    mouseY.set(event.clientY - rect.top); // Fixed missing minus sign
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); // Fixed missing minus sign

  const handleFindClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPlanModalOpen(false);
    router.push(`/find`);
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlanModalOpen(false);
    router.push(`/search?budget=${budget}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <>
      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        // CHANGED: Flex-col and justify-between to push the marquee to the bottom
        className="relative w-full bg-[#0B111A] overflow-hidden min-h-[100vh] lg:min-h-[800px] flex flex-col justify-between pt-24 pb-10"
      >
        {/* Background Layers */}
        <motion.div
          className="absolute inset-0 z-0 opacity-[0.15]"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage: `
              linear-gradient(#1E293B 1.5px, transparent 1.5px), 
              linear-gradient(90deg, #1E293B 1.5px, transparent 1.5px)
            `,
            backgroundSize: "70px 70px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
        <motion.div
          className="absolute inset-0 z-1 pointer-events-none opacity-[0.1]"
          style={{
            x: gridX,
            y: gridY,
            backgroundImage: `
              linear-gradient(#475569 1px, transparent 1px), 
              linear-gradient(90deg, #475569 1px, transparent 1px)
            `,
            backgroundSize: "35px 35px",
            scale: 1.1,
          }}
        />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E5A93D]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none z-2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none z-2" />
        <LedBillboard />

        {/* TOP SECTION: 2 Columns (Text & Cards) */}
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10 mb-16">
          
          {/* Left Column: Text & Slider */}
          <div className="flex-1 w-full max-w-3xl text-white">
            <div className="min-h-[220px] sm:min-h-[280px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black leading-[1.05] mb-6 tracking-tighter">
                    {slides[currentSlide].title}
                    <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5A93D] to-[#F2B950]">
                      {" "}
                      {slides[currentSlide].titleSpan}
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl font-medium mb-10 text-gray-400 max-w-2xl leading-relaxed">
                    {slides[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-6"
            >
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-[#2A3441] flex items-center justify-center hover:bg-[#1A222C] hover:border-[#E5A93D] hover:text-[#E5A93D] transition-all relative z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-500 relative z-10 ${
                      currentSlide === index
                        ? "w-8 bg-[#E5A93D]"
                        : "w-2 bg-[#2A3441] hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-[#2A3441] flex items-center justify-center hover:bg-[#1A222C] hover:border-[#E5A93D] hover:text-[#E5A93D] transition-all relative z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          {/* Right Column: 3 Action Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            // Replaced the flexbox with a 2x2 Grid for the 4 cards
            className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6 justify-center items-center relative z-10"
          >
            {/* CARD 1: Red Discount Offer Box */}
            <motion.div variants={cardVariants} className="w-full h-[240px]">
              <div className="w-full h-full bg-[#ff003c] text-white rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group shadow-[0_20px_40px_rgba(255,0,60,0.2)] hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 border-[20px] border-white/10 rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform origin-bottom-left">
                    <Tag className="w-7 h-7 text-[#ff003c]" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[26px] font-black leading-none mb-2 tracking-tight">Flat 10% Off</h3>
                  <p className="text-white/90 font-medium text-sm leading-snug">
                    Use code <span className="font-bold bg-white text-[#ff003c] px-1.5 py-0.5 rounded">OUTDOOR10</span> on your first booking.
                  </p>
                </div>
                
                <button className="flex items-center gap-2 font-bold text-base group-hover:gap-4 transition-all relative z-10 w-fit">
                  Claim Offer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* CARD 2: Find */}
            <motion.button
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={handleFindClick}
              className="w-full h-[240px] bg-[#0F1621] rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-[#1E293B] hover:border-[#E5A93D]/50 text-left cursor-pointer transition-colors duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1A222C] to-transparent rounded-bl-[100%] flex items-start justify-end p-5 transition-colors group-hover:from-[#E5A93D]/10">
                <IndianRupee className="w-6 h-6 text-gray-600 group-hover:text-[#E5A93D] transition-colors" strokeWidth={2} />
              </div>
              <div className="relative z-10 mt-2">
                <div className="w-14 h-14 rounded-2xl bg-[#1A222C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform origin-bottom-left border border-[#2A3441] group-hover:border-[#E5A93D]/30">
                  <Search className="w-7 h-7 text-[#E5A93D]" strokeWidth={2.5} />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-[28px] font-black text-white mb-2 leading-none tracking-tight">Find</h3>
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-200 transition-colors">
                  <span className="text-[15px] font-semibold">Media Rates</span>
                  <div className="w-5 h-5 rounded-full bg-[#1A222C] flex items-center justify-center group-hover:bg-[#E5A93D] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </motion.button>

            {/* CARD 3: Plan */}
            <motion.button
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setIsPlanModalOpen(true)}
              className="w-full h-[240px] bg-[#0F1621] rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-[#1E293B] hover:border-[#E5A93D]/50 text-left cursor-pointer transition-colors duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1A222C] to-transparent rounded-bl-[100%] flex items-start justify-end p-5 transition-colors group-hover:from-[#E5A93D]/10">
                <BarChart3 className="w-6 h-6 text-gray-600 group-hover:text-[#E5A93D] transition-colors" strokeWidth={2} />
              </div>
              <div className="relative z-10 mt-2">
                <div className="w-14 h-14 rounded-2xl bg-[#1A222C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform origin-bottom-left border border-[#2A3441] group-hover:border-[#E5A93D]/30">
                  <CalendarDays className="w-7 h-7 text-[#E5A93D]" strokeWidth={2.5} />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-[28px] font-black text-white mb-2 leading-none tracking-tight">Plan</h3>
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-200 transition-colors">
                  <span className="text-[15px] font-semibold">Media Spend</span>
                  <div className="w-5 h-5 rounded-full bg-[#1A222C] flex items-center justify-center group-hover:bg-[#E5A93D] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </motion.button>

            {/* CARD 4: Buy */}
            <motion.div variants={cardVariants} className="w-full h-[240px]">
              <Link
                href="/auth"
                className="block w-full h-full bg-[#0F1621] rounded-[32px] p-6 flex flex-col justify-between relative overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-[#1E293B] hover:border-[#E5A93D]/50 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1A222C] to-transparent rounded-bl-[100%] flex items-start justify-end p-5 transition-colors group-hover:from-[#E5A93D]/10">
                  <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-[#E5A93D] transition-colors" strokeWidth={2} />
                </div>
                <div className="relative z-10 mt-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#1A222C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform origin-bottom-left border border-[#2A3441] group-hover:border-[#E5A93D]/30">
                    <FileText className="w-7 h-7 text-[#E5A93D]" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-[28px] font-black text-white mb-2 leading-none tracking-tight">Buy</h3>
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-200 transition-colors">
                    <span className="text-[15px] font-semibold">Media Spots</span>
                    <div className="w-5 h-5 rounded-full bg-[#1A222C] flex items-center justify-center group-hover:bg-[#E5A93D] transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

          </motion.div>
        </div>

        {/* BOTTOM SECTION: Marquee Component */}
        <div className="w-full relative z-10 mt-auto">
          <StateMarquee />
        </div>
      </div>

      {/* Plan Modal Component (Unchanged) */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0F1621] border border-[#2A3441] rounded-[32px] w-full max-w-md overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-[#1E293B] bg-[#1A222C]/30">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                  <CalendarDays className="w-7 h-7 text-[#E5A93D]" /> Plan Campaign
                </h2>
                <button
                  onClick={() => setIsPlanModalOpen(false)}
                  className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handlePlanSubmit} className="p-6 md:p-8">
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                    Estimated Budget
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#E5A93D]" />
                    <input
                      type="number"
                      required
                      min="1000"
                      placeholder="Enter budget (e.g. 50000)"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full pl-14 pr-5 py-5 bg-[#1A222C] border border-[#2A3441] rounded-2xl text-white font-black text-xl focus:outline-none focus:ring-2 focus:ring-[#E5A93D]/50 focus:border-[#E5A93D] transition-all placeholder-gray-600"
                    />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mt-4 leading-relaxed">
                    We will suggest the best locations to maximize your ROI within this budget.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E5A93D] hover:bg-[#F2B950] text-[#0B111A] py-5 rounded-2xl font-black text-lg transition-colors flex items-center justify-center gap-3 group"
                >
                  Start Planning{" "}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}