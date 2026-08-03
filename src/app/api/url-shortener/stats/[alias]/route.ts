import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ alias: string }> }
) {
  try {
    const { alias } = await params;

    if (!alias) {
      return NextResponse.json(
        { success: false, error: "Alias is required." },
        { status: 400 }
      );
    }

    // Find by shortCode or customAlias
    const shortUrl = await prisma.shortUrl.findFirst({
      where: {
        OR: [{ shortCode: alias }, { customAlias: alias }],
      },
      include: {
        visits: {
          orderBy: { visitedAt: "desc" },
          take: 50,
          select: {
            country: true,
            browser: true,
            device: true,
            os: true,
            referrer: true,
            visitedAt: true,
          },
        },
      },
    });

    if (!shortUrl) {
      return NextResponse.json(
        { success: false, error: "Short URL not found." },
        { status: 404 }
      );
    }

    // Aggregate analytics
    const countryCounts = countBy(shortUrl.visits, (v) => v.country ?? "Unknown");
    const browserCounts = countBy(shortUrl.visits, (v) => v.browser ?? "Unknown");
    const deviceCounts = countBy(shortUrl.visits, (v) => v.device ?? "Unknown");
    const osCounts = countBy(shortUrl.visits, (v) => v.os ?? "Unknown");

    return NextResponse.json({
      success: true,
      data: {
        id: shortUrl.id,
        shortCode: shortUrl.shortCode,
        customAlias: shortUrl.customAlias,
        originalUrl: shortUrl.originalUrl,
        clicks: shortUrl.clicks,
        createdAt: shortUrl.createdAt.toISOString(),
        expiresAt: shortUrl.expiresAt?.toISOString() ?? null,
        lastVisitedAt: shortUrl.lastVisitedAt?.toISOString() ?? null,
        isPasswordProtected: !!shortUrl.passwordHash,
        isExpired: shortUrl.expiresAt ? shortUrl.expiresAt < new Date() : false,
        analytics: {
          countries: countryCounts,
          browsers: browserCounts,
          devices: deviceCounts,
          os: osCounts,
          recentVisits: shortUrl.visits.map((v) => ({
            ...v,
            visitedAt: v.visitedAt.toISOString(),
          })),
        },
      },
    });
  } catch (err) {
    console.error("[GET /api/url-shortener/stats/:alias]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}

function countBy<T>(arr: T[], key: (item: T) => string): Record<string, number> {
  return arr.reduce<Record<string, number>>((acc, item) => {
    const k = key(item);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
}
