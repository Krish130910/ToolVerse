"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Trash2, CheckSquare, Zap } from "lucide-react";

const FRAMEWORKS = ["Jest", "Vitest", "Pytest"];

export const AITestCaseGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState(`export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}`);
  const [framework, setFramework] = useState("Jest");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please paste code to generate tests for.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "ai-test-case-generator",
          prompt,
          options: { framework },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOutput(data.result);
      } else {
        setError(data.error || "Failed to generate tests.");
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
          <CheckSquare className="w-3.5 h-3.5" /> AI Unit &amp; Integration Test Suite Generator
        </span>

        <div className="flex items-center gap-2">
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs"
          >
            {FRAMEWORKS.map((f) => (
              <option key={f} value={f}>
                {f} Test Framework
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Paste Target Function / Component Code
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste function code to generate unit, edge case, and integration test suites..."
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
                  <Zap className="w-4 h-4 animate-spin" /> Generating Tests...
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" /> Generate {framework} Test Suite
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
              Generated {framework} Test File
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Tests"}
              </button>
            )}
          </div>

          <div className="w-full h-[360px] rounded-xl bg-[#121215] border border-zinc-800 p-4 text-zinc-200 font-mono text-xs overflow-auto shadow-inner">
            {output ? (
              <pre className="whitespace-pre-wrap leading-relaxed">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 text-center">
                <CheckSquare className="w-8 h-8 text-zinc-600" />
                <p>Paste code on the left to generate unit and edge test cases.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
