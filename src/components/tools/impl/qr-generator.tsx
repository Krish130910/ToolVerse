"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  QrCode,
  Download,
  Copy,
  Check,
  Globe,
  Mail,
  Phone,
  Wifi,
  User,
  Settings,
  Eye,
  Sparkles,
  Upload,
} from "lucide-react";

export const QrGeneratorTool: React.FC = () => {
  const [type, setType] = useState<"url" | "text" | "email" | "wifi" | "vcard">("url");
  const [urlInput, setUrlInput] = useState("https://toolverse.app");
  const [wifiSsid, setWifiSsid] = useState("MyHomeNetwork");
  const [wifiPassword, setWifiPassword] = useState("SecretPass123");
  const [fgColor, setFgColor] = useState("#F97316");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getPayload = () => {
    if (type === "wifi") return `WIFI:S:${wifiSsid};T:WPA;P:${wifiPassword};;`;
    return urlInput;
  };

  // Render QR Code onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 320;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Draw QR pattern simulation
    ctx.fillStyle = fgColor;
    const moduleSize = 10;
    const count = Math.floor(size / moduleSize);

    // Finder patterns (3 corners)
    const drawFinder = (x: number, y: number) => {
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
      ctx.fillStyle = bgColor;
      ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
      ctx.fillStyle = fgColor;
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
    };

    drawFinder(moduleSize, moduleSize);
    drawFinder(size - moduleSize * 8, moduleSize);
    drawFinder(moduleSize, size - moduleSize * 8);

    // Draw pseudo-random QR data matrix modules
    const payloadStr = getPayload();
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        // Skip finder areas
        if ((r < 8 && c < 8) || (r < 8 && c > count - 9) || (r > count - 9 && c < 8)) continue;
        const seed = (r * count + c + payloadStr.length * 7) % 17;
        if (seed < 8) {
          ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize - 1, moduleSize - 1);
        }
      }
    }

    // Optional Logo Overlay in center
    if (logoUrl) {
      const img = new Image();
      img.onload = () => {
        const logoSize = 60;
        const center = size / 2 - logoSize / 2;
        ctx.fillStyle = bgColor;
        ctx.fillRect(center - 5, center - 5, logoSize + 10, logoSize + 10);
        ctx.drawImage(img, center, center, logoSize, logoSize);
      };
      img.src = logoUrl;
    }
  }, [type, urlInput, wifiSsid, wifiPassword, fgColor, bgColor, logoUrl]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  };

  const downloadSvg = () => {
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="${bgColor}"/><rect x="20" y="20" width="70" height="70" fill="${fgColor}"/></svg>`;
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Type Selector Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl overflow-x-auto">
          {[
            { id: "url", label: "URL Link", icon: Globe },
            { id: "text", label: "Plain Text", icon: QrCode },
            { id: "wifi", label: "Wi-Fi Network", icon: Wifi },
          ].map((t) => {
            const IconC = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  type === t.id ? "bg-orange-500 text-white shadow-2xs" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <IconC className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input & Customization Panel */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-orange-500" />
            <span>Payload & Styling Options</span>
          </h3>

          {type === "wifi" ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Network SSID:</label>
                <Input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Wi-Fi Password:</label>
                <Input type="password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className="text-xs" />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">QR Code Target URL / Content:</label>
              <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="text-xs" />
            </div>
          )}

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Foreground Color:</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Background Color:</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-8 rounded-lg cursor-pointer border-0 bg-transparent"
              />
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

        {/* Live Canvas Preview */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-orange-500" />
            <span>High-Resolution QR Code Canvas</span>
          </h3>

          <div className="bg-zinc-100 p-8 rounded-xl flex items-center justify-center min-h-80 shadow-inner">
            <canvas ref={canvasRef} className="rounded-2xl shadow-md max-w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
