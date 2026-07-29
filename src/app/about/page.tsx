"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Wrench, ShieldCheck, Terminal, Code2, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-16 relative min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <Wrench className="w-3.5 h-3.5" />
              <span>About ToolVerse</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight">
              Privacy-First Developer Utilities
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              ToolVerse was created out of frustration with existing web utility sites that are bloated with intrusive ad scripts, paywalls, and telemetry trackers.
            </p>
          </div>

          {/* Core Guarantees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-zinc-100">100% Client-Side Execution</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All algorithms run directly inside your web browser via WebAssembly and JavaScript. Your passwords, tokens, JSON payloads, and image files never touch a server.
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-2">
              <Terminal className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-zinc-100">Zero Ads & Trackers</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No third-party tracking pixels, Google Ads scripts, cookie consent popups, or aggressive paywalls. Pure utility.
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-2">
              <Zap className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-zinc-100">Sub-Millisecond Performance</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Engineered with Next.js 16 App Router, React 19, and Tailwind CSS for instant load times and keyboard-first workflows.
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-2">
              <Heart className="w-6 h-6 text-emerald-400" />
              <h3 className="text-base font-bold text-zinc-100">Free & Open Platform</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Built for digital creators, engineers, security researchers, and designers worldwide.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
