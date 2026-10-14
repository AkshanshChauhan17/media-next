"use client";

import { useState, useEffect, type FormEvent } from "react";
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  ArrowUpRight, 
  Filter, 
  PlusCircle, 
  Search, 
  Calendar,
  Sparkles,
  Loader2,
  X
} from "lucide-react";
import { getPaymentAnalytics, recordPaymentEntry } from "@/actions/mediaOwner";

type PaymentRecord = {
  id: number;
  booking_id: number;
  advertiser_name: string;
  campaign_name: string;
  hoarding_id_string: string;
  location: string;
  amount: string | number;
  paid_amount: string | number;
  due_date: string;
  payment_date?: string | null;
  status: "Pending" | "Partially Paid" | "Paid" | "Overdue";
  payment_method?: string | null;
  transaction_id?: string | null;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [metrics, setMetrics] = useState({
    bookedThisMonth: 0,
    collectedThisMonth: 0,
    pendingThisMonth: 0,
    expectedNextMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayments = async () => {
    setIsLoading(true);
    const res = await getPaymentAnalytics();
    if (res.success && res.data) {
      setPayments(res.data.payments as PaymentRecord[]);
      setMetrics(res.data.metrics);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const loadPayments = async () => {
      await fetchPayments();
    };
    loadPayments();
  }, []);

  const handleRecordPayment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const amountPaid = parseFloat(formData.get("amountPaid") as string);
    const paymentMethod = formData.get("paymentMethod") as string;
    const transactionId = formData.get("transactionId") as string;

    const res = await recordPaymentEntry(selectedPayment.id, amountPaid, paymentMethod, transactionId);
    if (res.success) {
      setIsModalOpen(false);
      setSelectedPayment(null);
      await fetchPayments();
    } else {
      alert(res.error || "Failed to record payment");
    }
    setIsSubmitting(false);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = 
      p.advertiser_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hoarding_id_string.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-[#0A4D28]/10 text-[#0A4D28] border-[#0A4D28]/20";
      case "Partially Paid":
        return "bg-[#C58B24]/10 text-[#C58B24] border-[#C58B24]/20";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Overdue":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Payment Tracking & Prediction</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Track collected revenues, manage pending dues, and forecast next months earnings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Booked This Month</span>
              <div className="w-9 h-9 rounded-lg bg-[#243839]/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#243839]" />
              </div>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-[#243839]">
                ₹{(metrics.bookedThisMonth / 100000).toFixed(2)} Lakh
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Full contract value of active campaigns
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Collected</span>
              <div className="w-9 h-9 rounded-lg bg-[#0A4D28]/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#0A4D28]" />
              </div>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-[#0A4D28]">
                ₹{(metrics.collectedThisMonth / 100000).toFixed(2)} Lakh
              </p>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-[#0A4D28] h-full rounded-full" 
                  style={{ width: `${metrics.bookedThisMonth > 0 ? (metrics.collectedThisMonth / metrics.bookedThisMonth) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Collection</span>
              <div className="w-9 h-9 rounded-lg bg-[#C58B24]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C58B24]" />
              </div>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-[#C58B24]">
                ₹{(metrics.pendingThisMonth / 100000).toFixed(2)} Lakh
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Awaiting client clearance / milestone
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0A4D28] to-[#07381d] text-white rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-15%] right-[-15%] opacity-10">
              <Sparkles className="w-32 h-32 text-[#C58B24]" />
            </div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-xs font-bold text-[#C58B24] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Next Month Prediction
              </span>
              <TrendingUp className="w-5 h-5 text-[#C58B24]" />
            </div>
            <div className="relative z-10">
              <p className="text-2xl md:text-3xl font-bold text-white">
                ₹{(metrics.expectedNextMonth / 100000).toFixed(2)} Lakh
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-[#C58B24] font-bold mt-1 bg-white/10 px-2 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5" /> Based on renewal & pipeline
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-[#0A4D28]" />
              Payment Invoices & Receivables
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search client, campaign or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839]"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-40 pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839] appearance-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[350px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Client & Campaign</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Hoarding Location</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Total / Paid</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-[#0A4D28]">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="font-medium text-sm">Loading payment records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.length > 0 ? (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm">{p.advertiser_name}</div>
                        <div className="text-xs text-[#C58B24] font-semibold mt-0.5">{p.campaign_name}</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm">{p.hoarding_id_string}</div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">{p.location}</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm">₹{Number(p.amount).toLocaleString('en-IN')}</div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">
                          Paid: <span className="text-[#0A4D28] font-bold">₹{Number(p.paid_amount).toLocaleString('en-IN')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="text-sm font-semibold text-[#243839]">
                          {new Date(p.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        {p.status !== "Paid" ? (
                          <button
                            onClick={() => {
                              setSelectedPayment(p);
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A4D28] hover:bg-[#07381d] text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> Record Payment
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                      No payment records found. Accepted bookings with generated invoices will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#243839] text-base flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#0A4D28]" />
                Record Incoming Payment
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPayment(null);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-600">
                <p><strong>Client:</strong> {selectedPayment.advertiser_name}</p>
                <p className="mt-1">
                  <strong>Remaining Due:</strong> ₹{(Number(selectedPayment.amount) - Number(selectedPayment.paid_amount)).toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243839] mb-1">Amount Received (₹)</label>
                <input
                  type="number"
                  name="amountPaid"
                  required
                  max={Number(selectedPayment.amount) - Number(selectedPayment.paid_amount)}
                  defaultValue={Number(selectedPayment.amount) - Number(selectedPayment.paid_amount)}
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243839] mb-1">Payment Method</label>
                <select
                  name="paymentMethod"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 appearance-none"
                >
                  <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card / Payment Gateway">Credit Card / Payment Gateway</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243839] mb-1">Transaction / Reference ID</label>
                <input
                  type="text"
                  name="transactionId"
                  required
                  placeholder="e.g. UTR12345678"
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedPayment(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0A4D28] hover:bg-[#07381d] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}