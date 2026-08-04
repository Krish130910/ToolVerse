"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Binary,
  Copy,
  Check,
  Download,
  RefreshCw,
  FileText,
} from "lucide-react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export const LoremIpsumGeneratorTool: React.FC = () => {
  const [type, setType] = useState<"paragraphs" | "words" | "sentences" | "list">("paragraphs");
  const [count, setCount] = useState(3);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatedText = useMemo(() => {
    let result = "";
    if (type === "words") {
      const words = Array.from({ length: count }, (_, i) => LOREM_WORDS[i % LOREM_WORDS.length]);
      if (startWithLorem && words.length >= 2) {
        words[0] = "Lorem"; words[1] = "ipsum";
      }
      result = words.join(" ");
    } else if (type === "sentences") {
      const sentences = Array.from({ length: count }, () => {
        const len = Math.floor(Math.random() * 8) + 6;
        const words = Array.from({ length: len }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        const str = words.join(" ");
        return str.charAt(0).toUpperCase() + str.slice(1) + ".";
      });
      result = sentences.join(" ");
    } else if (type === "list") {
      const items = Array.from({ length: count }, () => {
        const len = Math.floor(Math.random() * 5) + 3;
        const words = Array.from({ length: len }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        return words.join(" ");
      });
      result = includeHtml ? "<ul>\n" + items.map(it => `  <li>${it}</li>`).join("\n") + "\n</ul>" : items.map(it => `• ${it}`).join("\n");
    } else {
      // Paragraphs
      const paras = Array.from({ length: count }, (_, pIdx) => {
        const sentenceCount = Math.floor(Math.random() * 4) + 3;
        const sList = Array.from({ length: sentenceCount }, (_, sIdx) => {
          const len = Math.floor(Math.random() * 8) + 6;
          const words = Array.from({ length: len }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
          if (pIdx === 0 && sIdx === 0 && startWithLorem) {
            words[0] = "lorem"; words[1] = "ipsum"; words[2] = "dolor"; words[3] = "sit"; words[4] = "amet";
          }
          const str = words.join(" ");
          return str.charAt(0).toUpperCase() + str.slice(1) + ".";
        });
        const pText = sList.join(" ");
        return includeHtml ? `<p>${pText}</p>` : pText;
      });
      result = paras.join("\n\n");
    }
    return result;
  }, [type, count, includeHtml, startWithLorem]);

  const copyText = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadText = () => {
    const ext = includeHtml ? "html" : "txt";
    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lorem_ipsum.${ext}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl">
            {(["paragraphs", "words", "sentences", "list"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setType(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize cursor-pointer transition-all ${
                  type === m ? "bg-orange-500 text-white shadow-2xs" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Quantity Slider */}
          <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold">
            <span className="text-zinc-600">Count:</span>
            <input
              type="range"
              min="1"
              max="25"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-28 accent-orange-500"
            />
            <span className="font-mono text-zinc-900 w-6 text-right">{count}</span>
          </div>

          {/* Options */}
          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Start with "Lorem ipsum"</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHtml}
                onChange={(e) => setIncludeHtml(e.target.checked)}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>HTML Tags</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generated Output Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Placeholder Output ({type})</h4>

          <div className="flex items-center gap-2">
            <Button onClick={copyText} variant="default" size="sm" className="text-xs font-bold gap-1.5 shadow-2xs">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </Button>
            <Button onClick={downloadText} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>

        <textarea
          readOnly
          rows={12}
          value={generatedText}
          className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-xs font-mono focus:outline-none"
        />
      </div>
    </div>
  );
};
