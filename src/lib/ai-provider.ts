/**
 * Provider-Agnostic AI Service Layer for ToolVerse
 */

export interface AIRequestPayload {
  tool: string;
  prompt: string;
  options?: Record<string, any>;
}

export interface AIResponsePayload {
  success: boolean;
  result?: string;
  error?: string;
  statusCode?: number;
}

export interface AIProvider {
  name: string;
  generateContent(payload: AIRequestPayload): Promise<AIResponsePayload>;
}

class GeminiAIProvider implements AIProvider {
  name = "Google Gemini";

  async generateContent(payload: AIRequestPayload): Promise<AIResponsePayload> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "GEMINI_API_KEY is not configured in environment variables.",
        statusCode: 401,
      };
    }

    const systemPrompt = `You are an expert AI developer tool engine powering ToolVerse for utility: "${payload.tool}".
Provide clear, production-ready code or text formatted in clean Markdown without conversational filler.`;

    const fullPrompt = `${systemPrompt}\n\nUser Request:\n${payload.prompt}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
          error: "Gemini API returned an empty output.",
          statusCode: 500,
        };
      }

      return {
        success: true,
        result: text,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to reach AI provider.",
        statusCode: 500,
      };
    }
  }
}

// Active Provider Registry (Allows dynamic switching via process.env.AI_PROVIDER)
export function getAIProvider(): AIProvider {
  return new GeminiAIProvider();
}

export async function processAIRequest(payload: AIRequestPayload): Promise<AIResponsePayload> {
  const provider = getAIProvider();
  return await provider.generateContent(payload);
}
