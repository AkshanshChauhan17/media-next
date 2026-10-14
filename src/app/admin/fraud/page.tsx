"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  ShieldCheck,
  AlertTriangle, 
  FileCheck2, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Clock,
  Eye,
  X,
  Search,
  Building2,
  Camera
} from "lucide-react";
import { getGlobalAlerts, getGlobalAudits } from "@/actions/admin";

interface Alert {
  id: string;
  hoarding_id_string: string;
  media_owner_name: string;
  alert_type: string;
  severity: 'Critical' | 'Medium' | 'Low';
  created_at: string;
  city: string;
  issue_description: string;
  is_resolved: boolean;
}

interface Audit {
  id: string;
  hoarding_id_string: string;
  auditor_name: string;
  created_at: string;
  before_photo_url: string;
  after_photo_url: string;
  latitude: number;
  longitude: number;
  structure_damaged: boolean;
  damage_rating: string;
}

export default function FraudAndAuditLogs() {
  const [activeTab, setActiveTab] = useState<"alerts" | "audits">("alerts");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [alertsRes, auditsRes] = await Promise.all([
        getGlobalAlerts(),
        getGlobalAudits()
      ]);
      
      if (alertsRes.success) setAlerts(alertsRes.data as Alert[]);
      if (auditsRes.success) setAudits(auditsRes.data as Audit[]);
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredAlerts = alerts.filter(a => 
    a.hoarding_id_string.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.media_owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.alert_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAudits = audits.filter(a => 
    a.hoarding_id_string.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.auditor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.damage_rating || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityStyle = (severity: string) => {
    if (severity === 'Critical') return "bg-red-50 text-red-700 border-red-200";
    if (severity === 'Medium') return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-red-600" />
              Fraud & Audit Logs
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">
              Monitor global damage alerts, security flags, and spot-check field auditor submissions.
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === "alerts" 
                  ? "bg-red-50 text-red-700" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> System Alerts
            </button>
            <button
              onClick={() => setActiveTab("audits")}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-colors flex items-center gap-2 ${
                activeTab === "audits" 
                  ? "bg-[#111827] text-white" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FileCheck2 className="w-4 h-4" /> Auditor Spot-Checks
            </button>
          </div>
        </div>

        <div className="mb-6 relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'alerts' ? 'alerts by ID or Vendor' : 'audits by ID or Auditor'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 focus:border-[#111827] text-[#111827] shadow-sm"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-[#111827] mb-3" />
              <span className="text-sm font-medium text-gray-500">Loading system logs...</span>
            </div>
          ) : activeTab === "alerts" ? (
            
            /* ALERTS TAB */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Alert Type & Date</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Site Info</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Media Owner</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 align-top">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border mb-2 ${getSeverityStyle(alert.severity)}`}>
                          <AlertTriangle className="w-3 h-3" /> {alert.severity} Priority
                        </div>
                        <div className="font-bold text-[#111827] text-sm">{alert.alert_type}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(alert.created_at).toLocaleString('en-IN', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#111827] text-sm">{alert.hoarding_id_string}</div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">{alert.city}</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#111827] text-sm flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" /> {alert.media_owner_name}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <p className="text-sm text-gray-600 font-medium max-w-xs">{alert.issue_description}</p>
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        {alert.is_resolved ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                            <XCircle className="w-3.5 h-3.5" /> Unresolved
                          </span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-gray-500 font-medium">
                        <ShieldCheck className="w-12 h-12 text-green-200 mx-auto mb-3" />
                        No system alerts found. The platform is healthy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          
          ) : (
            
            /* AUDITOR SPOT-CHECKS TAB */
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAudits.length > 0 ? filteredAudits.map((audit) => (
                  <div key={audit.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <div className="font-bold text-[#111827] text-sm">{audit.hoarding_id_string}</div>
                      <div className="text-[10px] font-mono text-gray-500">{new Date(audit.created_at).toLocaleString('en-IN')}</div>
                    </div>
                    
                    <div className="p-4 flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Auditor Details</p>
                      <p className="font-bold text-[#111827] mb-3">{audit.auditor_name}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="relative h-24 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden group cursor-pointer" onClick={() => setPreviewImage(audit.before_photo_url)}>
                          <img src={audit.before_photo_url} alt="Before" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute top-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">BEFORE</div>
                        </div>
                        <div className="relative h-24 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden group cursor-pointer" onClick={() => setPreviewImage(audit.after_photo_url)}>
                          <img src={audit.after_photo_url} alt="After" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute top-1 left-1 bg-[#0A4D28]/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">AFTER</div>
                        </div>
                      </div>

                      <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-600">Geo-Fence Lock:</span>
                          <span className="font-mono text-[#0A4D28] font-bold flex items-center gap-1"><Navigation className="w-3 h-3" /> {Number(audit.latitude).toFixed(4)}, {Number(audit.longitude).toFixed(4)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-600">Structure Health:</span>
                          {audit.structure_damaged ? (
                            <span className="font-bold text-red-600">Damaged ({audit.damage_rating})</span>
                          ) : (
                            <span className="font-bold text-green-600">Healthy</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-20 text-center text-gray-500 font-medium">
                    <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    No audit reports found.
                  </div>
                )}
              </div>
            </div>

          )}
        </div>

      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPreviewImage(null)} 
              className="absolute -top-12 right-0 text-white hover:text-red-400 bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={previewImage} alt="Audit Proof" className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}

    </div>
  );
}