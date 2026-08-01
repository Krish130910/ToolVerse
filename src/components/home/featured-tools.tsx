"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeaturedTool } from "@/types";
import {
  Braces,
  KeyRound,
  QrCode,
  Lock,
  Layers,
  Sparkles,
  Clock,
  Star,
  Play,
  Binary,
  Palette,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { BorderGlow } from "@/components/ui/border-glow";


interface FeaturedToolsProps {
  tools: FeaturedTool[];
  searchQuery: string;
  viewMode: "grid" | "list";
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  onOpenTool?: (tool: FeaturedTool) => void;
  showOnlyFavorites?: boolean;
}


const TOOL_ICON_MAP: Record<string, React.ReactNode> = {
  Braces: <Braces className="w-5 h-5 text-orange-500" />,
  KeyRound: <KeyRound className="w-5 h-5 text-orange-500" />,
  QrCode: <QrCode className="w-5 h-5 text-orange-500" />,
  Lock: <Lock className="w-5 h-5 text-orange-500" />,
  Binary: <Binary className="w-5 h-5 text-orange-500" />,
  Layers: <Layers className="w-5 h-5 text-orange-500" />,
  Palette: <Palette className="w-5 h-5 text-orange-500" />,
};

export const FeaturedTools: React.FC<FeaturedToolsProps> = ({
  tools,
  searchQuery,
  viewMode,
  favorites,
  onToggleFavorite,
  showOnlyFavorites,
}) => {
  const filteredTools = tools.filter((tool) => {
    if (showOnlyFavorites && !favorites.includes(tool.id)) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.tagline.toLowerCase().includes(q) ||
      tool.categoryName.toLowerCase().includes(q) ||
      (tool.tags && tool.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  });

  return (
    <section id="featured-tools" className="pb-12 pt-2 bg-[#FAF8F5]">
      <Container>


        {/* Tools Display */}
        {filteredTools.length === 0 ? (
          <div className="bg-white border border-zinc-200 p-10 rounded-2xl text-center space-y-3 shadow-xs">
            <p className="text-zinc-600 text-sm font-medium">
              No tools matched your active filters.
            </p>
            <p className="text-xs text-zinc-500">
              Try clearing your search query or toggling off the Starred filter.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, idx) => {
              const isFav = favorites.includes(tool.id);
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                >
                  <BorderGlow
                    borderRadius={22}
                    glowRadius={25}
                    glowIntensity={0.85}
                    colors={["#F97316", "#FBBF24", "#EA580C"]}
                    className="h-full"
                  >
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="flex flex-col justify-between h-full group transition-all rounded-[22px] border border-zinc-200/90 bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Top App Preview Mockup Window */}
                      <div className="relative aspect-[16/10] bg-[#121215] border-b border-zinc-200/80 rounded-t-[20px] overflow-hidden p-4 flex items-center justify-center group-hover:bg-[#18181B] transition-colors">
                        {/* App UI Header Bar */}
                        <div className="absolute top-2.5 left-3 right-3 h-5.5 rounded-md bg-zinc-800/90 flex items-center px-2.5 justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                          </div>
                          <span className="text-[9px] font-mono text-zinc-400 truncate">
                            {tool.slug}.toolverse
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onToggleFavorite(tool.id);
                            }}
                            className="text-zinc-400 hover:text-amber-400 transition-colors"
                            title={isFav ? "Remove Star" : "Star Tool"}
                          >
                            <Star className={`w-3 h-3 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                          </button>
                        </div>

                        {/* Central Tool Icon / Preview Illustration */}
                        <div className="pt-4 flex flex-col items-center justify-center space-y-1.5 text-center">
                          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-md group-hover:scale-110 group-hover:border-orange-500/60 transition-all">
                            {TOOL_ICON_MAP[tool.iconName] || <Braces className="w-6 h-6 text-orange-500" />}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400 group-hover:text-orange-400 transition-colors">
                            {tool.name}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                        <div>
                          {/* Title */}
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-base font-extrabold text-zinc-900 group-hover:text-orange-600 transition-colors tracking-tight font-serif italic">
                              {tool.name}
                            </h3>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {tool.tagline}
                          </p>
                        </div>

                        {/* Bottom Footer Bar */}
                        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-600 transition-colors">
                            <span>↘</span>
                            <span>{tool.categoryName}</span>
                          </div>

                          <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-orange-500 text-zinc-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-105">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </BorderGlow>
                </motion.div>
              );
            })}
          </div>

        ) : (
          /* Compact List View */
          <div className="space-y-3">
            {filteredTools.map((tool, idx) => {
              const isFav = favorites.includes(tool.id);
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                >
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-colors group shadow-xs">
                    <Link href={`/tools/${tool.slug}`} className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                        {TOOL_ICON_MAP[tool.iconName] || <Braces className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400">
                            {tool.name}
                          </h3>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            • {tool.categoryName}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                          {tool.tagline}
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => onToggleFavorite(tool.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isFav
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                      >
                        <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>

                      <Link href={`/tools/${tool.slug}`}>
                        <Button
                          size="sm"
                          variant="default"
                          className="flex items-center gap-1.5 text-xs"
                        >
                          <Play className="w-3 h-3 fill-black" />
                          <span>Run Tool</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
};




