"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Search, Zap, ShieldCheck, Cpu, Lock, X } from "lucide-react";
import { motion } from "framer-motion";
import { FEATURED_TOOLS, ROADMAP_CATEGORIES } from "@/lib/data";
import { BruhGrowBackground } from "@/components/ui/bruhgrow-background";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategorySelect: (slug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <BruhGrowBackground className="pt-10 pb-8 border-b border-zinc-200/80">
      <section className="relative">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto"
          >

            {/* Typography */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.1]">
                Developer Tools, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500">
                  Zero Overhead.
                </span>
              </h1>
            </div>

            {/* Embedded Search Input */}
            <div className="w-full max-w-xl space-y-3">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tools by name, tag, or category... (e.g. JSON, Password, QR)"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white border border-zinc-200/90 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Trust Metrics Bar (Recalculated dynamically) */}
            <div className="pt-4 border-t border-orange-200/60 w-full max-w-xl flex items-center justify-between text-xs text-zinc-600">
              <div className="flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-orange-500" />
                <span>{FEATURED_TOOLS.length} Utilities</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                <span>100% Client-Side</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-orange-500" />
                <span>Sub-ms Speed</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-orange-500" />
                <span>Zero Trackers</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </BruhGrowBackground>
  );
};
