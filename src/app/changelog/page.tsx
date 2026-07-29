"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";

export default function ChangelogPage() {
  return (
    <div className="py-10 sm:py-16 relative min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Changelog & Roadmap</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight">
              Platform Release Notes
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Track recent updates, performance improvements, and upcoming Phase 2/3 utilities.
            </p>
          </div>

          <div className="space-y-6">
            {/* Version 1.0 */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="emerald" className="font-mono">v1.0.0</Badge>
                  <span className="text-xs text-zinc-400 font-mono">• July 2026</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Latest Stable</span>
              </div>
              <h3 className="text-base font-bold text-zinc-100">App Router Architecture & Unified Design System</h3>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Migrated platform to Next.js App Router multi-page routing structure for maximum performance and code-splitting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Launched standalone tool pages for JSON Formatter, Password Generator, QR Code Generator, JWT Decoder, UUID Generator, and Base64 Tool.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Optimized WebGL Lightfall canvas with DPR capping and IntersectionObserver auto-pause for 60 FPS performance.</span>
                </li>
              </ul>
            </div>

            {/* Phase 2 Roadmap */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="muted" className="font-mono">Phase 2</Badge>
                <span className="text-xs text-zinc-400 font-mono">• Upcoming Roadmap</span>
              </div>
              <h3 className="text-base font-bold text-zinc-100">Image & PDF Utility Suite Expansion</h3>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Client-Side Canvas Image Compressor & WebP Converter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>PDF Merge, Split & Page Extract utilities using pdf-lib.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Markdown Live Previewer & CSS Flexbox/Grid Generator.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
