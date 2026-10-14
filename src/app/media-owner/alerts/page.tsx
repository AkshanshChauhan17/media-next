"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  LightbulbOff, 
  FileWarning, 
  Wrench,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldAlert,
  Loader2,
  Info
} from "lucide-react";
import { getHoardingAlerts, resolveAlert } from "@/actions/mediaOwner";

type Alert = {
  id: number;
  hoarding_id_string: string;
  location: string;
  alert_type: string;
  issue_description: string;
  severity: "Minor" | "Medium" | "Critical";
  created_at: string;
};

export default function AlertsAndMonitoring() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchAlerts = async () => {
    setIsLoading(true);
    const res = await getHoardingAlerts();
    if (res.success && res.data) {
      setAlerts(res.data as Alert[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let active = true;

    const loadAlerts = async () => {
      setIsLoading(true);
      const res = await getHoardingAlerts();

      if (!active) return;

      if (res.success && res.data) {
        setAlerts(res.data as Alert[]);
      }
      setIsLoading(false);
    };

    loadAlerts();

    return () => {
      active = false;
    };
  }, []);

  const handleResolve = async (id: number) => {
    setProcessingId(id);
    const res = await resolveAlert(id);
    if (res.success) {
      setAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== id));
    }
    setProcessingId(null);
  };

  const criticalCount = alerts.filter(a => a.severity === "Critical").length;
  const mediumCount = alerts.filter(a => a.severity === "Medium").length;
  const minorCount = alerts.filter(a => a.severity === "Minor").length;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-50 border-red-200 text-red-700";
      case "Medium":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "Minor":
        // As per your request: Minor = Green
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    const colorClass = 
      severity === "Critical" ? "text-red-600" : 
      severity === "Medium" ? "text-orange-600" : "text-green-600";

    if (type.toLowerCase().includes("light")) return <LightbulbOff className={`w-6 h-6 ${colorClass}`} />;
    if (type.toLowerCase().includes("structure")) return <Wrench className={`w-6 h-6 ${colorClass}`} />;
    if (type.toLowerCase().includes("flex")) return <FileWarning className={`w-6 h-6 ${colorClass}`} />;
    return <AlertTriangle className={`w-6 h-6 ${colorClass}`} />;
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Health & Damage Alerts</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Real-time monitoring alerts sent simultaneously to you and the Platform Admins.
          </p>
        </div>

        {/* Severity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-800">Critical Alerts</p>
              <p className="text-2xl font-black text-red-600">{criticalCount}</p>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-orange-800">Medium Alerts</p>
              <p className="text-2xl font-black text-orange-600">{mediumCount}</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Info className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-800">Minor Alerts</p>
              <p className="text-2xl font-black text-green-600">{minorCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-bold text-[#243839] text-lg">Active Notifications</h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28] mb-3" />
                <p className="text-gray-500 font-medium">Scanning health records...</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-[#243839] mb-2">All Clear!</h3>
                <p className="text-gray-500 font-medium">
                  Your hoardings are in perfect condition. No active alerts found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${getSeverityStyles(alert.severity)} bg-opacity-50 hover:bg-opacity-100`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-white p-2 rounded-lg shadow-sm">
                        {getAlertIcon(alert.alert_type, alert.severity)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-full bg-white shadow-sm opacity-80">
                            {alert.severity} Priority
                          </span>
                          <span className="text-xs font-bold opacity-70 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 
                            {new Date(alert.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-lg mb-1">{alert.alert_type}</h3>
                        <p className="text-sm font-medium mb-3 opacity-90">{alert.issue_description}</p>
                        
                        <div className="flex items-center gap-3 text-xs font-bold opacity-75">
                          <span className="bg-white/50 px-2 py-1 rounded">ID: {alert.hoarding_id_string}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:text-right flex flex-col justify-center">
                      <button 
                        onClick={() => handleResolve(alert.id)}
                        disabled={processingId === alert.id}
                        className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {processingId === alert.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <><CheckCircle2 className="w-4 h-4 text-green-600" /> Mark as Fixed</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}