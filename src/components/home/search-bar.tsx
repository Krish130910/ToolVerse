"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Search, LayoutGrid, List, Star, X } from "lucide-react";
import { ROADMAP_CATEGORIES } from "@/lib/data";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategorySelect: (slug: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  viewMode,
  onViewModeChange,
  showOnlyFavorites,
  onToggleFavorites,
  favoritesCount,
}) => {
  return (
    <div className="py-6 relative z-10 bg-[#FAF8F5]">
      <Container>
        <div className="space-y-4">
          {/* Main Search Input & Controls Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input Box */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tools by name, tag, or category... (e.g. JSON, Password, QR)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/95 border border-zinc-200/90 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-xs transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Switcher & Starred Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
              {/* Starred Favorites Filter Button */}
              <button
                onClick={onToggleFavorites}
                className={`flex items-center gap-1.5 h-11 px-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  showOnlyFavorites
                    ? "bg-amber-50 border-amber-300 text-amber-600 shadow-xs"
                    : "bg-white border-zinc-200 text-zinc-700 hover:border-orange-300"
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    showOnlyFavorites ? "fill-amber-500 text-amber-500" : "text-zinc-400"
                  }`}
                />
                <span>Starred</span>
                {favoritesCount > 0 && (
                  <span className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded-md font-mono border border-zinc-200">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Grid / List Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                <button
                  onClick={() => onViewModeChange("grid")}
                  className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white font-bold shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange("list")}
                  className={`p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white font-bold shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips Scrollbar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => onCategorySelect("all")}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 font-bold shadow-2xs"
                  : "bg-white/90 border-zinc-200 text-zinc-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              All Categories
            </button>
            {ROADMAP_CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.slug;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(isSelected ? "all" : category.slug)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 font-bold shadow-2xs"
                      : "bg-white/90 border-zinc-200 text-zinc-600 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};
