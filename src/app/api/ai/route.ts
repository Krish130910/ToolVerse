import { NextResponse } from "next/server";
import { processAIRequest } from "@/lib/ai-provider";

// Basic Rate Limiting: 20 requests per 10 minutes per IP
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const limit = 20;

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
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please wait a few minutes before submitting another request." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { tool, prompt } = body;

    if (!tool || typeof tool !== "string" || !tool.trim()) {
      return NextResponse.json(
        { success: false, error: "The 'tool' identifier parameter is required." },
        { status: 400 }
      );
    }

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: "The 'prompt' parameter cannot be empty." },
        { status: 400 }
      );
    }

    const response = await processAIRequest({
      tool: tool.trim(),
      prompt: prompt.trim(),
    });

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || "AI provider failed to generate content." },
        { status: response.statusCode || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: response.result,
    });
  } catch (err: any) {
    console.error("[API Error /api/ai]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
