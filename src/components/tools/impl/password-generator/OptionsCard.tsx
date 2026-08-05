"use client";

import React from "react";
import { PasswordOptions, PasswordMode } from "@/lib/password/types";
import { KeyRound } from "lucide-react";

interface OptionsCardProps {
  options: PasswordOptions;
  onChangeOptions: (updater: (prev: PasswordOptions) => PasswordOptions) => void;
}

export const OptionsCard: React.FC<OptionsCardProps> = ({
  options,
  onChangeOptions,
}) => {
  const setMode = (mode: PasswordMode) => {
    onChangeOptions((prev) => ({ ...prev, mode }));
  };

  const updateField = <K extends keyof PasswordOptions>(
    field: K,
    value: PasswordOptions[K]
  ) => {
    onChangeOptions((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header & Mode Switcher */}
      <div className="space-y-3 border-b border-zinc-100 pb-5">
        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-orange-500" />
          <span>Generator Mode & Controls</span>
        </h3>

        {/* Mode Tabs (Full-width clean grid) */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-zinc-100/80 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode("random")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              options.mode === "random"
                ? "bg-white text-zinc-900 shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Random
          </button>
          <button
            type="button"
            onClick={() => setMode("pronounceable")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              options.mode === "pronounceable"
                ? "bg-white text-zinc-900 shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Pronounceable
          </button>
          <button
            type="button"
            onClick={() => setMode("passphrase")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              options.mode === "passphrase"
                ? "bg-white text-zinc-900 shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Passphrase
          </button>
        </div>
      </div>

      {/* Mode-Specific Settings */}
      {options.mode === "passphrase" ? (
        /* Passphrase Controls */
        <div className="space-y-5">
          {/* Word Count Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-800">
              <span>Number of Words:</span>
              <span className="font-mono text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200 font-bold">
                {options.wordCount} words
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={options.wordCount}
              onChange={(e) => updateField("wordCount", Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>2 words</span>
              <span>4 words (Recommended)</span>
              <span>10 words</span>
            </div>
          </div>

          {/* Custom Separator Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800">Word Separator:</label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={options.customSeparator}
                onChange={(e) => updateField("customSeparator", e.target.value)}
                placeholder="-"
                className="w-20 h-9 px-3 rounded-xl border border-zinc-200 bg-zinc-50 font-mono text-xs text-center font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-500"
              />
              <div className="flex items-center gap-1.5">
                {["-", "_", ".", "#", " "].map((sep) => (
                  <button
                    key={sep}
                    type="button"
                    onClick={() => updateField("customSeparator", sep)}
                    className={`h-9 px-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      options.customSeparator === sep
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {sep === " " ? "space" : sep}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Passphrase Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => updateField("includeUppercase", e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
              />
              <span>Capitalize Words</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => updateField("includeNumbers", e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
              />
              <span>Append Random Number</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => updateField("includeSymbols", e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
              />
              <span>Append Special Symbol</span>
            </label>
          </div>
        </div>
      ) : (
        /* Random & Pronounceable Mode Controls */
        <div className="space-y-5">
          {/* Length Slider + Quick Preset Buttons */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-800">
              <span>Password Length:</span>
              <span className="font-mono text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200 font-bold">
                {options.length} characters
              </span>
            </div>

            <input
              type="range"
              min="4"
              max="128"
              value={options.length}
              onChange={(e) => updateField("length", Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />

            {/* Quick Length Presets */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-zinc-400 mr-1">Presets:</span>
              {[12, 16, 24, 32, 64].map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => updateField("length", len)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    options.length === len
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Character Set Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => updateField("includeUppercase", e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
              />
              <span>Uppercase (A–Z)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => updateField("includeLowercase", e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
              />
              <span>Lowercase (a–z)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => updateField("includeNumbers", e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
              />
              <span>Numbers (0–9)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => updateField("includeSymbols", e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
              />
              <span>Symbols (!@#$%^&*)</span>
            </label>
          </div>

          {/* Exclude Options */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 hover:text-zinc-900">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => updateField("excludeSimilar", e.target.checked)}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
              />
              <span>Exclude Similar Characters (O, 0, I, l, 1)</span>
            </label>

            {options.mode === "random" && (
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 hover:text-zinc-900">
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={(e) => updateField("excludeAmbiguous", e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
                />
                <span>Exclude Ambiguous Symbols ({`{ } [ ] ( ) / \\ ' " ~ , ; : . < >`})</span>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
