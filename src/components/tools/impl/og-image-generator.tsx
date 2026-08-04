"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Sparkles, Image as ImageIcon, Sliders, RefreshCw } from "lucide-react";

const THEMES = [
  { id: "orange", label: "ToolVerse Orange", bg1: "#EA580C", bg2: "#9A3412", text: "#FFFFFF", badgeBg: "rgba(255, 255, 255, 0.2)", badgeText: "#FFFFFF" },
  { id: "dark", label: "Dark Slate", bg1: "#18181B", bg2: "#09090B", text: "#FAFAFA", badgeBg: "#EA580C", badgeText: "#FFFFFF" },
  { id: "cyber", label: "Emerald Cyber", bg1: "#064E3B", bg2: "#022C22", text: "#ECFDF5", badgeBg: "#10B981", badgeText: "#064E3B" },
  { id: "sapphire", label: "Sapphire Blue", bg1: "#1E3A8A", bg2: "#172554", text: "#EFF6FF", badgeBg: "#3B82F6", badgeText: "#FFFFFF" },
  { id: "violet", label: "Royal Violet", bg1: "#581C87", bg2: "#3B0764", text: "#FAF5FF", badgeBg: "#A855F7", badgeText: "#FFFFFF" },
  { id: "light", label: "Minimal Light", bg1: "#FAFAFA", bg2: "#F4F4F5", text: "#18181B", badgeBg: "#EA580C", badgeText: "#FFFFFF" },
];

export const OgImageGeneratorTool: React.FC = () => {
  const [title, setTitle] = useState("Build Modern Web Apps Faster with ToolVerse");
  const [subtitle, setSubtitle] = useState("Explore 30+ browser-first client-side developer utilities.");
  const [categoryTag, setCategoryTag] = useState("DEVELOPER UTILITIES");
  const [authorName, setAuthorName] = useState("Krish Savaliya");
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render OG Image Canvas (1200x630)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Draw Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, selectedTheme.bg1);
    grad.addColorStop(1, selectedTheme.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Grid lines accent
    ctx.strokeStyle = selectedTheme.id === "light" ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer Frame Border
    ctx.strokeStyle = selectedTheme.id === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.15)";
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    // Top Category Pill Badge
    const badgeText = (categoryTag || "DEVELOPER TOOLS").toUpperCase();
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    const badgeWidth = ctx.measureText(badgeText).width + 36;
    const badgeHeight = 44;
    const badgeX = 80;
    const badgeY = 80;

    ctx.fillStyle = selectedTheme.badgeBg;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 22);
    ctx.fill();

    ctx.fillStyle = selectedTheme.badgeText;
    ctx.fillText(badgeText, badgeX + 18, badgeY + 28);

    // Title Text (Word wrapped)
    ctx.fillStyle = selectedTheme.text;
    ctx.font = "bold 54px system-ui, -apple-system, sans-serif";
    const words = (title || "OG Image Title").split(" ");
    let line = "";
    let startY = 220;
    const maxWidth = 1040;
    const lineHeight = 66;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 80, startY);
        line = words[n] + " ";
        startY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, startY);

    // Subtitle Text
    ctx.fillStyle = selectedTheme.id === "light" ? "#52525B" : "rgba(255,255,255,0.8)";
    ctx.font = "normal 26px system-ui, -apple-system, sans-serif";
    ctx.fillText(subtitle || "", 80, startY + 60);

    // Footer Author / Brand Bar
    ctx.fillStyle = selectedTheme.id === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)";
    ctx.fillRect(80, 520, width - 160, 2);

    ctx.fillStyle = selectedTheme.text;
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
    ctx.fillText(`ToolVerse  •  ${authorName || "Creator"}`, 80, 565);

  }, [title, subtitle, categoryTag, authorName, selectedTheme]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `og-image-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Controls Left */}
      <div className="lg:col-span-6 bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-500" />
            <span>OG Image Card Customizer</span>
          </h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">Card Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Main social card title..."
            className="bg-zinc-50 border-zinc-200 text-xs h-10 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">Subtitle / Tagline</label>
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Short description..."
            className="bg-zinc-50 border-zinc-200 text-xs h-10 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Category Tag</label>
            <Input
              value={categoryTag}
              onChange={(e) => setCategoryTag(e.target.value)}
              placeholder="e.g. DEVELOPER UTILITIES"
              className="bg-zinc-50 border-zinc-200 text-xs h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Author / Brand</label>
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Krish Savaliya"
              className="bg-zinc-50 border-zinc-200 text-xs h-10 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-zinc-700">Theme Preset</label>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme)}
                className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedTheme.id === theme.id
                    ? "border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview & Download Right */}
      <div className="lg:col-span-6 bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-orange-500" />
            <span>1200×630 Social Card Preview</span>
          </h3>
        </div>

        <div className="bg-zinc-100 rounded-2xl p-2 border border-zinc-200 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-xl shadow-md border border-zinc-200 bg-white"
          />
        </div>

        <Button
          onClick={handleDownload}
          className="w-full h-11 text-xs font-bold gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/20 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res OG Image (PNG)</span>
        </Button>
      </div>
    </div>
  );
};
