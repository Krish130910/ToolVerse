"use client";

import React from "react";
import { EntropyResult, PolicyCheck, CharBreakdown } from "@/lib/password/types";
import { ShieldCheck, Clock, CheckCircle2, XCircle, Info, Lock } from "lucide-react";

interface StrengthCardProps {
  entropyResult: EntropyResult;
  policies: PolicyCheck[];
  breakdown: CharBreakdown;
}

export const StrengthCard: React.FC<StrengthCardProps> = ({
  entropyResult,
  policies,
  breakdown,
}) => {
  const { entropy, strengthLabel, strengthColor, badgeBg, crackTime } = entropyResult;

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
          <span>Security Analysis & Strength Meter</span>
        </span>
        <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${badgeBg}`}>
          {strengthLabel}
        </span>
      </h3>

      {/* Strength Meter Bar & Bits */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
          <span>Shannon Entropy:</span>
          <span className="font-mono text-zinc-900 font-bold">{entropy} bits</span>
        </div>
        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200/60">
          <div
            style={{ width: `${Math.min(100, Math.max(5, (entropy / 120) * 100))}%` }}
            className={`h-full ${strengthColor} rounded-full transition-all duration-500`}
          />
        </div>
      </div>

      {/* Metrics Row: Estimated Crack Time & Character Composition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Estimated Crack Time Card */}
        <div className="p-4 bg-zinc-50 border border-zinc-200/90 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>Est. Offline Crack Time</span>
          </div>
          <div className="text-lg font-mono font-bold text-zinc-900 tracking-tight">
            {crackTime}
          </div>
          <p className="text-[10px] text-zinc-400">
            Based on 100 Billion guesses/sec GPU attack
          </p>
        </div>

        {/* Character Composition Breakdown */}
        <div className="p-4 bg-zinc-50 border border-zinc-200/90 rounded-2xl space-y-2">
          <div className="text-xs font-bold text-zinc-600">Character Distribution</div>
          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono font-bold">
            <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded-lg text-zinc-700">
              Upper: <strong className="text-orange-600">{breakdown.uppercase}</strong>
            </span>
            <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded-lg text-zinc-700">
              Lower: <strong className="text-orange-600">{breakdown.lowercase}</strong>
            </span>
            <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded-lg text-zinc-700">
              Nums: <strong className="text-orange-600">{breakdown.numbers}</strong>
            </span>
            <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded-lg text-zinc-700">
              Syms: <strong className="text-orange-600">{breakdown.symbols}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Password Policy Checklist */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
          Security Policy Checklist
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {policies.map((p) => (
            <div
              key={p.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                p.passed
                  ? "bg-emerald-50/50 border-emerald-200/80 text-emerald-900"
                  : "bg-zinc-50 border-zinc-200/80 text-zinc-500"
              }`}
            >
              <div className="flex items-center gap-2">
                {p.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
                <span>{p.label}</span>
              </div>
              <span className="font-mono text-[10px] uppercase font-bold">
                {p.passed ? "Pass" : "Fail"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Password Security & Breach Note */}
      <div className="p-4 bg-orange-50/60 border border-orange-200/80 rounded-2xl space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
          <Lock className="w-4 h-4 text-orange-600 shrink-0" />
          <span>Privacy & Security Note</span>
        </div>
        <p className="text-xs text-orange-950/80 leading-relaxed">
          Passwords are generated 100% locally in your browser using standard Web Crypto API (<code>crypto.getRandomValues</code>). Zero external network requests are sent. Never reuse passwords across multiple sensitive services.
        </p>
      </div>
    </div>
  );
};
