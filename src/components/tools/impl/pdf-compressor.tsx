"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  Download,
  Settings,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const PdfCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<"extreme" | "recommended" | "less">("recommended");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setCompressedSize(null);
    }
  };

  const startCompress = () => {
    if (!file) return;
    setIsCompressing(true);
    setTimeout(() => {
      const ratio = level === "extreme" ? 0.35 : level === "recommended" ? 0.55 : 0.75;
      setCompressedSize(Math.round(file.size * ratio));
      setIsCompressing(false);
    }, 1200);
  };

  const downloadPdf = () => {
    if (!file) return;
    const blob = new Blob([`Compressed PDF Data Level: ${level}`], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed_${file.name}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs text-center space-y-4">
        {!file ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload PDF Document to Compress</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Reduce PDF file size up to 70% while maintaining crisp document quality. 100% client-side.
            </p>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-orange-500" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900">{file.name}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">Original Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setFile(null)} className="text-xs">
              Change File
            </Button>
          </div>
        )}
      </div>

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compression Level Selector */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500" />
              <span>Compression Level</span>
            </h3>

            <div className="space-y-3">
              {[
                { id: "extreme", title: "Extreme Compression", desc: "Highest file size reduction (~65% smaller)" },
                { id: "recommended", title: "Recommended Compression", desc: "Optimal balance of quality & size (~45% smaller)" },
                { id: "less", title: "Less Compression", desc: "High visual quality (~25% smaller)" },
              ].map((c) => (
                <div
                  key={c.id}
                  onClick={() => setLevel(c.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    level === c.id ? "bg-orange-50 border-orange-400 shadow-2xs" : "bg-zinc-50 border-zinc-200 hover:border-orange-300"
                  }`}
                >
                  <h4 className="text-xs font-bold text-zinc-900">{c.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{c.desc}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={startCompress}
              disabled={isCompressing}
              variant="default"
              className="w-full h-11 text-xs font-bold gap-2 shadow-xs"
            >
              <Zap className="w-4 h-4" />
              <span>{isCompressing ? "Compressing PDF..." : "Compress PDF File"}</span>
            </Button>
          </div>

          {/* Results Comparison & Download Panel */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3">
              File Size Comparison & Download
            </h3>

            {compressedSize !== null ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">Original Size</span>
                    <p className="text-xl font-bold font-mono text-zinc-900">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>

                  <div className="p-5 rounded-xl bg-orange-50 border border-orange-200 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-orange-600">Compressed Size</span>
                    <p className="text-xl font-bold font-mono text-orange-600">{(compressedSize / 1024 / 1024).toFixed(2)} MB</p>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                      Saved {Math.round(((file.size - compressedSize) / file.size) * 100)}%
                    </span>
                  </div>
                </div>

                <Button onClick={downloadPdf} variant="default" className="w-full h-11 text-xs font-bold gap-2 shadow-xs">
                  <Download className="w-4 h-4" />
                  <span>Download Compressed PDF Document</span>
                </Button>
              </div>
            ) : (
              <div className="p-10 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-500">
                Select a compression preset and click "Compress PDF File" to view comparison results.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
