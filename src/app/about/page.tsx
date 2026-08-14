"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  Wrench,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Grid,
  ArrowRight,
} from "lucide-react";
import { FEATURED_TOOLS, ROADMAP_CATEGORIES } from "@/lib/data";
import PixelTransition from "@/components/ui/pixel-transition";

export default function AboutPage() {
  const totalToolsCount = FEATURED_TOOLS.length;

  return (
    <div className="py-8 sm:py-12 relative min-h-screen bg-[#FAF8F5]">
      <Container>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-600 shadow-2xs">
              <Wrench className="w-3.5 h-3.5" />
              <span>About ToolVerse</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Privacy-First Web Utilities
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              ToolVerse provides high-performance, client-side developer and creator utilities without intrusive ads, tracking scripts, or paywalls.
            </p>
          </div>

          {/* Interactive Pixel Transition Guarantee Card with Refined ToolVerse Palette */}
          <div className="w-full">
            <PixelTransition
              gridSize={12}
              pixelColor="#f97316"
              animationStepDuration={0.35}
              aspectRatio="18%"
              className="w-full rounded-2xl border border-orange-200/90 bg-white shadow-xs overflow-hidden cursor-pointer group"
              firstContent={
                <div className="w-full h-full p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-orange-50/90 via-amber-50/40 to-orange-100/30 text-zinc-900 rounded-2xl border border-orange-200/70">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-[11px] font-extrabold tracking-wide uppercase">
                      <Zap className="w-3 h-3 text-orange-600" />
                      <span>Hover to Reveal Guarantee</span>
                    </div>
                    <h3 className="text-base sm:text-xl font-extrabold text-zinc-900 tracking-tight">
                      How many tools in ToolVerse are free?
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 font-medium">
                      Hover or tap this card to test our pixel transition reveal!
                    </p>
                  </div>
                  <div className="shrink-0 px-4 py-2 rounded-xl bg-orange-500 text-white font-extrabold text-xs shadow-xs group-hover:bg-orange-600 transition-colors">
                    Hover Me →
                  </div>
                </div>
              }
              secondContent={
                <div className="w-full h-full p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 text-white rounded-2xl border border-zinc-800">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-extrabold tracking-wide uppercase border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      <span>100% Free Forever Guarantee</span>
                    </div>
                    <h3 className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 tracking-tight">
                      All {totalToolsCount} Tools Are 100% Free!
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                      Zero subscriptions, no credit cards, zero ad scripts, and 100% client-side privacy.
                    </p>
                  </div>
                  <div className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-xs">
                    {totalToolsCount} / {totalToolsCount} Free Tools
                  </div>
                </div>
              }
            />
          </div>

          {/* Platform Overview Stat Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
              <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-2xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 font-mono">{totalToolsCount}</h4>
                <p className="text-[11px] font-semibold text-zinc-500">Browser-Based Tools</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
              <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-2xs">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 font-mono">{ROADMAP_CATEGORIES.length}</h4>
                <p className="text-[11px] font-semibold text-zinc-500">Categories</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
              <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 font-mono">100%</h4>
                <p className="text-[11px] font-semibold text-zinc-500">Client Privacy</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
              <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-2xs">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 font-mono">0.0s</h4>
                <p className="text-[11px] font-semibold text-zinc-500">Server Latency</p>
              </div>
            </div>
          </div>

          {/* Complete Category & Tools Directory */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-200/80 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                  Available Tools Directory ({totalToolsCount} Tools)
                </h2>
                <p className="text-xs text-zinc-500">
                  Every active utility categorized for fast browsing and instant execution.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 hover:text-orange-700 transition-colors"
              >
                <span>Browse All Tools Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROADMAP_CATEGORIES.map((category) => {
                const categoryTools = FEATURED_TOOLS.filter(
                  (t) => t.categorySlug === category.slug
                );

                if (categoryTools.length === 0) return null;

                return (
                  <div
                    key={category.id}
                    className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3.5"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <h3 className="text-sm font-extrabold text-zinc-900">
                        {category.name}
                      </h3>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 font-bold border border-orange-200/60">
                        {categoryTools.length} {categoryTools.length === 1 ? "tool" : "tools"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {categoryTools.map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          className="inline-block px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200/80 hover:bg-orange-50 hover:border-orange-300 text-xs font-semibold text-zinc-800 hover:text-orange-600 transition-all shadow-2xs"
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guarantees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900">Zero Server Storage</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Your images, documents, passwords, and data stay on your device. Nothing is sent to remote servers or stored in cloud databases.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900">Instant Execution</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Utilities run using WebAssembly and WebGL canvas acceleration directly inside your browser for sub-millisecond response times.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900">No Ads or Trackers</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                ToolVerse is free of banner ads, tracking cookies, or mandatory account registrations. Pure developer efficiency.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
