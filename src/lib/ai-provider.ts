import { AI_TOOLS_REGISTRY, normalizeToolSlug, AIToolConfig } from "@/lib/ai-config";

export interface AIRequestPayload {
  tool: string;
  prompt: string;
  options?: Record<string, any>;
}

export interface ModelMetadata {
  modelId: string;
  modelVersion: string;
  provider: string;
  inferenceType: "local_fine_tuned" | "external_cloud";
  latencyMs: number;
}

export interface AIResponsePayload {
  success: boolean;
  result?: string;
  data?: any;
  error?: string;
  errorType?: "API_KEY_REQUIRED" | "INVALID_REQUEST" | "RATE_LIMITED" | "TIMEOUT" | "PROVIDER_ERROR";
  statusCode?: number;
  metadata?: ModelMetadata;
}

export interface FlowchartNode {
  id: string;
  label: string;
  type: "start" | "process" | "decision" | "end";
  next?: string[];
}

export interface FlowchartEdge {
  source: string;
  target: string;
  label?: string;
}

export interface FlowchartGraphData {
  title?: string;
  nodes: FlowchartNode[];
  edges?: FlowchartEdge[];
}

export interface AIProvider {
  name: string;
  inferenceType: "local_fine_tuned" | "external_cloud";
  generateContent(
    systemPrompt: string,
    userPrompt: string,
    toolConfig: AIToolConfig
  ): Promise<AIResponsePayload>;
}

/**
 * Builds user prompt integrating options for the specified tool.
 */
function buildEnhancedUserPrompt(prompt: string, options: Record<string, any> = {}, toolConfig: AIToolConfig): string {
  const parts: string[] = [];

  switch (toolConfig.slug) {
    case "ai-commit-message-generator":
      if (options.commitType && options.commitType !== "all") {
        parts.push(`[Commit Type: ${options.commitType}]`);
      }
      if (options.scope && typeof options.scope === "string" && options.scope.trim()) {
        parts.push(`[Scope: ${options.scope.trim()}]`);
      }
      break;

    case "ai-code-converter":
      const fromLang = options.from || "JavaScript";
      const toLang = options.to || "TypeScript";
      parts.push(`[Convert From: ${fromLang}] [Convert To: ${toLang}]`);
      break;

    case "ai-readme-generator":
      if (options.style) {
        parts.push(`[Style: ${options.style}]`);
      }
      break;

    case "ai-api-docs-generator":
      if (options.docFormat) {
        parts.push(`[Format: ${options.docFormat}]`);
      }
      break;

    case "ai-email-generator":
      const template = options.template || "Recruiter";
      const tone = options.tone || "Professional";
      parts.push(`[Template: ${template}] [Tone: ${tone}]`);
      break;

    case "ai-flowchart-generator":
      parts.push(`[Output: STRICT JSON GRAPH FORMAT with "title", "nodes", "edges"]`);
      break;
  }

  if (parts.length > 0) {
    return `${parts.join(" ")}\n\nUser Input / Request:\n${prompt}`;
  }

  return prompt;
}

/**
 * Extracts and cleans code fences, JSON blocks, or structured outputs.
 */
export function cleanRawOutput(raw: string): string {
  let text = raw.trim();
  // Strip Markdown code block wrapping if the entire response is enclosed
  if (text.startsWith("```") && text.endsWith("```")) {
    const lines = text.split("\n");
    if (lines.length >= 2) {
      // Remove first line (e.g. ```json or ```) and last line (```)
      lines.shift();
      lines.pop();
      text = lines.join("\n").trim();
    }
  }
  return text;
}

/**
 * Parses structured JSON for flowchart graph or other structured outputs.
 */
