"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import Image from "next/image";
import { Activity, Maximize, ArrowRight, Image as ImageIcon, Route, Loader2, Car, Clock, X, Layers } from "lucide-react";

const CustomPin = L.divIcon({
  className: "bg-transparent",
  html: `<div style="background-color: #0A4D28; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #C58B24; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const UserPin = L.divIcon({
  className: "bg-transparent",
  html: `<div style="background-color: #2563eb; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
          <div style="background-color: white; width: 6px; height: 6px; border-radius: 50%; animation: pulse 2s infinite;"></div>
         </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapController({ center, zoom, bounds }: { center: [number, number], zoom: number, bounds?: [[number, number], [number, number]] | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
    } else {
      map.flyTo(center, zoom, { animate: true, duration: 1.5 });
    }
  }, [center, zoom, bounds, map]);
  return null;
}

type RouteOption = {
  coords: [number, number][];
  dist: string;
  time: string;
  color: string;
  label: string;
};

export default function HoardingMap({ 
  hoardings, 
  center, 
  zoom,
  userLocation
}: { 
  hoardings: Record<string, unknown>[], 
  center: [number, number],
  zoom: number,
  userLocation: [number, number] | null
}) {
  const [routesList, setRoutesList] = useState<RouteOption[]>([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number>(0);
  const [isRouting, setIsRouting] = useState(false);
  const [activeBounds, setActiveBounds] = useState<[[number, number], [number, number]] | null>(null);

  const parseCoords = (coordStr: string) => {
    if (!coordStr) return null;
    const parts = coordStr.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) return [lat, lng] as [number, number];
    }
    return null;
  };

  const handleGetRoute = async (targetLat: number, targetLng: number) => {
    if (!userLocation) return;
    setIsRouting(true);
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${targetLng},${targetLat}?overview=full&geometries=geojson&alternatives=true`);
      const data = await res.json();
      
      if (data.routes && data.routes.length > 0) {
        const routeColors = ["#2563eb", "#16a34a", "#d97706"];
        const routeLabels = ["Fastest Route", "Alternative Route 1", "Alternative Route 2"];

        interface Route {
          geometry: { coordinates: [number, number][] };
          distance: number;
          duration: number;
        }

        const mappedRoutes: RouteOption[] = data.routes.map((r: Route, idx: number) => ({
          coords: r.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]),
          dist: (r.distance / 1000).toFixed(1),
          time: Math.round(r.duration / 60).toString(),
          color: routeColors[idx % routeColors.length],
          label: idx === 0 ? "Fastest Route" : `Option ${idx + 1}`
        }));

        setRoutesList(mappedRoutes);
        setSelectedRouteIdx(0);
        setActiveBounds([userLocation, [targetLat, targetLng]]);
      }
    } catch (error) {
      alert("Failed to fetch alternative routes. Please try again.");
    }
    setIsRouting(false);
  };

  const clearRoutes = () => {
    setRoutesList([]);
    setSelectedRouteIdx(0);
    setActiveBounds(null);
  };

  return (
    <div className="w-full h-full relative">
      {routesList.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col p-4 gap-3 animate-in slide-in-from-top-4 max-w-md w-full mx-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#C58B24]" /> Select Available Route
            </span>
            <button onClick={clearRoutes} className="p-1 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {routesList.map((r, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRouteIdx(idx)}
                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                  selectedRouteIdx === idx 
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }}></div>
                  <div>
                    <p className="text-xs font-black text-[#243839]">{r.label}</p>
                    <p className="text-[10px] font-bold text-gray-500">{r.dist} km distance</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-black text-sm text-blue-600 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> {r.time} min
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController center={center} zoom={zoom} bounds={activeBounds} />
        
        {userLocation && (
          <>
            <Marker position={userLocation} icon={UserPin}>
              <Popup className="font-bold text-blue-600">Your Location</Popup>
            </Marker>
            <Circle 
              center={userLocation} 
              radius={10000} 
              pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.08, weight: 1.5, dashArray: "4, 6" }} 
            />
          </>
        )}

        {routesList.length > 0 && routesList.map((r, idx) => {
          const isSelected = selectedRouteIdx === idx;
          return (
            <div key={idx}>
              <Polyline 
                positions={r.coords} 
                color={r.color} 
                weight={isSelected ? 6 : 3} 
                opacity={isSelected ? 0.9 : 0.3} 
                dashArray={isSelected ? undefined : "6, 6"}
              />
            </div>
          );
        })}

        {hoardings.map((h) => {
          const coords = parseCoords(typeof h.gps_coordinates === 'string' ? h.gps_coordinates : '');
          if (!coords) return null;

          return (
            <Marker key={String(h.id)} position={coords} icon={CustomPin}>
              <Popup className="custom-popup" maxWidth={280} minWidth={280}>
                <div className="flex flex-col overflow-hidden rounded-xl bg-white w-full shadow-lg">
                  <div className="h-32 w-full bg-gray-100 relative">
                    {h.image_url && typeof h.image_url === 'string' ? (
                      <Image src={h.image_url} alt="Hoarding" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-[#243839] text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">
                      {String(h.hoarding_id_string)}
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col gap-3">
                    <div>
                      <h3 className="font-black text-[#243839] text-sm leading-tight mb-1 line-clamp-2">{String(h.location)}</h3>
                      <p className="text-[#C58B24] font-bold text-xs">{String(h.city)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-3.5 h-3.5 text-gray-400" /> {String(h.size)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-gray-400" /> {(Number(h.daily_traffic)/1000).toFixed(1)}k /day
                      </div>
                    </div>

                    {userLocation && (
                      <button 
                        onClick={() => handleGetRoute(coords[0], coords[1])}
                        disabled={isRouting}
                        className="w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mt-1 border border-blue-100 hover:border-blue-600 shadow-sm"
                      >
                        {isRouting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Route className="w-4 h-4" />}
                        Get Driving Routes
                      </button>
                    )}

                    <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-100">
                      <span className="font-black text-[#0A4D28] text-base">₹{Number(h.base_price).toLocaleString()}</span>
                      <Link 
                        href={`/media/${h.id}`}
                        className="bg-[#243839] hover:bg-[#C58B24] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        Book <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}