"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  MapPin, 
  Maximize, 
  Lightbulb, 
  ShieldCheck, 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  Navigation,
  Image as ImageIcon,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { getHoardingDetails, addToCart } from "@/actions/media";

const MapDisplay = dynamic(() => import("../../components/MapDisplay"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 font-bold text-sm">
      Loading Exact Location...
    </div>
  )
});

type HoardingDetail = {
  id: number;
  hoarding_id_string: string;
  location: string;
  city: string;
  size: string;
  base_price: string;
  media_owner_name: string;
  image_url?: string;
  is_illuminated?: boolean;
  status: string;
  gps_coordinates?: string;
};

export default function HoardingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [hoarding, setHoarding] = useState<HoardingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const res = await getHoardingDetails(id);
        if (res.success && res.data) {
          setHoarding(res.data as HoardingDetail);
        }
      } catch (err) {} finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    const res = await addToCart(id);
    setIsAddingToCart(false);

    if (res.success) {
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } else if (res.error === "Unauthorized") {
      router.push(`/auth`);
    } else {
      alert(res.error || "Failed to add to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#0A4D28] mb-4" />
        <p className="text-gray-500 font-bold tracking-wide">Loading Space Details...</p>
      </div>
    );
  }

  if (!hoarding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-black text-[#243839] mb-2">Space Not Found</h2>
        <button onClick={() => router.back()} className="text-[#C58B24] font-bold hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  let mapLat = 0;
  let mapLng = 0;
  let hasValidMapCoords = false;

  if (hoarding.gps_coordinates) {
    const parts = hoarding.gps_coordinates.split(',');
    if (parts.length === 2) {
      const parsedLat = parseFloat(parts[0].trim());
      const parsedLng = parseFloat(parts[1].trim());
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        mapLat = parsedLat;
        mapLng = parsedLng;
        hasValidMapCoords = true;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-sm font-bold text-[#243839] hover:text-[#C58B24] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#243839] text-white px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                {hoarding.hoarding_id_string}
              </span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 border border-green-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Space
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#243839] leading-tight mb-4">
              Premium Billboard at {hoarding.location}
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#C58B24]" /> {hoarding.city}</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.9 (Verified Audits)</span>
            </div>
          </div>
        </div>

        <div className="w-full h-[400px] md:h-[600px] bg-gray-200 rounded-3xl mb-12 overflow-hidden relative group">
          {hoarding.image_url ? (
            <img src={hoarding.image_url} alt="Hoarding" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
              <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
              <span className="font-bold text-lg">No preview available</span>
            </div>
          )}
        </div>

        <div className="flex flex-col xl:flex-row gap-12">
          <div className="flex-1">
            <div className="pb-10 border-b border-gray-200">
              <h2 className="text-2xl font-black text-[#243839] mb-6">Space Overview</h2>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                Strategically located at {hoarding.location} in {hoarding.city}, this premium outdoor advertising space guarantees massive daily impressions. Perfect for brand awareness campaigns targeting high-traffic urban audiences.
              </p>
            </div>

            <div className="py-10 border-b border-gray-200">
              <h2 className="text-2xl font-black text-[#243839] mb-8">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <Maximize className="w-8 h-8 text-[#C58B24]" />
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2">Size</span>
                  <span className="text-lg font-black text-[#243839]">{hoarding.size}</span>
                </div>
                <div className="flex flex-col gap-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <Lightbulb className="w-8 h-8 text-[#C58B24]" />
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2">Illumination</span>
                  <span className="text-lg font-black text-[#243839]">Front Lit</span>
                </div>
                <div className="flex flex-col gap-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <Navigation className="w-8 h-8 text-[#C58B24]" />
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2">Traffic</span>
                  <span className="text-lg font-black text-[#243839]">Two Way</span>
                </div>
                <div className="flex flex-col gap-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-[#C58B24]" />
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2">Owner</span>
                  <span className="text-lg font-black text-[#243839] truncate">{hoarding.media_owner_name}</span>
                </div>
              </div>
            </div>

            {hasValidMapCoords && (
              <div className="py-10 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-7 h-7 text-[#0A4D28]" />
                  <h2 className="text-2xl font-black text-[#243839]">Location & Distance Tool</h2>
                </div>
                <div className="w-full h-[450px] md:h-[550px] rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative group">
                  <MapDisplay lat={mapLat} lng={mapLng} />
                </div>
              </div>
            )}

            <div className="py-10">
              <h2 className="text-2xl font-black text-[#243839] mb-6">Platform Guarantees</h2>
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-50 p-3 rounded-2xl mt-1">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#243839] text-lg">GPS Verified Installation</h4>
                    <p className="text-gray-500 text-sm font-medium mt-1">Our independent field auditors verify every installation using GPS-locked cameras to ensure absolute transparency.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-2xl mt-1">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#243839] text-lg">100% Secure Payments</h4>
                    <p className="text-gray-500 text-sm font-medium mt-1">Your money is held safely in escrow and is only released to the media owner after a successful verified audit.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:w-[420px]">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.06)] sticky top-24">
              <div className="mb-6">
                <span className="text-4xl font-black text-[#243839]">₹{Number(hoarding.base_price).toLocaleString()}</span>
                <span className="text-gray-400 font-bold ml-2">/ month</span>
              </div>
              
              <div className="flex items-center justify-between py-5 border-t border-b border-gray-100 mb-6">
                <span className="text-sm font-bold text-gray-500">18% GST</span>
                <span className="text-sm font-black text-[#243839]">₹{(Number(hoarding.base_price) * 0.18).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between mb-8 bg-gray-50 p-4 rounded-xl">
                <span className="text-lg font-black text-[#243839]">Total Estimated</span>
                <span className="text-2xl font-black text-[#C58B24]">₹{(Number(hoarding.base_price) * 1.18).toLocaleString()}</span>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || cartSuccess}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                  cartSuccess 
                    ? "bg-green-600 text-white" 
                    : "bg-[#C58B24] hover:bg-[#a6741c] text-white hover:shadow-xl hover:-translate-y-1"
                } disabled:opacity-70 disabled:hover:transform-none`}
              >
                {isAddingToCart ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                ) : cartSuccess ? (
                  <><CheckCircle2 className="w-6 h-6" /> Added to Cart</>
                ) : (
                  <><ShoppingCart className="w-6 h-6" /> Add to Campaign Cart</>
                )}
              </button>

              <p className="text-center text-xs font-bold text-gray-400 mt-5">
                You wont be charged yet. Dates can be selected in the cart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}