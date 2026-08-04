"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { FEATURED_TOOLS, ROADMAP_CATEGORIES } from "@/lib/data";
import { BruhGrowBackground } from "@/components/ui/bruhgrow-background";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategorySelect: (slug: string) => void;
}

const line1 = ["Build", "faster,"];
const line2 = ["ship", "smarter."];

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
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">

            {/* Animated Two-line Typography */}
            <div className="space-y-1">
              <h1 className="font-extrabold tracking-tight leading-[1.1]">

                {/* Line 1 */}
                <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 text-4xl sm:text-6xl text-zinc-900">
                  {line1.map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.1, duration: 0.55, type: "tween", ease: "easeOut" }}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>

                {/* Line 2 */}
                <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 text-4xl sm:text-6xl">
                  {line2.map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: (i + 2) * 0.1, duration: 0.55, type: "tween", ease: "easeOut" }}
                      className="inline-block italic text-orange-500"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.45, type: "tween", ease: "easeOut" }}
                className="text-sm sm:text-base text-zinc-500 max-w-lg mx-auto leading-relaxed pt-3"
              >
                Icons, PDFs, QR codes, color palettes, code converters, AI tools — all client-side in your browser.
              </motion.p>
            </div>

            {/* Embedded Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.4, type: "tween", ease: "easeOut" }}
              className="w-full max-w-xl space-y-3"
            >
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
            </motion.div>


          </div>
        </Container>
      </section>
    </BruhGrowBackground>
  );
};
