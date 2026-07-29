"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { Search, X, ShieldCheck, Zap, Lock, Cpu } from "lucide-react";
import { BruhGrowBackground } from "@/components/ui/bruhgrow-background";
import { ROADMAP_CATEGORIES } from "@/lib/data";

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
    <BruhGrowBackground>
      <section className="-mt-20 pt-24 pb-2 md:pb-4">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center max-w-3xl mx-auto space-y-5"
          >
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] text-zinc-900">
              Build faster with <br />
              <span className="text-orange-500 font-extrabold">
                dev tools
              </span>
            </h1>


            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed">
              Icons, color palettes, PDFs, images, QR codes, code tools, design utilities in your browser.
            </p>

            {/* Integrated Search Bar inside Hero */}
            <div className="w-full max-w-xl pt-1">
              <div className="relative flex items-center w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="What do you need to do today?"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-12.5 pl-11 pr-10 rounded-2xl bg-white/95 border border-zinc-200/90 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-md shadow-orange-500/5 transition-all"
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


            {/* Trust Metrics Bar */}
            <div className="pt-4 border-t border-orange-200/60 w-full max-w-xl flex items-center justify-between text-xs text-zinc-600">
              <div className="flex items-center gap-1.5 font-medium">
                <Cpu className="w-3.5 h-3.5 text-orange-500" />
                <span>20+ Utilities</span>
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
