"use client";

import React, { useState } from "react";
import { SIGNATURE_FONTS, SignatureFont } from "@/lib/signature/fonts";
import { Input } from "@/components/ui/input";
import { Sliders, Type, Check, Sparkles } from "lucide-react";

export interface TypeModeOptions {
  fullName: string;
  fontId: string;
  fontSize: number; // 20 - 120
  letterSpacing: number; // -4 - 20
  inkColor: string;
  rotation: number; // -30 - 30
  opacity: number; // 0.1 - 1.0
  aspectRatio: "600x300" | "800x300" | "500x500";
}

interface TypeModeCardProps {
  options: TypeModeOptions;
  onChange: (updater: (prev: TypeModeOptions) => TypeModeOptions) => void;
}

const INK_PRESETS = [
  { name: "Midnight Black", color: "#18181B" },
  { name: "Royal Blue", color: "#1E40AF" },
  { name: "Classic Navy", color: "#1E1B4B" },
  { name: "Emerald Green", color: "#059669" },
  { name: "Crimson Red", color: "#DC2626" },
  { name: "Dark Violet", color: "#6B21A8" },
];

export const TypeModeCard: React.FC<TypeModeCardProps> = ({ options, onChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFonts = SIGNATURE_FONTS.filter(
    (f) => selectedCategory === "all" || f.category === selectedCategory
  );

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <Type className="w-4 h-4 text-orange-500" />
            <span>Type Signature &amp; Font Gallery</span>
          </h3>
          <p className="text-[11px] font-medium text-zinc-500">
            Type your full name and select from 24 handwritten cursive signature fonts.
          </p>
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
          <span>Full Name for Signature</span>
          <span className="text-[10px] text-zinc-400 font-normal">Updates preview in real-time</span>
        </label>
        <Input
          value={options.fullName}
          onChange={(e) => onChange((prev) => ({ ...prev, fullName: e.target.value }))}
          placeholder="e.g. Krish Savaliya"
          className="bg-zinc-50 border-zinc-200 text-sm font-medium h-10 rounded-xl focus:border-orange-500"
        />
      </div>

      {/* Font Gallery Grid with Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-bold text-zinc-700">
            Signature Font Gallery ({SIGNATURE_FONTS.length} Cursive Styles)
          </label>
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {["all", "calligraphy", "casual", "modern", "classic", "artistic"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-zinc-900 text-white shadow-2xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Font Cards Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[260px] overflow-y-auto p-1 border border-zinc-200/80 rounded-2xl bg-zinc-50/50">
          {filteredFonts.map((font) => {
            const isSelected = options.fontId === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, fontId: font.id }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-orange-500 ring-2 ring-orange-500/20 shadow-xs scale-[1.01]"
                    : "bg-white border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-zinc-600">{font.name}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <div
                  className="text-lg text-zinc-900 truncate py-1"
                  style={{ fontFamily: font.family }}
                >
                  {options.fullName || "Signature Sample"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ink Color & Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-700">Ink Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={options.inkColor}
            onChange={(e) => onChange((prev) => ({ ...prev, inkColor: e.target.value }))}
            className="w-10 h-10 rounded-xl border border-zinc-200 cursor-pointer p-0.5"
          />
          <div className="grid grid-cols-6 gap-1.5 flex-1">
            {INK_PRESETS.map((preset) => (
              <button
                key={preset.color}
                type="button"
                onClick={() => onChange((prev) => ({ ...prev, inkColor: preset.color }))}
                title={preset.name}
                className={`h-8 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  options.inkColor === preset.color
                    ? "border-orange-500 ring-2 ring-orange-500/30 scale-105"
                    : "border-zinc-200 hover:scale-105"
                }`}
                style={{ backgroundColor: preset.color }}
              >
                {options.inkColor === preset.color && (
                  <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Font Size Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-zinc-700">Font Size</label>
            <span className="font-mono text-zinc-500">{options.fontSize}px</span>
          </div>
          <input
            type="range"
            min={24}
            max={110}
            value={options.fontSize}
            onChange={(e) => onChange((prev) => ({ ...prev, fontSize: Number(e.target.value) }))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Letter Spacing Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-zinc-700">Letter Spacing</label>
            <span className="font-mono text-zinc-500">{options.letterSpacing}px</span>
          </div>
          <input
            type="range"
            min={-4}
            max={16}
            value={options.letterSpacing}
            onChange={(e) => onChange((prev) => ({ ...prev, letterSpacing: Number(e.target.value) }))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Rotation Slant Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-zinc-700">Rotation Slant</label>
            <span className="font-mono text-zinc-500">{options.rotation}°</span>
          </div>
          <input
            type="range"
            min={-30}
            max={30}
            value={options.rotation}
            onChange={(e) => onChange((prev) => ({ ...prev, rotation: Number(e.target.value) }))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Opacity Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-zinc-700">Ink Opacity</label>
            <span className="font-mono text-zinc-500">{Math.round(options.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={options.opacity}
            onChange={(e) => onChange((prev) => ({ ...prev, opacity: Number(e.target.value) }))}
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
