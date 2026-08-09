"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Download,
  Copy,
  Check,
  Code,
  Eye,
  Zap,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Grid,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  FileCode,
  Layers,
  Palette,
  Sliders,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parseAndValidateSvg, extractSvgStats, formatByteSize } from "@/lib/svg-editor/parser";
import { sanitizeSvg } from "@/lib/svg-editor/sanitizer";
import { optimizeSvgCode, prettifySvgCode } from "@/lib/svg-editor/optimizer";
import { SAMPLE_SVG_TEMPLATES } from "@/lib/svg-editor/samples";
import { PreviewBg, SvgTemplate } from "@/lib/svg-editor/types";

// ─── Toast Feedback Component ──────────────────────────────────────────────────

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

const ToastList: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({
  toasts,
  onRemove,
}) => (
  <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ duration: 0.2, type: "tween" }}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold max-w-xs ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-orange-50 border-orange-200 text-orange-800"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          ) : (
            <Zap className="w-4 h-4 shrink-0 text-orange-500" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// ─── Main SVG Editor Component ────────────────────────────────────────────────

export const SvgEditorTool: React.FC = () => {
  // SVG State
  const [svgCode, setSvgCode] = useState<string>(SAMPLE_SVG_TEMPLATES[0].svg);
  const [previewBg, setPreviewBg] = useState<PreviewBg>("checkerboard");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showSamplesMenu, setShowSamplesMenu] = useState<boolean>(false);

  // Live Style Tweaker State
  const [overrideFill, setOverrideFill] = useState<string>("");
  const [overrideStroke, setOverrideStroke] = useState<string>("");
  const [overrideStrokeWidth, setOverrideStrokeWidth] = useState<number | "">("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation & Stats computation
  const validation = parseAndValidateSvg(svgCode);
  const stats = extractSvgStats(svgCode);

  // Toast Helper
  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Safe Sanitized SVG code for preview rendering
  const sanitizedPreviewSvg = React.useMemo(() => {
    if (!validation.isValid) return "";
    let code = sanitizeSvg(svgCode);

    // Apply optional style overrides directly to root <svg> if set
    if (overrideFill || overrideStroke || overrideStrokeWidth !== "") {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, "image/svg+xml");
        const svgEl = doc.querySelector("svg");

        if (svgEl) {
          if (overrideFill) svgEl.setAttribute("fill", overrideFill);
          if (overrideStroke) svgEl.setAttribute("stroke", overrideStroke);
          if (overrideStrokeWidth !== "") svgEl.setAttribute("stroke-width", String(overrideStrokeWidth));
          const serializer = new XMLSerializer();
          code = serializer.serializeToString(doc);
        }
      } catch {}
    }

    return code;
  }, [svgCode, validation.isValid, overrideFill, overrideStroke, overrideStrokeWidth]);

  // File Upload Handler
  const processUploadedFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
      addToast("Please select a valid .svg file.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string" && content.trim()) {
        setSvgCode(content);
        setZoomLevel(100);
        addToast(`Loaded ${file.name} successfully!`, "success");
      }
    };
    reader.onerror = () => {
      addToast("Failed to read SVG file.", "error");
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Optimize Action
  const handleOptimize = () => {
    if (!validation.isValid) {
      addToast("Cannot optimize invalid SVG code.", "error");
      return;
    }
    const result = optimizeSvgCode(svgCode);
    setSvgCode(result.code);
    if (result.savedBytes > 0) {
      addToast(`Optimized! Reduced size by ${result.reductionPercentage}% (${formatByteSize(result.savedBytes)} saved)`, "success");
    } else {
      addToast("SVG is already fully optimized!", "info");
    }
  };

  // Prettify / Format Action
  const handleFormat = () => {
    if (!validation.isValid) {
      addToast("Cannot format invalid SVG code.", "error");
      return;
    }
    const formatted = prettifySvgCode(svgCode);
    setSvgCode(formatted);
    addToast("Formatted SVG code cleanly!", "info");
  };

  // Copy Action
  const handleCopy = () => {
    if (!svgCode.trim()) return;
    navigator.clipboard.writeText(svgCode).then(
      () => {
        setCopied(true);
        addToast("SVG code copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
      },
      () => {
        addToast("Failed to copy code.", "error");
      }
    );
  };

  // Download Action
  const handleDownload = () => {
    if (!svgCode.trim() || !validation.isValid) {
      addToast("Cannot download invalid SVG.", "error");
      return;
    }
    const blob = new Blob([sanitizingDownloadCode(sanitizingDownloadCode(svgCode))], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vector_export_${Date.now().toString(36)}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast("Downloaded SVG file!", "success");
  };

  const sanitizingDownloadCode = (code: string) => {
    return sanitizeSvg(code);
  };

  // Load Template Preset
  const handleSelectTemplate = (template: SvgTemplate) => {
    setSvgCode(template.svg);
    setZoomLevel(100);
    setOverrideFill("");
    setOverrideStroke("");
    setOverrideStrokeWidth("");
    setShowSamplesMenu(false);
    addToast(`Loaded template: ${template.name}`, "info");
  };

  // Reset Action
  const handleReset = () => {
    setSvgCode(SAMPLE_SVG_TEMPLATES[0].svg);
    setZoomLevel(100);
    setOverrideFill("");
    setOverrideStroke("");
    setOverrideStrokeWidth("");
    addToast("Editor reset to default emblem.", "info");
  };

  // Calculate line count & character count
  const lineCount = svgCode ? svgCode.split("\n").length : 0;
  const charCount = svgCode.length;

  return (
    <>
      <ToastList toasts={toasts} onRemove={removeToast} />

      <div className="space-y-6 w-full min-w-0">
        {/* ── Top Primary Action Bar ───────────────────────────────────── */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3 w-full min-w-0">
          {/* Upload Button */}
          <div className="flex items-center gap-2 flex-wrap min-w-0 w-full sm:w-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0 flex-1 sm:flex-initial justify-center"
            >
              <Upload className="w-4 h-4" />
              <span>Upload SVG</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".svg,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Presets Template Dropdown */}
            <div className="relative shrink-0 flex-1 sm:flex-initial">
              <button
                type="button"
                onClick={() => setShowSamplesMenu((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-orange-600 hover:border-orange-300 transition-colors font-bold text-xs shadow-2xs cursor-pointer w-full justify-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Templates</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <AnimatePresence>
                {showSamplesMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl z-30 p-1.5 space-y-1"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Preset Graphics
                    </div>
                    {SAMPLE_SVG_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-between"
                      >
                        <span>{tmpl.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{tmpl.category}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Secondary Action Controls */}
          <div className="flex items-center gap-2 flex-wrap min-w-0 w-full sm:w-auto">
            <Button
              onClick={handleOptimize}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 rounded-xl border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs flex-1 sm:flex-initial"
              title="Minify and clean up SVG code"
            >
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span>Optimize</span>
            </Button>

            <Button
              onClick={handleFormat}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 rounded-xl border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs flex-1 sm:flex-initial"
              title="Prettify and indent XML tags"
            >
              <FileCode className="w-3.5 h-3.5 text-zinc-500" />
              <span>Format</span>
            </Button>

            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 rounded-xl border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs flex-1 sm:flex-initial"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied</>
              ) : (
                <><Copy className="w-3.5 h-3.5 text-zinc-500" /> Copy SVG</>
              )}
            </Button>

            <Button
              onClick={handleDownload}
              variant="default"
              size="sm"
              className="text-xs font-bold gap-1.5 rounded-xl shadow-2xs bg-zinc-900 hover:bg-zinc-800 text-white flex-1 sm:flex-initial"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </Button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs shrink-0"
              title="Reset Editor"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Main Workspace: 2-Column Responsive Split ───────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
          {/* ═════════════════════════════════════════════════════════════════
              LEFT COLUMN: SVG CODE EDITOR
             ═════════════════════════════════════════════════════════════════ */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-white border transition-all rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 relative min-w-0 w-full overflow-hidden ${
              isDragOver ? "border-orange-500 ring-4 ring-orange-100" : "border-zinc-200/90"
            }`}
          >
            {/* Drag and Drop Overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-orange-50/90 backdrop-blur-xs rounded-2xl z-20 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                <Upload className="w-10 h-10 text-orange-500 animate-bounce mb-2" />
                <p className="text-sm font-bold text-orange-700">Drop SVG File Here</p>
                <p className="text-xs text-orange-600">Release to import into editor</p>
              </div>
            )}

            {/* Editor Header Bar */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 min-w-0 flex-wrap gap-2">
              <div className="flex items-center gap-2 shrink-0">
                <Code className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Raw SVG Markup Editor
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Validation Status Badge */}
                {validation.isValid ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700">
                    <Check className="w-3 h-3 text-emerald-500" />
                    Valid XML
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[10px] font-mono font-bold text-rose-700">
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                    Syntax Error
                  </span>
                )}

                <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                  {lineCount} L • {charCount} C
                </span>
              </div>
            </div>

            {/* Code Editor Textarea Area */}
            <div className="relative flex-1 min-h-[340px] w-full min-w-0">
              <textarea
                value={svgCode}
                onChange={(e) => setSvgCode(e.target.value)}
                placeholder="Paste or type raw <svg> markup here..."
                spellCheck={false}
                className="w-full h-full min-h-[340px] p-4 rounded-xl border border-zinc-200 bg-zinc-900 text-orange-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-orange-400 transition-all resize-y selection:bg-orange-500/30 selection:text-orange-200 overflow-x-auto whitespace-pre-wrap break-all min-w-0"
              />
            </div>

            {/* Validation Error Banner (if malformed XML) */}
            {!validation.isValid && validation.error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-rose-800">XML Syntax Error</p>
                  <p className="font-mono text-[11px] leading-tight">{validation.error}</p>
                </div>
              </div>
            )}

            {/* Sanitization Warning Banner */}
            {validation.warning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-500" />
                <span>{validation.warning}</span>
              </div>
            )}

            {/* Bottom Metadata & Statistics Footer */}
            <div className="pt-3 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-zinc-600 font-mono text-[11px]">
              <div className="p-2 bg-zinc-50 border border-zinc-200/80 rounded-xl min-w-0 overflow-hidden">
                <span className="text-[10px] text-zinc-400 uppercase font-sans block font-bold truncate">Size</span>
                <span className="font-bold text-zinc-800 truncate block">{stats.formattedSize}</span>
              </div>
              <div className="p-2 bg-zinc-50 border border-zinc-200/80 rounded-xl min-w-0 overflow-hidden">
                <span className="text-[10px] text-zinc-400 uppercase font-sans block font-bold truncate">Elements</span>
                <span className="font-bold text-zinc-800 truncate block">{stats.nodeCount}</span>
              </div>
              <div className="p-2 bg-zinc-50 border border-zinc-200/80 rounded-xl min-w-0 overflow-hidden">
                <span className="text-[10px] text-zinc-400 uppercase font-sans block font-bold truncate">Paths</span>
                <span className="font-bold text-zinc-800 truncate block">{stats.pathCount}</span>
              </div>
              <div className="p-2 bg-zinc-50 border border-zinc-200/80 rounded-xl min-w-0 overflow-hidden">
                <span className="text-[10px] text-zinc-400 uppercase font-sans block font-bold truncate">Dimensions</span>
                <span className="font-bold text-zinc-800 truncate block" title={`${stats.width} × ${stats.height}`}>
                  {stats.width !== "Auto" ? `${stats.width}×${stats.height}` : stats.viewBox !== "None" ? "viewBox" : "Auto"}
                </span>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT COLUMN: LIVE VECTOR PREVIEW & INSPECTOR
             ═════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 min-w-0 w-full overflow-hidden">
            {/* Preview Header & Canvas Toolbar */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Live Vector Preview
                </h3>
              </div>

              {/* Canvas Background Selector Pills */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewBg("checkerboard")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    previewBg === "checkerboard"
                      ? "bg-white text-zinc-900 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                  title="Checkerboard Grid"
                >
                  <Grid className="w-3 h-3 text-orange-500" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg("light")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    previewBg === "light"
                      ? "bg-white text-zinc-900 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                  title="Light Background"
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span className="hidden sm:inline">Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg("dark")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    previewBg === "dark"
                      ? "bg-white text-zinc-900 shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                  title="Dark Background"
                >
                  <Moon className="w-3 h-3 text-indigo-500" />
                  <span className="hidden sm:inline">Dark</span>
                </button>
              </div>
            </div>

            {/* Preview Canvas Box */}
            <div
              className={`w-full min-h-[340px] flex-1 rounded-xl border border-zinc-200/90 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors ${
                previewBg === "checkerboard"
                  ? "bg-zinc-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
                  : previewBg === "light"
                  ? "bg-white"
                  : previewBg === "dark"
                  ? "bg-zinc-900 border-zinc-800 text-white"
                  : "bg-transparent"
              }`}
            >
              {/* Zoom Controls Overlay */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs border border-zinc-200 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(30, z - 20))}
                  className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="px-2 text-[10px] font-mono font-bold text-zinc-700 hover:text-orange-600"
                  title="Reset Zoom"
                >
                  {zoomLevel}%
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(300, z + 20))}
                  className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsFullscreen((v) => !v)}
                  className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors ml-1 border-l border-zinc-200 pl-1.5"
                  title="Full Screen Preview"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-orange-500" />
                </button>
              </div>

              {/* Rendered SVG Display / Empty & Error States */}
              {validation.isValid && sanitizedPreviewSvg ? (
                <div
                  className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                  dangerouslySetInnerHTML={{ __html: sanitizedPreviewSvg }}
                />
              ) : (
                <div className="py-12 text-center space-y-2 text-zinc-400">
                  <AlertCircle className="w-8 h-8 mx-auto text-rose-400" />
                  <p className="text-xs font-semibold text-rose-600">
                    Cannot render invalid SVG XML
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Correct syntax errors in the left editor to update live preview.
                  </p>
                </div>
              )}
            </div>

            {/* Quick SVG Style Tweaker Bar */}
            <div className="pt-3 border-t border-zinc-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-700">
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <Palette className="w-3.5 h-3.5 text-orange-500" />
                  Live Property Tweaker
                </span>
                {(overrideFill || overrideStroke || overrideStrokeWidth !== "") && (
                  <button
                    type="button"
                    onClick={() => {
                      setOverrideFill("");
                      setOverrideStroke("");
                      setOverrideStrokeWidth("");
                    }}
                    className="text-[10px] text-orange-600 hover:underline font-bold"
                  >
                    Clear Tweaks
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Override Fill */}
                <div className="flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl min-w-0">
                  <span className="text-[10px] font-bold text-zinc-500 shrink-0">Fill:</span>
                  <input
                    type="color"
                    value={overrideFill || "#F97316"}
                    onChange={(e) => setOverrideFill(e.target.value)}
                    className="w-6 h-6 rounded-md cursor-pointer border border-zinc-300 shrink-0"
                    title="Change Fill Color"
                  />
                  <input
                    type="text"
                    value={overrideFill}
                    onChange={(e) => setOverrideFill(e.target.value)}
                    placeholder="e.g. #F97316"
                    className="text-[11px] font-mono bg-white border border-zinc-200 rounded-md px-2 py-0.5 w-full min-w-0 focus:outline-none"
                  />
                </div>

                {/* Override Stroke */}
                <div className="flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl min-w-0">
                  <span className="text-[10px] font-bold text-zinc-500 shrink-0">Stroke:</span>
                  <input
                    type="color"
                    value={overrideStroke || "#F97316"}
                    onChange={(e) => setOverrideStroke(e.target.value)}
                    className="w-6 h-6 rounded-md cursor-pointer border border-zinc-300 shrink-0"
                    title="Change Stroke Color"
                  />
                  <input
                    type="text"
                    value={overrideStroke}
                    onChange={(e) => setOverrideStroke(e.target.value)}
                    placeholder="e.g. #F97316"
                    className="text-[11px] font-mono bg-white border border-zinc-200 rounded-md px-2 py-0.5 w-full min-w-0 focus:outline-none"
                  />
                </div>

                {/* Override Stroke Width */}
                <div className="flex items-center gap-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl min-w-0">
                  <span className="text-[10px] font-bold text-zinc-500 shrink-0">Width:</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={overrideStrokeWidth}
                    onChange={(e) => setOverrideStrokeWidth(e.target.value ? Number(e.target.value) : "")}
                    placeholder="2px"
                    className="text-[11px] font-mono bg-white border border-zinc-200 rounded-md px-2 py-0.5 w-full min-w-0 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center overflow-auto">
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold transition-colors cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
              </button>

              <div
                className="max-w-full max-h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: sanitizedPreviewSvg }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
