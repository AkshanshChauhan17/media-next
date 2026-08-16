import { UploadCloud } from "lucide-react";
import { createMediaItem } from "@/actions/admin";

type Category = { id: string | number; name: string };

export default function MediaForm({ categories }: { categories: Category[] }) {
  async function handleCreateMediaItem(formData: FormData): Promise<void> {
    await createMediaItem(formData);
    return;
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#142642]">Add Media Inventory</h2>
        <UploadCloud className="w-5 h-5 text-[#55C274]" />
      </div>
      
      <form action={handleCreateMediaItem} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Select Category</label>
          <select name="category_id" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all cursor-pointer">
            <option value="">Choose a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Media Title</label>
          <input name="title" required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" placeholder="e.g. IPL Digital Ads" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">URL Slug</label>
          <input name="slug" required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" placeholder="e.g. ipl-digital-ads" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Location / Reach</label>
          <input name="location_city" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" placeholder="e.g. Pan India" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Estimated Price (₹)</label>
          <input name="price" type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" placeholder="e.g. 1500000" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Thumbnail Image</label>
          <input name="image" type="file" accept="image/*" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#55C274]/10 file:text-[#55C274] hover:file:bg-[#55C274]/20 outline-none cursor-pointer" />
        </div>

        <div className="md:col-span-2 pt-4">
          <button type="submit" className="bg-[#55C274] hover:bg-[#4ab065] text-white px-8 py-3.5 rounded-lg font-bold transition-colors w-full shadow-lg shadow-[#55C274]/20">
            Publish Media Item
          </button>
        </div>
      </form>
    </div>
  );
}