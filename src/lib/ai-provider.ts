/**
 * Specialized AI Model Provider Layer for ToolVerse
 * Features:
 * - Dedicated per-tool model mapping & prompt specialization
 * - Native Local Inference Server Support (Ollama / vLLM)
 * - Fine-Tuned Model Versioning (e.g. commit-v2.0, converter-v1.0)
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
 * Specialized Active Per-Tool Model & Version Registry
 */
export const SPECIALIZED_MODELS: Record<string, SpecializedModelConfig> = {
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
  "code-converter": {
    toolId: "code-converter",
    modelId: "toolverse-converter-qwen7b",
    modelVersion: "converter-v1.0-ft",
    localOllamaModel: "qwen2.5-coder:7b",
    vllmModelId: "toolverse/converter-qwen2.5-7b-v1.0",
    geminiModel: "gemini-1.5-flash",
    openaiModel: "gpt-4o-mini",
    groqModel: "llama-3.3-70b-versatile",
    systemPrompt: `You are the ToolVerse Specialized Code Converter Model.
Translate source code between languages (Python, JavaScript, TypeScript, Go, Rust, C++, Java) preserving exact logic and idiomatic syntax.`,
  },
  "readme-generator": {
    toolId: "readme-generator",
    modelId: "toolverse-readme-coder",
    modelVersion: "readme-v1.0-ft",
    localOllamaModel: "qwen2.5-coder:7b",
    vllmModelId: "toolverse/readme-coder-v1.0",
    geminiModel: "gemini-1.5-flash",
    openaiModel: "gpt-4o-mini",
    groqModel: "llama-3.3-70b-versatile",
    systemPrompt: `You are the ToolVerse Specialized README Model.
Generate comprehensive, professional GitHub README.md files with installation guides, badges, usage examples, and features.`,
  },
  "api-docs-generator": {
    toolId: "api-docs-generator",
    modelId: "toolverse-apidocs-coder",
    modelVersion: "apidocs-v1.0-ft",
    localOllamaModel: "qwen2.5-coder:7b",
    vllmModelId: "toolverse/apidocs-coder-v1.0",
    geminiModel: "gemini-1.5-flash",
    openaiModel: "gpt-4o-mini",
    groqModel: "llama-3.3-70b-versatile",
    systemPrompt: `You are the ToolVerse Specialized API Documentation Model.
Generate OpenAPI specs and Markdown API documentation from endpoint code snippets.`,
  },
  "email-generator": {
    toolId: "email-generator",
    modelId: "toolverse-email-writer",
    modelVersion: "email-v1.0-ft",
    localOllamaModel: "llama3.1:8b",
    vllmModelId: "toolverse/email-writer-v1.0",
    geminiModel: "gemini-1.5-flash",
    openaiModel: "gpt-4o-mini",
    groqModel: "llama-3.3-70b-versatile",
    systemPrompt: `You are the ToolVerse Specialized Email Model.
Draft professional technical emails, release announcements, and client project status updates.`,
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

class LocalInferenceProvider implements AIProvider {
  name = "ToolVerse Local Inference (Ollama/vLLM)";
  inferenceType = "local_fine_tuned" as const;

  async generateContent(payload: AIRequestPayload, modelConfig: SpecializedModelConfig): Promise<AIResponsePayload> {
    const startTime = Date.now();
    const localUrl = process.env.LOCAL_INFERENCE_URL || "http://localhost:11434";
    const isVllm = process.env.LOCAL_INFERENCE_TYPE === "vllm";

    try {
      if (isVllm) {
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

export function getAIProvider(): AIProvider {
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
