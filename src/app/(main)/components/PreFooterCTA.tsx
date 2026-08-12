"use client";

import { ChevronsUp, User } from "lucide-react";
import Link from "next/link";

export default function PreFooterCTA() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full flex flex-col items-center pt-8">
      <button
        onClick={scrollToTop}
        className="text-[#382991] flex items-center gap-1.5 font-semibold text-sm md:text-[15px] mb-4 hover:text-[#5B46DF] transition-colors"
      >
        Move To Top <ChevronsUp className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
      </button>

      <div className="w-full bg-[#5B46DF] relative flex justify-center py-12 md:py-16 px-4 overflow-visible md:min-h-[260px]">
        
        <div className="max-w-[1000px] w-full flex flex-col items-center md:items-start lg:items-center relative z-10 lg:-ml-32">
          
          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 mb-6 md:mb-8">
            <h3 className="text-white text-2xl md:text-3xl lg:text-[32px] font-bold tracking-tight">
              Looking for more information?
            </h3>
            <Link
              href="/contact"
              className="bg-[#55C274] hover:bg-[#4ab065] transition-colors text-white px-6 md:px-8 py-2.5 md:py-3 rounded shadow-sm font-bold text-sm md:text-[15px] tracking-wide"
            >
              CONTACT US
            </Link>
          </div>

          <div className="w-full h-px bg-white/30 mb-6 md:mb-8 max-w-[700px]"></div>

          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-white w-full max-w-[700px] justify-center md:justify-start lg:justify-center">
            <span className="font-bold text-lg md:text-xl tracking-wide">Follow Us</span>
            <div className="flex items-center gap-4 md:gap-5">
              <a href="#" className="hover:opacity-80 transition-opacity bg-transparent border-2 border-white rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity bg-transparent border-2 border-white rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity bg-transparent border-2 border-white rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity bg-transparent border-2 border-white rounded-full p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="hidden md:flex absolute bottom-0 right-[5%] lg:right-[15%] w-[220px] lg:w-[260px] h-[300px] bg-white/10 rounded-t-[120px] items-center justify-center backdrop-blur-sm border-t border-x border-white/20 z-0">
          <User className="w-32 h-32 text-white/40" />
        </div>
      </div>
    </section>
  );
}