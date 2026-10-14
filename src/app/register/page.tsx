"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  TrendingUp, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { registerAd } from "@/actions/auth";

function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/advertiser/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("Advertiser");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("role", selectedRole);
    
    const res = await registerAd(formData);

    if (res.success) {
      router.push(redirectUrl);
    } else {
      setError(res.error || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-[#243839] mb-2">Create an Account</h2>
        <p className="text-gray-500 font-medium">Join the premium outdoor advertising network.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole("Advertiser")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              selectedRole === "Advertiser" 
                ? "border-[#C58B24] bg-[#C58B24]/5" 
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className={`w-4 h-4 rounded-full mb-3 ${selectedRole === "Advertiser" ? "bg-[#C58B24]" : "bg-gray-200"}`} />
            <h4 className={`font-black ${selectedRole === "Advertiser" ? "text-[#C58B24]" : "text-gray-400"}`}>Brand / Agency</h4>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Book Spaces</p>
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedRole("Media Owner")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              selectedRole === "Media Owner" 
                ? "border-[#243839] bg-[#243839]/5" 
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className={`w-4 h-4 rounded-full mb-3 ${selectedRole === "Media Owner" ? "bg-[#243839]" : "bg-gray-200"}`} />
            <h4 className={`font-black ${selectedRole === "Media Owner" ? "text-[#243839]" : "text-gray-400"}`}>Media Owner</h4>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">List Spaces</p>
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              name="name"
              required
              placeholder="Full Name / Company Name" 
              className="w-full bg-gray-50 border border-gray-200 text-[#243839] font-bold rounded-xl px-12 py-4 focus:outline-none focus:border-[#C58B24] focus:ring-1 focus:ring-[#C58B24] transition-all"
            />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              name="email"
              required
              placeholder="Email Address" 
              className="w-full bg-gray-50 border border-gray-200 text-[#243839] font-bold rounded-xl px-12 py-4 focus:outline-none focus:border-[#C58B24] focus:ring-1 focus:ring-[#C58B24] transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              name="password"
              required
              placeholder="Create Password" 
              className="w-full bg-gray-50 border border-gray-200 text-[#243839] font-bold rounded-xl px-12 py-4 focus:outline-none focus:border-[#C58B24] focus:ring-1 focus:ring-[#C58B24] transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#243839] hover:bg-black text-white py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:transform-none"
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
          ) : (
            <>Create Account <ArrowRight className="w-5 h-5" /></>
          )}
        </button>

        <p className="text-center text-sm font-bold text-gray-400 mt-6">
          Already have an account? <Link href={`/login?redirect=${redirectUrl}`} className="text-[#C58B24] hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex w-1/2 bg-[#243839] p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-[#C58B24] p-2 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-wide">AD SPACE</span>
          </div>
          
          <h1 className="text-5xl font-black text-white leading-tight mb-8">
            The Future of <br/><span className="text-[#C58B24]">Outdoor Advertising.</span>
          </h1>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <MapPin className="w-6 h-6 text-[#C58B24]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Premium Locations</h4>
                <p className="text-gray-400 font-medium text-sm">Access top-tier hoardings across major cities.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-6 h-6 text-[#C58B24]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">GPS Verified Audits</h4>
                <p className="text-gray-400 font-medium text-sm">Independent field verification for every campaign.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <ShieldCheck className="w-6 h-6 text-[#C58B24]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Secure Escrow Payments</h4>
                <p className="text-gray-400 font-medium text-sm">100% financial security for both brands and owners.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C58B24] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <Suspense fallback={<div className="flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#C58B24]" /></div>}>
          <RegistrationForm />
        </Suspense>
      </div>
    </div>
  );
}