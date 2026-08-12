// 4. src/app/admin/page.tsx
import { getAdminData } from "@/actions/admin";
import { FolderTree, LayoutGrid, CheckCircle2, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";

type RecentMediaItem = {
  id: string | number;
  title: string;
  price?: string | number;
  category_name: string;
  location_city?: string;
};

export default async function AdminDashboard() {
  const { stats, recentMedia } = await getAdminData();

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto w-full">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#142642] tracking-tight mb-2">Command Center</h1>
          <p className="text-gray-500 font-medium">System Overview and recent database activities.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#EAF5FC] text-[#2B9BE4] px-4 py-2 rounded-full text-sm font-bold shadow-sm">
          <Activity className="w-4 h-4" /> System Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#F3EFFF] text-[#5B46DF] rounded-full flex items-center justify-center mb-4">
            <FolderTree className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-extrabold text-[#142642]">{stats.totalCategories}</h3>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2 mb-4">Total Categories</p>
          <Link href="/admin/categories" className="text-[#5B46DF] font-bold text-sm hover:underline">Manage Categories →</Link>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#EBF7F4] text-[#55C274] rounded-full flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <h3 className="text-4xl font-extrabold text-[#142642]">{stats.totalMedia}</h3>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-2 mb-4">Total Media Ads</p>
          <Link href="/admin/media" className="text-[#55C274] font-bold text-sm hover:underline">Manage Media Inventory →</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#5B46DF]" />
              <h3 className="font-bold text-[#142642]">Recently Added Inventory</h3>
            </div>
            <Link href="/admin/media" className="text-sm font-bold text-[#5B46DF] hover:underline">View All</Link>
          </div>
          <div className="p-2">
            {recentMedia.length > 0 ? (
              recentMedia.map((item: RecentMediaItem) => (
                <div key={item.id} className="flex flex-col p-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[#142642] text-sm leading-tight">{item.title}</span>
                    <span className="text-xs font-bold text-[#55C274] bg-[#55C274]/10 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                      ₹{item.price?.toLocaleString('en-IN') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <span>{item.category_name}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{item.location_city || 'Pan India'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm font-medium">
                No inventory added yet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#142642] rounded-xl shadow-lg p-8 text-white relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
          <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-[#55C274]" />
            System Optimized
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your marketplace database is running securely. Use the left panel to navigate to specific sections to add, update, or delete entries.
          </p>
        </div>
      </div>
    </div>
  );
}