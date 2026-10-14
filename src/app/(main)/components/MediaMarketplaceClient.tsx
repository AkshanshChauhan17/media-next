"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { 
  MapPin, Maximize, Star, Image as ImageIcon, ShieldCheck, 
  Filter, SlidersHorizontal, Loader2, Search
} from "lucide-react";
import { getFilteredHoardings } from "@/actions/media";

type Hoarding = {
  id: number;
  hoarding_id_string: string;
  location: string;
  city: string;
  size: string;
  base_price: string;
  media_type: string;
  image_url?: string;
};

export default function MediaMarketplaceClient({ initialCity }: { initialCity?: string }) {
  const [hoardings, setHoardings] = useState<Hoarding[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const [city, setCity] = useState(initialCity || "");
  const [mediaType, setMediaType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [debouncedCity, setDebouncedCity] = useState(city);
  const [debouncedMin, setDebouncedMin] = useState(minPrice);
  const [debouncedMax, setDebouncedMax] = useState(maxPrice);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city);
      setDebouncedMin(minPrice);
      setDebouncedMax(maxPrice);
    }, 500);
    return () => clearTimeout(timer);
  }, [city, minPrice, maxPrice]);

  const fetchHoardings = async (currentPage: number, append: boolean) => {
    setLoading(true);
    const offset = currentPage * 10;
    
    const res = await getFilteredHoardings({
      city: debouncedCity,
      mediaType,
      minPrice: debouncedMin,
      maxPrice: debouncedMax,
      sortBy,
      offset,
      limit: 10
    });

    if (res.success && Array.isArray(res.data)) {
      const newData = res.data as Hoarding[];
      if (append) {
        setHoardings(prev => [...prev, ...newData]);
      } else {
        setHoardings(newData);
      }
      setHasMore(newData.length === 10);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchHoardings(0, false);
    };
    loadInitialData();
  }, [debouncedCity, mediaType, debouncedMin, debouncedMax, sortBy]);

  useEffect(() => {
    const loadMoreData = async () => {
      if (page > 0) {
        await fetchHoardings(page, true);
      }
    };
    loadMoreData();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-black text-[#243839] tracking-tight">
            {debouncedCity ? `Premium Spaces in ${debouncedCity}` : "Explore All Advertising Spaces"}
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl">
            Discover and book top-performing outdoor advertising hoardings with 100% verified installations and secure payments.
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between z-10 relative">
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search city..." 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
              />
            </div>
            
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30 appearance-none"
              >
                <option value="">All Media Types</option>
                <option value="Static Billboard">Static Billboard</option>
                <option value="Digital Display">Digital Display</option>
                <option value="Transit">Transit</option>
                <option value="Mall Media">Mall Media</option>
              </select>
            </div>

            <div className="flex gap-2 flex-1">
              <input 
                type="number" 
                placeholder="Min ₹" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
              />
              <input 
                type="number" 
                placeholder="Max ₹" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
              />
            </div>
          </div>

          <div className="w-full lg:w-auto relative min-w-[200px]">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#243839] text-white border border-transparent rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#C58B24] appearance-none"
            >
              <option value="newest">Sort by: Newest First</option>
              <option value="price_asc">Sort by: Price (Low to High)</option>
              <option value="price_desc">Sort by: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {hoardings.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
            <MapPin className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-2xl font-black text-[#243839] mb-2">No Spaces Found</h3>
            <p className="text-gray-500 font-medium">
              We could not find any spaces matching your exact filters. Try clearing some filters.
            </p>
            <button 
              onClick={() => { setCity(""); setMediaType(""); setMinPrice(""); setMaxPrice(""); }}
              className="mt-6 bg-[#243839] hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {hoardings.map((hoarding, index) => {
              const isLast = index === hoardings.length - 1;
              return (
                <div key={hoarding.id} ref={isLast ? lastElementRef : null}>
                  <Link 
                    href={`/media/${hoarding.id}`}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all group flex flex-col h-full"
                  >
                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                      {hoarding.image_url ? (
                        <img 
                          src={hoarding.image_url} 
                          alt={hoarding.location} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon className="w-12 h-12 opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-black tracking-widest text-[#243839] uppercase shadow-sm">
                        {hoarding.hoarding_id_string}
                      </div>
                      <div className="absolute top-4 right-4 bg-green-500/95 backdrop-blur-sm text-white px-2 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="flex items-center gap-1 text-xs font-bold text-[#C58B24] uppercase tracking-wider bg-[#C58B24]/10 px-2 py-1 rounded-md">
                            <MapPin className="w-3 h-3" /> {hoarding.city}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-gray-500">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> 4.9
                          </span>
                        </div>

                        <h2 className="text-lg font-black text-[#243839] leading-tight mb-2 line-clamp-2 group-hover:text-[#C58B24] transition-colors">
                          {hoarding.location}
                        </h2>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dimensions</span>
                          <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                            <Maximize className="w-3.5 h-3.5 text-gray-400" /> {hoarding.size}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Per Month</span>
                          <span className="text-lg font-black text-[#243839]">
                            ₹{Number(hoarding.base_price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="w-full flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-[#C58B24] animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}