export function parseFlowchartGraph(rawText: string): FlowchartGraphData {
  const cleaned = cleanRawOutput(rawText);

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && Array.isArray(parsed.nodes) && parsed.nodes.length > 0) {
      const validatedNodes: FlowchartNode[] = parsed.nodes.map((node: any, idx: number) => ({
        id: String(node.id || idx + 1),
        label: String(node.label || `Step ${idx + 1}`),
        type: ["start", "process", "decision", "end"].includes(node.type) ? node.type : "process",
        next: Array.isArray(node.next) ? node.next.map(String) : undefined,
      }));

      const validatedEdges: FlowchartEdge[] = Array.isArray(parsed.edges)
        ? parsed.edges.map((e: any) => ({
            source: String(e.source),
            target: String(e.target),
            label: e.label ? String(e.label) : undefined,
          }))
        : [];

      return {
        title: parsed.title || "Process Flowchart",
        nodes: validatedNodes,
        edges: validatedEdges,
      };
    }
  } catch (err) {
    // If direct JSON parse fails, try searching for JSON substring {...}
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed && Array.isArray(parsed.nodes) && parsed.nodes.length > 0) {
          return {
            title: parsed.title || "Process Flowchart",
            nodes: parsed.nodes.map((node: any, idx: number) => ({
              id: String(node.id || idx + 1),
              label: String(node.label || `Step ${idx + 1}`),
              type: ["start", "process", "decision", "end"].includes(node.type) ? node.type : "process",
              next: Array.isArray(node.next) ? node.next.map(String) : undefined,
            })),
            edges: Array.isArray(parsed.edges)
              ? parsed.edges.map((e: any) => ({
                  source: String(e.source),
                  target: String(e.target),
                  label: e.label ? String(e.label) : undefined,
                }))
              : [],
          };
        }
      } catch (innerErr) {
        // Fallback below
      }
    }
  }

  // Safe fallback if model returned non-JSON representation
  const lines = rawText
    .split("\n")
    .map((l) => l.replace(/^[0-9]+[.)\-*]\s*/, "").trim())
    .filter(Boolean);

  const fallbackNodes: FlowchartNode[] = lines.length > 0
    ? lines.slice(0, 10).map((line, idx) => ({
        id: String(idx + 1),
        label: line,
        type: idx === 0 ? "start" : idx === lines.length - 1 ? "end" : line.toLowerCase().includes("if") || line.endsWith("?") ? "decision" : "process",
        next: idx < lines.length - 1 ? [String(idx + 2)] : undefined,
      }))
    : [
        { id: "1", label: "Start Process", type: "start", next: ["2"] },
        { id: "2", label: "Execute Steps", type: "process", next: ["3"] },
        { id: "3", label: "Complete Process", type: "end" },
      ];

  return {
    title: "Generated Flowchart",
    nodes: fallbackNodes,
  };
}

/**
 * Resolves the appropriate Ollama model name for each tool or global fallback.
 */
export function getOllamaModel(toolConfig: AIToolConfig): string {
  const globalModel = process.env.OLLAMA_MODEL || process.env.LOCAL_MODEL_ID || "llama3.2";

  switch (toolConfig.slug) {
    case "ai-commit-message-generator":
      return process.env.OLLAMA_COMMIT_MODEL || globalModel;
    case "ai-code-converter":
      return process.env.OLLAMA_CODE_MODEL || globalModel;
    case "ai-readme-generator":
      return process.env.OLLAMA_README_MODEL || globalModel;
    case "ai-api-docs-generator":
      return process.env.OLLAMA_APIDOCS_MODEL || globalModel;
    case "ai-email-generator":
      return process.env.OLLAMA_EMAIL_MODEL || globalModel;
    case "ai-flowchart-generator":
      return process.env.OLLAMA_FLOWCHART_MODEL || globalModel;
    default:
      return globalModel;
  }
}

/**
 * Default Local Development Provider: Ollama
 * Connects directly to local Ollama instance (http://127.0.0.1:11434 or http://localhost:11434).
 */
export class OllamaProvider implements AIProvider {
  name = "Ollama Local Engine";
  inferenceType = "local_fine_tuned" as const;

  async generateContent(
    systemPrompt: string,
    userPrompt: string,
    toolConfig: AIToolConfig
  ): Promise<AIResponsePayload> {
    const startTime = Date.now();
    const rawBaseUrl = process.env.OLLAMA_BASE_URL || process.env.LOCAL_INFERENCE_URL || "http://127.0.0.1:11434";
    // Normalize localhost to 127.0.0.1 for high-speed IPv4 socket connection on Windows
    const baseUrl = rawBaseUrl.replace("://localhost:", "://127.0.0.1:");
    const model = getOllamaModel(toolConfig);

    try {
      // Use Ollama /api/chat endpoint with separate system & user messages
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(60000),
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: false,
          options: {
            temperature: 0.3,
          },
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const errMsg = errorJson.error || `Ollama server returned status ${response.status}`;

        if (errMsg.includes("not found") || errMsg.includes("pull")) {
          return {
            success: false,
            error: `Ollama model '${model}' is not pulled locally. Run 'ollama pull ${model}' in your terminal to install it.`,
            errorType: "PROVIDER_ERROR",
            statusCode: 404,
          };
        }

        return {
          success: false,
          error: errMsg,
          errorType: "PROVIDER_ERROR",
          statusCode: response.status >= 500 ? 500 : 400,
        };
      }

      const data = await response.json();
      const text = data.message?.content || data.response || "";

      if (!text || !text.trim()) {
        return {
          success: false,
          error: `Ollama model '${model}' returned an empty output.`,
          errorType: "PROVIDER_ERROR",
          statusCode: 500,
        };
      }

      let structuredData: any = undefined;
      if (toolConfig.outputFormat === "graph" || toolConfig.slug === "ai-flowchart-generator") {
        structuredData = parseFlowchartGraph(text);
      }

      return {
        success: true,
        result: text.trim(),
        data: structuredData,
        metadata: {
          modelId: model,
          modelVersion: "ollama-local",
          provider: `Ollama (${model})`,
          inferenceType: "local_fine_tuned",
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err: any) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return {
          success: false,
          error: `Ollama inference timed out after 60s for model '${model}'. Ensure your machine has sufficient RAM/VRAM.`,
          errorType: "TIMEOUT",
          statusCode: 504,
        };
      }

      return {
        success: false,
        error: `Ollama server is unreachable at ${baseUrl}. Start Ollama with 'ollama serve' or run a model with 'ollama run ${model}'.`,
        errorType: "PROVIDER_ERROR",
        statusCode: 503,
      };
    }
  }
}

