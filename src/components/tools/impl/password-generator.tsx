"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  KeyRound,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Lock,
  Sparkles,
} from "lucide-react";

export const PasswordGeneratorTool: React.FC = () => {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generatePassword = () => {
    let chars = "";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (excludeSimilar) {
      chars = chars.replace(/[il1Lo0O]/g, "");
    }

    if (!chars) {
      setPassword("Select at least one character set!");
      return;
    }

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
    setHistory((prev) => [result, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Calculate Entropy Score
  const getEntropyScore = () => {
    let pool = 0;
    if (includeLowercase) pool += 26;
    if (includeUppercase) pool += 26;
    if (includeNumbers) pool += 10;
    if (includeSymbols) pool += 32;
    if (pool === 0) return 0;
    return Math.round(length * Math.log2(pool));
  };

  const entropy = getEntropyScore();
  const strengthLabel =
    entropy > 80 ? "Extremely Secure" : entropy > 60 ? "Strong" : entropy > 40 ? "Moderate" : "Weak";
  const strengthColor =
    entropy > 80 ? "bg-emerald-500" : entropy > 60 ? "bg-orange-500" : entropy > 40 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="space-y-6">
      {/* Generated Password Result Banner */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4 bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
          <div className="font-mono font-bold text-lg sm:text-2xl text-zinc-900 tracking-wider break-all">
            {password}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generatePassword}
              className="p-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-700 transition-colors"
              title="Generate New Password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Button onClick={copyPassword} variant="default" className="text-xs font-bold gap-1.5 shadow-2xs">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-zinc-700">Password Strength: <strong className="text-zinc-900">{strengthLabel}</strong></span>
            <span className="font-mono text-zinc-500 text-[11px]">{entropy} bits entropy</span>
          </div>
          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (entropy / 100) * 100)}%` }}
              className={`h-full ${strengthColor} transition-all duration-300`}
            />
          </div>
        </div>
      </div>

      {/* Generator Controls */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-orange-500" />
          <span>Password Options & Rules</span>
        </h3>

        {/* Length Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-zinc-700">
            <span>Password Length:</span>
            <span className="font-mono text-orange-600">{length} characters</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        {/* Character Set Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <span>Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <span>Symbols (!@#$%^&*)</span>
          </label>
        </div>

        {/* Exclude Similar */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700 pt-1">
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
            className="rounded text-orange-500 focus:ring-orange-500"
          />
          <span>Exclude Similar Characters (i, l, 1, L, o, 0, O)</span>
        </label>
      </div>

      {/* Recent History */}
      {history.length > 1 && (
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Recently Generated Passwords</h4>
          <div className="space-y-2">
            {history.slice(1).map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono">
                <span className="truncate pr-4 text-zinc-800">{h}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(h);
                  }}
                  className="text-orange-600 hover:underline font-bold text-[11px]"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
