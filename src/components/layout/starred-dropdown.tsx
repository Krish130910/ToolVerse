"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Star, Trash2, ExternalLink, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURED_TOOLS } from "@/lib/data";
import { getFavorites, toggleFavoriteTool, saveFavorites, FAVORITES_EVENT } from "@/lib/favorites";
import { FeaturedTool } from "@/types";

export const StarredDropdown: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncFavs = () => {
      setFavorites(getFavorites());
    };
    syncFavs();

    window.addEventListener("storage", syncFavs);
    window.addEventListener(FAVORITES_EVENT, syncFavs);
    return () => {
      window.removeEventListener("storage", syncFavs);
      window.removeEventListener(FAVORITES_EVENT, syncFavs);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Find all starred tools from FEATURED_TOOLS
  const starredTools: FeaturedTool[] = FEATURED_TOOLS.filter((t) =>
    favorites.includes(t.id)
  );

  const count = starredTools.length;

  const handleRemove = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteTool(toolId);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    saveFavorites([]);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Navbar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Starred tools (${count})`}
        className={`flex items-center gap-1.5 h-8.5 px-3 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? "bg-amber-50 border-amber-300 text-amber-900"
            : count > 0
            ? "bg-white/90 border-amber-200/80 text-zinc-800 hover:border-amber-300 hover:bg-amber-50/50"
            : "bg-white/90 border-zinc-200/90 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300"
        }`}
      >
        <Star
          className={`w-3.5 h-3.5 transition-colors ${
            count > 0 ? "fill-amber-400 text-amber-500" : "text-zinc-400"
          }`}
        />
        <span>Starred</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold transition-colors ${
            count > 0
              ? "bg-amber-100 text-amber-800 border border-amber-200/60"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {count}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 sm:left-0 md:left-auto md:right-0 mt-2 w-72 sm:w-80 bg-white border border-zinc-200/90 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Starred Tools
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                  {count}
                </span>
              </div>

              {count > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[11px] font-semibold text-zinc-400 hover:text-rose-600 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Content List */}
            <div className="max-h-72 overflow-y-auto p-2 divide-y divide-zinc-100/60">
              {count === 0 ? (
                <div className="p-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-500 flex items-center justify-center mx-auto">
                    <Star className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-zinc-800">No starred tools yet</p>
                  <p className="text-[11px] text-zinc-500 max-w-[220px] mx-auto leading-relaxed">
                    Click the <span className="font-semibold text-amber-600">⭐ Star</span> button on any tool card or tool header to add it here for quick access.
                  </p>
                </div>
              ) : (
                starredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="group flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-orange-50/60 transition-colors"
                  >
                    <Link
                      href={`/tools/${tool.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex-1 min-w-0 flex items-center gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-orange-100/60 border border-orange-200/50 text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-900 group-hover:text-orange-600 transition-colors truncate">
                          {tool.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate">
                          {tool.categoryName}
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/tools/${tool.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-orange-600 hover:bg-white transition-colors"
                        title="Open Tool"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={(e) => handleRemove(e, tool.id)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove Star"
                        aria-label={`Remove ${tool.name} from starred`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {count > 0 && (
              <div className="px-3.5 py-2.5 bg-zinc-50/80 border-t border-zinc-100 text-[10px] text-zinc-500 font-medium flex items-center justify-between">
                <span>Quick Access Shortcuts</span>
                <span className="text-orange-600 font-bold">{count} Saved</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
