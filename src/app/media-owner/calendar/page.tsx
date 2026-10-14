"use client";

import { useState, useEffect } from "react";
import { 
  CalendarDays, 
  BellRing, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ArrowRight,
  Loader2,
  CalendarCheck
} from "lucide-react";
import { getUpcomingVacancies } from "@/actions/mediaOwner";
import Link from "next/link";

type Vacancy = {
  booking_id: number;
  advertiser_name: string;
  campaign_name: string;
  start_date: string;
  end_date: string;
  hoarding_id_string: string;
  location: string;
  size: string;
  hoarding_id: number;
};

export default function CalendarAlerts() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVacancies = async () => {
      const res = await getUpcomingVacancies();
      if (res.success && Array.isArray(res.data)) {
        setVacancies(res.data as Vacancy[]);
      }
      setIsLoading(false);
    };
    fetchVacancies();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calculateDaysLeft = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateProgress = (startDateString: string, endDateString: string) => {
    const start = new Date(startDateString).getTime();
    const end = new Date(endDateString).getTime();
    const current = today.getTime();
    
    if (current <= start) return 0;
    if (current >= end) return 100;
    
    return ((current - start) / (end - start)) * 100;
  };

  const within7Days = vacancies.filter(v => calculateDaysLeft(v.end_date) <= 7 && calculateDaysLeft(v.end_date) >= 0);
  const within15Days = vacancies.filter(v => calculateDaysLeft(v.end_date) > 7 && calculateDaysLeft(v.end_date) <= 15);
  const others = vacancies.filter(v => calculateDaysLeft(v.end_date) > 15);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Calendar & Alerts</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Track active campaigns and get notified before hoardings become vacant.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-gray-100">
            <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mb-4" />
            <p className="text-gray-500 font-medium">Loading calendar data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
                <div className="absolute right-[-10%] top-[-20%] opacity-10">
                  <BellRing className="w-40 h-40 text-red-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                    <AlertTriangle className="w-5 h-5" /> Critical Alerts (7 Days)
                  </div>
                  <h2 className="text-4xl font-bold text-[#243839] mb-2">{within7Days.length}</h2>
                  <p className="text-sm font-medium text-red-800">Hoardings vacating within the next 7 days. Action required to prevent revenue loss.</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
                <div className="absolute right-[-10%] top-[-20%] opacity-10">
                  <Clock className="w-40 h-40 text-yellow-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-yellow-600 font-bold mb-2">
                    <CalendarDays className="w-5 h-5" /> Upcoming (15 Days)
                  </div>
                  <h2 className="text-4xl font-bold text-[#243839] mb-2">{within15Days.length}</h2>
                  <p className="text-sm font-medium text-yellow-800">Hoardings vacating between 8 to 15 days from today.</p>
                </div>
              </div>

              <div className="bg-[#0A4D28]/10 border border-[#0A4D28]/20 rounded-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
                <div className="absolute right-[-10%] top-[-20%] opacity-10">
                  <CalendarCheck className="w-40 h-40 text-[#0A4D28]" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#0A4D28] font-bold mb-2">
                    <CalendarCheck className="w-5 h-5" /> Total Active
                  </div>
                  <h2 className="text-4xl font-bold text-[#243839] mb-2">{vacancies.length}</h2>
                  <p className="text-sm font-medium text-[#0A4D28]">Ongoing campaigns currently utilizing your inventory.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="font-bold text-[#243839] text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#C58B24]" />
                  Campaign End Timeline
                </h2>
              </div>

              <div className="p-6">
                {vacancies.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No active campaigns to track at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {vacancies.map((vacancy) => {
                      const daysLeft = calculateDaysLeft(vacancy.end_date);
                      const progress = calculateProgress(vacancy.start_date, vacancy.end_date);
                      
                      let statusColor = "text-[#0A4D28]";
                      let statusBg = "bg-[#0A4D28]";
                      let badgeBg = "bg-[#0A4D28]/10 border-[#0A4D28]/20 text-[#0A4D28]";

                      if (daysLeft <= 7) {
                        statusColor = "text-red-600";
                        statusBg = "bg-red-500";
                        badgeBg = "bg-red-50 border-red-200 text-red-600";
                      } else if (daysLeft <= 15) {
                        statusColor = "text-yellow-600";
                        statusBg = "bg-yellow-500";
                        badgeBg = "bg-yellow-50 border-yellow-200 text-yellow-600";
                      }

                      return (
                        <div key={vacancy.booking_id} className="border border-gray-100 rounded-lg p-5 hover:border-[#C58B24]/30 hover:shadow-sm transition-all group">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div className="flex items-start gap-4">
                              <div className={`px-3 py-1.5 rounded-md border text-xs font-bold whitespace-nowrap text-center flex flex-col ${badgeBg}`}>
                                <span className="text-lg leading-none mb-0.5">{daysLeft}</span>
                                <span>Days Left</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-[#243839] text-lg leading-tight mb-1">{vacancy.advertiser_name}</h3>
                                <p className="text-sm font-medium text-[#C58B24]">{vacancy.campaign_name}</p>
                              </div>
                            </div>

                            <div className="text-left md:text-right">
                              <p className="font-bold text-[#243839] text-sm">{vacancy.hoarding_id_string} <span className="text-gray-400 font-normal mx-1">|</span> {vacancy.size}</p>
                              <p className="text-xs text-gray-500 font-medium flex items-center md:justify-end gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {vacancy.location}
                              </p>
                            </div>
                          </div>

                          <div className="w-full">
                            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                              <span>Started: {new Date(vacancy.start_date).toLocaleDateString()}</span>
                              <span className={statusColor}>Ends: {new Date(vacancy.end_date).toLocaleDateString()}</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${statusBg}`} 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {daysLeft <= 7 && (
                            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                              <p className="text-sm text-red-600 font-bold flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4" /> Vacating very soon!
                              </p>
                              <Link href="/media-owner/hoardings" className="text-sm font-bold text-[#C58B24] hover:text-[#0A4D28] flex items-center gap-1 transition-colors">
                                Update Availability <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}