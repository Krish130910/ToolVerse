"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Layers,
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Eye,
  Check,
  Sparkles,
} from "lucide-react";

export const ImageProcessorTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState<"webp" | "jpeg" | "png">("webp");
  const [blur, setBlur] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImageSrc(url);
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    }
  };

  // Canvas process render
  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      ctx.save();
      ctx.filter = blur > 0 ? `blur(${blur}px)` : "none";
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageSrc, width, height, rotation, flipH, flipV, blur]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL(`image/${format}`, quality / 100);
    a.download = `processed_image.${format}`;
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
            <h3 className="text-base font-bold text-zinc-900">Upload Image for Processing</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Resize, crop, rotate, flip, compress, and convert formats directly in your browser.
            </p>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
              <img src={imageSrc} alt="Source" className="w-10 h-10 object-cover rounded-lg border border-orange-300" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900">Image Loaded ({width}x{height}px)</h4>
                <p className="text-[10px] text-zinc-500">Ready for editing and export</p>
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
          {/* Controls Panel */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500" />
              <span>Image Controls</span>
            </h3>

            {/* Resize Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Width (px):</label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Height (px):</label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            {/* Rotate & Flip Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Rotate & Flip:</label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex-1 text-xs font-semibold gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{rotation}°</span>
                </Button>
                <Button
                  size="sm"
                  variant={flipH ? "default" : "outline"}
                  onClick={() => setFlipH(!flipH)}
                  className="p-2"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={flipV ? "default" : "outline"}
                  onClick={() => setFlipV(!flipV)}
                  className="p-2"
                >
                  <FlipVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Format & Quality */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Export Format:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["webp", "jpeg", "png"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                        format === f ? "bg-orange-500 text-white border-orange-500 shadow-2xs" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Quality: {quality}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Blur Filter: {blur}px</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>

            <Button onClick={downloadImage} variant="default" className="w-full h-11 text-xs font-bold gap-2 shadow-xs">
              <Download className="w-4 h-4" />
              <span>Export Processed Image</span>
            </Button>
          </div>

          {/* Canvas Live Preview */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              <span>Processed Canvas View</span>
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
