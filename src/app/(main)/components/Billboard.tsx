"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Percent, MapPin, Megaphone, Zap } from "lucide-react"; // Importing the graphics

export default function LedBillboard() {
  const [currentAd, setCurrentAd] = useState(0);
  const [time, setTime] = useState("");

const ads = [
    {
      id: 1,
      badge: "EXCLUSIVE OFFER",
      icon: Percent,
      topText: "FLAT 10% OFF",
      bottomText: "ALL PREMIUM HOARDINGS",
      footer: "USE CODE: OUTDOOR10 AT CHECKOUT",
      color: "#ff003c", // Neon Red
      glowSize: "30px",
    },
    {
      id: 2,
      badge: "HIGH VISIBILITY",
      icon: MapPin,
      topText: "DOMINATE THE CITY",
      bottomText: "PRIME HIGHWAY LOCATIONS",
      footer: "5M+ DAILY IMPRESSIONS GUARANTEED",
      color: "#E5A93D", // Golden Amber
      glowSize: "40px",
    },
    {
      id: 3,
      badge: "FAST BOOKING",
      icon: Megaphone,
      topText: "YOUR BRAND HERE",
      bottomText: "SEEN BY MILLIONS TODAY",
      footer: "CALL: 1-800-BILLBOARD NOW",
      color: "#00f3ff", // Bright Cyan
      glowSize: "35px",
    },
    {
      id: 4,
      badge: "LOWEST PRICE",
      icon: Zap, // Zap ya IndianRupee icon import kar lena lucide-react se
      topText: "AD STARTS @ ₹69",
      bottomText: "UNBEATABLE DAILY RATES",
      footer: "LIMITED SPACES AVAILABLE",
      color: "#00ff66", // Neon Green
      glowSize: "35px",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  useEffect(() => {
    const clock = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto my-12 flex flex-col items-center">
      
      {/* BILLBOARD FRAME */}
      <div className="relative w-full bg-gradient-to-b from-[#222] via-[#111] to-[#050505] p-3 sm:p-5 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.9)] border-2 border-[#333]">
        
        {/* Frame Screws/Bolts */}
        <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-black shadow-[inset_0_-2px_4px_rgba(0,0,0,0.8)] border border-[#444]" />
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-black shadow-[inset_0_-2px_4px_rgba(0,0,0,0.8)] border border-[#444]" />
        <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-black shadow-[inset_0_-2px_4px_rgba(0,0,0,0.8)] border border-[#444]" />
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-black shadow-[inset_0_-2px_4px_rgba(0,0,0,0.8)] border border-[#444]" />

        {/* Inner Bezel */}
        <div className="relative w-full bg-[#000] p-1 sm:p-2 rounded-lg shadow-[inset_0_10px_30px_rgba(0,0,0,1)]">
          
          {/* THE LED SCREEN */}
          <div className="relative w-full h-[320px] sm:h-[480px] bg-[#020202] overflow-hidden flex flex-col justify-between screen-flicker">
            
            <div className="flex-1 flex items-center justify-center relative z-10 w-full px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAd}
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="flex flex-col items-center justify-center text-center w-full stepped-reveal"
                  style={{ color: ads[currentAd].color }}
                >
                  {/* BADGE (Small Text) */}
                  <span 
                    className="text-sm sm:text-xl font-black tracking-[0.2em] mb-2 sm:mb-3 text-white/90 uppercase"
                    style={{ textShadow: `0 0 3px ${ads[currentAd].color}, 0 0 6px ${ads[currentAd].color}` }}
                  >
                    {ads[currentAd].badge}
                  </span>
                  
                  {/* DYNAMIC ICON/IMAGE (Pixelated Graphic) */}
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="mb-1 sm:mb-2"
                  >
                    {(() => {
                      const IconComponent = ads[currentAd].icon;
                      return (
                        <IconComponent 
                          className="w-12 h-12 sm:w-20 sm:h-20"
                          strokeWidth={2.5}
                          style={{ 
                            // Applying SVG drop-shadow to make the image glow like the text
                            filter: `
                              drop-shadow(0 0 8px ${ads[currentAd].color}) 
                              drop-shadow(0 0 15px ${ads[currentAd].color})
                            ` 
                          }} 
                        />
                      );
                    })()}
                  </motion.div>
                  
                  {/* TOP TEXT (Massive Text) */}
                  <h2 
                    className="text-4xl sm:text-[75px] font-black uppercase tracking-widest leading-[1.1] mb-1 font-mono"
                    style={{
                      textShadow: `
                        0 0 8px ${ads[currentAd].color},
                        0 0 15px ${ads[currentAd].color},
                        0 0 ${ads[currentAd].glowSize} ${ads[currentAd].color}
                      `
                    }}
                  >
                    {ads[currentAd].topText}
                  </h2>
                  
                  {/* BOTTOM TEXT (Medium Text) */}
                  <h3 
                    className="text-lg sm:text-3xl font-bold uppercase tracking-[0.15em] text-white/95 mt-1"
                    style={{ textShadow: `0 0 4px ${ads[currentAd].color}, 0 0 10px ${ads[currentAd].color}` }}
                  >
                    {ads[currentAd].bottomText}
                  </h3>
                  
                  {/* PROMO BOX (Small Text) */}
                  <div className="mt-4 sm:mt-6 px-4 py-2 sm:px-6 sm:py-3 border-2 border-dashed rounded-lg bg-black/40" style={{ borderColor: ads[currentAd].color }}>
                    <p 
                      className="text-xs sm:text-xl font-black tracking-widest uppercase"
                      style={{ textShadow: `0 0 3px ${ads[currentAd].color}, 0 0 6px ${ads[currentAd].color}` }}
                    >
                      {ads[currentAd].footer}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Permanent Billboard Footer Strip */}
            <div className="h-8 sm:h-12 w-full border-t-2 border-[#111] bg-[#050505] z-10 flex items-center justify-between px-6 text-[#E5A93D] font-mono text-[10px] sm:text-base font-bold tracking-widest" style={{ textShadow: "0 0 3px #E5A93D, 0 0 8px #E5A93D" }}>
              <span>WWW.ADSPACE.COM</span>
              <span className="animate-pulse">{time || "LIVE"}</span>
            </div>

            {/* OVERLAYS FOR EXTREME REALISM */}
            <div className="absolute inset-0 pointer-events-none z-20 cabinet-grid opacity-60" />
            <div className="absolute inset-0 pointer-events-none z-30 pixel-grid" />
            <div className="absolute inset-0 pointer-events-none z-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] mix-blend-multiply" />
            <div className="absolute inset-0 pointer-events-none z-40 scanlines opacity-20" />
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] rotate-12 pointer-events-none z-50 bg-gradient-to-b from-white/5 to-transparent opacity-30" />
          </div>
        </div>
      </div>

      {/* BILLBOARD POLE / STAND */}
      <div className="w-40 sm:w-56 h-20 sm:h-32 bg-gradient-to-r from-[#0a0a0a] via-[#333] to-[#0a0a0a] border-l-2 border-r-2 border-[#222] shadow-2xl relative z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-30 mix-blend-overlay" />
      </div>
      <div className="w-56 sm:w-72 h-6 sm:h-8 bg-gradient-to-r from-[#050505] via-[#222] to-[#050505] rounded-t-lg shadow-2xl relative z-0 border-t border-[#444] border-b-4 border-black" />

      <style jsx global>{`
        .pixel-grid {
          background-image: radial-gradient(
            circle at center, 
            transparent 45%, 
            rgba(0, 0, 0, 0.75) 70%
          );
          background-size: 4px 4px; 
          background-position: center;
        }

        .cabinet-grid {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.9) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.9) 1px, transparent 1px);
          background-size: 80px 80px; 
          background-position: center;
        }

        .stepped-reveal {
          animation: pixelWipe 0.6s steps(20, end) forwards;
        }

        @keyframes pixelWipe {
          0% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0% 0 0); }
        }

        .screen-flicker {
          animation: flicker 0.12s infinite alternate;
        }

        @keyframes flicker {
          0% { opacity: 0.94; }
          100% { opacity: 1; }
        }

        .scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0,0,0,0.3) 50%,
            rgba(0,0,0,0.3)
          );
          background-size: 100% 6px;
          animation: scanline-move 5s linear infinite;
        }

        @keyframes scanline-move {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
      `}</style>
    </div>
  );
}