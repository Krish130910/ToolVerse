"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, Copy, Check, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JWT_SAMPLES } from "@/lib/jwt/decoder";

interface InputTokenCardProps {
  jwtInput: string;
  onInputChange: (val: string) => void;
  onClear: () => void;
  parts: string[];
}

export const InputTokenCard: React.FC<InputTokenCardProps> = ({
  jwtInput,
  onInputChange,
  onClear,
  parts,
}) => {
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyRaw = async () => {
    if (!jwtInput) return;
    await navigator.clipboard.writeText(jwtInput);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const byteLength = new TextEncoder().encode(jwtInput).length;

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight">
              Encoded JSON Web Token (JWT)
            </h3>
            <p className="text-[11px] font-medium text-zinc-500">
              Paste your encoded token below. Updates preview in real-time.
            </p>
          </div>
        </div>

        {/* 100% Client-Side Privacy Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Client-Side &amp; Local Only</span>
        </div>
      </div>

      {/* Quick Sample Selector Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[11px] font-bold text-zinc-600 whitespace-nowrap">Try Samples:</span>
          {JWT_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onInputChange(sample.token)}
              className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-zinc-100 hover:bg-orange-50 hover:text-orange-600 border border-zinc-200/80 text-zinc-700 transition-all cursor-pointer whitespace-nowrap"
              title={sample.description}
            >
              {sample.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!jwtInput}
            onClick={handleCopyRaw}
            className="h-8 px-3 text-xs font-bold gap-1 rounded-xl cursor-pointer"
          >
            {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedToken ? "Copied!" : "Copy Token"}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={!jwtInput}
            onClick={onClear}
            className="h-8 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      {/* Textarea Input */}
      <div className="relative">
        <textarea
          rows={5}
          value={jwtInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          className="w-full p-4 rounded-2xl border border-zinc-200 bg-zinc-900 text-amber-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40 leading-relaxed break-all"
        />

        {/* Legend for color-coded parts */}
        <div className="flex items-center justify-between text-[11px] font-mono pt-2 px-1 text-zinc-500 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="text-rose-600 font-bold">Header</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              <span className="text-purple-600 font-bold">Payload</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
              <span className="text-cyan-600 font-bold">Signature</span>
            </span>
          </div>

          <div className="text-zinc-600">
            {jwtInput ? `${jwtInput.length} chars (${byteLength} B)` : "0 chars"}
          </div>
        </div>
      </div>
    </div>
  );
};
