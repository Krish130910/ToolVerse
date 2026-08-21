"use client";

import React, { useState, useMemo, useCallback } from "react";
import { parseLogText } from "@/lib/log-explainer/parser";
import { LogAnalysisResult } from "@/lib/log-explainer/types";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Search,
  CheckCircle2,
  Clock,
  Globe,
  Hash,
  FileCode,
  HelpCircle,
  CheckSquare,
} from "lucide-react";

const SAMPLE_LOGS = [
  {
    name: "ECONNREFUSED",
    log: `2026-08-21 10:42:31 INFO Server starting up on port 3000\n2026-08-21 10:42:35 ERROR ECONNREFUSED 127.0.0.1:5432\n2026-08-21 10:42:35 WARN Database connection failed`,
  },
  {
    name: "HTTP 500",
    log: `2026-08-21T14:15:09Z [ERROR] HTTP/1.1 500 Internal Server Error at /api/v1/checkout\nUnhandled promise rejection: Cannot read property 'id' of undefined at src/app/checkout.ts:84`,
  },
  {
    name: "HTTP 404",
    log: `2026-08-21 11:20:00 [WARN] 404 Not Found GET /api/users/99999 from 192.168.1.50:8080`,
  },
  {
    name: "ENOENT",
    log: `ERROR ENOENT: no such file or directory, open '/var/log/config.json'`,
  },
  {
    name: "EADDRINUSE",
    log: `2026-08-21 09:00:12 FATAL Error: listen EADDRINUSE: address already in use :::3000`,
  },
];

