"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, User, Monitor, MapPin, Loader2, Image as ImageIcon, X } from "lucide-react";
import { searchHoardings } from "@/actions/media";

const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="text-[#E5A93D] font-black bg-[#E5A93D]/15 px-1 rounded-sm">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

interface SearchSuggestion {
  id: number;
  city: string;
  location: string;
  image_url?: string;
}

function SearchBar({ isMobile }: { isMobile?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      setIsLoading(true);
      setShowDropdown(true);
      
      const res = await searchHoardings(query);
      if (res.success && Array.isArray(res.data)) {
        setSuggestions(res.data as SearchSuggestion[]);
      }
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSuggestionClick = (id: number) => {
    setShowDropdown(false);
    setQuery("");
    router.push(`/media/${id}`);
  };

  return (
    <div 
      ref={searchRef}
      className={`relative ${isMobile ? "w-full" : "flex-1 max-w-2xl mx-4 lg:mx-8"}`}
    >
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-gray-400`}>
        <Search className={isMobile ? "w-[18px] h-[18px]" : "w-5 h-5"} />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        placeholder="Search by city, location or ad format..."
        className={`w-full bg-[#1C2433] border-none text-gray-200 placeholder-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-[#2A3441] transition-all font-normal ${
          isMobile ? "py-3.5 pl-12 pr-4 text-[15px]" : "py-3.5 pl-12 pr-6 text-[15px]"
        }`}
      />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#0F1621] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#2A3441] overflow-hidden z-50">
          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-[#E5A93D]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#2A3441] [&::-webkit-scrollbar-thumb]:rounded-full">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSuggestionClick(item.id)}
                  className="w-full text-left px-4 py-3 hover:bg-[#1A222C] transition-colors flex items-center justify-between gap-4 border-b border-[#1A222C] last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-100 truncate">
                      <HighlightMatch text={item.city} query={query} />
                    </h4>
                    <p className="text-xs font-medium text-gray-400 truncate mt-0.5">
                      <HighlightMatch text={item.location} query={query} />
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1A222C] flex-shrink-0 border border-[#2A3441] flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.city} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm font-bold text-gray-400">
              No ad spaces found for <span className="text-white">{query}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-[#0B111A] text-white sticky top-0 z-50 border-b border-[#1E293B] shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 h-24 md:h-20 flex items-center justify-between gap-4">
        
        {/* Left Side: LOGO with Tagline */}
        <Link href="/" className="flex items-start gap-1 md:gap-2">
          <div className="relative flex items-center justify-center mt-1">
            <MapPin className="w-6 h-6 md:w-7 md:h-7 text-[#E5A93D]" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center text-xl md:text-2xl font-bold tracking-tight">
              <span className="text-white">Bookmy</span>
              <span className="text-white mr-1"> </span>
              <span className="text-[#E5A93D]">Ad</span>
              <span className="text-white">Space</span>
            </div>
            
            {/* Tagline section mimicking the image design */}
            <div className="flex flex-col mt-0.5 text-[9px] md:text-[11px] text-gray-400 font-medium leading-[1.2] tracking-wide">
              <span>Ad Ka Space? BookMyAdSpace.</span>
              <span>Advertise Anywhere, Anytime.</span>
            </div>
          </div>
        </Link>

        {/* Center: Desktop Search Bar */}
        <div className="hidden md:flex flex-1 justify-center">
          <SearchBar isMobile={false} />
        </div>

        {/* Right Side: Navigation Links & Mobile Hamburger Menu */}
        <div className="flex items-center gap-5 md:gap-8">
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5 md:gap-8 text-sm md:text-base font-medium">
            <Link href="/contact" className="hidden lg:block text-gray-300 hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="/auth" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
              <User className="w-5 h-5 md:w-5 md:h-5 group-hover:text-[#E5A93D] transition-colors" />
              <span className="hidden sm:block">Sign In</span>
            </Link>
            <Link href="/campaign" className="hidden md:flex items-center justify-center bg-[#E5A93D] hover:bg-[#F2B950] text-[#0B111A] px-6 py-2.5 rounded-full font-bold transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white transition-colors p-1 -mr-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7" strokeWidth={1.5} />
            ) : (
              <Menu className="w-7 h-7" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Container */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#1E293B] bg-[#0B111A] px-4 py-5 flex flex-col gap-5 animate-in slide-in-from-top-2 duration-200">
          <Link 
            href="/contact" 
            className="text-gray-300 hover:text-white transition-colors text-[15px] font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
          <div className="h-px bg-[#1E293B] w-full" />
          <Link 
            href="/auth" 
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-[15px] font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User className="w-5 h-5" />
            Sign In
          </Link>
          <div className="h-px bg-[#1E293B] w-full" />
          <Link 
            href="/campaign" 
            className="flex items-center justify-center bg-[#E5A93D] hover:bg-[#F2B950] text-[#0B111A] px-6 py-3 rounded-full font-bold transition-colors w-full text-[15px] mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}

      {/* Bottom: Mobile Search Bar */}
      <div className="block md:hidden px-4 pb-4 bg-[#0B111A]">
        <SearchBar isMobile={true} />
      </div>
    </header>
  );
}