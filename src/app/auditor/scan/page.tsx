"use client";

import { useState, type ChangeEvent } from "react";
import { 
  ScanLine, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Loader2,
  Crosshair
} from "lucide-react";
import { verifyAndSubmitAudit } from "@/actions/auditor";

export default function AuditorScanner() {
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState("");
  const [hoardingId, setHoardingId] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; status: string; reason?: string } | null>(null);

  const simulateQRScan = () => {
    setQrCode("HD-1092"); 
    setHoardingId("1"); 
    setStep(2);
  };

  const handlePhotoCapture = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      fetchLocation();
    }
  };

  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setStep(3);
        },
        (error) => {
          alert("GPS Access required to verify location.");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSubmit = async () => {
    if (!photo || !location || !qrCode) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("hoardingId", hoardingId);
    formData.append("qrCode", qrCode);
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());
    formData.append("photoFile", photo);
    formData.append("lastModified", photo.lastModified.toString());

    const res = await verifyAndSubmitAudit(formData);
    setResult(res as { success: boolean; status: string; reason?: string });
    setIsSubmitting(false);
    setStep(4);
  };

  const resetScanner = () => {
    setStep(1);
    setQrCode("");
    setPhoto(null);
    setLocation(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
        
        <div className="bg-[#243839] text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-20%] opacity-10">
            <ShieldAlert className="w-48 h-48" />
          </div>
          <h1 className="text-xl font-bold relative z-10">Secure Audit Scanner</h1>
          <p className="text-xs text-gray-300 font-medium mt-1 relative z-10">
            Anti-Fraud System Active
          </p>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-center">
          
          {step === 1 && (
            <div className="text-center">
              <div className="w-48 h-48 mx-auto border-4 border-[#0A4D28] rounded-2xl relative mb-6 flex items-center justify-center bg-gray-50">
                <ScanLine className="w-16 h-16 text-[#0A4D28] animate-pulse" />
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#C58B24] rounded-tl-xl -ml-1 -mt-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#C58B24] rounded-tr-xl -mr-1 -mt-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#C58B24] rounded-bl-xl -ml-1 -mb-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#C58B24] rounded-br-xl -mr-1 -mb-1"></div>
              </div>
              <h2 className="text-lg font-bold text-[#243839] mb-2">Scan Hoarding QR</h2>
              <p className="text-sm text-gray-500 font-medium mb-6">Point your camera at the hoardings QR code to initiate the audit.</p>
              <button 
                onClick={simulateQRScan}
                className="w-full bg-[#0A4D28] hover:bg-[#07381d] text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm"
              >
                Launch Camera (Simulate)
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold border border-green-200 mb-8">
                <CheckCircle2 className="w-4 h-4" /> QR Verified: {qrCode}
              </div>
              
              <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center mb-6 overflow-hidden group hover:border-[#0A4D28]">
                <Camera className="w-12 h-12 text-gray-400 group-hover:text-[#0A4D28] transition-colors mb-3" />
                <h3 className="text-sm font-bold text-[#243839]">Capture Live Photo</h3>
                <p className="text-xs text-gray-500 mt-1">Uploads from gallery are strictly monitored</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-[#C58B24]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crosshair className="w-10 h-10 text-[#C58B24] animate-spin-slow" />
              </div>
              <h2 className="text-lg font-bold text-[#243839] mb-2">Verifying Telemetry...</h2>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-left space-y-3 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">GPS Lock</span>
                  <span className="font-bold text-[#0A4D28] flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Secured</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">EXIF Metadata</span>
                  <span className="font-bold text-[#0A4D28]">Extracted</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Hash Verification</span>
                  <span className="font-bold text-[#C58B24]">Pending</span>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#0A4D28] hover:bg-[#07381d] text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Data...</>
                ) : (
                  "Submit to Fraud Engine"
                )}
              </button>
            </div>
          )}

          {step === 4 && result && (
            <div className="text-center">
              {result.status === "Approved" ? (
                <>
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#243839] mb-2">Audit Approved</h2>
                  <p className="text-sm font-medium text-gray-500 mb-8">All security checks passed. The audit has been securely logged.</p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">Automatic Rejection</h2>
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm font-bold mb-8">
                    {result.reason}
                  </div>
                </>
              )}
              
              <button 
                onClick={resetScanner}
                className="w-full bg-gray-100 hover:bg-gray-200 text-[#243839] py-3.5 rounded-xl font-bold transition-colors"
              >
                Start New Audit
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}