"use client";

import { X, CheckCircle2, ShieldCheck, Activity, Maximize, MapPin, IndianRupee } from "lucide-react";

interface AdBoard {
  id: string | number;
  location: string;
  city: string;
  base_price: number | string;
  daily_traffic: number | string;
  size: string;
  media_type: string;
  status: 'Vacant' | 'Booked';
}

export default function CompareModal({ 
  items, 
  onClose 
}: { 
  items: AdBoard[], 
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="font-black text-[#243839] text-xl">Compare Adboards</h2>
            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Analyzing {items.length} selected spaces</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div key={item.id} className="border-2 border-gray-100 rounded-2xl p-5 relative bg-white shadow-sm flex flex-col">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#C58B24] text-white rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-sm">
                  {index + 1}
                </div>
                
                <h3 className="font-black text-[#243839] text-lg leading-tight mb-2 line-clamp-2 mt-2">{item.location}</h3>
                <p className="text-[#C58B24] font-bold text-sm mb-6 flex items-center gap-1"><MapPin className="w-4 h-4" /> {item.city}</p>
                
                <div className="space-y-4 flex-1">
                  <div className="pb-3 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Monthly Cost</p>
                    <p className="font-black text-xl text-[#0A4D28] flex items-center gap-1">
                      <IndianRupee className="w-5 h-5" /> {Number(item.base_price).toLocaleString()}
                    </p>
                  </div>
                  <div className="pb-3 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Traffic / Day</p>
                    <p className="font-black text-[#243839] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" /> {Number(item.daily_traffic).toLocaleString()} impressions
                    </p>
                  </div>
                  <div className="pb-3 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p>
                    <p className="font-black text-[#243839] flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-purple-500" /> {item.size}
                    </p>
                  </div>
                  <div className="pb-3 border-b border-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Media Type</p>
                    <p className="font-black text-[#243839] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> {item.media_type}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 ${item.status === 'Vacant' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    <CheckCircle2 className="w-4 h-4" /> {item.status === 'Vacant' ? 'Available Immediately' : 'Booked Currently'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}