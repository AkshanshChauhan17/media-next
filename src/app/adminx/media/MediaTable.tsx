"use client";

import { useState } from "react";
import { Edit, Trash2, MapPin, LayoutGrid, X } from "lucide-react";
import { deleteMediaItem, updateMediaItem } from "@/actions/admin";

type MediaItem = {
  id: string | number;
  title: string;
  slug: string;
  category_name: string;
  location_city?: string;
  price?: number;
};

export default function MediaTable({ mediaItems }: { mediaItems: MediaItem[] }) {
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    
    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    await updateMediaItem(typeof editingItem.id === 'string' ? Number(editingItem.id) : editingItem.id, formData);
    
    setIsUpdating(false);
    setEditingItem(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mediaItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F4F4F6] rounded flex items-center justify-center shrink-0">
                        <LayoutGrid className="w-5 h-5 text-[#5B46DF]/50" />
                      </div>
                      <div>
                        <p className="font-bold text-[#142642] text-sm">{item.title}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">/{item.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#5B46DF]/10 text-[#5B46DF]">
                      {item.category_name}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {item.location_city || 'Pan India'}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-[#142642]">
                      ₹{item.price?.toLocaleString('en-IN') || 'On Request'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-[#2B9BE4] hover:bg-[#EAF5FC] rounded-lg transition-colors"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm(`Are you sure you want to delete "${item.title}"?`)) {
                            deleteMediaItem(typeof item.id === 'string' ? Number(item.id) : item.id);
                          }
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {mediaItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                    No media items found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-[#142642]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-[#142642]">Edit Media Item</h2>
              <button 
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Media Title</label>
                <input 
                  name="title" 
                  defaultValue={editingItem.title} 
                  required 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">URL Slug</label>
                <input 
                  name="slug" 
                  defaultValue={editingItem.slug} 
                  required 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Location / Reach</label>
                  <input 
                    name="location_city" 
                    defaultValue={editingItem.location_city} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
                  <input 
                    name="price" 
                    type="number"
                    defaultValue={editingItem.price} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-lg font-bold text-white bg-[#2B9BE4] hover:bg-[#2080bf] transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}