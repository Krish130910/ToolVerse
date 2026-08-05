"use client";

import React from "react";
import { LoremOptions, LoremTheme, LoremMode, OutputFormat } from "@/lib/lorem/types";
import { Sparkles, Terminal, Rocket, Cpu, BookOpen, Layers, Code2 } from "lucide-react";

interface ControlsCardProps {
  options: LoremOptions;
  onChangeOptions: (updater: (prev: LoremOptions) => LoremOptions) => void;
}

const THEME_OPTIONS: { id: LoremTheme; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "classic", label: "Classic Latin", icon: BookOpen },
  { id: "developer", label: "Developer", icon: Terminal },
  { id: "startup", label: "Startup & SaaS", icon: Rocket },
  { id: "ai", label: "AI & Machine Learning", icon: Cpu },
  { id: "english", label: "Natural English", icon: Sparkles },
];

const MODE_OPTIONS: { id: LoremMode; label: string }[] = [
  { id: "paragraphs", label: "Paragraphs" },
  { id: "words", label: "Words" },
  { id: "sentences", label: "Sentences" },
  { id: "list_unordered", label: "Bullet List" },
  { id: "list_ordered", label: "Numbered List" },
];

const FORMAT_OPTIONS: { id: OutputFormat; label: string }[] = [
  { id: "text", label: "Plain Text" },
  { id: "html", label: "HTML" },
  { id: "markdown", label: "Markdown" },
];

export const ControlsCard: React.FC<ControlsCardProps> = ({
  options,
  onChangeOptions,
}) => {
  const updateField = <K extends keyof LoremOptions>(
    field: K,
    value: LoremOptions[K]
  ) => {
    onChangeOptions((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6">
      {/* 1. Vocabulary Theme Selection */}
      <div className="space-y-3 border-b border-zinc-100 pb-5">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-500" />
          <span>Vocabulary Theme</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {THEME_OPTIONS.map((theme) => {
            const Icon = theme.icon;
            const isSelected = options.theme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateField("theme", theme.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-orange-500 text-white shadow-2xs"
                    : "bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Generation Mode Pills (Full-width clean grid) */}
      <div className="space-y-2 border-b border-zinc-100 pb-5">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
          Generation Mode
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1.5 bg-zinc-100/80 rounded-2xl">
          {MODE_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => updateField("mode", m.id)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center truncate ${
                options.mode === m.id
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Output Code Format Pills */}
      <div className="space-y-2 border-b border-zinc-100 pb-5">
        <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-zinc-500" />
          <span>Output Format</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-zinc-100/80 rounded-2xl">
          {FORMAT_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => updateField("format", f.id)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                options.format === f.id
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Quantity Slider */}
      <div className="space-y-2 border-b border-zinc-100 pb-5">
        <div className="flex justify-between items-center text-xs font-bold text-zinc-800">
          <span>Quantity ({options.mode.replace("_", " ")}):</span>
          <span className="font-mono text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200 font-bold">
            {options.count} {options.mode.replace("list_", "")}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max={options.mode === "words" ? 250 : 50}
          value={options.count}
          onChange={(e) => updateField("count", Number(e.target.value))}
          className="w-full accent-orange-500 cursor-pointer"
        />
      </div>

      {/* 5. Minimal Checkbox Toggles & Seed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
          <input
            type="checkbox"
            checked={options.startWithLorem}
            onChange={(e) => updateField("startWithLorem", e.target.checked)}
            className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
          />
          <span>Start with prefix</span>
        </label>

        <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
          <input
            type="checkbox"
            checked={options.includeFormatting}
            onChange={(e) => updateField("includeFormatting", e.target.checked)}
            className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
          />
          <span>Rich inline formatting</span>
        </label>

        {options.mode === "paragraphs" && (
          <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-50 cursor-pointer text-xs font-bold text-zinc-800 transition-colors">
            <input
              type="checkbox"
              checked={options.addHeadings}
              onChange={(e) => updateField("addHeadings", e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
            />
            <span>Include Headings</span>
          </label>
        )}

      </div>
    </div>
  );
};
