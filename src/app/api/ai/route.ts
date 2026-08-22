import { NextResponse } from "next/server";
import { processAIRequest } from "@/lib/ai-provider";
import { normalizeToolSlug, AI_TOOLS_REGISTRY } from "@/lib/ai-config";

// Rate Limiting: 30 requests per 10 minutes per IP
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const limit = 30;

  const record = ipRateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a few minutes before submitting another request.",
          errorType: "RATE_LIMITED",
          message: "Rate limit exceeded. Please wait a few minutes before submitting another request.",
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body.",
          errorType: "INVALID_REQUEST",
          message: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    // Support canonical 'tool', legacy 'toolSlug', or 'toolId'
    const rawTool = body.tool || body.toolSlug || body.toolId;
    const { prompt, options } = body;

    if (!rawTool || typeof rawTool !== "string" || !rawTool.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "The 'tool' identifier parameter is required.",
          errorType: "INVALID_REQUEST",
          message: "The 'tool' identifier parameter is required.",
        },
        { status: 400 }
      );
    }

    const canonicalTool = normalizeToolSlug(rawTool);
    if (!AI_TOOLS_REGISTRY[canonicalTool]) {
      return NextResponse.json(
        {
          success: false,
          error: `Unknown AI tool: '${rawTool}'.`,
          errorType: "INVALID_REQUEST",
          message: `Unknown AI tool: '${rawTool}'.`,
        },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "The 'prompt' parameter cannot be empty.",
          errorType: "INVALID_REQUEST",
          message: "The 'prompt' parameter cannot be empty.",
        },
        { status: 400 }
      );
    }

    // Guard against excessively large inputs (max 20,000 chars as per specification)
    if (prompt.length > 20000) {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt exceeds maximum allowed length (20,000 characters).",
          errorType: "INVALID_REQUEST",
          message: "Prompt exceeds maximum allowed length (20,000 characters).",
        },
        { status: 400 }
      );
    }

    const response = await processAIRequest({
      tool: canonicalTool,
      prompt: prompt.trim(),
      options: options && typeof options === "object" ? options : {},
    });

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          error: response.error || "AI provider failed to generate content.",
          errorType: response.errorType || "PROVIDER_ERROR",
          message: response.error || "AI provider failed to generate content.",
        },
        { status: response.statusCode || 500 }
      );
    }

    const headers: Record<string, string> = {
      "X-AI-Provider": response.metadata?.provider || "ToolVerse AI",
    };

    return NextResponse.json(
      {
        success: true,
        result: response.result,
        data: response.data,
        metadata: response.metadata,
      },
      { headers }
    );
  } catch (err: any) {
    console.error("[API Error /api/ai]:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while processing AI request.",
        errorType: "PROVIDER_ERROR",
        message: "Internal server error while processing AI request.",
      },
      { status: 500 }
    );
  }
}

