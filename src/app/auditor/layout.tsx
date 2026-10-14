"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  MapPinCheck, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  LogOut 
} from "lucide-react";
import { logoutUser } from "@/actions/auth";

export default function AuditorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/auth");
  };

  const navItems = [
    { name: "Assigned Campaigns", href: "/auditor/campaigns", icon: LayoutDashboard },
    { name: "Site Verification", href: "/auditor/verify", icon: MapPinCheck },
    { name: "Audit Reports", href: "/auditor/reports", icon: FileCheck2 },
    { name: "Damage Reporting", href: "/auditor/damages", icon: AlertTriangle },
    { name: "Completion Reports", href: "/auditor/completions", icon: CheckCircle2 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-[#243839] text-white flex flex-col hidden md:flex flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-[#0A4D28]">
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-black tracking-widest text-white">FIELD</span>
            <span className="text-[14px] font-black tracking-widest text-[#C58B24]">AUDITOR</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? "bg-[#C58B24] text-white font-bold" : "text-gray-300 hover:bg-white/5 hover:text-white font-medium"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#C58B24]"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
          <div className="flex flex-col leading-none">
            <span className="text-[14px] font-black tracking-widest text-[#0A4D28]">FIELD</span>
            <span className="text-[14px] font-black tracking-widest text-[#C58B24]">AUDITOR</span>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}