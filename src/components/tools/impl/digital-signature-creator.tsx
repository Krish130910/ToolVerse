"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KeyRound,
  Download,
  Trash2,
  PenTool,
  Type,
  Upload,
  Settings,
  Eye,
  Check,
  Sparkles,
} from "lucide-react";

export const DigitalSignatureCreatorTool: React.FC = () => {
  const [tab, setTab] = useState<"draw" | "type" | "upload">("draw");
  const [typedName, setTypedName] = useState("Alex Harrison");
  const [typedFont, setTypedFont] = useState("font-serif italic");
  const [penColor, setPenColor] = useState("#18181B");
  const [penWidth, setPenWidth] = useState(3);
  const [transparentBg, setTransparentBg] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  // Canvas drawing handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 240;

    if (!transparentBg) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [transparentBg, tab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!transparentBg) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setUploadedImage(url);
    }
  };

  const downloadPng = () => {
    if (tab === "draw" && canvasRef.current) {
      const a = document.createElement("a");
      a.href = canvasRef.current.toDataURL("image/png");
      a.download = "signature.png";
      a.click();
    } else if (tab === "type") {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (!transparentBg) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.fillStyle = penColor;
        ctx.font = "italic 48px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(typedName, 300, 120);
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "typed_signature.png";
        a.click();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("draw")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "draw" ? "bg-orange-500 text-white shadow-2xs" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Draw Signature</span>
          </button>
          <button
            onClick={() => setTab("type")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "type" ? "bg-orange-500 text-white shadow-2xs" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Type Signature</span>
          </button>
          <button
            onClick={() => setTab("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "upload" ? "bg-orange-500 text-white shadow-2xs" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Options */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
          <input
            type="checkbox"
            checked={transparentBg}
            onChange={(e) => setTransparentBg(e.target.checked)}
            className="rounded text-orange-500 focus:ring-orange-500"
          />
          <span>Transparent Background</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-orange-500" />
            <span>Signature Controls</span>
          </h3>

          {tab === "draw" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Pen Thickness: {penWidth}px</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={penWidth}
                  onChange={(e) => setPenWidth(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Ink Color:</label>
                <input
                  type="color"
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
              </div>

              <Button onClick={clearCanvas} variant="outline" className="w-full text-xs font-bold gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
                <span>Clear Drawing Pad</span>
              </Button>
            </div>
          )}

          {tab === "type" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Your Full Name:</label>
                <Input
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter name..."
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Ink Color:</label>
                <input
                  type="color"
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>
          )}

          {tab === "upload" && (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-orange-200 bg-orange-50/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer">
                <Upload className="w-6 h-6 text-orange-500 mb-2" />
                <span className="text-xs font-bold text-zinc-900">Upload Image File</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          )}

          <Button onClick={downloadPng} variant="default" className="w-full h-11 text-xs font-bold gap-2 shadow-xs">
            <Download className="w-4 h-4" />
            <span>Download Signature (PNG)</span>
          </Button>
        </div>

        {/* Live Canvas / Preview Sheet */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-orange-500" />
            <span>Signature Preview Pad</span>
          </h3>

          <div className="bg-zinc-100 p-8 rounded-xl flex items-center justify-center min-h-64 shadow-inner">
            {tab === "draw" && (
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="bg-white border border-zinc-300 rounded-xl shadow-md cursor-crosshair max-w-full"
              />
            )}

            {tab === "type" && (
              <div
                style={{ color: penColor }}
                className="p-10 rounded-xl bg-white border border-zinc-300 shadow-md font-serif italic text-4xl sm:text-5xl text-center min-w-80"
              >
                {typedName || "Your Signature"}
              </div>
            )}

            {tab === "upload" && uploadedImage && (
              <img src={uploadedImage} alt="Uploaded Signature" className="max-h-48 rounded-lg shadow-md" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
