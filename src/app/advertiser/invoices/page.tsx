"use client";

import { useState, useEffect } from "react";
import { 
  ReceiptText, 
  Download, 
  Search, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Building2,
  Printer,
  X,
  CreditCard
} from "lucide-react";
import { getInvoices } from "@/actions/advertiser";

type Invoice = {
  payment_id: number;
  transaction_id: string;
  payment_date: string;
  amount: string;
  payment_status: string;
  payment_method: string;
  booking_id: number;
  campaign_name: string;
  advertiser_name: string;
  start_date: string;
  end_date: string;
  hoarding_id_string: string;
  location: string;
  size: string;
  city: string;
};

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      const res = await getInvoices();
      if (res.success && res.data) {
        setInvoices(res.data as Invoice[]);
      }
      setIsLoading(false);
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(i => 
    i.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.hoarding_id_string.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839] flex items-center gap-3">
              <ReceiptText className="w-8 h-8 text-[#0A4D28]" />
              Invoices & Billing
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">
              Access your transaction history, download GST invoices, and track payments.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by TXN ID or Campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] text-[#243839] shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Transaction ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Details</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mx-auto mb-3" />
                      <span className="text-sm font-medium text-gray-500">Loading billing history...</span>
                    </td>
                  </tr>
                ) : filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.payment_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-[#C58B24]" />
                          {new Date(inv.payment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {inv.transaction_id}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#243839] text-sm mb-0.5">{inv.campaign_name}</div>
                        <div className="text-xs text-gray-500 font-medium">{inv.hoarding_id_string} - {inv.city}</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="font-bold text-[#0A4D28] text-base">₹{Number(inv.amount).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Incl. 18% GST</div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3 h-3" /> {inv.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        <button 
                          onClick={() => setSelectedInvoice(inv)}
                          className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-[#0A4D28] hover:bg-[#0A4D28]/10 rounded-lg transition-colors border border-transparent hover:border-[#0A4D28]/20"
                          title="View Invoice"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-500 font-medium">
                      <ReceiptText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice Modal suitable for printing */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 print:hidden">
              <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-[#0A4D28]" />
                Tax Invoice
              </h2>
              <div className="flex items-center gap-3">
                <button onClick={handlePrint} className="bg-white border border-gray-200 hover:border-[#0A4D28] hover:text-[#0A4D28] text-gray-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-red-500 p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-8 print:p-0 print:overflow-visible">
              
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-10 border-b border-gray-200 pb-8">
                <div>
                  <div className="flex flex-col leading-none mb-4">
                    <span className="text-[20px] font-black tracking-widest text-[#0A4D28]">BOOKMY</span>
                    <span className="text-[20px] font-black tracking-widest text-[#C58B24]">ADSPACE</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">123 Tech Park, Sector 4</p>
                  <p className="text-sm text-gray-500 font-medium">Bangalore, Karnataka 560001</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">GSTIN: 29ABCDE1234F1Z5</p>
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-black text-gray-200 uppercase tracking-widest mb-2">Invoice</h1>
                  <p className="text-sm font-bold text-[#243839]">INV-{selectedInvoice.transaction_id}</p>
                  <p className="text-sm text-gray-500 font-medium">Date: {new Date(selectedInvoice.payment_date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Billed To & Campaign Info */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Billed To
                  </h3>
                  <p className="font-bold text-[#243839] text-lg">{selectedInvoice.advertiser_name}</p>
                  <p className="text-sm text-gray-500 font-medium mt-1">Campaign: {selectedInvoice.campaign_name}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Campaign Schedule
                  </h3>
                  <p className="text-sm font-bold text-[#243839]">Start: {new Date(selectedInvoice.start_date).toLocaleDateString('en-IN')}</p>
                  <p className="text-sm font-bold text-[#243839] mt-1">End: {new Date(selectedInvoice.end_date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Line Items */}
              <table className="w-full text-left mb-10 border-collapse">
                <thead>
                  <tr className="bg-[#243839] text-white">
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-tl-lg">Description</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">HSN/SAC</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-right rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-b border-gray-100">
                  <tr>
                    <td className="py-4 px-4 align-top">
                      <p className="font-bold text-[#243839] text-sm">Outdoor Advertising Space Booking</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">Site ID: {selectedInvoice.hoarding_id_string}</p>
                      <p className="text-xs text-gray-500 font-medium">{selectedInvoice.location} ({selectedInvoice.size})</p>
                    </td>
                    <td className="py-4 px-4 align-top text-sm font-medium text-gray-600">998361</td>
                    <td className="py-4 px-4 align-top text-right font-bold text-[#243839]">
                      ₹{(Number(selectedInvoice.amount) / 1.18).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-10">
                <div className="w-1/2 space-y-3">
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Taxable Amount</span>
                    <span>₹{(Number(selectedInvoice.amount) / 1.18).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>CGST (9%)</span>
                    <span>₹{((Number(selectedInvoice.amount) / 1.18) * 0.09).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-600 border-b border-gray-200 pb-3">
                    <span>SGST (9%)</span>
                    <span>₹{((Number(selectedInvoice.amount) / 1.18) * 0.09).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-[#243839] text-lg">Grand Total</span>
                    <span className="font-black text-[#C58B24] text-xl">₹{Number(selectedInvoice.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-6 flex justify-between items-center text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0A4D28]" />
                  Paid via {selectedInvoice.payment_method}
                </div>
                <p>Thank you for choosing BookMyAdSpace.</p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}