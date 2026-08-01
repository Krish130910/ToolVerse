"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Braces,
  Copy,
  Check,
  Download,
  AlertCircle,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Search,
} from "lucide-react";

export const JsonFormatterTool: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(`{\n  "name": "ToolVerse",\n  "status": "Production Ready",\n  "features": ["100% Client Side", "Sub-Millisecond", "Zero Ads"],\n  "version": 1.0\n}`);
  const [indent, setIndent] = useState<2 | 4>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"code" | "tree">("code");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonInput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button onClick={formatJson} variant="default" size="sm" className="text-xs font-bold gap-1 shadow-2xs">
            <Braces className="w-3.5 h-3.5" />
            <span>Beautify JSON</span>
          </Button>

          <Button onClick={minifyJson} variant="outline" size="sm" className="text-xs font-bold gap-1">
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </Button>

          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg text-xs font-semibold">
            <span className="text-zinc-500 px-1">Spaces:</span>
            <button onClick={() => setIndent(2)} className={`px-2 py-0.5 rounded ${indent === 2 ? "bg-white text-orange-600 shadow-2xs" : "text-zinc-600"}`}>2</button>
            <button onClick={() => setIndent(4)} className={`px-2 py-0.5 rounded ${indent === 4 ? "bg-white text-orange-600 shadow-2xs" : "text-zinc-600"}`}>4</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={copyJson} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy JSON"}</span>
          </Button>
          <Button onClick={downloadJson} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
            <Download className="w-3.5 h-3.5" />
            <span>Download .json</span>
          </Button>
        </div>
      </div>

      {/* Editor & Validation Status */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div className="flex items-center gap-2">
            {error ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                <AlertCircle className="w-4 h-4" />
                Invalid JSON Syntax: {error}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                Valid JSON Structure
              </span>
            )}
          </div>
        </div>

        <textarea
          rows={16}
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            try {
              JSON.parse(e.target.value);
              setError(null);
            } catch (err: any) {
              setError(err.message);
            }
          }}
          className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-900 text-sky-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
        />
      </div>
    </div>
  );
};
