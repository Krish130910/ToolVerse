"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Trash2, Binary, Zap } from "lucide-react";

export const AIJsonAnalyzer: React.FC = () => {
  const [prompt, setPrompt] = useState(`{
  "user": {
    "id": "usr_99812",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "roles": ["admin", "developer"],
    "settings": { "theme": "dark", "notifications": true }
  }
}`);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please paste a JSON string.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: "ai-json-analyzer", prompt }),
      });

      const data = await res.json();
      if (data.success) {
        setOutput(data.result);
      } else {
        setError(data.error || "Failed to analyze JSON.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80">
        <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center gap-1.5 border border-orange-500/20">
          <Binary className="w-3.5 h-3.5" /> AI JSON Inspector &amp; TypeScript Interface Generator
        </span>
        <span className="text-xs text-zinc-400 font-mono">Structural Analysis</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Paste JSON Payload
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste raw or unformatted JSON..."
              rows={8}
              className="w-full p-3.5 rounded-xl bg-[#121215] border border-zinc-800 text-zinc-200 font-mono text-xs placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all resize-none shadow-xs"
            />
          </div>

          {error && <p className="text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-lg">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" /> Analyzing JSON...
                </>
              ) : (
                <>
                  <Binary className="w-4 h-4" /> Analyze Structure &amp; Generate TS Types
                </>
              )}
            </button>
            <button
              onClick={() => setPrompt("")}
              className="h-11 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-4 h-4 text-zinc-400" /> Clear
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              JSON Analysis &amp; TypeScript Interfaces
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Result"}
              </button>
            )}
          </div>

          <div className="w-full h-[360px] rounded-xl bg-white border border-zinc-200/90 p-4 text-zinc-800 text-xs font-sans overflow-auto shadow-xs leading-relaxed">
            {output ? (
              <pre className="whitespace-pre-wrap leading-relaxed font-sans text-xs">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-2 text-center">
                <Binary className="w-8 h-8 text-zinc-300" />
                <p>Paste JSON payload on the left to generate structural analysis and TypeScript interfaces.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
