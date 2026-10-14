"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, User, Phone, Briefcase, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuditorsList, registerFieldExecutive, loginFieldExecutive } from "@/actions/fieldExecutive";

type Auditor = {
  id: number;
  name: string;
  city: string;
};

export default function FieldExecutiveAuth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [auditors, setAuditors] = useState<Auditor[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    auditor_id: ""
  });

  useEffect(() => {
    const fetchAuditors = async () => {
      const res = await getAuditorsList();
      if (res.success) {
        setAuditors(res.data);
      }
    };
    fetchAuditors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (isLogin) {
        const res = await loginFieldExecutive(formData.email, formData.password);
        if (res.success) {
          setMessage({ text: res.message, type: "success" });
          window.location.href = "/field-executive/dashboard";
        } else {
          setMessage({ text: res.message, type: "error" });
        }
      } else {
        const res = await registerFieldExecutive({
          ...formData,
          auditor_id: Number(formData.auditor_id),
        });
        if (res.success) {
          setMessage({ text: res.message, type: "success" });
          setFormData({ name: "", email: "", phone: "", password: "", auditor_id: "" });
          setTimeout(() => setIsLogin(true), 2000);
        } else {
          setMessage({ text: res.message, type: "error" });
        }
      }
    } catch (error) {
      setMessage({ text: "An unexpected error occurred.", type: "error" });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        
        <div className="bg-[#243839] p-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C58B24]/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#0A4D28]/40 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <ShieldCheck className="w-8 h-8 text-[#C58B24]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">Ground Ops Portal</h1>
            <p className="text-gray-300 text-sm mt-1">Field Executive Access</p>
          </div>
        </div>

        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => { setIsLogin(true); setMessage({ text: "", type: "" }); }}
            className={`flex-1 py-4 text-sm font-black transition-colors border-b-2 ${isLogin ? 'border-[#C58B24] text-[#243839]' : 'border-transparent text-gray-400 hover:bg-gray-50'}`}
          >
            LOGIN
          </button>
          <button 
            onClick={() => { setIsLogin(false); setMessage({ text: "", type: "" }); }}
            className={`flex-1 py-4 text-sm font-black transition-colors border-b-2 ${!isLogin ? 'border-[#C58B24] text-[#243839]' : 'border-transparent text-gray-400 hover:bg-gray-50'}`}
          >
            REGISTER
          </button>
        </div>

        <div className="p-8">
          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {message.type === 'error' ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C58B24] focus:ring-2 focus:ring-[#C58B24]/20 transition-all font-bold text-[#243839] text-sm outline-none"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="Mobile Number" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C58B24] focus:ring-2 focus:ring-[#C58B24]/20 transition-all font-bold text-[#243839] text-sm outline-none"
                  />
                </div>

                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select 
                    name="auditor_id"
                    required
                    value={formData.auditor_id}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C58B24] focus:ring-2 focus:ring-[#C58B24]/20 transition-all font-bold text-[#243839] text-sm outline-none appearance-none"
                  >
                    <option value="" disabled>Select Your Auditor / Manager</option>
                    {auditors.map(auditor => (
                      <option key={auditor.id} value={auditor.id}>
                        {auditor.name} ({auditor.city || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                name="email"
                required
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C58B24] focus:ring-2 focus:ring-[#C58B24]/20 transition-all font-bold text-[#243839] text-sm outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                name="password"
                required
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C58B24] focus:ring-2 focus:ring-[#C58B24]/20 transition-all font-bold text-[#243839] text-sm outline-none"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link href="#" className="text-xs font-bold text-[#C58B24] hover:underline">Forgot Password?</Link>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#243839] hover:bg-[#1a292a] text-white py-4 rounded-xl font-black transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#243839]/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#C58B24]" />
              ) : (
                <>
                  {isLogin ? 'Secure Login' : 'Submit Registration'} <ArrowRight className="w-5 h-5 text-[#C58B24]" />
                </>
              )}
            </button>

          </form>
        </div>
      </div>

      <div className="mt-8 text-center text-xs font-bold text-gray-400">
        <p>This portal is restricted to authorized field executives only.</p>
        <p>All location and activity data is logged securely.</p>
      </div>
    </div>
  );
}