"use client";

import { useState } from "react";
import { LayoutGrid, EyeOff, Eye, Trash2, Edit, AlertCircle, X, Plus } from "lucide-react";
import { toggleCategoryStatus, deleteCategory, updateCategory } from "@/actions/admin";

interface Category {
  id: string | number;
  name: string;
  slug: string;
  status?: string;
  media_count: number;
  seo_heading?: string;
  seo_paragraphs?: string;
  seo_table_data?: string;
}

type SeoTableRow = {
  option: string;
  reach: string;
  price: string;
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tableRows, setTableRows] = useState<SeoTableRow[]>([]);

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    try {
      if (category.seo_table_data && category.seo_table_data !== "[]") {
        setTableRows(JSON.parse(category.seo_table_data));
      } else {
        setTableRows([{ option: "", reach: "", price: "" }]);
      }
    } catch {
      setTableRows([{ option: "", reach: "", price: "" }]);
    }
  };

  const closeEditModal = () => {
    setEditingCategory(null);
    setTableRows([]);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    formData.set("seo_table_data", JSON.stringify(tableRows));
    
    await updateCategory(typeof editingCategory.id === 'string' ? Number(editingCategory.id) : editingCategory.id, formData);
    
    setIsUpdating(false);
    closeEditModal();
  };

  const addRow = () => {
    setTableRows([...tableRows, { option: "", reach: "", price: "" }]);
  };

  const removeRow = (index: number) => {
    const newRows = [...tableRows];
    newRows.splice(index, 1);
    setTableRows(newRows);
  };

  const handleRowChange = (index: number, field: string, value: string) => {
    const newRows: SeoTableRow[] = [...tableRows];
    newRows[index][field as keyof SeoTableRow] = value;
    setTableRows(newRows);
  };

  const getFormattedParagraphs = (jsonStr?: string) => {
    if (!jsonStr) return "";
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) return parsed.join("\n");
      return jsonStr;
    } catch {
      return jsonStr;
    }
  };

  return (
    <>
      <div className="w-full mt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#142642]">Manage Categories</h2>
          <p className="text-gray-500 text-sm mt-1">View, edit, hide, or delete categories as they appear to users.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`bg-white rounded-xl border transition-all duration-300 flex flex-col group overflow-hidden ${
                category.status === 'HIDDEN' ? 'border-dashed border-gray-300 opacity-75' : 'border-gray-200 hover:shadow-[0_8px_25px_rgb(0,0,0,0.08)]'
              }`}
            >
              <div className="w-full h-[140px] bg-[#F8F7F9] flex items-center justify-center relative">
                {category.status === 'HIDDEN' && (
                  <div className="absolute top-3 left-3 bg-gray-800/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase tracking-wide">
                    <EyeOff className="w-3 h-3" /> Hidden
                  </div>
                )}
                {category.status !== 'HIDDEN' && (
                  <div className="absolute top-3 left-3 bg-[#55C274]/10 text-[#55C274] text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase tracking-wide">
                    <Eye className="w-3 h-3" /> Active
                  </div>
                )}
                
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[11px] font-bold px-2.5 py-1 rounded shadow-sm text-[#142642]">
                  {category.media_count} Ads
                </div>
                <LayoutGrid className={`w-12 h-12 ${category.status === 'HIDDEN' ? 'text-gray-300' : 'text-[#5B46DF]/40'}`} />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[#142642] text-lg leading-tight mb-1 truncate">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-xs truncate mb-4">/{category.slug}</p>
                
                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                  <button 
                    onClick={() => openEditModal(category)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold text-[#2B9BE4] bg-[#EAF5FC] hover:bg-[#2B9BE4] hover:text-white transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  
                  <button 
                    onClick={() => toggleCategoryStatus(Number(category.id), category.status || 'ACTIVE')}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-colors ${
                      category.status === 'HIDDEN' 
                      ? 'text-[#55C274] bg-[#EBF7F4] hover:bg-[#55C274] hover:text-white' 
                      : 'text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white'
                    }`}
                  >
                    {category.status === 'HIDDEN' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {category.status === 'HIDDEN' ? 'Show' : 'Hide'}
                  </button>

                  <button 
                    onClick={() => {
                      if(confirm(`Are you sure you want to delete "${category.name}"? This will also delete all ${category.media_count} ads inside it.`)) {
                        deleteCategory(Number(category.id));
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full py-16 bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
              <AlertCircle className="w-10 h-10 mb-2 text-gray-300" />
              <p className="font-medium">No categories found in the database.</p>
            </div>
          )}
        </div>
      </div>

      {editingCategory && (
        <div className="fixed inset-0 bg-[#142642]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#142642]">Edit Category</h2>
              <button 
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-1.5 rounded-md shadow-sm border border-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Category Name</label>
                  <input 
                    name="name" 
                    defaultValue={editingCategory.name} 
                    required 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">URL Slug</label>
                  <input 
                    name="slug" 
                    defaultValue={editingCategory.slug} 
                    required 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="p-5 bg-[#F8F7F9] rounded-xl border border-[#5B46DF]/10 flex flex-col gap-6">
                <h3 className="font-bold text-[#142642] border-b border-gray-200 pb-3">SEO Content Details</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Page Heading</label>
                  <input 
                    name="seo_heading" 
                    defaultValue={editingCategory.seo_heading}
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" 
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Description Paragraphs (New line = New paragraph)</label>
                  <textarea 
                    name="seo_paragraphs" 
                    defaultValue={getFormattedParagraphs(editingCategory.seo_paragraphs)}
                    rows={4} 
                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">Pricing Table Data</label>
                    <button type="button" onClick={addRow} className="flex items-center gap-1.5 text-[#5B46DF] bg-[#5B46DF]/10 hover:bg-[#5B46DF]/20 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add Row
                    </button>
                  </div>
                  
                  <div className="max-h-[250px] overflow-y-auto pr-2 flex flex-col gap-3">
                    {tableRows.map((row, index) => (
                      <div key={index} className="flex items-start md:items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 flex-col md:flex-row">
                        <input type="text" value={row.option} onChange={(e) => handleRowChange(index, 'option', e.target.value)} placeholder="Option Name" className="flex-1 w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded outline-none focus:border-[#5B46DF]" />
                        <input type="text" value={row.reach} onChange={(e) => handleRowChange(index, 'reach', e.target.value)} placeholder="Reach" className="flex-1 w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded outline-none focus:border-[#5B46DF]" />
                        <input type="text" value={row.price} onChange={(e) => handleRowChange(index, 'price', e.target.value)} placeholder="Price" className="flex-1 w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded outline-none focus:border-[#5B46DF]" />
                        <button type="button" onClick={() => removeRow(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors w-full md:w-auto flex justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="px-8 py-2.5 rounded-lg font-bold text-white bg-[#2B9BE4] hover:bg-[#2080bf] transition-colors disabled:opacity-50 shadow-lg shadow-[#2B9BE4]/20"
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