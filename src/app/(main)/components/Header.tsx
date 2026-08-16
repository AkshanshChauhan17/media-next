import Link from "next/link";
import { Menu, Search, User, ShoppingBag, Monitor, MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white text-[#243839] sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-[#0A4D28] hover:text-[#C58B24] transition-colors">
            <Menu className="w-6 h-6 md:w-7 md:h-7" />
          </button>
          
          <Link href="/" className="flex items-center gap-1 md:gap-2">
            <div className="relative hidden sm:flex items-center justify-center">
              <Monitor className="w-7 h-7 md:w-8 md:h-8 text-[#0A4D28]" strokeWidth={1.5} />
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#C58B24] absolute -bottom-1" fill="#C58B24" />
            </div>
            
            <div className="flex items-center text-xl md:text-2xl font-bold tracking-tight mt-1">
              <span className="text-[#0A4D28]">Bookmy</span>
              <span className="text-[#C58B24]">ad</span>
              <span className="text-[#243839]">Space</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-3xl relative mx-4 lg:mx-8">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C58B24]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder='Search ad spaces anywhere, anytime...'
            className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-full py-2.5 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] transition-all"
          />
        </div>

        <div className="flex items-center gap-5 md:gap-8 text-sm md:text-base font-semibold">
          <Link href="/contact" className="hidden lg:block hover:text-[#C58B24] transition-colors">
            Contact Us
          </Link>
          <Link href="/login" className="flex items-center gap-2 hover:text-[#C58B24] transition-colors group">
            <User className="w-5 h-5 md:w-6 md:h-6 text-[#0A4D28] group-hover:text-[#C58B24] transition-colors" />
            <span className="hidden sm:block">Login</span>
          </Link>
          <Link href="/bag" className="flex items-center gap-2 hover:text-[#C58B24] transition-colors group">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-[#0A4D28] group-hover:text-[#C58B24] transition-colors" />
            <span className="hidden sm:block">Your Bag</span>
          </Link>
        </div>
      </div>

      <div className="block md:hidden px-4 pb-3 bg-white">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C58B24]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder='Search ad spaces...'
            className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-full py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] transition-all"
          />
        </div>
      </div>
    </header>
  );
}