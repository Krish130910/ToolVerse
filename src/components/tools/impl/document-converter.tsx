"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Binary,
  Copy,
  Check,
  Download,
  ArrowRight,
  Code,
  FileText,
} from "lucide-react";

export const DocumentConverterTool: React.FC = () => {
  const [sourceFormat, setSourceFormat] = useState<"markdown" | "html" | "json" | "csv" | "txt">("markdown");
  const [targetFormat, setTargetFormat] = useState<"html" | "json" | "csv" | "txt" | "markdown">("html");
  const [inputCode, setInputCode] = useState(`# Welcome to ToolVerse Document Converter

- Convert **Markdown** to HTML, JSON, or TXT
- Fast 100% in-browser processing
- Instant copy and download capabilities`);
  const [copied, setCopied] = useState(false);

  // Perform document conversion
  const convertedOutput = useMemo(() => {
    try {
      if (!inputCode.trim()) return "";
      if (sourceFormat === "markdown" && targetFormat === "html") {
        return inputCode
          .replace(/^# (.*$)/gim, "<h1>$1</h1>")
          .replace(/^## (.*$)/gim, "<h2>$2</h2>")
          .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
          .replace(/\*(.*)\*/gim, "<em>$1</em>")
          .replace(/^- (.*$)/gim, "<li>$1</li>");
      }
      if (sourceFormat === "markdown" && targetFormat === "json") {
        const lines = inputCode.split("\n").filter(Boolean);
        return JSON.stringify({ documentTitle: "Converted Document", contentLines: lines }, null, 2);
      }
      if (sourceFormat === "json" && targetFormat === "csv") {
        const parsed = JSON.parse(inputCode);
        if (Array.isArray(parsed)) {
          const keys = Object.keys(parsed[0] || {});
          return [keys.join(","), ...parsed.map((row) => keys.map((k) => JSON.stringify(row[k])).join(","))].join("\n");
        }
        return "Key,Value\n" + Object.entries(parsed).map(([k, v]) => `"${k}","${v}"`).join("\n");
      }
      // Fallback plain text clean
      return inputCode.replace(/[*#_`]/g, "");
    } catch (e: any) {
      return `Conversion Error: ${e.message}`;
    }
  }, [inputCode, sourceFormat, targetFormat]);

  const copyOutput = () => {
    navigator.clipboard.writeText(convertedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadDocument = () => {
    const extMap = { html: "html", json: "json", csv: "csv", txt: "txt", markdown: "md" };
    const blob = new Blob([convertedOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document.${extMap[targetFormat] || "txt"}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Format Selector Controls */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="space-y-1 flex-1 sm:flex-none">
            <label className="text-xs font-bold text-zinc-700">From Format:</label>
            <select
              value={sourceFormat}
              onChange={(e) => setSourceFormat(e.target.value as any)}
              className="w-full sm:w-40 h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900"
            >
              <option value="markdown">Markdown (.md)</option>
              <option value="html">HTML (.html)</option>
              <option value="json">JSON (.json)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="txt">Plain Text (.txt)</option>
            </select>
          </div>

          <ArrowRight className="w-5 h-5 text-orange-500 mt-5 shrink-0" />

          <div className="space-y-1 flex-1 sm:flex-none">
            <label className="text-xs font-bold text-zinc-700">To Format:</label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value as any)}
              className="w-full sm:w-40 h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900"
            >
              <option value="html">HTML (.html)</option>
              <option value="json">JSON (.json)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="markdown">Markdown (.md)</option>
              <option value="txt">Plain Text (.txt)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={copyOutput} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
            {copied ? <Check className="w-4 h-4 text-orange-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy Output"}</span>
          </Button>

          <Button onClick={downloadDocument} variant="default" size="sm" className="text-xs font-bold gap-1.5 shadow-2xs">
            <Download className="w-4 h-4" />
            <span>Download .{targetFormat}</span>
          </Button>
        </div>
      </div>

      {/* Split Code View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Code Editor */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Input Document ({sourceFormat.toUpperCase()})</h4>
            <span className="text-[10px] text-zinc-400 font-mono">{inputCode.length} characters</span>
          </div>
          <textarea
            rows={14}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          />
        </div>

        {/* Converted Output View */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Converted Output ({targetFormat.toUpperCase()})</h4>
            <span className="text-[10px] text-zinc-400 font-mono">{convertedOutput.length} characters</span>
          </div>
          <textarea
            readOnly
            rows={14}
            value={convertedOutput}
            className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-mono text-xs focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
