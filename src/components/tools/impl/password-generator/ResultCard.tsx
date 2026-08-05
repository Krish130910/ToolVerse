"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  RefreshCw,
  Download,
  QrCode,
  AlertCircle,
  Zap,
} from "lucide-react";

interface ResultCardProps {
  password: string;
  warning: string | null;
  copied: boolean;
  autoCopy: boolean;
  onAutoCopyToggle: (enabled: boolean) => void;
  onCopy: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
  onOpenQrModal: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  password,
  warning,
  copied,
  autoCopy,
  onAutoCopyToggle,
  onCopy,
  onRegenerate,
  onDownload,
  onOpenQrModal,
}) => {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
          <Zap className="w-4 h-4 text-orange-500 fill-orange-500/20" />
          <span>Generated Secure Password</span>
        </div>

        {/* Auto-copy Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
          <input
            type="checkbox"
            checked={autoCopy}
            onChange={(e) => onAutoCopyToggle(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-orange-500 focus:ring-orange-500 cursor-pointer accent-orange-500"
          />
          <span>Auto-copy on generate</span>
        </label>
      </div>

      {/* Password Output Box */}
      {warning ? (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{warning}</span>
        </div>
      ) : (
        <div className="relative group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-50 border border-zinc-200/90 hover:border-orange-300 p-4 rounded-2xl transition-all">
          <div className="font-mono font-bold text-lg sm:text-2xl text-zinc-900 tracking-wider break-all select-all pr-2">
            {password || "Select options..."}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {/* Space Shortcut Badge */}
            <button
              onClick={onRegenerate}
              title="Regenerate Password (Press Space key)"
              className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200 hidden md:inline">
                Space
              </span>
            </button>

            {/* QR Export Button */}
            <button
              onClick={onOpenQrModal}
              title="Wi-Fi QR Code Export"
              disabled={!password}
              className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-zinc-600" />
            </button>

            {/* Download Button */}
            <button
              onClick={onDownload}
              title="Download Password as TXT"
              disabled={!password}
              className="p-2.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4 text-zinc-600" />
            </button>

            {/* Copy Button */}
            <Button
              onClick={onCopy}
              disabled={!password}
              variant="default"
              size="default"
              className="text-xs font-bold gap-1.5 shadow-2xs bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
