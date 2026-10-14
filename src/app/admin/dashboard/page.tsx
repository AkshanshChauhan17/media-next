"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  IndianRupee, 
  ShieldCheck, 
  AlertCircle,
  Loader2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getPendingUsers } from "@/actions/admin";

interface DashboardStats {
  totalRevenue: number;
  platformEarnings: number;
  activeCampaigns: number;
  totalUsers: number;
  pendingKYC: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        getDashboardStats(),
        getPendingUsers()
      ]);
      
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (usersRes.success && usersRes.data) setPendingUsers(usersRes.data as User[]);
      
      setIsLoading(false);
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-[#0A4D28]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">Master Dashboard</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Platform overview, revenue analytics, and quick actions.</p>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-500">Gross Processing Volume</h3>
            </div>
            <p className="text-3xl font-black text-[#111827] mt-2">
              ₹{Number(stats?.totalRevenue || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C58B24]/10 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="w-10 h-10 bg-[#C58B24]/20 text-[#C58B24] rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-500">Platform Earnings (10%)</h3>
            </div>
            <p className="text-3xl font-black text-[#111827] mt-2">
              ₹{Number(stats?.platformEarnings || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-500">Active Campaigns</h3>
            </div>
            <p className="text-3xl font-black text-[#111827] mt-2">
              {stats?.activeCampaigns || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-500">Total Users</h3>
            </div>
            <p className="text-3xl font-black text-[#111827] mt-2 flex items-baseline gap-2">
              {stats?.totalUsers || 0} 
              {stats && stats.pendingKYC > 0 && (
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  {stats.pendingKYC} Pending KYC
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Action Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-[#111827] text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" /> Action Required: KYC Approvals
              </h2>
              <Link href="/admin/users" className="text-sm font-bold text-[#0A4D28] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-0 flex-1">
              {pendingUsers.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {pendingUsers.map(user => (
                    <li key={user.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#111827] text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded border border-yellow-200 uppercase tracking-wider mb-1">
                          {user.role.replace('_', ' ')}
                        </span>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
                  <ShieldCheck className="w-12 h-12 text-gray-200 mb-2" />
                  <p className="font-bold">All caught up!</p>
                  <p className="text-xs">No pending KYC approvals.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-[#111827] text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#C58B24]" /> Recent System Alerts
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500 flex-1">
               <AlertCircle className="w-12 h-12 text-gray-200 mb-2" />
               <p className="font-bold">System Status: Healthy</p>
               <p className="text-xs mt-1">No major fraud flags or critical support tickets detected today.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Icon component needed for Dashboard
function Wallet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
  );
}