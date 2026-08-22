"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, Trash2, Square, RotateCcw, Clock, Zap } from "lucide-react";
import { AI_TOOLS_REGISTRY } from "@/lib/ai-config";
import { AISetupScreen } from "./ai-setup-screen";

interface AIToolShellProps {
  toolSlug: string;
  renderInputControls?: (
    options: Record<string, any>,
    setOption: (key: string, value: any) => void
  ) => React.ReactNode;
}

export const AIToolShell: React.FC<AIToolShellProps> = ({ toolSlug, renderInputControls }) => {
  const config = AI_TOOLS_REGISTRY[toolSlug];

  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState<Record<string, any>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ isKeyMissing: boolean; message: string } | null>(null);
  const [providerName, setProviderName] = useState<string>("");
  const [hasHistory, setHasHistory] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize options & load session history from localStorage
  useEffect(() => {
    if (!config) return;

    // Set default prompt and options schema
    setPrompt(config.defaultPrompt || "");
    const initOptions: Record<string, any> = {};
    config.optionsSchema?.forEach((opt) => {
      initOptions[opt.id] = opt.defaultValue;
    });
    setOptions(initOptions);

    // Restore localStorage session
    const savedSession = localStorage.getItem(`toolverse_ai_${toolSlug}`);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.prompt) setPrompt(parsed.prompt);
        if (parsed.output) setOutput(parsed.output);
        if (parsed.options) setOptions(parsed.options);
        setHasHistory(true);
      } catch (err) {
        // Ignore parsing error
      }
    }
  }, [toolSlug, config]);

  const setOption = (key: string, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Reset state & setup abort controller
    setLoading(true);
    setErrorInfo(null);
    setOutput("");

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          tool: toolSlug,
          prompt,
          options,
        }),
      });

      const providerHeader = response.headers.get("X-AI-Provider") || "ToolVerse AI";
      setProviderName(providerHeader);

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        if (response.status === 401 || data.errorType === "API_KEY_REQUIRED") {
          setErrorInfo({
            isKeyMissing: true,
            message: data.message || data.error || "API key is required.",
          });
        } else {
          setErrorInfo({
            isKeyMissing: false,
            message: data.message || data.error || `Server returned error status ${response.status}.`,
          });
        }
        setLoading(false);
        return;
      }

      const generatedResult = data.result || "";
      setOutput(generatedResult);

      // Save session to localStorage
      localStorage.setItem(
        `toolverse_ai_${toolSlug}`,
        JSON.stringify({ prompt, output: generatedResult, options })
      );
      setHasHistory(true);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("[AI ToolShell]: Generation stopped by user.");
      } else {
        setErrorInfo({
          isKeyMissing: false,
          message: err.message || "Failed to receive response from AI provider.",
        });
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
    setErrorInfo(null);
    localStorage.removeItem(`toolverse_ai_${toolSlug}`);
    setHasHistory(false);
  };

  if (!config) {
    return <div className="p-4 text-xs text-rose-500 font-mono">Invalid AI tool configuration.</div>;
  }

  // Render Setup Screen if API Key is missing
  if (errorInfo?.isKeyMissing) {
    return <AISetupScreen toolName={config.name} message={errorInfo.message} />;
  }

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Tool Header & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center gap-1.5 border border-orange-500/20">
            <Zap className="w-3.5 h-3.5" /> {config.name}
          </span>
          {providerName && (
            <span className="text-[11px] font-mono text-zinc-400">
              Powered by {providerName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasHistory && (
            <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> Session Saved
            </span>
          )}
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
            Ctrl + Enter to Run
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form & Inputs */}
        <div className="space-y-4">
          {/* Options Schema Controls (if configured) */}
          {config.optionsSchema && config.optionsSchema.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.optionsSchema.map((opt) => (
                <div key={opt.id}>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    {opt.label}
                  </label>
                  {opt.type === "select" ? (
                    <select
                      value={options[opt.id] || opt.defaultValue}
                      onChange={(e) => setOption(opt.id, e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs"
                    >
                      {opt.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={options[opt.id] || ""}
                      onChange={(e) => setOption(opt.id, e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Custom Input Controls (if passed as render prop) */}
          {renderInputControls && renderInputControls(options, setOption)}

          {/* Main Prompt Input Area */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Input Requirements / Source Code
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  handleGenerate();
                }
              }}
              rows={7}
              placeholder="Describe your requirements or paste source code..."
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all resize-none shadow-xs"
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-zinc-400">
              <span>{prompt.length} characters</span>
              <span>AI Inference Engine</span>
            </div>
          </div>

          {errorInfo && !errorInfo.isKeyMissing && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {errorInfo.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {loading ? (
              <button
                onClick={handleStop}
                className="flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Square className="w-4 h-4 fill-white" /> Stop Generation
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all active:scale-[0.98]"
              >
                <Zap className="w-4 h-4" /> Run {config.name}
              </button>
            )}

            <button
              onClick={handleClear}
              className="h-11 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Trash2 className="w-4 h-4 text-zinc-400" /> Clear
            </button>
          </div>
        </div>

        {/* Right Column: Output & Skeleton Loader */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Generated AI Output
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

          <div className="w-full h-[360px] rounded-xl bg-[#121215] border border-zinc-800 p-4 text-zinc-200 font-mono text-xs overflow-auto shadow-inner">
            {loading && !output ? (
              /* Custom ToolVerse SaaS Skeleton Loader */
              <div className="space-y-3 animate-pulse p-2">
                <div className="h-4 bg-zinc-800 rounded-md w-3/4"></div>
                <div className="h-4 bg-zinc-800/60 rounded-md w-1/2"></div>
                <div className="h-4 bg-zinc-800/80 rounded-md w-5/6"></div>
                <div className="h-4 bg-zinc-800/40 rounded-md w-2/3"></div>
                <div className="h-12 bg-zinc-800/50 rounded-lg w-full mt-4"></div>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap leading-relaxed">{output}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 text-center">
                <Zap className="w-8 h-8 text-zinc-600" />
                <p>Click &quot;Run {config.name}&quot; to stream results in real time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
