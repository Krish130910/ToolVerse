"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Copy,
  Check,
  Download,
  ArrowRight,
} from "lucide-react";

export const Base64EncoderTool: React.FC = () => {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Build faster with ToolVerse!");
  const [copied, setCopied] = useState(false);

  const output = React.useMemo(() => {
    try {
      if (!input) return "";
      if (mode === "encode") {
        return btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
      } else {
        return decodeURIComponent(Array.prototype.map.call(atob(input), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      }
    } catch (e: any) {
      return `Base64 Error: ${e.message}`;
    }
  }, [input, mode]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "encode" ? "bg-orange-500 text-white shadow-2xs" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Encode Text to Base64
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === "decode" ? "bg-orange-500 text-white shadow-2xs" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Decode Base64 to Text
          </button>
        </div>

        <Button onClick={copyOutput} variant="default" size="sm" className="text-xs font-bold gap-1.5 shadow-2xs">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Copied Output!" : "Copy Output"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Text Box */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">
            {mode === "encode" ? "Plain Text Input" : "Base64 Encoded Input"}
          </h4>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 font-mono text-xs focus:outline-none"
          />
        </div>

        {/* Output Text Box */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2">
            {mode === "encode" ? "Base64 Output Result" : "Decoded Text Result"}
          </h4>
          <textarea
            readOnly
            rows={12}
            value={output}
            className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-900 text-teal-300 font-mono text-xs focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
