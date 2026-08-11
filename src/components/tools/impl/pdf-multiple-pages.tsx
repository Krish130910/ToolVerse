"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Download,
  Grid,
  Settings,
  Eye,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Loader2,
  Layout,
} from "lucide-react";
import { validatePdfFile, arrangeNUpPdf, getPdfDetails, NUpOptions } from "@/lib/pdf-utils";

export const PdfMultiplePagesTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [gridMode, setGridMode] = useState<NUpOptions["gridMode"]>("4-up");
  const [orientation, setOrientation] = useState<NUpOptions["orientation"]>("landscape");
  const [margin, setMargin] = useState<NUpOptions["margin"]>("standard");
  const [isProcessing, setIsProcessing] = useState(false);
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
      .then((details) => setPageCount(details.pageCount))
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

  const processNUpPdf = async () => {
    if (!file || error) return;
    setIsProcessing(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await arrangeNUpPdf(file, {
        gridMode,
        orientation,
        margin,
      });

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
        `Successfully generated N-Up sheet grid (${res.totalSheets} total ${
          res.totalSheets === 1 ? "sheet" : "sheets"
        }) into ${res.filename}!`
      );
    } catch (err: any) {
      console.error("N-Up processing error:", err);
      setError(err?.message || "Failed to arrange PDF pages into sheet grid.");
    } finally {
      setIsProcessing(false);
    }
  };

  const pagesPerSheetNum = Number(gridMode.split("-")[0]);

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Upload Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs min-w-0">
        {!file ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload PDF for N-Up Sheet Grid</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1 text-center">
              Arrange 2, 4, 6, or 8 PDF pages onto a single sheet to save paper and create presentation handouts.
            </p>
            <span className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-2xs hover:bg-orange-600 transition-colors">
              Select PDF File
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
          {/* Controls Panel */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5 min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500 shrink-0" />
              <span>N-Up Layout Settings</span>
            </h3>

            {/* Grid Layout Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Pages per Sheet:</label>
              <div className="grid grid-cols-2 gap-2">
                {(["2-up", "4-up", "6-up", "8-up"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGridMode(g)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      gridMode === g
                        ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                        : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-orange-300"
                    }`}
                  >
                    {g} Grid
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Sheet Orientation:</label>
              <div className="grid grid-cols-2 gap-2">
                {(["landscape", "portrait"] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOrientation(o)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                      orientation === o
                        ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                        : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-orange-300"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Margin Option */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Page Margins:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["compact", "standard", "wide"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMargin(m)}
                    className={`py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      margin === m
                        ? "bg-orange-500 text-white border-orange-500 shadow-2xs font-bold"
                        : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-orange-300"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={processNUpPdf}
              disabled={isProcessing}
              variant="default"
              className="w-full h-11 text-xs font-bold gap-2 shadow-2xs bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating N-Up Grid...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download N-Up PDF</span>
                </>
              )}
            </Button>
          </div>

          {/* Live Sheet Grid Preview */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Sheet Layout Preview ({gridMode})</span>
              </div>
              {pageCount !== null && (
                <span className="text-xs font-mono text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full font-bold">
                  {Math.ceil(pageCount / pagesPerSheetNum)} Sheet(s) Output
                </span>
              )}
            </h3>

            <div className="bg-zinc-100 p-6 sm:p-8 rounded-xl flex items-center justify-center min-w-0 overflow-x-auto">
              <div
                className={`bg-white border border-zinc-300 rounded-lg p-3 shadow-md grid gap-2 shrink-0 ${
                  orientation === "landscape" ? "w-80 sm:w-96 h-56 sm:h-64" : "w-56 sm:w-64 h-80 sm:h-96"
                } ${
                  gridMode === "2-up"
                    ? orientation === "landscape"
                      ? "grid-cols-2 grid-rows-1"
                      : "grid-cols-1 grid-rows-2"
                    : gridMode === "4-up"
                    ? "grid-cols-2 grid-rows-2"
                    : gridMode === "6-up"
                    ? orientation === "landscape"
                      ? "grid-cols-3 grid-rows-2"
                      : "grid-cols-2 grid-rows-3"
                    : orientation === "landscape"
                    ? "grid-cols-4 grid-rows-2"
                    : "grid-cols-2 grid-rows-4"
                }`}
              >
                {Array.from({ length: pagesPerSheetNum }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-orange-50/80 border border-orange-200 rounded p-2 flex flex-col items-center justify-center gap-1 text-center min-w-0 min-h-0"
                  >
                    <Layout className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="text-[10px] font-mono font-bold text-orange-700 truncate w-full">
                      Page {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
