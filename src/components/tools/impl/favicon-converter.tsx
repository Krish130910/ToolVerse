"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  Settings,
  Grid,
  Copy,
  Check,
  Package,
  Globe,
  Sparkles,
  RefreshCw,
  FileWarning,
} from "lucide-react";

type FitMode = "contain" | "cover" | "stretch";

export const FaviconConverterTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 64, 128, 256]);
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [bgColor, setBgColor] = useState<string>("transparent");
  const [isGeneratingIco, setIsGeneratingIco] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [previewBg, setPreviewBg] = useState<"light" | "dark" | "grid">("grid");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Clean up Object URL memory
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size === 0) {
        setErrorMsg("Selected file is empty (0 bytes). Please upload a valid image file.");
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
        loadedImgRef.current = img;
      };
      img.onerror = () => {
        setErrorMsg("Failed to decode image file. File may be corrupted.");
        setImageSrc(null);
      };
      img.src = url;
    }
  };

  const handleClearImage = () => {
    cleanupObjectUrl();
    loadedImgRef.current = null;
    setImageSrc(null);
    setErrorMsg(null);
  };

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const selectAllSizes = () => setSelectedSizes([16, 32, 48, 64, 128, 256]);
  const deselectAllSizes = () => setSelectedSizes([16, 32]);

  // Helper to render image onto canvas with specified dimensions, scaling, and background color
  const renderToCanvas = useCallback(
    (img: HTMLImageElement, size: number, mode: FitMode, bg: string): HTMLCanvasElement => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return canvas;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      if (bg && bg !== "transparent") {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, size, size);
      } else {
        ctx.clearRect(0, 0, size, size);
      }

      const srcW = img.width || size;
      const srcH = img.height || size;

      if (mode === "stretch") {
        ctx.drawImage(img, 0, 0, size, size);
      } else if (mode === "contain") {
        const scale = Math.min(size / srcW, size / srcH);
        const drawW = srcW * scale;
        const drawH = srcH * scale;
        const dx = (size - drawW) / 2;
        const dy = (size - drawH) / 2;
        ctx.drawImage(img, dx, dy, drawW, drawH);
      } else {
        // cover
        const scale = Math.max(size / srcW, size / srcH);
        const drawW = srcW * scale;
        const drawH = srcH * scale;
        const dx = (size - drawW) / 2;
        const dy = (size - drawH) / 2;
        ctx.drawImage(img, dx, dy, drawW, drawH);
      }

      return canvas;
    },
    []
  );

  // Real Binary ICO Encoder
  const createIcoBlob = async (
    canvasList: { size: number; canvas: HTMLCanvasElement }[]
  ): Promise<Blob> => {
    const imagesData: { size: number; bytes: Uint8Array }[] = [];

    for (const item of canvasList) {
      const blob = await new Promise<Blob | null>((resolve) =>
        item.canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (!blob) continue;
      const arrayBuffer = await blob.arrayBuffer();
      imagesData.push({
        size: item.size,
        bytes: new Uint8Array(arrayBuffer),
      });
    }

    if (imagesData.length === 0) {
      throw new Error("No image data generated for ICO binary.");
    }

    const numImages = imagesData.length;
    const headerSize = 6 + 16 * numImages;
    const totalDataSize = imagesData.reduce((acc, img) => acc + img.bytes.length, 0);
    const totalFileSize = headerSize + totalDataSize;

    const buffer = new ArrayBuffer(totalFileSize);
    const view = new DataView(buffer);
    const uint8View = new Uint8Array(buffer);

    // ICONDIR Header
    view.setUint16(0, 0, true); // Reserved
    view.setUint16(2, 1, true); // Type 1 = ICO
    view.setUint16(4, numImages, true); // Number of images

    let dirOffset = 6;
    let dataOffset = headerSize;

    for (const img of imagesData) {
      const wByte = img.size >= 256 ? 0 : img.size;
      const hByte = img.size >= 256 ? 0 : img.size;

      view.setUint8(dirOffset, wByte);
      view.setUint8(dirOffset + 1, hByte);
      view.setUint8(dirOffset + 2, 0); // Color count
      view.setUint8(dirOffset + 3, 0); // Reserved
      view.setUint16(dirOffset + 4, 1, true); // Color planes
      view.setUint16(dirOffset + 5, 32, true); // Bits per pixel
      view.setUint32(dirOffset + 6, img.bytes.length, true); // Image data size
      view.setUint32(dirOffset + 10, dataOffset, true); // Data offset

      uint8View.set(img.bytes, dataOffset);

      dirOffset += 16;
      dataOffset += img.bytes.length;
    }

    return new Blob([buffer], { type: "image/x-icon" });
  };

  const downloadIco = async () => {
    if (!imageSrc) return;
    setIsGeneratingIco(true);

    try {
      let img = loadedImgRef.current;
      if (!img) {
        img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((res) => {
          img!.onload = res;
          img!.src = imageSrc;
        });
      }

      const sizesToInclude = selectedSizes.length > 0 ? selectedSizes : [16, 32, 48, 64];
      const icoCanvases = sizesToInclude.map((size) => ({
        size,
        canvas: renderToCanvas(img!, size, fitMode, bgColor),
      }));

      const icoBlob = await createIcoBlob(icoCanvases);
      const url = URL.createObjectURL(icoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "favicon.ico";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Failed to generate binary ICO:", err);
      setErrorMsg("Failed to encode binary ICO file.");
    } finally {
      setIsGeneratingIco(false);
    }
  };

  const downloadPng = async (size: number) => {
    if (!imageSrc) return;
    let img = loadedImgRef.current;
    if (!img) {
      img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((res) => {
        img!.onload = res;
        img!.src = imageSrc;
      });
    }

    const canvas = renderToCanvas(img, size, fitMode, bgColor);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `favicon-${size}x${size}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  };

  const downloadZipPackage = async () => {
    if (!imageSrc) return;
    setIsGeneratingZip(true);

    try {
      let img = loadedImgRef.current;
      if (!img) {
        img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((res) => {
          img!.onload = res;
          img!.src = imageSrc;
        });
      }

      const zip = new JSZip();

      // 1. favicon.ico
      const icoSizes = [16, 32, 48, 64, 128, 256].filter((s) => selectedSizes.includes(s));
      const activeSizes = icoSizes.length > 0 ? icoSizes : [16, 32, 48];
      const icoCanvases = activeSizes.map((size) => ({
        size,
        canvas: renderToCanvas(img, size, fitMode, bgColor),
      }));
      const icoBlob = await createIcoBlob(icoCanvases);
      zip.file("favicon.ico", icoBlob);

      // 2. Standard Web PNG Sizes
      const pngTargets = [
        { name: "favicon-16x16.png", size: 16 },
        { name: "favicon-32x32.png", size: 32 },
        { name: "favicon-48x48.png", size: 48 },
        { name: "apple-touch-icon.png", size: 180 },
        { name: "android-chrome-192x192.png", size: 192 },
        { name: "android-chrome-512x512.png", size: 512 },
      ];

      for (const target of pngTargets) {
        const c = renderToCanvas(img, target.size, fitMode, bgColor);
        const b = await new Promise<Blob | null>((res) => c.toBlob((blob) => res(blob), "image/png"));
        if (b) zip.file(target.name, b);
      }

      // 3. Web App Manifest
      const manifestData = {
        name: "My Web Application",
        short_name: "App",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
        theme_color: bgColor === "transparent" ? "#ffffff" : bgColor,
        background_color: bgColor === "transparent" ? "#ffffff" : bgColor,
        display: "standalone",
      };
      zip.file("site.webmanifest", JSON.stringify(manifestData, null, 2));

      // 4. HTML Head Tags
      const htmlSnippet = `<!-- Copy and paste these tags into your HTML <head> section -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`;
      zip.file("head-tags.html", htmlSnippet);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "favicon-package.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("ZIP package generation failed:", err);
      setErrorMsg("Failed to generate ZIP package.");
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const htmlHeadCode = `<!-- Web Favicon HTML Tags -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlHeadCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-1 sm:px-0">
      {/* Upload Box */}
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
            <h3 className="text-base font-bold text-zinc-900">Upload Image for Favicon</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Supports PNG, JPG, WEBP, SVG. Generates standard binary ICO & multi-resolution PNG packages.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload Image for Favicon"
            />
          </label>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-orange-50/70 border border-orange-200 rounded-xl gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg border border-orange-300 overflow-hidden bg-white flex items-center justify-center p-1 shrink-0">
                <img src={imageSrc} alt="Favicon Source" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Source Image Uploaded</span>
                </h4>
                <p className="text-[10px] text-zinc-500">
                  Ready to convert to ICO & web favicon packages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label className="cursor-pointer">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace Image</span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Replace Image"
                />
              </label>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearImage}
                className="text-xs text-zinc-500 hover:text-red-600"
                aria-label="Clear Image"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      {imageSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings & Configuration Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Options Panel */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-orange-500" />
                <span>Conversion Settings</span>
              </h3>

              {/* Target Sizes Checkboxes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700">Target ICO Sizes:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={selectAllSizes}
                      className="text-[10px] font-semibold text-orange-600 hover:underline"
                    >
                      All
                    </button>
                    <span className="text-[10px] text-zinc-300">|</span>
                    <button
                      onClick={deselectAllSizes}
                      className="text-[10px] font-semibold text-zinc-500 hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[16, 32, 48, 64, 128, 256].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      aria-pressed={selectedSizes.includes(s)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                        selectedSizes.includes(s)
                          ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {s}x{s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700">Scaling / Fit Mode:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["contain", "cover", "stretch"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFitMode(mode)}
                      aria-pressed={fitMode === mode}
                      className={`py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                        fitMode === mode
                          ? "bg-zinc-900 text-white border-zinc-900 font-bold"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color Fill */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700">Background Fill:</label>
                <div className="flex items-center gap-2">
                  {[
                    { label: "Transparent", value: "transparent", color: "bg-zinc-100 border-zinc-300" },
                    { label: "White", value: "#ffffff", color: "bg-white border-zinc-300" },
                    { label: "Dark", value: "#0f172a", color: "bg-slate-900 border-slate-900" },
                  ].map((bg) => (
                    <button
                      key={bg.value}
                      onClick={() => setBgColor(bg.value)}
                      aria-pressed={bgColor === bg.value}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1.5 transition-all ${
                        bgColor === bg.value
                          ? "ring-2 ring-orange-500 border-orange-500 font-bold"
                          : "border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full border ${bg.color}`} />
                      <span>{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Download Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={downloadIco}
                  disabled={isGeneratingIco || selectedSizes.length === 0}
                  variant="default"
                  className="w-full h-11 text-xs font-bold gap-2 shadow-xs bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingIco ? "Generating Binary ICO..." : "Download favicon.ico Binary"}</span>
                </Button>

                <Button
                  onClick={downloadZipPackage}
                  disabled={isGeneratingZip}
                  variant="outline"
                  className="w-full h-11 text-xs font-bold gap-2 border-zinc-300 hover:bg-zinc-50 text-zinc-800 disabled:opacity-50"
                >
                  <Package className="w-4 h-4 text-orange-500" />
                  <span>{isGeneratingZip ? "Building ZIP Bundle..." : "Download Complete Favicon ZIP"}</span>
                </Button>
              </div>
            </div>

            {/* Simulated Browser Tab Live Preview */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-500" />
                <span>Browser Tab Live Preview</span>
              </h4>

              <div className="bg-zinc-800 p-3 rounded-xl">
                <div className="bg-zinc-700/80 rounded-t-lg p-2 flex items-center gap-2 max-w-xs">
                  <div className="w-4 h-4 rounded-sm flex items-center justify-center overflow-hidden bg-white/10 shrink-0">
                    <img src={imageSrc} alt="Tab Icon" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-zinc-200 font-medium truncate flex-1">
                    My Web Application
                  </span>
                  <span className="text-zinc-400 text-xs hover:text-zinc-200 cursor-pointer">×</span>
                </div>
                <div className="bg-zinc-900 h-6 rounded-b-lg border-t border-zinc-700 flex items-center px-3 text-[10px] text-zinc-500 font-mono">
                  https://example.com
                </div>
              </div>
            </div>
          </div>

          {/* Previews & Code Snippet Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Favicon Previews Grid */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Grid className="w-4 h-4 text-orange-500" />
                  <span>Generated Icon Previews</span>
                </h3>
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
                  {(["grid", "light", "dark"] as const).map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setPreviewBg(bg)}
                      className={`px-2 py-0.5 text-[10px] font-medium capitalize rounded ${
                        previewBg === bg ? "bg-white text-zinc-900 shadow-2xs font-bold" : "text-zinc-500"
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {selectedSizes.map((s) => {
                  const displaySize = Math.min(s, 64);
                  return (
                    <div
                      key={s}
                      className="p-3 sm:p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-col items-center space-y-3 transition-all hover:border-orange-300"
                    >
                      <div
                        className={`flex items-center justify-center p-3 rounded-xl border border-zinc-200/90 shadow-2xs transition-all ${
                          previewBg === "dark"
                            ? "bg-slate-900 border-slate-800"
                            : previewBg === "light"
                            ? "bg-white"
                            : "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] bg-white"
                        }`}
                        style={{ width: 76, height: 76 }}
                      >
                        <div
                          style={{
                            width: displaySize,
                            height: displaySize,
                            backgroundColor: bgColor === "transparent" ? undefined : bgColor,
                          }}
                          className="flex items-center justify-center rounded-sm overflow-hidden"
                        >
                          <img
                            src={imageSrc}
                            alt={`${s}x${s}`}
                            className={`w-full h-full ${
                              fitMode === "stretch"
                                ? "object-fill"
                                : fitMode === "cover"
                                ? "object-cover"
                                : "object-contain"
                            }`}
                          />
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-zinc-700">{s} x {s} px</span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPng(s)}
                        className="w-full text-xs font-semibold gap-1 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                      >
                        <Download className="w-3 h-3" />
                        <span>PNG</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HTML Link Tags Snippet */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>HTML Header Embed Snippet</span>
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="text-xs font-semibold gap-1.5"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy HTML</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner">
                <pre>{htmlHeadCode}</pre>
              </div>

              <p className="text-[11px] text-zinc-500">
                Place these tags inside your site&apos;s <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-700 font-mono">&lt;head&gt;</code> element to ensure icons load properly across all desktop browsers, iOS, and Android devices.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
