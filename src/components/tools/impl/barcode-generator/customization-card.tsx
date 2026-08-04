"use client";

import React, { useCallback } from "react";
import { CustomizationOptions, ThemePreset } from "@/lib/barcode/types";
import { Sliders, Palette, Eye, Type, Contrast } from "lucide-react";

interface CustomizationCardProps {
  options: CustomizationOptions;
  onChange: (updated: CustomizationOptions) => void;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: "classic",
    name: "Classic Mono",
    lineColor: "#18181B",
    background: "#FFFFFF",
    transparentBackground: false,
  },
  {
    id: "toolverse-orange",
    name: "ToolVerse Orange",
    lineColor: "#EA580C",
    background: "#FFF7ED",
    transparentBackground: false,
  },
  {
    id: "midnight",
    name: "Midnight Dark",
    lineColor: "#F4F4F5",
    background: "#18181B",
    transparentBackground: false,
  },
  {
    id: "navy",
    name: "High Contrast Navy",
    lineColor: "#0F172A",
    background: "#F8FAFC",
    transparentBackground: false,
  },
];

export const CustomizationCard: React.FC<CustomizationCardProps> = ({ options, onChange }) => {
  const handleUpdate = useCallback(
    (key: keyof CustomizationOptions, value: any) => {
      onChange({
        ...options,
        [key]: value,
      });
    },
    [options, onChange]
  );

  const applyPreset = useCallback(
    (preset: ThemePreset) => {
      onChange({
        ...options,
        lineColor: preset.lineColor,
        background: preset.background,
        transparentBackground: preset.transparentBackground,
      });
    },
    [options, onChange]
  );

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
        <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200/60">
          <Sliders className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Card 2: Customization</h2>
          <p className="text-[11px] text-zinc-500">Fine-tune dimensions, typography & colors</p>
        </div>
      </div>

      {/* Quick Theme Presets */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-orange-500" />
          <span>Color Presets</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {THEME_PRESETS.map((preset) => {
            const isActive =
              options.lineColor === preset.lineColor &&
              options.background === preset.background &&
              !options.transparentBackground;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "border-orange-500 bg-orange-50/50 text-orange-950 shadow-2xs"
                    : "border-zinc-200/80 bg-zinc-50/50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100/50"
                }`}
                aria-label={`Apply ${preset.name} color theme`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-2xs shrink-0"
                  style={{ backgroundColor: preset.lineColor }}
                />
                <span className="truncate">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders Grid (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Width Slider */}
        <div className="space-y-1">
          <label htmlFor="slider-bar-width" className="text-xs font-bold text-zinc-700 block">
            Width: {options.width}px
          </label>
          <input
            id="slider-bar-width"
            type="range"
            min="1"
            max="4"
            step="0.5"
            value={options.width}
            onChange={(e) => handleUpdate("width", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-1.5 rounded-lg bg-zinc-200"
            aria-label="Adjust bar thickness width"
          />
        </div>

        {/* Height Slider */}
        <div className="space-y-1">
          <label htmlFor="slider-bar-height" className="text-xs font-bold text-zinc-700 block">
            Height: {options.height}px
          </label>
          <input
            id="slider-bar-height"
            type="range"
            min="30"
            max="150"
            step="5"
            value={options.height}
            onChange={(e) => handleUpdate("height", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-1.5 rounded-lg bg-zinc-200"
            aria-label="Adjust barcode height"
          />
        </div>

        {/* Quiet Zone Margin Slider */}
        <div className="space-y-1">
          <label htmlFor="slider-bar-margin" className="text-xs font-bold text-zinc-700 block">
            Margin: {options.margin}px
          </label>
          <input
            id="slider-bar-margin"
            type="range"
            min="0"
            max="40"
            step="2"
            value={options.margin}
            onChange={(e) => handleUpdate("margin", Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-1.5 rounded-lg bg-zinc-200"
            aria-label="Adjust quiet zone margin"
          />
        </div>

        {/* Font Size Slider */}
        <div className="space-y-1">
          <label htmlFor="slider-font-size" className="text-xs font-bold text-zinc-700 flex items-center gap-1">
            <Type className="w-3 h-3 text-zinc-400" />
            <span>Font: {options.fontSize}px</span>
          </label>
          <input
            id="slider-font-size"
            type="range"
            min="10"
            max="24"
            step="1"
            value={options.fontSize}
            disabled={!options.displayValue}
            onChange={(e) => handleUpdate("fontSize", Number(e.target.value))}
            className={`w-full accent-orange-500 cursor-pointer h-1.5 rounded-lg ${
              options.displayValue ? "bg-zinc-200" : "bg-zinc-100 opacity-50 cursor-not-allowed"
            }`}
            aria-label="Adjust barcode font size"
          />
        </div>
      </div>

      {/* Toggles (2 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100">
        {/* Show/Hide Text Toggle */}
        <label htmlFor="toggle-display-value" className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
          <input
            id="toggle-display-value"
            type="checkbox"
            checked={options.displayValue}
            onChange={(e) => handleUpdate("displayValue", e.target.checked)}
            className="w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"
            aria-label="Toggle text display below barcode"
          />
          <Eye className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span className="truncate">Show Text Below</span>
        </label>

        {/* Transparent Background Toggle */}
        <label htmlFor="toggle-transparent-bg" className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
          <input
            id="toggle-transparent-bg"
            type="checkbox"
            checked={options.transparentBackground}
            onChange={(e) => handleUpdate("transparentBackground", e.target.checked)}
            className="w-4 h-4 accent-orange-500 rounded cursor-pointer shrink-0"
            aria-label="Toggle transparent background"
          />
          <Contrast className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span className="truncate">Transparent BG</span>
        </label>
      </div>

      {/* Color Pickers (2 Columns) */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100">
        {/* Bar Color */}
        <div className="space-y-1">
          <label htmlFor="input-line-color" className="text-xs font-bold text-zinc-700 block">
            Barcode Color:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="input-line-color-picker"
              type="color"
              value={options.lineColor}
              onChange={(e) => handleUpdate("lineColor", e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200 p-0 bg-transparent shrink-0"
              aria-label="Choose barcode line color picker"
            />
            <input
              id="input-line-color"
              type="text"
              value={options.lineColor}
              onChange={(e) => handleUpdate("lineColor", e.target.value)}
              className="w-full h-8 px-2 rounded-lg border border-zinc-200 bg-white text-xs font-mono font-semibold"
              aria-label="Choose barcode line color hex value"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-1">
          <label htmlFor="input-bg-color" className="text-xs font-bold text-zinc-700 block">
            Background:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="input-bg-color-picker"
              type="color"
              value={options.background}
              disabled={options.transparentBackground}
              onChange={(e) => handleUpdate("background", e.target.value)}
              className={`w-8 h-8 rounded-lg border border-zinc-200 p-0 bg-transparent shrink-0 ${
                options.transparentBackground ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
              aria-label="Choose background color picker"
            />
            <input
              id="input-bg-color"
              type="text"
              value={options.transparentBackground ? "Transparent" : options.background}
              disabled={options.transparentBackground}
              onChange={(e) => handleUpdate("background", e.target.value)}
              className={`w-full h-8 px-2 rounded-lg border border-zinc-200 bg-white text-xs font-mono font-semibold ${
                options.transparentBackground ? "opacity-50 cursor-not-allowed text-zinc-400" : ""
              }`}
              aria-label="Choose background color hex value"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
