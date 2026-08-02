"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Trash2, Database, Zap } from "lucide-react";

const DIALECTS = ["PostgreSQL", "MySQL", "SQLite", "SQL Server"];

export const AISqlQueryGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("Find top 10 users with active subscriptions who signed up in the last 30 days");
  const [dialect, setDialect] = useState("PostgreSQL");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe the SQL query requirements.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: "ai-sql-query-generator",
          prompt,
          options: { dialect },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOutput(data.result);
      } else {
        setError(data.error || "Failed to generate SQL query.");
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
          <Database className="w-3.5 h-3.5" /> AI SQL Query &amp; Join Architect
        </span>

        <div className="flex items-center gap-2">
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs"
          >
            {DIALECTS.map((d) => (
              <option key={d} value={d}>
                {d} Dialect
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Describe SQL Query Requirements
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Join orders and users tables to calculate total revenue per country..."
              rows={8}
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
                  <Zap className="w-4 h-4 animate-spin" /> Compiling Query...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" /> Generate {dialect} Query
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
              Generated SQL Statement
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy SQL"}
              </button>
            )}
          </div>

          <div className="w-full h-[360px] rounded-xl bg-[#121215] border border-zinc-800 p-4 text-zinc-200 font-mono text-xs overflow-auto shadow-inner">
            {output ? (
              <pre className="whitespace-pre-wrap leading-relaxed">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 text-center">
                <Database className="w-8 h-8 text-zinc-600" />
                <p>Describe your database query in plain English.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
