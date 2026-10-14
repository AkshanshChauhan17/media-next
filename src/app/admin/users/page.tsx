"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  FileText,
  ShieldCheck,
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  Landmark,
  Briefcase
} from "lucide-react";
import { getAllUsers, updateKycStatus } from "@/actions/admin";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  kyc_status: "Pending" | "Approved" | "Rejected";
  created_at: string;
  
  // New KYC Fields from media_owner_kyc table
  business_name?: string;
  business_type?: string;
  incorporation_date?: string;
  gstin?: string;
  pan?: string;
  address?: string;
  account_name?: string;
  account_number?: string;
  ifsc?: string;
  bank_name?: string;
  gst_file_url?: string;
  pan_file_url?: string;
  cheque_file_url?: string;
};

export default function UsersAndKYC() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQ, setSearchQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [kycFilter, setKycFilter] = useState("Pending"); // Default to Pending for quick action

  // Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    const res = await getAllUsers({ role: roleFilter, kycStatus: kycFilter, q: searchQ });
    if (res.success && res.data) {
      setUsers(res.data as User[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [roleFilter, kycFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleKycAction = async (status: 'Approved' | 'Rejected') => {
    if (!selectedUser) return;
    setIsProcessing(true);
    
    const res = await updateKycStatus(selectedUser.id, status);
    
    if (res.success) {
      setSelectedUser(null);
      await fetchUsers(); // Refresh list
    } else {
      alert("Failed to update KYC status");
    }
    setIsProcessing(false);
  };

  const getKycBadge = (status: string) => {
    switch(status) {
      case "Approved": return <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case "Rejected": return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><XCircle className="w-3 h-3" /> Rejected</span>;
      default: return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] flex items-center gap-3">
              <Users className="w-8 h-8 text-[#C58B24]" />
              Users & KYC Management
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-2">
              Verify identity documents, approve onboarding, and manage platform roles.
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, or phone..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 focus:border-[#111827] text-[#111827]"
            />
          </form>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-[#111827] appearance-none"
              >
                <option value="All">All Roles</option>
                <option value="MEDIA_OWNER">Media Owner</option>
                <option value="ADVERTISER">Advertiser</option>
                <option value="AUDITOR">Field Auditor</option>
              </select>
            </div>

            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-[#111827] font-bold"
            >
              <option value="All">All KYC Status</option>
              <option value="Pending">Pending KYC</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Role & Location</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">KYC Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#111827] mx-auto mb-3" />
                      <span className="text-sm font-medium text-gray-500">Fetching user database...</span>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#111827]/5 flex items-center justify-center text-[#111827] font-black">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#111827] text-sm">{user.name}</div>
                            <div className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-400 font-mono mt-0.5">
                              {user.phone || "No Phone"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-200 uppercase tracking-wider mb-1">
                          {user.role.replace('_', ' ')}
                        </span>
                        <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {user.city || "N/A"}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top">
                        {getKycBadge(user.kyc_status)}
                      </td>
                      <td className="py-4 px-6 align-top">
                        <div className="text-sm font-medium text-[#111827]">
                          {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6 align-top text-right">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="bg-white border border-gray-200 hover:border-[#111827] text-[#111827] px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                        >
                          Review KYC
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-500 font-medium">
                      <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      No users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* KYC Review Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-bold text-[#111827] text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C58B24]" />
                Review User KYC
              </h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Basic User Info */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Users className="w-4 h-4" /> User Info</h3>
                  <p className="font-bold text-[#111827] text-lg mb-2">{selectedUser.name}</p>
                  <p className="font-black text-[#C58B24] text-xs uppercase mb-4 tracking-wider">{selectedUser.role.replace('_', ' ')}</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" /> {selectedUser.email}</p>
                    <p className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400" /> {selectedUser.phone || 'N/A'}</p>
                    <p className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400" /> {selectedUser.city || 'N/A'}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">KYC Status</h3>
                    <div>{getKycBadge(selectedUser.kyc_status)}</div>
                  </div>
                </div>

                {/* 2. Business Details (If Media Owner) */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Building2 className="w-4 h-4" /> Business Details</h3>
                  {selectedUser.business_name ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="block text-xs font-bold text-gray-500">Business Name</span>
                        <span className="font-bold text-[#111827]">{selectedUser.business_name}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-gray-500">Type</span>
                        <span className="font-medium text-gray-700">{selectedUser.business_type}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-gray-500">GSTIN</span>
                        <span className="font-mono text-[#111827]">{selectedUser.gstin || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-gray-500">PAN</span>
                        <span className="font-mono text-[#111827]">{selectedUser.pan || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-gray-500">Address</span>
                        <span className="font-medium text-gray-700">{selectedUser.address || 'N/A'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No business details provided (Not a Media Owner).</p>
                  )}
                </div>

                {/* 3. Bank Details (If Media Owner) */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Landmark className="w-4 h-4" /> Bank Information</h3>
                  {selectedUser.account_number ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="block text-xs font-bold text-gray-500">Bank Name</span>
                        <span className="font-bold text-[#111827]">{selectedUser.bank_name}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-gray-500">Account Name</span>
                        <span className="font-medium text-gray-700">{selectedUser.account_name}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-gray-500">Account Number</span>
                        <span className="font-mono text-[#111827] font-bold">{selectedUser.account_number}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-gray-500">IFSC Code</span>
                        <span className="font-mono text-[#111827]">{selectedUser.ifsc}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No bank details provided.</p>
                  )}
                </div>

              </div>

              {/* Uploaded Documents Grid */}
              {selectedUser.role === 'MEDIA_OWNER' && (
                <div>
                  <h3 className="font-bold text-[#111827] text-base mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Briefcase className="w-5 h-5 text-gray-500" /> Uploaded KYC Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* GST File */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">GST Certificate</div>
                      <div className="h-40 flex items-center justify-center p-2">
                        {selectedUser.gst_file_url ? (
                          <a href={selectedUser.gst_file_url} target="_blank" rel="noreferrer" className="block w-full h-full">
                            <img src={selectedUser.gst_file_url} alt="GST" className="w-full h-full object-contain hover:scale-105 transition-transform" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No File</span>
                        )}
                      </div>
                    </div>

                    {/* PAN File */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">PAN Card</div>
                      <div className="h-40 flex items-center justify-center p-2">
                        {selectedUser.pan_file_url ? (
                          <a href={selectedUser.pan_file_url} target="_blank" rel="noreferrer" className="block w-full h-full">
                            <img src={selectedUser.pan_file_url} alt="PAN" className="w-full h-full object-contain hover:scale-105 transition-transform" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No File</span>
                        )}
                      </div>
                    </div>

                    {/* Cheque File */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">Cancelled Cheque</div>
                      <div className="h-40 flex items-center justify-center p-2">
                        {selectedUser.cheque_file_url ? (
                          <a href={selectedUser.cheque_file_url} target="_blank" rel="noreferrer" className="block w-full h-full">
                            <img src={selectedUser.cheque_file_url} alt="Cheque" className="w-full h-full object-contain hover:scale-105 transition-transform" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No File</span>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              {selectedUser.kyc_status !== "Rejected" && (
                <button 
                  onClick={() => handleKycAction('Rejected')}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors border border-red-200 text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Reject KYC
                </button>
              )}
              
              {selectedUser.kyc_status !== "Approved" && (
                <button 
                  onClick={() => handleKycAction('Approved')}
                  disabled={isProcessing}
                  className="px-8 py-2.5 bg-[#0A4D28] hover:bg-[#07381d] text-white font-bold rounded-lg transition-colors shadow-sm text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve User
                </button>
              )}
              
              {selectedUser.kyc_status === "Approved" && (
                 <button onClick={() => setSelectedUser(null)} className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors text-sm">
                   Close Window
                 </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}