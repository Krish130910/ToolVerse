"use client";

import React, { useState, useEffect, useRef } from "react";
import { GitCommit, Copy, Check, Trash2, AlertCircle, Clock, Square } from "lucide-react";
import { AISetupScreen } from "./ai-setup-screen";

const COMMIT_TYPES = [
  { id: "all", label: "Auto Detect Type" },
  { id: "feat", label: "feat: New Feature" },
  { id: "fix", label: "fix: Bug Fix" },
  { id: "docs", label: "docs: Documentation" },
  { id: "refactor", label: "refactor: Code Refactoring" },
  { id: "perf", label: "perf: Performance Optimization" },
  { id: "style", label: "style: Formatting & Style" },
  { id: "test", label: "test: Unit / Integration Tests" },
  { id: "chore", label: "chore: Maintenance & Dependencies" },
];

export const AICommitMessageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("Added Resend email notification fallback and rate limiting middleware");
  const [commitType, setCommitType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isKeyMissing, setIsKeyMissing] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("toolverse_ai_commit_message");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.prompt) setPrompt(parsed.prompt);
        if (parsed.output) setOutput(parsed.output);
        if (parsed.commitType) setCommitType(parsed.commitType);
        setHasHistory(true);
      } catch (err) {
        // Ignore parsing errors
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe the code changes or paste a git diff.");
      return;
    }

    setLoading(true);
    setError("");
    setIsKeyMissing(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          tool: "ai-commit-message-generator",
          prompt: prompt.trim(),
          options: {
            commitType,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setOutput(data.result);
        localStorage.setItem(
          "toolverse_ai_commit_message",
          JSON.stringify({ prompt, output: data.result, commitType })
        );
        setHasHistory(true);
      } else {
        if (res.status === 401 || data.errorType === "API_KEY_REQUIRED") {
          setIsKeyMissing(true);
        } else {
          setError(data.message || data.error || "Failed to generate Conventional Commit message.");
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        setError("Connection error. Please check your network and try again.");
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
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
    localStorage.removeItem("toolverse_ai_commit_message");
    setHasHistory(false);
  };

  if (isKeyMissing) {
    return (
      <AISetupScreen
        toolName="AI Commit Message Generator"
        message="Start Ollama locally ('ollama run llama3.2') or configure an AI key in .env.local to enable AI generation."
      />
    );
  }

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center gap-1.5 border border-orange-500/20">
            <GitCommit className="w-3.5 h-3.5" /> AI Commit Message Generator
          </span>
          {hasHistory && (
            <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> Session Saved
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
          Conventional Commits Standard
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="commit-type-select"
              className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2"
            >
              Commit Type Filter (Optional)
            </label>
            <select
              id="commit-type-select"
              value={commitType}
              onChange={(e) => setCommitType(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all shadow-xs"
            >
              {COMMIT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="commit-prompt-input"
              className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2"
            >
              Git Diff or Code Changes Description
            </label>
            <textarea
              id="commit-prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  handleGenerate();
                }
              }}
              placeholder="Paste git diff output or summarize changes made (e.g. Added JWT token expiration checks)..."
              rows={6}
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all resize-none shadow-xs"
            />
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-zinc-400">
              <span>{prompt.length} characters</span>
              <span>Conventional Commits Format</span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            {loading ? (
              <button
                type="button"
                onClick={handleStop}
                className="flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" /> Stop Generation
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-[0.98]"
              >
                <GitCommit className="w-4 h-4" /> Generate Commit Message
              </button>
            )}

            <button
              type="button"
              onClick={handleClear}
              className="h-11 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-zinc-400" /> Clear
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Formatted Commit Message
            </label>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Commit Message"}
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
                <GitCommit className="w-8 h-8 text-zinc-600" />
                <p>Describe your code changes to generate Conventional Commit messages.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
