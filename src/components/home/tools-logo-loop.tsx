"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import LogoLoop, { LogoItem } from "@/components/ui/logo-loop";
import { FEATURED_TOOLS } from "@/lib/data";
import {
  Sparkles,
  Palette,
  FileText,
  Code2,
  Binary,
  Layers,
  PenTool,
  Wrench,
  Zap,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4 text-orange-500" />,
  Palette: <Palette className="w-4 h-4 text-amber-500" />,
  FileText: <FileText className="w-4 h-4 text-emerald-500" />,
  Code2: <Code2 className="w-4 h-4 text-blue-500" />,
  Binary: <Binary className="w-4 h-4 text-purple-500" />,
  Layers: <Layers className="w-4 h-4 text-rose-500" />,
  PenTool: <PenTool className="w-4 h-4 text-cyan-500" />,
  Wrench: <Wrench className="w-4 h-4 text-orange-500" />,
  Zap: <Zap className="w-4 h-4 text-amber-500" />,
};

export const ToolsLogoLoopSection: React.FC = () => {
  const logos: LogoItem[] = FEATURED_TOOLS.map((tool) => ({
    href: `/tools/${tool.slug}`,
    title: tool.name,
    node: (
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:border-orange-400 hover:shadow-md transition-all group shrink-0">
        <div className="p-1 rounded-xl bg-orange-50 border border-orange-100 group-hover:scale-110 transition-transform">
          {ICON_MAP[tool.iconName] || <Zap className="w-3.5 h-3.5 text-orange-500" />}
        </div>
        <span className="text-xs font-bold text-zinc-800 group-hover:text-orange-600 transition-colors whitespace-nowrap">
          {tool.name}
        </span>
      </div>
    ),
  }));

  return (
    <section className="py-6 bg-[#FAF8F5] border-t border-zinc-200/80 relative overflow-hidden">
      <Container>
        <div className="text-center space-y-1.5 mb-5 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-600 shadow-2xs">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Project Ecosystem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Explore All {FEATURED_TOOLS.length} Live Utilities
          </h2>
          <p className="text-xs text-zinc-600">
            Click any utility chip in real time as the ecosystem loop flows continuously.
          </p>
        </div>
      </Container>

      {/* Infinite Logo Loop Ticker (Maintains continuous speed on hover) */}
      <div className="py-1">
        <LogoLoop
          logos={logos}
          speed={60}
          direction="left"
          gap={18}
          logoHeight={32}
          pauseOnHover={false}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#FAF8F5"
          ariaLabel="All Project Tools Loop"
        />
      </div>
    </section>
  );
};
