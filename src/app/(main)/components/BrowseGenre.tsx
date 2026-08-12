import Link from "next/link";
import { 
  Newspaper, 
  Radio, 
  Tv, 
  MonitorSmartphone, 
  MapPin, 
  Clapperboard, 
  BookOpen, 
  Users 
} from "lucide-react";

export default function BrowseGenre() {
  const genres = [
    { name: "NEWSPAPER", icon: Newspaper, href: "/newspaper" },
    { name: "RADIO", icon: Radio, href: "/radio" },
    { name: "TELEVISION", icon: Tv, href: "/television" },
    { name: "DIGITAL", icon: MonitorSmartphone, href: "/digital" },
    { name: "OUTDOOR", icon: MapPin, href: "/outdoor" },
    { name: "CINEMA", icon: Clapperboard, href: "/cinema" },
    { name: "MAGAZINE", icon: BookOpen, href: "/magazine" },
    { name: "INFLUENCER", icon: Users, href: "/influencer" },
  ];

  return (
    <section className="max-w-[1600px] mx-auto px-4 py-10 md:py-16 w-full">
      <h2 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-6 md:mb-8">
        Browse Media by Genre
      </h2>
      
      {/* 2 columns on mobile, 4 on tablet, 8 on desktop to fill the screen perfectly */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 w-full">
        {genres.map((genre) => {
          const Icon = genre.icon;
          return (
            <Link
              key={genre.name}
              href={genre.href}
              className="bg-white border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgb(91,70,223,0.15)] hover:-translate-y-1 hover:border-[#5B46DF]/30 transition-all duration-300 h-[120px] flex flex-col items-center justify-center gap-3 rounded-xl group"
            >
              <div className="w-12 h-12 rounded-full bg-[#F4F4F6] group-hover:bg-[#5B46DF] transition-colors duration-300 flex items-center justify-center">
                <Icon 
                  className="w-[22px] h-[22px] text-[#5B46DF] group-hover:text-white transition-colors duration-300" 
                  strokeWidth={2} 
                />
              </div>
              <span className="text-gray-600 group-hover:text-[#5B46DF] text-[11px] md:text-xs font-bold tracking-wider transition-colors duration-300">
                {genre.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}