/**
 * Optional Local/Self-Hosted Provider: vLLM (OpenAI-compatible)
 */
export class VLLMProvider implements AIProvider {
  name = "vLLM High-Throughput Engine";
  inferenceType = "local_fine_tuned" as const;

  async generateContent(
    systemPrompt: string,
    userPrompt: string,
    toolConfig: AIToolConfig
  ): Promise<AIResponsePayload> {
    const startTime = Date.now();
    const baseUrl = process.env.VLLM_BASE_URL || process.env.LOCAL_INFERENCE_URL || "http://localhost:8000";
    const model = process.env.VLLM_MODEL || process.env.LOCAL_MODEL_ID || "toolverse/general-coder-v1.0";

    try {
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorJson.error?.message || `vLLM error (Status ${response.status})`,
          errorType: "PROVIDER_ERROR",
          statusCode: response.status >= 500 ? 500 : 400,
        };
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";

      let structuredData: any = undefined;
      if (toolConfig.outputFormat === "graph" || toolConfig.slug === "ai-flowchart-generator") {
        structuredData = parseFlowchartGraph(text);
      }

      return {
        success: true,
        result: text.trim(),
        data: structuredData,
        metadata: {
          modelId: model,
          modelVersion: "vllm-local",
          provider: "Local vLLM Model Server",
          inferenceType: "local_fine_tuned",
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        error: `vLLM Server Offline: ${err.message}. Ensure vLLM is running at ${baseUrl}.`,
        errorType: "PROVIDER_ERROR",
        statusCode: 503,
      };
    }
  }
}

/**
 * Optional Cloud Provider: OpenAI
 */
export class OpenAISpecializedProvider implements AIProvider {
  name = "OpenAI";
  inferenceType = "external_cloud" as const;

  async generateContent(
    systemPrompt: string,
    userPrompt: string,
    toolConfig: AIToolConfig
  ): Promise<AIResponsePayload> {
    const startTime = Date.now();
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return {
        success: false,
        error: "OPENAI_API_KEY is not configured in environment variables (.env.local).",
        errorType: "API_KEY_REQUIRED",
        statusCode: 401,
      };
    }

    const modelName = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = errorJson.error?.message || `OpenAI API error (Status ${response.status})`;

        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            error: "Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env.local.",
            errorType: "API_KEY_REQUIRED",
            statusCode: 401,
          };
        }

        if (response.status === 429) {
          return {
            success: false,
            error: "OpenAI rate limit or quota exceeded.",
            errorType: "RATE_LIMITED",
            statusCode: 429,
          };
        }

        return {
          success: false,
          error: message,
          errorType: "PROVIDER_ERROR",
          statusCode: response.status >= 500 ? 500 : 400,
        };
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text || !text.trim()) {
        return {
          success: false,
          error: "OpenAI model returned an empty response.",
          errorType: "PROVIDER_ERROR",
          statusCode: 500,
        };
      }

      let structuredData: any = undefined;
      if (toolConfig.outputFormat === "graph" || toolConfig.slug === "ai-flowchart-generator") {
        structuredData = parseFlowchartGraph(text);
      }

      return {
        success: true,
        result: text.trim(),
        data: structuredData,
        metadata: {
          modelId: modelName,
          modelVersion: "gpt-4o-mini",
          provider: "OpenAI Cloud",
          inferenceType: "external_cloud",
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err: any) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return {
          success: false,
          error: "AI provider request timed out (30s limit). Please retry.",
          errorType: "TIMEOUT",
          statusCode: 504,
        };
      }

      return {
        success: false,
        error: err.message || "Failed to communicate with OpenAI API.",
        errorType: "PROVIDER_ERROR",
        statusCode: 500,
      };
    }
  }
}

