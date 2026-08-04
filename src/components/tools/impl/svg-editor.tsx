"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Braces,
  Upload,
  Download,
  Copy,
  Check,
  Code,
  Eye,
  Sliders,
  Zap,
} from "lucide-react";

export const SvgEditorTool: React.FC = () => {
  const [svgCode, setSvgCode] = useState(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="m9 12 2 2 4-4"/>
</svg>`);
  const [fillColor, setFillColor] = useState("#F97316");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setSvgCode(String(event.target.result));
      };
      reader.readAsText(e.target.files[0]);
    }
  };

  const optimizeSvg = () => {
    const clean = svgCode
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\s+/g, " ")
      .trim();
    setSvgCode(clean);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited_graphic.svg";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <label className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3.5 py-2 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload SVG File</span>
          <input type="file" accept=".svg" onChange={handleFileUpload} className="hidden" />
        </label>

        <div className="flex items-center gap-2">
          <Button onClick={optimizeSvg} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-500" />
            <span>Optimize SVG Code</span>
          </Button>

          <Button onClick={copyCode} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy SVG"}</span>
          </Button>

          <Button onClick={downloadSvg} variant="default" size="sm" className="text-xs font-bold gap-1.5 shadow-2xs">
            <Download className="w-3.5 h-3.5" />
            <span>Download SVG</span>
          </Button>
        </div>
      </div>

      {/* Split Editor & Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SVG Code Input Editor */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Raw SVG Markup Editor</h4>
          </div>
          <textarea
            rows={14}
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-900 text-orange-400 font-mono text-xs focus:outline-none"
          />
        </div>

        {/* Live Vector Preview */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              <span>Live Rendered SVG Vector</span>
            </h4>
          </div>
          <div
            className="w-full p-8 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-center min-h-[320px] shadow-inner"
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
        </div>
      </div>
    </div>
  );
};
