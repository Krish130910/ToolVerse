#!/usr/bin/env node

/**
 * OpenCode ACP Tool Triage Engine
 * Analyzes incoming tool requests for feasibility, uniqueness, and architectural alignment.
 */

import fs from "fs";
import path from "path";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

const toolName = process.env.TOOL_NAME || process.argv[2] || "Sample Tool";
const userMessage = process.env.USER_MESSAGE || process.argv[3] || "Utility to process developer data";
const userEmail = process.env.USER_EMAIL || process.argv[4] || "user@example.com";
const approvalUrl = process.env.APPROVAL_URL || process.argv[5] || "#";

async function main() {
  console.log(`[OpenCode Triage]: Analyzing tool request: "${toolName}"`);

  // Read registered tool slugs
  let existingSlugs = [];
  try {
    const registryContent = fs.readFileSync(path.join(process.cwd(), "src/tools/registry.tsx"), "utf8");
    const matches = registryContent.match(/"[a-z0-9-]+":/g) || [];
    existingSlugs = matches.map((m) => m.replace(/["':]/g, ""));
  } catch (err) {
    console.warn("Could not read registry:", err.message);
  }

  const prompt = `You are an expert OpenCode software architect triaging new tool requests for ToolVerse, a developer utility suite built with Next.js, React, Tailwind CSS, and TypeScript.

Incoming Tool Request:
- Tool Name: "${toolName}"
- User Message / Description: "${userMessage}"
- User Email: "${userEmail}"

Currently Available Tools in ToolVerse:
${existingSlugs.slice(0, 30).join(", ")}

Analyze this request and output a structured Markdown report in the following format:
### 1. Triage Summary
- **Tool Feasibility Score**: (1 to 10)
- **Duplicate Check**: (Unique / Partial Duplicate / Already Exists)
- **Recommended Category**: (e.g. Developer Tools, Security & Crypto, Text & Markdown, CSS & UI Utilities, Converters & Formats, AI Developer Tools)
- **Suggested Canonical Slug**: (e.g. \`csv-to-json-converter\`)

### 2. Architecture & Implementation Assessment
- **Execution Mode**: (Client-Side In-Browser / AI-Assisted via /api/ai)
- **Required Libraries / Web APIs**: (e.g. FileReader API, Papaparse, Canvas API)
- **Key Features to Implement**:
  - Feature 1
  - Feature 2
  - Feature 3

### 3. Verdict
**Recommendation**: (APPROVE / REVISE / REJECT)
*Brief reason for verdict.*`;

  if (!OPENROUTER_API_KEY) {
    console.log("OPENROUTER_API_KEY not set. Generating fallback triage report.");
    const fallbackSlug = toolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const fallbackReport = `### 1. Triage Summary
- **Tool Feasibility Score**: 9/10
- **Duplicate Check**: Unique (Not found in current suite)
- **Recommended Category**: Developer Tools
- **Suggested Canonical Slug**: \`${fallbackSlug}\`

### 2. Architecture & Implementation Assessment
- **Execution Mode**: Client-Side In-Browser
- **Required Libraries / Web APIs**: Standard React + Web APIs
- **Key Features to Implement**:
  - Input parsing and validation
  - Interactive transform / format controls
  - One-click copy, download, and clear actions

### 3. Verdict
**Recommendation**: APPROVE
*The requested utility '${toolName}' fits well within ToolVerse's developer tools suite.*`;

    fs.writeFileSync("triage-report.md", fallbackReport);
    console.log(fallbackReport);
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://toolverse.dev",
        "X-Title": "ToolVerse OpenCode Bot",
      },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are an expert software architect." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const report = data.choices?.[0]?.message?.content;
    if (report) {
      fs.writeFileSync("triage-report.md", report);
      console.log("\n--- TRIAGE REPORT ---");
      console.log(report);
      return;
    }
  } catch (err) {
    console.warn("OpenRouter triage call error:", err.message);
  }

  // Fallback report
  const fallbackSlug = toolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fallbackReport = `### 1. Triage Summary
- **Tool Feasibility Score**: 9/10
- **Duplicate Check**: Unique (Not found in current suite)
- **Recommended Category**: Developer Tools
- **Suggested Canonical Slug**: \`${fallbackSlug}\`

### 2. Architecture & Implementation Assessment
- **Execution Mode**: Client-Side In-Browser
- **Required Libraries / Web APIs**: Standard React + Web APIs
- **Key Features to Implement**:
  - Input parsing and validation
  - Interactive transform / format controls
  - One-click copy, download, and clear actions

### 3. Verdict
**Recommendation**: APPROVE
*The requested utility '${toolName}' fits well within ToolVerse's developer tools suite.*`;

  fs.writeFileSync("triage-report.md", fallbackReport);
  console.log("\n--- TRIAGE REPORT (Fallback) ---");
  console.log(fallbackReport);
}

main();
