"use client";

import React from "react";
import { QRCustomization, ErrorCorrectionLevel, ModuleShape } from "@/lib/qr/types";
import { Input } from "@/components/ui/input";
import { Sliders, Upload, Trash2, ShieldCheck, Check } from "lucide-react";

interface CustomizationCardProps {
  customization: QRCustomization;
  onChangeCustomization: (updater: (prev: QRCustomization) => QRCustomization) => void;
}

const COLOR_PRESETS = [
  { name: "ToolVerse Orange", fg: "#EA580C", bg: "#FFFFFF" },
  { name: "SaaS Dark Mode", fg: "#FAFAFA", bg: "#18181B" },
  { name: "Emerald Cyber", fg: "#059669", bg: "#FFFFFF" },
  { name: "Sapphire Blue", fg: "#2563EB", bg: "#FFFFFF" },
  { name: "Midnight Navy", fg: "#1E1B4B", bg: "#F8FAFC" },
  { name: "Royal Violet", fg: "#7C3AED", bg: "#FFFFFF" },
];

export const CustomizationCard: React.FC<CustomizationCardProps> = ({
  customization,
  onChangeCustomization,
}) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // AUTOMATICALLY force ECC High ('H') when a logo is uploaded!
      onChangeCustomization((prev) => ({
        ...prev,
        logoUrl: result,
        errorCorrectionLevel: "H",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChangeCustomization((prev) => ({
      ...prev,
      logoUrl: null,
    }));
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-500" />
            <span>QR Styling &amp; Customization</span>
          </h3>
          <p className="text-[11px] font-medium text-zinc-600">
            Customize colors, size, ECC, pattern shapes, and logo overlay.
          </p>
        </div>
      </div>

      {/* Preset Color Schemes */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-700">Color Palette Presets</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              customization.fgColor === preset.fg && customization.bgColor === preset.bg;

            return (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  onChangeCustomization((prev) => ({
                    ...prev,
                    fgColor: preset.fg,
                    bgColor: preset.bg,
                  }))
                }
                title={preset.name}
                className={`flex items-center justify-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-orange-500 ring-2 ring-orange-500/30 scale-105"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="w-6 h-6 rounded-lg flex overflow-hidden border border-zinc-200 shadow-2xs">
                  <div className="w-1/2 h-full" style={{ backgroundColor: preset.fg }} />
                  <div className="w-1/2 h-full" style={{ backgroundColor: preset.bg }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Pickers & Transparent Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">Foreground Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customization.fgColor}
              onChange={(e) =>
                onChangeCustomization((prev) => ({ ...prev, fgColor: e.target.value }))
              }
              className="w-9 h-9 rounded-xl border border-zinc-200 cursor-pointer p-0.5"
            />
            <Input
              value={customization.fgColor}
              onChange={(e) =>
                onChangeCustomization((prev) => ({ ...prev, fgColor: e.target.value }))
              }
              className="bg-zinc-50 border-zinc-200 text-xs font-mono h-9 rounded-xl flex-1"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700">Background Color</label>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={customization.transparentBg}
                onChange={(e) =>
                  onChangeCustomization((prev) => ({ ...prev, transparentBg: e.target.checked }))
                }
                className="w-3.5 h-3.5 rounded text-orange-500 focus:ring-orange-400 cursor-pointer"
              />
              Transparent
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customization.bgColor}
              disabled={customization.transparentBg}
              onChange={(e) =>
                onChangeCustomization((prev) => ({ ...prev, bgColor: e.target.value }))
              }
              className="w-9 h-9 rounded-xl border border-zinc-200 cursor-pointer p-0.5 disabled:opacity-50"
            />
            <Input
              value={customization.bgColor}
              disabled={customization.transparentBg}
              onChange={(e) =>
                onChangeCustomization((prev) => ({ ...prev, bgColor: e.target.value }))
              }
              className="bg-zinc-50 border-zinc-200 text-xs font-mono h-9 rounded-xl flex-1 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* QR Size & Margin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">QR Canvas Size</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: "S", px: 150 },
              { label: "M", px: 250 },
              { label: "L", px: 400 },
              { label: "XL", px: 600 },
            ].map((sizeOpt) => (
              <button
                key={sizeOpt.label}
                type="button"
                onClick={() =>
                  onChangeCustomization((prev) => ({ ...prev, size: sizeOpt.px }))
                }
                className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  customization.size === sizeOpt.px
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                {sizeOpt.label} ({sizeOpt.px}px)
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">Quiet Zone / Margin</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 4].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() =>
                  onChangeCustomization((prev) => ({ ...prev, margin: m }))
                }
                className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  customization.margin === m
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                {m}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Module Pattern Shape & Error Correction Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">Module Shape</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "square", label: "Square" },
              { id: "rounded", label: "Rounded" },
              { id: "circle", label: "Dots" },
            ].map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() =>
                  onChangeCustomization((prev) => ({
                    ...prev,
                    moduleShape: shape.id as ModuleShape,
                  }))
                }
                className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  customization.moduleShape === shape.id
                    ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                {shape.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
            <span>Error Correction (ECC)</span>
            <span className="text-[10px] text-zinc-400 font-normal">
              {customization.logoUrl ? "Auto-locked to H for Logo" : "Higher = More Damage Proof"}
            </span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { level: "L", desc: "7%" },
              { level: "M", desc: "15%" },
              { level: "Q", desc: "25%" },
              { level: "H", desc: "30%" },
            ].map((ecc) => (
              <button
                key={ecc.level}
                type="button"
                disabled={Boolean(customization.logoUrl && ecc.level !== "H")}
                onClick={() =>
                  onChangeCustomization((prev) => ({
                    ...prev,
                    errorCorrectionLevel: ecc.level as ErrorCorrectionLevel,
                  }))
                }
                className={`py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer disabled:opacity-40 ${
                  customization.errorCorrectionLevel === ecc.level
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-2xs"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                <div>{ecc.level}</div>
                <div className="text-[9px] font-normal opacity-80">{ecc.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logo Image Overlay Upload Section */}
      <div className="space-y-2 pt-2 border-t border-zinc-100">
        <label className="text-xs font-bold text-zinc-700 flex items-center justify-between">
          <span>Center Logo Overlay</span>
          {customization.logoUrl && (
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> High Error Correction Auto-Applied
            </span>
          )}
        </label>

        {customization.logoUrl ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/60 border border-orange-200/80">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={customization.logoUrl}
                alt="Logo Overlay"
                className="w-10 h-10 object-contain rounded-xl bg-white border border-zinc-200 p-1"
              />
              <div>
                <p className="text-xs font-bold text-zinc-900">Custom Logo Attached</p>
                <p className="text-[10px] font-medium text-zinc-500">
                  Centered overlay with automatic clear zone padding.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="p-2 text-rose-600 hover:bg-rose-100/60 rounded-xl transition-colors cursor-pointer"
              title="Remove Logo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 hover:bg-orange-50/30 hover:border-orange-300 text-zinc-600 hover:text-orange-600 transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-bold">Upload Brand Logo (PNG / SVG)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};
