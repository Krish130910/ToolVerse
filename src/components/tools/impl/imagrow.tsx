"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Upload,
  Download,
  RotateCcw,
  Sliders,
  Eye,
  Sun,
  Contrast,
  Palette,
} from "lucide-react";

const FILTERS = [
  { name: "Normal", brightness: 100, contrast: 100, saturate: 100, hue: 0, sepia: 0, grayscale: 0 },
  { name: "Vintage", brightness: 110, contrast: 90, saturate: 85, hue: -10, sepia: 40, grayscale: 0 },
  { name: "Cyberpunk", brightness: 115, contrast: 130, saturate: 160, hue: 180, sepia: 0, grayscale: 0 },
  { name: "Grayscale", brightness: 100, contrast: 120, saturate: 0, hue: 0, sepia: 0, grayscale: 100 },
  { name: "Sepia", brightness: 95, contrast: 105, saturate: 90, hue: 0, sepia: 90, grayscale: 0 },
  { name: "Warm Summer", brightness: 110, contrast: 105, saturate: 130, hue: 20, sepia: 15, grayscale: 0 },
  { name: "Cool Nordic", brightness: 105, contrast: 115, saturate: 110, hue: -30, sepia: 0, grayscale: 0 },
];

export const ImaGrowTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [hue, setHue] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [activeFilter, setActiveFilter] = useState("Normal");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImageSrc(url);
    }
  };

  const applyPresetFilter = (f: typeof FILTERS[0]) => {
    setActiveFilter(f.name);
    setBrightness(f.brightness);
    setContrast(f.contrast);
    setSaturate(f.saturate);
    setHue(f.hue);
    setSepia(f.sepia);
    setGrayscale(f.grayscale);
  };

  const resetAdjustments = () => {
    applyPresetFilter(FILTERS[0]);
    setBlur(0);
  };

  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px)`;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageSrc;
  }, [imageSrc, brightness, contrast, saturate, hue, sepia, grayscale, blur]);

  const downloadEditedImage = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "imagrow_edited.png";
    a.click();
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
            <h3 className="text-base font-bold text-zinc-900">Upload Photo to ImaGrow Editor</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Adjust brightness, contrast, saturation, hue, and apply preset aesthetic filters.
            </p>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
              <img src={imageSrc} alt="Source" className="w-10 h-10 object-cover rounded-lg border border-orange-300" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900">Photo Loaded into ImaGrow</h4>
                <p className="text-[10px] text-zinc-500">Preset Filter: {activeFilter}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setImageSrc(null)} className="text-xs">
              Change Photo
            </Button>
          </div>
        )}
      </div>

      {imageSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-500" />
                <span>Adjustments & Preset Filters</span>
              </h3>
              <Button size="sm" variant="ghost" onClick={resetAdjustments} className="text-xs gap-1 text-zinc-500 hover:text-zinc-900">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            </div>

            {/* Preset Filters Row */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Preset Filters:</label>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => applyPresetFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeFilter === f.name ? "bg-orange-500 text-white shadow-2xs" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Sliders */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Brightness: {brightness}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Contrast: {contrast}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Saturation: {saturate}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturate}
                  onChange={(e) => setSaturate(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Hue Rotate: {hue}°</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Sepia Tone: {sepia}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sepia}
                  onChange={(e) => setSepia(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>

            <Button onClick={downloadEditedImage} variant="default" className="w-full h-11 text-xs font-bold gap-2 shadow-xs">
              <Download className="w-4 h-4" />
              <span>Export ImaGrow Photo</span>
            </Button>
          </div>

          {/* Render Canvas Preview */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              <span>ImaGrow Live Render</span>
            </h3>

            <div className="bg-zinc-100 p-8 rounded-xl flex items-center justify-center overflow-auto min-h-80 shadow-inner">
              <canvas ref={canvasRef} className="rounded-lg shadow-md max-w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
