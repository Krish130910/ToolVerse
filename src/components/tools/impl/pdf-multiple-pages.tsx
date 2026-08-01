"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Download,
  Grid,
  Settings,
  Eye,
  Check,
  Sparkles,
} from "lucide-react";

export const PdfMultiplePagesTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [gridMode, setGridMode] = useState<"2-up" | "4-up" | "6-up" | "8-up">("4-up");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("landscape");
  const [margin, setMargin] = useState<"compact" | "standard" | "wide">("standard");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processNUpPdf = () => {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
      const blob = new Blob([`N-Up PDF Content ${gridMode} ${orientation}`], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nup_${gridMode}_${file.name}`;
      a.click();
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs text-center space-y-4">
        {!file ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload PDF for N-Up Sheet Grid</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Arrange 2, 4, 6, or 8 PDF pages onto a single sheet to save paper and create presentation handouts.
            </p>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-orange-500" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900">{file.name}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB PDF Document</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setFile(null)} className="text-xs">
              Change File
            </Button>
          </div>
        )}
      </div>

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500" />
              <span>N-Up Layout Settings</span>
            </h3>

            {/* Grid Layout Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Pages per Sheet:</label>
              <div className="grid grid-cols-2 gap-2">
                {(["2-up", "4-up", "6-up", "8-up"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGridMode(g)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      gridMode === g ? "bg-orange-500 text-white border-orange-500 shadow-2xs" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {g} Grid
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Sheet Orientation:</label>
              <div className="grid grid-cols-2 gap-2">
                {(["landscape", "portrait"] as const).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOrientation(o)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                      orientation === o ? "bg-orange-500 text-white border-orange-500 shadow-2xs" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={processNUpPdf} disabled={isProcessing} variant="default" className="w-full h-11 text-xs font-bold gap-2 shadow-xs">
              <Download className="w-4 h-4" />
              <span>{isProcessing ? "Generating Sheet..." : "Download N-Up PDF"}</span>
            </Button>
          </div>

          {/* Live Sheet Grid Preview */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              <span>Sheet Layout Preview ({gridMode})</span>
            </h3>

            <div className="bg-zinc-100 p-8 rounded-xl flex items-center justify-center">
              <div
                className={`bg-white border border-zinc-300 rounded-lg p-4 shadow-md grid gap-2 ${
                  orientation === "landscape" ? "w-96 h-64" : "w-64 h-96"
                } ${
                  gridMode === "2-up" ? "grid-cols-2 grid-rows-1" :
                  gridMode === "4-up" ? "grid-cols-2 grid-rows-2" :
                  gridMode === "6-up" ? "grid-cols-3 grid-rows-2" : "grid-cols-4 grid-rows-2"
                }`}
              >
                {Array.from({ length: Number(gridMode.split("-")[0]) }).map((_, i) => (
                  <div key={i} className="bg-orange-50 border border-orange-200 rounded p-2 flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-orange-600">Page {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
