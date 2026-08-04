"use client";

import React, { useState } from "react";
import { Upload, Sliders, Image as ImageIcon, Trash2, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processUploadedImage, ImageProcessOptions } from "@/lib/signature/image-processor";

export interface UploadModeOptions {
  rawImage: string | null;
  processedImage: string | null;
  removeBackground: boolean;
  threshold: number; // 50 - 250
  contrast: number; // -100 - 100
  brightness: number; // -100 - 100
  inkColor: string;
}

interface UploadModeCardProps {
  options: UploadModeOptions;
  onChangeOptions: (updater: (prev: UploadModeOptions) => UploadModeOptions) => void;
}

const INK_PRESETS = [
  { name: "Original Color", color: "" },
  { name: "Midnight Black", color: "#18181B" },
  { name: "Royal Blue", color: "#1E40AF" },
  { name: "Classic Navy", color: "#1E1B4B" },
  { name: "Emerald Green", color: "#059669" },
  { name: "Crimson Red", color: "#DC2626" },
];

export const UploadModeCard: React.FC<UploadModeCardProps> = ({
  options,
  onChangeOptions,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const raw = reader.result as string;
      setIsProcessing(true);
      try {
        const processed = await processUploadedImage(raw, {
          removeBackground: options.removeBackground,
          threshold: options.threshold,
          inkColor: options.inkColor,
          contrast: options.contrast,
          brightness: options.brightness,
        });

        onChangeOptions((prev) => ({
          ...prev,
          rawImage: raw,
          processedImage: processed,
        }));
      } catch (err) {
        console.error("Failed to process uploaded image:", err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const reprocess = async (newOpts: Partial<UploadModeOptions>) => {
    if (!options.rawImage) return;
    const merged = { ...options, ...newOpts };

    setIsProcessing(true);
    try {
      const processed = await processUploadedImage(options.rawImage, {
        removeBackground: merged.removeBackground,
        threshold: merged.threshold,
        inkColor: merged.inkColor,
        contrast: merged.contrast,
        brightness: merged.brightness,
      });

      onChangeOptions((prev) => ({
        ...prev,
        ...newOpts,
        processedImage: processed,
      }));
    } catch (err) {
      console.error("Failed to reprocess image:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = () => {
    onChangeOptions((prev) => ({
      ...prev,
      rawImage: null,
      processedImage: null,
    }));
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <Upload className="w-4 h-4 text-orange-500" />
            <span>Upload &amp; Clean Signature Image</span>
          </h3>
          <p className="text-[11px] font-medium text-zinc-500">
            Upload paper signature photo (PNG, JPG, WEBP) to auto-extract pure ink with transparent background.
          </p>
        </div>
      </div>

      {!options.rawImage ? (
        <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 hover:bg-orange-50/30 hover:border-orange-300 transition-all cursor-pointer text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-200">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-900">Upload Signature Image (PNG, JPG, WEBP)</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Drag &amp; drop or click to browse files</p>
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-5">
          {/* Controls & Background Removal Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
            <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options.removeBackground}
                onChange={(e) => reprocess({ removeBackground: e.target.checked })}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 cursor-pointer"
              />
              <span>Auto Remove White Paper Background</span>
            </label>
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemoveImage}
              className="h-8 text-xs text-rose-600 hover:bg-rose-100/60 rounded-xl gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </Button>
          </div>

          {/* Sliders for Threshold & Recolor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Background Removal Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-bold text-zinc-700">Background Sensitivity</label>
                <span className="font-mono text-zinc-500">{options.threshold}</span>
              </div>
              <input
                type="range"
                min={100}
                max={250}
                value={options.threshold}
                onChange={(e) => reprocess({ threshold: Number(e.target.value) })}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Contrast Adjustment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-bold text-zinc-700">Contrast Boost</label>
                <span className="font-mono text-zinc-500">{options.contrast}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={100}
                value={options.contrast}
                onChange={(e) => reprocess({ contrast: Number(e.target.value) })}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Recolor Ink Option */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Recolor Ink</label>
            <div className="flex items-center gap-2">
              {INK_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => reprocess({ inkColor: preset.color })}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                    options.inkColor === preset.color
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
