import { 
  Map, 
  Wallet, 
  TrendingUp, 
  AlertOctagon,
  CheckCircle,
  XCircle,
  CalendarClock
} from "lucide-react";
import Link from "next/link";

export default function MediaOwnerDashboard() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Media Owner Overview</h1>
            <p className="text-gray-500 font-medium text-sm mt-1">Track your inventory, bookings, and payments.</p>
          </div>
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-100 font-bold text-sm">
            <AlertOctagon className="w-4 h-4" />
            2 Action Required
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium text-sm">Total Hoardings</h3>
              <div className="w-10 h-10 rounded-lg bg-[#0A4D28]/10 flex items-center justify-center">
                <Map className="w-5 h-5 text-[#0A4D28]" strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#243839]">142</p>
              <div className="flex items-center gap-4 mt-2 text-sm font-medium">
                <span className="text-gray-600"><span className="text-[#0A4D28] font-bold">120</span> Occupied</span>
                <span className="text-gray-600"><span className="text-[#C58B24] font-bold">22</span> Vacant</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium text-sm">Occupancy Rate</h3>
              <div className="w-10 h-10 rounded-lg bg-[#C58B24]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#C58B24]" strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#243839]">84.5%</p>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#C58B24] h-full rounded-full" style={{ width: '84.5%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-medium text-sm">Payment Tracking (This Month)</h3>
              <div className="w-10 h-10 rounded-lg bg-[#243839]/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#243839]" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Expected Collection</p>
                <p className="text-3xl font-bold text-[#0A4D28]">₹8.4L</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Booked</p>
                  <p className="text-lg font-bold text-[#243839]">₹6.2L</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Pending</p>
                  <p className="text-lg font-bold text-[#C58B24]">₹2.2L</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#243839]">Pending Bookings</h2>
                <Link href="/media-owner/bookings" className="text-[#C58B24] text-sm font-bold hover:text-[#0A4D28]">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 text-xs font-bold text-gray-500 uppercase">Hoarding ID & Location</th>
                      <th className="pb-3 text-xs font-bold text-gray-500 uppercase">Client</th>
                      <th className="pb-3 text-xs font-bold text-gray-500 uppercase">Duration</th>
                      <th className="pb-3 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="py-4">
                        <p className="font-bold text-[#243839] text-sm">HD-4091</p>
                        <p className="text-xs text-gray-500 font-medium">MG Road, Bangalore</p>
                      </td>
                      <td className="py-4 text-sm font-semibold text-[#243839]">Reliance Digital</td>
                      <td className="py-4 text-sm font-medium text-gray-600">30 Days</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 bg-[#0A4D28]/10 text-[#0A4D28] rounded hover:bg-[#0A4D28] hover:text-white transition-colors">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4">
                        <p className="font-bold text-[#243839] text-sm">HD-2218</p>
                        <p className="text-xs text-gray-500 font-medium">Cyber Hub, Gurgaon</p>
                      </td>
                      <td className="py-4 text-sm font-semibold text-[#243839]">Samsung India</td>
                      <td className="py-4 text-sm font-medium text-gray-600">45 Days</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 bg-[#0A4D28]/10 text-[#0A4D28] rounded hover:bg-[#0A4D28] hover:text-white transition-colors">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#243839]">Calendar Alerts</h2>
                <CalendarClock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="bg-[#C58B24]/10 border border-[#C58B24]/20 rounded-lg p-4 flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-[#C58B24] mt-2"></div>
                <div>
                  <h4 className="font-bold text-[#243839] text-sm mb-1">Campaigns Ending Soon</h4>
                  <p className="text-sm text-gray-600 font-medium">You have <span className="font-bold text-[#C58B24]">3 hoardings</span> vacating in the next 7 days. Update availability or accept pending bids.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#243839] mb-4">Health & Fraud Alerts</h2>
              
              <div className="space-y-4">
                <div className="p-3 border border-red-100 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Critical</span>
                    <span className="text-xs text-red-500 font-medium">HD-1092</span>
                  </div>
                  <p className="text-sm font-bold text-[#243839]">Torn Flex Detected</p>
                  <p className="text-xs text-gray-600 mt-1">Auditor reported severe damage. Immediate fix required.</p>
                </div>

                <div className="p-3 border border-orange-100 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Medium</span>
                    <span className="text-xs text-orange-500 font-medium">HD-3341</span>
                  </div>
                  <p className="text-sm font-bold text-[#243839]">Lights Malfunction</p>
                  <p className="text-xs text-gray-600 mt-1">Lights not checked for 45 days. Schedule maintenance.</p>
                </div>

                <div className="p-3 border border-[#243839]/10 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#243839] uppercase tracking-wider">Fraud Alert</span>
                    <span className="text-xs text-gray-500 font-medium">Auto-Rejected</span>
                  </div>
                  <p className="text-sm font-bold text-[#243839]">Fake GPS / Old Photo</p>
                  <p className="text-xs text-gray-600 mt-1">Invigilator upload blocked due to duplicate metadata.</p>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 bg-gray-50 text-[#243839] text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                View All Reports
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}