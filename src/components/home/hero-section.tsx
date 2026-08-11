"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { BruhGrowBackground } from "@/components/ui/bruhgrow-background";
import { StrokeText } from "@/components/ui/stroke-text";

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
    <BruhGrowBackground className="pt-14 sm:pt-18 lg:pt-20 pb-12 sm:pb-16 border-b border-zinc-200/80 relative overflow-hidden">
      <section className="relative z-10">
        <Container>
          <div className="flex flex-col items-center text-center space-y-7 max-w-4xl mx-auto">

            {/* StrokeText Hero Title */}
            <div className="w-full space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-3xl mx-auto"
              >
                <StrokeText
                  text="Build faster, ship smarter."
                  strokeColor="#f97316"
                  fillColor="#18181b"
                  strokeWidth={1.8}
                  drawDuration={1.8}
                  fillDelay={0.3}
                  stagger={0.04}
                  ease="power2.out"
                  trigger="mount"
                  fillMode="wipe"
                  fontSize={72}
                  fontWeight={900}
                  letterSpacing={-2}
                  className="mx-auto"
                />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45, type: "tween", ease: "easeOut" }}
                className="text-base sm:text-lg lg:text-[19px] text-zinc-600 max-w-2xl mx-auto leading-relaxed pt-3 sm:pt-4"
              >
                Icons, PDFs, QR codes, color palettes, code converters, AI tools — all client-side in your browser.
              </motion.p>
            </div>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.4, type: "tween", ease: "easeOut" }}
              className="w-full max-w-2xl pt-1"
            >
              <div className="relative w-full">
                <Search className="w-5 h-5 text-zinc-400 absolute left-5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tools by name, tag, or category... (e.g. JSON, Password, QR)"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-[58px] sm:h-16 pl-13 pr-12 rounded-[20px] bg-white border border-zinc-200/90 text-base sm:text-[17px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5" />
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
