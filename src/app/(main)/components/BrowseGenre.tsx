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
      <h2 className="text-xl md:text-2xl font-bold text-[#243839] mb-6 md:mb-8">
        Browse Media by Genre
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 w-full">
        {genres.map((genre) => {
          const Icon = genre.icon;
          return (
            <Link
              key={genre.name}
              href={genre.href}
              className="bg-white border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(10,77,40,0.12)] hover:-translate-y-1 hover:border-[#C58B24]/40 transition-all duration-300 h-[120px] flex flex-col items-center justify-center gap-3 rounded-xl group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-[#0A4D28] transition-colors duration-300 flex items-center justify-center">
                <Icon 
                  className="w-[22px] h-[22px] text-[#C58B24] group-hover:text-white transition-colors duration-300" 
                  strokeWidth={2} 
                />
              </div>
              <span className="text-[#243839] group-hover:text-[#0A4D28] text-[11px] md:text-xs font-bold tracking-wider transition-colors duration-300">
                {genre.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}