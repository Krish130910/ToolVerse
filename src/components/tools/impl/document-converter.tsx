"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentFormat,
  FORMAT_DETAILS,
  VALID_CONVERSION_MAP,
  SAMPLE_DOCUMENTS,
  convertDocument,
  validateDocument,
  detectFormatFromContent,
  calculateDocumentStats,
  runAsyncConversion,
  markdownToHtml,
  parseCSVToRows,
  ValidationResult,
  DocumentStats,
} from "@/lib/document-converter";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  ArrowRightLeft,
  Copy,
  Check,
  Download,
  Eye,
  Maximize2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileCode,
  FileType,
  FileSpreadsheet,
  FileJson,
  Zap,
  Clipboard,
  RotateCcw,
  BarChart3,
  Code2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Grid,
  Sliders,
  RefreshCw,
} from "lucide-react";
import { VSCodeInputEditor } from "./document-converter/vscode-editor";
import { SyntaxHighlighter } from "./document-converter/syntax-highlighter";
import { PreviewModal } from "./document-converter/preview-modal";
import { FullscreenModal } from "./document-converter/fullscreen-modal";

// Quick Preset Routes matching the attached reference image
const QUICK_CONVERSION_PRESETS: { label: string; source: DocumentFormat; target: DocumentFormat }[] = [
  { label: "Markdown → HTML", source: "markdown", target: "html" },
  { label: "HTML → Plain Text", source: "html", target: "txt" },
  { label: "JSON → CSV", source: "json", target: "csv" },
  { label: "CSV → JSON", source: "csv", target: "json" },
  { label: "Format JSON", source: "json", target: "json" },
  { label: "Text → HTML", source: "txt", target: "html" },
];

