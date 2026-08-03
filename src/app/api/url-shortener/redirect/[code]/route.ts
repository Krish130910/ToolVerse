import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractVisitAnalytics } from "@/lib/url-shortener/analytics";
import { verifyPassword } from "@/lib/url-shortener/password";

// This API route handles the actual redirect: GET /api/url-shortener/redirect/[code]
// The page at /[shortCode]/page.tsx calls this to resolve the redirect.

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({ success: false, error: "Code is required." }, { status: 400 });
    }

    const shortUrl = await prisma.shortUrl.findFirst({
      where: { OR: [{ shortCode: code }, { customAlias: code }] },
    });

    if (!shortUrl) {
      return NextResponse.json({ success: false, error: "not_found" }, { status: 404 });
    }

    // Check expiry
    if (shortUrl.expiresAt && shortUrl.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "expired" }, { status: 410 });
    }

    // Check password
    if (shortUrl.passwordHash) {
      const pwHeader = request.headers.get("x-url-password") ?? "";
      if (!pwHeader || !verifyPassword(pwHeader, shortUrl.passwordHash)) {
        return NextResponse.json(
          { success: false, error: "password_required", isPasswordProtected: true },
          { status: 401 }
        );
      }
    }

    // Record visit asynchronously (don't block redirect)
    const analytics = extractVisitAnalytics(request.headers);
    prisma.shortUrl
      .update({
        where: { id: shortUrl.id },
        data: {
          clicks: { increment: 1 },
          lastVisitedAt: new Date(),
          visits: {
            create: {
              country: analytics.country,
              browser: analytics.browser,
              device: analytics.device,
              os: analytics.os,
              referrer: analytics.referrer,
            },
          },
        },
      })
      .catch((e) => console.error("[Visit Record Error]:", e));

    return NextResponse.json({
      success: true,
      data: { originalUrl: shortUrl.originalUrl },
    });
  } catch (err) {
    console.error("[GET /api/url-shortener/redirect/:code]:", err);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
