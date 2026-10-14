"use client";

import { useState } from "react";
import * as xlsx from "xlsx";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Download
} from "lucide-react";
import { bulkUploadHoardings } from "@/actions/media";

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ count: number; skipped: number } | null>(null);
  const [error, setError] = useState<string>("");

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "SNO.": 1,
        "CITY": "JAIPUR",
        "LOCATION": "IN FRONT OF HOSPITAL FCG - MAIN ROAD",
        "MEDIA": "UNIPOLE",
        "W": 20,
        "H": 10,
        "QTY": 1,
        "SQFT": 200,
        "RATE": 45000
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    
    const colWidths = [
      { wch: 8 },  
      { wch: 15 }, 
      { wch: 50 }, 
      { wch: 15 }, 
      { wch: 5 },  
      { wch: 5 },  
      { wch: 5 },  
      { wch: 8 },  
      { wch: 12 }  
    ];
    worksheet["!cols"] = colWidths;

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
    xlsx.writeFile(workbook, "AdSpace_Media_Template.xlsx");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError("");
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await bulkUploadHoardings(formData);

    if (res.success) {
      setUploadResult({ count: res.count || 0, skipped: res.skipped || 0 });
      setFile(null);
    } else {
      setError(res.error || "Upload failed");
    }

    setIsUploading(false);
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] mb-10">
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#243839] flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#C58B24]" />
            Bulk Upload Media
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Upload your Excel file. Existing locations will be skipped automatically.
          </p>
        </div>
        
        <button 
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 text-sm font-bold text-[#0A4D28] bg-[#0A4D28]/10 hover:bg-[#0A4D28]/20 px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Get Template
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      {uploadResult !== null && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border border-green-200 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> 
            Successfully imported {uploadResult.count} new media spaces.
          </div>
          {uploadResult.skipped > 0 && (
            <div className="text-xs text-green-800/80 pl-7 font-medium">
              Skipped {uploadResult.skipped} duplicate entries already present in your inventory.
            </div>
          )}
        </div>
      )}

      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 relative hover:bg-gray-50 transition-colors">
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {file ? (
          <div className="flex flex-col items-center text-center">
            <div className="bg-[#0A4D28]/10 p-4 rounded-full mb-3">
              <FileSpreadsheet className="w-8 h-8 text-[#0A4D28]" />
            </div>
            <span className="font-black text-[#243839]">{file.name}</span>
            <span className="text-xs font-bold text-gray-400 mt-1">
              {(file.size / 1024).toFixed(2)} KB
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-full shadow-sm border border-gray-100 mb-3">
              <UploadCloud className="w-8 h-8 text-[#C58B24]" />
            </div>
            <span className="font-bold text-[#243839]">Click or drag Excel file here</span>
            <span className="text-xs font-medium text-gray-400 mt-1">Supports .xlsx and .xls</span>
          </div>
        )}
      </div>

      <button 
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full mt-6 bg-[#243839] hover:bg-black text-white py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Processing Data...</>
        ) : (
          <>Upload & Sync Database</>
        )}
      </button>
    </div>
  );
}