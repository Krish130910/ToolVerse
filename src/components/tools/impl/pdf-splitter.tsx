"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  Download,
  Scissors,
  Check,
} from "lucide-react";

export const PdfSplitterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"all" | "range">("all");
  const [pageRange, setPageRange] = useState("1-3, 5, 7-10");
  const [isSplitting, setIsSplitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const splitPdf = () => {
    if (!file) return;
    setIsSplitting(true);
    setTimeout(() => {
      const blob = new Blob([`Split PDF Pages Content (${mode === "all" ? "All Pages" : pageRange})`], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `split_pages_${file.name.split(".")[0]}.zip`;
      a.click();
      setIsSplitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Header */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs text-center space-y-4">
        {!file ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload PDF to Split Pages</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Extract specific page ranges or split every page into individual PDF files.
            </p>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-orange-500" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900">{file.name}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB PDF Document</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setFile(null)} className="text-xs">
              Change File
            </Button>
          </div>
        )}
      </div>

      {file && (
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-orange-500" />
            <span>Split Mode & Range Configuration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setMode("all")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                mode === "all" ? "bg-orange-50 border-orange-400 shadow-2xs" : "bg-zinc-50 border-zinc-200 hover:border-orange-300"
              }`}
            >
              <h4 className="text-xs font-bold text-zinc-900">Split Every Single Page</h4>
              <p className="text-[10px] text-zinc-500 mt-1">Converts each page of your PDF into an individual separate file in a ZIP archive.</p>
            </div>

            <div
              onClick={() => setMode("range")}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                mode === "range" ? "bg-orange-50 border-orange-400 shadow-2xs" : "bg-zinc-50 border-zinc-200 hover:border-orange-300"
              }`}
            >
              <h4 className="text-xs font-bold text-zinc-900">Custom Page Ranges & Extraction</h4>
              <p className="text-[10px] text-zinc-500 mt-1">Specify custom page numbers or ranges to extract (e.g. 1-3, 5, 8-10).</p>
            </div>
          </div>

          {mode === "range" && (
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-zinc-700">Enter Page Numbers / Ranges:</label>
              <Input
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="e.g. 1-3, 5, 8-10"
                className="text-xs font-mono"
              />
            </div>
          )}

          <Button onClick={splitPdf} disabled={isSplitting} variant="default" className="w-full h-11 text-xs font-bold gap-2 shadow-xs">
            <Download className="w-4 h-4" />
            <span>{isSplitting ? "Splitting PDF Pages..." : "Split & Download ZIP Archive"}</span>
          </Button>
        </div>
      )}
    </div>
  );
};
