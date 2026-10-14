"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { 
  Headset, 
  Search, 
  CheckCircle2, 
  Clock, 
  Loader2,
  AlertCircle,
  MessageSquareText,
  User,
  Send,
  X,
  Reply
} from "lucide-react";
import { getAllSupportTickets, resolveSupportTicket } from "@/actions/admin";

type Ticket = {
  id: number;
  user_name: string;
  user_email: string;
  user_role: string;
  subject: string;
  message: string;
  admin_response: string | null;
  status: "Open" | "In Progress" | "Resolved";
  created_at: string;
  updated_at: string;
};

export default function SupportDesk() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Open"); // Default to Open to highlight pending work

  // Modal State
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [adminReply, setAdminReply] = useState("");
  const [newStatus, setNewStatus] = useState<"Open" | "In Progress" | "Resolved">("In Progress");

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    const res = await getAllSupportTickets({ status: statusFilter, q: searchQuery });
    if (res.success && res.data) {
      setTickets(res.data as Ticket[]);
    }
    setIsLoading(false);
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) {
        await fetchTickets();
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [fetchTickets]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleUpdateTicket = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setIsProcessing(true);
    
    const res = await resolveSupportTicket(selectedTicket.id, newStatus, adminReply);
    
    if (res.success) {
      setSelectedTicket(null);
      await fetchTickets();
    } else {
      alert("Failed to update ticket.");
    }
    setIsProcessing(false);
  };

  const openTicketModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setAdminReply(ticket.admin_response || "");
    setNewStatus(ticket.status);
  };

  const getStatusBadge = (status: string) => {
    if (status === "Open") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 w-max">
          <AlertCircle className="w-3.5 h-3.5" /> Open
        </span>
      );
    }
    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 w-max">
          <Clock className="w-3.5 h-3.5" /> In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 w-max">
        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] flex items-center gap-3">
              <Headset className="w-8 h-8 text-[#C58B24]" />
              Support Desk
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">
              Manage platform queries, resolve advertiser disputes, and provide customer support.
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Subject, Ticket ID, or User..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 focus:border-[#111827] text-[#111827]"
            />
          </form>

          <div className="w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-[#111827] text-white border border-[#111827] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 font-bold cursor-pointer"
            >
              <option value="All">All Tickets</option>
              <option value="Open">Open (Needs Action)</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#111827] mx-auto mb-3" />
                <span className="text-sm font-medium text-gray-500">Loading support queue...</span>
              </div>
            ) : tickets.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#111827]/30 hover:shadow-md transition-all bg-white flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(ticket.status)}
                        <h3 className="font-bold text-[#111827] text-lg leading-tight line-clamp-1">{ticket.subject}</h3>
                      </div>
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 whitespace-nowrap">
                        ID: #{ticket.id}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                      {ticket.message}
                    </p>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111827]">{ticket.user_name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{new Date(ticket.created_at).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => openTicketModal(ticket)}
                        className="text-sm font-bold text-[#0A4D28] hover:bg-[#0A4D28]/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Reply className="w-4 h-4" /> Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <MessageSquareText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#111827] mb-2">Inbox Zero</h3>
                <p className="text-gray-500 font-medium max-w-md mx-auto">
                  No support tickets found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#111827] text-lg flex items-center gap-2">
                <Headset className="w-5 h-5 text-[#C58B24]" />
                Ticket #{selectedTicket.id}
              </h2>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              
              {/* User Original Message */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-[#111827]">{selectedTicket.user_name}</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{selectedTicket.user_role.replace('_', ' ')}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {new Date(selectedTicket.created_at).toLocaleString('en-IN', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <h3 className="font-bold text-[#111827] mb-2">{selectedTicket.subject}</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              {/* Admin Reply Form */}
              <form id="replyForm" onSubmit={handleUpdateTicket} className="space-y-5 border-t border-gray-100 pt-6">
                
                <h3 className="font-bold text-[#111827] flex items-center gap-2">
                  <Reply className="w-4 h-4 text-[#0A4D28]" /> Admin Response
                </h3>

                <div>
                  <textarea 
                    required 
                    rows={6}
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    placeholder="Type your response to the user here..."
                    className="w-full bg-gray-50 border border-gray-200 text-[#111827] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111827] mb-2">Update Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer bg-blue-50/50 border border-blue-100 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <input type="radio" name="status" value="Open" checked={newStatus === "Open"} onChange={() => setNewStatus("Open")} className="accent-blue-600 w-4 h-4" /> Open
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer bg-yellow-50/50 border border-yellow-100 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors">
                      <input type="radio" name="status" value="In Progress" checked={newStatus === "In Progress"} onChange={() => setNewStatus("In Progress")} className="accent-yellow-600 w-4 h-4" /> In Progress
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer bg-green-50/50 border border-green-100 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                      <input type="radio" name="status" value="Resolved" checked={newStatus === "Resolved"} onChange={() => setNewStatus("Resolved")} className="accent-green-600 w-4 h-4" /> Resolved
                    </label>
                  </div>
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <button 
                type="button" 
                onClick={() => setSelectedTicket(null)} 
                className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="replyForm"
                disabled={isProcessing || !adminReply}
                className="bg-[#111827] hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Reply & Update</>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}