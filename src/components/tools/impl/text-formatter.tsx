"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Braces,
  Copy,
  Check,
  Download,
  ArrowRight,
  Code,
  FileText,
  Sparkles,
  ArrowUpDown,
  Scissors,
} from "lucide-react";

export const TextFormatterTool: React.FC = () => {
  const [text, setText] = useState(`hello world from toolverse!
this is a sample text line.
another sample text line.
this is a sample text line.`);
  const [copied, setCopied] = useState(false);

  const toUppercase = () => setText(text.toUpperCase());
  const toLowercase = () => setText(text.toLowerCase());
  const toTitleCase = () =>
    setText(text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()));
  const toSentenceCase = () =>
    setText(text.replace(/(^\s*|\.\s*)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase()));

  const removeDuplicates = () => {
    const lines = text.split("\n");
    const unique = Array.from(new Set(lines));
    setText(unique.join("\n"));
  };

  const sortLinesAz = () => {
    const lines = text.split("\n");
    lines.sort();
    setText(lines.join("\n"));
  };

  const reverseText = () => {
    setText(text.split("").reverse().join(""));
  };

  const trimLines = () => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    setText(lines.join("\n"));
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted_text.txt";
    a.click();
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text.split("\n").length;

  return (
    <div className="space-y-6">
      {/* Transformation Actions Toolbar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={toUppercase} variant="outline" size="sm" className="text-xs font-bold">
            UPPERCASE
          </Button>
          <Button onClick={toLowercase} variant="outline" size="sm" className="text-xs font-bold">
            lowercase
          </Button>
          <Button onClick={toTitleCase} variant="outline" size="sm" className="text-xs font-bold">
            Title Case
          </Button>
          <Button onClick={toSentenceCase} variant="outline" size="sm" className="text-xs font-bold">
            Sentence case
          </Button>
          <Button onClick={removeDuplicates} variant="outline" size="sm" className="text-xs font-bold text-orange-600 border-orange-200 bg-orange-50">
            Remove Duplicates
          </Button>
          <Button onClick={sortLinesAz} variant="outline" size="sm" className="text-xs font-bold">
            Sort A-Z
          </Button>
          <Button onClick={reverseText} variant="outline" size="sm" className="text-xs font-bold">
            Reverse
          </Button>
          <Button onClick={trimLines} variant="outline" size="sm" className="text-xs font-bold">
            Trim Empty Lines
          </Button>
        </div>
      </div>

      {/* Main Text Editor & Metrics Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-3 text-xs font-mono font-bold text-zinc-600">
            <span>{wordCount} words</span> • <span>{text.length} chars</span> • <span>{lineCount} lines</span>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={copyText} variant="default" size="sm" className="text-xs font-bold gap-1.5 shadow-2xs">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </Button>
            <Button onClick={downloadText} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
              <Download className="w-4 h-4" />
              <span>Download .txt</span>
            </Button>
          </div>
        </div>

        <textarea
          rows={14}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
        />
      </div>
    </div>
  );
};
