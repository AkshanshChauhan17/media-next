"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { 
  ClipboardCheck, 
  Camera, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin,
  Clock,
  Loader2,
  X,
  FileImage
} from "lucide-react";
import { getInstallationTasks, submitInstallationReport } from "@/actions/mediaOwner";

type InstallationTask = {
  booking_id: number;
  advertiser_name: string;
  campaign_name: string;
  start_date: string;
  hoarding_id_string: string;
  location: string;
  report_id: number | null;
  report_status: "Pending Review" | "Approved" | "Rejected" | null;
};

export default function InstallationChecklist() {
  const [tasks, setTasks] = useState<InstallationTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedTask, setSelectedTask] = useState<InstallationTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [proofFile, setProofFile] = useState<File | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    const res = await getInstallationTasks();
    if (res.success && res.data) {
      setTasks(res.data as InstallationTask[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      setIsLoading(true);
      const res = await getInstallationTasks();

      if (!isMounted) return;

      if (res.success && res.data) {
        setTasks(res.data as InstallationTask[]);
      }
      setIsLoading(false);
    };

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`Photo exceeds the 5MB limit.`);
        e.target.value = "";
        return;
      }
      setErrorMsg("");
      setProofFile(file);
    }
  };

  const handleSubmitReport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) return;

    if (!proofFile) {
      setErrorMsg("Installation photo is mandatory. Cannot submit without visual proof.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("bookingId", selectedTask.booking_id.toString());
    formData.append("photoFile", proofFile);

    const res = await submitInstallationReport(formData);

    if (res.success) {
      setIsModalOpen(false);
      setSelectedTask(null);
      setProofFile(null);
      await fetchTasks();
    } else {
      setErrorMsg(res.error || "Failed to submit report. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-gray-50 text-gray-600 border-gray-200">Needs Action</span>;
    if (status === "Pending Review") return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-yellow-50 text-yellow-700 border-yellow-200">Pending Review</span>;
    if (status === "Approved") return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-[#0A4D28]/10 text-[#0A4D28] border-[#0A4D28]/20">Approved</span>;
    if (status === "Rejected") return <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-red-50 text-red-600 border-red-200">Rejected (Re-install)</span>;
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Installation & QC Checklists</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Submit visual proof and quality checklists for new campaign installations.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-[#C58B24]" />
              Pending & Recent Installations
            </h2>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Details</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Hoarding & Location</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">QC Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-[#0A4D28]">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="font-medium text-sm">Loading tasks...</span>
                      </div>
                    </td>
                  </tr>
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.booking_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm">{task.campaign_name}</div>
                        <div className="text-xs text-[#C58B24] font-semibold mt-0.5">{task.advertiser_name}</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm">{task.hoarding_id_string}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-0.5">
                          <MapPin className="w-3 h-3" /> {task.location}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="text-sm font-semibold text-[#243839] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(task.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        {getStatusBadge(task.report_status)}
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        {!task.report_status || task.report_status === "Rejected" ? (
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setProofFile(null);
                              setErrorMsg("");
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A4D28] hover:bg-[#07381d] text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            <Camera className="w-3.5 h-3.5" /> Submit Report
                          </button>
                        ) : (
                          <button className="text-sm font-bold text-[#C58B24] hover:text-[#0A4D28] transition-colors">
                            View Report
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">
                      No pending installation tasks found for accepted bookings.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Installation Submission Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#243839] text-base flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#0A4D28]" />
                Installation Report: {selectedTask.hoarding_id_string}
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTask(null);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-600 text-sm font-medium">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {errorMsg}
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 font-bold flex items-center gap-2 mb-6">
                <AlertTriangle className="w-4 h-4" /> 
                Strict Policy: No report can be submitted without clear visual installation proof.
              </div>

              <form id="installationForm" onSubmit={handleSubmitReport} className="space-y-6">
                
                {/* 1. File Upload (Mandatory) */}
                <div>
                  <label className="block text-sm font-bold text-[#243839] mb-2 flex items-center gap-1.5">
                    1. Upload Installation Photo <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center transition-colors cursor-pointer group relative ${proofFile ? 'border-[#0A4D28] bg-[#0A4D28]/5' : 'border-gray-300 hover:border-[#0A4D28]/50 hover:bg-[#0A4D28]/5'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${proofFile ? 'bg-[#0A4D28] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#0A4D28]/10 group-hover:text-[#0A4D28]'}`}>
                      {proofFile ? <FileImage className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                    </div>
                    <h3 className="text-sm font-bold text-[#243839] mb-1">
                      {proofFile ? "Proof Uploaded" : "Tap to upload visual proof"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {proofFile ? proofFile.name : "JPG, PNG only (Max 5MB). Photo must show flex clearly."}
                    </p>
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/jpeg, image/png, image/jpg" 
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-bold text-[#243839] mb-4">2. Quality Checklist</h3>
                  <div className="space-y-4">
                    
                    {/* Checklist Items */}
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                      <span className="text-sm font-semibold text-[#243839]">Flex properly mounted & aligned?</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                          <input type="radio" name="flexMounted" value="true" required className="accent-[#0A4D28] w-4 h-4" /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                          <input type="radio" name="flexMounted" value="false" required className="accent-[#0A4D28] w-4 h-4" /> No
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                      <span className="text-sm font-semibold text-[#243839]">Lighting system working correctly?</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                          <input type="radio" name="lightingWorking" value="true" required className="accent-[#0A4D28] w-4 h-4" /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                          <input type="radio" name="lightingWorking" value="false" required className="accent-[#0A4D28] w-4 h-4" /> No
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                      <span className="text-sm font-semibold text-[#243839]">Damage visibility on structure?</span>
                      <select name="damageStatus" required className="bg-white border border-gray-300 text-[#243839] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A4D28]">
                        <option value="None">None (Perfect)</option>
                        <option value="Minor">Minor (Acceptable)</option>
                        <option value="Severe">Severe (Needs Repair)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                      <span className="text-sm font-semibold text-[#243839]">Any physical obstruction present?</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                          <input type="radio" name="obstructionPresent" value="true" required className="accent-[#0A4D28] w-4 h-4" /> Yes
                        </label>
                        <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                          <input type="radio" name="obstructionPresent" value="false" required className="accent-[#0A4D28] w-4 h-4" /> No
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button 
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTask(null);
                }}
                className="px-6 py-2.5 rounded-lg text-[#243839] font-bold hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="installationForm"
                disabled={isSubmitting || !proofFile}
                className="bg-[#0A4D28] hover:bg-[#07381d] text-white px-8 py-2.5 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Submit Report</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}