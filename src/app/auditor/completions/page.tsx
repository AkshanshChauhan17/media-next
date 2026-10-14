"use client";

import { useState, useEffect, type FormEvent } from "react";
import { 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Clock, 
  Navigation, 
  Loader2, 
  AlertTriangle,
  X,
  FileCheck2,
  CalendarDays,
  Image as ImageIcon
} from "lucide-react";
import { getCompletionTasks, submitCompletionReport } from "@/actions/auditor";

type CompletionTask = {
  assignment_id: number;
  campaign_name: string;
  advertiser_name: string;
  end_date: string;
  hoarding_id: number;
  hoarding_id_string: string;
  location: string;
  gps_coordinates: string;
  size: string;
  completion_id: number | null;
};

export default function CampaignCompletion() {
  const [tasks, setTasks] = useState<CompletionTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTask, setSelectedTask] = useState<CompletionTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    const res = await getCompletionTasks();
    if (res.success && res.data) {
      setTasks(res.data as CompletionTask[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      setIsLoading(true);
      const res = await getCompletionTasks();

      if (!isMounted) return;

      if (res.success && res.data) {
        setTasks(res.data as CompletionTask[]);
      }
      setIsLoading(false);
    };

    void loadTasks();

    return () => {
      isMounted = false;
    };
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
    if (!selectedTask) return;
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
    formData.append("assignmentId", selectedTask.assignment_id.toString());
    formData.append("hoardingId", selectedTask.hoarding_id.toString());
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());
    formData.append("photoFile", photoFile);

    const res = await submitCompletionReport(formData);

    if (res.success) {
      setIsModalOpen(false);
      setSuccessMsg("Campaign completion & final audit recorded successfully.");
      setPhotoFile(null);
      setLocation(null);
      await fetchTasks();
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(res.error || "Failed to submit completion report.");
    }
    setIsSubmitting(false);
  };

  const pendingTasks = tasks.filter(t => !t.completion_id);
  const completedTasks = tasks.filter(t => t.completion_id);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Campaign Completion Reports</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Submit un-installation proof and conduct final health checks at the end of campaigns.</p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 font-bold shadow-sm">
            <CheckCircle2 className="w-5 h-5" /> {successMsg}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-bold text-[#243839] text-lg">Ending Campaigns Pipeline</h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mb-3" />
                <p className="text-sm font-medium text-gray-500">Loading campaign pipelines...</p>
              </div>
            ) : pendingTasks.length > 0 || completedTasks.length > 0 ? (
              <div className="space-y-8">
                
                {pendingTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-red-600 mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" /> Requires Final Audit
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pendingTasks.map((task) => (
                        <div key={task.assignment_id} className="border border-red-100 bg-red-50/30 rounded-xl overflow-hidden hover:shadow-sm transition-all flex flex-col">
                          <div className="p-5 flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-bold bg-white text-red-600 border border-red-200 px-2 py-1 rounded">Pending Un-Install</span>
                              <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Ends: {new Date(task.end_date).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-[#243839] text-lg mb-1">{task.campaign_name}</h3>
                            <p className="text-sm font-bold text-[#C58B24] mb-4">{task.advertiser_name}</p>
                            
                            <div className="flex items-start gap-2 bg-white p-3 rounded border border-gray-100">
                              <MapPin className="w-4 h-4 text-[#0A4D28] flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-[#243839]">{task.hoarding_id_string}</p>
                                <p className="text-[10px] text-gray-500 font-medium leading-tight mt-1">{task.location}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 border-t border-red-100 bg-white mt-auto">
                            <button 
                              onClick={() => {
                                setSelectedTask(task);
                                setPhotoFile(null);
                                setLocation(null);
                                setErrorMsg("");
                                setIsModalOpen(true);
                              }}
                              className="w-full py-2.5 bg-[#0A4D28] hover:bg-[#07381d] text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                              <Camera className="w-4 h-4" /> Start Completion Audit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {completedTasks.length > 0 && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> Completed Audits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedTasks.map((task) => (
                        <div key={task.assignment_id} className="border border-gray-200 bg-gray-50 rounded-xl p-5 flex flex-col">
                          <h3 className="font-bold text-[#243839] text-base mb-1 text-gray-600">{task.campaign_name}</h3>
                          <p className="text-xs font-bold text-gray-500 mb-4">{task.hoarding_id_string}</p>
                          <div className="mt-auto w-full py-2 bg-gray-200 text-gray-600 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Audit Locked & Submitted
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="py-20 text-center">
                <FileCheck2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#243839] mb-1">No Pending Completions</h3>
                <p className="text-gray-500 font-medium text-sm">You have no campaigns ending that require a final audit right now.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#243839] text-base flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#0A4D28]" />
                Final Completion Audit: {selectedTask.hoarding_id_string}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-600 text-sm font-bold">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {errorMsg}
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 font-bold mb-6">
                🔒 Strict Geo-Fencing Active: You must be within 500 meters. Live camera required.
              </div>

              <form id="completionForm" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#243839] rounded-xl p-4 text-white">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Target Location</p>
                    <p className="font-bold text-sm leading-tight mb-1">{selectedTask.location}</p>
                    <p className="text-[10px] text-[#C58B24] font-mono">{selectedTask.gps_coordinates}</p>
                  </div>
                  <div className="md:border-l md:border-white/10 md:pl-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Telemetry Status</p>
                    <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#C58B24]">
                      <Clock className="w-3.5 h-3.5" /> {currentTime.toLocaleString('en-IN')}
                    </div>
                    {!location ? (
                      <button 
                        type="button"
                        onClick={acquireLocation}
                        disabled={isGettingLocation}
                        className="w-full py-1.5 bg-white text-[#243839] rounded text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-100"
                      >
                        {isGettingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />} Lock GPS
                      </button>
                    ) : (
                      <div className="text-green-400 text-xs font-mono font-bold flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Locked: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#243839] mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#0A4D28]" /> Final Post-Removal Photo <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center relative group transition-colors ${photoFile ? 'border-[#0A4D28] bg-[#0A4D28]/5' : 'border-gray-300 hover:border-[#0A4D28]/30 bg-gray-50'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${photoFile ? 'bg-[#0A4D28] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {photoFile ? <ImageIcon className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                    </div>
                    <h4 className="font-bold text-[#243839] text-sm">{photoFile ? photoFile.name : "Tap to capture live photo"}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">Capture the empty hoarding / un-installed flex.</p>
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

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-bold text-[#243839] text-base mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#C58B24]" /> Final Health & Damage Checklist
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <label className="block text-xs font-bold text-[#243839] mb-2">Is the lighting system still working?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="lightWorking" value="true" required className="accent-[#0A4D28]" /> Yes</label>
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="lightWorking" value="false" required className="accent-[#0A4D28]" /> No</label>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <label className="block text-xs font-bold text-[#243839] mb-2">Is the structure damaged after removal?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="structureDamaged" value="true" required className="accent-[#0A4D28]" /> Yes</label>
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="structureDamaged" value="false" required className="accent-[#0A4D28]" /> No</label>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <label className="block text-xs font-bold text-[#243839] mb-2">Final Damage Severity</label>
                      <select name="damageRating" required className="w-full bg-white border border-gray-200 text-[#243839] rounded px-2 py-1.5 text-xs font-bold">
                        <option value="None">None (Perfect Condition)</option>
                        <option value="Minor">Minor (Scratches/Dirt)</option>
                        <option value="Medium">Medium (Needs minor repair)</option>
                        <option value="Critical">Critical (Immediate fix needed)</option>
                      </select>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <label className="block text-xs font-bold text-[#243839] mb-2">Was the flex torn during campaign?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="tornFlex" value="true" required className="accent-[#0A4D28]" /> Yes</label>
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="tornFlex" value="false" required className="accent-[#0A4D28]" /> No</label>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <label className="block text-xs font-bold text-[#243839] mb-2">Is the empty frame properly secured?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="flexMounted" value="true" required className="accent-[#0A4D28]" /> Yes</label>
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="flexMounted" value="false" required className="accent-[#0A4D28]" /> No</label>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <label className="block text-xs font-bold text-[#243839] mb-2">Any physical obstruction (Trees/Wires)?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="obstructionPresent" value="true" required className="accent-[#0A4D28]" /> Yes</label>
                        <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"><input type="radio" name="obstructionPresent" value="false" required className="accent-[#0A4D28]" /> No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancel</button>
              <button 
                type="submit" 
                form="completionForm" 
                disabled={isSubmitting || !location || !photoFile}
                className="bg-[#0A4D28] hover:bg-[#07381d] text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Recording...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Submit Completion</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}