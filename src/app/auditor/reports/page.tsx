"use client";

import { useState, useEffect } from "react";
import { 
  FileCheck2, 
  MapPin, 
  Clock, 
  Navigation, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  X
} from "lucide-react";
import { getAuditReports } from "@/actions/auditor";

type AuditReport = {
  id: number;
  campaign_name: string;
  advertiser_name: string;
  hoarding_id_string: string;
  location: string;
  before_photo_url: string;
  after_photo_url: string;
  light_working: number;
  structure_damaged: number;
  damage_rating: string;
  torn_flex: number;
  flex_mounted: number;
  obstruction_present: number;
  latitude: string;
  longitude: string;
  created_at: string;
};

export default function AuditReportsHistory() {
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      const res = await getAuditReports();
      if (res.success && res.data) {
        setReports(res.data as AuditReport[]);
      }
      setIsLoading(false);
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter(r => 
    r.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.hoarding_id_string.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.advertiser_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">My Audit Reports</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Review your previously submitted site verifications and health monitoring logs.</p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or Campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839] shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#0A4D28]" />
              Submission History
            </h2>
            <div className="text-sm font-bold text-gray-500 bg-white px-3 py-1 rounded-md border border-gray-200 shadow-sm">
              Total Reports: {reports.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Hoarding & Location</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Geo-Tag</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-500">Loading audit history...</span>
                    </td>
                  </tr>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C58B24]" />
                          {new Date(report.created_at).toLocaleDateString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-1">
                          {new Date(report.created_at).toLocaleTimeString('en-IN')}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm">{report.campaign_name}</div>
                        <div className="text-xs text-[#C58B24] font-semibold mt-0.5">{report.advertiser_name}</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm">{report.hoarding_id_string}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-0.5">
                          <MapPin className="w-3 h-3 text-red-500" /> {report.location}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded text-[10px] font-mono font-bold text-gray-600 inline-flex">
                          <Navigation className="w-3 h-3 text-[#0A4D28]" /> 
                          {Number(report.latitude).toFixed(5)}, {Number(report.longitude).toFixed(5)}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-[#0A4D28] hover:bg-[#0A4D28]/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">
                      No audit reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#0A4D28]" />
                Audit Report Details
              </h2>
              <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#243839] p-4 rounded-xl text-white">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Campaign & Site</p>
                  <p className="font-bold text-[#C58B24]">{selectedReport.campaign_name}</p>
                  <p className="text-sm">{selectedReport.hoarding_id_string} - {selectedReport.location}</p>
                </div>
                <div className="md:border-l md:border-white/10 md:pl-4">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Verified Telemetry</p>
                  <p className="text-sm font-mono flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#C58B24]" />
                    {new Date(selectedReport.created_at).toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm font-mono flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#0A4D28]" />
                    {selectedReport.latitude}, {selectedReport.longitude}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#243839] text-base mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#C58B24]" /> Visual Proof
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-600 text-center">
                      Before Installation
                    </div>
                    <img src={selectedReport.before_photo_url} alt="Before" className="w-full h-64 object-cover" />
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <div className="px-3 py-2 bg-[#0A4D28]/10 border-b border-[#0A4D28]/20 text-xs font-bold text-[#0A4D28] text-center">
                      After Installation
                    </div>
                    <img src={selectedReport.after_photo_url} alt="After" className="w-full h-64 object-cover" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#243839] text-base mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#C58B24]" /> Health & Damage Checklist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">Lighting Working</span>
                    {selectedReport.light_working ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#0A4D28]"><CheckCircle2 className="w-4 h-4" /> Yes</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600"><XCircle className="w-4 h-4" /> No</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">Structure Damaged</span>
                    {selectedReport.structure_damaged ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600"><XCircle className="w-4 h-4" /> Yes</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#0A4D28]"><CheckCircle2 className="w-4 h-4" /> No</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">Damage Rating</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedReport.damage_rating === 'None' ? 'bg-green-50 text-green-700' :
                      selectedReport.damage_rating === 'Critical' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {selectedReport.damage_rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">Torn Flex</span>
                    {selectedReport.torn_flex ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600"><XCircle className="w-4 h-4" /> Yes</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#0A4D28]"><CheckCircle2 className="w-4 h-4" /> No</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">Properly Mounted</span>
                    {selectedReport.flex_mounted ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#0A4D28]"><CheckCircle2 className="w-4 h-4" /> Yes</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600"><XCircle className="w-4 h-4" /> No</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">Obstruction Present</span>
                    {selectedReport.obstruction_present ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-600"><XCircle className="w-4 h-4" /> Yes</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#0A4D28]"><CheckCircle2 className="w-4 h-4" /> No</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}