"use client";

import React, { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FeaturedTools } from "@/components/home/featured-tools";
import { FEATURED_TOOLS, ROADMAP_CATEGORIES } from "@/lib/data";
import { ArrowLeft, Grid } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = ROADMAP_CATEGORIES.find((c) => c.slug === slug);
  if (!category && slug !== "all") {
    // Return empty view safely or fallback
  }

  const categoryTools = FEATURED_TOOLS.filter((t) => t.categorySlug === slug);

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
        {/* Back Link */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Categories</span>
        </Link>

        {/* Category Banner */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="emerald">{category ? category.name : slug}</Badge>
            <span className="text-xs text-zinc-400 font-mono">
              • {categoryTools.length} Utilities Found
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            {category ? category.name : "Category Tools"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            {category ? category.description : `Browse tools in ${slug}`}
          </p>
        </div>
      </Container>

      {/* Filtered Tools */}
      <FeaturedTools
        tools={categoryTools}
        searchQuery=""
        viewMode="grid"
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onOpenTool={(tool) => {
          window.location.href = `/tools/${tool.slug}`;
        }}
      />
    </div>
  );
}
