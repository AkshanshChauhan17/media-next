"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { MapPin, Loader2, ListFilter, Navigation } from "lucide-react";
import { getMapHoardings } from "@/actions/media";

const HoardingMap = dynamic(() => import("../components/HoardingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0B111A] flex flex-col items-center justify-center text-[#E5A93D]">
      <Loader2 className="w-8 h-8 animate-spin mb-3" />
      <span className="font-bold text-sm uppercase tracking-widest text-gray-400">Loading Adboard Map...</span>
    </div>
  )
});

type HoardingMapData = {
  id: number;
  hoarding_id_string: string;
  location: string;
  city: string;
  size: string;
  gps_coordinates: string;
  base_price: string;
  daily_traffic: number;
  image_url?: string;
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function BrowseGenre() {
  const [allHoardings, setAllHoardings] = useState<HoardingMapData[]>([]);
  const [displayHoardings, setDisplayHoardings] = useState<HoardingMapData[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("All India");
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState<number>(4);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const loadMapData = async () => {
      const res = await getMapHoardings();
      if (res.success && res.data) {
        const hoardingsData = res.data as HoardingMapData[];
        setAllHoardings(hoardingsData);
        setDisplayHoardings(hoardingsData);
        const uniqueCities = Array.from(new Set(hoardingsData.map((h: HoardingMapData) => h.city))).filter(Boolean) as string[];
        setCities(uniqueCities);
      }
      setIsLoading(false);
    };
    loadMapData();
  }, []);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setUserLocation(null);
    setDisplayHoardings(allHoardings);
    
    if (city === "All India") {
      setMapCenter([20.5937, 78.9629]);
      setMapZoom(4);
    } else {
      const cityHoardings = allHoardings.filter(h => h.city === city && h.gps_coordinates);
      if (cityHoardings.length > 0) {
        const parts = cityHoardings[0].gps_coordinates.split(',');
        if (parts.length === 2) {
          const lat = parseFloat(parts[0]);
          const lng = parseFloat(parts[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            setMapCenter([lat, lng]);
            setMapZoom(12);
          }
        }
      }
    }
  };

  const findNearMe = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);
        setSelectedCity("Near Me");

        const nearby = allHoardings.filter(h => {
          if (!h.gps_coordinates) return false;
          const parts = h.gps_coordinates.split(',');
          if (parts.length !== 2) return false;
          const hLat = parseFloat(parts[0]);
          const hLng = parseFloat(parts[1]);
          if (isNaN(hLat) || isNaN(hLng)) return false;
          
          const distance = getDistance(lat, lng, hLat, hLng);
          return distance <= 10;
        });

        setDisplayHoardings(nearby);
        setMapCenter([lat, lng]);
        setMapZoom(12);
        setIsLocating(false);
        
        if(nearby.length === 0) {
          alert("No ad spaces found within 10km of your location.");
        }
      },
      () => {
        alert("Unable to retrieve your location. Please allow location access.");
        setIsLocating(false);
      }
    );
  };

  return (
    <section className="bg-[#0B111A] w-full relative overflow-hidden py-16 md:py-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 flex items-center gap-4 tracking-tight">
              <MapPin className="w-8 h-8 md:w-10 md:h-10 text-[#E5A93D]" />
              Explore Adboards via Map
            </h2>
            <p className="text-gray-400 font-medium text-base md:text-lg">
              Zoom, pan, and click on any pin to view live pricing, traffic data, and instant booking options.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 z-20">
            <button
              onClick={findNearMe}
              disabled={isLocating}
              className="w-full sm:w-auto bg-[#1A222C] hover:bg-[#2A3441] text-white border border-[#2A3441] hover:border-[#E5A93D]/50 rounded-2xl px-6 py-4 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLocating ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#E5A93D]" />
              ) : (
                <Navigation className="w-5 h-5 text-gray-400 group-hover:text-[#E5A93D] transition-colors" />
              )}
              Find Near Me (10km)
            </button>
            
            <div className="relative w-full sm:w-72">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                <ListFilter className="w-4 h-4" /> Jump to Location
              </label>
              <div className="relative">
                <select 
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-[#1A222C] border border-[#2A3441] text-white rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E5A93D]/50 focus:border-[#E5A93D] transition-all appearance-none cursor-pointer"
                >
                  {selectedCity === "Near Me" && <option value="Near Me">10km Radius</option>}
                  <option value="All India">All India Overview</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-full h-[500px] md:h-[700px] bg-[#0F1621] rounded-[2rem] overflow-hidden border border-[#1E293B] shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative z-10"
        >
          {!isLoading && (
            <HoardingMap 
              hoardings={displayHoardings.map(h => ({ ...h, id: String(h.id) }))} 
              center={mapCenter} 
              zoom={mapZoom} 
              userLocation={userLocation} 
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}