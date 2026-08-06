"use client";

import React, { useState } from "react";
import { PenTool, Type, Upload } from "lucide-react";
import { TypeModeCard, TypeModeOptions } from "./digital-signature-creator/TypeModeCard";
import { DrawModeCard, DrawModeOptions } from "./digital-signature-creator/DrawModeCard";
import { UploadModeCard, UploadModeOptions } from "./digital-signature-creator/UploadModeCard";
import { PreviewCard } from "./digital-signature-creator/PreviewCard";

const INITIAL_TYPE_OPTIONS: TypeModeOptions = {
  fullName: "Krish Savaliya",
  fontId: "dancing-script",
  fontSize: 54,
  letterSpacing: 0,
  inkColor: "#18181B",
  rotation: 0,
  opacity: 1.0,
  aspectRatio: "600x300",
};

const INITIAL_DRAW_OPTIONS: DrawModeOptions = {
  penColor: "#18181B",
  penWidth: 3,
  smoothing: true,
};

const INITIAL_UPLOAD_OPTIONS: UploadModeOptions = {
  rawImage: null,
  processedImage: null,
  removeBackground: true,
  threshold: 210,
  contrast: 20,
  brightness: 0,
  inkColor: "",
};

export const DigitalSignatureCreatorTool: React.FC = () => {
  const [mode, setMode] = useState<"type" | "draw" | "upload">("type");
  const [transparentBg, setTransparentBg] = useState<boolean>(true);

  // Mode States
  const [typeOptions, setTypeOptions] = useState<TypeModeOptions>(INITIAL_TYPE_OPTIONS);
  const [drawOptions, setDrawOptions] = useState<DrawModeOptions>(INITIAL_DRAW_OPTIONS);
  const [drawCanvasData, setDrawCanvasData] = useState<string | null>(null);
  const [uploadOptions, setUploadOptions] = useState<UploadModeOptions>(INITIAL_UPLOAD_OPTIONS);

  const handleResetAll = () => {
    setTypeOptions(INITIAL_TYPE_OPTIONS);
    setDrawOptions(INITIAL_DRAW_OPTIONS);
    setDrawCanvasData(null);
    setUploadOptions(INITIAL_UPLOAD_OPTIONS);
    setTransparentBg(true);
  };

  return (
    <div className="space-y-8 w-full">
      {/* 1. TOP SECTION: Mode Selector Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("type")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === "type"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Type Signature</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("draw")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === "draw"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Draw Signature</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              mode === "upload"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-[1.02]"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 font-semibold px-2">
          {mode === "type" && "24 Handwritten Cursive Fonts"}
          {mode === "draw" && "Smooth Bezier Curve Canvas"}
          {mode === "upload" && "Auto Background Removal"}
        </div>
      </div>

      {/* 2. TWO-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls Card for Active Mode */}
        <div className="lg:col-span-7">
          {mode === "type" && (
            <TypeModeCard options={typeOptions} onChange={setTypeOptions} />
          )}

          {mode === "draw" && (
            <DrawModeCard
              options={drawOptions}
              onChangeOptions={setDrawOptions}
              onCanvasUpdate={setDrawCanvasData}
            />
          )}

          {mode === "upload" && (
            <UploadModeCard
              options={uploadOptions}
              onChangeOptions={setUploadOptions}
            />
          )}
        </div>

        {/* RIGHT COLUMN: Signature Preview & Export Pad */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <PreviewCard
            mode={mode}
            typeOptions={typeOptions}
            drawCanvasData={drawCanvasData}
            uploadOptions={uploadOptions}
            transparentBg={transparentBg}
            onToggleTransparentBg={setTransparentBg}
            onReset={handleResetAll}
          />
        </div>
      </div>
    </div>
  );
};
