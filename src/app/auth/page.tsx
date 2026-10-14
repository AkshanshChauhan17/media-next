"use client";

import { useState, ChangeEvent, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, registerUser } from "@/actions/auth";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const secretKey = searchParams.get("secret");

  const isAdmin = secretKey === "adminlogin1234x";

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: isAdmin ? "ADMIN" : "ADVERTISER",
  });

  const publicRoles = [
    { value: "ADVERTISER", label: "Advertiser Panel" },
    { value: "MEDIA_OWNER", label: "Media Owner Panel" },
    { value: "AUDITOR", label: "Field Auditor / Invigilator" },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRedirect = (role?: string) => {
    if (!role) {
      router.push("/");
      return;
    }

    switch (role) {
      case "MEDIA_OWNER":
        router.push("/media-owner/kyc");
        break;
      case "ADVERTISER":
        router.push("/advertiser/search");
        break;
      case "AUDITOR":
        router.push("/auditor/campaigns");
        break;
      case "ADMIN":
        router.push("/admin/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        const res = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        if (res.success) {
          handleRedirect(res.role);
        } else {
          setErrorMsg(res.error ?? "Invalid credentials. Please try again.");
        }
      } else {
        const res = await registerUser(formData);
        if (res.success) {
          setIsLogin(true);
          setErrorMsg("");
          setFormData({ ...formData, password: "" });
        } else {
          setErrorMsg(res.error ?? "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B111A] flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1E293B 1px, transparent 1px),
            linear-gradient(to bottom, #1E293B 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      <div
        className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
          isAdmin ? "bg-red-600/15" : "bg-[#E5A93D]/10"
        }`}
      />
      <div
        className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
          isAdmin ? "bg-red-900/15" : "bg-indigo-500/10"
        }`}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`max-w-[1080px] w-full bg-[#0F1621] rounded-[36px] shadow-[0_30px_90px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col md:flex-row border ${
          isAdmin ? "border-red-500/40" : "border-[#2A3441]"
        } min-h-[640px] relative z-10`}
      >
        <div
          className={`md:w-5/12 ${
            isAdmin
              ? "bg-gradient-to-br from-[#1F1216] via-[#140D10] to-[#0B111A]"
              : "bg-gradient-to-br from-[#162232] via-[#0F1621] to-[#0B111A]"
          } text-white p-8 sm:p-10 md:p-12 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r ${
            isAdmin ? "border-red-500/20" : "border-[#1E293B]"
          }`}
        >
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div
            className={`absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
              isAdmin ? "bg-red-500/15" : "bg-[#E5A93D]/15"
            }`}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-12">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                  isAdmin
                    ? "bg-red-500 text-white"
                    : "bg-[#E5A93D] text-[#0B111A]"
                }`}
              >
                BM
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs font-black tracking-[0.22em] text-white">
                  BOOKMY
                </span>
                <span
                  className={`text-xs font-black tracking-[0.22em] ${
                    isAdmin ? "text-red-400" : "text-[#E5A93D]"
                  }`}
                >
                  ADSPACE
                </span>
              </div>
            </div>

            {isAdmin ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-500/15 text-red-400 border border-red-500/30 rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-6">
                <ShieldAlert className="w-3.5 h-3.5" /> Restricted Area
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1A222C] text-[#E5A93D] border border-[#2A3441] rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Media Portal
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login-copy" : "register-copy"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black mb-5 leading-[1.1] tracking-tighter text-white">
                  {isAdmin ? (
                    "Admin Security Portal"
                  ) : isLogin ? (
                    <>
                      Welcome <span className="text-[#E5A93D]">Back!</span>
                    </>
                  ) : (
                    <>
                      Join Our <span className="text-[#E5A93D]">Network.</span>
                    </>
                  )}
                </h1>
                <p className="text-gray-400 font-medium text-sm sm:text-base leading-relaxed">
                  {isAdmin
                    ? "Authorized personnel only. Monitor marketplace activity, verify assets, and manage users."
                    : isLogin
                    ? "Access your dashboard to manage campaigns, inventory, and track your performance in real-time."
                    : "Create an account to discover, plan, and book media spaces seamlessly across India."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 mt-10 pt-8 border-t border-white/10">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-bold">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg("");
              }}
              className={`font-black text-sm flex items-center gap-2 transition-colors group ${
                isAdmin
                  ? "text-red-400 hover:text-white"
                  : "text-[#E5A93D] hover:text-white"
              }`}
            >
              {isLogin ? "Create an account" : "Sign in to your account"}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="md:w-7/12 p-8 sm:p-10 md:p-14 flex flex-col justify-center bg-[#0F1621]">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-gray-400 font-medium mt-2 text-sm">
                Enter your credentials to continue to your account.
              </p>
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-400 text-sm font-bold overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence initial={false}>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-1">
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative group">
                        <User
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors ${
                            isAdmin
                              ? "group-focus-within:text-red-400"
                              : "group-focus-within:text-[#E5A93D]"
                          }`}
                        />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full bg-[#1A222C] border border-[#2A3441] text-white placeholder-gray-500 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold focus:outline-none transition-all ${
                            isAdmin
                              ? "focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                              : "focus:border-[#E5A93D] focus:ring-2 focus:ring-[#E5A93D]/20"
                          }`}
                          placeholder="John Doe"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors ${
                      isAdmin
                        ? "group-focus-within:text-red-400"
                        : "group-focus-within:text-[#E5A93D]"
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-[#1A222C] border border-[#2A3441] text-white placeholder-gray-500 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold focus:outline-none transition-all ${
                      isAdmin
                        ? "focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "focus:border-[#E5A93D] focus:ring-2 focus:ring-[#E5A93D]/20"
                    }`}
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors ${
                      isAdmin
                        ? "group-focus-within:text-red-400"
                        : "group-focus-within:text-[#E5A93D]"
                    }`}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full bg-[#1A222C] border border-[#2A3441] text-white placeholder-gray-500 rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold focus:outline-none transition-all ${
                      isAdmin
                        ? "focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "focus:border-[#E5A93D] focus:ring-2 focus:ring-[#E5A93D]/20"
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {!isLogin && !isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-1">
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                        Select Role
                      </label>
                      <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#E5A93D] transition-colors pointer-events-none" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full bg-[#1A222C] border border-[#2A3441] text-white rounded-2xl pl-12 pr-10 py-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E5A93D]/20 focus:border-[#E5A93D] transition-all appearance-none cursor-pointer"
                        >
                          {publicRoles.map((r) => (
                            <option
                              key={r.value}
                              value={r.value}
                              className="bg-[#0F1621] text-white"
                            >
                              {r.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isAdmin && <input type="hidden" name="role" value="ADMIN" />}

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  isAdmin
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)]"
                    : "bg-[#E5A93D] hover:bg-[#F2B950] text-[#0B111A] shadow-[0_10px_30px_rgba(229,169,61,0.25)]"
                } transition-all font-black text-sm uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2 mt-8 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? "Secure Login" : "Register Account"}</span>
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0B111A]">
          <Loader2 className="w-8 h-8 animate-spin text-[#E5A93D]" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}