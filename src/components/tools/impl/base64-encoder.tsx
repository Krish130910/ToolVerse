"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Download,
  ArrowRightLeft,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileText,
  Upload,
  ShieldCheck,
  Code2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { encodeBase64, decodeBase64 } from "@/lib/base64";

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export const Base64EncoderTool: React.FC = () => {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Build faster with ToolVerse! 🚀");
  const [urlSafe, setUrlSafe] = useState(false);
  const [dataUriFormat, setDataUriFormat] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = useCallback((message: string, type: ToastNotification["type"] = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Perform live conversion using optimized UTF-8 Base64 utility
  const result = useMemo(() => {
    if (mode === "encode") {
      return encodeBase64(input, {
        urlSafe,
        dataUri: dataUriFormat,
        mimeType: "text/plain;charset=utf-8",
      });
    } else {
      return decodeBase64(input);
    }
  }, [input, mode, urlSafe, dataUriFormat]);

  const inputByteSize = useMemo(() => {
    if (!input) return 0;
    return new TextEncoder().encode(input).length;
  }, [input]);

  const hasInput = input.trim().length > 0;
  const isValid = result.success && hasInput;
  const isInvalid = !result.success && hasInput;

  // Copy output to clipboard
  const copyOutput = () => {
    if (!isValid || !result.output) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    addToast(
      mode === "encode"
        ? "Base64 encoded output copied to clipboard!"
        : "Decoded text output copied to clipboard!",
      "success"
    );
    setTimeout(() => setCopied(false), 2000);
  };

  // Download output as text file
  const downloadOutput = () => {
    if (!isValid || !result.output) return;
    const filename = mode === "encode" ? "encoded.b64" : "decoded.txt";
    const blob = new Blob([result.output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Downloaded output as ${filename}`, "success");
  };

  // Swap input and output text and toggle mode
  const swapContent = () => {
    if (!isValid || !result.output) {
      addToast("Cannot swap with empty or invalid output.", "error");
      return;
    }
    const newMode = mode === "encode" ? "decode" : "encode";
    setInput(result.output);
    setMode(newMode);
    addToast(`Swapped content and switched to ${newMode} mode.`, "info");
  };

  // Load sample text
  const loadExample = () => {
    if (mode === "encode") {
      setInput("🚀 ToolVerse 2026: Fast, Secure & Modern Base64 Developer Tool! ❤️");
    } else {
      setInput("8J+agCBUb29sVmVyc2UgMjAyNjogRmFzdCwgU2VjdXJlICYgTW9kZXJuIEJhc2U2NCBEZXZlbG9wZXIgVG9vbCEg4p2khA==");
    }
    addToast("Loaded example input text.", "info");
  };

  // Clear input
  const clearInput = () => {
    setInput("");
    addToast("Input cleared.", "info");
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content !== undefined) {
        setInput(content);
        addToast(`Loaded content from file "${file.name}"`, "success");
      }
    };
    reader.onerror = () => {
      addToast("Failed to read file.", "error");
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = "";
  };

  return (
    <div className="space-y-6 w-full relative">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".txt,.json,.csv,.xml,.html,.htm,.md,.markdown,.b64,.js,.ts,.css"
      />

      {/* Mode Switcher & Options Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        {/* Mode Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100/90 rounded-xl">
          <button
            onClick={() => setMode("encode")}
            aria-label="Encode Text to Base64"
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              mode === "encode"
                ? "bg-orange-500 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Encode Text to Base64</span>
          </button>
          <button
            onClick={() => setMode("decode")}
            aria-label="Decode Base64 to Text"
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              mode === "decode"
                ? "bg-orange-500 text-white shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Decode Base64 to Text</span>
          </button>
        </div>

        {/* Options Toggles */}
        <div className="flex items-center gap-4 flex-wrap">
          {mode === "encode" && (
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dataUriFormat}
                onChange={(e) => setDataUriFormat(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
              />
              <span>Data URI Format</span>
            </label>
          )}

          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
            />
            <span>URL-Safe (- / _)</span>
          </label>
        </div>

        {/* Primary Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={copyOutput}
            disabled={!isValid}
            variant="default"
            size="sm"
            className="text-xs font-bold gap-1.5 shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Copy Output"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied Output!" : "Copy Output"}</span>
          </Button>

          <Button
            onClick={downloadOutput}
            disabled={!isValid}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Download Output"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Input and Output text areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2 flex-wrap gap-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <span>{mode === "encode" ? "Plain Text Input" : "Base64 Encoded Input"}</span>
            </h4>

            {/* Input Action Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 rounded text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center gap-1"
                title="Upload Text File"
                aria-label="Upload Text File"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
              </button>

              <button
                onClick={loadExample}
                className="px-2 py-1 rounded text-[11px] font-semibold text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1"
                title="Load Example Input"
                aria-label="Load Example Input"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sample</span>
              </button>

              {hasInput && (
                <button
                  onClick={clearInput}
                  className="px-2 py-1 rounded text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
                  title="Clear Input"
                  aria-label="Clear Input"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative flex-1 flex flex-col">
            <textarea
              rows={12}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter plain text to encode into Base64 (supports Emojis, Unicode, line breaks)..."
                  : "Paste valid Base64 string to decode into text..."
              }
              aria-label={mode === "encode" ? "Plain Text Input" : "Base64 Encoded Input"}
              className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 resize-y"
            />
          </div>

          {/* Input Footer Stats */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1">
            <span>
              {input.length.toLocaleString()} chars | {inputByteSize.toLocaleString()} bytes
            </span>
            <span className="text-zinc-400">UTF-8 Encoded</span>
          </div>
        </div>

        {/* Output Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2 flex-wrap gap-2 min-h-[33px]">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <span>{mode === "encode" ? "Base64 Output Result" : "Decoded Text Result"}</span>
            </h4>

            {/* Validation Badge Header */}
            <div className="flex items-center gap-2">
              {isInvalid ? (
                <span
                  role="alert"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 animate-fadeIn"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Invalid Base64</span>
                </span>
              ) : isValid ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Valid {mode === "encode" ? "Base64" : "Text"}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-md">
                  <span>Waiting for input</span>
                </span>
              )}

              {isValid && (
                <button
                  onClick={swapContent}
                  className="p-1 rounded text-zinc-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                  title="Swap Input & Output"
                  aria-label="Swap Input & Output"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Output Display Box */}
          <div className="relative flex-1 flex flex-col">
            {isInvalid ? (
              <div
                role="alert"
                aria-live="polite"
                className="w-full p-4 rounded-xl border border-rose-300 bg-rose-50/70 text-rose-900 font-mono text-xs flex flex-col gap-2 flex-1 min-h-[280px]"
              >
                <div className="flex items-center gap-2 font-bold text-rose-700 border-b border-rose-200 pb-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Validation Error</span>
                </div>
                <p className="text-rose-800 text-xs font-sans leading-relaxed pt-1">
                  {result.error || "Invalid Base64 string. Please enter a valid Base64 encoded value."}
                </p>
                <div className="mt-auto pt-4 border-t border-rose-200/60 text-[11px] text-rose-600 font-sans">
                  Tip: Ensure your Base64 string contains only valid characters (A-Z, a-z, 0-9, +, /, =) without corrupt bytes.
                </div>
              </div>
            ) : (
              <textarea
                readOnly
                rows={12}
                value={result.output}
                placeholder={
                  mode === "encode"
                    ? "Encoded Base64 result will appear here live..."
                    : "Decoded plain text result will appear here live..."
                }
                aria-label={mode === "encode" ? "Base64 Output Result" : "Decoded Text Result"}
                className={`w-full p-4 rounded-xl border font-mono text-xs focus:outline-none resize-y ${
                  hasInput
                    ? "border-zinc-800 bg-zinc-900 text-teal-300"
                    : "border-zinc-200 bg-zinc-900/90 text-zinc-500"
                }`}
              />
            )}
          </div>

          {/* Output Footer Stats */}
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1">
            <span>
              {isValid
                ? `${(result.charCount || 0).toLocaleString()} chars | ${(result.byteSize || 0).toLocaleString()} bytes`
                : "0 chars | 0 bytes"}
            </span>

            {isValid && inputByteSize > 0 && result.byteSize !== undefined && (
              <span className="text-zinc-500">
                {mode === "encode" ? "+" : "-"}
                {Math.abs(Math.round(((result.byteSize - inputByteSize) / inputByteSize) * 100))}% size
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Security & XSS Guarantee Footer Note */}
      <div className="flex items-center justify-between px-2 text-[11px] text-zinc-600 font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Client-side execution with UTF-8 verification. Decoded content is safely isolated from XSS execution.</span>
        </span>
      </div>

      {/* Floating Toast System */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold max-w-sm ${
                toast.type === "success"
                  ? "bg-emerald-900 text-emerald-100 border-emerald-700 shadow-emerald-950/20"
                  : toast.type === "error"
                  ? "bg-rose-900 text-rose-100 border-rose-700 shadow-rose-950/20"
                  : "bg-zinc-900 text-zinc-100 border-zinc-700 shadow-zinc-950/20"
              }`}
            >
              {toast.type === "success" ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : toast.type === "error" ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <Sparkles className="w-4 h-4 shrink-0 text-orange-400" />
              )}
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto text-current opacity-60 hover:opacity-100 transition-opacity pl-2"
                aria-label="Close notification"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
