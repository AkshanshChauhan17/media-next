"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Wallet, 
  ShieldAlert, 
  Headset,
  LogOut,
  ClipboardList,
  Phone
} from "lucide-react";
import { logoutUser } from "@/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/auth");
  };

  const navItems = [
    { name: "Master Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users & KYC", href: "/admin/users", icon: Users },
    { name: "Global Inventory", href: "/admin/inventory", icon: Map },
    { name: "Financials & Payouts", href: "/admin/financials", icon: Wallet },
    { name: "Fraud & Audit Logs", href: "/admin/fraud", icon: ShieldAlert },
    { name: "Support Desk", href: "/admin/support", icon: Headset },
    { name: "Auditor Dispatch", href: "/admin/assignments", icon: ClipboardList },
    { name: "User Contact", href: "/admin/contact", icon: Phone },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-[#111827] text-white flex flex-col hidden md:flex flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-[#0A4D28]">
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-black tracking-widest text-white">SUPER</span>
            <span className="text-[14px] font-black tracking-widest text-[#C58B24]">ADMIN</span>
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
                    ? "bg-[#C58B24] text-white font-bold" 
                    : "text-gray-300 hover:bg-white/10 font-medium"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden shadow-sm z-10">
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-black tracking-widest text-[#0A4D28]">SUPER ADMIN</span>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}