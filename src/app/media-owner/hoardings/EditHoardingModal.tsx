"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Edit, X, Loader2, UploadCloud, Image as ImageIcon, Trash2, MapPin } from "lucide-react";
import { updateHoarding } from "@/actions/mediaOwner";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400 font-bold text-sm">
      Loading Interactive Map...
    </div>
  )
});

type Hoarding = {
  id: string | number;
  hoarding_id_string: string;
  size: string;
  location: string;
  city: string;
  gps_coordinates: string;
  media_type: string;
  base_price: number | string;
  daily_traffic: number;
  demand_category: string;
  status: string;
  available_from?: string | null;
  image_url?: string;
  pano_image_1?: string;
  pano_image_2?: string;
  pano_image_3?: string;
  pano_image_4?: string;
  pano_image_5?: string;
};

export default function EditHoardingModal({ 
  hoarding, 
  onClose, 
  onSuccess 
}: { 
  hoarding: Hoarding, 
  onClose: () => void, 
  onSuccess: () => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState({
    city: hoarding.city || "",
    size: hoarding.size || "",
    location: hoarding.location || "",
    gpsCoordinates: hoarding.gps_coordinates || "",
    mediaType: hoarding.media_type || "Static Billboard",
    basePrice: hoarding.base_price?.toString() || "",
    dailyTraffic: hoarding.daily_traffic?.toString() || "",
    demandCategory: hoarding.demand_category || "Medium",
    status: hoarding.status || "Vacant",
    availableFrom: hoarding.available_from ? new Date(hoarding.available_from).toISOString().split('T')[0] : ""
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(hoarding.image_url || null);
  
  const [panoFiles, setPanoFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  const [panoPreviews, setPanoPreviews] = useState<(string | null)[]>([
    hoarding.pano_image_1 || null,
    hoarding.pano_image_2 || null,
    hoarding.pano_image_3 || null,
    hoarding.pano_image_4 || null,
    hoarding.pano_image_5 || null,
  ]);

  const panoLabels = ["Far Left", "Left Angle", "Center (Front)", "Right Angle", "Far Right"];

  let defaultLat = 20.5937;
  let defaultLng = 78.9629;
  if (formData.gpsCoordinates) {
    const parts = formData.gpsCoordinates.split(',');
    if(parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
      defaultLat = parseFloat(parts[0].trim());
      defaultLng = parseFloat(parts[1].trim());
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number | 'main') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (index === 'main') {
        setMainImageFile(file);
        setMainImagePreview(url);
      } else {
        const newFiles = [...panoFiles];
        const newPreviews = [...panoPreviews];
        newFiles[index] = file;
        newPreviews[index] = url;
        setPanoFiles(newFiles);
        setPanoPreviews(newPreviews);
      }
    }
  };

  const removePanoPreview = (index: number) => {
    const newFiles = [...panoFiles];
    const newPreviews = [...panoPreviews];
    newFiles[index] = null;
    newPreviews[index] = null;
    setPanoFiles(newFiles);
    setPanoPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!formData.city || !formData.location || !formData.size) {
      alert("Please fill all required basic details.");
      return;
    }

    setIsSubmitting(true);
    const dataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.set(key, value);
    });

    if (mainImageFile) dataToSend.set("mainImage", mainImageFile);
    panoFiles.forEach((file, idx) => {
      if (file) dataToSend.set(`panoImage${idx}`, file);
    });
    
    const res = await updateHoarding(hoarding.id, dataToSend);
    
    if (res.success) {
      onSuccess();
    } else {
      alert(res.error || "Failed to update hoarding");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-[1200px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="font-black text-[#243839] text-xl flex items-center gap-2">
              <Edit className="w-6 h-6 text-[#C58B24]" />
              Edit & Update Media
            </h2>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">{hoarding.hoarding_id_string}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-sm font-black text-[#0A4D28] uppercase tracking-widest border-b border-gray-100 pb-2">Location & Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Size (ft)</label>
                    <input type="text" name="size" value={formData.size} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Full Location Address</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30" />
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-[#243839] uppercase tracking-wide">GPS Coordinates</label>
                    <button 
                      type="button" 
                      onClick={() => setShowMap(!showMap)} 
                      className={`text-[10px] font-black px-2.5 py-1 rounded uppercase flex items-center gap-1.5 transition-colors ${showMap ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-[#C58B24]/10 text-[#C58B24] hover:bg-[#C58B24]/20'}`}
                    >
                      <MapPin className="w-3.5 h-3.5" /> {showMap ? "Close Map" : "Pin on Map"}
                    </button>
                  </div>
                  
                  <input 
                    type="text" 
                    name="gpsCoordinates"
                    value={formData.gpsCoordinates}
                    onChange={handleChange}
                    placeholder="e.g. 28.7041, 77.1025"
                    className="w-full bg-white border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30" 
                  />
                  
                  {showMap && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                      <MapPicker defaultLat={defaultLat} defaultLng={defaultLng} onSelect={(coords: string) => setFormData(prev => ({...prev, gpsCoordinates: coords}))} />
                      <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wide text-center">
                        Click anywhere on the map to set exact coordinates
                      </p>
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-black text-[#0A4D28] uppercase tracking-widest border-b border-gray-100 pb-2 mt-8">Pricing & Market Data</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Media Type</label>
                    <select name="mediaType" value={formData.mediaType} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30 appearance-none">
                      <option value="Static Billboard">Static Billboard</option>
                      <option value="Digital Display">Digital Display</option>
                      <option value="Transit">Transit</option>
                      <option value="Mall Media">Mall Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Base Price (₹ / Month)</label>
                    <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Daily Traffic</label>
                    <input type="number" name="dailyTraffic" value={formData.dailyTraffic} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Demand Category</label>
                    <select name="demandCategory" value={formData.demandCategory} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30 appearance-none">
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Current Status</label>
                    <select 
                      name="status" 
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30 appearance-none"
                    >
                      <option value="Vacant">Vacant</option>
                      <option value="Occupied">Occupied</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Available From</label>
                    <input 
                      type="date" 
                      name="availableFrom" 
                      value={formData.availableFrom}
                      onChange={handleChange}
                      disabled={formData.status === 'Vacant'}
                      className="w-full bg-white border border-gray-200 text-[#243839] rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C58B24]/30 disabled:opacity-50 disabled:bg-gray-100" 
                    />
                  </div>
                </div>

              </div>

              <div className="lg:col-span-6 space-y-6">
                <h3 className="text-sm font-black text-[#0A4D28] uppercase tracking-widest border-b border-gray-100 pb-2">Media & Visuals</h3>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Main Display Image</label>
                  <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 hover:border-[#C58B24] transition-colors h-64 flex items-center justify-center">
                    {mainImagePreview ? (
                      <>
                        <img src={mainImagePreview} alt="Main Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="bg-white text-[#243839] px-4 py-2 rounded-lg font-bold text-sm cursor-pointer shadow-lg hover:bg-gray-100">
                            Change Image
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'main')} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-gray-400 hover:text-[#C58B24]">
                        <UploadCloud className="w-10 h-10 mb-2" />
                        <span className="text-sm font-bold">Click to upload main image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'main')} />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">180° Panoramic View (Left to Right)</label>
                    <span className="text-[10px] font-black bg-[#C58B24]/10 text-[#C58B24] px-2 py-0.5 rounded uppercase">5 Shots</span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {panoPreviews.map((preview, index) => (
                      <div key={index} className="flex flex-col gap-1">
                        <div className="relative group rounded-lg overflow-hidden border border-dashed border-gray-300 bg-gray-50 hover:border-[#C58B24] transition-colors aspect-[3/4] flex items-center justify-center">
                          {preview ? (
                            <>
                              <img src={preview} alt={`Pano ${index}`} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removePanoPreview(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-gray-300 hover:text-[#C58B24]">
                              <ImageIcon className="w-6 h-6 mb-1" />
                              <span className="text-[9px] font-bold text-center leading-tight">Upload</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, index)} />
                            </label>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-center text-gray-500 truncate px-1">{panoLabels[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-[#243839] font-bold hover:bg-gray-200 transition-colors text-sm">
            Cancel Update
          </button>
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="bg-[#0A4D28] hover:bg-[#243839] text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating Database...</> : "Publish Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}