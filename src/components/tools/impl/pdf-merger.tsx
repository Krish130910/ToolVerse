"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Layers,
} from "lucide-react";
import { validatePdfFile, mergePdfs, getPdfDetails } from "@/lib/pdf-utils";

interface PdfItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export const PdfMergerTool: React.FC = () => {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMsg(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    const newItems: PdfItem[] = [];

    for (const f of filesArray) {
      const val = validatePdfFile(f);
      if (!val.valid) {
        setError(`File "${f.name}" is invalid: ${val.error}`);
        continue;
      }

      let pageCount: number | undefined = undefined;
      try {
        const details = await getPdfDetails(f);
        pageCount = details.pageCount;
      } catch (err) {
        console.warn(`Could not read page count for ${f.name}`);
      }

      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file: f,
        name: f.name,
        size: f.size,
        pageCount,
      });
    }

    setItems((prev) => [...prev, ...newItems]);
    // Reset file input value so re-selecting same files triggers change event
    e.target.value = "";
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setItems(updated);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setItems(updated);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearQueue = () => {
    setItems([]);
    setError(null);
    setSuccessMsg(null);
  };

  const handleMerge = async () => {
    if (items.length === 0) {
      setError("Please upload at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const rawFiles = items.map((item) => item.file);
      const res = await mergePdfs(rawFiles);

      const url = URL.createObjectURL(res.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setSuccessMsg(
        `Successfully merged ${items.length} PDF files (${res.totalMergedPages} total pages) into ${res.filename}!`
      );
    } catch (err: any) {
      console.error("Merge error:", err);
      setError(err?.message || "Failed to merge PDF files. Check that none are corrupted or encrypted.");
    } finally {
      setIsMerging(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalPagesInQueue = items.reduce((acc, curr) => acc + (curr.pageCount || 0), 0);

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Upload Header Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs min-w-0">
        <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
          <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">Add PDF Files to Merge</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1 text-center">
            Select multiple PDF documents to combine into a single clean PDF file. Reorder pages easily.
          </p>
          <span className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-2xs hover:bg-orange-600 transition-colors">
            Select PDF Files
          </span>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Error & Success Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* PDF Queue List & Action Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 min-w-0">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 flex-wrap gap-3 min-w-0">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>PDF Queue ({items.length} Files)</span>
            </h3>
            {items.length > 0 && (
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Total Pages: {totalPagesInQueue} • Drag or move items to adjust merge sequence
              </p>
            )}
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={clearQueue}
                className="text-xs font-bold border-zinc-200 hover:border-rose-300 hover:text-rose-600 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Queue</span>
              </Button>

              <Button
                onClick={handleMerge}
                disabled={isMerging || items.length === 0}
                variant="default"
                className="text-xs font-bold gap-2 shadow-2xs bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Merging PDFs...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Merge All {items.length} PDFs</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="p-10 text-center text-xs text-zinc-400 space-y-1">
            <p>No PDF files in queue.</p>
            <p className="text-[10px] text-zinc-400">Click the upload area above to add PDFs for merging.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200/90 rounded-xl min-w-0 flex-wrap gap-2 hover:border-orange-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <FileText className="w-5 h-5 text-orange-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-zinc-900 truncate max-w-xs sm:max-w-md">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {formatSize(item.size)}{" "}
                      {item.pageCount ? `• ${item.pageCount} Pages` : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-200 text-zinc-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === items.length - 1}
                    className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-200 text-zinc-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
