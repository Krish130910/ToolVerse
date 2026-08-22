"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Download,
  Copy,
  Check,
  Trash2,
  ZoomIn,
  ZoomOut,
  GitFork,
  ArrowRight,
  Code,
  FileText,
  AlertCircle,
  Square,
  Clock,
} from "lucide-react";
import { AISetupScreen } from "./ai/ai-setup-screen";
import { FlowchartNode, parseFlowchartGraph } from "@/lib/ai-provider";

const TEMPLATES: { name: string; prompt: string; nodes: FlowNode[] }[] = [
  {
    name: "User Login & Auth",
    prompt: "User visits login page, inputs email and password. Validate credentials against database. If valid, issue JWT token and redirect to dashboard. If invalid, display error message and allow retry up to 3 times, otherwise lock account for 15 minutes.",
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
    prompt: "User adds items to cart and proceeds to checkout. Enter shipping address and choose payment method. Process payment via Stripe gateway. If payment succeeds, create order record in database and send confirmation email. If payment fails, notify user and prompt retry.",
    nodes: [
      { id: "1", label: "Start: View Cart", type: "start", next: ["2"] },
      { id: "2", label: "Enter Shipping Address", type: "process", next: ["3"] },
      { id: "3", label: "Payment Success?", type: "decision", next: ["4", "5"] },
      { id: "4", label: "Send Order Confirmation Email", type: "process", next: ["6"] },
      { id: "5", label: "Prompt Retry Payment", type: "process", next: ["3"] },
      { id: "6", label: "End: Order Placed", type: "end" },
    ],
  },
  {
    name: "CI/CD Deployment",
    prompt: "Developer pushes commit to GitHub main branch. Run automated unit and integration test suite. If tests pass, build Docker container and deploy to Kubernetes cluster. If tests fail, send Slack alert and block deployment.",
    nodes: [
      { id: "1", label: "Start: Git Push to Main", type: "start", next: ["2"] },
      { id: "2", label: "Run Automated Test Suite", type: "process", next: ["3"] },
      { id: "3", label: "All Tests Pass?", type: "decision", next: ["4", "5"] },
      { id: "4", label: "Build Docker Image & Deploy to K8s", type: "process", next: ["6"] },
      { id: "5", label: "Send Slack Alert to Team", type: "process", next: ["6"] },
      { id: "6", label: "End: Pipeline Complete", type: "end" },
    ],
  },
];

export type FlowNode = FlowchartNode;

