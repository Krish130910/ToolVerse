"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Trash2, Code2, Zap, AlertCircle } from "lucide-react";

export const AIRegexGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("Email validation regex");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe the pattern you want to match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "regex",
          prompt: prompt.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOutput(data.result);
      } else {
        setError(data.error || "Failed to generate regular expression.");
      }
    } catch (err) {
      setError("Connection error. Please verify your network and try again.");
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
    setPrompt("");
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Tool Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center gap-1.5 border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5" /> AI Regex Generator
          </span>
        </div>
        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
          Shortcut: Ctrl + Enter
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input Form */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="regex-prompt-input"
              className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2"
            >
              Describe Pattern in Plain English
            </label>
            <textarea
              id="regex-prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  handleGenerate();
                }
              }}
              placeholder="e.g. Email validation regex, phone numbers with country code, URL parser..."
              rows={6}
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all resize-none shadow-xs"
            />
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-zinc-400">
              <span>{prompt.length} characters</span>
              <span>English ➔ Regular Expression</span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" /> Generating Regex...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Regex
                </>
              )}
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

        {/* Right Column: AI Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Generated Regex &amp; Explanation
            </label>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Regex"}
              </button>
            )}
          </div>

          <div className="w-full h-[360px] rounded-xl bg-[#121215] border border-zinc-800 p-4 text-zinc-200 font-mono text-xs overflow-auto shadow-inner">
            {loading ? (
              <div className="space-y-3 animate-pulse p-2">
                <div className="h-4 bg-zinc-800 rounded-md w-3/4"></div>
                <div className="h-4 bg-zinc-800/60 rounded-md w-1/2"></div>
                <div className="h-4 bg-zinc-800/80 rounded-md w-5/6"></div>
                <div className="h-4 bg-zinc-800/40 rounded-md w-2/3"></div>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap leading-relaxed font-mono">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 text-center">
                <Code2 className="w-8 h-8 text-zinc-600" />
                <p>Click &quot;Generate Regex&quot; to inspect pattern and breakdown.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
