"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { 
  ShoppingCart, 
  MapPin, 
  CalendarRange, 
  UploadCloud, 
  CreditCard, 
  CheckCircle2, 
  Loader2,
  Trash2,
  Image as ImageIcon,
  ShieldCheck
} from "lucide-react";
import { getCart, removeFromCart, checkoutCart } from "@/actions/advertiser";

type CartItem = {
  cart_item_id: number;
  hoarding_id: number;
  hoarding_id_string: string;
  location: string;
  size: string;
  media_type: string;
  base_price: string;
};

export default function AdvertiserCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [campaignName, setCampaignName] = useState("");
  const [advertiserName, setAdvertiserName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [artwork, setArtwork] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      const res = await getCart();
      if (res.success && res.data) {
        setCartItems(res.data as CartItem[]);
      }
      setIsLoading(false);
    };
    fetchCart();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtwork(e.target.files[0]);
    }
  };

  const handleRemove = async (cartItemId: number) => {
    const res = await removeFromCart(cartItemId);
    if (res.success) {
      setCartItems(cartItems.filter(item => item.cart_item_id !== cartItemId));
    }
  };

  const handleCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!artwork) {
      setErrorMsg("Please upload your campaign artwork.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("campaignName", campaignName);
    formData.append("advertiserName", advertiserName);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("artwork", artwork);

    const res = await checkoutCart(formData);

    if (res.success) {
      setCartItems([]);
      setIsSuccess(true);
    } else {
      setErrorMsg(res.error || "Payment processing failed. Please try again.");
    }
    setIsProcessing(false);
  };

  const baseTotal = cartItems.reduce((acc, item) => acc + Number(item.base_price), 0);
  const taxes = baseTotal * 0.18;
  const grandTotal = baseTotal + taxes;

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-[#243839] mb-2">Payment Successful!</h2>
        <p className="text-gray-500 font-medium max-w-md mb-8">
          Your campaign has been booked. The Media Owner has received your request and artwork for installation.
        </p>
        <button 
          onClick={() => window.location.href = '/advertiser/campaigns'}
          className="bg-[#0A4D28] hover:bg-[#07381d] text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors"
        >
          Track Campaign
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A4D28]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-[#0A4D28]" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#243839]">Secure Checkout</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#243839] mb-2">Your Cart is Empty</h3>
            <p className="text-gray-500 mb-6">Browse our inventory to find the perfect hoarding for your brand.</p>
            <button 
              onClick={() => window.location.href = '/advertiser/search'}
              className="bg-[#C58B24] hover:bg-[#a6741c] text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors"
            >
              Explore Inventory
            </button>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <h2 className="font-bold text-[#243839] text-lg">Selected Inventory</h2>
                </div>
                <div className="p-6 space-y-4">
                  {cartItems.map(item => (
                    <div key={item.cart_item_id} className="flex flex-col sm:flex-row items-start gap-4 border border-gray-100 p-4 rounded-xl hover:border-[#0A4D28]/30 transition-colors">
                      <div className="w-full sm:w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-[#0A4D28] flex-shrink-0">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-[#243839] text-base leading-tight pr-4">{item.location}</h3>
                          <button 
                            type="button" 
                            onClick={() => handleRemove(item.cart_item_id)} 
                            className="text-red-400 hover:text-red-600 p-1 bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-[#C58B24] mb-2">{item.hoarding_id_string}</p>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex gap-2 text-xs font-bold text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">{item.size}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{item.media_type}</span>
                          </div>
                          <span className="font-black text-[#243839]">₹{Number(item.base_price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                  <CalendarRange className="w-5 h-5 text-[#0A4D28]" />
                  <h2 className="font-bold text-[#243839] text-lg">Campaign Details</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#243839] mb-1.5">Brand / Advertiser Name</label>
                    <input 
                      type="text" 
                      required 
                      value={advertiserName}
                      onChange={(e) => setAdvertiserName(e.target.value)}
                      placeholder="e.g. Nike, Tata Motors"
                      className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#243839] mb-1.5">Campaign Name</label>
                    <input 
                      type="text" 
                      required 
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="e.g. Summer Sale 2026"
                      className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#243839] mb-1.5">Start Date</label>
                    <input 
                      type="date" 
                      required 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#243839] mb-1.5">End Date</label>
                    <input 
                      type="date" 
                      required 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4D28]/30"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-[#0A4D28]" />
                  <h2 className="font-bold text-[#243839] text-lg">Upload Creative Artwork</h2>
                </div>
                <div className="p-6">
                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer relative group ${artwork ? 'border-[#0A4D28] bg-[#0A4D28]/5' : 'border-gray-200 hover:border-[#0A4D28]/30 bg-gray-50'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${artwork ? 'bg-[#0A4D28] text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-[#0A4D28]/10 group-hover:text-[#0A4D28]'}`}>
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-[#243839] text-lg mb-1">
                      {artwork ? artwork.name : "Drag & Drop or Click to Upload"}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">CorelDraw, PDF, high-res JPG/PNG supported.</p>
                    <input 
                      type="file" 
                      accept=".pdf,.cdr,.jpg,.png,.jpeg"
                      onChange={handleFileChange}
                      required
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-[#243839] rounded-2xl shadow-xl overflow-hidden sticky top-24 text-white">
                <div className="p-6">
                  <h2 className="font-bold text-lg mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Base Price ({cartItems.length} Items)</span>
                      <span className="font-bold">₹{baseTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Installation Charges</span>
                      <span className="font-bold text-green-400">Included</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Taxes (18% GST)</span>
                      <span className="font-bold">₹{taxes.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total Amount</span>
                      <span className="text-2xl font-black text-[#C58B24]">
                        ₹{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm font-bold mb-6">
                      {errorMsg}
                    </div>
                  )}

                  <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3 mb-6">
                    <ShieldCheck className="w-8 h-8 text-green-400" />
                    <p className="text-xs font-bold text-gray-300">Safe & Secure Payment via Razorpay / Stripe Gateway</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full bg-[#C58B24] hover:bg-[#a6741c] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      <><CreditCard className="w-5 h-5" /> Pay Securely</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}