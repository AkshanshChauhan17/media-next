"use client";

import { useState, useEffect, type FormEvent } from "react";
import { 
  Headset, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  Loader2,
  X,
  AlertCircle,
  MessageSquareText
} from "lucide-react";
import { getSupportTickets, createSupportTicket } from "@/actions/advertiser";

type Ticket = {
  id: number;
  subject: string;
  message: string;
  status: "Open" | "In Progress" | "Resolved";
  created_at: string;
  updated_at: string;
};

export default function SupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTickets = async () => {
    setIsLoading(true);
    const res = await getSupportTickets();
    if (res.success && res.data) {
      setTickets(res.data as Ticket[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const loadTickets = async () => {
      await fetchTickets();
    };
    loadTickets();
  }, []);

  const handleCreateTicket = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const res = await createSupportTicket(formData);

    if (res.success) {
      setIsModalOpen(false);
      await fetchTickets();
    } else {
      setErrorMsg(res.error || "Failed to create ticket. Please try again.");
    }
    setIsSubmitting(false);
  };

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toString().includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    if (status === "Open") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <AlertCircle className="w-3.5 h-3.5" /> Open
        </span>
      );
    }
    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
          <Clock className="w-3.5 h-3.5" /> In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839] flex items-center gap-3">
              <Headset className="w-8 h-8 text-[#0A4D28]" />
              Support & Helpdesk
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">
              Need assistance with a campaign or billing? Raise a ticket and our team will assist you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839] shadow-sm"
              />
            </div>
            <button 
              onClick={() => {
                setErrorMsg("");
                setIsModalOpen(true);
              }}
              className="bg-[#C58B24] hover:bg-[#a6741c] text-white px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> New Ticket
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mx-auto mb-3" />
                <span className="text-sm font-medium text-gray-500">Loading your tickets...</span>
              </div>
            ) : filteredTickets.length > 0 ? (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#0A4D28]/30 transition-colors bg-gray-50/30">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Ticket #{ticket.id}
                          </span>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <h3 className="font-bold text-[#243839] text-lg">{ticket.subject}</h3>
                      </div>
                      <div className="text-right flex flex-col md:items-end text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5 mb-1">
                          <Clock className="w-3.5 h-3.5" /> 
                          Created: {new Date(ticket.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span>
                          Last Updated: {new Date(ticket.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-100 p-4 rounded-lg mt-3 text-sm text-gray-600">
                      <p className="whitespace-pre-wrap">{ticket.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <MessageSquareText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#243839] mb-2">No Support Tickets</h3>
                <p className="text-gray-500 font-medium max-w-md mx-auto">
                  You havent raised any support tickets yet. If you need help with your campaigns, feel free to create one.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
                <Headset className="w-5 h-5 text-[#0A4D28]" />
                Raise New Ticket
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-600 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#243839] mb-1.5">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    required 
                    placeholder="Brief description of the issue"
                    className="w-full bg-white border border-gray-200 text-[#243839] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#243839] mb-1.5">Detailed Message</label>
                  <textarea 
                    name="message"
                    required 
                    rows={5}
                    placeholder="Provide as much detail as possible to help us resolve your issue quickly..."
                    className="w-full bg-white border border-gray-200 text-[#243839] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#0A4D28] hover:bg-[#07381d] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                  ) : (
                    "Submit Ticket"
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}