"use client";

import { useState, useEffect } from "react";
import { 
  ClipboardList, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Loader2,
  MapPin,
  Calendar,
  Building2,
  AlertCircle,
  X,
  UserCheck
} from "lucide-react";
import { getAssignmentTasks, getAvailableAuditors, assignAuditorToBooking } from "@/actions/admin";

type Task = {
  booking_id: number;
  campaign_name: string;
  start_date: string;
  end_date: string;
  booking_status: string;
  hoarding_id: number;
  hoarding_id_string: string;
  location: string;
  city: string;
  media_owner_name: string;
  assignment_id: number | null;
  assignment_status: string | null;
  auditor_id: number | null;
  auditor_name: string | null;
};

type Auditor = {
  id: number;
  name: string;
  city: string;
  phone: string;
};

export default function AuditorAssignments() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  // Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedAuditorId, setSelectedAuditorId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [tasksRes, auditorsRes] = await Promise.all([
      getAssignmentTasks(),
      getAvailableAuditors()
    ]);
    
    if (tasksRes.success) setTasks(tasksRes.data as Task[]);
    if (auditorsRes.success) setAuditors(auditorsRes.data as Auditor[]);
    setIsLoading(false);
  };

  useEffect(() => {
    // This fetch is intentionally triggered on mount to hydrate assignment data.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedTask || !selectedAuditorId) return;
    setIsProcessing(true);
    
    const res = await assignAuditorToBooking(
      selectedTask.booking_id, 
      selectedTask.hoarding_id, 
      parseInt(selectedAuditorId)
    );
    
    if (res.success) {
      setSelectedTask(null);
      setSelectedAuditorId("");
      await fetchData(); // Refresh list
    } else {
      alert("Failed to assign auditor");
    }
    setIsProcessing(false);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.hoarding_id_string.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "Unassigned") return matchesSearch && !t.auditor_id;
    if (filter === "Assigned") return matchesSearch && t.auditor_id;
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-[#0A4D28]" />
              Auditor Dispatch & Assignments
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">
              Manually assign or re-assign Field Auditors to active hoarding campaigns for verification.
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Campaign or Site ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 focus:border-[#111827] text-[#111827]"
            />
          </div>

          <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
            {["All", "Unassigned", "Assigned"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${
                  filter === f 
                    ? "bg-[#111827] text-white shadow-sm" 
                    : "text-gray-500 hover:text-[#111827]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign & Site</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Timeline</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Auditor</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#111827] mx-auto mb-3" />
                      <span className="text-sm font-medium text-gray-500">Loading assignments...</span>
                    </td>
                  </tr>
                ) : filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.booking_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#111827] text-sm mb-1">{task.campaign_name}</div>
                        <div className="text-xs text-[#C58B24] font-bold mb-1">{task.hoarding_id_string}</div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {task.city} <span className="mx-1">•</span> <Building2 className="w-3 h-3" /> {task.media_owner_name}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(task.start_date).toLocaleDateString('en-IN', {month:'short', day:'numeric'})} - {new Date(task.end_date).toLocaleDateString('en-IN', {month:'short', day:'numeric'})}
                        </div>
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold uppercase">{task.booking_status}</span>
                      </td>
                      <td className="py-4 px-6 align-top">
                        {task.auditor_id ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 mb-1">
                              <UserCheck className="w-3 h-3" /> Assigned
                            </span>
                            <div className="font-bold text-[#111827] text-sm flex items-center gap-1.5">
                              {task.auditor_name}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">Status: {task.assignment_status}</div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                            <AlertCircle className="w-3 h-3" /> Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        <button 
                          onClick={() => {
                            setSelectedTask(task);
                            setSelectedAuditorId(task.auditor_id ? task.auditor_id.toString() : "");
                          }}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 ml-auto ${
                            task.auditor_id 
                              ? "bg-white border border-gray-200 text-gray-700 hover:border-[#111827] hover:text-[#111827]" 
                              : "bg-[#111827] text-white hover:bg-black"
                          }`}
                        >
                          <UserPlus className="w-4 h-4" /> 
                          {task.auditor_id ? "Re-Assign" : "Assign Auditor"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-gray-500 font-medium">
                      <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      No tasks found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#111827] text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#0A4D28]" />
                Dispatch Auditor
              </h2>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Campaign Target</p>
                <p className="font-bold text-[#111827] text-base mb-1">{selectedTask.campaign_name}</p>
                <div className="flex items-center gap-2 text-sm text-[#C58B24] font-bold">
                  <span>{selectedTask.hoarding_id_string}</span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-gray-600"><MapPin className="w-3.5 h-3.5" /> {selectedTask.city}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Select Field Auditor</label>
                <select 
                  value={selectedAuditorId}
                  onChange={(e) => setSelectedAuditorId(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-[#111827] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20"
                >
                  <option value="" disabled>-- Choose an Auditor --</option>
                  {auditors.map(auditor => (
                    <option key={auditor.id} value={auditor.id}>
                      {auditor.name} ({auditor.city}) - {auditor.phone}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Tip: Try assigning an auditor based in <b>{selectedTask.city}</b>.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setSelectedTask(null)} 
                className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssign}
                disabled={isProcessing || !selectedAuditorId || selectedAuditorId === selectedTask.auditor_id?.toString()}
                className="bg-[#111827] hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Assigning...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Confirm Dispatch</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}