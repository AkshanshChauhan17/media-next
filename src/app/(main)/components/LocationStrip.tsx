import Link from "next/link";
import { MapPin, ChevronDown } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache"; 
import { getActiveLocations } from "@/actions/media";

type LocationData = {
  state: string;
  cities: string[];
};

export default async function LocationStrip() {
  noStore(); 

  let locations: LocationData[] = [];
  
  try {
    const res = await getActiveLocations();
    if (res.success && Array.isArray(res.data)) {
      locations = res.data as LocationData[];
    }
  } catch (error) {}

  return (
    <div className="w-full bg-[#0B111A] text-white shadow-md border-b border-[#1E293B] relative z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-start lg:justify-center gap-2 sm:gap-6 overflow-x-auto lg:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        <Link
          href="/media"
          className="flex items-center gap-2 text-gray-300 hover:text-[#E5A93D] transition-colors py-2 px-3 sm:px-4 rounded-full hover:bg-[#1A222C] whitespace-nowrap group shrink-0"
        >
          <MapPin className="w-4 h-4 md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          <span className="text-[13px] md:text-sm font-bold tracking-wide uppercase">
            All Locations
          </span>
        </Link>

        {locations.map((loc) => (
          <div key={loc.state} className="group relative shrink-0">
            <div className="flex items-center gap-1.5 text-gray-300 hover:text-[#E5A93D] transition-colors py-2 px-3 sm:px-4 rounded-full hover:bg-[#1A222C] cursor-pointer whitespace-nowrap">
              <span className="text-[13px] md:text-sm font-bold tracking-wide uppercase">
                {loc.state}
              </span>
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </div>

            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-[#0F1621] border border-[#2A3441] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden min-w-[220px] py-2 relative before:absolute before:-top-3 before:left-0 before:w-full before:h-3">
                {loc.cities.map((city) => (
                  <Link
                    key={city}
                    href={`/media?city=${encodeURIComponent(city)}`}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1A222C] transition-colors w-full"
                  >
                    <MapPin className="w-4 h-4 text-[#E5A93D]" strokeWidth={2} />
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        {locations.length === 0 && (
          <span className="text-[13px] md:text-sm text-[#E5A93D] font-bold tracking-wide animate-pulse px-4 shrink-0">
            Loading Locations...
          </span>
        )}
      </div>
    </div>
  );
}