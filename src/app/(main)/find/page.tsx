"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calculator, MapPin, Monitor, CalendarDays, 
  IndianRupee, ArrowRight, TrendingUp, Loader2 
} from "lucide-react";
import { getMediaRateEstimate } from "@/actions/media";

export default function FindRatesPage() {
  const [city, setCity] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [duration, setDuration] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ avgPrice: number; totalSpaces: number; totalCost: number } | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await getMediaRateEstimate(city, mediaType);
    
    if (res.success && res.data) {
      setResult({
        avgPrice: res.data.avg_price,
        totalSpaces: res.data.total_spaces,
        totalCost: res.data.avg_price * duration
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C58B24]/10 mb-4">
            <Calculator className="w-8 h-8 text-[#C58B24]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#243839] tracking-tight mb-4">
            Smart Media Rate Calculator
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
            Get instant estimates for your outdoor advertising campaigns based on real-time market data and availability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <form onSubmit={handleCalculate} className="flex flex-col gap-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi, Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[#243839] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Media Type</label>
                <div className="relative">
                  <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[#243839] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 appearance-none transition-all"
                  >
                    <option value="">Any Media Type</option>
                    <option value="Static Billboard">Static Billboard</option>
                    <option value="Digital Display">Digital Display</option>
                    <option value="Transit">Transit (Bus/Train)</option>
                    <option value="Mall Media">Mall Media</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Campaign Duration ({duration} {duration === 1 ? 'Month' : 'Months'})
                </label>
                <div className="relative flex items-center gap-4">
                  <CalendarDays className="w-5 h-5 text-gray-400" />
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0A4D28]"
                  />
                  <span className="font-black text-[#243839] w-8 text-right">{duration}M</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !city}
                className="w-full mt-4 bg-[#0A4D28] hover:bg-[#243839] text-white py-4 rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>Calculate Estimate <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>

          <div className="bg-[#243839] p-8 rounded-3xl shadow-xl flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] border-l-[1px] border-white/10 rotate-12 pointer-events-none" />
            
            {result ? (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C58B24]/20 text-[#C58B24] rounded-lg text-sm font-bold mb-6">
                  <TrendingUp className="w-4 h-4" /> Market Average
                </div>
                
                <h3 className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-sm">
                  Estimated Campaign Cost
                </h3>
                <div className="text-5xl md:text-6xl font-black text-white mb-8 flex items-start gap-1">
                  <span className="text-3xl mt-2 text-[#C58B24]">₹</span>
                  {result.totalCost.toLocaleString('en-IN')}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Avg. Monthly Rate</p>
                    <p className="text-xl font-bold text-white">₹{result.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Available Spaces</p>
                    <p className="text-xl font-bold text-white">{result.totalSpaces} Options</p>
                  </div>
                </div>

                {result.totalSpaces > 0 ? (
                  <Link 
                    href={`/media?city=${encodeURIComponent(city)}${mediaType ? `&mediaType=${encodeURIComponent(mediaType)}` : ''}`}
                    className="w-full block text-center bg-[#C58B24] hover:bg-[#a6741b] text-white py-4 rounded-xl font-black text-lg transition-colors"
                  >
                    View Available Spaces
                  </Link>
                ) : (
                  <div className="w-full text-center bg-white/10 text-white py-4 rounded-xl font-bold">
                    No spaces found matching criteria
                  </div>
                )}
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center text-center opacity-50">
                <Calculator className="w-20 h-20 text-white/20 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Awaiting Criteria</h3>
                <p className="text-gray-400 max-w-sm">
                  Enter your campaign details on the left to see real-time pricing estimates and available ad spaces.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}