"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  QrCode,
  Download,
  Copy,
  Check,
  Settings,
  Eye,
  Sliders,
  Sparkles,
} from "lucide-react";

export const BarcodeGeneratorTool: React.FC = () => {
  const [text, setText] = useState("C0DE39TEST");
  const [format, setFormat] = useState<"CODE128" | "EAN13" | "UPC" | "CODE39" | "CODE93" | "ISBN">("CODE39");
  const [barHeight, setBarHeight] = useState(80);
  const [barWidth, setBarWidth] = useState(2);
  const [fontSize, setFontSize] = useState(14);
  const [fgColor, setFgColor] = useState("#18181B");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render barcode pattern on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.max(300, text.length * barWidth * 20);
    canvas.height = barHeight + fontSize + 40;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Barcode Lines algorithm
    ctx.fillStyle = fgColor;
    const startX = 30;
    let currentX = startX;

    // Guard pattern
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      for (let bit = 0; bit < 8; bit++) {
        const isBar = (charCode & (1 << bit)) !== 0;
        if (isBar) {
          ctx.fillRect(currentX, 20, barWidth, barHeight);
        }
        currentX += barWidth * 1.5;
      }
      currentX += barWidth * 2;
    }

    // Draw text label below barcode
    ctx.fillStyle = fgColor;
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, barHeight + 35);
  }, [text, format, barHeight, barWidth, fontSize, fgColor, bgColor]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = `barcode_${text}.png`;
    a.click();
  };

  const downloadSvg = () => {
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="${barHeight + 60}"><rect width="100%" height="100%" fill="${bgColor}"/><text x="200" y="${barHeight + 40}" text-anchor="middle" font-family="monospace" font-size="${fontSize}" fill="${fgColor}">${text}</text></svg>`;
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode_${text}.svg`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Input Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Barcode Text String:</label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or number..."
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Barcode Symbology:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-orange-500/40"
            >
              {(["CODE128", "EAN13", "UPC", "CODE39", "CODE93", "ISBN"] as const).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appearance Controls */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-orange-500" />
            <span>Dimension & Color Customization</span>
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Height: {barHeight}px</label>
              <input
                type="range"
                min="40"
                max="160"
                value={barHeight}
                onChange={(e) => setBarHeight(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Bar Thickness: {barWidth}px</label>
              <input
                type="range"
                min="1"
                max="5"
                value={barWidth}
                onChange={(e) => setBarWidth(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Font Size: {fontSize}px</label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Bar Color:</label>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Background:</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={downloadPng} variant="default" className="text-xs font-bold gap-1.5">
              <Download className="w-4 h-4" />
              <span>PNG Image</span>
            </Button>
            <Button onClick={downloadSvg} variant="outline" className="text-xs font-bold gap-1.5">
              <Download className="w-4 h-4" />
              <span>SVG Vector</span>
            </Button>
          </div>
        </div>

        {/* Live Canvas Barcode Preview Sheet */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-orange-500" />
            <span>High-Resolution Barcode Canvas</span>
          </h3>

          <div className="bg-zinc-100 p-8 rounded-xl flex items-center justify-center overflow-auto min-h-64 shadow-inner">
            <canvas ref={canvasRef} className="rounded-lg shadow-md max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
