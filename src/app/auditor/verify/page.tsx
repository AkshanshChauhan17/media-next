"use client";

import { useState, useEffect, type FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Camera, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  Navigation,
  FileCheck2,
  Image as ImageIcon
} from "lucide-react";
import { getAssignedCampaigns, submitSiteVerification } from "../../../actions/auditor";

interface Assignment {
  assignment_id: number;
  hoarding_id: number;
  hoarding_id_string: string;
  campaign_name: string;
  advertiser_name: string;
  location: string;
  gps_coordinates: string;
  status: string;
}

function VerificationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get("id");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedTask, setSelectedTask] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await getAssignedCampaigns();
      if (res.success && res.data) {
        const pendingTasks = (res.data as Assignment[]).filter(t => t.status !== 'Completed');
        setAssignments(pendingTasks);
        
        if (initialId) {
          const task = pendingTasks.find(t => t.assignment_id.toString() === initialId);
          if (task) setSelectedTask(task);
        }
      }
      setIsLoading(false);
    };
    fetchTasks();
  }, [initialId]);

  const acquireLocation = () => {
    setIsGettingLocation(true);
    setLocationError("");
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
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
        setLocationError("Please enable GPS location permissions to verify this site.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) return;

    if (!location) {
      setErrorMsg("You must lock your GPS location first.");
      return;
    }

    if (!beforeFile || !afterFile) {
      setErrorMsg("Both Before and After live photos are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("assignmentId", selectedTask.assignment_id.toString());
    formData.append("hoardingId", selectedTask.hoarding_id.toString());
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());
    formData.append("beforePhoto", beforeFile);
    formData.append("afterPhoto", afterFile);

    const res = await submitSiteVerification(formData);

    if (res.success) {
      setSuccessMsg("Site verification & audit report submitted successfully!");
      setTimeout(() => {
        router.push("/auditor/dashboard");
      }, 2000);
    } else {
      setErrorMsg(res.error || "Verification failed. Ensure you are within 500m of the hoarding.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mb-4" />
        <p className="text-gray-500 font-medium">Loading verification portal...</p>
      </div>
    );
  }

  if (successMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#243839] mb-2">Audit Complete</h2>
        <p className="text-gray-500 font-medium max-w-md">{successMsg}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Site Verification</h1>
        <p className="text-gray-500 font-medium text-sm mt-1">Capture live photos, verify location, and complete the health audit.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-6 bg-gray-50/50 border-b border-gray-100">
          <label className="block text-sm font-bold text-[#243839] mb-2">Select Campaign Task</label>
          <select 
            className="w-full bg-white border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 appearance-none"
            value={selectedTask?.assignment_id || ""}
            onChange={(e) => {
              const task = assignments.find(t => t.assignment_id.toString() === e.target.value);
              setSelectedTask(task || null);
            }}
          >
            <option value="" disabled>-- Select Assigned Task --</option>
            {assignments.map(task => (
              <option key={task.assignment_id} value={task.assignment_id}>
                {task.hoarding_id_string} - {task.campaign_name} ({task.advertiser_name})
              </option>
            ))}
          </select>
        </div>

        {selectedTask && (
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#243839] rounded-xl p-5 text-white">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Target Location</p>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-[#C58B24] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm">{selectedTask.location}</p>
                    <p className="text-xs text-gray-300 font-mono mt-1">{selectedTask.gps_coordinates}</p>
                  </div>
                </div>
              </div>
              <div className="md:border-l md:border-white/10 md:pl-6">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Live Telemetry</p>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#C58B24]" />
                  <span className="text-sm font-mono">{currentTime.toLocaleString('en-IN')}</span>
                </div>
                {!location ? (
                  <button 
                    type="button"
                    onClick={acquireLocation}
                    disabled={isGettingLocation}
                    className="w-full py-2 bg-white text-[#243839] rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    {isGettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                    Lock GPS Coordinates
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-mono font-bold bg-white/10 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" /> Locked: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </div>
                )}
                {locationError && <p className="text-xs text-red-400 mt-2 font-medium">{locationError}</p>}
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-600 text-sm font-bold">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-[#0A4D28]" />
                <h3 className="font-bold text-[#243839] text-lg">Live Visual Proof</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`border-2 border-dashed rounded-xl p-6 text-center relative group transition-colors ${beforeFile ? 'border-[#0A4D28] bg-[#0A4D28]/5' : 'border-gray-300 hover:border-[#0A4D28]/30 bg-gray-50'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${beforeFile ? 'bg-[#0A4D28] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {beforeFile ? <ImageIcon className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                  </div>
                  <h4 className="font-bold text-[#243839] text-sm">Before Installation</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1">Must be captured via live camera</p>
                  <p className="text-xs font-bold text-[#0A4D28] mt-2 truncate">{beforeFile?.name}</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={(e) => e.target.files && setBeforeFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    required
                  />
                </div>

                <div className={`border-2 border-dashed rounded-xl p-6 text-center relative group transition-colors ${afterFile ? 'border-[#0A4D28] bg-[#0A4D28]/5' : 'border-gray-300 hover:border-[#0A4D28]/30 bg-gray-50'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${afterFile ? 'bg-[#0A4D28] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {afterFile ? <ImageIcon className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                  </div>
                  <h4 className="font-bold text-[#243839] text-sm">After Installation</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1">Must be captured via live camera</p>
                  <p className="text-xs font-bold text-[#0A4D28] mt-2 truncate">{afterFile?.name}</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={(e) => e.target.files && setAfterFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2 mb-6">
                <FileCheck2 className="w-5 h-5 text-[#C58B24]" />
                <h3 className="font-bold text-[#243839] text-lg">Health & Damage Checklist</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-[#243839] mb-3">Is the lighting system working?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="lightWorking" value="true" required className="accent-[#0A4D28] w-4 h-4" /> Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="lightWorking" value="false" required className="accent-[#0A4D28] w-4 h-4" /> No
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-[#243839] mb-3">Is the structure damaged?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="structureDamaged" value="true" required className="accent-[#0A4D28] w-4 h-4" /> Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="structureDamaged" value="false" required className="accent-[#0A4D28] w-4 h-4" /> No
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-[#243839] mb-3">Damage Rating Severity</label>
                  <select name="damageRating" required className="w-full bg-white border border-gray-200 text-[#243839] rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30">
                    <option value="None">None (Perfect Condition)</option>
                    <option value="Minor">Minor (Scratches, Rust)</option>
                    <option value="Medium">Medium (Requires Maintenance)</option>
                    <option value="Critical">Critical (Immediate Repair Needed)</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-[#243839] mb-3">Is the flex torn or faded?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="tornFlex" value="true" required className="accent-[#0A4D28] w-4 h-4" /> Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="tornFlex" value="false" required className="accent-[#0A4D28] w-4 h-4" /> No
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-[#243839] mb-3">Is the flex properly mounted?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="flexMounted" value="true" required className="accent-[#0A4D28] w-4 h-4" /> Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="flexMounted" value="false" required className="accent-[#0A4D28] w-4 h-4" /> No
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-[#243839] mb-3">Any physical obstruction (Trees/Wires)?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="obstructionPresent" value="true" required className="accent-[#0A4D28] w-4 h-4" /> Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="radio" name="obstructionPresent" value="false" required className="accent-[#0A4D28] w-4 h-4" /> No
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                <AlertTriangle className="w-4 h-4" /> Verification data is immutable once submitted.
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || !location || !beforeFile || !afterFile}
                className="bg-[#0A4D28] hover:bg-[#07381d] text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Verifying & Uploading...</>
                ) : (
                  <><CheckCircle2 className="w-5 h-5" /> Submit Audit Report</>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}

export default function SiteVerificationPage() {
  return (
    <div className="p-4 md:p-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28]" />
        </div>
      }>
        <VerificationForm />
      </Suspense>
    </div>
  );
}