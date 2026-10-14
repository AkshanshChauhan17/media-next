"use client";

import { useState, useEffect } from "react";
import { getSessionUser } from "@/actions/auth";
import { 
  CheckCircle, XCircle, Target, Users, MapPin, 
  TrendingUp, Plus, ArrowRight, ShieldCheck, 
  Clock, IndianRupee, Image as ImageIcon, Briefcase, 
  AlertTriangle, Loader2, X, PieChart, BarChart3
} from "lucide-react";
import { 
  assignTaskToExecutive, 
  getAuditorTasks, 
  updateTaskStatus,
  getAuditorDashboardStats,
  getMediaOwnerTasks,
  getAuditorExecutives
} from "@/actions/assignments";

type FieldExecutive = {
  id: string;
  name: string;
  status: string;
};

type AuditorTask = {
  id: number;
  status: string;
  proof_image?: string | null;
  campaign_name: string;
  location: string;
  executive_name: string;
  gps_lat?: number | null;
  auditor_assignment_id: number;
};

type MediaOwnerTask = {
  id: number;
  campaign_name: string;
  location: string;
};

export default function AuditorDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "verify" | "executives">("overview");
  
  const [currentAuditorId, setCurrentAuditorId] = useState<number | null>(null);

  const [tasks, setTasks] = useState<AuditorTask[]>([]);
  const [mediaTasks, setMediaTasks] = useState<MediaOwnerTask[]>([]);
  const [stats, setStats] = useState({ total_budget: 0, spent_budget: 0, total_hoardings: 0, installed_count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  const [assignForm, setAssignForm] = useState({
    executive_id: "",
    auditor_assignment_id: "",
    deadline: ""
  });

  const [executives, setExecutives] = useState<FieldExecutive[]>([]);
  
  const loadDashboardData = async () => {
    setIsLoading(true);
    
    const sessionRes = await getSessionUser();
    
    if (!sessionRes.success || !sessionRes.user) {
      alert("Session expired! Please login as Auditor.");
      window.location.href = "/login"; 
      return;
    }

    const auditorId = Number(sessionRes.user.id); 
    setCurrentAuditorId(auditorId);

    const [statsRes, tasksRes, mediaRes, execsRes] = await Promise.all([
      getAuditorDashboardStats(auditorId),
      getAuditorTasks(auditorId),
      getMediaOwnerTasks(auditorId),
      getAuditorExecutives(auditorId)
    ]);

    if (statsRes.success && statsRes.data) setStats(statsRes.data);
    if (tasksRes.success) setTasks(tasksRes.data as unknown as AuditorTask[]);
    if (mediaRes.success) setMediaTasks(mediaRes.data as unknown as MediaOwnerTask[]);
    if (execsRes.success) {
      setExecutives(execsRes.data.map((executive) => ({
        ...executive,
        id: String(executive.id),
        status: "Available" as const
      })));
    }
    
    setIsLoading(false);
  };
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadDashboardData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAuditorId) {
      alert("System Error: Auditor session not found.");
      return;
    }

    setIsLoading(true);
    const res = await assignTaskToExecutive({
      auditor_id: currentAuditorId,
      executive_id: Number(assignForm.executive_id),
      auditor_assignment_id: Number(assignForm.auditor_assignment_id),
      deadline: assignForm.deadline
    });
    
    if (res.success) {
      alert("Task Assigned Successfully!");
      setIsAssignModalOpen(false);
      setAssignForm({ executive_id: "", auditor_assignment_id: "", deadline: "" });
      loadDashboardData();
    } else {
      alert(res.message);
    }
    setIsLoading(false);
  };

  const handleStatusUpdate = async (taskId: number, status: string, auditorAssignmentId: number) => {
    const res = await updateTaskStatus(taskId, status, auditorAssignmentId);
    if (res.success) {
      alert(`Site marked as ${status} successfully!`);
      loadDashboardData();
    }
  };

  const progressPercentage = stats.total_budget > 0 ? (stats.spent_budget / stats.total_budget) * 100 : 0;
  const installationPercentage = stats.total_hoardings > 0 ? (stats.installed_count / stats.total_hoardings) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#243839] p-5 flex items-center justify-between">
              <h3 className="font-black text-white text-lg flex items-center gap-2"><Target className="w-5 h-5 text-[#C58B24]" /> Assign Task (Media Owner)</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-300 hover:text-white bg-white/10 p-1.5 rounded-full"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAssignTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Select Media Owner Task</label>
                <select required value={assignForm.auditor_assignment_id} onChange={(e) => setAssignForm({...assignForm, auditor_assignment_id: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#243839] focus:outline-none focus:border-[#0A4D28]">
                  <option value="" disabled>Choose Pending Campaign</option>
                  {mediaTasks.map(t => <option key={t.id} value={t.id}>{t.campaign_name} - {t.location}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Assign To Ground Agent</label>
                <select required value={assignForm.executive_id} onChange={(e) => setAssignForm({...assignForm, executive_id: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#243839] focus:outline-none focus:border-[#0A4D28]">
                  <option value="" disabled>Choose Executive</option>
                  {executives.map(exe => <option key={exe.id} value={exe.id}>{exe.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Deadline</label>
                <input required type="datetime-local" value={assignForm.deadline} onChange={(e) => setAssignForm({...assignForm, deadline: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#243839] focus:outline-none focus:border-[#0A4D28]" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full mt-4 bg-[#0A4D28] hover:bg-[#06331a] text-white py-3.5 rounded-xl font-black transition-colors flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Dispatch Assignment"}
              </button>
            </form>
          </div>
        </div>
      )}

      <header className="bg-[#243839] text-white px-8 py-5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#C58B24]" />
          <div>
            <h1 className="font-black text-xl leading-tight">Auditor Command Center</h1>
            <p className="text-xs text-gray-300 font-medium">Media Assignments & Verification</p>
          </div>
        </div>
        <button onClick={() => setIsAssignModalOpen(true)} className="bg-[#C58B24] hover:bg-[#a8751e] px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition-colors">
          <Plus className="w-4 h-4" /> Assign New Task
        </button>
      </header>

      <div className="max-w-[1400px] w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><PieChart className="w-3.5 h-3.5" /> Approved Budget Status</p>
                  <h2 className="text-3xl font-black text-[#0A4D28] flex items-center gap-1">
                    <IndianRupee className="w-6 h-6" /> {Number(stats.spent_budget || 0).toLocaleString()}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Target</p>
                  <p className="text-lg font-black text-gray-700">₹{Number(stats.total_budget || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0A4D28] rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Hoardings Installed & Verified</p>
                  <h2 className="text-3xl font-black text-blue-600 flex items-center gap-1">
                    {stats.installed_count || 0} Sites
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Target Sites</p>
                  <p className="text-lg font-black text-gray-700">{stats.total_hoardings || 0} Sites</p>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${installationPercentage}%` }}></div>
              </div>
            </div>
          </div>

        </div>

        <div className="flex overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-1 hide-scrollbar">
          <button onClick={() => setActiveTab("verify")} className={`flex-shrink-0 min-w-[150px] px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'verify' ? 'bg-[#243839] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <CheckCircle className="w-4 h-4" /> Verifications
            {tasks.filter(t => t.status === 'In Review').length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{tasks.filter(t => t.status === 'In Review').length}</span>}
          </button>
          <button onClick={() => setActiveTab("executives")} className={`flex-shrink-0 min-w-[150px] px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'executives' ? 'bg-[#243839] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Briefcase className="w-4 h-4" /> Ground Team
          </button>
        </div>

        {activeTab === "verify" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animate-in fade-in">
            <h3 className="font-black text-xl text-[#243839] mb-6 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#C58B24]" /> Tasks Under Review</h3>
            {tasks.filter(t => t.status === 'In Review').length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                <ShieldCheck className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-gray-600">No Pending Approvals</h3>
                <p className="text-sm mt-1">Ground team has not uploaded any new verifications.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tasks.filter(t => t.status === 'In Review').map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row gap-5 hover:border-[#0A4D28]/30 transition-colors bg-gray-50/50">
                    <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden bg-gray-200 relative group flex-shrink-0">
                      {task.proof_image ? <img src={task.proof_image} alt="Proof" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-gray-400" /></div>}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded animate-pulse">Under Review</span>
                      </div>
                      <h4 className="font-black text-[#243839] text-lg leading-tight mb-1">{task.campaign_name}</h4>
                      <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5 mb-4"><MapPin className="w-4 h-4 text-[#C58B24]" /> {task.location}</p>
                      <div className="bg-white border border-gray-200 rounded-xl p-3 mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ground Agent</p>
                          <p className="font-bold text-sm text-[#243839]">{task.executive_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">GPS Lock</p>
                          {task.gps_lat ? <p className="font-bold text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/> Verified</p> : <p className="font-bold text-sm text-red-500"><XCircle className="w-3.5 h-3.5"/> Missing</p>}
                        </div>
                      </div>
                      <div className="mt-auto grid grid-cols-2 gap-3">
                        <button onClick={() => handleStatusUpdate(task.id, 'Rejected', task.auditor_assignment_id)} className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white py-2.5 rounded-xl text-sm font-bold transition-colors">Reject Proof</button>
                        <button onClick={() => handleStatusUpdate(task.id, 'Approved', task.auditor_assignment_id)} className="bg-[#0A4D28] hover:bg-[#06331a] text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-md">Verify Site</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "executives" && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 animate-in fade-in">
            <h3 className="font-black text-xl text-[#243839] mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#C58B24]" /> Ground Team Force</h3>
            <div className="overflow-x-auto border border-gray-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500">Executive</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {executives.length === 0 ? (
                    <tr><td colSpan={2} className="p-8 text-center text-gray-400 font-bold">No executives registered under you yet.</td></tr>
                  ) : (
                    executives.map((exe) => (
                      <tr key={exe.id} className="border-b border-gray-50">
                        <td className="p-4 font-bold text-[#243839]">{exe.name}</td>
                        <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{exe.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar { display: none; }`}} />
    </div>
  );
}