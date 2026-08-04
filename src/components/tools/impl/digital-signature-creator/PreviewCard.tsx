"use client";

import React, { useEffect, useRef, useState } from "react";
import { SIGNATURE_FONTS } from "@/lib/signature/fonts";
import { TypeModeOptions } from "./TypeModeCard";
import { DrawModeOptions } from "./DrawModeCard";
import { UploadModeOptions } from "./UploadModeCard";
import {
  downloadPng,
  downloadSvg,
  downloadPdf,
  copyImageToClipboard,
} from "@/lib/signature/export";
import { Button } from "@/components/ui/button";
import {
  Download,
  Copy,
  Check,
  FileCode,
  FileText,
  RotateCcw,
  Eye,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface PreviewCardProps {
  mode: "type" | "draw" | "upload";
  typeOptions: TypeModeOptions;
  drawCanvasData: string | null;
  uploadOptions: UploadModeOptions;
  transparentBg: boolean;
  onToggleTransparentBg: (val: boolean) => void;
  onReset: () => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  mode,
  typeOptions,
  drawCanvasData,
  uploadOptions,
  transparentBg,
  onToggleTransparentBg,
  onReset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load Google Fonts dynamically into document head
  useEffect(() => {
    if (document.getElementById("google-signature-fonts")) {
      setFontsLoaded(true);
      return;
    }
    const link = document.createElement("link");
    link.id = "google-signature-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Sacramento&family=Caveat:wght@400;700&family=Alex+Brush&family=Allura&family=Satisfy&family=WindSong:wght@400;500&family=Tangerine:wght@400;700&family=Marck+Script&family=Yellowtail&family=Homemade+Apple&family=Mr+Dafoe&family=Cedarville+Cursive&family=Reenie+Beanie&family=Pinyon+Script&family=Monsieur+La+Doulaise&family=Italianno&family=Kristi&family=Rouge+Script&family=Parisienne&family=Kaushan+Script&family=Cookie&display=swap";
    
    link.onload = () => setFontsLoaded(true);
    document.head.appendChild(link);
  }, []);

  // Main Canvas Rendering Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High DPI 2x canvas dimensions
    const width = 800;
    const height = 360;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background
    if (!transparentBg) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
    }

    if (mode === "type") {
      // 2. Render Type Signature
      const activeFont = SIGNATURE_FONTS.find((f) => f.id === typeOptions.fontId) || SIGNATURE_FONTS[0];
      const nameText = typeOptions.fullName.trim() || "Krish Savaliya";

      ctx.save();
      ctx.globalAlpha = typeOptions.opacity;
      ctx.fillStyle = typeOptions.inkColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Translate to center for rotation slant
      ctx.translate(width / 2, height / 2);
      ctx.rotate((typeOptions.rotation * Math.PI) / 180);

      const fontStyle = `${typeOptions.fontSize * 1.6}px ${activeFont.family}`;
      ctx.font = fontStyle;

      if (typeOptions.letterSpacing !== 0) {
        canvas.style.letterSpacing = `${typeOptions.letterSpacing}px`;
      } else {
        canvas.style.letterSpacing = "normal";
      }

      ctx.fillText(nameText, 0, 0);
      ctx.restore();
    } else if (mode === "draw" && drawCanvasData) {
      // 3. Render Freehand Drawn Signature
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = drawCanvasData;
    } else if (mode === "upload" && uploadOptions.processedImage) {
      // 4. Render Uploaded Signature
      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        let drawWidth = width * 0.7;
        let drawHeight = drawWidth / aspect;

        if (drawHeight > height * 0.7) {
          drawHeight = height * 0.7;
          drawWidth = drawHeight * aspect;
        }

        const x = (width - drawWidth) / 2;
        const y = (height - drawHeight) / 2;
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      };
      img.src = uploadOptions.processedImage;
    }
  }, [mode, typeOptions, drawCanvasData, uploadOptions, transparentBg, fontsLoaded]);

  const handleCopy = async () => {
    const ok = await copyImageToClipboard(canvasRef.current);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6 flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <Eye className="w-4 h-4 text-orange-500" />
            <span>Signature Preview Pad</span>
          </h3>
          <p className="text-[11px] font-medium text-zinc-500">
            High-fidelity preview. Closely matches exported document format.
          </p>
        </div>

        {/* Transparent Background Toggle */}
        <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer select-none bg-zinc-50 border border-zinc-200/80 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-colors">
          <input
            type="checkbox"
            checked={transparentBg}
            onChange={(e) => onToggleTransparentBg(e.target.checked)}
            className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400 cursor-pointer"
          />
          <span>Transparent BG</span>
        </label>
      </div>

      {/* Main Document Pad Container */}
      <div className="relative rounded-2xl border border-zinc-200/90 bg-zinc-50/70 p-6 flex flex-col items-center justify-center min-h-[340px] shadow-inner overflow-hidden">
        {/* Document Grid & Signature Baseline Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

        {/* Signature Line Marker */}
        <div className="w-[85%] border-b-2 border-zinc-300 relative my-auto py-8 text-center">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto drop-shadow-sm rounded-lg mx-auto relative z-10"
            style={{ maxHeight: "240px" }}
          />
          <div className="absolute left-2 -bottom-6 text-[11px] font-bold text-zinc-400 font-mono flex items-center gap-1 pointer-events-none">
            <span className="text-orange-500 font-extrabold text-sm">X</span>
            <span>Authorized Signature Baseline</span>
          </div>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
          <span className="block text-[10px] font-bold text-zinc-400 uppercase">Mode</span>
          <span className="text-xs font-extrabold text-zinc-900 capitalize block">
            {mode} Mode
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
          <span className="block text-[10px] font-bold text-zinc-400 uppercase">Canvas DPI</span>
          <span className="text-xs font-extrabold text-zinc-900 block">
            800×360 High-Res
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
          <span className="block text-[10px] font-bold text-zinc-400 uppercase">Export Alpha</span>
          <span className="text-xs font-extrabold text-emerald-600 block">
            {transparentBg ? "Transparent PNG" : "Solid White BG"}
          </span>
        </div>
      </div>

      {/* Export Toolbar */}
      <div className="space-y-2 pt-2 border-t border-zinc-100">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => downloadPng(canvasRef.current, "digital-signature.png")}
            className="h-10 text-xs font-bold gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </Button>

          <Button
            type="button"
            onClick={() => downloadSvg(canvasRef.current, "digital-signature.svg")}
            variant="outline"
            className="h-10 text-xs font-bold gap-2 border-zinc-200 text-zinc-800 hover:bg-zinc-50 rounded-xl cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-orange-500" />
            <span>Download SVG</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={() => downloadPdf(canvasRef.current, "digital-signature.pdf")}
            variant="outline"
            className="h-9 text-[11px] font-bold gap-1.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            <span>Download PDF Doc</span>
          </Button>

          <Button
            type="button"
            onClick={handleCopy}
            variant="outline"
            className="h-9 text-[11px] font-bold gap-1.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
            <span>{copied ? "Copied Image!" : "Copy Image"}</span>
          </Button>
        </div>

        <Button
          type="button"
          onClick={onReset}
          variant="ghost"
          className="w-full h-8 text-[11px] font-bold text-zinc-400 hover:text-zinc-700 gap-1.5 cursor-pointer mt-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Signature Creator</span>
        </Button>
      </div>
    </div>
  );
};
