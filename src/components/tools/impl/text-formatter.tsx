"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Download,
  Trash2,
  Clipboard,
  Type,
  Sparkles,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  Code2,
  Smile,
  Hash,
  Scissors,
  RotateCcw,
} from "lucide-react";

export const TextFormatterTool: React.FC = () => {
  const [text, setText] = useState(`hello world from toolverse!
this is a sample text line.
another sample text line.
this is a sample text line.`);
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"case" | "clean" | "sort" | "strip">("case");

  // Wrapper for non-blocking state updates on large text
  const applyTransform = (fn: (input: string) => string) => {
    startTransition(() => {
      setText((prev) => fn(prev));
    });
  };

  // --- Formatting Actions (UNTOUCHED LOGIC) ---
  const toUppercase = () => applyTransform((s) => s.toUpperCase());
  const toLowercase = () => applyTransform((s) => s.toLowerCase());
  const toTitleCase = () =>
    applyTransform((s) =>
      s.replace(/\b\w+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    );
  const toSentenceCase = () =>
    applyTransform((s) =>
      s.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
    );
  const capitalizeEveryWord = () =>
    applyTransform((s) => s.replace(/\b([a-z])/g, (m, p1) => p1.toUpperCase()));
  const toggleCase = () =>
    applyTransform((s) =>
      s
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join("")
    );

  const processPerLine = (s: string, transform: (words: string[]) => string) => {
    return s
      .split("\n")
      .map((line) => {
        const words = line
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .split(/[^a-zA-Z0-9]+/)
          .filter(Boolean);
        if (words.length === 0) return line;
        return transform(words);
      })
      .join("\n");
  };

  const toCamelCase = () =>
    applyTransform((s) =>
      processPerLine(s, (words) =>
        words
          .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
          .join("")
      )
    );

  const toPascalCase = () =>
    applyTransform((s) =>
      processPerLine(s, (words) =>
        words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("")
      )
    );

  const toSnakeCase = () =>
    applyTransform((s) => processPerLine(s, (words) => words.map((w) => w.toLowerCase()).join("_")));

  const toKebabCase = () =>
    applyTransform((s) => processPerLine(s, (words) => words.map((w) => w.toLowerCase()).join("-")));

  const toConstantCase = () =>
    applyTransform((s) => processPerLine(s, (words) => words.map((w) => w.toUpperCase()).join("_")));

  const toDotCase = () =>
    applyTransform((s) => processPerLine(s, (words) => words.map((w) => w.toLowerCase()).join(".")));

  // --- Cleanup Tools (UNTOUCHED LOGIC) ---
  const removeExtraSpaces = () =>
    applyTransform((s) =>
      s
        .split("\n")
        .map((line) => line.replace(/[ \t]+/g, " ").trim())
        .join("\n")
    );

  const removeEmptyLines = () =>
    applyTransform((s) => s.split("\n").filter((line) => line.trim().length > 0).join("\n"));

  const trimWhitespace = () =>
    applyTransform((s) => s.split("\n").map((line) => line.trim()).join("\n"));

  const removeDuplicateLines = () =>
    applyTransform((s) => Array.from(new Set(s.split("\n"))).join("\n"));

  const removeDuplicateWords = () =>
    applyTransform((s) =>
      s
        .split("\n")
        .map((line) => {
          const seen = new Set<string>();
          return line
            .split(/(\s+)/)
            .filter((token) => {
              if (/^\s+$/.test(token) || !token) return true;
              const lower = token.toLowerCase();
              if (seen.has(lower)) return false;
              seen.add(lower);
              return true;
            })
            .join("");
        })
        .join("\n")
    );

  const sortLinesAz = () =>
    applyTransform((s) => s.split("\n").sort((a, b) => a.localeCompare(b)).join("\n"));

  const sortLinesZa = () =>
    applyTransform((s) => s.split("\n").sort((a, b) => b.localeCompare(a)).join("\n"));

  const reverseLines = () => applyTransform((s) => s.split("\n").reverse().join("\n"));

  const reverseCharacters = () => applyTransform((s) => s.split("").reverse().join(""));

  const reverseWords = () =>
    applyTransform((s) =>
      s
        .split("\n")
        .map((line) =>
          line
            .split(/(\s+)/)
            .filter((t) => !/^\s+$/.test(t) && t)
            .reverse()
            .join(" ")
        )
        .join("\n")
    );

  const removeNumbers = () => applyTransform((s) => s.replace(/[0-9]/g, ""));

  const removePunctuation = () =>
    applyTransform((s) => s.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>@\\[\]\\|]/g, ""));

  const removeSpecialCharacters = () =>
    applyTransform((s) => s.replace(/[^a-zA-Z0-9\s]/g, ""));

  const removeHtmlTags = () => applyTransform((s) => s.replace(/<[^>]*>/g, ""));

  const removeEmojis = () =>
    applyTransform((s) =>
      s.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}]/gu,
        ""
      )
    );

  // --- Controls & Clipboard (UNTOUCHED LOGIC) ---
  const clearText = () => applyTransform(() => "");

  const pasteText = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipboardText = await navigator.clipboard.readText();
        setText(clipboardText);
        setPasted(true);
        setTimeout(() => setPasted(false), 1500);
      }
    } catch (err) {
      console.error("Clipboard paste error:", err);
    }
  };

  const copyText = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted_text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // --- Metrics (UNTOUCHED LOGIC) ---
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;
  const lineCount = text === "" ? 0 : text.split("\n").length;

  return (
    <div className="w-full">
      {/* Main Studio Workspace: Equal Height 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
        {/* Left Column: Operations Control Studio Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Operations Category Selector Tabs */}
            <div className="flex items-center p-1 bg-zinc-100/90 rounded-xl gap-1 shrink-0">
              <button
                onClick={() => setActiveTab("case")}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                  activeTab === "case"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Case
              </button>
              <button
                onClick={() => setActiveTab("clean")}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                  activeTab === "clean"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Cleanup
              </button>
              <button
                onClick={() => setActiveTab("sort")}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                  activeTab === "sort"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Order
              </button>
              <button
                onClick={() => setActiveTab("strip")}
                className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                  activeTab === "strip"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Strip
              </button>
            </div>

            {/* Tab 1: Letter Case Transformations */}
            {activeTab === "case" && (
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 border-b border-zinc-100 pb-2.5 shrink-0">
                  <Type className="w-3.5 h-3.5 text-orange-500" />
                  <span>Letter Case Conversions</span>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1 items-start">
                  <Button onClick={toUppercase} variant="outline" size="sm" className="text-xs font-bold justify-start" aria-label="Convert to UPPERCASE">
                    UPPERCASE
                  </Button>
                  <Button onClick={toLowercase} variant="outline" size="sm" className="text-xs font-bold justify-start" aria-label="Convert to lowercase">
                    lowercase
                  </Button>
                  <Button onClick={toTitleCase} variant="outline" size="sm" className="text-xs font-bold justify-start" aria-label="Convert to Title Case">
                    Title Case
                  </Button>
                  <Button onClick={toSentenceCase} variant="outline" size="sm" className="text-xs font-bold justify-start" aria-label="Convert to Sentence case">
                    Sentence case
                  </Button>
                  <Button onClick={capitalizeEveryWord} variant="outline" size="sm" className="text-xs font-bold justify-start" aria-label="Capitalize Every Word">
                    Capitalize Words
                  </Button>
                  <Button onClick={toggleCase} variant="outline" size="sm" className="text-xs font-bold justify-start" aria-label="Toggle Case">
                    Toggle Case
                  </Button>
                  <Button onClick={toCamelCase} variant="outline" size="sm" className="text-xs font-bold font-mono justify-start" aria-label="Convert to camelCase">
                    camelCase
                  </Button>
                  <Button onClick={toPascalCase} variant="outline" size="sm" className="text-xs font-bold font-mono justify-start" aria-label="Convert to PascalCase">
                    PascalCase
                  </Button>
                  <Button onClick={toSnakeCase} variant="outline" size="sm" className="text-xs font-bold font-mono justify-start" aria-label="Convert to snake_case">
                    snake_case
                  </Button>
                  <Button onClick={toKebabCase} variant="outline" size="sm" className="text-xs font-bold font-mono justify-start" aria-label="Convert to kebab-case">
                    kebab-case
                  </Button>
                  <Button onClick={toConstantCase} variant="outline" size="sm" className="text-xs font-bold font-mono justify-start" aria-label="Convert to CONSTANT_CASE">
                    CONSTANT_CASE
                  </Button>
                  <Button onClick={toDotCase} variant="outline" size="sm" className="text-xs font-bold font-mono justify-start" aria-label="Convert to dot.case">
                    dot.case
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 2: Cleanup Tools */}
            {activeTab === "clean" && (
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 border-b border-zinc-100 pb-2.5 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Whitespace &amp; Deduplication</span>
                </div>
                <div className="space-y-2 flex-1">
                  <Button onClick={removeExtraSpaces} variant="outline" size="sm" className="w-full text-xs font-bold justify-start" aria-label="Remove Extra Spaces">
                    Remove Extra Spaces
                  </Button>
                  <Button onClick={removeEmptyLines} variant="outline" size="sm" className="w-full text-xs font-bold justify-start" aria-label="Remove Empty Lines">
                    Remove Empty Lines
                  </Button>
                  <Button onClick={trimWhitespace} variant="outline" size="sm" className="w-full text-xs font-bold justify-start" aria-label="Trim Whitespace">
                    Trim Line Whitespace
                  </Button>
                  <Button onClick={removeDuplicateLines} variant="outline" size="sm" className="w-full text-xs font-bold justify-start text-orange-600 border-orange-200 bg-orange-50/50 hover:bg-orange-100/50" aria-label="Remove Duplicate Lines">
                    Remove Duplicate Lines
                  </Button>
                  <Button onClick={removeDuplicateWords} variant="outline" size="sm" className="w-full text-xs font-bold justify-start text-orange-600 border-orange-200 bg-orange-50/50 hover:bg-orange-100/50" aria-label="Remove Duplicate Words">
                    Remove Duplicate Words
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 3: Order & Reverse Utilities */}
            {activeTab === "sort" && (
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 border-b border-zinc-100 pb-2.5 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-orange-500" />
                  <span>Sorting &amp; Reversal Tools</span>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1 items-start">
                  <Button onClick={sortLinesAz} variant="outline" size="sm" className="text-xs font-bold justify-start gap-1.5" aria-label="Sort A to Z">
                    <SortAsc className="w-3.5 h-3.5" />
                    <span>Sort A-Z</span>
                  </Button>
                  <Button onClick={sortLinesZa} variant="outline" size="sm" className="text-xs font-bold justify-start gap-1.5" aria-label="Sort Z to A">
                    <SortDesc className="w-3.5 h-3.5" />
                    <span>Sort Z-A</span>
                  </Button>
                  <Button onClick={reverseLines} variant="outline" size="sm" className="text-xs font-bold justify-start gap-1.5" aria-label="Reverse Lines">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Reverse Lines</span>
                  </Button>
                  <Button onClick={reverseWords} variant="outline" size="sm" className="text-xs font-bold justify-start gap-1.5" aria-label="Reverse Words">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reverse Words</span>
                  </Button>
                  <Button onClick={reverseCharacters} variant="outline" size="sm" className="col-span-2 text-xs font-bold justify-start gap-1.5" aria-label="Reverse Characters">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reverse Characters</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 4: Character & Markup Stripping */}
            {activeTab === "strip" && (
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 border-b border-zinc-100 pb-2.5 shrink-0">
                  <Scissors className="w-3.5 h-3.5 text-orange-500" />
                  <span>Character &amp; Markup Stripping</span>
                </div>
                <div className="space-y-2 flex-1">
                  <Button onClick={removeNumbers} variant="outline" size="sm" className="w-full text-xs font-bold justify-start gap-2" aria-label="Remove Numbers">
                    <Hash className="w-3.5 h-3.5" />
                    <span>Remove Numbers</span>
                  </Button>
                  <Button onClick={removePunctuation} variant="outline" size="sm" className="w-full text-xs font-bold justify-start gap-2" aria-label="Remove Punctuation">
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Remove Punctuation</span>
                  </Button>
                  <Button onClick={removeSpecialCharacters} variant="outline" size="sm" className="w-full text-xs font-bold justify-start gap-2" aria-label="Remove Special Characters">
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Remove Special Characters</span>
                  </Button>
                  <Button onClick={removeHtmlTags} variant="outline" size="sm" className="w-full text-xs font-bold justify-start gap-2" aria-label="Remove HTML Tags">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Remove HTML Tags</span>
                  </Button>
                  <Button onClick={removeEmojis} variant="outline" size="sm" className="w-full text-xs font-bold justify-start gap-2" aria-label="Remove Emojis">
                    <Smile className="w-3.5 h-3.5" />
                    <span>Remove Emojis</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Professional Editor Workspace (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
          {/* Top Editor Toolbar & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-3 gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-extrabold text-zinc-900 tracking-tight">Editor Canvas</span>
              {isPending && <span className="text-orange-600 text-[11px] font-semibold animate-pulse">(Processing...)</span>}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={pasteText}
                variant="outline"
                size="sm"
                className="text-xs font-bold gap-1.5 h-8 px-2.5"
                aria-label="Paste Text"
              >
                {pasted ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clipboard className="w-3.5 h-3.5" />}
                <span>{pasted ? "Pasted!" : "Paste"}</span>
              </Button>

              <Button
                onClick={clearText}
                variant="outline"
                size="sm"
                className="text-xs font-bold gap-1.5 h-8 px-2.5 text-rose-600 border-rose-200 hover:bg-rose-50"
                aria-label="Clear Text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </Button>

              <Button
                onClick={copyText}
                variant="default"
                size="sm"
                className="text-xs font-bold gap-1.5 h-8 px-3 shadow-2xs"
                aria-label="Copy Text"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </Button>

              <Button
                onClick={downloadText}
                variant="outline"
                size="sm"
                className="text-xs font-bold gap-1.5 h-8 px-2.5"
                aria-label="Download Text as TXT"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </Button>
            </div>
          </div>

          {/* Text Area Editor - Expands length-wise */}
          <div className="flex-1 flex flex-col min-h-[360px]">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              aria-label="Text editor content"
              className="w-full flex-1 min-h-[360px] p-4 rounded-xl border border-zinc-200/90 bg-zinc-50/70 text-zinc-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:bg-white transition-all resize-y"
            />
          </div>

          {/* Bottom Live Metrics Cards Bar */}
          <div className="pt-2 border-t border-zinc-100 grid grid-cols-3 gap-3 shrink-0">
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Words</span>
              <p className="text-sm sm:text-base font-black text-zinc-900 font-mono">{wordCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Characters</span>
              <p className="text-sm sm:text-base font-black text-zinc-900 font-mono">{charCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-center space-y-0.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lines</span>
              <p className="text-sm sm:text-base font-black text-zinc-900 font-mono">{lineCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
