"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  Download,
  Settings,
  Eye,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Info,
  Loader2,
} from "lucide-react";
import {
  validatePdfFile,
  getPdfDetails,
  addPageNumbersToPdf,
  AddPageNumbersOptions,
} from "@/lib/pdf-utils";

export const PdfPageNumbererTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Settings
  const [position, setPosition] = useState<AddPageNumbersOptions["position"]>("bottom-center");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#18181B");
  const [startNumber, setStartNumber] = useState(1);
  const [skipFirstPage, setSkipFirstPage] = useState(true);
  const [formatStr, setFormatStr] = useState("Page {n} of {total}");

  useEffect(() => {
    if (!file) {
      setPageCount(null);
      setError(null);
      setSuccessMsg(null);
      return;
    }

    const val = validatePdfFile(file);
    if (!val.valid) {
      setError(val.error || "Invalid file.");
      return;
    }

    setError(null);
    getPdfDetails(file)
      .then((details) => {
        setPageCount(details.pageCount);
      })
      .catch((err) => {
        console.error("Failed to parse PDF:", err);
        setError("Could not parse PDF. The file may be password protected or corrupted.");
      });
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

  const downloadProcessedPdf = async () => {
    if (!file || error) return;
    setIsProcessing(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await addPageNumbersToPdf(file, {
        position,
        fontSize,
        color,
        startNumber,
        skipFirstPage,
        formatStr,
      });

      const url = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setSuccessMsg(`Successfully stamped ${result.totalPages} pages in ${result.filename}!`);
    } catch (err: any) {
      console.error("Error processing PDF:", err);
      setError(err?.message || "Failed to stamp page numbers onto PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Upload Header Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs min-w-0">
        {!file ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload PDF Document</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1 text-center">
              Select or drag & drop a PDF file to add customizable page numbers. 100% client-side.
            </p>
            <span className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-2xs hover:bg-orange-600 transition-colors">
              Browse PDF File
            </span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
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
                  {pageCount !== null ? `${pageCount} Pages` : "Reading details..."}
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

      {/* Error / Success Alerts */}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
          {/* Settings Panel */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5 min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Settings className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Page Numbering Settings</span>
            </h3>

            {/* Position Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Position:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "top-left", label: "Top L" },
                  { id: "top-center", label: "Top C" },
                  { id: "top-right", label: "Top R" },
                  { id: "bottom-left", label: "Bot L" },
                  { id: "bottom-center", label: "Bot C" },
                  { id: "bottom-right", label: "Bot R" },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id as any)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      position === pos.id
                        ? "bg-orange-500 text-white border-orange-500 shadow-2xs font-bold"
                        : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-orange-300"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Number Format:</label>
              <Input
                value={formatStr}
                onChange={(e) => setFormatStr(e.target.value)}
                placeholder="Page {n} of {total}"
                className="text-xs font-mono"
              />
              <span className="text-[10px] text-zinc-400 block">
                Use {'{n}'} for page number and {'{total}'} for total count.
              </span>
            </div>

            {/* Font & Size */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Font Size ({fontSize}px):</label>
                <input
                  type="range"
                  min="8"
                  max="28"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Color:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
                  />
                  <span className="text-xs font-mono text-zinc-600">{color}</span>
                </div>
              </div>
            </div>

            {/* Start Number & Options */}
            <div className="space-y-3 pt-3 border-t border-zinc-100">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-zinc-700">Start Page Number:</label>
                <Input
                  type="number"
                  min="1"
                  value={startNumber}
                  onChange={(e) => setStartNumber(Math.max(1, Number(e.target.value)))}
                  className="w-20 h-8 text-xs font-mono text-right"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700 select-none">
                <input
                  type="checkbox"
                  checked={skipFirstPage}
                  onChange={(e) => setSkipFirstPage(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4 cursor-pointer accent-orange-500"
                />
                <span>Skip First Page (Cover Page)</span>
              </label>
            </div>

            {/* Process & Download */}
            <Button
              onClick={downloadProcessedPdf}
              disabled={isProcessing}
              variant="default"
              className="w-full h-11 text-xs font-bold gap-2 shadow-2xs bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Stamping PDF Page Numbers...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Apply & Download PDF</span>
                </>
              )}
            </Button>
          </div>

          {/* Live Page Preview Sheet */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Live Page Preview</span>
              </div>
              {pageCount !== null && (
                <span className="text-xs font-mono text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full font-bold">
                  {pageCount} Total Pages
                </span>
              )}
            </h3>

            {/* Simulated Paper Sheet */}
            <div className="bg-zinc-100 p-6 sm:p-8 rounded-xl flex items-center justify-center min-w-0 overflow-x-auto">
              <div className="w-64 sm:w-72 h-88 sm:h-96 bg-white border border-zinc-300 rounded-md shadow-md p-6 relative flex flex-col justify-between shrink-0">
                <div className="space-y-3 opacity-25">
                  <div className="h-4 bg-zinc-400 rounded w-3/4" />
                  <div className="h-2 bg-zinc-300 rounded w-full" />
                  <div className="h-2 bg-zinc-300 rounded w-5/6" />
                  <div className="h-2 bg-zinc-300 rounded w-4/5" />
                  <div className="h-24 bg-zinc-200 rounded w-full mt-4" />
                </div>

                {/* Stamped Page Number Element */}
                <div
                  style={{ color, fontSize: `${fontSize}px` }}
                  className={`absolute font-mono font-bold transition-all pointer-events-none ${
                    position === "top-left"
                      ? "top-4 left-4"
                      : position === "top-center"
                      ? "top-4 left-1/2 -translate-x-1/2"
                      : position === "top-right"
                      ? "top-4 right-4"
                      : position === "bottom-left"
                      ? "bottom-4 left-4"
                      : position === "bottom-center"
                      ? "bottom-4 left-1/2 -translate-x-1/2"
                      : "bottom-4 right-4"
                  }`}
                >
                  {formatStr
                    .replace("{n}", String(skipFirstPage ? startNumber : startNumber + 1))
                    .replace("{total}", String(pageCount ? (skipFirstPage ? pageCount - 1 : pageCount) : 10))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
