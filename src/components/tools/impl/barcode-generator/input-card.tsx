"use client";

import React, { useCallback } from "react";
import { BarcodeFormat, ValidationResult } from "@/lib/barcode/types";
import { BARCODE_FORMATS, getFormatConfig } from "@/lib/barcode/validator";
import { Input } from "@/components/ui/input";
import {
  Barcode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowUpRight,
  Hash,
} from "lucide-react";

interface InputCardProps {
  value: string;
  format: BarcodeFormat;
  validation: ValidationResult;
  onValueChange: (val: string) => void;
  onFormatChange: (fmt: BarcodeFormat) => void;
  onLoadSample: () => void;
}

export const InputCard: React.FC<InputCardProps> = ({
  value,
  format,
  validation,
  onValueChange,
  onFormatChange,
  onLoadSample,
}) => {
  const formatConfig = getFormatConfig(format);

  const handleClear = useCallback(() => {
    onValueChange("");
  }, [onValueChange]);

  const handleFormatSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFormatChange(e.target.value as BarcodeFormat);
    },
    [onFormatChange]
  );

  const handleAutoUppercase = useCallback(() => {
    onValueChange(value.toUpperCase());
  }, [value, onValueChange]);

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200/60">
            <Barcode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Card 1: Barcode Input</h2>
            <p className="text-[11px] text-zinc-500">Configure barcode content string & symbology</p>
          </div>
        </div>

        {/* Quick Sample Button */}
        <button
          type="button"
          onClick={onLoadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200/80 text-xs font-bold transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          title={`Load sample valid ${formatConfig.name}`}
          aria-label={`Load sample data for ${formatConfig.name}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Try Sample Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Barcode Value Field */}
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="barcode-input-value" className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <span>Barcode Value</span>
              <span className="text-[10px] text-zinc-400 font-normal">({formatConfig.name})</span>
            </label>

            {/* Format specific helper */}
            {format === "CODE39" && (
              <button
                type="button"
                onClick={handleAutoUppercase}
                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 cursor-pointer underline"
              >
                <span>Convert to Uppercase</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="relative">
            <Input
              id="barcode-input-value"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder={formatConfig.placeholder}
              className={`text-xs font-mono pr-8 h-10 border transition-all ${
                validation.isValid
                  ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/10"
                  : value
                  ? "border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 bg-amber-50/10"
                  : "border-zinc-200 focus:border-orange-500/50"
              }`}
              aria-describedby="barcode-validation-msg"
              aria-invalid={!validation.isValid && Boolean(value)}
            />

            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1 rounded-md hover:bg-zinc-100 cursor-pointer transition-colors"
                aria-label="Clear barcode value"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-1.5">
          <label htmlFor="barcode-format-select" className="text-xs font-bold text-zinc-700">
            Barcode Format
          </label>
          <select
            id="barcode-format-select"
            value={format}
            onChange={handleFormatSelect}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 cursor-pointer shadow-2xs transition-all"
            aria-label="Select barcode symbology format"
          >
            {BARCODE_FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Format Description & Character Counter Bar */}
      <div className="flex items-center justify-between text-xs pt-1 flex-wrap gap-2">
        <p className="text-[11px] text-zinc-500 flex-1 min-w-[200px]">
          {formatConfig.description}
        </p>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100/80 border border-zinc-200/80 text-[11px] font-mono text-zinc-700">
          <Hash className="w-3 h-3 text-zinc-400" />
          <span>
            {validation.characterCount}
            {validation.expectedCount ? ` / ${validation.expectedCount}` : ""} chars
          </span>
          {validation.isExactLength && (
            <span
              className={`ml-1 text-[10px] font-sans font-bold px-1.5 py-0.2 rounded-md ${
                validation.characterCount === validation.expectedCount
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {validation.characterCount === validation.expectedCount ? "Exact Match" : "Required"}
            </span>
          )}
        </div>
      </div>

      {/* Inline Validation Status Box */}
      <div
        id="barcode-validation-msg"
        role="status"
        aria-live="polite"
        className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
          validation.isValid
            ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
            : value
            ? "bg-amber-50/70 border-amber-200 text-amber-800"
            : "bg-zinc-50 border-zinc-200/80 text-zinc-600"
        }`}
      >
        {validation.isValid ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        )}
        <span className="leading-snug">{validation.message}</span>
      </div>
    </div>
  );
};
