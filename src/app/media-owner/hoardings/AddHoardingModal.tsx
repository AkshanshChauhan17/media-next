"use client";

import { useState, type FormEvent } from "react";
import { MapPin, X, Loader2 } from "lucide-react";
import { addHoarding } from "@/actions/mediaOwner";

export default function AddHoardingModal({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void, 
  onSuccess: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await addHoarding(formData);
    
    if (res.success) {
      onSuccess();
    } else {
      alert(res.error || "Failed to add hoarding");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0A4D28]" />
            Add New Hoarding
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="addHoardingForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#243839] mb-1.5">Hoarding ID</label>
                <input type="text" name="hoardingId" required placeholder="e.g. HD-1001" className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#243839] mb-1.5">Size (ft)</label>
                <input type="text" name="size" required placeholder="e.g. 40ft x 20ft" className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#243839] mb-1.5">Full Location Address</label>
                <input type="text" name="location" required placeholder="Street, Landmark, City" className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30" />
              </div>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-[#243839] font-bold hover:bg-gray-200 transition-colors text-sm">Cancel</button>
          <button type="submit" form="addHoardingForm" disabled={isSubmitting} className="bg-[#0A4D28] hover:bg-[#07381d] text-white px-8 py-2.5 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Hoarding"}
          </button>
        </div>
      </div>
    </div>
  );
}