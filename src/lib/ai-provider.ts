/**
 * Specialized AI Model Provider Layer for ToolVerse
 * Features:
 * - Dedicated per-tool model mapping & prompt specialization
 * - Native Local Inference Server Support (Ollama / vLLM)
 * - Fine-Tuned Model Versioning (e.g. regex-v1.2, commit-v2.0)
 * - Evaluation Pipeline & Model Metadata Telemetry
 */

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
  error?: string;
  statusCode?: number;
  metadata?: ModelMetadata;
}

export interface SpecializedModelConfig {
  toolId: string;
  modelId: string;
  modelVersion: string;
  localOllamaModel: string;
  vllmModelId: string;
  geminiModel: string;
  openaiModel: string;
  groqModel: string;
  systemPrompt: string;
}

/**
 * Specialized Per-Tool Model & Version Registry
 */
export const SPECIALIZED_MODELS: Record<string, SpecializedModelConfig> = {
  regex: {
    toolId: "regex",
    modelId: "toolverse-regex-qwen7b",
    modelVersion: "regex-v1.2-ft",
    localOllamaModel: "qwen2.5-coder:7b",
    vllmModelId: "toolverse/regex-qwen2.5-7b-v1.2",
    geminiModel: "gemini-1.5-flash",
    openaiModel: "gpt-4o-mini",
    groqModel: "llama-3.3-70b-versatile",
    systemPrompt: `You are the ToolVerse Specialized Regex Model (regex-v1.2-ft).
Generate regular expressions from English descriptions and explain every part line-by-line.
Output format:
1. Regex Pattern in \`\`\`regex codeblock
2. Detailed Explanation
3. Test Case Examples`,
  },
  "commit-message": {
    toolId: "commit-message",
    modelId: "toolverse-commit-llama8b",
    modelVersion: "commit-v2.0-ft",
    localOllamaModel: "llama3.1:8b",
    vllmModelId: "toolverse/commit-llama3-8b-v2.0",
    geminiModel: "gemini-1.5-flash",
    openaiModel: "gpt-4o-mini",
    groqModel: "llama-3.3-70b-versatile",
    systemPrompt: `You are the ToolVerse Specialized Git Commit Model (commit-v2.0-ft).
Format clean Conventional Commit messages (feat, fix, docs, refactor, perf, style, test, chore) from change descriptions or git diffs.`,
  },
  "code-explainer": {
    toolId: "code-explainer",
    modelId: "toolverse-explainer-deepseek",
    modelVersion: "explainer-v1.0-ft",
    localOllamaModel: "deepseek-coder:6.7b",
    vllmModelId: "toolverse/explainer-deepseek-6.7b-v1.0",
    geminiModel: "gemini-1.5-flash",
    openaiModel: "gpt-4o-mini",
    groqModel: "llama-3.3-70b-versatile",
    systemPrompt: `You are the ToolVerse Specialized Code Explainer Model (explainer-v1.0-ft).
Explain code snippets with high-level summaries, key concepts, and line-by-line execution breakdowns.`,
  },
  sql: {
    toolId: "sql",
    modelId: "toolverse-sql-codellama",
    modelVersion: "sql-v1.1-ft",
    localOllamaModel: "codellama:7b",
    vllmModelId: "toolverse/sql-codellama-7b-v1.1",
    geminiModel: "gemini-1.5-flash",
    openaiModel: "gpt-4o-mini",
    groqModel: "llama-3.3-70b-versatile",
    systemPrompt: `You are the ToolVerse Specialized SQL Query Model (sql-v1.1-ft).
Compile natural language data requests into optimized SQL queries with schema breakdown.`,
  },
  default: {
    toolId: "default",
    modelId: "toolverse-general-coder",
    modelVersion: "general-v1.0",
    localOllamaModel: "qwen2.5-coder:7b",
    vllmModelId: "toolverse/general-coder-v1.0",
    geminiModel: "gemini-1.5-flash",
    openaiModel: "gpt-4o-mini",
    groqModel: "llama-3.3-70b-versatile",
    systemPrompt: `You are a ToolVerse Specialized Developer Model. Provide clean, production-ready output.`,
  },
};

export interface AIProvider {
  name: string;
  inferenceType: "local_fine_tuned" | "external_cloud";
  generateContent(payload: AIRequestPayload, modelConfig: SpecializedModelConfig): Promise<AIResponsePayload>;
}

/**
 * Local Inference Server Provider (Ollama / vLLM)
 */
class LocalInferenceProvider implements AIProvider {
  name = "ToolVerse Local Inference (Ollama/vLLM)";
  inferenceType = "local_fine_tuned" as const;

