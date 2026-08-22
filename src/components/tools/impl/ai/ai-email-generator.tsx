"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, Trash2, Mail, Zap, AlertCircle, Clock, Square } from "lucide-react";
import { AISetupScreen } from "./ai-setup-screen";

const EMAIL_TEMPLATES = [
  "Recruiter",
  "Client",
  "Internship",
  "Follow-up",
  "Job Application",
  "Meeting Request",
  "Project Status",
  "Incident Report",
];

const TONES = ["Professional", "Friendly", "Persuasive", "Direct", "Urgent"];

export const AIEmailGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState(
    "Applying for Senior Frontend Engineer role with 4 years Next.js experience, highlighting full-stack SaaS projects and performance optimization."
  );
  const [template, setTemplate] = useState("Recruiter");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isKeyMissing, setIsKeyMissing] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("toolverse_ai_email_generator");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.prompt) setPrompt(parsed.prompt);
        if (parsed.output) setOutput(parsed.output);
        if (parsed.template) setTemplate(parsed.template);
        if (parsed.tone) setTone(parsed.tone);
        setHasHistory(true);
      } catch (err) {
        // Ignore parsing errors
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe the email context and requirements.");
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
          tool: "ai-email-generator",
          prompt: prompt.trim(),
          options: { template, tone },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setOutput(data.result);
        localStorage.setItem(
          "toolverse_ai_email_generator",
          JSON.stringify({ prompt, output: data.result, template, tone })
        );
        setHasHistory(true);
      } else {
        if (res.status === 401 || data.errorType === "API_KEY_REQUIRED") {
          setIsKeyMissing(true);
        } else {
          setError(data.message || data.error || "Failed to generate email.");
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        setError("Connection error. Please try again.");
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
    localStorage.removeItem("toolverse_ai_email_generator");
    setHasHistory(false);
  };

  if (isKeyMissing) {
    return (
      <AISetupScreen
        toolName="AI Email Generator"
        message="Start Ollama locally ('ollama run llama3.2') or configure an AI key in .env.local to enable AI generation."
      />
    );
  }

  return (
    <div className="space-y-6 text-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center gap-1.5 border border-orange-500/20">
            <Mail className="w-3.5 h-3.5" /> AI Professional Email Generator
          </span>
          {hasHistory && (
            <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> Session Saved
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-400 font-mono hidden sm:inline">Context-Aware AI Drafting</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Template
              </label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs cursor-pointer"
              >
                {EMAIL_TEMPLATES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs cursor-pointer"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Key Details / Points to Include
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  handleGenerate();
                }
              }}
              placeholder="Describe email purpose, recipient context, and main points to convey..."
              rows={6}
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all resize-none shadow-xs"
            />
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-zinc-400">
              <span>{prompt.length} characters</span>
              <span>Subject &amp; Body Formatted</span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {loading ? (
              <button
                type="button"
                onClick={handleStop}
                className="flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" /> Stop Drafting
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Mail className="w-4 h-4" /> Draft Professional Email
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Drafted Email Output
            </label>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Email"}
              </button>
            )}
          </div>

          <div className="w-full h-[360px] rounded-xl bg-white border border-zinc-200/90 p-4 text-zinc-800 text-xs overflow-auto shadow-xs leading-relaxed font-sans">
            {loading ? (
              <div className="space-y-3 animate-pulse p-2">
                <div className="h-4 bg-zinc-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-zinc-200/60 rounded-md w-1/2"></div>
                <div className="h-4 bg-zinc-200/80 rounded-md w-5/6"></div>
                <div className="h-4 bg-zinc-200/40 rounded-md w-2/3"></div>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap font-sans text-xs">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-2 text-center">
                <Mail className="w-8 h-8 text-zinc-300" />
                <p>Select template and tone to generate professional email draft.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