export const DocumentConverterTool: React.FC = () => {
  // Primary States
  const [sourceFormat, setSourceFormat] = useState<DocumentFormat>("markdown");
  const [targetFormat, setTargetFormat] = useState<DocumentFormat>("html");
  const [inputContent, setInputContent] = useState<string>(SAMPLE_DOCUMENTS.markdown.content);
  const [outputContent, setOutputContent] = useState<string>("");
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [conversionLatencyMs, setConversionLatencyMs] = useState<number | null>(null);
  const [autoDetect, setAutoDetect] = useState<boolean>(true);

  // Custom Dropdown Open States
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState<boolean>(false);
  const [isTargetDropdownOpen, setIsTargetDropdownOpen] = useState<boolean>(false);

  // Editor Theme & View Mode ("light" matching reference image canvas)
  const [editorTheme, setEditorTheme] = useState<"dark" | "light">("light");
  const [outputTab, setOutputTab] = useState<"code" | "preview">("code");

  // UI Modal & Interaction States
  const [copied, setCopied] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [csvDelimiter, setCsvDelimiter] = useState<string>(",");
  const [jsonIndent, setJsonIndent] = useState<number>(2);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSourceDropdownOpen(false);
        setIsTargetDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ensure target format remains valid when source format changes
  useEffect(() => {
    const validTargets = VALID_CONVERSION_MAP[sourceFormat];
    if (!validTargets.includes(targetFormat)) {
      const nextTarget = validTargets.find((t) => t !== sourceFormat) || validTargets[0];
      setTargetFormat(nextTarget);
    }
  }, [sourceFormat, targetFormat]);

  // Live input document statistics
  const inputStats: DocumentStats = useMemo(() => {
    return calculateDocumentStats(inputContent);
  }, [inputContent]);

  // Live input document validation
  const validationResult: ValidationResult = useMemo(() => {
    return validateDocument(sourceFormat, inputContent);
  }, [sourceFormat, inputContent]);

  // Conversion Logic Execution
  const handleConvert = useCallback(async () => {
    if (!inputContent.trim()) {
      setOutputContent("");
      setConversionError(null);
      return;
    }

    if (!validationResult.isValid) {
      setConversionError(validationResult.error || "Validation error in source document");
      return;
    }

    setIsConverting(true);
    setConversionError(null);
    const startTime = performance.now();

    try {
      const result = await runAsyncConversion(() => {
        return convertDocument({
          sourceFormat,
          targetFormat,
          inputContent,
          csvDelimiter,
          jsonIndent,
        });
      });

      const endTime = performance.now();
      setOutputContent(result);
      setConversionLatencyMs(Math.round(endTime - startTime));
    } catch (err: any) {
      setConversionError(err?.message || "An error occurred during conversion.");
      setOutputContent("");
    } finally {
      setIsConverting(false);
    }
  }, [inputContent, sourceFormat, targetFormat, csvDelimiter, jsonIndent, validationResult]);

  // Auto-trigger conversion on input/format change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      handleConvert();
    }, 120);

    return () => clearTimeout(timer);
  }, [handleConvert]);

  // Auto-detect format on content update if enabled
  const handleContentChange = (content: string) => {
    setInputContent(content);
    if (autoDetect && content.trim()) {
      const detected = detectFormatFromContent(content);
      if (detected !== sourceFormat) {
        setSourceFormat(detected);
      }
    }
  };

  // Swap Source & Target Formats
  const handleSwap = () => {
    const allowedForTarget = VALID_CONVERSION_MAP[targetFormat];
    if (allowedForTarget.includes(sourceFormat)) {
      const oldSource = sourceFormat;
      const oldTarget = targetFormat;
      setSourceFormat(oldTarget);
      setTargetFormat(oldSource);
      if (outputContent) {
        setInputContent(outputContent);
      }
    } else {
      setConversionError(
        `Cannot swap: ${targetFormat.toUpperCase()} to ${sourceFormat.toUpperCase()} is an unsupported pair.`
      );
    }
  };

  // Preset Selector
  const handleSelectPreset = (src: DocumentFormat, tgt: DocumentFormat) => {
    setSourceFormat(src);
    setTargetFormat(tgt);
    setAutoDetect(false);
  };

  // Load Sample Content
  const handleLoadSample = () => {
    const sample = SAMPLE_DOCUMENTS[sourceFormat];
    if (sample) {
      setInputContent(sample.content);
    }
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const detected = detectFormatFromContent("", file.name);
    setSourceFormat(detected);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text !== undefined) {
        setInputContent(text);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Drag and Drop Handlers
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

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const detected = detectFormatFromContent("", file.name);
      setSourceFormat(detected);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text !== undefined) {
          setInputContent(text);
        }
      };
      reader.readAsText(file);
    }
  };

  // Paste Text from Clipboard
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleContentChange(text);
      }
    } catch {
      alert("Unable to read clipboard. Please paste directly into the editor.");
    }
  };

  // Reset Workspace
  const handleResetWorkspace = () => {
    setInputContent("");
    setOutputContent("");
    setConversionError(null);
    setSourceFormat("markdown");
    setTargetFormat("html");
  };

  // Copy Converted Output
  const handleCopyOutput = () => {
    if (!outputContent) return;
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Converted Document
  const handleDownload = () => {
    if (!outputContent) return;

    const details = FORMAT_DETAILS[targetFormat];
    const blob = new Blob([outputContent], { type: details.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `document-converted${details.extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Format Icon Helper
  const getFormatIcon = (fmt: DocumentFormat) => {
    switch (fmt) {
      case "json":
        return <FileJson className="w-3.5 h-3.5 text-amber-500" />;
      case "csv":
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />;
      case "html":
        return <FileCode className="w-3.5 h-3.5 text-orange-500" />;
      case "markdown":
        return <FileType className="w-3.5 h-3.5 text-blue-500" />;
      case "txt":
      default:
        return <FileText className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  // Live Output Rendered Preview Component
  const renderInlineOutputPreview = () => {
    if (!outputContent.trim()) return null;

    if (targetFormat === "html") {
      return (
        <div className="p-6 bg-white text-zinc-900 h-full overflow-auto text-xs sm:text-sm leading-relaxed prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: outputContent }} />
        </div>
      );
    }

    if (targetFormat === "markdown") {
      const htmlFromMd = markdownToHtml(outputContent);
      return (
        <div className="p-6 bg-white text-zinc-900 h-full overflow-auto text-xs sm:text-sm leading-relaxed prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: htmlFromMd }} />
        </div>
      );
    }

    if (targetFormat === "csv") {
      const rows = parseCSVToRows(outputContent);
      if (rows.length === 0) return null;
      const headers = rows[0];
      const dataRows = rows.slice(1);

      return (
        <div className="overflow-auto bg-white h-full p-4">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-zinc-100 text-zinc-800 font-bold border-b border-zinc-200">
                {headers.map((h, idx) => (
                  <th key={idx} className="p-2.5 border-r border-zinc-200 last:border-r-0">
                    {h || `Col ${idx + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-zinc-100 hover:bg-orange-50/50">
                  {headers.map((_, cIdx) => (
                    <td key={cIdx} className="p-2.5 border-r border-zinc-100 last:border-r-0 text-zinc-800">
                      {row[cIdx] !== undefined ? row[cIdx] : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="p-6 bg-white text-zinc-800 h-full overflow-auto text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-wrap">
        {outputContent}
      </div>
    );
  };

  const isDark = editorTheme === "dark";

  return (
    <div className="w-full bg-[#FAF8F5]/50 flex-1 min-h-[calc(100vh-80px)] text-zinc-900 font-sans flex flex-col justify-between" role="region" aria-label="Document Converter Suite">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.markdown,.html,.htm,.csv,.json"
        onChange={handleFileUpload}
        className="hidden"
        aria-hidden="true"
      />

      {/* ------------------------------------------------------------ */}
      {/* 1. TOP GLOBAL BREADCRUMB & TOOLBAR                           */}
      {/* ------------------------------------------------------------ */}
      <div className="w-full border-b border-zinc-200/80 px-6 py-2.5 flex items-center justify-between text-xs bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-zinc-800">
            <span className="text-orange-600">ToolVerse</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-bold text-zinc-900">Document Converter</span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            FORMAT CONVERTERS
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-xs text-zinc-500 font-medium">
          <span className="hover:text-zinc-900 cursor-pointer">Video to GIF Converter</span>
          <span className="hover:text-zinc-900 cursor-pointer">Audio Converter</span>
          <span className="hover:text-zinc-900 cursor-pointer">Image Processor</span>
          <span className="hover:text-zinc-900 cursor-pointer">Image Vectorizer</span>
          <span className="flex items-center gap-1 text-zinc-700 hover:text-zinc-900 cursor-pointer font-bold">
            <Grid className="w-3.5 h-3.5" /> All tools
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* 2. SUB-HEADER WITH MAIN ACTION BUTTONS                       */}
      {/* ------------------------------------------------------------ */}


      {/* ------------------------------------------------------------ */}
      {/* 3. MAIN WORKSPACE: FULL VIEWPORT EXTENSION WITH NO CLIP      */}
      {/* ------------------------------------------------------------ */}
      <div className="flex-1 flex flex-col lg:flex-row w-full bg-[#FAF8F5]/30 min-h-[calc(100vh-100px)]">
        {/* ============================================================== */}
        {/* COLUMN 1: LEFT SIDEBAR (Source, Drag & Drop, Conversions)       */}
        {/* ============================================================== */}
        <aside className="w-full lg:w-72 shrink-0 border-r border-zinc-200/80 bg-white p-5 flex flex-col justify-between min-h-[calc(100vh-100px)] space-y-6">
          <div className="space-y-6" ref={dropdownRef}>
            {/* SOURCE UPLOAD BOX (Matching Reference Image) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-zinc-400" />
                SOURCE
              </span>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? "border-orange-500 bg-orange-50/50"
                    : "border-zinc-200 hover:border-orange-400 bg-white"
                }`}
              >
                <Button variant="outline" size="sm" className="text-xs font-bold bg-white text-zinc-700 border-zinc-200 shadow-2xs">
                  Select File
                </Button>
              </div>
            </div>

            {/* CONVERSION PRESETS & CUSTOM FORMAT SELECTOR */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                CONVERSION
              </span>

              {/* QUICK CONVERSION ROUTE PRESETS LIST (TOP POSITION) */}
              <div className="space-y-1">
                {QUICK_CONVERSION_PRESETS.map((preset) => {
                  const isActive = sourceFormat === preset.source && targetFormat === preset.target;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handleSelectPreset(preset.source, preset.target)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border ${
                        isActive
                          ? "bg-orange-50/80 text-orange-600 border-orange-400 font-bold shadow-2xs"
                          : "bg-white text-zinc-600 border-transparent hover:bg-zinc-100/70"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {getFormatIcon(preset.source)}
                        <span>{preset.label}</span>
                      </span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* CUSTOM TOOLVERSE THEMED FORMAT PAIR SELECTOR (POSITIONED BELOW PRESETS) */}
              <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                  <span>Custom Format Pair:</span>
                  <button
                    onClick={handleSwap}
                    className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-[11px] font-bold"
                  >
                    <ArrowRightLeft className="w-3 h-3" /> Swap
                  </button>
                </div>

                {/* SLEEK CUSTOM DROPDOWN BUTTONS WITH UPWARD POPOVERS */}
                <div className="grid grid-cols-2 gap-2 relative">
                  {/* FROM CUSTOM SELECT BUTTON */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsSourceDropdownOpen(!isSourceDropdownOpen);
                        setIsTargetDropdownOpen(false);
                      }}
                      className="w-full h-9 px-2.5 rounded-xl border border-zinc-200 bg-white hover:border-orange-400 text-xs font-bold text-zinc-800 flex items-center justify-between shadow-2xs transition-all"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        {getFormatIcon(sourceFormat)}
                        <span>{FORMAT_DETAILS[sourceFormat].name.split(" ")[0]}</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    </button>

                    {/* SOURCE POPOVER MENU (OPENS DOWNSIDE) */}
                    <AnimatePresence>
                      {isSourceDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute left-0 top-full mt-1.5 z-[100] w-52 bg-white border border-zinc-200 rounded-xl shadow-2xl p-1 space-y-0.5"
                        >
                          {(["markdown", "html", "json", "csv", "txt"] as DocumentFormat[]).map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => {
                                setSourceFormat(fmt);
                                setIsSourceDropdownOpen(false);
                              }}
                              className={`w-full px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                                sourceFormat === fmt
                                  ? "bg-orange-50 text-orange-600 font-bold"
                                  : "text-zinc-700 hover:bg-zinc-100"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {getFormatIcon(fmt)}
                                <span>{FORMAT_DETAILS[fmt].name}</span>
                              </span>
                              {sourceFormat === fmt && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* TO CUSTOM SELECT BUTTON */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsTargetDropdownOpen(!isTargetDropdownOpen);
                        setIsSourceDropdownOpen(false);
                      }}
                      className="w-full h-9 px-2.5 rounded-xl border border-zinc-200 bg-white hover:border-orange-400 text-xs font-bold text-zinc-800 flex items-center justify-between shadow-2xs transition-all"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        {getFormatIcon(targetFormat)}
                        <span>{FORMAT_DETAILS[targetFormat].name.split(" ")[0]}</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    </button>

                    {/* TARGET POPOVER MENU (OPENS DOWNSIDE) */}
                    <AnimatePresence>
                      {isTargetDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="absolute right-0 top-full mt-1.5 z-[100] w-52 bg-white border border-zinc-200 rounded-xl shadow-2xl p-1 space-y-0.5"
                        >
                          {(["txt", "markdown", "html", "csv", "json"] as DocumentFormat[]).map((fmt) => {
                            const isAllowed = VALID_CONVERSION_MAP[sourceFormat].includes(fmt);
                            return (
                              <button
                                key={fmt}
                                disabled={!isAllowed}
                                onClick={() => {
                                  if (isAllowed) {
                                    setTargetFormat(fmt);
                                    setIsTargetDropdownOpen(false);
                                  }
                                }}
                                className={`w-full px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                                  !isAllowed
                                    ? "opacity-40 cursor-not-allowed text-zinc-400"
                                    : targetFormat === fmt
                                    ? "bg-orange-50 text-orange-600 font-bold"
                                    : "text-zinc-700 hover:bg-zinc-100"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {getFormatIcon(fmt)}
                                  <span>{FORMAT_DETAILS[fmt].name}</span>
                                </span>
                                {targetFormat === fmt && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM RESET WORKSPACE BUTTON */}
          <div className="pt-4 border-t border-zinc-100">
            <button
              onClick={handleResetWorkspace}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Workspace</span>
            </button>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* CENTER & RIGHT MAIN WORKSPACE PANELS (FULL VIEWPORT HEIGHT)     */}
        {/* ============================================================== */}
        <main className="flex-1 p-6 space-y-3 flex flex-col min-h-[calc(100vh-100px)]">
          <h2 className="text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            INPUT CONTENT
          </h2>

          {/* DUAL PANELS GRID (STRETCHED TO BOTTOM OF VIEWPORT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-stretch min-h-[calc(100vh-170px)]">
            {/* ---------------------------------------------------------- */}
            {/* COLUMN 2: CENTER INPUT PANEL                               */}
            {/* ---------------------------------------------------------- */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col flex-1 h-full min-h-[calc(100vh-180px)]">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  INPUT
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {inputStats.characterCount} chars
                </span>
              </div>

              {/* Textarea Editor stretched to full vertical height */}
              <div className="flex-1 w-full pt-3 flex flex-col min-h-[calc(100vh-270px)]">
                <textarea
                  value={inputContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Paste text here or upload a file..."
                  className="flex-1 w-full h-full bg-transparent text-zinc-900 font-mono text-xs focus:outline-none resize-none leading-relaxed placeholder:text-zinc-300 selection:bg-orange-100 min-h-[calc(100vh-270px)]"
                />
              </div>

              {/* Bottom Input Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[11px] text-zinc-400">
                <div className="flex items-center gap-3">
                  <button onClick={handlePasteFromClipboard} className="hover:text-zinc-900 font-medium">Paste</button>
                  <span>•</span>
                  <button onClick={() => setInputContent("")} className="hover:text-rose-600 font-medium">Clear</button>
                  <span>•</span>
                  <button onClick={handleLoadSample} className="hover:text-orange-600 font-medium">Sample</button>
                </div>
                <span className="font-mono text-[10px]">{inputStats.formattedSize}</span>
              </div>
            </div>

            {/* ---------------------------------------------------------- */}
            {/* COLUMN 3: RIGHT OUTPUT PANEL                              */}
            {/* ---------------------------------------------------------- */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col flex-1 h-full min-h-[calc(100vh-180px)]">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  OUTPUT
                </span>

                {/* Output Toolbar Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyOutput}
                    disabled={!outputContent}
                    className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 disabled:opacity-30 transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={!outputContent}
                    className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 disabled:opacity-30 transition-colors"
                  >
                    Download
                  </button>

                  <button
                    onClick={() => setOutputTab(outputTab === "code" ? "preview" : "code")}
                    disabled={!outputContent}
                    className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 disabled:opacity-30 transition-colors"
                  >
                    {outputTab === "code" ? "Preview" : "Code"}
                  </button>

                  <button
                    onClick={() => setIsFullscreenOpen(true)}
                    disabled={!outputContent}
                    className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 disabled:opacity-30 transition-colors"
                  >
                    Fullscreen
                  </button>
                </div>
              </div>

              {/* Output Content or Reference Image "AWAITING CONVERSION" Placeholder */}
              <div className="flex-1 flex flex-col min-h-[calc(100vh-270px)]">
                {outputContent ? (
                  <div className="w-full h-full pt-4 flex-1">
                    {outputTab === "preview" ? (
                      renderInlineOutputPreview()
                    ) : (
                      <SyntaxHighlighter
                        code={outputContent}
                        format={targetFormat}
                        theme="light"
                        className="h-full border-none shadow-none min-h-[calc(100vh-290px)]"
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-3 text-center p-8">
                    <Sparkles className="w-10 h-10 text-zinc-200" />
                    <span className="text-xs font-bold tracking-wider text-zinc-300 uppercase">
                      AWAITING CONVERSION
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Rendered Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        content={outputContent}
        format={targetFormat}
        onCopy={handleCopyOutput}
        onDownload={handleDownload}
        copied={copied}
      />

      {/* Fullscreen Workspace Modal */}
      <FullscreenModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        inputContent={inputContent}
        setInputContent={handleContentChange}
        outputContent={outputContent}
        sourceFormat={sourceFormat}
        targetFormat={targetFormat}
        onCopy={handleCopyOutput}
        onDownload={handleDownload}
        copied={copied}
      />
    </div>
  );
};
