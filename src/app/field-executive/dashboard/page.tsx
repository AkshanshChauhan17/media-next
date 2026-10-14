"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, Camera, CheckCircle2, AlertTriangle, 
  Clock, Navigation, ShieldCheck, FileText, 
  Upload, X, Loader2, Target, Crosshair
} from "lucide-react";

type AssignedTask = {
  id: string;
  campaign: string;
  location: string;
  deadline: string;
  status: "Pending" | "Completed";
};

export default function FieldExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState<"tasks" | "verify" | "damages">("tasks");
  const [tasks, setTasks] = useState<AssignedTask[]>([
    { id: "TSK-9921", campaign: "Diwali Mega Sale - Samsung", location: "Rajiv Chowk Metro, Delhi", deadline: "Today, 5:00 PM", status: "Pending" },
    { id: "TSK-9922", campaign: "Nike Summer Collection", location: "Cyber Hub, Gurgaon", deadline: "Tomorrow, 12:00 PM", status: "Pending" },
    { id: "TSK-9915", campaign: "HDFC Home Loans", location: "South Ex Part 2, Delhi", deadline: "Yesterday", status: "Completed" },
  ]);

  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [damageForm, setDamageForm] = useState({ location: "", issue: "", severity: "Medium" });

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureGPS = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setIsLocating(false);
        },
        (error) => {
          alert("Please enable GPS location to verify this site.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleVerifyClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setActiveTab("verify");
    captureGPS();
  };

  const submitVerification = () => {
    if (!selectedTaskId || !imagePreview || !gpsLocation) {
      alert("Please capture both Photo and GPS Location.");
      return;
    }
    setIsSubmitting(true);
    
    setTimeout(() => {
      setTasks(tasks.map(t => t.id === selectedTaskId ? { ...t, status: "Completed" } : t));
      setIsSubmitting(false);
      setImagePreview(null);
      setGpsLocation(null);
      setSelectedTaskId("");
      alert("Site verified successfully! Sent to Auditor.");
      setActiveTab("tasks");
    }, 1500);
  };

  const submitDamage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setDamageForm({ location: "", issue: "", severity: "Medium" });
      alert("Damage reported to Operations Manager.");
      setActiveTab("tasks");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-20">
      
      <header className="bg-[#243839] text-white px-5 py-4 sticky top-0 z-50 shadow-md flex justify-between items-center rounded-b-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-5 h-5 text-[#C58B24]" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-tight">Ground Ops</h1>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Active Agent
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-bold">Todays Target</p>
          <p className="font-black text-lg text-[#C58B24]">
            {tasks.filter(t => t.status === 'Completed').length}/{tasks.length}
          </p>
        </div>
      </header>

      <div className="flex-1 p-4 w-full max-w-md mx-auto flex flex-col gap-5">
        
        {activeTab === "tasks" && (
          <div className="space-y-4 animate-in slide-in-from-left-4">
            <h2 className="font-black text-lg text-[#243839] flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-[#C58B24]" /> Pending Assignments
            </h2>
            
            {tasks.filter(t => t.status === "Pending").length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-black text-[#243839] text-lg">All Tasks Completed!</h3>
                <p className="text-xs text-gray-500 mt-1">Great job today. Take a break.</p>
              </div>
            ) : (
              tasks.filter(t => t.status === "Pending").map(task => (
                <div key={task.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#C58B24]"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-50 text-yellow-700 px-2 py-1 rounded">Action Required</span>
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {task.deadline}</span>
                  </div>
                  <h3 className="font-black text-[#243839] text-base leading-tight mb-1">{task.campaign}</h3>
                  <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#0A4D28]" /> {task.location}
                  </p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleVerifyClick(task.id)}
                      className="flex-1 bg-[#0A4D28] text-white py-2.5 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#0A4D28]/20"
                    >
                      <Camera className="w-4 h-4" /> Verify Now
                    </button>
                    <button 
                      className="w-12 bg-gray-100 text-[#243839] rounded-xl flex items-center justify-center transition-colors hover:bg-gray-200"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}

            <h2 className="font-black text-lg text-[#243839] flex items-center gap-2 mt-8 mb-2 opacity-60">
              <CheckCircle2 className="w-5 h-5" /> Completed
            </h2>
            <div className="space-y-3 opacity-60">
              {tasks.filter(t => t.status === "Completed").map(task => (
                <div key={task.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <h3 className="font-bold text-gray-600 text-sm line-clamp-1">{task.campaign}</h3>
                  <p className="text-xs font-medium text-gray-500 mt-1">{task.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "verify" && (
          <div className="space-y-5 animate-in slide-in-from-right-4">
            
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Select Task to Verify</label>
              <select 
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#243839] focus:outline-none focus:border-[#C58B24]"
              >
                <option value="" disabled>Select Assignment</option>
                {tasks.filter(t => t.status === 'Pending').map(t => (
                  <option key={t.id} value={t.id}>{t.campaign} ({t.location})</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">GPS Coordinate Check</label>
                <button onClick={captureGPS} className="text-[#C58B24] text-xs font-bold flex items-center gap-1 hover:underline">
                  <Crosshair className="w-3 h-3" /> Refresh
                </button>
              </div>
              
              {isLocating ? (
                <div className="bg-blue-50 text-blue-600 rounded-xl p-3 text-xs font-bold flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Acquiring Satellites...
                </div>
              ) : gpsLocation ? (
                <div className="bg-green-50 text-green-700 rounded-xl p-3 text-xs font-bold flex items-center justify-between border border-green-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Location Locked
                  </div>
                  <span className="font-mono text-[10px]">{gpsLocation.lat.toFixed(4)}, {gpsLocation.lng.toFixed(4)}</span>
                </div>
              ) : (
                <div className="bg-red-50 text-red-600 rounded-xl p-3 text-xs font-bold flex items-center gap-2 border border-red-100">
                  <AlertTriangle className="w-4 h-4" /> GPS Required
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Live Photo Proof</label>
              
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden bg-black h-64 border border-gray-200">
                  <img src={imagePreview} alt="Captured proof" className="w-full h-full object-cover" />
                  <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-[#0A4D28] mb-3">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-[#243839]">Tap to open camera</p>
                  <p className="text-xs text-gray-400 mt-1">Ensure hoarding is clearly visible</p>
                  <input type="file" accept="image/*" capture="environment" onChange={handleImageCapture} className="hidden" />
                </label>
              )}
            </div>

            <button 
              onClick={submitVerification}
              disabled={isSubmitting || !selectedTaskId || !imagePreview || !gpsLocation}
              className="w-full bg-[#C58B24] hover:bg-[#a6741c] disabled:bg-gray-300 disabled:text-gray-500 text-white py-4 rounded-xl font-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C58B24]/20"
            >
              {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : <><Upload className="w-5 h-5" /> Submit Verification</>}
            </button>
          </div>
        )}

        {activeTab === "damages" && (
          <div className="space-y-4 animate-in slide-in-from-right-4">
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex gap-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <p className="text-xs font-bold leading-relaxed">Use this form strictly to report torn flex, structural damage, or lighting issues on site. Operations Manager will be notified instantly.</p>
            </div>

            <form onSubmit={submitDamage} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Site Location ID</label>
                <input required value={damageForm.location} onChange={e => setDamageForm({...damageForm, location: e.target.value})} type="text" placeholder="e.g. Rajiv Chowk Metro" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#243839] focus:outline-none focus:border-red-400" />
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Issue Description</label>
                <textarea required value={damageForm.issue} onChange={e => setDamageForm({...damageForm, issue: e.target.value})} rows={3} placeholder="Describe the damage..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#243839] focus:outline-none focus:border-red-400 resize-none"></textarea>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Severity</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(level => (
                    <button type="button" key={level} onClick={() => setDamageForm({...damageForm, severity: level})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${damageForm.severity === level ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-black transition-colors flex items-center justify-center gap-2 mt-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Report Damage"}
              </button>
            </form>
          </div>
        )}

      </div>

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around pb-safe pt-2 px-2 z-50">
        <button 
          onClick={() => setActiveTab("tasks")} 
          className={`flex flex-col items-center p-2 min-w-[70px] ${activeTab === 'tasks' ? 'text-[#0A4D28]' : 'text-gray-400'}`}
        >
          <FileText className={`w-6 h-6 mb-1 ${activeTab === 'tasks' ? 'fill-[#0A4D28]/20' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-wider">Tasks</span>
        </button>
        
        <button 
          onClick={() => setActiveTab("verify")} 
          className="relative -top-5 flex flex-col items-center"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50 transition-transform ${activeTab === 'verify' ? 'bg-[#C58B24] scale-110' : 'bg-[#243839]'}`}>
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider mt-1 ${activeTab === 'verify' ? 'text-[#C58B24]' : 'text-[#243839]'}`}>Verify</span>
        </button>
        
        <button 
          onClick={() => setActiveTab("damages")} 
          className={`flex flex-col items-center p-2 min-w-[70px] ${activeTab === 'damages' ? 'text-red-500' : 'text-gray-400'}`}
        >
          <AlertTriangle className={`w-6 h-6 mb-1 ${activeTab === 'damages' ? 'fill-red-500/20' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-wider">Report</span>
        </button>
      </nav>

    </div>
  );
}