"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Search, List, Map, Loader2, MapPin, Sparkles, ShoppingCart, X } from "lucide-react";
import { searchInventory, getFilterOptions, addToCart, getAISuggestions } from "@/actions/advertiser";
import HoardingCard from "./HoardingCard";
import CompareModal from "./CompareModal";
import PanoViewerModal from "./PanoViewerModal";

export type InventoryItem = {
  id: number;
  location: string;
  city: string;
  media_type: string;
  status: string;
  available_from: string | null;
  size: string;
  daily_traffic: number | string;
  base_price: number | string;
  gps_coordinates?: string;
  image_url?: string;
  hoarding_id_string?: string;
  pano_image_1?: string;
  pano_image_2?: string;
  pano_image_3?: string;
  pano_image_4?: string;
  pano_image_5?: string;
  distance_km?: number;
};

const HoardingMap = dynamic(() => import("./HoardingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-[#0A4D28]">
      <Loader2 className="w-8 h-8 animate-spin mb-3" />
      <span className="font-bold text-sm uppercase tracking-widest">Loading Live Map...</span>
    </div>
  )
});

export default function ExploreInventory() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQ, setSearchQ] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  const [city, setCity] = useState("All");
  const [mediaType, setMediaType] = useState("All");

  const [dbCities, setDbCities] = useState<string[]>([]);
  const [dbMediaTypes, setDbMediaTypes] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [compareList, setCompareList] = useState<InventoryItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [panoItem, setPanoItem] = useState<InventoryItem | null>(null);

  const [cartAddingId, setCartAddingId] = useState<number | null>(null);
  const [cartSuccessId, setCartSuccessId] = useState<number | null>(null);

  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);

  const [selectedTarget, setSelectedTarget] = useState<InventoryItem | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<InventoryItem[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiCoords, setAiCoords] = useState<{ lat: number, lng: number } | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || viewMode !== "grid") return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, viewMode]);

  useEffect(() => {
    const fetchFilters = async () => {
      const res = await getFilterOptions();
      if (res.success) {
        setDbCities(res.cities || []);
        setDbMediaTypes(res.mediaTypes || []);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const loadInventory = async () => {
      setIsLoading(true);
      const res = await searchInventory({ q: appliedQuery, city, type: mediaType, page, limit: 10 });

      if (res.success && Array.isArray(res.data)) {
        const fetchedData = res.data as InventoryItem[];

        if (fetchedData.length < 10) setHasMore(false);

        setInventory(prev => {
          if (page === 1) return fetchedData;
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewItems = fetchedData.filter(item => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });

        if (page === 1 && fetchedData.length > 0 && !selectedTarget) {
          const firstWithCoords = fetchedData.find((h) => h.gps_coordinates);
          if (firstWithCoords && firstWithCoords.gps_coordinates) {
            const parts = firstWithCoords.gps_coordinates.split(',');
            if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
              setMapCenter([parseFloat(parts[0]), parseFloat(parts[1])]);
            }
          }
        }
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    };

    loadInventory();
  }, [page, appliedQuery, city, mediaType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInventory([]);
    setPage(1);
    setHasMore(true);
    setAppliedQuery(searchQ);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    setInventory([]);
    setPage(1);
    setHasMore(true);
  };

  const handleMediaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMediaType(e.target.value);
    setInventory([]);
    setPage(1);
    setHasMore(true);
  };

  const handleAddToCart = async (hoardingId: number) => {
    setCartAddingId(hoardingId);
    const res = await addToCart(hoardingId);
    if (res.success) {
      setCartSuccessId(hoardingId);
      setTimeout(() => setCartSuccessId(null), 2000);
    }
    setCartAddingId(null);
  };

  const toggleCompare = (hoarding: InventoryItem) => {
    if (compareList.find(item => item.id === hoarding.id)) {
      setCompareList(compareList.filter(item => item.id !== hoarding.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can only compare up to 3 hoardings at a time.");
        return;
      }
      setCompareList([...compareList, hoarding]);
    }
  };

  const handleAISuggest = async (hoarding: InventoryItem) => {
    setSelectedTarget(hoarding);
    setIsAiLoading(true);

    if (hoarding.gps_coordinates) {
      const parts = hoarding.gps_coordinates.split(',');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          setAiCoords({ lat, lng });
          setMapCenter([lat, lng]);
          const res = await getAISuggestions(lat, lng, hoarding.id);
          if (res.success && Array.isArray(res.data)) {
            setAiSuggestions(res.data as InventoryItem[]);
          }
        }
      }
    }
    setIsAiLoading(false);
  };

  const clearAISuggestions = () => {
    setSelectedTarget(null);
    setAiSuggestions([]);
    setAiCoords(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-20 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search road, landmark, or ID..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:border-[#0A4D28] focus:ring-2 focus:ring-[#0A4D28]/20 transition-all font-medium text-[#243839]"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select value={city} onChange={handleCityChange} className="bg-white border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30">
            <option value="All">All Cities</option>
            {dbCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={mediaType} onChange={handleMediaTypeChange} className="bg-white border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30">
            <option value="All">All Media Types</option>
            {dbMediaTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#0A4D28]' : 'text-gray-500 hover:text-gray-900'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("map")} className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-[#0A4D28]' : 'text-gray-500 hover:text-gray-900'}`}>
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">

        {selectedTarget && (
          <div className="mb-6 bg-gradient-to-r from-[#0A4D28] to-[#243839] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-top-4">
            <Sparkles className="absolute top-4 right-4 w-24 h-24 text-white/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#C58B24]" />
                <h3 className="font-bold text-lg">AI Proximity Halo (2km Radius)</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4 max-w-3xl leading-relaxed">
                We analyzed locations around <strong className="text-white">{selectedTarget.location}</strong>. Adding these nearby spaces to your cart creates a Halo Effect, ensuring your audience sees your brand multiple times in the same neighborhood. Switch to Map View to see the visual radius.
              </p>

              {isAiLoading ? (
                <div className="flex items-center gap-2 text-[#C58B24] font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" /> Scanning perimeter...
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
                  {aiSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="min-w-[280px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 snap-start shadow-sm">
                      <p className="font-bold text-sm mb-1 truncate text-white">{suggestion.location}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs bg-[#C58B24] text-white px-2 py-1 rounded font-bold shadow-sm">
                          {Number(suggestion.distance_km).toFixed(1)} km away
                        </span>
                        <button
                          onClick={() => handleAddToCart(suggestion.id)}
                          disabled={cartAddingId === suggestion.id}
                          className="text-xs font-bold hover:text-[#C58B24] flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {cartAddingId === suggestion.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShoppingCart className="w-3 h-3" />} Add
                        </button>
                      </div>
                    </div>
                  ))}
                  {aiSuggestions.length === 0 && <p className="text-sm font-bold text-gray-300">No active hoardings found within 2km radius.</p>}
                </div>
              )}
            </div>
            <button onClick={clearAISuggestions} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-20">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {viewMode === "map" ? (
          <div className="w-full h-[600px] bg-gray-100 rounded-3xl overflow-hidden shadow-inner border-2 border-white relative z-10">
            {!isLoading && inventory.length > 0 ? (
              <HoardingMap
                hoardings={(aiSuggestions.length > 0 ? [...inventory, ...aiSuggestions] : [...inventory])
                  .filter(item => item.gps_coordinates)
                  .map(item => {
                    const parsedDailyTraffic = typeof item.daily_traffic === "number"
                      ? item.daily_traffic
                      : Number(item.daily_traffic ?? 0);

                    return {
                      ...item,
                      id: String(item.id),
                      gps_coordinates: item.gps_coordinates as string,
                      hoarding_id_string: item.hoarding_id_string || String(item.id),
                      daily_traffic: Number.isFinite(parsedDailyTraffic) ? parsedDailyTraffic : 0,
                      base_price: typeof item.base_price === "number"
                        ? item.base_price
                        : Number(item.base_price ?? 0)
                    };
                  })}
                center={mapCenter}
                zoom={city === "All" ? 5 : 12}
                userLocation={null}
                aiTarget={aiCoords}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <MapPin className="w-12 h-12 mb-3" />
                <span className="font-bold">No locations to display on map</span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {inventory.length > 0 ? (
              inventory.map((item, index) => {
                if (inventory.length === index + 1) {
                  return (
                    <div ref={lastElementRef} key={item.id}>
                      <HoardingCard item={item} onAiSuggest={handleAISuggest} onAddToCart={handleAddToCart} cartAddingId={cartAddingId} cartSuccessId={cartSuccessId} onToggleCompare={toggleCompare} isCompared={!!compareList.find(c => c.id === item.id)} onOpenPano={setPanoItem} />
                    </div>
                  );
                } else {
                  return (
                    <HoardingCard key={item.id} item={item} onAiSuggest={handleAISuggest} onAddToCart={handleAddToCart} cartAddingId={cartAddingId} cartSuccessId={cartSuccessId} onToggleCompare={toggleCompare} isCompared={!!compareList.find(c => c.id === item.id)} onOpenPano={setPanoItem} />
                  );
                }
              })
            ) : !isLoading ? (
              <div className="col-span-full py-20 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#243839] mb-2">No Inventory Found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : null}

            {isLoading && (
              <div className="col-span-full py-10 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28]" />
              </div>
            )}
          </div>
        )}
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#243839] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-[60] border border-white/20 animate-in slide-in-from-bottom-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{compareList.length} / 3 Selected</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsCompareModalOpen(true)} className="bg-[#C58B24] hover:bg-[#a6741c] px-5 py-1.5 rounded-full text-sm font-bold transition-colors">
              Compare Now
            </button>
            <button onClick={() => setCompareList([])} className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold transition-colors">
              Clear
            </button>
          </div>
        </div>
      )}

      {isCompareModalOpen && (
        <CompareModal items={compareList.map(item => ({
          id: item.id,
          location: item.location,
          city: item.city,
          base_price: item.base_price,
          daily_traffic: item.daily_traffic,
          size: item.size,
          media_type: item.media_type,
          status: (item.status === 'Vacant' || item.status === 'Booked' ? item.status : 'Vacant') as 'Vacant' | 'Booked'
        }))} onClose={() => setIsCompareModalOpen(false)} />
      )}

      {panoItem && panoItem.hoarding_id_string && (
        <PanoViewerModal hoarding={panoItem as Required<typeof panoItem>} onClose={() => setPanoItem(null)} />
      )}

    </div>
  );
}