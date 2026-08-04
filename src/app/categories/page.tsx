"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROADMAP_CATEGORIES, FEATURED_TOOLS } from "@/lib/data";
import {
  Code2,
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
  Code2: <Code2 className="w-6 h-6 text-orange-500" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-orange-500" />,
  Binary: <Binary className="w-6 h-6 text-orange-500" />,
  Palette: <Palette className="w-6 h-6 text-orange-500" />,
  Image: <ImageIcon className="w-6 h-6 text-orange-500" />,
  FileText: <FileText className="w-6 h-6 text-orange-500" />,
  Zap: <Zap className="w-6 h-6 text-orange-500" />,
};

export default function CategoriesPage() {
  return (
    <div className="py-8 sm:py-12 relative min-h-screen bg-[#FAF8F5]">
      <Container>
        {/* Header */}
        <div className="space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600">
            <Grid className="w-3.5 h-3.5" />
            <span>Taxonomy Index</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Tool Categories Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl leading-relaxed">
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
                <Card className="h-full p-6 flex flex-col justify-between rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all group cursor-pointer">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-orange-50 border border-orange-200/80 shadow-xs group-hover:border-orange-400 group-hover:bg-orange-100/50 transition-colors">
                        {ICON_MAP[category.iconName] || <Code2 className="w-6 h-6 text-orange-500" />}
                      </div>
                      <Badge variant="muted" className="font-mono text-xs">
                        {categoryTools.length} Utilities
                      </Badge>
                    </div>

                    <CardTitle className="text-lg font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      {category.description}
                    </CardDescription>

                    {/* Sub-tools quick list */}
                    {categoryTools.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5">
                        {categoryTools.map((t) => (
                          <div
                            key={t.id}
                            className="text-[11px] text-zinc-600 flex items-center justify-between group-hover:text-zinc-900"
                          >
                            <span>• {t.name}</span>
                            <span className="font-mono text-[10px] text-orange-600 font-semibold">
                              {t.isLive ? "Live" : "Roadmap"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600 group-hover:text-orange-600 font-bold">
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
