"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  Download,
  Scissors,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Loader2,
  FileArchive,
} from "lucide-react";
import { validatePdfFile, splitPdf, getPdfDetails, parsePageRanges } from "@/lib/pdf-utils";

export const PdfSplitterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<"all" | "range">("all");
  const [pageRange, setPageRange] = useState("1-2");
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPageCount(null);
      setError(null);
      setSuccessMsg(null);
      return;
    }

    const val = validatePdfFile(file);
    if (!val.valid) {
      setError(val.error || "Invalid file format.");
      return;
    }

    setError(null);
    getPdfDetails(file)
      .then((details) => {
        setPageCount(details.pageCount);
        if (details.pageCount > 1) {
          setPageRange(`1-${Math.min(3, details.pageCount)}`);
        } else {
          setPageRange("1");
        }
      })
      .catch(() => setError("Could not read PDF. File may be encrypted or corrupted."));
  }, [file]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessMsg(null);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(null);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSplit = async () => {
    if (!file || error) return;

    if (mode === "range") {
      if (!pageRange.trim()) {
        setError("Please enter a valid page range (e.g. 1-3, 5).");
        return;
      }

      if (pageCount !== null) {
        const parsed = parsePageRanges(pageRange, pageCount);
        if (parsed.length === 0) {
          setError(`No valid pages selected for extraction. Document has ${pageCount} pages.`);
          return;
        }
      }
    }

    setIsSplitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await splitPdf(file, mode, pageRange);

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
        `Successfully extracted ${res.extractedPageCount} ${
          res.extractedPageCount === 1 ? "page" : "pages"
        } into ${res.filename}!`
      );
    } catch (err: any) {
      console.error("Split error:", err);
      setError(err?.message || "Failed to split PDF pages. Please verify your range settings.");
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* File Upload Header */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs min-w-0">
        {!file ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload PDF to Split Pages</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1 text-center">
              Extract specific page ranges or split every page into individual PDF files in a ZIP archive.
            </p>
            <span className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-2xs hover:bg-orange-600 transition-colors">
              Browse PDF File
            </span>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl flex-wrap gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left min-w-0">
                <h4 className="text-xs font-bold text-zinc-900 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h4>
                <p className="text-[10px] text-zinc-500 font-mono">
                  {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                  {pageCount !== null ? `${pageCount} Total Pages` : "Reading..."}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="text-xs font-bold gap-1.5 border-zinc-200 hover:border-orange-300 hover:text-orange-600 shadow-2xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change File</span>
            </Button>
          </div>
        )}
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

      {file && !error && (
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 min-w-0">
          <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-orange-500 shrink-0" />
            <span>Split Mode & Range Configuration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => {
                setMode("all");
                setError(null);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                mode === "all"
                  ? "bg-orange-50 border-orange-400 shadow-2xs"
                  : "bg-zinc-50 border-zinc-200 hover:border-orange-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-900">Split Every Single Page</h4>
                <FileArchive className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Converts each page of your PDF into an individual separate file inside a ZIP archive.
              </p>
            </div>

            <div
              onClick={() => {
                setMode("range");
                setError(null);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                mode === "range"
                  ? "bg-orange-50 border-orange-400 shadow-2xs"
                  : "bg-zinc-50 border-zinc-200 hover:border-orange-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-900">Custom Page Ranges & Extraction</h4>
                <Scissors className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Specify custom page numbers or range segments to extract (e.g. 1-3, 5, 8-10).
              </p>
            </div>
          </div>

          {mode === "range" && (
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-700">Enter Page Range / Segments:</label>
                {pageCount !== null && (
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Max Page: {pageCount}
                  </span>
                )}
              </div>
              <Input
                value={pageRange}
                onChange={(e) => {
                  setPageRange(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. 1-3, 5, 8-10"
                className="text-xs font-mono"
              />
              <span className="text-[10px] text-zinc-400 block">
                Comma-separated ranges or single page numbers. Example: "1-3, 5" extracts pages 1, 2, 3, and 5.
              </span>
            </div>
          )}

          <Button
            onClick={handleSplit}
            disabled={isSplitting}
            variant="default"
            className="w-full h-11 text-xs font-bold gap-2 shadow-2xs bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
          >
            {isSplitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Splitting PDF Pages...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{mode === "all" ? "Split All Pages to ZIP" : "Extract Selected Pages"}</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
