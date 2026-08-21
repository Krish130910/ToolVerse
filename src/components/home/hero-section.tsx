"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Search, X, Cpu, Grid, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { BruhGrowBackground } from "@/components/ui/bruhgrow-background";
import { StrokeText } from "@/components/ui/stroke-text";

import { FEATURED_TOOLS, ROADMAP_CATEGORIES } from "@/lib/data";

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
          <div className="flex flex-col items-center text-center space-y-6 sm:space-y-7 max-w-4xl mx-auto">

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

            {/* Hero Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.4, type: "tween", ease: "easeOut" }}
              className="w-full max-w-4xl pt-3"
            >
              <div className="bg-white/90 backdrop-blur-md border border-zinc-200/90 rounded-2xl p-2 sm:p-2.5 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5">
                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-orange-50/50 border border-orange-200/50 text-left hover:bg-orange-50/80 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-extrabold">
                    <Cpu className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-zinc-900 font-mono leading-none">{FEATURED_TOOLS.length}</div>
                    <div className="text-[11px] sm:text-xs font-bold text-zinc-600 truncate mt-0.5">Browser-Based Tools</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-orange-50/50 border border-orange-200/50 text-left hover:bg-orange-50/80 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-extrabold">
                    <Grid className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-zinc-900 font-mono leading-none">9</div>
                    <div className="text-[11px] sm:text-xs font-bold text-zinc-600 truncate mt-0.5">Categories</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-orange-50/50 border border-orange-200/50 text-left hover:bg-orange-50/80 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-extrabold">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-zinc-900 font-mono leading-none">100%</div>
                    <div className="text-[11px] sm:text-xs font-bold text-zinc-600 truncate mt-0.5">Client Privacy</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-orange-50/50 border border-orange-200/50 text-left hover:bg-orange-50/80 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs font-extrabold">
                    <Zap className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-black text-zinc-900 font-mono leading-none">0.0s</div>
                    <div className="text-[11px] sm:text-xs font-bold text-zinc-600 truncate mt-0.5">Server Latency</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>
    </BruhGrowBackground>
  );
};
