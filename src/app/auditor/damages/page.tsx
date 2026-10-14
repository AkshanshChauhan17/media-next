"use client";

import { useState, useEffect, type FormEvent } from "react";
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Clock, 
  Navigation, 
  Loader2, 
  CheckCircle2,
  X,
  Plus,
  Image as ImageIcon
} from "lucide-react";
import { getAuditorHoardings, getDamageReports, submitDamageReport } from "@/actions/auditor";

type DamageReport = {
  id: number;
  hoarding_id_string: string;
  location: string;
  damage_type: string;
  severity: string;
  description: string;
  photo_url: string;
  latitude: string;
  longitude: string;
  reported_at: string;
};

type Hoarding = {
  id: number;
  hoarding_id_string: string;
  location: string;
};

export default function DamageReporting() {
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [hoardings, setHoardings] = useState<Hoarding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [reportsRes, hoardingsRes] = await Promise.all([
      getDamageReports(),
      getAuditorHoardings()
    ]);
    if (reportsRes.success) setReports(reportsRes.data as DamageReport[]);
    if (hoardingsRes.success) setHoardings(hoardingsRes.data as Hoarding[]);
    setIsLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, []);

  const acquireLocation = () => {
    setIsGettingLocation(true);
    setErrorMsg("");
    
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsGettingLocation(false);
      },
      (error) => {
        setErrorMsg("Please enable GPS location permissions.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!location) {
      setErrorMsg("You must lock your GPS location first.");
      return;
    }
    if (!photoFile) {
      setErrorMsg("Live photo proof is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());
    formData.append("photoFile", photoFile);

    const res = await submitDamageReport(formData);

    if (res.success) {
      setIsModalOpen(false);
      setPhotoFile(null);
      setLocation(null);
      await fetchData();
    } else {
      setErrorMsg(res.error || "Failed to submit damage report.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Damage Reporting</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Log structural, lighting, or flex damages found during field patrols.</p>
          </div>
          <button 
            onClick={() => {
              setErrorMsg("");
              setPhotoFile(null);
              setLocation(null);
              setIsModalOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <AlertTriangle className="w-5 h-5" /> Report New Damage
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-[#243839] text-lg">My Damage Reports History</h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mb-3" />
                <p className="text-sm font-medium text-gray-500">Loading damage logs...</p>
              </div>
            ) : reports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row bg-white hover:border-red-200 transition-colors">
                    <div className="sm:w-40 h-48 sm:h-auto bg-gray-100 relative">
                      <img src={report.photo_url} alt="Damage Proof" className="w-full h-full object-cover" />
                      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        report.severity === 'Critical' ? 'bg-red-600 text-white' : 
                        report.severity === 'Medium' ? 'bg-orange-500 text-white' : 
                        'bg-yellow-400 text-yellow-900'
                      }`}>
                        {report.severity}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-[#243839]">{report.damage_type}</h3>
                        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(report.reported_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium line-clamp-2 mb-3">{report.description}</p>
                      <div className="mt-auto space-y-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#243839]">
                          <MapPin className="w-3.5 h-3.5 text-red-500" /> {report.hoarding_id_string}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                          <Navigation className="w-3 h-3 text-[#0A4D28]" /> {Number(report.latitude).toFixed(5)}, {Number(report.longitude).toFixed(5)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#243839] mb-1">No Damages Reported</h3>
                <p className="text-gray-500 font-medium text-sm">You havent submitted any damage reports yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50">
              <h2 className="font-bold text-red-700 text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Report Hoarding Damage
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-red-400 hover:text-red-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-600 text-sm font-bold">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {errorMsg}
                </div>
              )}

              <form id="damageForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#243839] mb-1.5">Select Hoarding</label>
                  <select name="hoardingId" required className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30">
                    <option value="">-- Choose Hoarding Site --</option>
                    {hoardings.map(h => (
                      <option key={h.id} value={h.id}>{h.hoarding_id_string} - {h.location}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-[#243839] mb-1.5">Damage Type</label>
                    <select name="damageType" required className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30">
                      <option value="Torn Flex">Torn Flex</option>
                      <option value="Structural Damage">Structural Damage</option>
                      <option value="Lighting Failure">Lighting Failure</option>
                      <option value="Obstruction (Tree/Wire)">Obstruction (Tree/Wire)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#243839] mb-1.5">Severity</label>
                    <select name="severity" required className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30">
                      <option value="Minor">Minor (No immediate action)</option>
                      <option value="Medium">Medium (Needs repair soon)</option>
                      <option value="Critical">Critical (Immediate fix needed)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#243839] mb-1.5">Live Photo Evidence</label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center relative group transition-colors ${photoFile ? 'border-[#0A4D28] bg-[#0A4D28]/5' : 'border-gray-300 hover:border-[#0A4D28]/30 bg-gray-50'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${photoFile ? 'bg-[#0A4D28] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {photoFile ? <ImageIcon className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                    </div>
                    <h4 className="font-bold text-[#243839] text-sm">{photoFile ? photoFile.name : "Tap to capture live photo"}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">Gallery uploads are strictly disabled</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#243839] mb-1.5">Description of Issue</label>
                  <textarea 
                    name="description" 
                    rows={3} 
                    required 
                    placeholder="Provide detailed information about the damage..."
                    className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 resize-none"
                  ></textarea>
                </div>

                <div className="bg-[#243839] rounded-xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Geo-Fence Lock</p>
                    {location ? (
                      <p className="text-sm font-mono text-green-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-300">Location required for submission</p>
                    )}
                  </div>
                  {!location && (
                    <button 
                      type="button"
                      onClick={acquireLocation}
                      disabled={isGettingLocation}
                      className="px-4 py-2 bg-white text-[#243839] rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                      {isGettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />} Get Location
                    </button>
                  )}
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancel</button>
              <button 
                type="submit" 
                form="damageForm"
                disabled={isSubmitting || !location || !photoFile}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Damage Report"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}