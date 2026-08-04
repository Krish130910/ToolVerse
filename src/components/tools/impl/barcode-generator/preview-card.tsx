"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import JsBarcode from "jsbarcode";
import { BarcodeFormat, CustomizationOptions, ValidationResult } from "@/lib/barcode/types";
import { getFormatConfig } from "@/lib/barcode/validator";
import { exportPng, exportSvg, printBarcode } from "@/lib/barcode/exporter";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Download,
  Printer,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  QrCode,
} from "lucide-react";

interface PreviewCardProps {
  value: string;
  format: BarcodeFormat;
  validation: ValidationResult;
  options: CustomizationOptions;
  onReset: () => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  value,
  format,
  validation,
  options,
  onReset,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  const formatConfig = getFormatConfig(format);

  // Render Barcode via JsBarcode when inputs change
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    if (!validation.isValid || !value.trim()) {
      setRenderError(null);
      svgElement.innerHTML = "";
      return;
    }

    try {
      setRenderError(null);
      JsBarcode(svgElement, value.trim(), {
        format: formatConfig.jsBarcodeFormat,
        width: options.width,
        height: options.height,
        displayValue: options.displayValue,
        font: "monospace",
        fontSize: options.fontSize,
        textAlign: "center",
        textPosition: "bottom",
        textMargin: 4,
        margin: options.margin,
        background: options.transparentBackground ? "transparent" : options.background,
        lineColor: options.lineColor,
        valid: (valid: boolean) => {
          if (!valid) {
            setRenderError(`Invalid checksum or character sequence for ${formatConfig.name}.`);
          }
        },
      });
    } catch (err: any) {
      setRenderError(err?.message || `Failed to render ${formatConfig.name} barcode.`);
    }
  }, [value, format, validation.isValid, options, formatConfig]);

  // Export handlers
  const handleDownloadSvg = useCallback(() => {
    if (!validation.isValid || renderError) return;
    const filename = `barcode_${formatConfig.name.toLowerCase()}_${value.trim()}`;
    exportSvg(svgRef.current, filename);
  }, [validation.isValid, renderError, formatConfig.name, value]);

  const handleDownloadPng = useCallback(async () => {
    if (!validation.isValid || renderError) return;
    setIsExportingPng(true);
    const filename = `barcode_${formatConfig.name.toLowerCase()}_${value.trim()}`;
    await exportPng(
      svgRef.current,
      filename,
      options.background,
      options.transparentBackground
    );
    setIsExportingPng(false);
  }, [validation.isValid, renderError, formatConfig.name, value, options]);

  const handlePrint = useCallback(() => {
    if (!validation.isValid || renderError) return;
    printBarcode(svgRef.current, value.trim(), formatConfig.name);
  }, [validation.isValid, renderError, formatConfig.name, value]);

  const handleCopyValue = useCallback(() => {
    if (!value) return;
    navigator.clipboard.writeText(value.trim());
    setCopiedValue(true);
    setTimeout(() => setCopiedValue(false), 2000);
  }, [value]);

  const isExportDisabled = !validation.isValid || Boolean(renderError) || !value.trim();

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
      {/* Top Header & Status Badges */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200/60">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Card 3: Live Preview</h2>
            <p className="text-[11px] text-zinc-500">Vector barcode rendering & exports</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/80 text-[11px] font-bold">
            {formatConfig.name}
          </span>

          {validation.isValid && !renderError ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Ready to Scan</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Action Required</span>
            </span>
          )}
        </div>
      </div>

      {/* Centered Preview Canvas Stage - Flex-1 to naturally fill Card 2 height */}
      <div className="relative flex-1 min-h-[160px] flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80 shadow-inner overflow-hidden transition-all">
        {/* Subtle grid background pattern */}
        <div
          className="absolute inset-0 opacity-[0.2] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {validation.isValid && !renderError ? (
          <div className="relative z-10 p-3.5 rounded-xl shadow-xs bg-white border border-zinc-200/60 max-w-full overflow-x-auto flex justify-center transition-all animate-in fade-in zoom-in-95 duration-150">
            <svg ref={svgRef} className="max-w-full h-auto block mx-auto" />
          </div>
        ) : (
          <div className="relative z-10 text-center space-y-1.5 p-4 max-w-xs mx-auto">
            <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-orange-100/60 text-orange-600 border border-orange-200/60 shadow-2xs">
              <QrCode className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-xs font-bold text-zinc-800">
              {renderError ? "Barcode Generation Warning" : "Awaiting Valid Input"}
            </h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              {renderError || validation.message || "Enter valid data to render live vector preview."}
            </p>
          </div>
        )}
      </div>

      {/* Metadata info bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs font-mono text-zinc-700 flex-wrap gap-2">
        <span className="text-[11px] text-zinc-500 font-sans">Raw Input:</span>
        <span className="font-bold truncate max-w-[220px] text-zinc-900">
          {value.trim() || "(empty)"}
        </span>
        <button
          type="button"
          onClick={handleCopyValue}
          disabled={!value.trim()}
          className="ml-auto inline-flex items-center gap-1 text-[11px] font-sans font-bold text-orange-600 hover:text-orange-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Copy input text value"
        >
          {copiedValue ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Value</span>
            </>
          )}
        </button>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="space-y-2 pt-2 border-t border-zinc-100">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleDownloadPng}
            disabled={isExportDisabled || isExportingPng}
            variant="default"
            size="sm"
            className="text-xs font-bold gap-1.5 shadow-2xs cursor-pointer h-9"
            aria-label="Download PNG image of barcode"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPng ? "Generating..." : "Download PNG"}</span>
          </Button>

          <Button
            onClick={handleDownloadSvg}
            disabled={isExportDisabled}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 cursor-pointer border-zinc-300 hover:border-orange-400 hover:bg-orange-50/50 h-9"
            aria-label="Download SVG vector file of barcode"
          >
            <Download className="w-3.5 h-3.5 text-orange-600" />
            <span>Download SVG</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handlePrint}
            disabled={isExportDisabled}
            variant="ghost"
            size="sm"
            className="text-xs font-bold gap-1.5 cursor-pointer text-zinc-700 hover:bg-zinc-100 border border-zinc-200/80 h-9"
            aria-label="Print barcode layout"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-600" />
            <span>Print Barcode</span>
          </Button>

          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className="text-xs font-bold gap-1.5 cursor-pointer text-zinc-600 hover:bg-red-50 hover:text-red-600 border border-zinc-200/80 h-9"
            aria-label="Reset all inputs and customization options to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
