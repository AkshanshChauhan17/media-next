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
        console.error("Failed to load requests");
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
      case "Contacted": return "bg-[#0A4D28]/10 text-[#0A4D28] border-[#0A4D28]/20";
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Contact Requests</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Manage and review client inquiries</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839]"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-40 pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839] appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Client Info</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject & Message</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-[#0A4D28]">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p className="font-medium">Loading requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 align-top">
                        <div className="text-sm font-bold text-[#243839]">
                          {new Date(req.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">REQ-{req.id}</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="text-sm font-bold text-[#243839]">{req.name}</div>
                        <div className="text-sm text-[#C58B24] font-medium mt-0.5">{req.email}</div>
                        {req.phone && (
                          <div className="text-xs text-gray-500 mt-1">{req.phone}</div>
                        )}
                      </td>
                      <td className="py-4 px-6 align-top max-w-md">
                        <div className="text-sm font-bold text-[#243839] truncate">{req.subject}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">{req.message}</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(req.status)}`}>
                          {getStatusIcon(req.status)}
                          {req.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 align-top text-right relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === req.id ? null : req.id)}
                          className="p-1.5 text-gray-400 hover:text-[#0A4D28] rounded-md hover:bg-[#0A4D28]/5 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {activeMenu === req.id && (
                          <div className="absolute right-8 top-10 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                            <button 
                              onClick={() => handleStatusChange(req.id, "Contacted")}
                              className="w-full text-left px-4 py-2 text-sm text-[#0A4D28] hover:bg-[#0A4D28]/5 font-medium flex items-center"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" /> Mark Contacted
                            </button>
                            <button 
                              onClick={() => handleStatusChange(req.id, "Pending")}
                              className="w-full text-left px-4 py-2 text-sm text-[#C58B24] hover:bg-[#C58B24]/5 font-medium flex items-center"
                            >
                              <Clock className="w-4 h-4 mr-2" /> Mark Pending
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button 
                              onClick={() => handleStatusChange(req.id, "Rejected")}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Reject Request
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">
                      No requests found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <p className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-[#243839]">{startIndex + 1}</span> to <span className="font-bold text-[#243839]">{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</span> of <span className="font-bold text-[#243839]">{totalItems}</span> requests
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded border border-gray-200 text-gray-500 hover:text-[#0A4D28] hover:border-[#0A4D28] disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-sm font-bold text-[#243839] px-2">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded border border-gray-200 text-gray-500 hover:text-[#0A4D28] hover:border-[#0A4D28] disabled:opacity-50 disabled:cursor-not-allowed bg-white transition-colors"
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