"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { SearchBar } from "@/components/home/search-bar";
import { FeaturedTools } from "@/components/home/featured-tools";
import { FEATURED_TOOLS } from "@/lib/data";
import { Sparkles } from "lucide-react";

export default function ToolsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("toolverse_favs");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleFavorite = (toolId: string) => {
    let updated: string[];
    if (favorites.includes(toolId)) {
      updated = favorites.filter((id) => id !== toolId);
    } else {
      updated = [...favorites, toolId];
    }
    setFavorites(updated);
    try {
      localStorage.setItem("toolverse_favs", JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="py-8 sm:py-12 space-y-6 min-h-screen">
      <Container>
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            All Developer Utilities
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            Every client-side tool in ToolVerse. Instant execution, zero ad scripts, 100% free.
          </p>
        </div>
      </Container>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
        favoritesCount={favorites.length}
      />

      <FeaturedTools
        tools={FEATURED_TOOLS}
        searchQuery={searchQuery}
        viewMode={viewMode}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onOpenTool={(tool) => {
          window.location.href = `/tools/${tool.slug}`;
        }}
        showOnlyFavorites={showOnlyFavorites}
      />
    </div>
  );
}
