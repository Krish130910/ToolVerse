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
} from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5 text-emerald-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
  Binary: <Binary className="w-5 h-5 text-emerald-400" />,
  Palette: <Palette className="w-5 h-5 text-emerald-400" />,
  Image: <ImageIcon className="w-5 h-5 text-emerald-400" />,
  FileText: <FileText className="w-5 h-5 text-emerald-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-emerald-400" />,
  Zap: <Zap className="w-5 h-5 text-emerald-400" />,
};

export const CategoryCards: React.FC = () => {
  return (
    <section className="py-12 bg-zinc-950/80 border-y border-zinc-800/80">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Taxonomy Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Browse Tools by Category
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Organized collections of fast browser tools across engineering, security, UI, and AI capabilities.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs text-emerald-400 hover:underline font-medium self-start md:self-auto"
          >
            View All Categories →
          </Link>
        </div>

        {/* Categories Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP_CATEGORIES.map((category, idx) => {
            const categoryTools = FEATURED_TOOLS.filter(
              (t) => t.categorySlug === category.slug
            );

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <Card className="group cursor-pointer flex flex-col justify-between h-full p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40">
                    <div>
                      {/* Top Row Icon & Count */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-xs group-hover:border-emerald-500/30 transition-colors">
                          {ICON_MAP[category.iconName] || <Code2 className="w-5 h-5 text-emerald-400" />}
                        </div>
                        <Badge variant="muted" className="text-[10px] font-mono">
                          {categoryTools.length} Tools
                        </Badge>
                      </div>

                      {/* Title & Description */}
                      <CardTitle className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                        <span>{category.name}</span>
                      </CardTitle>
                      <CardDescription className="mt-1.5 text-xs text-zinc-400 line-clamp-2">
                        {category.description}
                      </CardDescription>
                    </div>

                    {/* Bottom Action Line */}
                    <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 group-hover:text-emerald-400 font-medium">
                      <span>Explore Suite</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
