"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, 
  Navigation, 
  Loader2, 
  Camera, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import Link from "next/link";
import { getAssignedCampaigns } from "@/actions/auditor";

type Assignment = {
  assignment_id: number;
  status: "Assigned" | "Visited" | "Completed";
  assigned_date: string;
  campaign_name: string;
  advertiser_name: string;
  hoarding_id: number;
  hoarding_id_string: string;
  location: string;
  gps_coordinates: string;
  size: string;
};

export default function AuditorDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      const res = await getAssignedCampaigns();
      if (res.success && res.data) {
        setAssignments(res.data as Assignment[]);
      }
      setIsLoading(false);
    };
    fetchAssignments();
  }, []);

  const pendingCount = assignments.filter(a => a.status !== 'Completed').length;
  const completedCount = assignments.filter(a => a.status === 'Completed').length;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Assigned Campaigns</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Review your field visit tasks and start site verifications.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm text-center">
              <p className="text-xs font-bold text-gray-500 uppercase">Pending</p>
              <p className="text-xl font-bold text-[#C58B24]">{pendingCount}</p>
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm text-center">
              <p className="text-xs font-bold text-gray-500 uppercase">Completed</p>
              <p className="text-xl font-bold text-[#0A4D28]">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-[#243839] text-lg">Task List</h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mb-3" />
                <p className="text-gray-500 font-medium text-sm">Fetching your assignments...</p>
              </div>
            ) : assignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((task) => (
                  <div key={task.assignment_id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#0A4D28]/30 transition-colors flex flex-col">
                    <div className="p-5 flex-1 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                          task.status === 'Completed' ? 'bg-[#0A4D28]/10 text-[#0A4D28] border-[#0A4D28]/20' : 
                          task.status === 'Visited' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          'bg-[#C58B24]/10 text-[#C58B24] border-[#C58B24]/20'
                        }`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(task.assigned_date).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#243839] text-lg leading-tight mb-1">{task.campaign_name}</h3>
                      <p className="text-sm font-bold text-[#C58B24] mb-4">{task.advertiser_name}</p>

                      <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#0A4D28] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-[#243839]">{task.hoarding_id_string}</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">{task.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                          <Navigation className="w-4 h-4 text-gray-400" />
                          <p className="text-[10px] font-mono text-gray-500">{task.gps_coordinates}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 mt-auto">
                      {task.status === 'Completed' ? (
                        <div className="w-full py-2.5 bg-gray-200 text-gray-600 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Audit Completed
                        </div>
                      ) : (
                        <Link 
                          href={`/auditor/verify?id=${task.assignment_id}`}
                          className="w-full py-2.5 bg-[#0A4D28] hover:bg-[#07381d] text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Camera className="w-4 h-4" /> Start Site Visit
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#243839] mb-1">No Active Assignments</h3>
                <p className="text-gray-500 font-medium text-sm">You currently have no campaigns assigned to you.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}