"use client";

import { useState, useEffect } from "react";
import { 
  Map, 
  Search, 
  Filter, 
  CheckCircle2, 
  Ban, 
  Clock, 
  Loader2,
  Eye,
  X,
  MapPin,
  Image as ImageIcon,
  IndianRupee,
  Maximize,
  Users,
  Building2,
  Phone
} from "lucide-react";
import { getAllHoardings, updateHoardingAdminStatus } from "@/actions/admin";

type Hoarding = {
  id: number;
  hoarding_id_string: string;
  location: string;
  city: string;
  gps_coordinates: string;
  size: string;
  media_type: string;
  daily_traffic: string;
  demand_category: string;
  base_price: string;
  status: string;
  admin_status: "Pending" | "Approved" | "Blocked";
  image_url: string;
  media_owner_name: string;
  media_owner_email: string;
  media_owner_phone: string;
  created_at: string;
};

export default function GlobalInventory() {
  const [hoardings, setHoardings] = useState<Hoarding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending"); // Default to pending for quick moderation
  const [cityFilter, setCityFilter] = useState("All");

  // Modal State
  const [selectedHoarding, setSelectedHoarding] = useState<Hoarding | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchHoardings = async (nextFilters?: { status?: string; city?: string; q?: string }) => {
    const appliedStatus = nextFilters?.status ?? statusFilter;
    const appliedCity = nextFilters?.city ?? cityFilter;
    const appliedQuery = nextFilters?.q ?? searchQ;

    setIsLoading(true);
    const res = await getAllHoardings({ status: appliedStatus, city: appliedCity, q: appliedQuery });
    if (res.success && res.data) {
      setHoardings(res.data as Hoarding[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadHoardings = async () => {
      try {
        setIsLoading(true);
        const res = await getAllHoardings({ status: statusFilter, city: cityFilter, q: searchQ });
        if (!isMounted) return;

        if (res.success && res.data) {
          setHoardings(res.data as Hoarding[]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadHoardings();

    return () => {
      isMounted = false;
    };
  }, [statusFilter, cityFilter, searchQ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchHoardings({ status: statusFilter, city: cityFilter, q: searchQ });
  };

  const handleStatusUpdate = async (status: 'Approved' | 'Blocked') => {
    if (!selectedHoarding) return;
    setIsProcessing(true);
    
    const res = await updateHoardingAdminStatus(selectedHoarding.id, status);
    
    if (res.success) {
      setSelectedHoarding(null);
      await fetchHoardings();
    } else {
      alert("Failed to update status");
    }
    setIsProcessing(false);
  };

  const uniqueCities = ["All", "Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad"]; // You can dynamically fetch this later

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Approved": return <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> Live</span>;
      case "Blocked": return <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max"><Ban className="w-3 h-3" /> Blocked</span>;
      default: return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Needs Review</span>;
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] flex items-center gap-3">
            <Map className="w-8 h-8 text-[#C58B24]" />
            Global Inventory Moderation
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-2">
            Verify and control all hoarding listings across the platform to maintain quality and trust.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, Location, or Owner..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 focus:border-[#111827] text-[#111827]"
            />
          </form>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-[#111827] appearance-none cursor-pointer"
              >
                {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-[#111827] text-white border border-[#111827] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 font-bold cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved (Live)</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Inventory Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-[#111827] mb-3" />
            <span className="text-sm font-medium text-gray-500">Scanning global inventory...</span>
          </div>
        ) : hoardings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hoardings.map((h) => (
              <div key={h.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col group">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {h.image_url ? (
                    <img src={h.image_url} alt="Hoarding" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(h.admin_status)}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white px-2 py-1 rounded text-[10px] font-bold">
                    {h.media_type}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-black text-[#C58B24] text-sm">{h.hoarding_id_string}</p>
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.city}</p>
                  </div>
                  <h3 className="font-bold text-[#111827] text-base leading-tight line-clamp-2 mb-3">{h.location}</h3>
                  
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Owner / Vendor</p>
                    <p className="text-sm font-bold text-[#111827] truncate flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" /> {h.media_owner_name}
                    </p>
                  </div>
                </div>

                <div className="p-2 bg-gray-50 border-t border-gray-100">
                  <button 
                    onClick={() => setSelectedHoarding(h)}
                    className="w-full py-2.5 bg-white border border-gray-200 hover:border-[#111827] hover:bg-[#111827] hover:text-white text-[#111827] rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Eye className="w-4 h-4" /> Review & Moderate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#111827] mb-2">No Inventory Found</h3>
            <p className="text-gray-500">No hoardings match your current filters.</p>
          </div>
        )}
      </div>

      {/* Moderation Modal */}
      {selectedHoarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#111827] text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C58B24]" />
                Inventory Moderation: {selectedHoarding.hoarding_id_string}
              </h2>
              <button onClick={() => setSelectedHoarding(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Visuals & Location */}
                <div className="space-y-6">
                  <div className="w-full h-64 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative">
                    {selectedHoarding.image_url ? (
                      <img src={selectedHoarding.image_url} alt="Hoarding" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12 opacity-50" />
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                      {getStatusBadge(selectedHoarding.admin_status)}
                    </div>
                  </div>

                  <div className="bg-[#111827] p-5 rounded-xl text-white">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Location Details</p>
                    <p className="font-bold text-lg leading-tight mb-2">{selectedHoarding.location}</p>
                    <p className="text-sm text-[#C58B24] font-bold mb-4">{selectedHoarding.city}</p>
                    
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">GPS Coordinates</p>
                      <p className="text-sm font-mono text-green-400">{selectedHoarding.gps_coordinates || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Specs & Owner Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] mb-3 border-b border-gray-100 pb-2">Technical Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><Maximize className="w-3 h-3" /> Size</p>
                        <p className="font-bold text-[#111827]">{selectedHoarding.size}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Format</p>
                        <p className="font-bold text-[#111827]">{selectedHoarding.media_type}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Daily Traffic</p>
                        <p className="font-bold text-[#111827]">{Number(selectedHoarding.daily_traffic).toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Base Price/Mo</p>
                        <p className="font-black text-[#C58B24]">₹{Number(selectedHoarding.base_price).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#111827] mb-3 border-b border-gray-100 pb-2">Media Owner (Vendor) Details</h3>
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <p className="font-bold text-[#111827] text-base mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" /> {selectedHoarding.media_owner_name}
                      </p>
                      <div className="space-y-2 text-sm font-medium text-gray-600">
                        <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {selectedHoarding.media_owner_email}</p>
                        <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {selectedHoarding.media_owner_phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedHoarding.admin_status === 'Blocked' && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-bold flex items-center gap-2">
                      <Ban className="w-4 h-4" /> This hoarding is currently blocked and hidden from advertisers.
                    </div>
                  )}

                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              {selectedHoarding.admin_status !== 'Blocked' && (
                <button 
                  onClick={() => handleStatusUpdate('Blocked')}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors border border-red-200 text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />} Block Listing
                </button>
              )}
              
              {selectedHoarding.admin_status !== 'Approved' && (
                <button 
                  onClick={() => handleStatusUpdate('Approved')}
                  disabled={isProcessing}
                  className="px-8 py-2.5 bg-[#0A4D28] hover:bg-[#07381d] text-white font-bold rounded-lg transition-colors shadow-sm text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve (Make Live)
                </button>
              )}
              
              {selectedHoarding.admin_status === 'Approved' && (
                 <button onClick={() => setSelectedHoarding(null)} className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors text-sm">
                   Close Window
                 </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}