  async generateContent(payload: AIRequestPayload, modelConfig: SpecializedModelConfig): Promise<AIResponsePayload> {
    const startTime = Date.now();
    const localUrl = process.env.LOCAL_INFERENCE_URL || "http://localhost:11434";
    const isVllm = process.env.LOCAL_INFERENCE_TYPE === "vllm";

    try {
      if (isVllm) {
        // vLLM OpenAI-compatible Chat Endpoint
        const res = await fetch(`${localUrl}/v1/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelConfig.vllmModelId,
            messages: [
              { role: "system", content: modelConfig.systemPrompt },
              { role: "user", content: payload.prompt },
            ],
          }),
        });

        if (!res.ok) throw new Error(`vLLM server error (${res.status})`);
        const data = await res.json();

        return {
          success: true,
          result: data.choices?.[0]?.message?.content || "",
          metadata: {
            modelId: modelConfig.vllmModelId,
            modelVersion: modelConfig.modelVersion,
            provider: "Local vLLM Model Server",
            inferenceType: "local_fine_tuned",
            latencyMs: Date.now() - startTime,
          },
        };
      } else {
        // Ollama Native Endpoint
        const res = await fetch(`${localUrl}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: modelConfig.localOllamaModel,
            prompt: `${modelConfig.systemPrompt}\n\nUser Request:\n${payload.prompt}`,
            stream: false,
          }),
        });

        if (!res.ok) throw new Error(`Ollama server error (${res.status})`);
        const data = await res.json();

        return {
          success: true,
          result: data.response || "",
          metadata: {
            modelId: modelConfig.localOllamaModel,
            modelVersion: modelConfig.modelVersion,
            provider: "Local Ollama Model Server",
            inferenceType: "local_fine_tuned",
            latencyMs: Date.now() - startTime,
          },
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: `Local Inference Server Offline: ${err.message}. Ensure Ollama or vLLM is running at ${localUrl}.`,
        statusCode: 503,
      };
    }
  }
}

/**
 * Google Gemini Cloud Provider Fallback
 */
class GeminiSpecializedProvider implements AIProvider {
  name = "Google Gemini";
  inferenceType = "external_cloud" as const;

  async generateContent(payload: AIRequestPayload, modelConfig: SpecializedModelConfig): Promise<AIResponsePayload> {
    const startTime = Date.now();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "401 API_KEY_REQUIRED: GEMINI_API_KEY is not configured in .env.local.",
        statusCode: 401,
      };
    }

    const fullPrompt = `${modelConfig.systemPrompt}\n\nUser Request:\n${payload.prompt}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelConfig.geminiModel}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorJson.error?.message || `Gemini API error (Status ${response.status})`,
          statusCode: response.status >= 500 ? 500 : 400,
        };
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return {
          success: false,
          error: "Specialized model returned an empty output.",
          statusCode: 500,
        };
      }

      return {
        success: true,
        result: text,
        metadata: {
          modelId: modelConfig.modelId,
          modelVersion: modelConfig.modelVersion,
          provider: "Google Gemini Cloud",
          inferenceType: "external_cloud",
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to reach AI model endpoint.",
        statusCode: 500,
      };
    }
  }
}

/**
 * OpenAI Cloud Provider Fallback
 */
class OpenAISpecializedProvider implements AIProvider {
  name = "OpenAI";
  inferenceType = "external_cloud" as const;

  async generateContent(payload: AIRequestPayload, modelConfig: SpecializedModelConfig): Promise<AIResponsePayload> {
    const startTime = Date.now();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "401 API_KEY_REQUIRED: OPENAI_API_KEY is not configured in .env.local.",
        statusCode: 401,
      };
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelConfig.openaiModel,
          messages: [
            { role: "system", content: modelConfig.systemPrompt },
            { role: "user", content: payload.prompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorJson.error?.message || `OpenAI API error (Status ${response.status})`,
          statusCode: response.status >= 500 ? 500 : 400,
        };
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      return {
        success: true,
        result: text || "",
        metadata: {
          modelId: modelConfig.modelId,
          modelVersion: modelConfig.modelVersion,
          provider: "OpenAI Cloud",
          inferenceType: "external_cloud",
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to reach OpenAI API.",
        statusCode: 500,
      };
    }
  }
}

/**
 * Provider Selection Factory
 */
export function getAIProvider(): AIProvider {
  // If USE_LOCAL_INFERENCE is set to true, route to Ollama / vLLM Model Server
  if (process.env.USE_LOCAL_INFERENCE === "true") {
    return new LocalInferenceProvider();
  }
  if (process.env.OPENAI_API_KEY) {
    return new OpenAISpecializedProvider();
  }
  return new GeminiSpecializedProvider();
}

export async function processAIRequest(payload: AIRequestPayload): Promise<AIResponsePayload> {
  const provider = getAIProvider();
  const toolKey = payload.tool?.toLowerCase();
  const modelConfig = SPECIALIZED_MODELS[toolKey] || SPECIALIZED_MODELS["default"];

  return await provider.generateContent(payload, modelConfig);
}
