"use client";

import React from "react";
import { DocumentFormat } from "@/lib/document-converter";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Copy, Download, Check, FileText } from "lucide-react";
import { SyntaxHighlighter } from "./syntax-highlighter";
import { VSCodeInputEditor } from "./vscode-editor";

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputContent: string;
  setInputContent: (val: string) => void;
  outputContent: string;
  sourceFormat: DocumentFormat;
  targetFormat: DocumentFormat;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isOpen,
  onClose,
  inputContent,
  setInputContent,
  outputContent,
  sourceFormat,
  targetFormat,
  onCopy,
  onDownload,
  copied,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#FAF8F5] text-zinc-900 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullscreen-modal-title"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
            <Maximize2 className="w-5 h-5" />
          </div>
          <div>
            <h2 id="fullscreen-modal-title" className="text-base font-bold text-zinc-900 flex items-center gap-2">
              ToolVerse Document Converter — Fullscreen Workspace
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-mono">
                {sourceFormat.toUpperCase()} → {targetFormat.toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-zinc-500">
              Distraction-free side-by-side editing and live converter inspection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={onCopy} variant="outline" size="sm" className="text-xs font-bold gap-1.5 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50">
            {copied ? <Check className="w-4 h-4 text-orange-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied Output!" : "Copy Output"}</span>
          </Button>

          <Button onClick={onDownload} variant="default" size="sm" className="text-xs font-bold gap-1.5 bg-orange-500 hover:bg-orange-600 text-white shadow-2xs">
            <Download className="w-4 h-4" />
            <span>Download .{targetFormat}</span>
          </Button>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-800 rounded-xl hover:bg-zinc-100 transition-colors ml-2"
            aria-label="Exit fullscreen mode"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden bg-[#FAF8F5]">
        {/* Left Input Pane */}
        <div className="flex flex-col h-full bg-[#1e1e2e] text-zinc-100 border border-zinc-800 rounded-2xl overflow-hidden shadow-md">
          <div className="flex items-center justify-between px-4 py-3 bg-[#181825] border-b border-zinc-800">
            <h3 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Source Input ({sourceFormat.toUpperCase()})
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              {inputContent.length.toLocaleString()} chars | {inputContent.split("\n").length} lines
            </span>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <VSCodeInputEditor
              value={inputContent}
              onChange={setInputContent}
              placeholder="Type or paste source document here..."
              className="flex-1 max-h-none h-full"
              minHeight="100%"
            />
          </div>
        </div>

        {/* Right Output Pane */}
        <div className="flex flex-col h-full bg-[#1e1e2e] text-zinc-100 border border-zinc-800 rounded-2xl overflow-hidden shadow-md">
          <div className="flex items-center justify-between px-4 py-3 bg-[#181825] border-b border-zinc-800">
            <h3 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Converted Output ({targetFormat.toUpperCase()})
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              {outputContent.length.toLocaleString()} chars | {outputContent.split("\n").length} lines
            </span>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <SyntaxHighlighter code={outputContent} format={targetFormat} className="flex-1 max-h-none h-full border-none rounded-none" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-zinc-200 bg-white text-xs text-zinc-500 flex items-center justify-between shadow-xs">
        <span className="flex items-center gap-2 text-zinc-600">
          <FileText className="w-4 h-4 text-orange-500" />
          Press Esc or click exit button to return to standard view
        </span>
        <Button onClick={onClose} variant="ghost" size="sm" className="text-xs text-zinc-600 hover:text-zinc-900">
          Exit Fullscreen Workspace
        </Button>
      </div>
    </div>
  );
};
