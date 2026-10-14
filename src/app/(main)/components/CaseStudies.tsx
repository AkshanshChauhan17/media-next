"use client";

import { useRef, useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  X,
  TrendingUp,
  MapPin,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CaseStudy {
  id: number;
  brand: string;
  title: string;
  category: string;
  duration: string;
  cities: string;
  metrics: { label: string; value: string }[];
  challenge: string;
  execution: string[];
  results: string[];
}

export default function CaseStudies() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  useEffect(() => {
    if (selectedStudy) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedStudy]);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const caseStudies: CaseStudy[] = [
    {
      id: 1,
      brand: "MOVADO",
      title: "Dissecting Movado's Awareness & Consideration Marketing Campaign",
      category: "Luxury Retail & OOH",
      duration: "6 Weeks",
      cities: "Mumbai, Delhi NCR, Bengaluru",
      metrics: [
        { label: "Total Impressions", value: "18.4M+" },
        { label: "Store Footfall Lift", value: "+42%" },
        { label: "Brand Search Spike", value: "3.1x" },
      ],
      challenge:
        "Movado aimed to strengthen brand desirability among affluent urban professionals during the festive luxury buying season across top metro corridors.",
      execution: [
        "Deployed high-impact backlit hoardings and digital screens across premium airport lounges, business districts, and luxury mall facades.",
        "Synchronized evening illumination timings with peak corporate commute hours along Bandra-Worli Sea Link and Cyber Hub.",
      ],
      results: [
        "Achieved a 42% surge in flagship store walk-ins across targeted metro zones.",
        "Dominated share-of-voice in the luxury timepiece category throughout the 6-week burst.",
        "Generated 3.1x higher direct brand searches compared to pre-campaign benchmarks.",
      ],
    },
    {
      id: 2,
      brand: "POPEYES",
      title: "Dissecting Popeyes Influencer Marketing Campaign",
      category: "QSR Launch & Transit",
      duration: "4 Weeks",
      cities: "Bengaluru, Chennai, Hyderabad",
      metrics: [
        { label: "Reach Generated", value: "12.8M+" },
        { label: "Opening Week Sales", value: "+215%" },
        { label: "Social Mentions", value: "45K+" },
      ],
      challenge:
        "Popeyes wanted to build massive local buzz and long store queues ahead of new flagship store launches across South Indian metros.",
      execution: [
        "Combined hyper-local directional billboards within a 3km radius of new outlets with regional creator amplification.",
        "Executed high-frequency metro train wraps and bus shelter takeovers targeting college students and young professionals.",
      ],
      results: [
        "Record-breaking opening week footfall with 215% higher order volume than projected.",
        "Outdoor creatives became viral backdrops for local food influencers and customer selfies.",
        "Sustained a 38% repeat store visit rate in the first month post-launch.",
      ],
    },
    {
      id: 3,
      brand: "Nepa Rudraksha",
      title: "Dissecting Nepa Rudraksha Influencer Marketing Campaign",
      category: "Heritage & High-Trust OOH",
      duration: "8 Weeks",
      cities: "Delhi, Varanasi, Ahmedabad, Mumbai",
      metrics: [
        { label: "Verified Reach", value: "9.6M+" },
        { label: "Consultation Bookings", value: "+180%" },
        { label: "ROAS Achieved", value: "4.8x" },
      ],
      challenge:
        "Establishing credibility, authenticity, and high-ticket consultation trust among spiritual and wellness audiences across key Indian cities.",
      execution: [
        "Placed authoritative large-format hoardings along major arterial highways and airport arrival terminals.",
        "Integrated QR-enabled callouts on unipoles allowing instant verification and private consultation scheduling.",
      ],
      results: [
        "180% increase in high-intent online and offline consultation bookings.",
        "4.8x return on ad spend driven by premium collector purchases.",
        "Significantly elevated brand authority against unorganized local competitors.",
      ],
    },
    {
      id: 4,
      brand: "Brand Name",
      title: "Lead Generation Performance Campaign Success Story",
      category: "Performance Outdoor",
      duration: "5 Weeks",
      cities: "Pan-India (Top 8 Metros)",
      metrics: [
        { label: "Total Impressions", value: "24.2M+" },
        { label: "Qualified Leads", value: "+310%" },
        { label: "CAC Reduction", value: "-34%" },
      ],
      challenge:
        "Lowering customer acquisition costs (CAC) while scaling high-intent inbound leads in a saturated digital advertising market.",
      execution: [
        "Selected 65+ high-dwell-time traffic junctions and flyover gantries using real-time vehicular density heatmaps.",
        "Used bold, minimal copy with memorable vanity URLs and localized callouts for each city cluster.",
      ],
      results: [
        "310% jump in direct organic and inbound lead volume within 30 days.",
        "Reduced blended digital and offline customer acquisition cost by 34%.",
        "Established 24/7 unskippable presence across 8 major commercial hubs.",
      ],
    },
  ];

  return (
    <>
      <section className="w-full bg-[#EEF2F6] py-16 md:py-24 border-b border-slate-300/80 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#94A3B8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 md:mb-14"
          >
            <div>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-200/90 border border-slate-300/80 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E5A93D]" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0B111A]">
                  Proven Impact
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#0B111A] tracking-tighter leading-none">
                Case <span className="text-[#E5A93D]">Studies</span>
              </h2>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={scrollLeft}
                className="w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-[#0B111A] text-[#0B111A] hover:text-white transition-all duration-300 border border-slate-300/80 hover:border-[#0B111A] active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-[#0B111A] text-[#0B111A] hover:text-white transition-all duration-300 border border-slate-300/80 hover:border-[#0B111A] active:scale-95"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>

          <div className="relative group">
            <div
              ref={scrollContainerRef}
              className="flex gap-5 md:gap-7 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-8 pt-2 px-1"
            >
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="min-w-[290px] sm:min-w-[350px] md:min-w-[390px] max-w-[390px] flex-shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedStudy(study)}
                    className="w-full h-full text-left bg-[#F8FAFC] hover:bg-white rounded-[28px] p-3.5 cursor-pointer group/card flex flex-col justify-between border border-slate-300/80 shadow-[0_10px_30px_rgba(15,22,33,0.05)] hover:shadow-[0_24px_50px_rgba(11,17,26,0.12)] hover:-translate-y-2 hover:border-[#E5A93D] transition-all duration-500"
                  >
                    <div className="w-full">
                      <div className="w-full h-[190px] md:h-[215px] bg-gradient-to-br from-[#0B111A] via-[#131D2B] to-[#1E293B] rounded-[20px] relative flex items-center justify-center overflow-hidden border border-[#2A3441]">
                        <div className="absolute inset-0 opacity-15 pointer-events-none">
                          <div className="absolute top-4 right-8 w-32 h-[2px] bg-white rotate-45" />
                          <div className="absolute bottom-8 left-12 w-40 h-[2px] bg-white -rotate-12" />
                          <div className="absolute top-1/2 right-1/4 w-48 h-[2px] bg-[#E5A93D] rotate-[15deg]" />
                        </div>

                        <div className="absolute top-3.5 left-4 flex flex-col leading-none z-10">
                          <span className="text-[10px] font-black text-white tracking-widest">
                            BM
                          </span>
                          <span className="text-[10px] font-black text-[#E5A93D] tracking-widest">
                            AS
                          </span>
                        </div>

                        <span className="absolute top-3.5 right-3.5 bg-white/10 backdrop-blur-md text-[#E5A93D] border border-white/15 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
                          {study.metrics[0].value} Reach
                        </span>

                        <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] z-10 p-3 text-center group-hover/card:scale-110 group-hover/card:ring-4 group-hover/card:ring-[#E5A93D]/40 transition-all duration-500">
                          <span className="font-black text-[#0B111A] text-sm md:text-lg leading-tight tracking-tight px-1">
                            {study.brand}
                          </span>
                        </div>

                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E5A93D]/40 to-transparent z-0" />
                      </div>

                      <div className="px-2 pt-5 pb-4">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E5A93D] block mb-1.5">
                          {study.category}
                        </span>
                        <h3 className="font-black text-[#0B111A] text-base md:text-lg leading-snug group-hover/card:text-[#E5A93D] transition-colors duration-300 line-clamp-2">
                          {study.title}
                        </h3>
                      </div>
                    </div>

                    <div className="w-full px-2 pb-1 pt-3 border-t border-slate-200/90 flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 group-hover/card:text-[#0B111A] transition-colors">
                        View Case Study
                      </span>
                      <div className="w-9 h-9 rounded-full bg-slate-200/70 border border-slate-300/80 flex items-center justify-center group-hover/card:bg-[#0B111A] group-hover/card:border-[#0B111A] transition-all duration-300">
                        <ArrowUpRight
                          className="w-4 h-4 text-[#0B111A] group-hover/card:text-[#E5A93D] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-all duration-300"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStudy(null)}
            className="fixed inset-0 z-[100] bg-[#0B111A]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F8FAFC] border border-slate-300 rounded-[32px] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.45)] relative"
            >
              <div className="relative bg-gradient-to-br from-[#0B111A] via-[#131D2B] to-[#1E293B] p-6 sm:p-10 shrink-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#E5A93D]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E5A93D] text-[#0B111A] text-xs font-black uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5" />
                      {selectedStudy.brand}
                    </span>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {selectedStudy.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedStudy(null)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0B111A] flex items-center justify-center transition-all duration-200"
                  >
                    <X className="w-5 h-5" strokeWidth={2.5} />
                  </button>
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-5 relative z-10">
                  {selectedStudy.title}
                </h2>

                <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-gray-300 relative z-10">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#E5A93D]" />
                    {selectedStudy.cities}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#E5A93D]" />
                    Duration: {selectedStudy.duration}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-10 overflow-y-auto space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {selectedStudy.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {metric.label}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-[#0B111A] mt-1 flex items-center gap-1.5">
                        {metric.value}
                        <TrendingUp className="w-5 h-5 text-[#E5A93D]" />
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0B111A] flex items-center gap-2 mb-2.5">
                    <Target className="w-4 h-4 text-[#E5A93D]" />
                    The Challenge
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                    {selectedStudy.challenge}
                  </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#0B111A] mb-3.5">
                    Strategic Execution
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedStudy.execution.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm font-medium text-slate-600 leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#EEF2F6] text-[#0B111A] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#0B111A] text-white rounded-2xl p-5 sm:p-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#E5A93D] mb-4">
                    Key Results & Impact
                  </h4>
                  <ul className="space-y-3">
                    {selectedStudy.results.map((result, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm font-bold text-gray-100"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#E5A93D] shrink-0 mt-0.5" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 sm:px-10 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-slate-400">
                  BookmyadSpace Verified Case Study
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedStudy(null)}
                  className="px-6 py-2.5 rounded-full bg-[#0B111A] hover:bg-[#E5A93D] text-white hover:text-[#0B111A] font-black text-xs uppercase tracking-widest transition-colors duration-300"
                >
                  Close Case Study
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}