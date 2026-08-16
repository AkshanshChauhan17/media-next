import Link from "next/link";
import { HelpCircle, User } from "lucide-react";

export default function ConsultationBanner() {
  return (
    <section className="w-full bg-[#0A4D28] mt-8 md:mt-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between relative overflow-visible md:min-h-[340px]">
        
        <div className="relative z-10 max-w-2xl text-white flex flex-col items-start gap-4 py-10 md:py-16 w-full">
          <h2 className="text-[28px] md:text-4xl lg:text-[40px] font-bold leading-[1.2] tracking-tight">
            Confused?<br />
            We can help you plan the perfect campaign!
          </h2>
          
          <p className="text-base md:text-lg lg:text-[18px] text-[#C58B24] font-medium drop-shadow-sm mb-2 md:mb-4 max-w-[95%]">
            Hire our expert media planners to find, plan and place your next promotion.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 w-full">
            <Link
              href="/consult"
              className="bg-[#C58B24] hover:bg-[#b07b1e] transition-colors text-white font-bold text-sm md:text-[13px] px-6 md:px-8 py-3.5 rounded shadow-sm tracking-wide text-center w-full sm:w-auto"
            >
              CONSULT MEDIA PLANNERS
            </Link>
            <div className="bg-[#243839] text-white font-bold text-sm md:text-[13px] px-6 md:px-8 py-3.5 rounded-full shadow-sm tracking-wide text-center w-full sm:w-auto border border-white/5">
              COMPLETELY FREE!
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-end md:absolute md:right-8 lg:right-32 md:bottom-0 mt-6 md:mt-0">
          <div className="w-[280px] md:w-[300px] h-[280px] md:h-[350px] bg-white/5 rounded-t-full border-t border-x border-white/10 flex flex-col items-center justify-end pb-8 text-white/50 relative overflow-hidden backdrop-blur-sm">
            <HelpCircle className="w-8 h-8 absolute top-16 right-16 md:right-20 rotate-12 text-[#C58B24] opacity-90" strokeWidth={2.5} />
            <HelpCircle className="w-5 h-5 absolute top-24 left-16 -rotate-12 text-[#C58B24] opacity-90" strokeWidth={2.5} />
            <User className="w-40 h-40 md:w-48 md:h-48 opacity-20 text-white" strokeWidth={1} />
          </div>
        </div>

      </div>
    </section>
  );
}