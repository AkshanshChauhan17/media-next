"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Loader2,
  IndianRupee,
  Building2,
  ArrowRightLeft,
  X,
  Landmark,
  ShieldCheck
} from "lucide-react";
import { getFinancialRecords, processPayout } from "@/actions/admin";

type FinanceRecord = {
  payment_id: number;
  transaction_id: string;
  total: number;
  commission: number;
  payout: number;
  payment_date: string;
  payout_status: "Pending" | "Processing" | "Settled";
  settled_at: string | null;
  campaign_name: string;
  advertiser_name: string;
  hoarding_id_string: string;
  media_owner_name: string;
  media_owner_email: string;
};

export default function FinancialsAndPayouts() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<FinanceRecord | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchFinancials = async () => {
    setIsLoading(true);
    const res = await getFinancialRecords({ status: statusFilter, q: searchQ });
    if (res.success && res.data) {
      setRecords(res.data as FinanceRecord[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const loadFinancials = async () => {
      await fetchFinancials();
    };
    loadFinancials();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFinancials();
  };

  const handleSettlePayment = async () => {
    if (!selectedRecord) return;
    setIsProcessing(true);
    
    const res = await processPayout(selectedRecord.payment_id);
    
    if (res.success) {
      setSelectedRecord(null);
      await fetchFinancials(); // Refresh ledger
    } else {
      alert("Failed to process settlement");
    }
    setIsProcessing(false);
  };

  // Aggregated Stats
  const totalRevenue = records.reduce((acc, curr) => acc + curr.total, 0);
  const totalCommission = records.reduce((acc, curr) => acc + curr.commission, 0);
  const pendingPayouts = records.filter(r => r.payout_status === 'Pending').reduce((acc, curr) => acc + curr.payout, 0);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Settled": return <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> Settled</span>;
      case "Processing": return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Loader2 className="w-3 h-3 animate-spin" /> Processing</span>;
      default: return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] flex items-center gap-3">
            <Wallet className="w-8 h-8 text-[#0A4D28]" />
            Financials & Vendor Payouts
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-2">
            Track gross revenue, monitor platform commissions, and settle payments with Media Owners.
          </p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500">Gross Processed Volume</h3>
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#111827]">₹{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          
          <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800 shadow-sm text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400">Total Platform Earnings (10%)</h3>
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-[#C58B24]">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#C58B24]">₹{totalCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>

          <div className="bg-red-50 rounded-2xl p-6 border border-red-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-red-700">Pending Vendor Payouts</h3>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <Landmark className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-red-700">₹{pendingPayouts.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search TXN ID or Vendor..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 focus:border-[#111827] text-[#111827]"
            />
          </form>

          <div className="w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-[#111827] font-bold cursor-pointer"
            >
              <option value="All">All Transactions</option>
              <option value="Pending">Pending Payouts</option>
              <option value="Settled">Settled Payouts</option>
            </select>
          </div>
        </div>

        {/* Financial Ledger Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction Info</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Booking & Advertiser</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor (Media Owner)</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Financials</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#111827] mx-auto mb-3" />
                      <span className="text-sm font-medium text-gray-500">Loading master ledger...</span>
                    </td>
                  </tr>
                ) : records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.payment_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#111827] text-sm mb-1">{record.transaction_id}</div>
                        <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(record.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#111827] text-sm mb-0.5">{record.campaign_name}</div>
                        <div className="text-xs text-gray-500 font-medium">{record.advertiser_name} (Site: {record.hoarding_id_string})</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 flex-shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-[#111827] text-sm">{record.media_owner_name}</div>
                            <div className="text-xs text-gray-500 font-medium">{record.media_owner_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        <div className="text-xs text-gray-500 font-medium mb-1">Gross: <span className="font-bold text-[#111827]">₹{record.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                        <div className="text-xs text-[#C58B24] font-bold mb-1 border-b border-gray-100 pb-1">- Comm (10%): ₹{record.commission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className="text-sm font-black text-[#0A4D28]">Net: ₹{record.payout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(record.payout_status)}
                          {record.payout_status === 'Pending' ? (
                            <button 
                              onClick={() => setSelectedRecord(record)}
                              className="text-xs font-bold text-[#0A4D28] hover:underline"
                            >
                              Settle Now
                            </button>
                          ) : (
                            record.settled_at && (
                              <span className="text-[10px] text-gray-400 font-mono">
                                Cleared: {new Date(record.settled_at).toLocaleDateString()}
                              </span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-500 font-medium">
                      <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      No financial records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Settle Payout Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#111827] text-lg flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#0A4D28]" />
                Process Vendor Settlement
              </h2>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Pay To
                </p>
                <p className="font-bold text-[#111827] text-lg">{selectedRecord.media_owner_name}</p>
                <p className="text-sm text-gray-600 font-medium">{selectedRecord.media_owner_email}</p>
                
                <div className="mt-4 pt-4 border-t border-blue-200/50">
                  <p className="text-xs text-gray-500 font-bold mb-1">Bank Details (Simulated)</p>
                  <p className="text-sm font-mono font-bold text-[#111827]">A/C: 9876543210123 • IFSC: HDFC0001234</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Gross Campaign Value (Paid by Advertiser)</span>
                  <span className="font-bold text-[#111827]">₹{selectedRecord.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600 border-b border-gray-100 pb-3">
                  <span>Platform Commission (10%)</span>
                  <span className="font-bold text-[#C58B24]">- ₹{selectedRecord.commission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-[#111827] text-base">Net Payout Amount</span>
                  <span className="font-black text-[#0A4D28] text-2xl">₹{selectedRecord.payout.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-500 font-medium flex items-start gap-2 mb-6">
                <ShieldCheck className="w-4 h-4 text-[#0A4D28] flex-shrink-0" />
                By clicking Settle Transfer, you confirm that funds have been successfully routed to the vendors bank account. This action will mark the ledger as Settled.
              </div>

              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setSelectedRecord(null)} 
                  className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSettlePayment}
                  disabled={isProcessing}
                  className="px-8 py-2.5 bg-[#0A4D28] hover:bg-[#07381d] text-white font-bold rounded-lg transition-colors shadow-sm text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />} Settle Transfer
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}