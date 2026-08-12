import Link from "next/link";
import { Menu, Search, User, ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-brand-purple text-white sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-white hover:opacity-80 transition-opacity">
            <Menu className="w-6 h-6 md:w-7 md:h-7" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-8 h-8 md:w-9 md:h-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v2m0 10v4m-3-14a3 3 0 116 0 3 3 0 01-6 0zm-3 8a6 6 0 1112 0 6 6 0 01-12 0zm-2 2l2-2m14 2l-2-2m-14-6l2 2m10-2l2 2"
              />
            </svg>
            <div className="flex flex-col leading-[1.1] font-bold tracking-[0.15em] text-[10px] md:text-xs mt-1">
              <span>THE</span>
              <span>MEDIA</span>
              <span>ANT</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-3xl relative mx-4 lg:mx-8">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder='Search "India Today"'
            className="w-full bg-white text-gray-900 rounded-full py-2.5 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        <div className="flex items-center gap-5 md:gap-8 text-sm md:text-base font-medium">
          <Link href="/contact" className="hidden lg:block hover:opacity-80 transition-opacity">
            Contact Us
          </Link>
          <Link href="/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <User className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden sm:block">Login</span>
          </Link>
          <Link href="/bag" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden sm:block">Your Bag</span>
          </Link>
        </div>
      </div>

      <div className="block md:hidden px-4 pb-3">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder='Search "India Today"'
            className="w-full bg-white text-gray-900 rounded-full py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}