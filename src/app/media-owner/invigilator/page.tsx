"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  MapPin, 
  Filter, 
  Search, 
  Image as ImageIcon, 
  Camera, 
  CheckCircle2, 
  Loader2,
  ShieldCheck,
  Building2,
  FileImage,
  X,
  ClipboardList
} from "lucide-react";
import { 
  getAuditorsList, 
  getCampaignProofs, 
  getUnassignedCampaigns, 
  assignAuditorToCampaign 
} from "@/actions/mediaOwner";

type Auditor = {
  id: number;
  name: string;
  email: string;
  city: string;
};

type CampaignProof = {
  booking_id: number;
  campaign_name: string;
  advertiser_name: string;
  hoarding_id_string: string;
  location: string;
  before_photo: string | null;
  after_photo: string | null;
};

type UnassignedCampaign = {
  booking_id: number;
  campaign_name: string;
  hoarding_id: number;
  hoarding_id_string: string;
  location: string;
};

export default function AuditorsAndProofs() {
  const [activeTab, setActiveTab] = useState<"invigilators" | "vault">("invigilators");
  
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [proofs, setProofs] = useState<CampaignProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cityFilter, setCityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Assignment Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAuditor, setSelectedAuditor] = useState<Auditor | null>(null);
  const [unassignedCampaigns, setUnassignedCampaigns] = useState<UnassignedCampaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [auditorsRes, proofsRes] = await Promise.all([
        getAuditorsList(),
        getCampaignProofs()
      ]);

      if (auditorsRes.success && auditorsRes.data) {
        setAuditors(auditorsRes.data as Auditor[]);
      }
      if (proofsRes.success && proofsRes.data) {
        setProofs(proofsRes.data as CampaignProof[]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const openAssignModal = async (auditor: Auditor) => {
    setSelectedAuditor(auditor);
    setIsAssignModalOpen(true);
    setIsLoadingCampaigns(true);
    setSelectedCampaignId("");
    
    const res = await getUnassignedCampaigns();
    if (res.success && res.data) {
      setUnassignedCampaigns(res.data as UnassignedCampaign[]);
    }
    setIsLoadingCampaigns(false);
  };

  const handleAssignTask = async () => {
    if (!selectedAuditor || !selectedCampaignId) return;
    
    const campaign = unassignedCampaigns.find(c => c.booking_id.toString() === selectedCampaignId);
    if (!campaign) return;

    setIsAssigning(true);
    const res = await assignAuditorToCampaign(campaign.booking_id, campaign.hoarding_id, selectedAuditor.id);
    
    if (res.success) {
      alert("Task successfully assigned to the Auditor!");
      setIsAssignModalOpen(false);
      // Optional: Refresh data if needed
    } else {
      alert(res.error || "Failed to assign task");
    }
    setIsAssigning(false);
  };

  const uniqueCities = ["All", ...Array.from(new Set(auditors.map(a => a.city)))];

  const filteredAuditors = auditors.filter(a => {
    const matchesCity = cityFilter === "All" || a.city === cityFilter;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const filteredProofs = proofs.filter(p => 
    p.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.advertiser_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.hoarding_id_string.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Auditors & Campaign Proofs</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Manage field invigilators and access your secure before/after installation vault.</p>
          </div>

          <div className="flex p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab("invigilators")}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === "invigilators" 
                  ? "bg-[#0A4D28] text-white" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4" /> Invigilator List
            </button>
            <button
              onClick={() => setActiveTab("vault")}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === "vault" 
                  ? "bg-[#C58B24] text-white" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Proof Vault
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
            <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
              {activeTab === "invigilators" ? (
                <><Users className="w-5 h-5 text-[#0A4D28]" /> Field Invigilators Directory</>
              ) : (
                <><ImageIcon className="w-5 h-5 text-[#C58B24]" /> Campaign Before & After Vault</>
              )}
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === "invigilators" ? "Search auditor..." : "Search campaign..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839]"
                />
              </div>

              {activeTab === "invigilators" && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full sm:w-40 pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839] appearance-none cursor-pointer"
                  >
                    {uniqueCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mb-4" />
                <p className="text-gray-500 font-medium text-sm">Loading records...</p>
              </div>
            ) : activeTab === "invigilators" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuditors.length > 0 ? (
                  filteredAuditors.map((auditor) => (
                    <div key={auditor.id} className="border border-gray-100 rounded-xl p-5 hover:border-[#0A4D28]/30 hover:shadow-[0_8px_20px_rgba(10,77,40,0.04)] transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#0A4D28]/10 flex items-center justify-center text-[#0A4D28] font-black text-lg">
                            {auditor.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#243839]">{auditor.name}</h3>
                            <p className="text-xs text-gray-500 font-medium">{auditor.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                          <MapPin className="w-4 h-4 text-[#C58B24]" />
                          {auditor.city}
                        </div>
                        <button 
                          onClick={() => openAssignModal(auditor)}
                          className="text-[#0A4D28] font-bold hover:underline"
                        >
                          Assign Task
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No invigilators found matching your criteria.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProofs.length > 0 ? (
                  filteredProofs.map((proof) => (
                    <div key={proof.booking_id} className="border border-gray-100 rounded-xl overflow-hidden hover:border-[#C58B24]/30 transition-colors">
                      <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                        <div>
                          <h3 className="font-bold text-[#243839] text-lg">{proof.campaign_name}</h3>
                          <div className="flex items-center gap-4 text-sm mt-1">
                            <span className="font-semibold text-[#C58B24] flex items-center gap-1.5">
                              <Building2 className="w-4 h-4" /> {proof.advertiser_name}
                            </span>
                            <span className="text-gray-500 font-medium flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" /> {proof.hoarding_id_string} - {proof.location}
                            </span>
                          </div>
                        </div>
                        <div className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Active Campaign
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
                        <div className="bg-white p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-[#243839] flex items-center gap-2">
                              <Camera className="w-4 h-4 text-gray-400" />
                              Before Installation (Audit)
                            </h4>
                          </div>
                          {proof.before_photo ? (
                            <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                              <img src={proof.before_photo} alt="Before" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a href={proof.before_photo} target="_blank" rel="noreferrer" className="text-white font-bold text-sm border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-colors">View Full</a>
                              </div>
                            </div>
                          ) : (
                            <div className="h-64 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                              <FileImage className="w-8 h-8 mb-2" />
                              <span className="text-sm font-medium">No previous audit record found</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-white p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-[#0A4D28] flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" />
                              After Installation (Verified)
                            </h4>
                          </div>
                          {proof.after_photo ? (
                            <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                              <img src={proof.after_photo} alt="After" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-[#0A4D28]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a href={proof.after_photo} target="_blank" rel="noreferrer" className="text-white font-bold text-sm border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#0A4D28] transition-colors">View Full</a>
                              </div>
                            </div>
                          ) : (
                            <div className="h-64 rounded-xl bg-red-50 border-2 border-dashed border-red-100 flex flex-col items-center justify-center text-red-400">
                              <Camera className="w-8 h-8 mb-2 text-red-300" />
                              <span className="text-sm font-bold text-red-600">Pending Installation Proof</span>
                              <span className="text-xs text-red-500 mt-1">QC report not submitted yet</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No campaigns found matching your search.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ASSIGNMENT MODAL */}
      {isAssignModalOpen && selectedAuditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#0A4D28]" />
                Assign Auditor
              </h2>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                You are dispatching <strong className="text-[#243839]">{selectedAuditor.name}</strong> ({selectedAuditor.city}) for site verification.
              </p>

              {isLoadingCampaigns ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0A4D28]" />
                </div>
              ) : unassignedCampaigns.length > 0 ? (
                <div>
                  <label className="block text-sm font-bold text-[#243839] mb-2">Select Active Campaign</label>
                  <select 
                    value={selectedCampaignId}
                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
                  >
                    <option value="" disabled>-- Choose a campaign --</option>
                    {unassignedCampaigns.map(c => (
                      <option key={c.booking_id} value={c.booking_id}>
                        {c.campaign_name} ({c.hoarding_id_string})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200 text-sm font-medium">
                  You dont have any unassigned active campaigns right now. Wait for new bookings or check the vault.
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setIsAssignModalOpen(false)} 
                className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignTask}
                disabled={isAssigning || !selectedCampaignId}
                className="bg-[#0A4D28] hover:bg-[#07381d] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAssigning ? <><Loader2 className="w-4 h-4 animate-spin" /> Assigning...</> : "Confirm Task"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}