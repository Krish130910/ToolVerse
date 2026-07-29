"use client";

import React, { useState, useEffect } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { SearchBar } from "@/components/home/search-bar";
import { CategoryCards } from "@/components/home/category-cards";
import { FeaturedTools } from "@/components/home/featured-tools";
import { WhyToolVerse } from "@/components/home/why-toolverse";
import { FEATURED_TOOLS, ROADMAP_CATEGORIES } from "@/lib/data";

export default function HomePage() {
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
    <div className="space-y-4">
      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Quick Search & Category Bar */}
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

      {/* Categories Preview Grid */}
      <CategoryCards categories={ROADMAP_CATEGORIES} />

      {/* Featured Tools Grid */}
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

      {/* Why Choose ToolVerse */}
      <WhyToolVerse />
    </div>
  );
}
