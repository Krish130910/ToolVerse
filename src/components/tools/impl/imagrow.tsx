"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Download,
  RotateCcw,
  Eye,
  Sparkles,
  Maximize2,
  Lock,
  Unlock,
  Split,
  RefreshCw,
  Layers,
  Zap,
  AlertTriangle,
  FileWarning,
} from "lucide-react";

type ScalingMode = "multipass" | "bilinear" | "pixel";

const MAX_ALLOWED_DIMENSION = 8192; // 8K Max Dimension to prevent canvas crash
const MAX_ALLOWED_MEGAPIXELS = 36; // 36 Megapixels safe RAM limit

export const ImaGrowTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [scaleFactor, setScaleFactor] = useState<number>(2);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);

  const [scalingMode, setScalingMode] = useState<ScalingMode>("multipass");
  const [sharpness, setSharpness] = useState<number>(30);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);

  const [format, setFormat] = useState<"png" | "webp" | "jpeg">("png");
  const [quality, setQuality] = useState<number>(92);
  const [splitPos, setSplitPos] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "enhanced" | "original">("split");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCapped, setIsCapped] = useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Cleanup object URLs to prevent memory leaks
  const cleanupObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupObjectUrl();
    };
  }, [cleanupObjectUrl]);

  // Safely clamp dimensions within memory limits
  const clampDimensions = useCallback(
    (w: number, h: number): { w: number; h: number; capped: boolean } => {
      let capped = false;
      let newW = w;
      let newH = h;

      // 1. Max single side dimension check
      if (newW > MAX_ALLOWED_DIMENSION || newH > MAX_ALLOWED_DIMENSION) {
        capped = true;
        const scale = Math.min(MAX_ALLOWED_DIMENSION / newW, MAX_ALLOWED_DIMENSION / newH);
        newW = Math.round(newW * scale);
        newH = Math.round(newH * scale);
      }

      // 2. Megapixel total area check
      const mp = (newW * newH) / 1000000;
      if (mp > MAX_ALLOWED_MEGAPIXELS) {
        capped = true;
        const scale = Math.sqrt((MAX_ALLOWED_MEGAPIXELS * 1000000) / (newW * newH));
        newW = Math.round(newW * scale);
        newH = Math.round(newH * scale);
      }

      return { w: Math.max(1, newW), h: Math.max(1, newH), capped };
    },
    []
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // File validation: empty or invalid file check
      if (file.size === 0) {
        setErrorMsg("Selected file is empty (0 bytes). Please upload a valid image.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrorMsg("Selected file is not a supported image format.");
        return;
      }

      cleanupObjectUrl();
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setImageSrc(url);

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        imgRef.current = img;
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);

        const initialW = Math.round(img.width * 2);
        const initialH = Math.round(img.height * 2);
        const clamped = clampDimensions(initialW, initialH);

        setTargetWidth(clamped.w);
        setTargetHeight(clamped.h);
        setIsCapped(clamped.capped);
        setScaleFactor(Number((clamped.w / (img.width || 1)).toFixed(2)));
      };

      img.onerror = () => {
        setErrorMsg("Failed to decode image file. File may be corrupted.");
        setImageSrc(null);
      };

      img.src = url;
    }
  };

  const updateScaleFactor = (factor: number) => {
    if (originalWidth && originalHeight) {
      const rawW = Math.round(originalWidth * factor);
      const rawH = Math.round(originalHeight * factor);
      const clamped = clampDimensions(rawW, rawH);
      setTargetWidth(clamped.w);
      setTargetHeight(clamped.h);
      setIsCapped(clamped.capped);
      setScaleFactor(Number((clamped.w / originalWidth).toFixed(2)));
    } else {
      setScaleFactor(factor);
    }
  };

  const handleWidthChange = (val: number) => {
    if (val <= 0) return;
    let newH = targetHeight;
    if (lockAspectRatio && originalWidth > 0 && originalHeight > 0) {
      newH = Math.round((val / originalWidth) * originalHeight);
    }
    const clamped = clampDimensions(val, newH);
    setTargetWidth(clamped.w);
    setTargetHeight(clamped.h);
    setIsCapped(clamped.capped);
    setScaleFactor(Number((clamped.w / (originalWidth || 1)).toFixed(2)));
  };

  const handleHeightChange = (val: number) => {
    if (val <= 0) return;
    let newW = targetWidth;
    if (lockAspectRatio && originalWidth > 0 && originalHeight > 0) {
      newW = Math.round((val / originalHeight) * originalWidth);
    }
    const clamped = clampDimensions(newW, val);
    setTargetWidth(clamped.w);
    setTargetHeight(clamped.h);
    setIsCapped(clamped.capped);
    setScaleFactor(Number((clamped.w / (originalWidth || 1)).toFixed(2)));
  };

  // Fast 3x3 Unsharp Mask Convolution Filter
  const applyConvolutionSharpen = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    amount: number
  ) => {
    if (amount <= 0 || width <= 0 || height <= 0) return;
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const copy = new Uint8ClampedArray(data);

      const k = (amount / 100) * 0.35;
      const w = width;
      const h = height;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;

          for (let c = 0; c < 3; c++) {
            const top = copy[((y - 1) * w + x) * 4 + c];
            const bottom = copy[((y + 1) * w + x) * 4 + c];
            const left = copy[(y * w + (x - 1)) * 4 + c];
            const right = copy[(y * w + (x + 1)) * 4 + c];
            const center = copy[idx + c];

            const val = center * (1 + 4 * k) - k * (top + bottom + left + right);
            data[idx + c] = Math.min(255, Math.max(0, val));
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
    } catch (e) {
      console.warn("Sharpening convolution skipped due to browser memory limits", e);
    }
  };

  // Process and Render Upscaled Canvas with explicit memory cleanup
  const processImage = useCallback(() => {
    const img = imgRef.current;
    if (!img || !canvasRef.current || targetWidth <= 0 || targetHeight <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Color adjustments filter
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

      if (scalingMode === "pixel") {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      } else {
        // Step-scaling (multi-pass) resampling
        let curW = img.width;
        let curH = img.height;
        let tempCanvas: HTMLCanvasElement | null = document.createElement("canvas");
        tempCanvas.width = curW;
        tempCanvas.height = curH;
        let tempCtx = tempCanvas.getContext("2d")!;
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = "high";
        tempCtx.drawImage(img, 0, 0);

        while (curW * 1.5 < targetWidth || curH * 1.5 < targetHeight) {
          const nextW = Math.min(targetWidth, Math.round(curW * 1.5));
          const nextH = Math.min(targetHeight, Math.round(curH * 1.5));

          const stepCanvas = document.createElement("canvas");
          stepCanvas.width = nextW;
          stepCanvas.height = nextH;
          const stepCtx = stepCanvas.getContext("2d")!;
          stepCtx.imageSmoothingEnabled = true;
          stepCtx.imageSmoothingQuality = "high";
          stepCtx.drawImage(tempCanvas, 0, 0, nextW, nextH);

          // Clean up old step canvas backing memory
          tempCanvas.width = 0;
          tempCanvas.height = 0;

          tempCanvas = stepCanvas;
          curW = nextW;
          curH = nextH;
        }

        ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);

        // Explicit memory cleanup for offscreen canvas
        tempCanvas.width = 0;
        tempCanvas.height = 0;
        tempCanvas = null;
      }

      ctx.filter = "none";

      // Detail sharpening
      if (sharpness > 0) {
        applyConvolutionSharpen(ctx, targetWidth, targetHeight, sharpness);
      }

      // Render 1x original overlay canvas preview
      if (originalCanvasRef.current) {
        const origCanvas = originalCanvasRef.current;
        origCanvas.width = targetWidth;
        origCanvas.height = targetHeight;
        const origCtx = origCanvas.getContext("2d");
        if (origCtx) {
          origCtx.imageSmoothingEnabled = true;
          origCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
        }
      }

      setIsProcessing(false);
    }, 20);
  }, [
    targetWidth,
    targetHeight,
    scalingMode,
    sharpness,
    brightness,
    contrast,
    saturation,
  ]);

  useEffect(() => {
    if (imageSrc) {
      processImage();
    }
  }, [imageSrc, processImage]);

  const resetAll = () => {
    if (originalWidth && originalHeight) {
      const clamped = clampDimensions(originalWidth * 2, originalHeight * 2);
      setTargetWidth(clamped.w);
      setTargetHeight(clamped.h);
      setIsCapped(clamped.capped);
      setScaleFactor(Number((clamped.w / originalWidth).toFixed(2)));
    }
    setScalingMode("multipass");
    setSharpness(30);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const handleClearImage = () => {
    cleanupObjectUrl();
    if (canvasRef.current) {
      canvasRef.current.width = 0;
      canvasRef.current.height = 0;
    }
    if (originalCanvasRef.current) {
      originalCanvasRef.current.width = 0;
      originalCanvasRef.current.height = 0;
    }
    imgRef.current = null;
    setImageSrc(null);
    setErrorMsg(null);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mimeType = `image/${format}`;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `imagrow_${targetWidth}x${targetHeight}.${format}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      mimeType,
      quality / 100
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-1 sm:px-0">
      {/* Upload Header */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-6 shadow-xs text-center space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800 text-xs font-bold">
              Dismiss
            </button>
          </div>
        )}

        {!imageSrc ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all focus-within:ring-2 focus-within:ring-orange-500">
            <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload Image to ImaGrow Upscaler</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Upscale photos to 2x, 4x, 8x HD/4K resolutions with multi-pass step resampling & detail sharpening.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload Image to ImaGrow Upscaler"
            />
          </label>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-orange-50/70 border border-orange-200 rounded-xl gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg border border-orange-300 overflow-hidden bg-white flex items-center justify-center p-1 shrink-0">
                <img src={imageSrc} alt="Source" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-orange-600" />
                  <span>Original: {originalWidth} × {originalHeight} px</span>
                </h4>
                <p className="text-[10px] text-zinc-500">
                  Target Resolution: <strong className="text-orange-600 font-bold">{targetWidth} × {targetHeight} px</strong> ({scaleFactor}x Growth)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label className="cursor-pointer">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace Photo</span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Replace Photo"
                />
              </label>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearImage}
                className="text-xs text-zinc-500 hover:text-red-600"
                aria-label="Clear Photo"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      {isCapped && imageSrc && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Memory Safety Cap Active:</strong> Output resolution was clamped to max 8192px / 36MP to prevent browser memory crashes on large scale factors.
          </span>
        </div>
      )}

      {imageSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Upscaling Multipliers */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>ImaGrow Scale Multipliers</span>
                </h3>
                <Button size="sm" variant="ghost" onClick={resetAll} className="text-xs gap-1 text-zinc-500" aria-label="Reset Settings">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </Button>
              </div>

              {/* Quick Multipliers */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700">Quick Scale Factor:</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1.5, 2, 3, 4, 8].map((factor) => (
                    <button
                      key={factor}
                      onClick={() => updateScaleFactor(factor)}
                      aria-pressed={scaleFactor === factor}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                        scaleFactor === factor
                          ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                          : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {factor}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Resolution Inputs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700">Target Dimensions (px):</label>
                  <button
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    aria-pressed={lockAspectRatio}
                    className="flex items-center gap-1 text-[11px] font-medium text-orange-600 hover:underline"
                  >
                    {lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{lockAspectRatio ? "Locked Ratio" : "Free Form"}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-semibold">Width:</span>
                    <Input
                      type="number"
                      value={targetWidth || ""}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="text-xs font-mono"
                      aria-label="Target Width in pixels"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-semibold">Height:</span>
                    <Input
                      type="number"
                      value={targetHeight || ""}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="text-xs font-mono"
                      aria-label="Target Height in pixels"
                    />
                  </div>
                </div>
              </div>

              {/* Resampling Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700">Resampling Algorithm:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "multipass", label: "Multi-Pass Smooth" },
                    { key: "bilinear", label: "Bilinear Soft" },
                    { key: "pixel", label: "Pixel Art" },
                  ].map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setScalingMode(m.key as ScalingMode)}
                      aria-pressed={scalingMode === m.key}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                        scalingMode === m.key
                          ? "bg-zinc-900 text-white border-zinc-900 font-bold"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sharpening & Clarity Controls */}
              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      <span>Detail Sharpening / Clarity:</span>
                    </span>
                    <span className="font-mono text-orange-600">{sharpness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sharpness}
                    onChange={(e) => setSharpness(Number(e.target.value))}
                    className="w-full accent-orange-500"
                    aria-label="Detail Sharpening percentage"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-600">Brightness: {brightness}%</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-orange-500"
                      aria-label="Brightness percentage"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-600">Contrast: {contrast}%</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-orange-500"
                      aria-label="Contrast percentage"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-600">Saturate: {saturation}%</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full accent-orange-500"
                      aria-label="Saturation percentage"
                    />
                  </div>
                </div>
              </div>

              {/* Export Panel */}
              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700">Export Format:</label>
                  <div className="flex items-center gap-1">
                    {(["png", "webp", "jpeg"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        aria-pressed={format === f}
                        className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${
                          format === f ? "bg-orange-500 text-white border-orange-500" : "bg-zinc-100 text-zinc-600 border-zinc-200"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {format !== "png" && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Quality: {quality}%</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-orange-500"
                      aria-label="Export Quality percentage"
                    />
                  </div>
                )}

                <Button
                  onClick={downloadImage}
                  variant="default"
                  className="w-full h-11 text-xs font-bold gap-2 shadow-xs bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {targetWidth}×{targetHeight} {format.toUpperCase()}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Before / After Canvas Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-3 gap-2">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-orange-500" />
                  <span>ImaGrow Live Comparison View</span>
                </h3>
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
                  {[
                    { key: "split", label: "Split Comparison", icon: Split },
                    { key: "enhanced", label: "Upscaled", icon: Sparkles },
                    { key: "original", label: "Original 1x", icon: Layers },
                  ].map((v) => {
                    const IconComp = v.icon;
                    return (
                      <button
                        key={v.key}
                        onClick={() => setViewMode(v.key as typeof viewMode)}
                        aria-pressed={viewMode === v.key}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 capitalize transition-all ${
                          viewMode === v.key ? "bg-white text-zinc-900 shadow-2xs font-bold" : "text-zinc-500"
                        }`}
                      >
                        <IconComp className="w-3 h-3" />
                        <span>{v.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Canvas Comparison Container */}
              <div className="relative bg-zinc-900 rounded-xl overflow-hidden min-h-96 flex items-center justify-center shadow-inner group">
                <canvas ref={originalCanvasRef} className="hidden" />
                <div className="relative max-w-full max-h-[500px] overflow-auto flex items-center justify-center p-2">
                  {/* Result Canvas */}
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto rounded-lg shadow-lg block"
                    style={{
                      clipPath:
                        viewMode === "split"
                          ? `polygon(${splitPos}% 0, 100% 0, 100% 100%, ${splitPos}% 100%)`
                          : viewMode === "original"
                          ? "polygon(0 0, 0 0, 0 0, 0 0)"
                          : "none",
                    }}
                  />

                  {/* Original Image Canvas Overlay for Split Mode */}
                  {viewMode === "split" && (
                    <div
                      className="absolute inset-0 p-2 flex items-center justify-center pointer-events-none"
                      style={{
                        clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)`,
                      }}
                    >
                      <img
                        src={imageSrc}
                        alt="Original"
                        className="max-w-full max-h-[500px] h-auto rounded-lg object-contain"
                      />
                    </div>
                  )}

                  {/* Split Divider Slider Line */}
                  {viewMode === "split" && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-20 pointer-events-none flex items-center justify-center"
                      style={{ left: `${splitPos}%` }}
                    >
                      <div className="w-7 h-7 rounded-full bg-orange-500 text-white shadow-md flex items-center justify-center border-2 border-white text-[10px] font-bold">
                        ↔
                      </div>
                    </div>
                  )}
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-30">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold text-zinc-800">
                      <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
                      <span>Resampling & Sharpening...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Split Slider Range Drag Control */}
              {viewMode === "split" && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                    <span>Original ({originalWidth}x{originalHeight})</span>
                    <span>Interactive Comparison Slider ({splitPos}%)</span>
                    <span className="text-orange-600 font-bold">ImaGrow {scaleFactor}x ({targetWidth}x{targetHeight})</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={splitPos}
                    onChange={(e) => setSplitPos(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-ew-resize"
                    aria-label="Interactive comparison position"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
