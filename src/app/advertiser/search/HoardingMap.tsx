"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, LayersControl, Polyline } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { Activity, Maximize, ArrowRight, Image as ImageIcon, Flame, Radar, Route, X, Loader2, Navigation, Map as MapIcon, Car } from "lucide-react";

interface Hoarding {
  id: string;
  gps_coordinates: string;
  hoarding_id_string: string;
  location: string;
  city: string;
  size: string;
  daily_traffic: number;
  base_price: string | number;
  image_url?: string;
}

const CustomPin = L.divIcon({
  className: "bg-transparent",
  html: `<div style="background-color: #0A4D28; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #C58B24; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          <div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const HoveredPin = L.divIcon({
  className: "bg-transparent",
  html: `<div style="background-color: #C58B24; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 20px rgba(197, 139, 36, 0.9); display: flex; align-items: center; justify-content: center; transform: scale(1.1); transition: all 0.3s; z-index: 1000;">
          <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%; animation: pulse 1.5s infinite;"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const TargetPin = L.divIcon({
  className: "bg-transparent",
  html: `<div style="background-color: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); display: flex; align-items: center; justify-content: center; animation: pulse 1.5s infinite;">
          <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
         </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

const createClusterCustomIcon = function (cluster: { getChildCount: () => number }) {
  return L.divIcon({
    html: `<div style="background-color: #243839; color: #C58B24; width: 40px; height: 40px; border-radius: 50%; border: 3px solid #C58B24; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
            ${cluster.getChildCount()}
           </div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

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

export default function HoardingMap({ 
  hoardings, 
  center, 
  zoom,
  userLocation,
  aiTarget,
  hoveredId
}: { 
  hoardings: Hoarding[], 
  center: [number, number],
  zoom: number,
  userLocation: [number, number] | null,
  aiTarget?: { lat: number, lng: number } | null,
  hoveredId?: string | null
}) {
  const [analyzedZone, setAnalyzedZone] = useState<Hoarding | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [routeStats, setRouteStats] = useState<{dist: string, time: string, originLat: number, originLng: number, destLat: number, destLng: number} | null>(null);
  const [isRouting, setIsRouting] = useState(false);

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

  const handleGetRoute = (targetLat: number, targetLng: number) => {
    if (!navigator.geolocation) {
      alert("Location tracking is not supported by your browser.");
      return;
    }

    setIsRouting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const originLat = position.coords.latitude;
        const originLng = position.coords.longitude;

        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${targetLng},${targetLat}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
            setRoutePath(coords);
            setRouteStats({
              dist: (data.routes[0].distance / 1000).toFixed(1),
              time: Math.round(data.routes[0].duration / 60).toString(),
              originLat,
              originLng,
              destLat: targetLat,
              destLng: targetLng
            });
          } else {
            alert("Could not find a driving route to this location.");
          }
        } catch (error) {
          alert("Failed to calculate route. Please try again.");
        }
        setIsRouting(false);
      },
      (error) => {
        alert("Please allow location access in your browser to get real-time driving directions.");
        setIsRouting(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const getHeatmapColor = (traffic: number) => {
    if (traffic >= 100000) return "#ef4444"; 
    if (traffic >= 50000) return "#f97316"; 
    return "#eab308"; 
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-3 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex flex-col gap-1 pointer-events-auto">
          <button 
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all flex items-center gap-2 ${showHeatmap ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-transparent text-gray-500 hover:bg-gray-50'}`}
          >
            <Flame className="w-4 h-4" /> 
            {showHeatmap ? 'Hide Traffic Heatmap' : 'Live Traffic Heatmap'}
          </button>
        </div>

        {analyzedZone && (
          <div className="bg-[#243839]/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-gray-700 pointer-events-auto w-72 animate-in slide-in-from-left-4">
            <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-3">
              <div className="flex items-center gap-2 text-white">
                <Radar className="w-5 h-5 text-[#C58B24]" />
                <span className="font-black text-sm uppercase tracking-widest">Reach Zones</span>
              </div>
              <button onClick={() => setAnalyzedZone(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs font-bold">1 KM Radius (Core)</span>
                </div>
                <span className="text-[#C58B24] font-black text-xs">{(analyzedZone.daily_traffic * 0.4).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-xs font-bold">3 KM Radius (Local)</span>
                </div>
                <span className="text-[#C58B24] font-black text-xs">{(analyzedZone.daily_traffic * 1.2).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-bold">5 KM Radius (City)</span>
                </div>
                <span className="text-[#C58B24] font-black text-xs">{(analyzedZone.daily_traffic * 2.5).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {routeStats && (
          <div className="bg-blue-600/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-blue-500 pointer-events-auto flex items-center gap-4 text-white animate-in slide-in-from-left-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Live Navigation</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-black flex items-center gap-1.5"><Car className="w-4 h-4" /> {routeStats.time} min</span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="font-bold flex items-center gap-1.5"><MapIcon className="w-4 h-4" /> {routeStats.dist} km</span>
              </div>
            </div>
            
            <a 
              href={`https://www.google.com/maps/dir/?api=1&origin=${routeStats.originLat},${routeStats.originLng}&destination=${routeStats.destLat},${routeStats.destLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-50 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" /> Drive
            </a>

            <button onClick={() => { setRoutePath([]); setRouteStats(null); }} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        attributionControl={false}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Standard Map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark Mode (Night View)">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapController center={center} zoom={aiTarget ? 13 : zoom} />

        {showHeatmap && hoardings.map(h => {
          const coords = parseCoords(h.gps_coordinates);
          if (!coords) return null;
          return (
            <Circle 
              key={`heat-${h.id}`}
              center={coords} 
              radius={800} 
              pathOptions={{ 
                color: getHeatmapColor(h.daily_traffic), 
                fillColor: getHeatmapColor(h.daily_traffic), 
                fillOpacity: 0.3, 
                stroke: false 
              }} 
            />
          );
        })}

        {analyzedZone && (
          <>
            <Circle center={parseCoords(analyzedZone.gps_coordinates)!} radius={1000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 2 }} />
            <Circle center={parseCoords(analyzedZone.gps_coordinates)!} radius={3000} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.05, weight: 2, dashArray: "5, 10" }} />
            <Circle center={parseCoords(analyzedZone.gps_coordinates)!} radius={5000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.02, weight: 2, dashArray: "5, 15" }} />
          </>
        )}

        {routePath.length > 0 && (
          <Polyline positions={routePath} color="#3b82f6" weight={6} opacity={0.8} />
        )}
        
        {aiTarget && (
          <>
            <Marker position={[aiTarget.lat, aiTarget.lng]} icon={TargetPin}>
              <Popup className="font-bold text-[#C58B24]">Target Location (Center)</Popup>
            </Marker>
            <Circle center={[aiTarget.lat, aiTarget.lng]} radius={2000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 2, dashArray: "5, 10" }} />
          </>
        )}

        <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon} showCoverageOnHover={false} maxClusterRadius={50}>
          {hoardings.map((h) => {
            const coords = parseCoords(h.gps_coordinates);
            if (!coords) return null;
            if (aiTarget && coords[0] === aiTarget.lat && coords[1] === aiTarget.lng) return null;
            const isHovered = hoveredId === h.id;

            return (
              <Marker key={h.id} position={coords} icon={isHovered ? HoveredPin : CustomPin} zIndexOffset={isHovered ? 1000 : 0}>
                <Popup className="custom-popup" maxWidth={280} minWidth={280}>
                  <div className="flex flex-col overflow-hidden rounded-xl bg-white w-full shadow-lg">
                    <div className="h-32 w-full bg-gray-100 relative">
                      {h.image_url ? (
                        <img src={h.image_url} alt="Hoarding" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-8 h-8 opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-[#243839] text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">
                        {h.hoarding_id_string}
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-3">
                      <div>
                        <h3 className="font-black text-[#243839] text-sm leading-tight mb-1 line-clamp-2">{h.location}</h3>
                        <p className="text-[#C58B24] font-bold text-xs">{h.city}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <Maximize className="w-3.5 h-3.5 text-gray-400" /> {h.size}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-gray-400" /> {(h.daily_traffic/1000).toFixed(1)}k
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => setAnalyzedZone(h)}
                          className="flex-1 bg-[#243839] hover:bg-[#1a292a] text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Radar className="w-3.5 h-3.5" /> Zones
                        </button>
                        <button 
                          onClick={() => handleGetRoute(coords[0], coords[1])}
                          disabled={isRouting}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          {isRouting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Route className="w-3.5 h-3.5" />} Route
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-100">
                        <span className="font-black text-[#0A4D28] text-base">₹{Number(h.base_price).toLocaleString()}</span>
                        <Link href={`/media/${h.id}`} className="text-[#C58B24] hover:text-[#a6741c] text-xs font-black flex items-center gap-1">
                          Book Now <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}