export const AiFlowchartGeneratorTool: React.FC = () => {
  const [prompt, setPrompt] = useState(TEMPLATES[0].prompt);
  const [nodes, setNodes] = useState<FlowNode[]>(TEMPLATES[0].nodes);
  const [chartTitle, setChartTitle] = useState("User Authentication Flow");
  const [zoom, setZoom] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isKeyMissing, setIsKeyMissing] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("toolverse_ai_flowchart_generator");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.prompt) setPrompt(parsed.prompt);
        if (parsed.nodes) setNodes(parsed.nodes);
        if (parsed.title) setChartTitle(parsed.title);
        setHasHistory(true);
      } catch (err) {
        // Ignore parsing errors
      }
    }
  }, []);

  const generateFlowchart = async () => {
    if (!prompt.trim()) {
      setError("Please enter a process description or select a preset.");
      return;
    }

    setIsGenerating(true);
    setError("");
    setIsKeyMissing(false);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          tool: "ai-flowchart-generator",
          prompt: prompt.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        let graph = data.data;
        if (!graph || !graph.nodes || graph.nodes.length === 0) {
          graph = parseFlowchartGraph(data.result || "");
        }

        if (graph && graph.nodes && graph.nodes.length > 0) {
          setNodes(graph.nodes);
          if (graph.title) setChartTitle(graph.title);

          localStorage.setItem(
            "toolverse_ai_flowchart_generator",
            JSON.stringify({ prompt, nodes: graph.nodes, title: graph.title })
          );
          setHasHistory(true);
        } else {
          setError("Failed to parse flowchart nodes from AI response.");
        }
      } else {
        if (res.status === 401 || data.errorType === "API_KEY_REQUIRED") {
          setIsKeyMissing(true);
        } else {
          setError(data.message || data.error || "Failed to generate flowchart.");
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        setError("Connection error. Please check your network and try again.");
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setNodes([]);
    setError("");
    localStorage.removeItem("toolverse_ai_flowchart_generator");
    setHasHistory(false);
  };

  const getMermaidCode = () => {
    if (!nodes || nodes.length === 0) return "graph TD\n    empty[Empty Flowchart]";
    let mermaid = "graph TD\n";
    nodes.forEach((node) => {
      const cleanLabel = node.label.replace(/"/g, "'");
      const shape =
        node.type === "start" || node.type === "end"
          ? `(["${cleanLabel}"])`
          : node.type === "decision"
          ? `{"${cleanLabel}"}`
          : `["${cleanLabel}"]`;
      mermaid += `    node_${node.id}${shape}\n`;
      if (node.next && Array.isArray(node.next)) {
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
    navigator.clipboard.writeText(JSON.stringify({ title: chartTitle, nodes }, null, 2));
    setCopiedType("json");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadSvg = () => {
    const svgWidth = 800;
    const svgHeight = Math.max(500, nodes.length * 110 + 100);
    const centerX = svgWidth / 2;

    let elements = "";
    nodes.forEach((node, i) => {
      const y = 80 + i * 110;
      const isStartEnd = node.type === "start" || node.type === "end";
      const isDecision = node.type === "decision";

      if (isStartEnd) {
        elements += `
          <g transform="translate(${centerX}, ${y})">
            <rect x="-110" y="-22" width="220" height="44" rx="22" fill="#F97316" stroke="#EA580C" stroke-width="2"/>
            <text text-anchor="middle" y="5" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">${node.label}</text>
          </g>`;
      } else if (isDecision) {
        elements += `
          <g transform="translate(${centerX}, ${y})">
            <polygon points="0,-32 120,0 0,32 -120,0" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2"/>
            <text text-anchor="middle" y="4" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#78350F">${node.label}</text>
          </g>`;
      } else {
        elements += `
          <g transform="translate(${centerX}, ${y})">
            <rect x="-120" y="-24" width="240" height="48" rx="8" fill="#FFFFFF" stroke="#D4D4D8" stroke-width="1.5"/>
            <text text-anchor="middle" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="#18181B">${node.label}</text>
          </g>`;
      }

      if (i < nodes.length - 1) {
        const nextY = y + 86;
        elements += `
          <g>
            <line x1="${centerX}" y1="${y + 24}" x2="${centerX}" y2="${nextY}" stroke="#FB923C" stroke-width="2"/>
            <polygon points="${centerX - 4},${nextY} ${centerX + 4},${nextY} ${centerX},${nextY + 6}" fill="#EA580C"/>
          </g>`;
      }
    });

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="100%" height="100%" fill="#FAF8F5"/>
  <text x="${centerX}" y="40" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#18181B">${chartTitle}</text>
  ${elements}
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toolverse_flowchart.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isKeyMissing) {
    return (
      <AISetupScreen
        toolName="AI Flowchart Generator"
        message="Please configure GEMINI_API_KEY or OPENAI_API_KEY in .env.local to enable AI Flowchart generation."
      />
    );
  }

  return (
    <div className="space-y-6 text-zinc-900">
      {/* AI Prompt Input Card */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center gap-1.5 border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> AI Flowchart Generator
            </span>
            {hasHistory && (
              <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> Session Saved
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => {
                  setPrompt(t.prompt);
                  setNodes(t.nodes);
                  setChartTitle(t.name);
                }}
                className="text-[11px] font-semibold bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
              >
                Preset: {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Process Logic / System Description
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                generateFlowchart();
              }
            }}
            placeholder="Describe your process step by step (e.g. User submits form, validate fields, if valid save to database...)"
            className="w-full p-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs resize-none"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {isGenerating ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" /> Stop Inference
            </button>
          ) : (
            <Button
              onClick={generateFlowchart}
              disabled={!prompt.trim()}
              variant="default"
              className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" />
              <span>Generate Structured Flowchart</span>
            </Button>
          )}

          <button
            type="button"
            onClick={handleClear}
            className="h-11 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-zinc-400" /> Clear
          </button>
        </div>
      </div>

      {/* Main Visual Workspace: Canvas + Controls + Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flowchart Visual Render Canvas */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <GitFork className="w-4 h-4 text-orange-500" />
              <span>{chartTitle}</span>
            </h4>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setZoom(Math.max(0.6, zoom - 0.1))}
                className="p-1 text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1.5">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                className="p-1 text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Render Nodes Tree */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 min-h-96 flex flex-col items-center justify-center overflow-auto">
            {isGenerating ? (
              <div className="space-y-4 text-center p-8">
                <Zap className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                <p className="text-xs font-bold text-zinc-600">AI Architect is generating structured graph nodes...</p>
              </div>
            ) : nodes.length === 0 ? (
              <div className="text-center p-8 space-y-2 text-zinc-400">
                <GitFork className="w-8 h-8 mx-auto text-zinc-300" />
                <p className="text-xs">Enter your workflow description to generate an interactive flowchart graph.</p>
              </div>
            ) : (
              <div
                style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
                className="space-y-5 flex flex-col items-center max-w-full"
              >
                {nodes.map((node, i) => {
                  const isStartEnd = node.type === "start" || node.type === "end";
                  const isDecision = node.type === "decision";

                  return (
                    <React.Fragment key={node.id}>
                      <div
                        className={`p-4 text-center shadow-xs transition-all relative border ${
                          isStartEnd
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-full px-6 shadow-md shadow-orange-500/10"
                            : isDecision
                            ? "bg-amber-50 border-amber-300 text-amber-900 font-bold rotate-45 w-32 h-32 flex items-center justify-center"
                            : "bg-white border-zinc-200 text-zinc-900 font-medium rounded-xl shadow-xs min-w-48 max-w-sm"
                        }`}
                      >
                        <div className={isDecision ? "-rotate-45 p-2 text-xs" : "text-xs"}>
                          {node.label}
                        </div>
                      </div>

                      {i < nodes.length - 1 && (
                        <div className="flex flex-col items-center text-orange-500 my-1">
                          <div className="w-0.5 h-6 bg-orange-400" />
                          <ArrowRight className="w-4 h-4 rotate-90 -mt-1" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Node Editor & Code Export Panel */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5 h-fit">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-3">
            Export &amp; Code Output
          </h4>

          {/* Export Options */}
          <div className="space-y-2">
            <Button
              onClick={downloadSvg}
              disabled={nodes.length === 0}
              variant="default"
              className="w-full text-xs font-bold gap-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              <Download className="w-4 h-4" />
              <span>Export SVG Diagram</span>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={copyMermaid}
                disabled={nodes.length === 0}
                variant="outline"
                className="text-xs font-semibold gap-1.5 cursor-pointer"
              >
                {copiedType === "mermaid" ? (
                  <Check className="w-3.5 h-3.5 text-orange-500" />
                ) : (
                  <Code className="w-3.5 h-3.5" />
                )}
                <span>{copiedType === "mermaid" ? "Copied!" : "Mermaid Code"}</span>
              </Button>
              <Button
                onClick={copyJson}
                disabled={nodes.length === 0}
                variant="outline"
                className="text-xs font-semibold gap-1.5 cursor-pointer"
              >
                {copiedType === "json" ? (
                  <Check className="w-3.5 h-3.5 text-orange-500" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                <span>{copiedType === "json" ? "Copied!" : "JSON Tree"}</span>
              </Button>
            </div>
          </div>

          {/* Generated Mermaid Code Preview */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600">Generated Mermaid Syntax:</label>
            <pre className="p-3 bg-[#121215] text-zinc-100 rounded-xl text-[10px] font-mono max-h-48 overflow-x-auto border border-zinc-800 leading-relaxed">
              {getMermaidCode()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

