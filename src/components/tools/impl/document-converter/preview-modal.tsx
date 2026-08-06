"use client";

import React, { useMemo } from "react";
import { DocumentFormat, markdownToHtml, parseCSVToRows } from "@/lib/document-converter";
import { Button } from "@/components/ui/button";
import { X, Eye, Copy, Download, Check, FileText } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  format: DocumentFormat;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  content,
  format,
  onCopy,
  onDownload,
  copied,
}) => {
  if (!isOpen) return null;

  const renderedContent = useMemo(() => {
    if (!content.trim()) {
      return (
        <div className="py-12 text-center text-xs text-zinc-400 italic">
          No converted content available for preview.
        </div>
      );
    }

    if (format === "html") {
      return (
        <div className="p-6 bg-white text-zinc-900 rounded-xl border border-zinc-200 shadow-xs prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    if (format === "markdown") {
      const htmlFromMd = markdownToHtml(content);
      return (
        <div className="p-6 bg-white text-zinc-900 rounded-xl border border-zinc-200 shadow-xs prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: htmlFromMd }} />
        </div>
      );
    }

    if (format === "csv") {
      const rows = parseCSVToRows(content);
      if (rows.length === 0) return null;
      const headers = rows[0];
      const dataRows = rows.slice(1);

      return (
        <div className="overflow-x-auto border border-zinc-200 rounded-xl bg-white shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-100 text-zinc-800 font-bold border-b border-zinc-200">
                {headers.map((h, idx) => (
                  <th key={idx} className="p-3 border-r border-zinc-200 last:border-r-0">
                    {h || `Col ${idx + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="border-b border-zinc-100 hover:bg-orange-50/50 transition-colors"
                >
                  {headers.map((_, cIdx) => (
                    <td key={cIdx} className="p-3 border-r border-zinc-100 last:border-r-0 text-zinc-800">
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

    if (format === "json") {
      try {
        const parsed = JSON.parse(content);
        const formatted = JSON.stringify(parsed, null, 2);
        return (
          <pre className="p-5 bg-zinc-50 text-zinc-900 rounded-xl font-mono text-xs overflow-auto border border-zinc-200 shadow-inner max-h-[500px]">
            {formatted}
          </pre>
        );
      } catch {
        // Fallback
      }
    }

    // Default Plain Text Reading View
    return (
      <div className="p-6 bg-white text-zinc-800 rounded-xl border border-zinc-200 leading-relaxed font-sans text-sm whitespace-pre-wrap shadow-xs">
        {content}
      </div>
    );
  }, [content, format]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 id="preview-modal-title" className="text-sm font-bold text-zinc-900">
                Document Rendered Preview ({format.toUpperCase()})
              </h3>
              <p className="text-[11px] text-zinc-500">
                Live interactive rendering of converted output
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={onCopy} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>

            <Button onClick={onDownload} variant="default" size="sm" className="text-xs font-bold gap-1.5 shadow-2xs">
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </Button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-200/60 transition-colors"
              aria-label="Close preview modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-auto flex-1 bg-zinc-50/40">{renderedContent}</div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 text-[11px] text-zinc-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-orange-500" />
            Processed 100% locally in browser memory
          </span>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-xs font-semibold">
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
