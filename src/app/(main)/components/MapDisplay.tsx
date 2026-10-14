"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Navigation } from "lucide-react";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const UserIcon = L.divIcon({
  className: "bg-transparent",
  html: `<div style="background-color: #C58B24; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

function MapInteractions({ setTargetPos }: { setTargetPos: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setTargetPos([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

function MapCenterer({ bounds }: { bounds: [[number, number], [number, number]] | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
    }
  }, [bounds, map]);
  return null;
}

export default function MapDisplay({ lat, lng }: { lat: number; lng: number }) {
  const [targetPos, setTargetPos] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const distance = targetPos ? getDistance(lat, lng, targetPos[0], targetPos[1]) : null;

  const handleCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setTargetPos([pos.coords.latitude, pos.coords.longitude]);
          setIsLocating(false);
        },
        () => {
          alert("Location access denied. You can still tap on the map to set a pin.");
          setIsLocating(false);
        }
      );
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-3">
        <button
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-md border border-gray-100 flex items-center gap-2 text-sm font-black text-[#243839] hover:text-[#C58B24] transition-colors"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin text-[#C58B24]' : ''}`} />
          {isLocating ? 'Finding you...' : 'Distance from My Location'}
        </button>
        
        {distance && (
          <div className="bg-[#243839]/95 backdrop-blur-md px-5 py-3 rounded-xl shadow-xl border border-gray-700 animate-in fade-in slide-in-from-left-4">
            <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-0.5">Aerial Distance</p>
            <p className="text-2xl font-black text-white flex items-end gap-1">
              {distance} <span className="text-sm text-[#C58B24] mb-1">km</span>
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
        <div className="bg-black/70 backdrop-blur-md text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg">
          Tap anywhere on map to drop a custom pin
        </div>
      </div>

      <MapContainer
        center={[lat, lng]}
        zoom={14}
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <Marker position={[lat, lng]}>
          <Popup className="font-bold text-[#243839]">Hoarding Location</Popup>
        </Marker>

        {targetPos && (
          <>
            <Marker position={targetPos} icon={UserIcon}>
              <Popup className="font-bold text-[#C58B24]">Your Custom Pin</Popup>
            </Marker>
            <Polyline positions={[[lat, lng], targetPos]} color="#C58B24" weight={3} dashArray="8, 8" />
            <MapCenterer bounds={[[lat, lng], targetPos]} />
          </>
        )}

        <MapInteractions setTargetPos={setTargetPos} />
      </MapContainer>
    </div>
  );
}