/**
 * Optional Cloud Provider: Google Gemini
 */
export class GeminiSpecializedProvider implements AIProvider {
  name = "Google Gemini";
  inferenceType = "external_cloud" as const;

  async generateContent(
    systemPrompt: string,
    userPrompt: string,
    toolConfig: AIToolConfig
  ): Promise<AIResponsePayload> {
    const startTime = Date.now();
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return {
        success: false,
        error: "GEMINI_API_KEY is not configured in environment variables (.env.local).",
        errorType: "API_KEY_REQUIRED",
        statusCode: 401,
      };
    }

    const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(30000),
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const message = errorJson.error?.message || `Gemini API error (Status ${response.status})`;

        if (response.status === 401 || response.status === 403 || message.includes("API key not valid")) {
          return {
            success: false,
            error: "Invalid or expired Gemini API key. Please check your GEMINI_API_KEY.",
            errorType: "API_KEY_REQUIRED",
            statusCode: 401,
          };
        }

        if (response.status === 429) {
          return {
            success: false,
            error: "Gemini rate limit reached. Please wait a moment and retry.",
            errorType: "RATE_LIMITED",
            statusCode: 429,
          };
        }

        return {
          success: false,
          error: message,
          errorType: "PROVIDER_ERROR",
          statusCode: response.status >= 500 ? 500 : 400,
        };
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text || !text.trim()) {
        return {
          success: false,
          error: "AI model returned an empty response.",
          errorType: "PROVIDER_ERROR",
          statusCode: 500,
        };
      }

      let structuredData: any = undefined;
      if (toolConfig.outputFormat === "graph" || toolConfig.slug === "ai-flowchart-generator") {
        structuredData = parseFlowchartGraph(text);
      }

      return {
        success: true,
        result: text.trim(),
        data: structuredData,
        metadata: {
          modelId: modelName,
          modelVersion: "gemini-1.5-flash",
          provider: "Google Gemini Cloud",
          inferenceType: "external_cloud",
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err: any) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return {
          success: false,
          error: "AI provider request timed out (30s limit). Please retry.",
          errorType: "TIMEOUT",
          statusCode: 504,
        };
      }

      return {
        success: false,
        error: err.message || "Failed to communicate with AI provider.",
        errorType: "PROVIDER_ERROR",
        statusCode: 500,
      };
    }
  }
}

/**
 * Hybrid Provider Factory:
 * 1. Checks explicit AI_PROVIDER env var ('ollama' | 'openai' | 'vllm' | 'gemini')
 * 2. Checks optional cloud keys if explicitly enabled
 * 3. Defaults to Ollama for local development
 */
export function getAIProvider(): AIProvider {
  const configuredProvider = process.env.AI_PROVIDER?.trim().toLowerCase();

  if (configuredProvider === "openai") {
    return new OpenAISpecializedProvider();
  }

  if (configuredProvider === "vllm" || process.env.LOCAL_INFERENCE_TYPE === "vllm") {
    return new VLLMProvider();
  }

  if (configuredProvider === "gemini") {
    return new GeminiSpecializedProvider();
  }

  if (configuredProvider === "ollama") {
    return new OllamaProvider();
  }

  // Auto-resolution: if OPENAI_API_KEY is configured and AI_PROVIDER is unset, support OpenAI
  if (process.env.OPENAI_API_KEY && !process.env.USE_OLLAMA) {
    return new OpenAISpecializedProvider();
  }

  // Default development provider is Ollama
  return new OllamaProvider();
}

/**
 * Shared AI Execution Pipeline
 */
export async function processAIRequest(payload: AIRequestPayload): Promise<AIResponsePayload> {
  const canonicalSlug = normalizeToolSlug(payload.tool);
  const toolConfig = AI_TOOLS_REGISTRY[canonicalSlug] || AI_TOOLS_REGISTRY["ai-commit-message-generator"];

  const provider = getAIProvider();
  const enhancedUserPrompt = buildEnhancedUserPrompt(payload.prompt, payload.options || {}, toolConfig);

  return await provider.generateContent(toolConfig.systemPrompt, enhancedUserPrompt, toolConfig);
}


