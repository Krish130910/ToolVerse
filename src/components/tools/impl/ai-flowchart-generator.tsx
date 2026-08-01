"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  GitFork,
  ArrowRight,
  Code,
  FileText,
} from "lucide-react";

interface FlowNode {
  id: string;
  label: string;
  type: "start" | "process" | "decision" | "end";
  next?: string[];
}

const TEMPLATES: { name: string; prompt: string; nodes: FlowNode[] }[] = [
  {
    name: "User Login & Auth",
    prompt: "User inputs credentials, validate password, if valid redirect to dashboard, else show error.",
    nodes: [
      { id: "1", label: "Start: User Visits Login", type: "start", next: ["2"] },
      { id: "2", label: "Input Email & Password", type: "process", next: ["3"] },
      { id: "3", label: "Credentials Valid?", type: "decision", next: ["4", "5"] },
      { id: "4", label: "Redirect to Dashboard", type: "process", next: ["6"] },
      { id: "5", label: "Show Invalid Credentials Error", type: "process", next: ["2"] },
      { id: "6", label: "End: User Authenticated", type: "end" },
    ],
  },
  {
    name: "E-Commerce Checkout",
    prompt: "Add items to cart, enter shipping address, select payment method, process payment, send confirmation email.",
    nodes: [
      { id: "1", label: "Start: View Cart", type: "start", next: ["2"] },
      { id: "2", label: "Enter Shipping Address", type: "process", next: ["3"] },
      { id: "3", label: "Payment Success?", type: "decision", next: ["4", "5"] },
      { id: "4", label: "Send Order Confirmation Email", type: "process", next: ["6"] },
      { id: "5", label: "Prompt Retry Payment", type: "process", next: ["3"] },
      { id: "6", label: "End: Order Placed", type: "end" },
    ],
  },
];

export const AiFlowchartGeneratorTool: React.FC = () => {
  const [prompt, setPrompt] = useState(TEMPLATES[0].prompt);
  const [nodes, setNodes] = useState<FlowNode[]>(TEMPLATES[0].nodes);
  const [zoom, setZoom] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const generateFlowchart = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Simulate AI generation by converting prompt words into a structured flowchart
      const lines = prompt.split(",").map((s) => s.trim()).filter(Boolean);
      const generated: FlowNode[] = [
        { id: "1", label: `Start: ${lines[0] || "Initiate Process"}`, type: "start", next: ["2"] },
      ];
      for (let i = 1; i < lines.length; i++) {
        const isDecision = lines[i].toLowerCase().includes("if") || lines[i].endsWith("?");
        generated.push({
          id: String(i + 1),
          label: lines[i],
          type: isDecision ? "decision" : i === lines.length - 1 ? "end" : "process",
          next: i < lines.length - 1 ? [String(i + 2)] : undefined,
        });
      }
      setNodes(generated);
      setIsGenerating(false);
    }, 800);
  };

  const getMermaidCode = () => {
    let mermaid = "graph TD\n";
    nodes.forEach((node) => {
      const shape = node.type === "start" || node.type === "end" ? `(${node.label})` : node.type === "decision" ? `{"${node.label}"}` : `["${node.label}"]`;
      mermaid += `    node_${node.id}${shape}\n`;
      if (node.next) {
        node.next.forEach((nextId) => {
          mermaid += `    node_${node.id} --> node_${nextId}\n`;
        });
      }
    });
    return mermaid;
  };

  const copyMermaid = () => {
    navigator.clipboard.writeText(getMermaidCode());
    setCopiedType("mermaid");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(nodes, null, 2));
    setCopiedType("json");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadSvg = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#FAF8F5"/><text x="400" y="300" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#18181B">${nodes.map(n => n.label).join(" -> ")}</text></svg>`;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flowchart.svg";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* AI Prompt Input Card */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-bold text-zinc-900">AI Natural Language Prompt</h3>
          </div>
          <div className="flex items-center gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setPrompt(t.prompt);
                  setNodes(t.nodes);
                }}
                className="text-[11px] font-semibold bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-lg hover:bg-orange-100 transition-colors"
              >
                Preset: {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your process step by step (e.g. User submits form, validate fields, if valid save to database...)"
            className="flex-1 p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          />
          <Button onClick={generateFlowchart} disabled={isGenerating} variant="default" className="h-auto font-bold text-xs gap-1.5 px-5">
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? "Generating..." : "Generate Flowchart"}</span>
          </Button>
        </div>
      </div>

      {/* Main Visual Workspace: Canvas + Controls + Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flowchart Visual Render Canvas */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <GitFork className="w-4 h-4 text-orange-500" />
              <span>Interactive Flowchart Graph</span>
            </h4>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg">
              <button onClick={() => setZoom(Math.max(0.6, zoom - 0.1))} className="p-1 text-zinc-600 hover:text-zinc-900">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1.5">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-1 text-zinc-600 hover:text-zinc-900">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Render Nodes Tree */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 min-h-96 flex flex-col items-center justify-center overflow-auto">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }} className="space-y-6 flex flex-col items-center">
              {nodes.map((node, i) => {
                const isStartEnd = node.type === "start" || node.type === "end";
                const isDecision = node.type === "decision";

                return (
                  <React.Fragment key={node.id}>
                    <div
                      className={`p-4 rounded-xl text-center shadow-xs transition-all relative border ${
                        isStartEnd
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-full px-6"
                          : isDecision
                          ? "bg-amber-50 border-amber-300 text-amber-900 font-bold rotate-45 w-32 h-32 flex items-center justify-center"
                          : "bg-white border-zinc-300 text-zinc-900 font-semibold"
                      }`}
                    >
                      <div className={isDecision ? "-rotate-45 p-2 text-xs" : "text-xs"}>
                        {node.label}
                      </div>
                    </div>

                    {i < nodes.length - 1 && (
                      <div className="flex flex-col items-center text-orange-500">
                        <div className="w-0.5 h-6 bg-orange-400" />
                        <ArrowRight className="w-4 h-4 rotate-90 -mt-1" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Node Editor & Code Export Panel */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5 h-fit">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-3">
            Export & Code Output
          </h4>

          {/* Export Options */}
          <div className="space-y-2">
            <Button onClick={downloadSvg} variant="default" className="w-full text-xs font-bold gap-2">
              <Download className="w-4 h-4" />
              <span>Export SVG Diagram</span>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={copyMermaid} variant="outline" className="text-xs font-semibold gap-1.5">
                {copiedType === "mermaid" ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedType === "mermaid" ? "Copied!" : "Mermaid Code"}</span>
              </Button>
              <Button onClick={copyJson} variant="outline" className="text-xs font-semibold gap-1.5">
                {copiedType === "json" ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{copiedType === "json" ? "Copied!" : "JSON Tree"}</span>
              </Button>
            </div>
          </div>

          {/* Generated Mermaid Code Preview */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600">Generated Mermaid Syntax:</label>
            <pre className="p-3 bg-zinc-900 text-zinc-100 rounded-xl text-[10px] font-mono max-h-48 overflow-x-auto">
              {getMermaidCode()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
