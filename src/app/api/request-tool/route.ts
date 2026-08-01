import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { validateAndGetEnv } from "@/lib/env";

// Basic sliding window rate limiting (5 requests per 10 minutes per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const limit = 5;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
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
    // 1. Environment Check & Rate Limiting
    const { resendApiKey, adminEmail } = validateAndGetEnv();

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many tool requests. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Parse Payload
    const body = await request.json();
    const { toolName, name, email, message } = body || {};

    // 3. Input Validation & Sanitization
    const trimmedToolName = typeof toolName === "string" ? toolName.trim() : "";
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!trimmedToolName) {
      return NextResponse.json(
        { success: false, error: "Tool name is required." },
        { status: 400 }
      );
    }

    if (!trimmedEmail) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!trimmedMessage) {
      return NextResponse.json(
        { success: false, error: "Description/Message is required." },
        { status: 400 }
      );
    }

    // 4. STEP A: Save to Neon PostgreSQL Database using Prisma FIRST
    let createdRecord;
    try {
      createdRecord = await prisma.toolRequest.create({
        data: {
          toolName: trimmedToolName,
          name: trimmedName || null,
          email: trimmedEmail,
          message: trimmedMessage,
          status: "Pending",
        },
      });
    } catch (dbError) {
      console.error("[Prisma DB Error]: Failed to save tool request to Neon DB:", dbError);
      
      // Fallback for dev mode when DATABASE_URL placeholder is in use
      if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("npg_placeholder")) {
        createdRecord = {
          id: "tr_" + Math.random().toString(36).substring(2, 9),
          toolName: trimmedToolName,
          name: trimmedName || null,
          email: trimmedEmail,
          message: trimmedMessage,
          status: "Pending",
          createdAt: new Date(),
        };
      } else {
        // If DB is configured but fails, throw error to prevent sending orphan email
        return NextResponse.json(
          { success: false, error: "Failed to save request to database." },
          { status: 500 }
        );
      }
    }

    // 5. STEP B: Send Email Notification via Resend ONLY AFTER Database Save Succeeds
    if (createdRecord) {
      if (resendApiKey && adminEmail) {
        try {
          const resend = new Resend(resendApiKey);
          const formattedDate = new Date(createdRecord.createdAt).toLocaleString();

          const emailText = `A new tool has been requested.

Tool:
${createdRecord.toolName}

Name:
${createdRecord.name || "N/A"}

Email:
${createdRecord.email}

Message:
${createdRecord.message}

Submitted At:
${formattedDate}`;

          await resend.emails.send({
            from: "ToolVerse <onboarding@resend.dev>",
            to: adminEmail,
            subject: "🔔 New Tool Request - ToolVerse",
            text: emailText,
          });
        } catch (emailError) {
          console.error("[Resend Email Error]: Email delivery failed, but database record is safely stored:", emailError);
          // DB record is saved successfully; do not roll back or fail user response
        }
      } else {
        if (!resendApiKey) {
          console.warn("[Resend Notice]: RESEND_API_KEY is not set. Email notification skipped.");
        }
        if (!adminEmail) {
          console.warn("[Resend Notice]: ADMIN_EMAIL is not set. Email notification skipped.");
        }
      }
    }

    // 6. STEP C: Return Success Response
    return NextResponse.json(
      {
        success: true,
        message: "Your tool request has been submitted successfully!",
        data: {
          id: createdRecord.id,
          toolName: createdRecord.toolName,
          status: createdRecord.status,
          createdAt: createdRecord.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API Error /api/request-tool]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error while processing request." },
      { status: 500 }
    );
  }
}
