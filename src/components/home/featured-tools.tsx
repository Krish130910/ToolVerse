"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FeaturedTool } from "@/types";
import {
  Braces,
  KeyRound,
  QrCode,
  Lock,
  Layers,
  Binary,
  Palette,
  ArrowRight,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

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
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.2) }}
                  className="h-full"
                >
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="flex flex-col justify-between h-full group transition-all duration-200 rounded-[22px] border border-zinc-200/90 hover:border-orange-400 bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 overflow-hidden"
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.15) }}
                >
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-zinc-200/90 bg-white hover:border-orange-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-zinc-900 text-orange-500 border border-zinc-700/80">
                        {TOOL_ICON_MAP[tool.iconName] || <Braces className="w-5 h-5 text-orange-500" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-zinc-900 group-hover:text-orange-600 transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-zinc-500 line-clamp-1">{tool.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-extrabold uppercase text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-md">
                        {tool.categoryName}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        className="text-zinc-400 hover:text-amber-400 transition-colors p-1"
                      >
                        <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
};
