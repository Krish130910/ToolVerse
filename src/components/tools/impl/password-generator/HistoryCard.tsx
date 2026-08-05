"use client";

import React, { useState } from "react";
import { PasswordHistoryItem } from "@/lib/password/types";
import { History, Copy, Check, Trash2, Eye, EyeOff } from "lucide-react";

interface HistoryCardProps {
  history: PasswordHistoryItem[];
  onCopyItem: (password: string) => void;
  onRestoreItem: (password: string) => void;
  onClearHistory: () => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  history,
  onCopyItem,
  onRestoreItem,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPlaintext, setShowPlaintext] = useState<boolean>(false);

  if (history.length === 0) return null;

  const handleCopy = (item: PasswordHistoryItem) => {
    onCopyItem(item.password);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-orange-500" />
          <span>Session History ({history.length})</span>
        </h4>

        <div className="flex items-center gap-2">
          {/* Mask / Reveal Toggle */}
          <button
            type="button"
            onClick={() => setShowPlaintext(!showPlaintext)}
            className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-medium cursor-pointer"
          >
            {showPlaintext ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPlaintext ? "Mask" : "Reveal"}</span>
          </button>

          {/* Clear History */}
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs text-zinc-400 hover:text-rose-600 flex items-center gap-1 font-medium transition-colors cursor-pointer pl-2 border-l border-zinc-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-zinc-50/70 border border-zinc-200/70 hover:bg-zinc-50 rounded-2xl text-xs font-mono transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <span className="truncate font-bold text-zinc-800">
                {showPlaintext ? item.password : "•".repeat(Math.min(24, item.password.length))}
              </span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-500 font-medium shrink-0">
                {item.strength}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-sans">
              <button
                type="button"
                onClick={() => onRestoreItem(item.password)}
                className="text-zinc-600 hover:text-zinc-900 font-bold text-[11px] hover:underline cursor-pointer"
              >
                Restore
              </button>

              <button
                type="button"
                onClick={() => handleCopy(item)}
                className="text-orange-600 hover:text-orange-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer pl-1 border-l border-zinc-200"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
