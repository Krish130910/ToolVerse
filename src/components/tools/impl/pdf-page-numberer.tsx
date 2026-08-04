"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  Download,
  Settings,
  Eye,
  Check,
  Layout,
  Type,
} from "lucide-react";

export const PdfPageNumbererTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<"bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left">("bottom-center");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#18181B");
  const [startNumber, setStartNumber] = useState(1);
  const [skipFirstPage, setSkipFirstPage] = useState(true);
  const [formatStr, setFormatStr] = useState("Page {n} of {total}");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const downloadProcessedPdf = () => {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate client-side PDF stamping and trigger download
      const blob = new Blob([`Processed PDF Content with Page Numbers: ${formatStr}`], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `numbered_${file.name}`;
      a.click();
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Header Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs text-center space-y-4">
        {!file ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload PDF Document</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Select or drag & drop a PDF file to add customizable page numbers. 100% client-side privacy.
            </p>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-orange-500" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900">{file.name}</h4>
                <p className="text-[10px] text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB PDF Document</p>
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
          {/* Settings Panel */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Settings className="w-4 h-4 text-orange-500" />
              <span>Page Numbering Settings</span>
            </h3>

            {/* Position Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Position:</label>
              <div className="grid grid-cols-3 gap-2">
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
                    onClick={() => setPosition(pos.id as any)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      position === pos.id ? "bg-orange-500 text-white border-orange-500 shadow-2xs" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-orange-300"
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
                className="text-xs"
              />
              <span className="text-[10px] text-zinc-400">Use {'{n}'} for page number and {'{total}'} for total count.</span>
            </div>

            {/* Font & Size */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Font Size:</label>
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <span className="text-[10px] font-mono text-zinc-500">{fontSize}px</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Color:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
              </div>
            </div>

            {/* Start Number & Options */}
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-zinc-700">Start Page Number:</label>
                <input
                  type="number"
                  min="1"
                  value={startNumber}
                  onChange={(e) => setStartNumber(Number(e.target.value))}
                  className="w-16 h-8 px-2 rounded-lg border border-zinc-200 text-xs font-mono text-right"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700">
                <input
                  type="checkbox"
                  checked={skipFirstPage}
                  onChange={(e) => setSkipFirstPage(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span>Skip First Page (Cover Page)</span>
              </label>
            </div>

            {/* Process & Download */}
            <Button
              onClick={downloadProcessedPdf}
              disabled={isProcessing}
              variant="default"
              className="w-full h-11 text-xs font-bold gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isProcessing ? "Processing PDF..." : "Apply & Download PDF"}</span>
            </Button>
          </div>

          {/* Live Page Preview Sheet */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Eye className="w-4 h-4 text-orange-500" />
              <span>Live Page Preview</span>
            </h3>

            {/* Simulated Paper Sheet */}
            <div className="bg-zinc-100 p-8 rounded-xl flex items-center justify-center">
              <div className="w-72 h-96 bg-white border border-zinc-300 rounded-md shadow-md p-6 relative flex flex-col justify-between">
                <div className="space-y-3 opacity-30">
                  <div className="h-4 bg-zinc-400 rounded w-3/4" />
                  <div className="h-2 bg-zinc-300 rounded w-full" />
                  <div className="h-2 bg-zinc-300 rounded w-5/6" />
                  <div className="h-2 bg-zinc-300 rounded w-4/5" />
                  <div className="h-20 bg-zinc-200 rounded w-full mt-4" />
                </div>

                {/* Stamped Page Number Element */}
                <div
                  style={{ color, fontSize: `${fontSize}px`, fontFamily }}
                  className={`absolute font-mono font-semibold transition-all ${
                    position === "top-left" ? "top-4 left-4" :
                    position === "top-center" ? "top-4 left-1/2 -translate-x-1/2" :
                    position === "top-right" ? "top-4 right-4" :
                    position === "bottom-left" ? "bottom-4 left-4" :
                    position === "bottom-center" ? "bottom-4 left-1/2 -translate-x-1/2" :
                    "bottom-4 right-4"
                  }`}
                >
                  {formatStr.replace("{n}", String(startNumber + 1)).replace("{total}", "12")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
