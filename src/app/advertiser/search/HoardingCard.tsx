"use client";

import Link from "next/link";
import { MapPin, Maximize, Users, BarChart2, Sparkles, ShoppingCart, Loader2, CheckCircle2, Image as ImageIcon, Eye, Scan } from "lucide-react";

type InventoryItem = {
  id: number;
  location: string;
  city: string;
  media_type: string;
  status: string;
  available_from: string | null;
  size: string;
  daily_traffic: number | string;
  base_price: number | string;
  image_url?: string;
  pano_image_1?: string;
};

export default function HoardingCard({ 
  item, 
  onAiSuggest, 
  onAddToCart,
  cartAddingId,
  cartSuccessId,
  onToggleCompare,
  isCompared,
  onOpenPano
}: { 
  item: InventoryItem;
  onAiSuggest: (item: InventoryItem) => void;
  onAddToCart: (id: number) => void;
  cartAddingId: number | null;
  cartSuccessId: number | null;
  onToggleCompare: (item: InventoryItem) => void;
  isCompared: boolean;
  onOpenPano: (item: InventoryItem) => void;
}) {
  const hasPano = !!item.pano_image_1;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col relative">
      
      {hasPano && (
        <button 
          onClick={() => onOpenPano(item)}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/70 hover:bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-sm transition-colors border border-white/20 flex items-center gap-1.5 shadow-xl"
        >
          <Scan className="w-3.5 h-3.5 text-[#C58B24]" /> 180° View
        </button>
      )}

      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.location} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <ImageIcon className="w-16 h-16" />
          </div>
        )}
        
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-[#0A4D28] shadow-sm z-10">
          {item.media_type}
        </div>
        {item.status === 'Vacant' ? (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm z-10">
            Available Now
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-gray-800 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm z-10">
            Available {item.available_from ? new Date(item.available_from).toLocaleDateString('en-IN', {month:'short'}) : 'Soon'}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-2">
          <MapPin className="w-3.5 h-3.5 text-[#C58B24]" /> {item.city}
        </div>
        <h3 className="font-bold text-[#243839] text-lg leading-tight mb-3 line-clamp-2">{item.location}</h3>
        
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mb-4">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Maximize className="w-4 h-4 text-gray-400" /> {item.size}
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Users className="w-4 h-4 text-gray-400" /> {Number(item.daily_traffic).toLocaleString()}/day
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Monthly Rate</p>
            <p className="text-xl font-black text-[#243839]">₹{Number(item.base_price).toLocaleString()}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              href={`/media/${item.id}`}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors border bg-gray-50 text-gray-400 border-gray-200 hover:bg-[#C58B24] hover:text-white hover:border-[#C58B24]"
              title="View Internal Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => onToggleCompare(item)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${
                isCompared 
                  ? 'bg-[#243839] text-white border-[#243839]' 
                  : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-[#243839] hover:text-white hover:border-[#243839]'
              }`}
              title="Add to Compare"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-2 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-2">
        <button 
          onClick={() => onAiSuggest(item)}
          className="py-2.5 bg-white text-[#C58B24] border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Suggest
        </button>
        <button 
          onClick={() => onAddToCart(item.id)}
          disabled={cartAddingId === item.id}
          className="py-2.5 bg-[#0A4D28] hover:bg-[#07381d] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-70"
        >
          {cartAddingId === item.id ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding...</>
          ) : cartSuccessId === item.id ? (
            <><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Added</>
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}