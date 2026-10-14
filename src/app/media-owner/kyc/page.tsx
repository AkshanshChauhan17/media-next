"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { 
  Building2, 
  CreditCard, 
  FileText, 
  UploadCloud, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertTriangle
} from "lucide-react";
import { submitKYC, getKYCStatus } from "@/actions/mediaOwner";

export default function MediaOwnerKYC() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [files, setFiles] = useState<{
    gst: File | null;
    pan: File | null;
    cheque: File | null;
  }>({
    gst: null,
    pan: null,
    cheque: null
  });

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await getKYCStatus();
      if (res.success && res.status) {
        setKycStatus(res.status);
      }
      setIsLoading(false);
    };
    fetchStatus();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`File ${file.name} exceeds the 5MB limit.`);
        e.target.value = "";
        return;
      }
      
      setErrorMsg("");
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    if (!files.gst || !files.pan || !files.cheque) {
      setErrorMsg("Please upload all mandatory documents.");
      setIsSubmitting(false);
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    formData.append("gstFile", files.gst);
    formData.append("panFile", files.pan);
    formData.append("chequeFile", files.cheque);

    const res = await submitKYC(formData);

    if (res.success) {
      setKycStatus("Pending");
    } else {
      setErrorMsg(res.error || "Failed to submit KYC. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28]" />
      </div>
    );
  }

  // SUCCESS / PENDING SCREEN
  if (kycStatus === "Pending" || kycStatus === "Verified" || kycStatus === "Approved") {
    const isApproved = kycStatus === "Verified";
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[80vh]">
        <div className="bg-white max-w-md w-full rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isApproved ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <CheckCircle2 className={`w-10 h-10 ${isApproved ? 'text-green-600' : 'text-yellow-600'}`} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-bold text-[#243839] mb-2">
            {isApproved ? "KYC Successfully Approved!" : "KYC Under Review"}
          </h2>
          <p className="text-gray-500 font-medium text-sm mb-8 leading-relaxed">
            {isApproved 
              ? "Congratulations! Your business profile has been fully verified. You can now accept bookings and receive payouts on the platform."
              : "Your KYC documents have been successfully submitted. Our admin team will verify your details within 24-48 hours. Please check back later."}
          </p>
          <button 
            onClick={() => window.location.href = '/media-owner/hoardings'}
            className="w-full bg-[#0A4D28] hover:bg-[#07381d] text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
          >
            Return to My Hoardings
          </button>
        </div>
      </div>
    );
  }

  // FORM RENDER (For New Users or "Rejected" Users)
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#243839] flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#0A4D28]" />
            KYC & Verification
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-2">
            Complete your business profile to start accepting bookings and receiving payouts.
          </p>
        </div>


        {/* REJECTION MESSAGE BANNER */}
        {kycStatus === "Rejected" && (
          <div className="mb-8 p-5 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-4 text-red-700 shadow-sm">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg mb-1">Your previous KYC submission was Rejected</h3>
              <p className="text-sm font-medium">Please double-check your details and ensure the uploaded documents are clear and valid before re-submitting the form below.</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-600 text-sm font-medium">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#C58B24]" />
              <h2 className="font-bold text-[#243839]">Business Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#243839] mb-2">Registered Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#243839] mb-2">Business Type</label>
                <select name="businessType" required className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] appearance-none">
                  <option value="">Select Entity Type</option>
                  <option value="Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="LLP">LLP</option>
                  <option value="Private Limited">Private Limited</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#243839] mb-2">Date of Incorporation</label>
                <input
                  type="date"
                  name="incorporationDate"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#243839] mb-2">GSTIN</label>
                <input
                  type="text"
                  name="gstin"
                  required
                  pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#243839] mb-2">Company PAN</label>
                <input
                  type="text"
                  name="pan"
                  required
                  pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28]"
                />
              </div>

              {/* NEW PHONE NUMBER FIELD */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#243839] mb-2">Business Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  pattern="^[0-9]{10}$"
                  placeholder="10-digit mobile number"
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#243839] mb-2">Registered Address</label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28] resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#C58B24]" />
              <h2 className="font-bold text-[#243839]">Bank Details (For Payouts)</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#243839] mb-2">Account Holder Name</label>
                <input
                  type="text"
                  name="accountName"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#243839] mb-2">Account Number</label>
                <input
                  type="password"
                  name="accountNumber"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#243839] mb-2">IFSC Code</label>
                <input
                  type="text"
                  name="ifsc"
                  required
                  pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#243839] mb-2">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 focus:border-[#0A4D28]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C58B24]" />
              <h2 className="font-bold text-[#243839]">Document Uploads</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center transition-colors cursor-pointer group relative ${files.gst ? 'border-[#0A4D28] bg-[#0A4D28]/5' : 'border-gray-200 hover:border-[#0A4D28]/50 hover:bg-[#0A4D28]/5'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${files.gst ? 'bg-[#0A4D28] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#0A4D28]/10 group-hover:text-[#0A4D28]'}`}>
                  {files.gst ? <FileCheck className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                </div>
                <h3 className="text-sm font-bold text-[#243839] mb-1">GST Certificate</h3>
                <p className="text-xs text-gray-500 font-medium">
                  {files.gst ? files.gst.name : "PDF, JPG or PNG (Max 5MB)"}
                </p>
                <input 
                  type="file" 
                  onChange={(e) => handleFileChange(e, 'gst')} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                />
              </div>

              <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center transition-colors cursor-pointer group relative ${files.pan ? 'border-[#0A4D28] bg-[#0A4D28]/5' : 'border-gray-200 hover:border-[#0A4D28]/50 hover:bg-[#0A4D28]/5'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${files.pan ? 'bg-[#0A4D28] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#0A4D28]/10 group-hover:text-[#0A4D28]'}`}>
                  {files.pan ? <FileCheck className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                </div>
                <h3 className="text-sm font-bold text-[#243839] mb-1">Company PAN</h3>
                <p className="text-xs text-gray-500 font-medium">
                  {files.pan ? files.pan.name : "PDF, JPG or PNG (Max 5MB)"}
                </p>
                <input 
                  type="file" 
                  onChange={(e) => handleFileChange(e, 'pan')} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                />
              </div>

              <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center transition-colors cursor-pointer group relative ${files.cheque ? 'border-[#0A4D28] bg-[#0A4D28]/5' : 'border-gray-200 hover:border-[#0A4D28]/50 hover:bg-[#0A4D28]/5'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${files.cheque ? 'bg-[#0A4D28] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#0A4D28]/10 group-hover:text-[#0A4D28]'}`}>
                  {files.cheque ? <FileCheck className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                </div>
                <h3 className="text-sm font-bold text-[#243839] mb-1">Cancelled Cheque</h3>
                <p className="text-xs text-gray-500 font-medium">
                  {files.cheque ? files.cheque.name : "PDF, JPG or PNG (Max 5MB)"}
                </p>
                <input 
                  type="file" 
                  onChange={(e) => handleFileChange(e, 'cheque')} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#C58B24] hover:bg-[#0A4D28] text-white px-8 py-3 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : (
                "Submit KYC for Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}