"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  MapPin,
  CalendarRange,
  Download,
  Camera,
  CheckCircle2,
  Loader2,
  Clock,
  AlertCircle,
  ImageIcon,
  Eye,
  X
} from "lucide-react";
import { getAdvertiserCampaigns } from "@/actions/advertiser";
import jsPDF from "jspdf";

type Campaign = {
  booking_id: number;
  campaign_name: string;
  start_date: string;
  end_date: string;
  total_amount: string;
  status: string; // Changed to string to prevent strict type blocking
  artwork_url: string;
  created_at: string;
  hoarding_id_string: string;
  location: string;
  size: string;
  city: string;
  installation_photo: string | null;
};

export default function ActiveCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const res = await getAdvertiserCampaigns();
        console.log("Raw Data from Backend:", res); // 👈 Debugging ke liye log

        if (res.success && Array.isArray(res.data)) {
          setCampaigns(res.data as Campaign[]);
        } else {
          console.error("No data found or format incorrect");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleDownloadInvoice = (campaign: Campaign) => {
    const doc = new jsPDF();

    // Brand Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(36, 56, 57); // #243839
    doc.text("BOOK MY AD SPACE", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Official Tax Invoice & Campaign Receipt", 14, 26);

    // Divider Line
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 32, 196, 32);

    // Invoice Meta
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(36, 56, 57);
    doc.text(`Invoice #INV-2026-${campaign.booking_id}`, 14, 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 48);
    doc.text(`Status: PAID (Online Gateway)`, 14, 54);

    // Campaign Details Box
    doc.setFillColor(245, 247, 247);
    doc.roundedRect(14, 62, 182, 45, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.text("Campaign Summary:", 20, 72);
    doc.setFont("helvetica", "normal");
    doc.text(`Campaign Name: ${campaign.campaign_name || 'N/A'}`, 20, 80);
    doc.text(`Hoarding Site ID: ${campaign.hoarding_id_string || 'N/A'} (${campaign.city || ''})`, 20, 88);
    doc.text(`Location: ${campaign.location || 'N/A'}`, 20, 96);

    // Pricing Table Header
    doc.setFillColor(36, 56, 57);
    doc.rect(14, 115, 182, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Description", 20, 122);
    doc.text("Amount (INR)", 150, 122);

    // Pricing Row
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text("Outdoor Hoarding Advertising Space", 20, 135);
    
    const baseAmount = Number(campaign.total_amount || 0) / 1.18;
    const gstAmount = Number(campaign.total_amount || 0) - baseAmount;

    doc.text(`Rs. ${baseAmount.toFixed(2)}`, 150, 135);

    doc.text("GST (18%) Included", 20, 143);
    doc.text(`Rs. ${gstAmount.toFixed(2)}`, 150, 143);

    // Total Line
    doc.line(14, 150, 196, 150);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(36, 56, 57);
    doc.text("Total Paid:", 20, 158);
    doc.text(`Rs. ${Number(campaign.total_amount || 0).toLocaleString()}`, 150, 158);

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated invoice and requires no physical signature.", 14, 185);

    // Save PDF
    doc.save(`Tax_Invoice_${campaign.booking_id}.pdf`);
  };

  // Improved Filter Logic (Case insensitive & handles multiple status variations)
  const filteredCampaigns = campaigns.filter(c => {
    if (filter === "All") return true;

    const dbStatus = c.status?.toLowerCase() || "";

    if (filter === "Active") {
      return dbStatus === "accepted" || dbStatus === "active" || dbStatus === "in progress";
    }
    if (filter === "Pending") {
      return dbStatus === "pending";
    }
    if (filter === "Completed") {
      return dbStatus === "completed" || dbStatus === "settled";
    }
    return dbStatus === filter.toLowerCase();
  });

  const getStatusDisplay = (status: string, hasPhoto: boolean) => {
    const s = status?.toLowerCase() || "";

    if (s === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
          <Clock className="w-3.5 h-3.5" /> Awaiting Owner Approval
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
          <AlertCircle className="w-3.5 h-3.5" /> Booking Rejected
        </span>
      );
    }
    if (s === "completed" || s === "settled") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Campaign Ended
        </span>
      );
    }
    if (hasPhoto) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#0A4D28]/10 text-[#0A4D28] border border-[#0A4D28]/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> Live & Verified
        </span>
      );
    }
    // Default Active state (Accepted but no photo yet)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <Camera className="w-3.5 h-3.5" /> Awaiting Installation
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839] flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-[#0A4D28]" />
              Campaign Tracking
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">
              Monitor your active bookings, verify auditor installation proofs, and download invoices.
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
            {["All", "Active", "Pending", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 text-sm font-bold rounded-md transition-colors whitespace-nowrap ${filter === f
                  ? "bg-[#243839] text-white"
                  : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mb-4" />
            <p className="text-gray-500 font-medium text-sm">Loading your campaigns...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <TrendingUp className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-[#243839] mb-2">No Campaigns Found</h3>
            <p className="text-gray-500 font-medium max-w-md mb-6">
              You dont have any {filter !== "All" ? filter.toLowerCase() : ""} campaigns at the moment.
            </p>
            <button
              onClick={() => window.location.href = '/advertiser/search'}
              className="bg-[#C58B24] hover:bg-[#a6741c] text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors"
            >
              Start New Campaign
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.booking_id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col xl:flex-row">

                <div className="p-6 xl:w-1/3 bg-gray-50/50 border-b xl:border-b-0 xl:border-r border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {getStatusDisplay(campaign.status, !!campaign.installation_photo)}
                      <span className="text-xs text-gray-400 font-bold">
                        ID: #{campaign.booking_id}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#243839] mb-1">{campaign.campaign_name || "Untitled Campaign"}</h2>
                    <p className="text-sm font-bold text-[#C58B24] mb-6">Total Value: ₹{Number(campaign.total_amount || 0).toLocaleString()}</p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#0A4D28] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-[#243839]">{campaign.hoarding_id_string} ({campaign.city})</p>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">{campaign.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CalendarRange className="w-4 h-4 text-[#0A4D28] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-[#243839]">
                            {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'} -
                            {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">Campaign Duration</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadInvoice(campaign)}
                    className="mt-8 w-full bg-white border border-gray-200 hover:border-[#0A4D28] hover:text-[#0A4D28] text-gray-700 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download Tax Invoice
                  </button>
                </div>

                <div className="p-6 xl:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col h-full">
                    <h3 className="text-sm font-bold text-[#243839] mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#C58B24]" /> Your Artwork
                    </h3>
                    <div className="relative flex-1 min-h-[200px] bg-gray-100 rounded-xl border border-gray-200 overflow-hidden group">
                      {campaign.artwork_url ? (
                        <>
                          <img src={campaign.artwork_url} alt="Artwork" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => setPreviewImage(campaign.artwork_url)} className="bg-white text-[#243839] px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                              <Eye className="w-4 h-4" /> View Full
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium">
                          No artwork uploaded
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col h-full">
                    <h3 className="text-sm font-bold text-[#0A4D28] mb-3 flex items-center gap-2">
                      <Camera className="w-4 h-4" /> Auditors Installation Proof
                    </h3>
                    <div className="relative flex-1 min-h-[200px] bg-gray-100 rounded-xl border border-gray-200 overflow-hidden group">
                      {campaign.installation_photo ? (
                        <>
                          <img src={campaign.installation_photo} alt="Installation Proof" className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> GPS Verified
                          </div>
                          <div className="absolute inset-0 bg-[#0A4D28]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => setPreviewImage(campaign.installation_photo)} className="bg-white text-[#0A4D28] px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                              <Eye className="w-4 h-4" /> Verify Install
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl m-1">
                          {campaign.status?.toLowerCase() === "accepted" || campaign.status?.toLowerCase() === "active" ? (
                            <>
                              <Camera className="w-8 h-8 mb-2 opacity-50" />
                              <span className="text-sm font-bold text-gray-500">Awaiting Install</span>
                              <span className="text-xs font-medium text-gray-400 mt-1 px-4 text-center">Auditor will upload proof here once installed.</span>
                            </>
                          ) : (
                            <span className="text-sm font-medium">Pending Approval</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={previewImage} alt="Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}

    </div>
  );
}