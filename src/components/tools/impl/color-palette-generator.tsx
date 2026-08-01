"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Copy,
  Check,
  Lock,
  Unlock,
  Heart,
  Download,
  Sliders,
  Sparkles,
  ShieldCheck,
  Eye,
  FileCode,
} from "lucide-react";

interface ColorItem {
  hex: string;
  locked: boolean;
}

export const ColorPaletteGeneratorTool: React.FC = () => {
  const [harmonyMode, setHarmonyMode] = useState<"random" | "complementary" | "analogous" | "monochrome" | "triadic" | "tetradic">("random");
  const [format, setFormat] = useState<"hex" | "rgb" | "hsl">("hex");
  const [colors, setColors] = useState<ColorItem[]>([
    { hex: "#F97316", locked: false },
    { hex: "#FB923C", locked: false },
    { hex: "#FDBA74", locked: false },
    { hex: "#0F172A", locked: false },
    { hex: "#1E293B", locked: false },
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);
  const [favoritePalettes, setFavoritePalettes] = useState<string[][]>([]);

  // Generate random hex color
  const getRandomHex = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(x => x + x).join("");
    const num = parseInt(c, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const formatColor = (hex: string) => {
    if (format === "hex") return hex;
    const { r, g, b } = hexToRgb(hex);
    if (format === "rgb") return `rgb(${r}, ${g}, ${b})`;
    const { h, s, l } = rgbToHsl(r, g, b);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const generatePalette = () => {
    if (harmonyMode === "random") {
      setColors(colors.map((c) => (c.locked ? c : { ...c, hex: getRandomHex() })));
    } else {
      const baseHex = colors[0].locked ? colors[0].hex : getRandomHex();
      const { r, g, b } = hexToRgb(baseHex);
      const { h, s, l } = rgbToHsl(r, g, b);

      let newHues: number[] = [];
      if (harmonyMode === "complementary") newHues = [h, (h + 180) % 360, (h + 30) % 360, (h + 210) % 360, (h + 15) % 360];
      else if (harmonyMode === "analogous") newHues = [h, (h + 30) % 360, (h + 60) % 360, (h - 30 + 360) % 360, (h - 60 + 360) % 360];
      else if (harmonyMode === "monochrome") newHues = [h, h, h, h, h];
      else if (harmonyMode === "triadic") newHues = [h, (h + 120) % 360, (h + 240) % 360, (h + 30) % 360, (h + 150) % 360];
      else if (harmonyMode === "tetradic") newHues = [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360, (h + 45) % 360];

      const newColors = colors.map((c, i) => {
        if (c.locked) return c;
        const targetH = newHues[i % newHues.length];
        const targetL = harmonyMode === "monochrome" ? Math.max(10, Math.min(90, l + (i - 2) * 15)) : l;
        // Simple HSL to Hex convert
        const lNorm = targetL / 100;
        const a = (s / 100) * Math.min(lNorm, 1 - lNorm);
        const f = (n: number) => {
          const k = (n + targetH / 30) % 12;
          const colorVal = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * Math.max(0, Math.min(1, colorVal))).toString(16).padStart(2, "0");
        };
        return { ...c, hex: `#${f(0)}${f(8)}${f(4)}`.toUpperCase() };
      });
      setColors(newColors);
    }
  };

  const toggleLock = (index: number) => {
    setColors(colors.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c)));
  };

  const copyColor = (hex: string, index: number) => {
    navigator.clipboard.writeText(formatColor(hex));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const exportCss = () => {
    const css = `:root {\n` + colors.map((c, i) => `  --color-${i + 1}: ${formatColor(c.hex)};`).join("\n") + `\n}`;
    navigator.clipboard.writeText(css);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const saveFavorite = () => {
    const hexes = colors.map((c) => c.hex);
    setFavoritePalettes((prev) => [hexes, ...prev]);
  };

  // Calculate contrast ratio against #FFFFFF and #000000
  const getContrastRatio = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.5 ? "Dark Text (#0F172A)" : "White Text (#FFFFFF)";
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Main Generate Button */}
          <Button onClick={generatePalette} variant="default" className="w-full md:w-auto h-11 text-xs font-bold gap-2 shadow-xs">
            <RefreshCw className="w-4 h-4" />
            <span>Generate New Palette (Spacebar)</span>
          </Button>

          {/* Harmony Mode Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <span className="text-xs font-bold text-zinc-600">Harmony:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(["random", "complementary", "analogous", "monochrome", "triadic", "tetradic"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setHarmonyMode(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    harmonyMode === mode ? "bg-orange-500 text-white shadow-2xs" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Color Format Switcher */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl">
            {(["hex", "rgb", "hsl"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${format === f ? "bg-white shadow-2xs text-orange-600" : "text-zinc-500"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Color Palette Display */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 h-80 sm:h-96">
        {colors.map((c, idx) => {
          const textColor = getContrastRatio(c.hex).includes("White") ? "text-white" : "text-zinc-900";
          return (
            <div
              key={idx}
              style={{ backgroundColor: c.hex }}
              className="rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all relative group overflow-hidden"
            >
              {/* Top Controls: Lock & Contrast */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleLock(idx)}
                  className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                    c.locked ? "bg-black/30 text-white" : "bg-white/20 hover:bg-white/40 " + textColor
                  }`}
                  title={c.locked ? "Unlock Color" : "Lock Color"}
                >
                  {c.locked ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4" />}
                </button>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/20 backdrop-blur-md text-white`}>
                  {c.hex}
                </span>
              </div>

              {/* Bottom Information & Copy */}
              <div className="space-y-2">
                <div className={`${textColor} font-bold text-center`}>
                  <p className="text-sm font-mono tracking-wider">{formatColor(c.hex)}</p>
                  <p className="text-[10px] opacity-80">{getContrastRatio(c.hex)}</p>
                </div>

                <Button
                  onClick={() => copyColor(c.hex, idx)}
                  variant="outline"
                  size="sm"
                  className="w-full bg-white/90 hover:bg-white text-zinc-900 border-0 text-xs font-bold gap-1.5 shadow-sm"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === idx ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar: Export CSS, Save Favorite */}
      <div className="flex items-center justify-between bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button onClick={exportCss} variant="default" size="sm" className="text-xs font-bold gap-1.5">
            {copiedExport ? <Check className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
            <span>{copiedExport ? "CSS Variables Copied!" : "Export CSS Variables"}</span>
          </Button>

          <Button onClick={saveFavorite} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Save to Favorites</span>
          </Button>
        </div>

        <span className="text-xs text-zinc-500 font-medium">Tip: Press Spacebar to shuffle unlocked colors!</span>
      </div>

      {/* Saved Favorites History */}
      {favoritePalettes.length > 0 && (
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Saved Favorite Palettes</h4>
          <div className="space-y-2">
            {favoritePalettes.map((pal, pIdx) => (
              <div key={pIdx} className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center h-8 flex-1 rounded-lg overflow-hidden border border-zinc-300">
                  {pal.map((hex, hIdx) => (
                    <div key={hIdx} style={{ backgroundColor: hex }} className="h-full flex-1" title={hex} />
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setColors(pal.map((h) => ({ hex: h, locked: false })))}
                  className="text-xs"
                >
                  Load
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
