"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  TrendingUp, 
  ReceiptText, 
  Headset, 
  LogOut,
  Map
} from "lucide-react";
import { logoutUser } from "@/actions/auth";

export default function AdvertiserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/auth");
  };

  const navItems = [
    { name: "Explore Inventory", href: "/advertiser/search", icon: Search },
    { name: "My Cart", href: "/advertiser/cart", icon: ShoppingCart },
    { name: "Active Campaigns", href: "/advertiser/campaigns", icon: TrendingUp },
    { name: "Invoices", href: "/advertiser/invoices", icon: ReceiptText },
    { name: "Support Tickets", href: "/advertiser/support", icon: Headset },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-black tracking-widest text-[#0A4D28]">BRAND</span>
            <span className="text-[14px] font-black tracking-widest text-[#C58B24]">PORTAL</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? "bg-[#0A4D28] text-white shadow-sm font-bold" 
                    : "text-gray-600 hover:bg-gray-100 font-medium"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5 text-gray-400" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden shadow-sm z-10">
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-black tracking-widest text-[#0A4D28]">BRAND</span>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
        </header>
        <div className="flex-1 overflow-y-auto relative">{children}</div>
      </main>
    </div>
  );
}