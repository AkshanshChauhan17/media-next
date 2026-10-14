"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, Navigation, Plus, Search, Filter, Eye, Activity, Flame, ArrowUpRight, 
  Loader2, Edit
} from "lucide-react";
import { getHoardings } from "@/actions/mediaOwner";
import BulkUpload from "@/app/components/bulkUpload";
import AddHoardingModal from "./AddHoardingModal";
import EditHoardingModal from "./EditHoardingModal";

type Hoarding = {
  id: string | number;
  hoarding_id_string: string;
  size: string;
  location: string;
  gps_coordinates: string;
  daily_traffic: number;
  demand_category: string;
  status: string;
  available_from?: string | null;
  image_url?: string;
  pano_image_1?: string;
  pano_image_2?: string;
  pano_image_3?: string;
  pano_image_4?: string;
  pano_image_5?: string;
  city: string;
  media_type: string;
  base_price: string | number;
};

export default function MyHoardings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hoardings, setHoardings] = useState<Hoarding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHoarding, setEditingHoarding] = useState<Hoarding | null>(null);

  const fetchHoardings = async () => {
    setIsLoading(true);
    const res = await getHoardings();
    if (res.success && Array.isArray(res.data)) {
      setHoardings(res.data as Hoarding[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetchHoardings();
    })();
  }, []);

  const handleModalSuccess = () => {
    setIsAddModalOpen(false);
    setEditingHoarding(null);
    fetchHoardings();
  };

  const filteredHoardings = hoardings.filter(h => {
    const matchesSearch = h.location.toLowerCase().includes(searchTerm.toLowerCase()) || h.hoarding_id_string.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalHoardings = hoardings.length;
  const occupiedCount = hoardings.filter(h => h.status === 'Occupied').length;
  const vacantCount = hoardings.filter(h => h.status === 'Vacant').length;
  const occupancyRate = totalHoardings > 0 ? ((occupiedCount / totalHoardings) * 100).toFixed(1) : "0.0";

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">My Hoardings</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Manage your inventory, monitor traffic, and update visuals.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#C58B24] hover:bg-[#0A4D28] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add New Hoarding
          </button>
        </div>

        <BulkUpload />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Hoardings</p>
            <p className="text-3xl font-bold text-[#243839]">{totalHoardings}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Occupied</p>
            <p className="text-3xl font-bold text-[#0A4D28]">{occupiedCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Vacant</p>
            <p className="text-3xl font-bold text-[#C58B24]">{vacantCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Occupancy Rate</p>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-[#243839]">{occupancyRate}%</p>
              {totalHoardings > 0 && (
                <span className="flex items-center text-green-600 text-sm font-bold mb-1">
                  <ArrowUpRight className="w-4 h-4" /> Active
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-bold text-[#243839] text-lg">Hoarding Inventory</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search location or ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839]"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-40 pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839] appearance-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Vacant">Vacant</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ID & Size</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Location & GPS</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Traffic & Demand</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status & Availability</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[#0A4D28]">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="font-medium">Loading inventory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredHoardings.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 align-top">
                      <div className="font-bold text-[#243839] text-sm">{h.hoarding_id_string}</div>
                      <div className="text-xs text-gray-500 font-medium mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">{h.size}</div>
                    </td>
                    <td className="py-4 px-6 align-top max-w-xs">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-[#C58B24] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-[#243839] text-sm leading-snug">{h.location}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-1">
                            <Navigation className="w-3 h-3" /> {h.gps_coordinates}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-center gap-1.5 font-bold text-[#243839] text-sm">
                        <Activity className="w-4 h-4 text-[#0A4D28]" /> {h.daily_traffic.toLocaleString()} / day
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium mt-1">
                        <Flame className={`w-3.5 h-3.5 ${h.demand_category === 'High' ? 'text-red-500' : h.demand_category === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                        <span className={h.demand_category === 'High' ? 'text-red-600' : h.demand_category === 'Medium' ? 'text-yellow-600' : 'text-green-600'}>
                          {h.demand_category} Demand
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        h.status === 'Occupied' ? 'bg-[#0A4D28]/10 text-[#0A4D28] border-[#0A4D28]/20' : 'bg-[#C58B24]/10 text-[#C58B24] border-[#C58B24]/20'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-gray-400 hover:text-[#0A4D28] rounded-md hover:bg-[#0A4D28]/10 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setEditingHoarding(h)}
                          className="p-2 text-gray-400 hover:text-[#C58B24] rounded-md hover:bg-[#C58B24]/10 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddHoardingModal onClose={() => setIsAddModalOpen(false)} onSuccess={handleModalSuccess} />
      )}

      {editingHoarding && (
        <EditHoardingModal hoarding={editingHoarding} onClose={() => setEditingHoarding(null)} onSuccess={handleModalSuccess} />
      )}
    </div>
  );
}