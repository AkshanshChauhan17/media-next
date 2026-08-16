import Link from "next/link";
import { Handshake, PieChart, CircleDollarSign, TrendingUp } from "lucide-react";

export default function AgencyPartner() {
  return (
    <section className="max-w-[1600px] bg-white mx-auto px-4 py-8 md:py-12 w-full">
      <div className="bg-[#0A4D28] rounded-[20px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[320px]">
        
        <div className="absolute right-[-10%] md:right-[5%] top-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute right-[0%] md:right-[15%] top-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-white/5 rounded-full pointer-events-none" />
        
        <div className="relative z-10 p-8 md:p-14 lg:p-16 max-w-2xl flex flex-col items-start text-left">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white mb-4 md:mb-5 leading-tight">
            Become an Agency Partner
          </h2>
          <p className="text-[#C58B24] text-base md:text-[19px] leading-relaxed mb-8 font-medium drop-shadow-sm">
            Get exclusive access to Advantage 360 – Plan, Compare & Sell
            Media Smarter with Real-Time Rates & Tools.
          </p>
          <Link
            href="/agency-partner"
            className="bg-[#C58B24] hover:bg-[#b07b1e] transition-colors text-white font-bold text-[13px] md:text-sm px-8 py-3.5 rounded shadow-sm tracking-wide"
          >
            JOIN NOW
          </Link>
        </div>

        <div className="relative z-10 w-full md:w-[40%] flex justify-center items-center p-8 md:p-0 md:pr-16 lg:pr-24 h-full min-h-[250px] md:min-h-0">
          <div className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px]">
            <div className="absolute inset-0 m-auto w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-xl z-20 border-4 border-[#0A4D28]/10 hover:scale-105 transition-transform duration-300">
              <Handshake className="w-16 h-16 md:w-20 md:h-20 text-[#0A4D28]" strokeWidth={1.5} />
            </div>

            <div className="absolute bottom-4 right-0 md:-right-4 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-lg z-30 border-2 border-gray-100 hover:-translate-y-1 transition-transform">
              <PieChart className="w-6 h-6 md:w-8 md:h-8 text-[#C58B24]" strokeWidth={2.5} />
            </div>

            <div className="absolute bottom-8 left-0 md:-left-4 w-12 h-12 md:w-16 md:h-16 bg-[#243839] rounded-full flex items-center justify-center shadow-lg z-30 border-2 border-[#243839]/50 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-center">
                <CircleDollarSign className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-[#C58B24] absolute top-2 right-2 md:top-3 md:right-3" strokeWidth={3} />
              </div>
            </div>

            <div className="absolute top-0 right-4 md:right-8 w-14 h-14 md:w-[72px] md:h-[72px] bg-[#C58B24] rounded-full flex items-center justify-center shadow-lg z-30 border-2 border-[#C58B24]/50 hover:scale-110 transition-transform">
              <div className="flex flex-col items-center justify-center leading-none">
                <span className="text-[12px] md:text-[14px] font-black text-white tracking-widest">BM</span>
                <span className="text-[12px] md:text-[14px] font-black text-[#0A4D28] tracking-widest">AS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}