export const LogExplainerTool: React.FC = () => {
  const [inputLog, setInputLog] = useState<string>(SAMPLE_LOGS[0].log);
  const [analyzedResult, setAnalyzedResult] = useState<LogAnalysisResult | null>(() =>
    parseLogText(SAMPLE_LOGS[0].log)
  );
  const [copied, setCopied] = useState<boolean>(false);

  const hasInput = useMemo(() => inputLog.trim().length > 0, [inputLog]);

  const handleAnalyze = useCallback(() => {
    if (!hasInput) return;
    const result = parseLogText(inputLog);
    setAnalyzedResult(result);
  }, [inputLog, hasInput]);

  const handleClear = useCallback(() => {
    setInputLog("");
    setAnalyzedResult(null);
    setCopied(false);
  }, []);

  const handleLoadSample = useCallback((sampleText: string) => {
    setInputLog(sampleText);
    const result = parseLogText(sampleText);
    setAnalyzedResult(result);
  }, []);

  const handleCopyExplanation = useCallback(() => {
    if (!analyzedResult || !analyzedResult.formattedCopyText) return;
    navigator.clipboard.writeText(analyzedResult.formattedCopyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [analyzedResult]);

  return (
    <div className="space-y-4 w-full">
      {/* Main Grid: Input Card (Left) & Output Result (Right) - 50/50 Desktop Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Left Column: Input Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full space-y-3.5">
          <div className="space-y-3.5 flex-1 flex flex-col">
            {/* Header & Quick Samples */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 flex-wrap gap-2">
              <label htmlFor="log-input-area" className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-orange-500" />
                <span>Log Input</span>
              </label>

              {/* Sample Preset Chips */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-zinc-400 font-medium mr-1">Samples:</span>
                {SAMPLE_LOGS.slice(0, 3).map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => handleLoadSample(sample.log)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 hover:bg-orange-50 hover:text-orange-600 border border-zinc-200/80 transition-colors cursor-pointer"
                    title={`Load ${sample.name} example`}
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Textarea */}
            <div className="space-y-1.5 flex-1 flex flex-col">
              <textarea
                id="log-input-area"
                rows={12}
                value={inputLog}
                onChange={(e) => setInputLog(e.target.value)}
                placeholder="Paste your log here..."
                className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 text-zinc-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 resize-y leading-relaxed flex-1 min-h-[220px]"
                aria-label="Paste application or server log text here"
              />
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1">
                <span>{inputLog.length.toLocaleString()} characters</span>
                <span>{inputLog.trim() ? inputLog.split("\n").length : 0} lines</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={!hasInput}
              variant="default"
              size="sm"
              className="text-xs font-bold gap-1.5 shadow-2xs cursor-pointer h-9"
              aria-label="Analyze log content"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Log</span>
            </Button>

            <Button
              type="button"
              onClick={handleClear}
              disabled={!hasInput && !analyzedResult}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 cursor-pointer border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-9"
              aria-label="Clear log input and results"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Clear</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Structured Result */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
          {/* Output Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200/60">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Structured Explanation</h3>
                <p className="text-[11px] text-zinc-500">Extracted metadata & rule guidance</p>
              </div>
            </div>

            {/* Copy Explanation Button */}
            <Button
              type="button"
              onClick={handleCopyExplanation}
              disabled={!analyzedResult}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 cursor-pointer border-zinc-200 hover:border-orange-300 hover:bg-orange-50/50 h-8"
              aria-label="Copy structured log explanation text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Copy Explanation</span>
                </>
              )}
            </Button>
          </div>

          {analyzedResult ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* 1. Log Summary Box */}
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                  analyzedResult.isKnownPattern
                    ? "bg-zinc-50 border-zinc-200/90 text-zinc-900"
                    : "bg-zinc-50/80 border-zinc-200 text-zinc-800"
                }`}
              >
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Log Summary</span>
                </div>
                <p className="font-semibold text-zinc-900 text-sm">{analyzedResult.summary}</p>
              </div>

              {/* 2. Detected Information Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Detected Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Log Level */}
                  {analyzedResult.extracted.logLevel && (
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs flex items-center justify-between">
                      <span className="text-zinc-500 font-medium">Log Level</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          analyzedResult.extracted.logLevel === "ERROR" ||
                          analyzedResult.extracted.logLevel === "FATAL" ||
                          analyzedResult.extracted.logLevel === "CRITICAL"
                            ? "bg-red-100 text-red-700 border border-red-200/80"
                            : analyzedResult.extracted.logLevel === "WARN"
                            ? "bg-amber-100 text-amber-800 border border-amber-200/80"
                            : "bg-zinc-100 text-zinc-800 border border-zinc-200/80"
                        }`}
                      >
                        {analyzedResult.extracted.logLevel}
                      </span>
                    </div>
                  )}

                  {/* Error Pattern - Full width card to avoid truncation */}
                  {analyzedResult.extracted.errorPattern && (
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs flex items-center justify-between sm:col-span-2 gap-2">
                      <span className="text-zinc-500 font-medium shrink-0">Error Type</span>
                      <span className="font-mono font-bold text-zinc-900 text-[11px] text-right break-words">
                        {analyzedResult.extracted.errorPattern}
                      </span>
                    </div>
                  )}

                  {/* Timestamp */}
                  {analyzedResult.extracted.timestamp && (
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs flex items-center justify-between">
                      <span className="text-zinc-500 font-medium flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>Timestamp</span>
                      </span>
                      <span className="font-mono font-semibold text-zinc-800 text-[11px]">
                        {analyzedResult.extracted.timestamp}
                      </span>
                    </div>
                  )}

                  {/* HTTP Status */}
                  {analyzedResult.extracted.httpStatus && (
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs flex items-center justify-between">
                      <span className="text-zinc-500 font-medium flex items-center gap-1 shrink-0">
                        <Globe className="w-3 h-3 text-zinc-400" />
                        <span>HTTP Status</span>
                      </span>
                      <span className="font-mono font-bold text-zinc-900 text-[11px]">
                        {analyzedResult.extracted.httpStatus}
                      </span>
                    </div>
                  )}

                  {/* Host / IP */}
                  {analyzedResult.extracted.ipOrHost && (
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs flex items-center justify-between">
                      <span className="text-zinc-500 font-medium flex items-center gap-1 shrink-0">
                        <Globe className="w-3 h-3 text-zinc-400" />
                        <span>Host / IP</span>
                      </span>
                      <span className="font-mono font-semibold text-zinc-900 text-[11px]">
                        {analyzedResult.extracted.ipOrHost}
                      </span>
                    </div>
                  )}

                  {/* Port */}
                  {analyzedResult.extracted.port && (
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs flex items-center justify-between">
                      <span className="text-zinc-500 font-medium flex items-center gap-1 shrink-0">
                        <Hash className="w-3 h-3 text-zinc-400" />
                        <span>Port</span>
                      </span>
                      <span className="font-mono font-bold text-zinc-900 text-[11px]">
                        {analyzedResult.extracted.port}
                      </span>
                    </div>
                  )}

                  {/* File Path */}
                  {analyzedResult.extracted.filePath && (
                    <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs flex items-center justify-between sm:col-span-2 gap-2">
                      <span className="text-zinc-500 font-medium flex items-center gap-1 shrink-0">
                        <FileCode className="w-3 h-3 text-zinc-400" />
                        <span>File Path</span>
                      </span>
                      <span className="font-mono font-semibold text-zinc-900 text-[11px] break-all text-right">
                        {analyzedResult.extracted.filePath}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Likely Cause */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Likely Cause</span>
                </div>
                <p className="text-zinc-700 leading-relaxed">{analyzedResult.cause}</p>
              </div>

              {/* 4. What to Check */}
              <div className="space-y-2 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
                <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-zinc-700" />
                  <span>What to Check</span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {analyzedResult.checks.map((check, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-zinc-700 leading-relaxed">
                      <span className="font-mono font-bold text-zinc-900 text-[11px] bg-zinc-200 px-1.5 py-0.2 rounded shrink-0">
                        {idx + 1}
                      </span>
                      <span>{check}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-zinc-100 text-zinc-500">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-zinc-800">No Log Analyzed Yet</h4>
              <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                Paste application log text on the left and click &quot;Analyze Log&quot; to inspect errors.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
