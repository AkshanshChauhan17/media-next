"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  FileText,
  IndianRupee,
  BarChart3,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Empowering All To Advertise",
      subtitle: "Buy best media Ad",
    },
    {
      title: "Reach Your Target Audience",
      subtitle: "Plan data-driven campaigns",
    },
    {
      title: "Maximize Your ROI Today",
      subtitle: "Track and optimize performance",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full bg-[#0A4D28] overflow-hidden min-h-[400px] flex items-center">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] border-r-[1px] border-white/10 rotate-12 pointer-events-none" />
      <div className="absolute top-[-20%] left-[10%] w-[40%] h-[150%] border-r-[1px] border-white/10 -rotate-12 pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[30%] h-[150%] border-r-[1px] border-white/10 -rotate-[25deg] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-0 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex-1 w-full max-w-xl text-white">
          <div className="min-h-[160px] flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.1] mb-4 tracking-tight drop-shadow-sm transition-opacity duration-500">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl font-semibold mb-8 text-[#C58B24] drop-shadow-sm transition-opacity duration-500">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={prevSlide} className="hover:text-[#C58B24] transition-colors p-1">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                    currentSlide === index ? "bg-[#C58B24] border-[#C58B24]" : "bg-transparent border-white hover:border-[#C58B24]"
                  }`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="hover:text-[#C58B24] transition-colors p-1">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4 lg:gap-6 justify-end items-center">
          <Link
            href="/find"
            className="w-full sm:w-[190px] h-[210px] bg-white rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-transform border border-transparent hover:border-[#C58B24]/30"
          >
            <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-gray-50 rounded-bl-[100%] flex items-start justify-end p-4 transition-colors group-hover:bg-[#C58B24]/5">
              <IndianRupee className="w-5 h-5 text-[#C58B24]/40 group-hover:text-[#C58B24]" strokeWidth={2} />
            </div>
            <div className="relative z-10">
              <Search className="w-12 h-12 text-[#0A4D28] mb-2 group-hover:scale-110 transition-transform origin-bottom-left" strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <h3 className="text-[26px] font-bold text-[#243839] mb-1 leading-none">Find</h3>
              <div className="flex items-center gap-1.5 text-[#243839]">
                <span className="text-[15px] font-medium">Media Rates</span>
                <div className="w-[18px] h-[18px] rounded-full bg-[#C58B24] flex items-center justify-center group-hover:bg-[#0A4D28] transition-colors">
                  <ChevronRight className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/plan"
            className="w-full sm:w-[190px] h-[210px] bg-white rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-transform border border-transparent hover:border-[#C58B24]/30"
          >
            <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-gray-50 rounded-bl-[100%] flex items-start justify-end p-4 transition-colors group-hover:bg-[#C58B24]/5">
              <BarChart3 className="w-5 h-5 text-[#C58B24]/40 group-hover:text-[#C58B24]" strokeWidth={2} />
            </div>
            <div className="relative z-10">
              <CalendarDays className="w-12 h-12 text-[#0A4D28] mb-2 group-hover:scale-110 transition-transform origin-bottom-left" strokeWidth={2} />
            </div>
            <div className="relative z-10">
              <h3 className="text-[26px] font-bold text-[#243839] mb-1 leading-none">Plan</h3>
              <div className="flex items-center gap-1.5 text-[#243839]">
                <span className="text-[15px] font-medium">Media Spend</span>
                <div className="w-[18px] h-[18px] rounded-full bg-[#C58B24] flex items-center justify-center group-hover:bg-[#0A4D28] transition-colors">
                  <ChevronRight className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/buy"
            className="w-full sm:w-[190px] h-[210px] bg-white rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-transform border border-transparent hover:border-[#C58B24]/30"
          >
            <div className="absolute top-0 right-0 w-[45%] h-[45%] bg-gray-50 rounded-bl-[100%] flex items-start justify-end p-4 transition-colors group-hover:bg-[#C58B24]/5">
              <ShoppingCart className="w-5 h-5 text-[#C58B24]/40 group-hover:text-[#C58B24]" strokeWidth={2} />
            </div>
            <div className="relative z-10">
              <FileText className="w-12 h-12 text-[#0A4D28] mb-2 group-hover:scale-110 transition-transform origin-bottom-left" strokeWidth={2} />
            </div>
            <div className="relative z-10">
              <h3 className="text-[26px] font-bold text-[#243839] mb-1 leading-none">Buy</h3>
              <div className="flex items-center gap-1.5 text-[#243839]">
                <span className="text-[15px] font-medium">Media Spots</span>
                <div className="w-[18px] h-[18px] rounded-full bg-[#C58B24] flex items-center justify-center group-hover:bg-[#0A4D28] transition-colors">
                  <ChevronRight className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}