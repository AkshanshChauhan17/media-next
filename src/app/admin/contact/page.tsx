"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Clock,
  MoreVertical,
  Loader2
} from "lucide-react";
import { getContactRequests, updateContactRequestStatus } from "@/actions/contact";

interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminContactDashboard() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await getContactRequests({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
          status: statusFilter,
        });

        if (response.success && response.data) {
          setRequests(response.data as ContactRequest[]);
          setTotalPages(response.pagination?.totalPages || 1);
          setTotalItems(response.pagination?.totalItems || 0);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchRequests();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm, statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    setActiveMenu(null);
    
    await updateContactRequestStatus(id, newStatus);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "Pending": return "bg-[#C58B24]/10 text-[#C58B24] border-[#C58B24]/20";
      case "Contacted": return "bg-green-50 text-green-700 border-green-200";
      case "Rejected": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Pending": return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case "Contacted": return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      case "Rejected": return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-20">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#243839]">Contact Requests</h1>
            <p className="text-gray-500 font-medium text-sm mt-2">Manage and review incoming client inquiries</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-72 pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30 focus:border-[#C58B24] text-[#243839] shadow-sm transition-all"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-48 pl-11 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30 focus:border-[#C58B24] text-[#243839] appearance-none cursor-pointer shadow-sm transition-all"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Date & ID</th>
                  <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Client Info</th>
                  <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Subject & Message</th>
                  <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center text-[#C58B24]">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="font-bold text-[#243839]">Loading requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-5 px-6 align-top whitespace-nowrap">
                        <div className="text-sm font-black text-[#243839]">
                          {new Date(req.created_at).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}
                        </div>
                        <div className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">REQ-{req.id}</div>
                      </td>
                      <td className="py-5 px-6 align-top whitespace-nowrap">
                        <div className="text-sm font-black text-[#243839]">{req.name}</div>
                        <div className="text-sm text-[#C58B24] font-bold mt-1">{req.email}</div>
                        {req.phone && (
                          <div className="text-xs text-gray-500 font-medium mt-1">{req.phone}</div>
                        )}
                      </td>
                      <td className="py-5 px-6 align-top max-w-md">
                        <div className="text-sm font-black text-[#243839] truncate mb-1">{req.subject}</div>
                        <div className="text-sm text-gray-500 font-medium line-clamp-2 leading-relaxed">{req.message}</div>
                      </td>
                      <td className="py-5 px-6 align-top whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusStyle(req.status)}`}>
                          {getStatusIcon(req.status)}
                          {req.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 align-top text-right relative whitespace-nowrap">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === req.id ? null : req.id)}
                          className="p-2 text-gray-400 hover:text-[#243839] rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {activeMenu === req.id && (
                          <div className="absolute right-8 top-12 w-48 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-10 overflow-hidden">
                            <button 
                              onClick={() => handleStatusChange(req.id, "Contacted")}
                              className="w-full text-left px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 font-bold flex items-center transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 mr-2.5" /> Mark Contacted
                            </button>
                            <button 
                              onClick={() => handleStatusChange(req.id, "Pending")}
                              className="w-full text-left px-4 py-2.5 text-sm text-[#C58B24] hover:bg-[#C58B24]/10 font-bold flex items-center transition-colors"
                            >
                              <Clock className="w-4 h-4 mr-2.5" /> Mark Pending
                            </button>
                            <div className="border-t border-gray-50 my-1"></div>
                            <button 
                              onClick={() => handleStatusChange(req.id, "Rejected")}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center transition-colors"
                            >
                              <XCircle className="w-4 h-4 mr-2.5" /> Reject Request
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                        <Filter className="w-8 h-8 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-black text-[#243839] mb-1">No requests found</h3>
                      <p className="text-gray-500 font-medium text-sm">Adjust your filters or search term to see more results.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <p className="text-sm text-gray-500 font-medium">
                Showing <span className="font-black text-[#243839]">{startIndex + 1}</span> to <span className="font-black text-[#243839]">{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-black text-[#243839]">{totalItems}</span> requests
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-[#C58B24] hover:border-[#C58B24] disabled:opacity-40 disabled:cursor-not-allowed bg-white transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-sm font-black text-[#243839] px-3 bg-white border border-gray-200 py-1.5 rounded-xl shadow-sm">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-[#C58B24] hover:border-[#C58B24] disabled:opacity-40 disabled:cursor-not-allowed bg-white transition-all shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}