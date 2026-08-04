"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { FeaturedTool } from "@/types";
import { FEATURED_TOOLS } from "@/lib/data";
import {
  ChevronRight,
  Star,
  Share2,
  Check,
  Braces,
  KeyRound,
  QrCode,
  Lock,
  Binary,
  Layers,
  Palette,
  ArrowRight,
  Link as LinkIcon,
  Wrench,
} from "lucide-react";

interface ToolLayoutProps {
  tool: FeaturedTool;
  children?: React.ReactNode;
  hideRelatedTools?: boolean;
}

const TOOL_ICON_MAP: Record<string, React.ReactNode> = {
  Braces: <Braces className="w-6 h-6 text-orange-500" />,
  KeyRound: <KeyRound className="w-6 h-6 text-orange-500" />,
  QrCode: <QrCode className="w-6 h-6 text-orange-500" />,
  Lock: <Lock className="w-6 h-6 text-orange-500" />,
  Binary: <Binary className="w-6 h-6 text-orange-500" />,
  Layers: <Layers className="w-6 h-6 text-orange-500" />,
  Palette: <Palette className="w-6 h-6 text-orange-500" />,
  Link: <LinkIcon className="w-6 h-6 text-orange-500" />,
  Wrench: <Wrench className="w-6 h-6 text-orange-500" />,
};

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  children,
  hideRelatedTools = false,
}) => {
  const [isStarred, setIsStarred] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("toolverse_favs") || "[]");
      setIsStarred(favs.includes(tool.id));
    } catch {}
  }, [tool.id]);

  const toggleStar = () => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("toolverse_favs") || "[]");
      let updated: string[];
      if (favs.includes(tool.id)) {
        updated = favs.filter((id) => id !== tool.id);
        setIsStarred(false);
      } else {
        updated = [...favs, tool.id];
        setIsStarred(true);
      }
      localStorage.setItem("toolverse_favs", JSON.stringify(updated));
    } catch {}
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Find related tools in the same category
  const relatedTools = FEATURED_TOOLS.filter(
    (t) => t.categorySlug === tool.categorySlug && t.id !== tool.id
  ).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${tool.name} – ToolVerse`,
    "description": tool.tagline,
    "url": `https://toolverse.app/tools/${tool.slug}`,
    "applicationCategory": tool.categoryName,
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="pt-2 sm:pt-4 pb-8 relative min-h-screen bg-[#FAF8F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-3 font-medium">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link href="/tools" className="hover:text-orange-600 transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link
            href={`/categories/${tool.categorySlug}`}
            className="hover:text-orange-600 transition-colors"
          >
            {tool.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-900 font-bold">{tool.name}</span>
        </nav>

        {/* Tool Header Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 mb-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              {/* Badges Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="emerald">{tool.categoryName}</Badge>
                {tool.isLive ? (
                  <Badge variant="emerald" className="gap-1 font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Live Utility
                  </Badge>
                ) : (
                  <Badge variant="muted" className="text-[10px] font-mono">
                    Phase 2 Roadmap
                  </Badge>
                )}
              </div>

              {/* Icon + Title Row */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200/80 shrink-0 shadow-2xs">
                  {TOOL_ICON_MAP[tool.iconName] || <Braces className="w-5.5 h-5.5 text-orange-500" />}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                  {tool.name}
                </h1>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl">
                {tool.description || tool.tagline}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
              <button
                onClick={toggleStar}
                className={`flex items-center gap-1.5 h-9 px-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isStarred
                    ? "bg-amber-50 border-amber-300 text-amber-600 shadow-xs"
                    : "bg-white border-zinc-200 text-zinc-700 hover:border-orange-300"
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isStarred ? "fill-amber-500 text-amber-500" : "text-zinc-400"
                  }`}
                />
                <span>{isStarred ? "Starred" : "Star"}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:border-orange-300 transition-all cursor-pointer shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-orange-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Workspace Area */}
        <div className="mb-4">{children}</div>

        {/* Related Tools Section - Only rendered if not hidden */}
        {!hideRelatedTools && relatedTools.length > 0 && (
          <div className="pt-6 border-t border-zinc-200/80 space-y-3">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">
              Related {tool.categoryName} Utilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {relatedTools.map((rel) => (
                <Link key={rel.id} href={`/tools/${rel.slug}`}>
                  <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                        {rel.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                      {rel.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
