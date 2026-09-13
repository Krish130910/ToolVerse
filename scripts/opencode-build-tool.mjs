#!/usr/bin/env node

/**
 * OpenCode ACP Autonomous Tool Builder Engine
 * Generates type-safe React tool components, registers them in registry.tsx & data.ts, and verifies compilation.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

const rawToolName = process.env.TOOL_NAME || process.argv[2] || "Markdown Table Generator";
const userMessage = process.env.USER_MESSAGE || process.argv[3] || "Utility to generate markdown tables with customizable columns and alignments";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toPascalCase(text) {
  return text
    .replace(/[-_]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

async function main() {
  const slug = slugify(rawToolName);
  const componentName = `${toPascalCase(rawToolName)}Tool`;
  const componentFilePath = path.join(process.cwd(), `src/components/tools/impl/${slug}.tsx`);

  console.log(`[OpenCode Builder]: Generating tool: "${rawToolName}" (${slug})`);
  console.log(`[OpenCode Builder]: Target Component: ${componentName} -> ${componentFilePath}`);

  const systemPrompt = `You are an expert Frontend React/TypeScript Engineer working on ToolVerse (Next.js 15, React 19, Tailwind CSS, Lucide React).
Your task is to generate a complete, production-ready, client-side React utility component in TypeScript for a new tool.

Rules:
1. Start with "use client";
2. Export a named React component: export const ${componentName}: React.FC = () => { ... };
3. Use Lucide React icons (e.g. Copy, Check, Trash2, Zap, AlertCircle, Download, FileText, Settings, Play, RefreshCw, etc.).
4. Use Tailwind CSS matching the modern ToolVerse design:
   - Split 2-column desktop grid: Left column (inputs & options), Right column (dark background terminal/output #121215 with border-zinc-800).
   - Clean orange accent primary action button: bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl shadow-md shadow-orange-500/20.
   - Clean secondary button: border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 h-11 px-4 rounded-xl.
   - Copy button with 2-second copied state feedback.
   - Error banner: bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium rounded-xl p-3.5.
5. High quality in-browser computation: Implement real, robust transformation / generation / parsing logic without external missing dependencies.
6. STRICT TYPE SAFETY: Do not use 'any' where avoidable. Ensure 100% valid TypeScript without syntax errors.
7. Return ONLY the TypeScript React code directly or within a single tsx codeblock without conversational preamble.`;

  const userPrompt = `Tool Name: ${rawToolName}
Tool Description & User Requirements: ${userMessage}
Component Name to export: ${componentName}

Please generate the complete, self-contained ${slug}.tsx component.`;

  let componentCode = "";

  if (OPENROUTER_API_KEY) {
    try {
      console.log(`[OpenCode Builder]: Prompting OpenRouter (${MODEL})...`);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://toolverse.dev",
          "X-Title": "ToolVerse OpenCode Bot",
        },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content || "";
      componentCode = rawText.replace(/^```(tsx|typescript|jsx)?\n?/i, "").replace(/\n?```$/i, "").trim();
    } catch (apiErr) {
      console.warn("[OpenCode Builder]: API call failed, using fallback generator:", apiErr.message);
    }
  }

  // Fallback template if API was unconfigured or failed
  if (!componentCode) {
    console.log("[OpenCode Builder]: Synthesizing standard tool template...");
    componentCode = `"use client";

import React, { useState } from "react";
import { Copy, Check, Trash2, Zap, AlertCircle } from "lucide-react";

export const ${componentName}: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) return;
    setError("");
    try {
      // Process input
      setOutput(input.trim());
    } catch (err: any) {
      setError(err.message || "Failed to process data.");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-6 text-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center gap-1.5 border border-orange-500/20">
            <Zap className="w-3.5 h-3.5" /> ${rawToolName}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input here..."
              rows={7}
              className="w-full p-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-sm font-mono focus:ring-2 focus:ring-orange-500/40 outline-none"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleProcess}
              className="flex-1 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Run ${rawToolName}
            </button>
            <button
              onClick={handleClear}
              className="h-11 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-zinc-400" /> Clear
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Output Result</label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Result"}
              </button>
            )}
          </div>
          <div className="w-full h-[360px] rounded-xl bg-[#121215] border border-zinc-800 p-4 text-zinc-200 font-mono text-xs overflow-auto">
            {output ? <pre className="whitespace-pre-wrap leading-relaxed">{output}</pre> : <div className="text-zinc-500 h-full flex items-center justify-center">Output will appear here.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
`;
  }

  // 1. Write component file
  fs.writeFileSync(componentFilePath, componentCode, "utf8");
  console.log(`[OpenCode Builder]: Created component at ${componentFilePath}`);

  // 2. Register in src/tools/registry.tsx
  const registryPath = path.join(process.cwd(), "src/tools/registry.tsx");
  let registryContent = fs.readFileSync(registryPath, "utf8");

  if (!registryContent.includes(`"${slug}":`)) {
    // Add import statement
    const importStatement = `import { ${componentName} } from "@/components/tools/impl/${slug}";\n`;
    const registryEntry = `  "${slug}": ${componentName},\n`;

    // Insert import before "const AICommitMessageGenerator" or at the top imports
    if (registryContent.includes("const AICommitMessageGenerator")) {
      registryContent = registryContent.replace(
        "const AICommitMessageGenerator",
        `${importStatement}\nconst AICommitMessageGenerator`
      );
    } else {
      registryContent = `${importStatement}${registryContent}`;
    }

    // Insert dictionary entry
    registryContent = registryContent.replace(
      "export const TOOLS_COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {\n",
      `export const TOOLS_COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {\n${registryEntry}`
    );

    fs.writeFileSync(registryPath, registryContent, "utf8");
    console.log(`[OpenCode Builder]: Registered '${slug}' in src/tools/registry.tsx`);
  }

  // 3. Register in src/lib/data.ts
  const dataPath = path.join(process.cwd(), "src/lib/data.ts");
  let dataContent = fs.readFileSync(dataPath, "utf8");

  if (!dataContent.includes(`slug: "${slug}"`)) {
    const newToolEntry = `  {
    id: "tool-${Date.now().toString(36)}",
    name: "${rawToolName.replace(/"/g, '\\"')}",
    slug: "${slug}",
    category: "Developer Tools",
    description: "${userMessage.slice(0, 140).replace(/"/g, '\\"')}",
    iconName: "Zap",
    tags: ["Utility", "Developer Tools", "${rawToolName}"],
    isLive: true,
    isNew: true,
    isPopular: false,
    gradient: "from-orange-500 to-amber-600",
  },\n`;

    dataContent = dataContent.replace(
      "export const FEATURED_TOOLS: FeaturedTool[] = [\n",
      `export const FEATURED_TOOLS: FeaturedTool[] = [\n${newToolEntry}`
    );

    fs.writeFileSync(dataPath, dataContent, "utf8");
    console.log(`[OpenCode Builder]: Registered '${slug}' in src/lib/data.ts`);
  }

  // 4. Verify TypeScript Compilation
  console.log("[OpenCode Builder]: Validating build and TypeScript types...");
  try {
    execSync("npx tsc --noEmit", { stdio: "inherit" });
    console.log(`[OpenCode Builder]: TypeScript check passed successfully with 0 errors!`);
  } catch (err) {
    console.error("[OpenCode Builder Error]: TypeScript compilation failed:", err.message);
    process.exit(1);
  }

  console.log(`[OpenCode Builder]: Tool '${rawToolName}' (${slug}) build complete and verified!`);
}

main();
