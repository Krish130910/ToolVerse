"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Download,
  Settings,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { validatePdfFile, compressPdf, getPdfDetails } from "@/lib/pdf-utils";

export const PdfCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [level, setLevel] = useState<"extreme" | "recommended" | "less">("recommended");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedData, setCompressedData] = useState<{
    blob: Blob;
    filename: string;
    originalSize: number;
    compressedSize: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPageCount(null);
      setCompressedData(null);
      setError(null);
      return;
    }

    const val = validatePdfFile(file);
    if (!val.valid) {
      setError(val.error || "Invalid file format.");
      return;
    }

    setError(null);
    setCompressedData(null);

    getPdfDetails(file)
      .then((details) => setPageCount(details.pageCount))
      .catch(() => setError("Could not read PDF. File may be encrypted or invalid."));
  }, [file]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(null);
    setCompressedData(null);
    setError(null);
  };

  const startCompress = async () => {
    if (!file || error) return;
    setIsCompressing(true);
    setError(null);

    try {
      const res = await compressPdf(file, level);
      setCompressedData(res);
    } catch (err: any) {
      console.error("Compression failed:", err);
      setError(err?.message || "Failed to compress PDF. Please try a different PDF document.");
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadPdf = () => {
    if (!compressedData) return;

    const url = URL.createObjectURL(compressedData.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = compressedData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Upload Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs min-w-0">
        {!file ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload PDF Document to Compress</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1 text-center">
              Optimize PDF structure and object streams. 100% client-side.
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
                  Original Size: {formatSize(file.size)} • {pageCount !== null ? `${pageCount} Pages` : "Reading..."}
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

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {file && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
          {/* Compression Level Selector */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5 min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Compression Level</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: "extreme",
                  title: "Extreme Optimization",
                  desc: "Strips non-essential metadata and optimizes all object streams.",
                },
                {
                  id: "recommended",
                  title: "Recommended Compression",
                  desc: "Optimal balance of PDF visual fidelity and stream structure.",
                },
                {
                  id: "less",
                  title: "Less Compression",
                  desc: "Preserves full document structure with basic stream pass.",
                },
              ].map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setLevel(c.id as any);
                    setCompressedData(null);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    level === c.id
                      ? "bg-orange-50 border-orange-400 shadow-2xs"
                      : "bg-zinc-50 border-zinc-200 hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-900">{c.title}</h4>
                    {level === c.id && <Zap className="w-3.5 h-3.5 text-orange-500" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">{c.desc}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={startCompress}
              disabled={isCompressing}
              variant="default"
              className="w-full h-11 text-xs font-bold gap-2 shadow-2xs bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compressing PDF...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Compress PDF File</span>
                </>
              )}
            </Button>
          </div>

          {/* Results Comparison & Download Panel */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center justify-between">
              <span>File Size Comparison & Download</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Intact PDF Quality
              </span>
            </h3>

            {compressedData !== null ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">
                      Original File Size
                    </span>
                    <p className="text-xl font-bold font-mono text-zinc-900">
                      {formatSize(compressedData.originalSize)}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-orange-50 border border-orange-200 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-orange-600">
                      Compressed Result Size
                    </span>
                    <p className="text-xl font-bold font-mono text-orange-600">
                      {formatSize(compressedData.compressedSize)}
                    </p>
                    {compressedData.compressedSize <= compressedData.originalSize ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block">
                        Saved{" "}
                        {Math.max(
                          0,
                          Math.round(
                            ((compressedData.originalSize - compressedData.compressedSize) /
                              compressedData.originalSize) *
                              100
                          )
                        )}
                        %
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full inline-block">
                        Already Optimal
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={downloadPdf}
                  variant="default"
                  className="w-full h-11 text-xs font-bold gap-2 shadow-2xs bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Compressed PDF Document</span>
                </Button>
              </div>
            ) : (
              <div className="p-10 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-500 space-y-2">
                <p>Select a compression level and click "Compress PDF File" to view size metrics.</p>
                <p className="text-[10px] text-zinc-400">
                  Client-side PDF stream optimization strips duplicate fonts, uncompressed object tables, and meta tags.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
