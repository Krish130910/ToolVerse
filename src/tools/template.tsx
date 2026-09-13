"use client";

import React, { useState } from "react";
import { Copy, Check, Trash2, Zap, AlertCircle } from "lucide-react";

/**
 * ==============================================================================
 * TOOLVERSE STANDARDIZED TOOL TEMPLATE
 * ==============================================================================
 * OpenCode / AI agents: Use this structure to implement new developer tools.
 * 
 * Instructions:
 * 1. Replace "ToolTemplate" with your specific tool name (e.g., "CsvToJsonConverterTool").
 * 2. Configure input state, processing function, and output state.
 * 3. Save the new component in: src/components/tools/impl/<slug>.tsx
 * 4. Add the component to src/tools/registry.ts
 * 5. Add metadata entry to src/lib/data.ts (FEATURED_TOOLS array).
 */

export const ToolTemplate: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Implement tool logic here
      const result = input.trim(); // Replace with transformation logic
      setOutput(result);
    } catch (err: any) {
      setError(err.message || "An error occurred while processing.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center gap-1.5 border border-orange-500/20">
            <Zap className="w-3.5 h-3.5" /> Sample Tool Name
          </span>
        </div>
        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
          Fast In-Browser Utility
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Input Data
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your data here..."
              rows={8}
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all resize-none shadow-xs font-mono"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleProcess}
              disabled={!input.trim() || loading}
              className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" /> Process Data
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="h-11 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-zinc-400" /> Clear
            </button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Output Result
            </label>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Result"}
              </button>
            )}
          </div>

          <div className="w-full h-[360px] rounded-xl bg-[#121215] border border-zinc-800 p-4 text-zinc-200 font-mono text-xs overflow-auto shadow-inner">
            {output ? (
              <pre className="whitespace-pre-wrap leading-relaxed font-mono">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 text-center">
                <Zap className="w-8 h-8 text-zinc-600" />
                <p>Output will appear here once processed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
