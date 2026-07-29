"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROADMAP_CATEGORIES, FEATURED_TOOLS } from "@/lib/data";
import {
  Code2,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Palette,
  Binary,
  ShieldCheck,
  Zap,
  ArrowRight,
  Grid,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-6 h-6 text-emerald-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
  Binary: <Binary className="w-6 h-6 text-emerald-400" />,
  Palette: <Palette className="w-6 h-6 text-emerald-400" />,
  Image: <ImageIcon className="w-6 h-6 text-emerald-400" />,
  FileText: <FileText className="w-6 h-6 text-emerald-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-emerald-400" />,
  Zap: <Zap className="w-6 h-6 text-emerald-400" />,
};

export default function CategoriesPage() {
  return (
    <div className="py-8 sm:py-12 relative min-h-screen">
      <Container>
        {/* Header */}
        <div className="space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <Grid className="w-3.5 h-3.5" />
            <span>Taxonomy Index</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            Tool Categories Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            Organized taxonomies for rapid access to developer utilities, security tools, and asset generation suite.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROADMAP_CATEGORIES.map((category) => {
            const categoryTools = FEATURED_TOOLS.filter(
              (t) => t.categorySlug === category.slug
            );

            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="h-full p-6 flex flex-col justify-between rounded-2xl hover:border-emerald-500/40 transition-all group cursor-pointer">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 shadow-xs group-hover:border-emerald-500/30 transition-colors">
                        {ICON_MAP[category.iconName] || <Code2 className="w-6 h-6 text-emerald-400" />}
                      </div>
                      <Badge variant="muted" className="font-mono text-xs">
                        {category.toolCount} Utilities
                      </Badge>
                    </div>

                    <CardTitle className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {category.description}
                    </CardDescription>

                    {/* Sub-tools quick list */}
                    {categoryTools.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-1.5">
                        {categoryTools.map((t) => (
                          <div
                            key={t.id}
                            className="text-[11px] text-zinc-400 flex items-center justify-between group-hover:text-zinc-300"
                          >
                            <span>• {t.name}</span>
                            <span className="font-mono text-[10px] text-emerald-400">
                              {t.isLive ? "Live" : "Roadmap"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 group-hover:text-emerald-400 font-semibold">
                    <span>Explore Category</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
