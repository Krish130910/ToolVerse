"use client";

import React, { useState } from "react";
import { Copy, Check, Download, Code2, FileCode, Lock, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DecodedViewCardProps {
  header: Record<string, any> | null;
  payload: Record<string, any> | null;
  rawHeader: string;
  rawPayload: string;
  signature: string;
}

export const DecodedViewCard: React.FC<DecodedViewCardProps> = ({
  header,
  payload,
  signature,
}) => {
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedSignature, setCopiedSignature] = useState(false);
  const [isMinified, setIsMinified] = useState(false);

  const formatJson = (obj: Record<string, any> | null) => {
    if (!obj) return "{}";
    return isMinified ? JSON.stringify(obj) : JSON.stringify(obj, null, 2);
  };

  const handleCopyHeader = async () => {
    if (!header) return;
    await navigator.clipboard.writeText(JSON.stringify(header, null, 2));
    setCopiedHeader(true);
    setTimeout(() => setCopiedHeader(false), 2000);
  };

  const handleCopyPayload = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopySignature = async () => {
    if (!signature) return;
    await navigator.clipboard.writeText(signature);
    setCopiedSignature(true);
    setTimeout(() => setCopiedSignature(false), 2000);
  };

  const downloadJsonFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Format Toggle Bar */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-orange-500" />
          <span>Decoded Token Inspection</span>
        </h3>
        <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer select-none bg-white border border-zinc-200 px-3 py-1.5 rounded-xl hover:bg-zinc-50 transition-colors">
          <input
            type="checkbox"
            checked={isMinified}
            onChange={(e) => setIsMinified(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-orange-500 focus:ring-orange-400 cursor-pointer"
          />
          <span>Minify JSON</span>
        </label>
      </div>

      {/* Grid: Header & Payload Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Header Panel */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <h4 className="text-xs font-extrabold text-zinc-900 tracking-tight">
                  Header (Algorithm &amp; Type)
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!header}
                  onClick={handleCopyHeader}
                  className="h-7 text-[11px] font-bold px-2.5 rounded-xl cursor-pointer"
                >
                  {copiedHeader ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedHeader ? "Copied" : "Copy"}</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!header}
                  onClick={() => downloadJsonFile(JSON.stringify(header, null, 2), "jwt-header.json")}
                  className="h-7 text-[11px] font-bold px-2 rounded-xl text-zinc-600 hover:text-zinc-900 cursor-pointer"
                  title="Download Header JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-zinc-900 text-rose-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-[360px]">
              {formatJson(header)}
            </pre>
          </div>
        </div>

        {/* Payload Panel */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <h4 className="text-xs font-extrabold text-zinc-900 tracking-tight">
                  Payload (Claims &amp; Data)
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!payload}
                  onClick={handleCopyPayload}
                  className="h-7 text-[11px] font-bold px-2.5 rounded-xl cursor-pointer"
                >
                  {copiedPayload ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedPayload ? "Copied" : "Copy"}</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!payload}
                  onClick={() => downloadJsonFile(JSON.stringify(payload, null, 2), "jwt-payload.json")}
                  className="h-7 text-[11px] font-bold px-2 rounded-xl text-zinc-600 hover:text-zinc-900 cursor-pointer"
                  title="Download Payload JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-zinc-900 text-purple-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[360px]">
              {formatJson(payload)}
            </pre>
          </div>
        </div>
      </div>

      {/* Signature Panel */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500" />
            <h4 className="text-xs font-extrabold text-zinc-900 tracking-tight">
              Signature Hash
            </h4>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={!signature}
            onClick={handleCopySignature}
            className="h-7 text-[11px] font-bold px-2.5 rounded-xl cursor-pointer"
          >
            {copiedSignature ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>{copiedSignature ? "Copied" : "Copy Signature"}</span>
          </Button>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 text-cyan-400 font-mono text-xs overflow-x-auto break-all">
          {signature || "No signature provided."}
        </div>
      </div>
    </div>
  );
};
