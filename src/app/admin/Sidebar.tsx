// 2. src/app/admin/Sidebar.tsx
"use client";

import { LayoutDashboard, FolderTree, Image as ImageIcon, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin' && pathname !== '/admin') return false;
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-[#142642] text-white flex flex-col min-h-screen sticky top-0">
      <div className="p-6 text-2xl font-bold border-b border-white/10 text-[#55C274]">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-2">
        <Link 
          href="/admin" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('/admin') && pathname === '/admin' ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link 
          href="/admin/categories" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('/admin/categories') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'
          }`}
        >
          <FolderTree className="w-5 h-5" />
          Categories
        </Link>
        <Link 
          href="/admin/media" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('/admin/media') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          Media Inventory
        </Link>
        <Link 
          href="/admin/contact" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive('/admin/settings') ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-300'
          }`}
        >
          <Settings className="w-5 h-5" />
          Contact
        </Link>
      </nav>
      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-white/5 rounded-lg text-red-400 font-medium transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}