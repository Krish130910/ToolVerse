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

interface FeaturedToolsProps {
  tools: FeaturedTool[];
  searchQuery: string;
  viewMode: "grid" | "list";
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  onOpenTool: (tool: FeaturedTool) => void;
  showOnlyFavorites?: boolean;
}

const TOOL_ICON_MAP: Record<string, React.ReactNode> = {
  Braces: <Braces className="w-5 h-5 text-emerald-400" />,
  KeyRound: <KeyRound className="w-5 h-5 text-emerald-400" />,
  QrCode: <QrCode className="w-5 h-5 text-emerald-400" />,
  Lock: <Lock className="w-5 h-5 text-emerald-400" />,
  Binary: <Binary className="w-5 h-5 text-emerald-400" />,
  Layers: <Layers className="w-5 h-5 text-emerald-400" />,
  Palette: <Palette className="w-5 h-5 text-emerald-400" />,
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
    <section id="featured" className="py-10 relative">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Toolkit Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Featured Utilities{" "}
              <span className="text-zinc-400 font-normal text-lg">
                ({filteredTools.length} Available)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Instant browser-native tools. Click any card to launch immediately in your browser.
            </p>
          </div>
          <Link href="/explore">
            <Button variant="outline" className="flex items-center gap-1.5 text-xs">
              <span>View All 20+ Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Tools Display */}
        {filteredTools.length === 0 ? (
          <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-xl text-center space-y-3 shadow-xs">
            <p className="text-zinc-400 text-sm">
              No tools matched your active filters.
            </p>
            <p className="text-xs text-zinc-400">
              Try clearing your search query or toggling off the Starred filter.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <Card className="flex flex-col justify-between h-full group hover:border-emerald-500/40 transition-all p-5 rounded-xl">
                    <div>
                      {/* Top Bar: Icon, Category & Star */}
                      <div className="flex items-start justify-between mb-4">
                        <Link href={`/tools/${tool.slug}`} className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-xs group-hover:border-emerald-500/30 transition-colors">
                            {TOOL_ICON_MAP[tool.iconName] || <Braces className="w-5 h-5 text-emerald-400" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                              {tool.categoryName}
                            </span>
                            <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                              {tool.name}
                            </h3>
                          </div>
                        </Link>

                        {/* Star / Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(tool.id);
                          }}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isFav
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Star className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                        </button>
                      </div>

                      {/* Tagline */}
                      <CardDescription className="text-xs text-zinc-400 leading-relaxed mb-4">
                        {tool.tagline}
                      </CardDescription>

                      {/* Tags */}
                      {tool.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {tool.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800 font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      {tool.isLive ? (
                        <Badge variant="emerald" className="gap-1 font-mono text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Tool
                        </Badge>
                      ) : (
                        <Badge variant="muted" className="gap-1 font-mono text-[10px]">
                          <Clock className="w-3 h-3" />
                          {tool.badgeText}
                        </Badge>
                      )}

                      <Link href={`/tools/${tool.slug}`}>
                        <Button
                          size="sm"
                          variant="default"
                          className="flex items-center gap-1 text-xs"
                        >
                          <Play className="w-3 h-3 fill-black" />
                          <span>Open Tool</span>
                        </Button>
                      </Link>
                    </div>
                  </Card>
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




