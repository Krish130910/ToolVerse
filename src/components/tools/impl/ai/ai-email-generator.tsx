"use client";

import React, { useState } from "react";
import { Copy, Check, Trash2, Mail, Zap } from "lucide-react";

const EMAIL_TEMPLATES = [
  "Recruiter",
  "Client",
  "Internship",
  "Follow-up",
  "Job Application",
  "Meeting Request",
];

const TONES = ["Professional", "Friendly", "Persuasive", "Direct"];

export const AIEmailGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("Applying for Senior Frontend Engineer role with 4 years Next.js experience");
  const [template, setTemplate] = useState("Recruiter");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe the email context.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "ai-email-generator",
          prompt,
          options: { template, tone },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOutput(data.result);
      } else {
        setError(data.error || "Failed to generate email.");
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
          <Mail className="w-3.5 h-3.5" /> AI Professional Email Generator
        </span>
        <span className="text-xs text-zinc-400 font-mono">Template &amp; Tone Selection</span>
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
                className="w-full h-10 px-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs"
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
                className="w-full h-10 px-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs"
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
              placeholder="Describe email purpose, recipient, and main points..."
              rows={6}
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all resize-none shadow-xs"
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
                  <Zap className="w-4 h-4 animate-spin" /> Drafting Email...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" /> Draft Professional Email
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
              Drafted Email Output
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Email"}
              </button>
            )}
          </div>

          <div className="w-full h-[360px] rounded-xl bg-white border border-zinc-200/90 p-4 text-zinc-800 text-xs overflow-auto shadow-xs leading-relaxed font-sans">
            {output ? (
              <pre className="whitespace-pre-wrap font-sans text-xs">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-2 text-center">
                <Mail className="w-8 h-8 text-zinc-300" />
                <p>Select template and tone to generate email draft.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
