"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Plus, X, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { createCategory } from "@/actions/admin";

type Row = { option: string; reach: string; price: string };

const ICON_LIST = [
  "Trophy", "BookOpen", "Podcast", "Newspaper", "MonitorSmartphone", 
  "CarFront", "MapPin", "Radio", "Tv", "Folder", "Megaphone", 
  "Video", "Image", "Smartphone", "Music", "Clapperboard", 
  "Gamepad2", "Mail", "Globe", "Briefcase", "ShoppingCart", "Plane"
];

export default function CategoryForm() {
  const [tableRows, setTableRows] = useState<Row[]>([
    { option: "", reach: "", price: "" }
  ]);
  const [selectedIcon, setSelectedIcon] = useState("Folder");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const SelectedIconComponent = (Icons as unknown as Record<string, LucideIcon>)[selectedIcon];

  const addRow = () => {
    setTableRows([...tableRows, { option: "", reach: "", price: "" }]);
  };

  const removeRow = (index: number) => {
    const newRows = [...tableRows];
    newRows.splice(index, 1);
    setTableRows(newRows);
  };

  const handleChange = (index: number, field: keyof Row, value: string) => {
    const newRows: Row[] = [...tableRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setTableRows(newRows);
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#142642]">Create New Category</h2>
        <PlusCircle className="w-5 h-5 text-[#5B46DF]" />
      </div>
      
      <form
        action={async (formData: FormData) => {
          await createCategory(formData);
        }}
        className="p-6 flex flex-col gap-8"
      >
        <input type="hidden" name="icon" value={selectedIcon} />

        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-700">Category Icon</label>
          <button 
            type="button" 
            onClick={() => setShowIconPicker(true)}
            className="flex items-center gap-3 w-fit px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#5B46DF] transition-colors"
          >
            {SelectedIconComponent && <SelectedIconComponent className="w-6 h-6 text-[#5B46DF]" />}
            <span className="font-medium text-gray-700">{selectedIcon}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Category Name</label>
            <input name="name" required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" placeholder="e.g. Sports Advertising" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">URL Slug</label>
            <input name="slug" required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" placeholder="e.g. sports-advertising" />
          </div>
        </div>

        <div className="p-5 bg-[#F8F7F9] rounded-xl border border-[#5B46DF]/10 flex flex-col gap-6">
          <h3 className="font-bold text-[#142642] border-b border-gray-200 pb-3">SEO Content Details</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Page Heading</label>
            <input name="seo_heading" type="text" className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all" placeholder="What is Sports Advertising?" />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Description Paragraphs</label>
            <textarea name="seo_paragraphs" rows={3} className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B46DF]/20 focus:border-[#5B46DF] outline-none transition-all resize-none" placeholder="Press Enter to create a new paragraph..."></textarea>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Pricing Table Data</label>
              <button type="button" onClick={addRow} className="flex items-center gap-1.5 text-[#5B46DF] bg-[#5B46DF]/10 hover:bg-[#5B46DF]/20 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
            
            {tableRows.map((row, index) => (
              <div key={index} className="flex items-start md:items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 flex-col md:flex-row">
                <input type="text" value={row.option} onChange={(e) => handleChange(index, 'option', e.target.value)} placeholder="Option Name" className="flex-1 w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded outline-none focus:border-[#5B46DF]" />
                <input type="text" value={row.reach} onChange={(e) => handleChange(index, 'reach', e.target.value)} placeholder="Reach (e.g. Pan India)" className="flex-1 w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded outline-none focus:border-[#5B46DF]" />
                <input type="text" value={row.price} onChange={(e) => handleChange(index, 'price', e.target.value)} placeholder="Price" className="flex-1 w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded outline-none focus:border-[#5B46DF]" />
                <button type="button" onClick={() => removeRow(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors w-full md:w-auto flex justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <input type="hidden" name="seo_table_data" value={JSON.stringify(tableRows)} />
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" className="bg-[#5B46DF] hover:bg-[#4a39b5] text-white px-8 py-3.5 rounded-lg font-bold transition-colors w-full shadow-lg shadow-[#5B46DF]/20">
            Publish Category
          </button>
        </div>
      </form>

      {showIconPicker && (
        <div className="fixed inset-0 bg-[#142642]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[#142642]">Select Category Icon</h3>
              <button 
                type="button" 
                onClick={() => setShowIconPicker(false)} 
                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-6 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 max-h-[60vh] overflow-y-auto">
              {ICON_LIST.map(iconName => {
                const IconCmp = (Icons as unknown as Record<string, LucideIcon>)[iconName];
                if (!IconCmp) return null;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => { 
                      setSelectedIcon(iconName); 
                      setShowIconPicker(false); 
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                      selectedIcon === iconName 
                        ? 'bg-[#5B46DF]/10 border-[#5B46DF] text-[#5B46DF]' 
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <IconCmp className="w-6 h-6" />
                    <span className="text-[10px] truncate w-full text-center">{iconName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}