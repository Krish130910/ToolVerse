"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Braces,
  Copy,
  Check,
  Download,
  AlertCircle,
  CheckCircle2,
  Minimize2,
  RotateCcw,
  FileCode,
  Info,
} from "lucide-react";

export const JsonFormatterTool: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(
    `{\n  "name": "ToolVerse",\n  "status": "Production Ready",\n  "features": [\n    "100% Client Side",\n    "Sub-Millisecond",\n    "Zero Ads"\n  ],\n  "version": 1.0\n}`
  );
  const [indent, setIndent] = useState<2 | 4>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState<{ lines: number; chars: number; bytes: number }>({
    lines: 0,
    chars: 0,
    bytes: 0,
  });

  const [, startTransition] = useTransition();

  // Debounced Live Validation to prevent main-thread lag on large JSON input
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        const trimmed = jsonInput.trim();
        const chars = jsonInput.length;
        const lines = trimmed ? jsonInput.split("\n").length : 0;
        const bytes = new Blob([jsonInput]).size;
        setStats({ lines, chars, bytes });

        if (!trimmed) {
          setError(null);
          return;
        }

        try {
          JSON.parse(jsonInput);
          setError(null);
        } catch (err: any) {
          setError(err?.message || "Invalid JSON syntax");
        }
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [jsonInput]);

  const formatJson = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Invalid JSON syntax");
    }
  };

  const minifyJson = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Invalid JSON syntax");
    }
  };

  const copyJson = async () => {
    if (!jsonInput) return;
    try {
      await navigator.clipboard.writeText(jsonInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const downloadJson = () => {
    if (!jsonInput) return;
    const blob = new Blob([jsonInput], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const handleReset = () => {
    setJsonInput("");
    setError(null);
  };

  const formatByteSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Controls Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between flex-wrap gap-3 w-full min-w-0">
        <div className="flex items-center gap-2 flex-wrap min-w-0 w-full sm:w-auto">
          <Button
            onClick={formatJson}
            variant="default"
            size="sm"
            className="text-xs font-bold gap-1.5 shadow-2xs bg-orange-500 hover:bg-orange-600 text-white flex-1 sm:flex-initial"
          >
            <Braces className="w-3.5 h-3.5" />
            <span>Beautify JSON</span>
          </Button>

          <Button
            onClick={minifyJson}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs flex-1 sm:flex-initial"
          >
            <Minimize2 className="w-3.5 h-3.5 text-orange-500" />
            <span>Minify</span>
          </Button>

          {/* Indent Selector */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 text-xs font-semibold">
            <span className="text-zinc-500 px-1 text-[11px]">Indent:</span>
            <button
              type="button"
              onClick={() => setIndent(2)}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer text-xs ${
                indent === 2 ? "bg-white text-orange-600 shadow-2xs font-bold" : "text-zinc-600"
              }`}
            >
              2 Sp
            </button>
            <button
              type="button"
              onClick={() => setIndent(4)}
              className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer text-xs ${
                indent === 4 ? "bg-white text-orange-600 shadow-2xs font-bold" : "text-zinc-600"
              }`}
            >
              4 Sp
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap min-w-0 w-full sm:w-auto justify-end">
          <Button
            onClick={copyJson}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs flex-1 sm:flex-initial"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span>Copy JSON</span>
              </>
            )}
          </Button>

          <Button
            onClick={downloadJson}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs flex-1 sm:flex-initial"
          >
            <Download className="w-3.5 h-3.5 text-orange-500" />
            <span>Download .json</span>
          </Button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Clear Editor"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Live Validation Card */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4 min-w-0 w-full overflow-hidden">
        {/* Header Bar with Live Validation Status */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 min-w-0 flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileCode className="w-4 h-4 text-orange-500 shrink-0" />
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              JSON Document Workspace
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!jsonInput.trim() ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                Empty Document
              </span>
            ) : error ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Invalid JSON: {error}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Valid JSON Structure
              </span>
            )}
          </div>
        </div>

        {/* Textarea Area */}
        <div className="relative min-h-[420px] w-full min-w-0">
          <textarea
            rows={18}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste or type raw JSON data here..."
            spellCheck={false}
            className="w-full h-full min-h-[420px] p-4 rounded-xl border border-zinc-200 bg-zinc-900 text-sky-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-orange-400 transition-all resize-y selection:bg-orange-500/30 selection:text-orange-200 overflow-x-auto whitespace-pre-wrap break-all min-w-0"
          />
        </div>

        {/* Footer Statistics */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-zinc-500 text-[11px] font-mono flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-700 font-bold">
              {stats.lines} Lines
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-700 font-bold">
              {stats.chars} Characters
            </span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-700 font-bold">
              {formatByteSize(stats.bytes)}
            </span>
          </div>

          <span className="text-[10px] text-zinc-400">
            Native Client Parsing • Zero Backend Overhead
          </span>
        </div>
      </div>
    </div>
  );
};

