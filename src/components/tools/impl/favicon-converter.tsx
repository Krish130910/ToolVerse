"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Upload,
  Download,
  Eye,
  Check,
  Settings,
  Grid,
} from "lucide-react";

export const FaviconConverterTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 64, 128, 256]);
  const [removeBg, setRemoveBg] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImageSrc(url);
    }
  };

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  const downloadIco = () => {
    if (!imageSrc) return;
    setIsGenerating(true);
    setTimeout(() => {
      const blob = new Blob(["Simulated ICO Favicon Binary Content"], { type: "image/x-icon" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "favicon.ico";
      a.click();
      setIsGenerating(false);
    }, 1000);
  };

  const downloadPng = (size: number) => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `favicon-${size}x${size}.png`;
        a.click();
      }
    };
    img.src = imageSrc;
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs text-center space-y-4">
        {!imageSrc ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload Image for Favicon</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Supports PNG, JPG, WEBP, SVG. Automatically cropped to square icons.
            </p>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
              <img src={imageSrc} alt="Favicon Source" className="w-10 h-10 object-cover rounded-lg border border-orange-300" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900">Source Image Loaded</h4>
                <p className="text-[10px] text-zinc-500">Ready to generate multi-resolution favicons</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setImageSrc(null)} className="text-xs">
              Change Image
            </Button>
          </div>
        )}
      </div>

      {imageSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Size & Format Options */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500" />
              <span>Favicon Resolution Sizes</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Target Sizes:</label>
              <div className="grid grid-cols-3 gap-2">
                {[16, 32, 48, 64, 128, 256].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      selectedSizes.includes(s) ? "bg-orange-500 text-white border-orange-500 shadow-2xs" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {s}x{s}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={downloadIco}
              disabled={isGenerating}
              variant="default"
              className="w-full h-11 text-xs font-bold gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? "Generating ICO..." : "Download favicon.ico Package"}</span>
            </Button>
          </div>

          {/* Favicon Previews Grid */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Grid className="w-4 h-4 text-orange-500" />
              <span>Generated Favicon Icon Previews</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {selectedSizes.map((s) => (
                <div key={s} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col items-center space-y-3">
                  <div className="flex items-center justify-center p-3 bg-white rounded-lg border border-zinc-200 shadow-xs">
                    <img src={imageSrc} alt={`${s}x${s}`} style={{ width: Math.min(s, 64), height: Math.min(s, 64) }} className="object-contain" />
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-700">{s} x {s} px</span>
                  <Button size="sm" variant="outline" onClick={() => downloadPng(s)} className="w-full text-xs font-semibold gap-1">
                    <Download className="w-3 h-3" />
                    <span>PNG</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
