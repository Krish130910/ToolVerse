"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import QRCode from "qrcode";
import {
  QRCustomization,
  QRMetadata,
  ValidationResult,
  QRContentType,
} from "@/lib/qr/types";
import { calculateScanQuality } from "@/lib/qr/validation";
import {
  downloadPng,
  downloadSvg,
  copyImageToClipboard,
  copyTextToClipboard,
  printQrCode,
} from "@/lib/qr/export";
import { Button } from "@/components/ui/button";
import {
  Download,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Eye,
  ShieldCheck,
  Code2,
  FileCode,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface PreviewCardProps {
  payload: string;
  selectedTypeLabel: string;
  selectedType: QRContentType;
  customization: QRCustomization;
  validation: ValidationResult;
  onResetAll: () => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  payload,
  selectedTypeLabel,
  selectedType,
  customization,
  validation,
  onResetAll,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedData, setCopiedData] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Metadata computation
  const metadata: QRMetadata = useMemo(() => {
    const charCount = payload.length;
    const bytes = new TextEncoder().encode(payload).length;
    const scanQuality = calculateScanQuality(
      customization.fgColor,
      customization.bgColor,
      customization.transparentBg
    );

    return {
      type: selectedType,
      typeLabel: selectedTypeLabel,
      characterCount: charCount,
      errorCorrection: customization.errorCorrectionLevel,
      scanQuality,
      encodingSize: `${bytes} Bytes`,
      payload,
    };
  }, [payload, selectedType, selectedTypeLabel, customization]);

  // Real-time Canvas Renderer with custom module shapes & logo overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!validation.isValid || !payload) {
      // Clear canvas if invalid
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setRenderError(null);
      return;
    }

    try {
      const qr = QRCode.create(payload, {
        errorCorrectionLevel: customization.errorCorrectionLevel,
      });

      const moduleCount = qr.modules.size;
      const marginModules = customization.margin;
      const totalModules = moduleCount + marginModules * 2;

      const displaySize = Math.max(280, Math.min(600, customization.size));
      canvas.width = displaySize;
      canvas.height = displaySize;

      const cellSize = displaySize / totalModules;

      // 1. Draw Background
      ctx.clearRect(0, 0, displaySize, displaySize);
      if (!customization.transparentBg) {
        ctx.fillStyle = customization.bgColor;
        ctx.fillRect(0, 0, displaySize, displaySize);
      }

      // Helper to check if a module is inside Finder Patterns (top-left, top-right, bottom-left 7x7 areas)
      const isFinderPattern = (r: number, c: number) => {
        if (r < 7 && c < 7) return true; // Top-left
        if (r < 7 && c >= moduleCount - 7) return true; // Top-right
        if (r >= moduleCount - 7 && c < 7) return true; // Bottom-left
        return false;
      };

      ctx.fillStyle = customization.fgColor;

      // 2. Draw Modules
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (!qr.modules.get(r, c)) continue;

          const x = (c + marginModules) * cellSize;
          const y = (r + marginModules) * cellSize;

          if (isFinderPattern(r, c)) {
            // Standard square module for finder patterns to maintain standard scan readability
            ctx.fillRect(x, y, cellSize, cellSize);
          } else {
            // Apply custom module shape
            if (customization.moduleShape === "circle") {
              ctx.beginPath();
              ctx.arc(
                x + cellSize / 2,
                y + cellSize / 2,
                cellSize / 2.2,
                0,
                Math.PI * 2
              );
              ctx.fill();
            } else if (customization.moduleShape === "rounded") {
              const radius = cellSize * 0.35;
              ctx.beginPath();
              ctx.roundRect(x, y, cellSize, cellSize, radius);
              ctx.fill();
            } else {
              // Standard square
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          }
        }
      }

      // 3. Draw Center Logo Overlay if present
      if (customization.logoUrl) {
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.onload = () => {
          const logoSize = displaySize * 0.22; // 22% of total size
          const logoX = (displaySize - logoSize) / 2;
          const logoY = (displaySize - logoSize) / 2;

          // Clear background zone for logo
          if (!customization.transparentBg) {
            ctx.fillStyle = customization.bgColor;
            ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
          } else {
            ctx.clearRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
          }

          // Border frame for logo
          ctx.strokeStyle = customization.fgColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);

          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        };
        logoImg.src = customization.logoUrl;
      }

      setRenderError(null);
    } catch (err: any) {
      console.error("QR Code Render Error:", err);
      setRenderError(err?.message || "Failed to encode QR payload.");
    }
  }, [payload, customization, validation]);

  const isExportDisabled = !validation.isValid || !payload || Boolean(renderError);

  const handleCopyImg = async () => {
    if (isExportDisabled) return;
    const ok = await copyImageToClipboard(canvasRef.current);
    if (ok) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    }
  };

  const handleCopyPayload = async () => {
    if (isExportDisabled) return;
    const ok = await copyTextToClipboard(payload);
    if (ok) {
      setCopiedData(true);
      setTimeout(() => setCopiedData(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <Eye className="w-4 h-4 text-orange-500" />
            <span>Live QR Preview &amp; Export</span>
          </h3>
          <p className="text-[11px] font-medium text-zinc-600">
            Real-time scannable preview. Updates instantly while typing.
          </p>
        </div>
      </div>

      {/* Main Preview Box */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4 min-h-[320px] relative overflow-hidden">
        {validation.isValid && payload && !renderError ? (
          <div className="relative group">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-2xl shadow-md border border-zinc-200/60 bg-white transition-transform group-hover:scale-[1.01]"
              style={{
                width: `${Math.min(300, customization.size)}px`,
                height: `${Math.min(300, customization.size)}px`,
              }}
            />
          </div>
        ) : (
          <div className="text-center space-y-2 max-w-xs py-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 mx-auto">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-xs font-bold text-zinc-900">
              {renderError || "Fill in valid details to preview QR"}
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Choose a content type on the left and enter payload details.
            </p>
          </div>
        )}
      </div>

      {/* Metadata Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
          <span className="block text-[10px] font-bold text-zinc-600 uppercase">Type</span>
          <span className="text-xs font-extrabold text-zinc-900 truncate block">
            {metadata.typeLabel}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
          <span className="block text-[10px] font-bold text-zinc-600 uppercase">Length</span>
          <span className="text-xs font-extrabold text-zinc-900 block">
            {metadata.characterCount} Chars
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
          <span className="block text-[10px] font-bold text-zinc-600 uppercase">ECC Level</span>
          <span className="text-xs font-extrabold text-zinc-900 block">
            Level {metadata.errorCorrection}
          </span>
        </div>

        <div className={`p-2.5 rounded-xl border ${metadata.scanQuality.color}`}>
          <span className="block text-[10px] font-bold uppercase opacity-80">Scan Quality</span>
          <span className="text-xs font-extrabold block">
            {metadata.scanQuality.label}
          </span>
        </div>
      </div>

      {/* Export Actions Toolbar */}
      <div className="space-y-2 pt-2 border-t border-zinc-100">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            disabled={isExportDisabled}
            onClick={() => downloadPng(canvasRef.current, `qr-${metadata.type}.png`)}
            className="h-10 text-xs font-bold gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/20 disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </Button>

          <Button
            type="button"
            disabled={isExportDisabled}
            onClick={() => downloadSvg(canvasRef.current, `qr-${metadata.type}.svg`)}
            variant="outline"
            className="h-10 text-xs font-bold gap-2 border-zinc-200 text-zinc-800 hover:bg-zinc-50 rounded-xl disabled:opacity-40 cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-orange-500" />
            <span>Download SVG</span>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            disabled={isExportDisabled}
            onClick={handleCopyImg}
            variant="outline"
            className="h-9 text-[11px] font-bold gap-1.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl disabled:opacity-40 cursor-pointer"
          >
            {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedImage ? "Copied!" : "Copy Image"}</span>
          </Button>

          <Button
            type="button"
            disabled={isExportDisabled}
            onClick={handleCopyPayload}
            variant="outline"
            className="h-9 text-[11px] font-bold gap-1.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl disabled:opacity-40 cursor-pointer"
          >
            {copiedData ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>{copiedData ? "Copied!" : "Copy Payload"}</span>
          </Button>

          <Button
            type="button"
            disabled={isExportDisabled}
            onClick={() => printQrCode(canvasRef.current, metadata)}
            variant="outline"
            className="h-9 text-[11px] font-bold gap-1.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl disabled:opacity-40 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </Button>
        </div>

        <Button
          type="button"
          onClick={onResetAll}
          variant="ghost"
          className="w-full h-8 text-[11px] font-bold text-zinc-600 hover:text-zinc-900 gap-1.5 cursor-pointer mt-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All Configurations</span>
        </Button>
      </div>
    </div>
  );
};
