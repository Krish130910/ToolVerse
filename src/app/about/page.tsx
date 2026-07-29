"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Wrench, ShieldCheck, Terminal, Zap, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-16 relative min-h-screen bg-[#FAF8F5]">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600">
              <Wrench className="w-3.5 h-3.5" />
              <span>About ToolVerse</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Privacy-First Developer Utilities
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              ToolVerse was created out of frustration with existing web utility sites that are bloated with intrusive ad scripts, paywalls, and telemetry trackers.
            </p>
          </div>

          {/* Core Guarantees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-2 shadow-xs hover:shadow-md hover:border-orange-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">100% Client-Side Execution</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All algorithms run directly inside your web browser via WebAssembly and JavaScript. Your passwords, tokens, JSON payloads, and image files never touch a server.
              </p>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-2 shadow-xs hover:shadow-md hover:border-orange-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Zero Ads & Trackers</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                No third-party tracking pixels, Google Ads scripts, cookie consent popups, or aggressive paywalls. Pure utility.
              </p>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-2 shadow-xs hover:shadow-md hover:border-orange-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Sub-Millisecond Performance</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Engineered with Next.js 16 App Router, React 19, and Tailwind CSS for instant load times and keyboard-first workflows.
              </p>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 space-y-2 shadow-xs hover:shadow-md hover:border-orange-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center">
                <Heart className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">Free & Open Platform</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Built for digital creators, engineers, security researchers, and designers worldwide.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
