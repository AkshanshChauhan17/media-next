"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, Loader2, Navigation } from "lucide-react";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ 
  position, 
  setPosition, 
  onSelect 
}: { 
  position: [number, number] | null, 
  setPosition: (pos: [number, number]) => void,
  onSelect: (coords: string) => void 
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onSelect(`${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ 
  defaultLat = 20.5937, 
  defaultLng = 78.9629, 
  onSelect 
}: { 
  defaultLat?: number; 
  defaultLng?: number; 
  onSelect: (coords: string) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    defaultLat !== 20.5937 ? [defaultLat, defaultLng] : null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([defaultLat, defaultLng]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    
    try {
      const arcgisRes = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${encodeURIComponent(searchQuery)}&maxLocations=1`);
      const arcgisData = await arcgisRes.json();

      if (arcgisData.candidates && arcgisData.candidates.length > 0) {
        const lat = arcgisData.candidates[0].location.y;
        const lon = arcgisData.candidates[0].location.x;
        setMapCenter([lat, lon]);
        setPosition([lat, lon]);
        onSelect(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
      } else {
        const cleanQuery = searchQuery
          .replace(/in front of|near|opposite|behind|beside|final|fcg|gate/gi, '')
          .replace(/[^a-zA-Z0-9 ]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=1`);
        const osmData = await osmRes.json();

        if (osmData && osmData.length > 0) {
          const lat = parseFloat(osmData[0].lat);
          const lon = parseFloat(osmData[0].lon);
          setMapCenter([lat, lon]);
          setPosition([lat, lon]);
          onSelect(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
        } else {
          alert("Location too complex to auto-detect. Please search just the main city or landmark name.");
        }
      }
    } catch (error) {
      alert("Failed to search location.");
    }
    
    setIsSearching(false);
  };

  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setMapCenter([lat, lon]);
          setPosition([lat, lon]);
          onSelect(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
          setIsSearching(false);
        },
        () => {
          alert("Please allow location access in your browser.");
          setIsSearching(false);
        }
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative w-full flex gap-2 z-20">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Type any complex address or landmark..."
            className="w-full bg-white border border-gray-200 text-[#243839] rounded-lg pl-4 pr-10 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30 shadow-sm"
          />
          {isSearching ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C58B24] animate-spin" />
          ) : (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          )}
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="bg-[#243839] hover:bg-[#0A4D28] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleCurrentLocation}
          title="Get My Location"
          className="bg-gray-100 hover:bg-gray-200 text-[#C58B24] px-3 py-2.5 rounded-lg transition-colors shadow-sm border border-gray-200 flex items-center justify-center"
        >
          <Navigation className="w-5 h-5" />
        </button>
      </div>

      <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-200 z-10 relative shadow-inner">
        <MapContainer 
          center={mapCenter} 
          zoom={position ? 15 : 5} 
          style={{ height: "100%", width: "100%", zIndex: 10 }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController center={mapCenter} />
          <LocationMarker position={position} setPosition={setPosition} onSelect={onSelect} />
        </MapContainer>
      </div>
    </div>
  );
}