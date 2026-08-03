import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  validateAndNormalizeUrl,
  verifyDomainExists,
  sanitizeAlias,
  sanitizeText,
  generateShortCode,
  ValidationError,
} from "@/lib/url-shortener/validate";
import { hashPassword } from "@/lib/url-shortener/password";
import { checkUrlShortenerRateLimit } from "@/lib/url-shortener/rate-limit";

export async function POST(request: Request) {
  try {
    // 1. Rate limit
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    if (!checkUrlShortenerRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait 5 minutes." },
        { status: 429 }
      );
    }

    // 2. Parse body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { originalUrl, customAlias, expiresIn, password, generateQr } = body as {
      originalUrl?: unknown;
      customAlias?: unknown;
      expiresIn?: unknown; // "never" | "1d" | "7d" | "30d"
      password?: unknown;
      generateQr?: unknown;
    };

    // 3. Validate & normalise URL syntax & scheme
    let normalizedUrl: string;
    try {
      normalizedUrl = validateAndNormalizeUrl(sanitizeText(originalUrl, 2048));
    } catch (e) {
      return NextResponse.json(
        { success: false, error: e instanceof ValidationError ? e.message : "Please enter a valid URL." },
        { status: 400 }
      );
    }

    // 3b. Verify domain existence via server-side DNS resolution
    const domainError = await verifyDomainExists(normalizedUrl);
    if (domainError) {
      return NextResponse.json(
        {
          success: false,
          error: domainError,
        },
        { status: 400 }
      );
    }

    // 4. Custom alias (optional)
    let resolvedAlias: string | null = null;
    if (customAlias && typeof customAlias === "string" && customAlias.trim() !== "") {
      try {
        resolvedAlias = sanitizeAlias(customAlias);
      } catch (e) {
        return NextResponse.json(
          { success: false, error: e instanceof ValidationError ? e.message : "Invalid alias." },
          { status: 400 }
        );
      }

      // Check for duplicate alias
      const existing = await prisma.shortUrl.findFirst({
        where: {
          OR: [
            { shortCode: resolvedAlias },
            { customAlias: resolvedAlias },
          ],
        },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `The alias "${resolvedAlias}" is already taken.` },
          { status: 409 }
        );
      }
    }

    // 5. Generate unique short code if no custom alias
    let shortCode = resolvedAlias ?? "";
    if (!shortCode) {
      // Retry up to 5 times to ensure uniqueness
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generateShortCode(6);
        const exists = await prisma.shortUrl.findUnique({ where: { shortCode: candidate } });
        if (!exists) {
          shortCode = candidate;
          break;
        }
      }
      if (!shortCode) {
        return NextResponse.json(
          { success: false, error: "Failed to generate a unique short code. Please try again." },
          { status: 500 }
        );
      }
    }

    // 6. Expiry calculation
    let expiresAt: Date | null = null;
    const expiresInStr = typeof expiresIn === "string" ? expiresIn : "never";
    if (expiresInStr === "1d") {
      expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    } else if (expiresInStr === "7d") {
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else if (expiresInStr === "30d") {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    // 7. Password hashing
    let passwordHash: string | null = null;
    const rawPassword = typeof password === "string" ? password.trim() : "";
    if (rawPassword) {
      passwordHash = hashPassword(rawPassword);
    }

    // 8. Save to database
    const shortUrl = await prisma.shortUrl.create({
      data: {
        originalUrl: normalizedUrl,
        shortCode,
        customAlias: resolvedAlias,
        passwordHash,
        expiresAt,
        clicks: 0,
      },
    });

    // 9. Build clean short domain format (e.g. toolv.rs/duYe57) and local redirect path
    const envDomain = process.env.NEXT_PUBLIC_SHORT_DOMAIN || "toolv.rs";
    const cleanDomain = envDomain.replace(/^https?:\/\//, "").replace(/\/+$/, "");

    return NextResponse.json(
      {
        success: true,
        data: {
          id: shortUrl.id,
          shortCode: shortUrl.shortCode,
          shortUrl: `https://${cleanDomain}/${shortUrl.shortCode}`,
          displayUrl: `${cleanDomain}/${shortUrl.shortCode}`,
          redirectPath: `/${shortUrl.shortCode}`,
          originalUrl: shortUrl.originalUrl,
          customAlias: shortUrl.customAlias,
          expiresAt: shortUrl.expiresAt?.toISOString() ?? null,
          createdAt: shortUrl.createdAt.toISOString(),
          clicks: shortUrl.clicks,
          isPasswordProtected: !!shortUrl.passwordHash,
          generateQr: !!generateQr,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/url-shortener/create]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
