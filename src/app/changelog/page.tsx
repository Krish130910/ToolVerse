"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";

export default function ChangelogPage() {
  return (
    <div className="py-10 sm:py-16 relative min-h-screen bg-[#FAF8F5]">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Changelog & Roadmap</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Platform Release Notes
            </h1>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Track recent updates, performance improvements, and upcoming Phase 2/3 utilities.
            </p>
          </div>

          <div className="space-y-6">
            {/* Version 1.0 */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="emerald" className="font-mono">v1.0.0</Badge>
                  <span className="text-xs text-zinc-500 font-mono">• July 2026</span>
                </div>
                <span className="text-xs text-orange-600 font-bold">Latest Stable</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900">App Router Architecture & Unified Design System</h3>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Migrated platform to Next.js App Router multi-page routing structure for maximum performance and code-splitting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Launched standalone tool pages for JSON Formatter, Password Generator, QR Code Generator, JWT Decoder, UUID Generator, and Base64 Tool.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Overhauled design system to BruhGrow off-white cream palette, 3D glass spheres, and warm orange accents.</span>
                </li>
              </ul>
            </div>

            {/* Phase 2 Roadmap */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Badge variant="muted" className="font-mono">Phase 2</Badge>
                <span className="text-xs text-zinc-500 font-mono">• Upcoming Roadmap</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900">Image & PDF Utility Suite Expansion</h3>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>In-browser Image Vectorizer (Bitmap to SVG conversion).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>PDF Page Numberer and PDF Page Merger tool.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
