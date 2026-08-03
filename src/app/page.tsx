"use client";

import React, { useState, useEffect } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedTools } from "@/components/home/featured-tools";
import { ToolsLogoLoopSection } from "@/components/home/tools-logo-loop";
import { RequestToolBanner } from "@/components/home/request-tool-banner";
import { FEATURED_TOOLS } from "@/lib/data";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const filteredTools = FEATURED_TOOLS.filter((t) => {
    if (selectedCategory !== "all" && t.categorySlug !== selectedCategory) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.categoryName.toLowerCase().includes(q) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-0 pb-4">
      {/* Integrated Hero Section with Embedded Search & Category Pills */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Featured Tools Grid */}
      <FeaturedTools
        tools={filteredTools}
        searchQuery={searchQuery}
        viewMode="grid"
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      {/* Infinite Logo Loop Ticker at Bottom of Home Screen */}
      <ToolsLogoLoopSection />

      {/* Interactive Request Tool Pixel Transition Banner */}
      <RequestToolBanner />
    </div>
  );
}
