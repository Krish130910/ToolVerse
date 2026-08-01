"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Binary,
  Copy,
  Check,
  Download,
  RefreshCw,
} from "lucide-react";

export const UuidGeneratorTool: React.FC = () => {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = crypto.randomUUID();
      if (!hyphens) id = id.replace(/-/g, "");
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUuids();
  }, [count, uppercase, hyphens]);

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadText = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Button onClick={generateUuids} variant="default" className="w-full md:w-auto text-xs font-bold gap-2 shadow-2xs">
            <RefreshCw className="w-4 h-4" />
            <span>Generate New Bulk UUIDs</span>
          </Button>

          <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl text-xs font-semibold">
            <span className="text-zinc-600">Count:</span>
            <input
              type="range"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24 accent-orange-500"
            />
            <span className="font-mono text-zinc-900 w-6 text-right">{count}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Uppercase</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span>Include Hyphens</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generated List Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Generated UUID v4 List</h4>
          <div className="flex items-center gap-2">
            <Button onClick={copyAll} variant="default" size="sm" className="text-xs font-bold gap-1.5 shadow-2xs">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied All!" : "Copy All"}</span>
            </Button>
            <Button onClick={downloadText} variant="outline" size="sm" className="text-xs font-bold gap-1.5">
              <Download className="w-4 h-4" />
              <span>Download .txt</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {uuids.map((id, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs text-zinc-800">
              <span className="select-all">{id}</span>
              <button
                onClick={() => navigator.clipboard.writeText(id)}
                className="text-orange-600 hover:underline font-bold text-[11px]"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
