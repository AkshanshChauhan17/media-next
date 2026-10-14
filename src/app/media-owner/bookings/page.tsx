"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  CheckCircle, 
  XCircle, 
  CalendarRange, 
  IndianRupee, 
  MapPin, 
  Filter,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getBookings, updateBookingStatus } from "@/actions/mediaOwner";

type Booking = {
  id: number;
  hoarding_id_string: string;
  location: string;
  size: string;
  advertiser_name: string;
  campaign_name: string;
  start_date: string;
  end_date: string;
  total_amount: string;
  status: "Pending" | "Accepted" | "Rejected" | "Completed";
  created_at: string;
};

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      const res = await getBookings();
      if (res.success && Array.isArray(res.data)) {
        setBookings(res.data as Booking[]);
      }
      setIsLoading(false);
    };
    
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    setProcessingId(id);
    const res = await updateBookingStatus(id, status);
    
    if (res.success) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: status as "Pending" | "Accepted" | "Rejected" | "Completed" } : b));
    } else {
      alert(res.error || "Failed to update booking status");
    }
    setProcessingId(null);
  };

  const filteredBookings = bookings.filter(b => 
    statusFilter === "All" || b.status === statusFilter
  );

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "Pending": return "bg-[#C58B24]/10 text-[#C58B24] border-[#C58B24]/20";
      case "Accepted": return "bg-[#0A4D28]/10 text-[#0A4D28] border-[#0A4D28]/20";
      case "Rejected": return "bg-red-50 text-red-600 border-red-100";
      case "Completed": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Booking Requests</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Review, accept, or reject incoming campaign requests.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            {["All", "Pending", "Accepted", "Rejected"].map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                  statusFilter === filter 
                    ? "bg-[#0A4D28] text-white" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mb-4" />
              <p className="text-gray-500 font-medium">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#243839] mb-2">No Bookings Found</h3>
              <p className="text-gray-500 font-medium max-w-md">
                You dont have any {statusFilter !== "All" ? statusFilter.toLowerCase() : ""} bookings at the moment. New requests will appear here.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Received: {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#243839] text-xl mb-1">{booking.advertiser_name}</h3>
                  <p className="text-[#C58B24] font-bold text-sm mb-6">{booking.campaign_name}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0A4D28]/10 flex items-center justify-center flex-shrink-0">
                      <IndianRupee className="w-5 h-5 text-[#0A4D28]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                      <p className="text-lg font-bold text-[#243839]">₹{Number(booking.total_amount).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Hoarding Details
                      </p>
                      <p className="font-bold text-[#243839]">{booking.hoarding_id_string}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{booking.location}</p>
                      <p className="text-xs text-gray-500 mt-0.5 bg-gray-100 inline-block px-1.5 py-0.5 rounded">{booking.size}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1.5">
                        <CalendarRange className="w-3.5 h-3.5" /> Campaign Duration
                      </p>
                      <p className="font-bold text-[#243839]">
                        {new Date(booking.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} 
                        <span className="mx-2 text-gray-400">to</span> 
                        {new Date(booking.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))} Days
                      </p>
                    </div>
                  </div>

                  {booking.status === "Pending" && (
                    <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, 'Accepted')}
                        disabled={processingId === booking.id}
                        className="flex-1 bg-[#0A4D28] hover:bg-[#07381d] text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {processingId === booking.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <><CheckCircle className="w-5 h-5" /> Accept Booking</>
                        )}
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                        disabled={processingId === booking.id}
                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 hover:border-red-600 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-5 h-5" /> Reject
                      </button>
                    </div>
                  )}
                  
                  {booking.status !== "Pending" && (
                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">
                        This booking was <strong className={booking.status === "Accepted" ? "text-[#0A4D28]" : "text-red-600"}>{booking.status.toLowerCase()}</strong>.
                      </p>
                      {booking.status === "Accepted" && (
                        <button className="text-[#C58B24] hover:text-[#0A4D28] font-bold text-sm transition-colors">
                          View Contract
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>
    </div>
  );
}