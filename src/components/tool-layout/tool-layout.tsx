"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeaturedTool } from "@/types";
import { FEATURED_TOOLS } from "@/lib/data";
import {
  ChevronRight,
  Star,
  Share2,
  Check,
  Play,
  Braces,
  KeyRound,
  QrCode,
  Lock,
  Binary,
  Layers,
  Palette,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";

interface ToolLayoutProps {
  tool: FeaturedTool;
  children?: React.ReactNode;
}

const TOOL_ICON_MAP: Record<string, React.ReactNode> = {
  Braces: <Braces className="w-6 h-6 text-emerald-400" />,
  KeyRound: <KeyRound className="w-6 h-6 text-emerald-400" />,
  QrCode: <QrCode className="w-6 h-6 text-emerald-400" />,
  Lock: <Lock className="w-6 h-6 text-emerald-400" />,
  Binary: <Binary className="w-6 h-6 text-emerald-400" />,
  Layers: <Layers className="w-6 h-6 text-emerald-400" />,
  Palette: <Palette className="w-6 h-6 text-emerald-400" />,
};

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
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

  return (
    <div className="py-8 sm:py-12 relative min-h-screen">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link href="/" className="hover:text-zinc-200 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <Link href="/tools" className="hover:text-zinc-200 transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <Link
            href={`/categories/${tool.categorySlug}`}
            className="hover:text-zinc-200 transition-colors"
          >
            {tool.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-zinc-100 font-semibold">{tool.name}</span>
        </nav>

        {/* Tool Header Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 shrink-0 shadow-xs">
                {TOOL_ICON_MAP[tool.iconName] || <Braces className="w-6 h-6 text-emerald-400" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="emerald">{tool.categoryName}</Badge>
                  {tool.isLive ? (
                    <Badge variant="emerald" className="gap-1 font-mono text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Utility
                    </Badge>
                  ) : (
                    <Badge variant="muted" className="text-[10px] font-mono">
                      Phase 2 Roadmap
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                  {tool.name}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  {tool.description || tool.tagline}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
              <button
                onClick={toggleStar}
                className={`flex items-center gap-1.5 h-10 px-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isStarred
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
                title={isStarred ? "Starred" : "Bookmark Tool"}
              >
                <Star className={`w-4 h-4 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                <span>{isStarred ? "Starred" : "Star"}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="Share link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-zinc-400" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Interactive Tool Workspace */}
        <div className="mb-12">{children}</div>

        {/* Instructions & Features Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-base">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>How {tool.name} Works</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This tool runs 100% client-side inside your browser. No data is transmitted to external servers, API endpoints, or database storage. Your privacy and source data stay strictly on your device.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="text-[11px] bg-zinc-950 text-zinc-400 px-2.5 py-1 rounded-lg border border-zinc-800 font-mono">
                ⚡ Instant Execution
              </span>
              <span className="text-[11px] bg-zinc-950 text-zinc-400 px-2.5 py-1 rounded-lg border border-zinc-800 font-mono">
                🔒 Zero Server Logs
              </span>
              <span className="text-[11px] bg-zinc-950 text-zinc-400 px-2.5 py-1 rounded-lg border border-zinc-800 font-mono">
                📋 One-Click Copy
              </span>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-zinc-100">Category Info</h4>
            <div className="text-xs text-zinc-400 space-y-2">
              <p>
                <strong className="text-zinc-200">Category:</strong> {tool.categoryName}
              </p>
              <p>
                <strong className="text-zinc-200">Execution:</strong> Local Web Workers
              </p>
              <p>
                <strong className="text-zinc-200">Status:</strong>{" "}
                {tool.isLive ? "Live & Ready" : "Phase 2 Roadmap"}
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-100">
              Related Tools in {tool.categoryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedTools.map((relTool) => (
                <Link key={relTool.id} href={`/tools/${relTool.slug}`}>
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 hover:border-emerald-500/40 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                        {TOOL_ICON_MAP[relTool.iconName] || <Braces className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                          {relTool.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          {relTool.tagline}
                        </p>
                      </div>
                    </div>
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
