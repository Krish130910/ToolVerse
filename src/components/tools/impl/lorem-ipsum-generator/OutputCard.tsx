"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { OutputFormat, LoremMode } from "@/lib/lorem/types";
import {
  Copy,
  Check,
  Download,
  RefreshCw,
  Eye,
  Code2,
  Trash2,
  FileCode,
} from "lucide-react";

interface OutputCardProps {
  content: string;
  format: OutputFormat;
  mode: LoremMode;
  onRegenerate: () => void;
  onClear: () => void;
}

export const OutputCard: React.FC<OutputCardProps> = ({
  content,
  format,
  mode,
  onRegenerate,
  onClear,
}) => {
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleCopy = (type: "text" | "html" | "markdown") => {
    if (!content) return;
    let textToCopy = content;
    navigator.clipboard.writeText(textToCopy);
    setCopiedFormat(type);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  const handleDownload = (ext: "txt" | "html" | "md") => {
    if (!content) return;
    const mimeTypes = {
      txt: "text/plain",
      html: "text/html",
      md: "text/markdown",
    };
    const blob = new Blob([content], { type: `${mimeTypes[ext]};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lorem-ipsum.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-orange-500" />
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Placeholder Output ({format.toUpperCase()})
          </h4>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Code vs Rendered Toggle */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100/80 rounded-xl mr-2">
            <button
              type="button"
              onClick={() => setViewMode("code")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === "code"
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === "preview"
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Regenerate */}
          <button
            type="button"
            onClick={onRegenerate}
            title="Regenerate Lorem Ipsum"
            className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-orange-500" />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={onClear}
            title="Clear Output"
            className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Actions Bar: Copy Text, Copy HTML, Copy Markdown, Downloads */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Plain Text */}
          <Button
            onClick={() => handleCopy("text")}
            variant="default"
            size="sm"
            className="text-xs font-bold gap-1.5 shadow-2xs bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
          >
            {copiedFormat === "text" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFormat === "text" ? "Copied Text!" : "Copy Text"}</span>
          </Button>

          {/* Copy as HTML */}
          <Button
            onClick={() => handleCopy("html")}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 cursor-pointer bg-white"
          >
            {copiedFormat === "html" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>{copiedFormat === "html" ? "Copied HTML!" : "Copy HTML"}</span>
          </Button>

          {/* Copy as Markdown */}
          <Button
            onClick={() => handleCopy("markdown")}
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 cursor-pointer bg-white"
          >
            {copiedFormat === "markdown" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5" />}
            <span>{copiedFormat === "markdown" ? "Copied MD!" : "Copy Markdown"}</span>
          </Button>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-zinc-400 mr-1 hidden sm:inline">Export:</span>
          <button
            onClick={() => handleDownload("txt")}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3 text-zinc-500" />
            <span>.txt</span>
          </button>
          <button
            onClick={() => handleDownload("html")}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3 text-zinc-500" />
            <span>.html</span>
          </button>
          <button
            onClick={() => handleDownload("md")}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3 text-zinc-500" />
            <span>.md</span>
          </button>
        </div>
      </div>

      {/* Output Viewer Box */}
      {viewMode === "code" ? (
        <textarea
          readOnly
          rows={12}
          value={content}
          placeholder="Generated placeholder text will appear here..."
          className="w-full p-4 rounded-2xl border border-zinc-200/90 bg-zinc-900 text-orange-400 text-xs font-mono focus:outline-none leading-relaxed select-all shadow-inner"
        />
      ) : (
        <div className="w-full p-6 rounded-2xl border border-zinc-200/90 bg-zinc-50/50 min-h-[250px] max-h-[450px] overflow-y-auto text-zinc-900 text-xs leading-relaxed space-y-4 font-sans border-dashed">
          {format === "html" ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div className="whitespace-pre-wrap font-sans">{content}</div>
          )}
        </div>
      )}
    </div>
  );
};
