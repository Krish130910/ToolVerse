"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  FileCode,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Copy,
  Check,
  Download,
  Eye,
  FileText,
  Sparkles,
  ChevronDown,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  parseMarkdownToHtml,
  calculateMarkdownStats,
} from "@/lib/markdown-editor/parser";
import {
  exportMarkdownFile,
  exportHtmlDocument,
} from "@/lib/markdown-editor/exporter";
import { SAMPLE_MARKDOWN_TEMPLATES } from "@/lib/markdown-editor/samples";
import { MarkdownTemplate } from "@/lib/markdown-editor/types";

// Toast Notification Type
interface ToastNotification {
  id: string;
  type: "success" | "info" | "error";
  message: string;
}

export const MarkdownEditorTool: React.FC = () => {
  // Main State
  const [markdown, setMarkdown] = useState<string>(
    SAMPLE_MARKDOWN_TEMPLATES[0].content
  );
  const [previewMode, setPreviewMode] = useState<"preview" | "html">("preview");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSamplesMenu, setShowSamplesMenu] = useState<boolean>(false);

  // Copy Feedback States
  const [copiedMd, setCopiedMd] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Textarea Ref for cursor selection insertion
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addToast = (type: "success" | "info" | "error", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // 1. Calculate Live Statistics
  const stats = useMemo(() => calculateMarkdownStats(markdown), [markdown]);

  // 2. Parse & Sanitize HTML Output
  const renderedHtml = useMemo(
    () => parseMarkdownToHtml(markdown),
    [markdown]
  );

  // 3. Selection-Aware Formatting Insertion
  const insertFormatting = useCallback(
    (prefix: string, suffix: string = "", defaultText: string = "text") => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setMarkdown((prev) => prev + `${prefix}${defaultText}${suffix}`);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdown.substring(start, end) || defaultText;
      const replacement = `${prefix}${selectedText}${suffix}`;

      const newMarkdown =
        markdown.substring(0, start) + replacement + markdown.substring(end);
      setMarkdown(newMarkdown);

      // Restore focus & cursor selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selectedText.length
        );
      }, 10);
    },
    [markdown]
  );

  // Formatting Actions Handlers
  const handleBold = () => insertFormatting("**", "**", "bold text");
  const handleItalic = () => insertFormatting("*", "*", "italic text");
  const handleStrikethrough = () => insertFormatting("~~", "~~", "strikethrough");
  const handleH1 = () => insertFormatting("# ", "", "Heading 1");
  const handleH2 = () => insertFormatting("## ", "", "Heading 2");
  const handleH3 = () => insertFormatting("### ", "", "Heading 3");
  const handleUnorderedList = () => insertFormatting("- ", "", "List item");
  const handleOrderedList = () => insertFormatting("1. ", "", "List item");
  const handleTaskList = () => insertFormatting("- [ ] ", "", "Task item");
  const handleBlockquote = () => insertFormatting("> ", "", "Quote text");
  const handleCodeInline = () => insertFormatting("`", "`", "code");
  const handleCodeBlock = () =>
    insertFormatting("```javascript\n", "\n```", '// Write code here\nconsole.log("Hello ToolVerse!");');
  const handleLink = () =>
    insertFormatting("[", "](https://example.com)", "Link text");
  const handleImage = () =>
    insertFormatting("![", "](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600)", "Image description");
  const handleTable = () =>
    insertFormatting(
      "\n| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Item A | 100 | Active |\n| Item B | 200 | Pending |\n",
      "",
      ""
    );
  const handleHr = () => insertFormatting("\n---\n", "", "");

  // Template Selection
  const handleSelectTemplate = (tmpl: MarkdownTemplate) => {
    setMarkdown(tmpl.content);
    setShowSamplesMenu(false);
    addToast("info", `Loaded "${tmpl.name}" template`);
  };

  // Copy Actions
  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedMd(true);
      addToast("success", "Raw Markdown copied to clipboard!");
      setTimeout(() => setCopiedMd(false), 2000);
    } catch {
      addToast("error", "Failed to copy Markdown");
    }
  };

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(renderedHtml);
      setCopiedHtml(true);
      addToast("success", "Parsed HTML copied to clipboard!");
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch {
      addToast("error", "Failed to copy HTML");
    }
  };

  // Export File Actions (Pure Document Output)
  const handleExportMd = () => {
    exportMarkdownFile(markdown, "document.md");
    addToast("success", "Exported document.md successfully!");
  };

  const handleExportHtml = () => {
    exportHtmlDocument(renderedHtml, "document.html", "Markdown Document");
    addToast("success", "Exported document.html successfully!");
  };

  // Reset Editor
  const handleReset = () => {
    if (confirm("Are you sure you want to clear the editor?")) {
      setMarkdown("");
      addToast("info", "Editor cleared");
    }
  };

  return (
    <>
      {/* Toast Notifications List */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className={`px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 pointer-events-auto backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-emerald-900/90 border-emerald-700 text-emerald-100"
                  : toast.type === "error"
                  ? "bg-rose-900/90 border-rose-700 text-rose-100"
                  : "bg-zinc-900/90 border-zinc-700 text-zinc-100"
              }`}
            >
              <Check className="w-3.5 h-3.5 text-orange-400" />
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="space-y-6 w-full min-w-0">
        {/* ── Top Primary Action & Formatting Toolbar ─────────────────── */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3 w-full min-w-0">
          {/* Group 1: Templates & Formatting Shortcuts */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0 w-full lg:w-auto">
            {/* Templates Selector */}
            <div className="relative shrink-0 mr-1">
              <button
                type="button"
                onClick={() => setShowSamplesMenu((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors font-bold text-xs shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Templates</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
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
                      Preset Documents
                    </div>
                    {SAMPLE_MARKDOWN_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-between"
                      >
                        <span>{tmpl.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {tmpl.category}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-zinc-200 mx-1 hidden sm:block" />

            {/* Quick Formatting Buttons */}
            <button
              onClick={handleBold}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleItalic}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleStrikethrough}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Strikethrough (~~text~~)"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleH1}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Heading 1 (# Heading)"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleH2}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Heading 2 (## Heading)"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleH3}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Heading 3 (### Heading)"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleUnorderedList}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Bullet List (- item)"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleOrderedList}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Numbered List (1. item)"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleTaskList}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Task List (- [ ] task)"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleBlockquote}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Blockquote (> quote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCodeInline}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Inline Code (`code`)"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCodeBlock}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Code Block (```lang)"
            >
              <FileCode className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLink}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Link ([title](url))"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleImage}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Image (![alt](url))"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleTable}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Markdown Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleHr}
              className="p-2 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              title="Horizontal Rule (---)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Group 2: Copy & Export Controls */}
          <div className="flex items-center gap-2 flex-wrap min-w-0 w-full lg:w-auto justify-end">
            <Button
              onClick={handleCopyMarkdown}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 rounded-xl border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs flex-1 sm:flex-initial"
            >
              {copiedMd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied MD</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Copy MD</span>
                </>
              )}
            </Button>

            <Button
              onClick={handleCopyHtml}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 rounded-xl border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs flex-1 sm:flex-initial"
            >
              {copiedHtml ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied HTML</span>
                </>
              ) : (
                <>
                  <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Copy HTML</span>
                </>
              )}
            </Button>

            <Button
              onClick={handleExportMd}
              variant="default"
              size="sm"
              className="text-xs font-bold gap-1.5 rounded-xl shadow-2xs bg-zinc-900 hover:bg-zinc-800 text-white flex-1 sm:flex-initial"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </Button>

            <Button
              onClick={handleExportHtml}
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5 rounded-xl border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs flex-1 sm:flex-initial"
            >
              <Download className="w-3.5 h-3.5 text-orange-500" />
              <span>Export .html</span>
            </Button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs shrink-0 cursor-pointer"
              title="Clear Editor"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Main Workspace: 2-Column Responsive Split ───────────────── */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0 ${
            isFullscreen ? "fixed inset-0 z-50 bg-[#FAF8F5] p-6 overflow-auto" : ""
          }`}
        >
          {/* ═════════════════════════════════════════════════════════════════
              LEFT COLUMN: MARKDOWN SOURCE EDITOR
             ═════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 min-w-0 w-full overflow-hidden">
            {/* Editor Header Bar */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 min-w-0 flex-wrap gap-2">
              <div className="flex items-center gap-2 shrink-0">
                <FileText className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Raw Markdown Source
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono text-zinc-500">
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                  {stats.lines} L
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                  {stats.words} W
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                  {stats.chars} C
                </span>
              </div>
            </div>

            {/* Code Textarea Input */}
            <div className="relative flex-1 min-h-[420px] w-full min-w-0">
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type or paste raw Markdown content here..."
                spellCheck={false}
                className="w-full h-full min-h-[420px] p-4 rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-orange-400 transition-all resize-y selection:bg-orange-500/30 selection:text-orange-200 overflow-x-auto whitespace-pre-wrap break-all min-w-0"
              />
            </div>

            {/* Editor Footer / Reading Time Indicator */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-zinc-500 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] text-zinc-500">100% Client-Side Safe</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Est. Reading: {stats.readingTimeMinutes} min</span>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT COLUMN: LIVE RENDERED PREVIEW
             ═════════════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 min-w-0 w-full overflow-hidden">
            {/* Preview Header & Controls */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 min-w-0 flex-wrap gap-2">
              <div className="flex items-center gap-2 shrink-0">
                <Eye className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Live Rendered View
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* View Mode Toggle: Preview vs HTML Source */}
                <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("preview")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      previewMode === "preview"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    <Eye className="w-3 h-3 text-orange-500" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewMode("html")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      previewMode === "html"
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    <Code className="w-3 h-3 text-indigo-500" />
                    <span>HTML</span>
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                    className="p-1 rounded-lg hover:bg-white text-zinc-600 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="px-1.5 text-[10px] font-mono font-bold text-zinc-700 hover:text-orange-600"
                    title="Reset Zoom"
                  >
                    {zoomLevel}%
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                    className="p-1 rounded-lg hover:bg-white text-zinc-600 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullscreen((v) => !v)}
                  className="p-1.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-orange-600 hover:border-orange-300 transition-colors shadow-2xs cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5 text-orange-500" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-orange-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Document Canvas Container */}
            <div className="w-full min-h-[420px] flex-1 rounded-xl border border-zinc-200/90 bg-zinc-50/60 p-5 sm:p-6 overflow-auto min-w-0">
              {previewMode === "preview" ? (
                <div
                  className="transition-all duration-150 ease-out origin-top-left w-full min-w-0"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                >
                  {renderedHtml ? (
                    <div
                      className="markdown-rendered-body text-zinc-900 text-xs leading-relaxed space-y-3 min-w-0"
                      dangerouslySetInnerHTML={{ __html: renderedHtml }}
                    />
                  ) : (
                    <div className="py-20 text-center space-y-2 text-zinc-400">
                      <Zap className="w-8 h-8 mx-auto text-orange-400 opacity-60" />
                      <p className="text-xs font-semibold text-zinc-500">
                        Markdown Document is Empty
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Type in the left editor or select a template above to preview styled HTML output.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Raw Parsed HTML View */
                <pre className="p-4 rounded-xl bg-zinc-900 text-orange-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all min-h-[380px]">
                  {renderedHtml}
                </pre>
              )}
            </div>

            {/* Bottom Status Footer */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-zinc-500 text-[11px] font-mono">
              <span className="text-[10px] text-zinc-400">
                Mode: {previewMode === "preview" ? "Rich Styled Document" : "Raw HTML Markup"}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">
                XSS Sanitized & Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Markdown Rendered Document CSS Custom Injector */}
      <style jsx global>{`
        .markdown-rendered-body h1 {
          font-size: 1.65rem;
          font-weight: 800;
          color: #18181b;
          border-bottom: 1px solid #e4e4e7;
          padding-bottom: 0.4rem;
          margin-top: 1rem;
          margin-bottom: 0.6rem;
        }
        .markdown-rendered-body h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #18181b;
          border-bottom: 1px solid #f4f4f5;
          padding-bottom: 0.3rem;
          margin-top: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .markdown-rendered-body h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #27272a;
          margin-top: 0.8rem;
          margin-bottom: 0.4rem;
        }
        .markdown-rendered-body p {
          margin-bottom: 0.75rem;
          color: #3f3f46;
          line-height: 1.65;
        }
        .markdown-rendered-body a {
          color: #f97316;
          font-weight: 600;
          text-decoration: underline;
        }
        .markdown-rendered-body a:hover {
          color: #ea580c;
        }
        .markdown-rendered-body code.inline-code {
          background-color: #ffedd5;
          color: #c2410c;
          padding: 0.15rem 0.4rem;
          border-radius: 0.375rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.8em;
          border: 1px solid #fed7aa;
        }
        .markdown-rendered-body pre.code-block {
          background-color: #18181b;
          color: #fdba74;
          padding: 0.85rem 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.8rem;
          margin: 0.75rem 0;
          border: 1px solid #27272a;
        }
        .markdown-rendered-body blockquote {
          border-left: 4px solid #f97316;
          background-color: #fff7ed;
          padding: 0.6rem 1rem;
          border-radius: 0 0.5rem 0.5rem 0;
          margin: 0.75rem 0;
          color: #7c2d12;
          font-style: italic;
        }
        .markdown-rendered-body ul {
          list-style-type: disc;
          padding-left: 1.4rem;
          margin-bottom: 0.75rem;
        }
        .markdown-rendered-body ol {
          list-style-type: decimal;
          padding-left: 1.4rem;
          margin-bottom: 0.75rem;
        }
        .markdown-rendered-body li {
          margin-bottom: 0.25rem;
          color: #3f3f46;
        }
        .markdown-rendered-body ul.task-list {
          list-style-type: none;
          padding-left: 0;
        }
        .markdown-rendered-body li.task-item {
          display: flex;
          items-center: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }
        .markdown-rendered-body li.task-item.completed {
          text-decoration: line-through;
          color: #a1a1aa;
        }
        .markdown-rendered-body hr {
          border: 0;
          border-top: 1px solid #e4e4e7;
          margin: 1.25rem 0;
        }
        .markdown-rendered-body .table-container {
          overflow-x: auto;
          margin: 0.85rem 0;
          border-radius: 0.625rem;
          border: 1px solid #e4e4e7;
        }
        .markdown-rendered-body table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.8rem;
        }
        .markdown-rendered-body th {
          background-color: #f4f4f5;
          font-weight: 700;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e4e4e7;
          color: #18181b;
        }
        .markdown-rendered-body td {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e4e4e7;
          color: #3f3f46;
        }
        .markdown-rendered-body img.preview-image {
          max-width: 100%;
          height: auto;
          border-radius: 0.625rem;
          margin: 0.75rem 0;
          border: 1px solid #e4e4e7;
        }
      `}</style>
    </>
  );
};
