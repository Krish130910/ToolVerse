"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Lock, Cpu, ArrowRight } from "lucide-react";
import { Lightfall } from "@/components/ui/lightfall";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center py-12 md:py-20 overflow-hidden">
      {/* Background Layer: WebGL Lightfall with pitch-black ambient dark vignette */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <Lightfall
          colors={["#10B981", "#34D399", "#059669"]}
          backgroundColor="#09090B"
          speed={0.15}
          streakCount={2}
          streakWidth={0.8}
          streakLength={0.8}
          glow={0.35}
          density={0.3}
          twinkle={0.5}
          zoom={2.5}
          backgroundGlow={0.2}
          opacity={0.18}
          mouseInteraction={true}
          mouseStrength={0.4}
          mouseRadius={0.6}
        />
        {/* Dark Radial Vignette Mask - Center is 100% calm and pitch black */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_35%,transparent_0%,#09090B_85%)] pointer-events-none z-10" />
      </div>

      <Container className="relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center max-w-3xl mx-auto space-y-6"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-emerald-400 shadow-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Developer Productivity Suite</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] text-zinc-100">
            Everything Developers Need, <br />
            <span className="text-emerald-400 font-extrabold">
              One Platform.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
            20 beautifully crafted developer utilities for coding, design, security, and productivity. 100% client-side, zero ads.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#featured">
              <Button size="lg" className="flex items-center gap-2 text-xs sm:text-sm">
                <span>Explore Live Tools</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="#categories">
              <Button size="lg" variant="outline" className="text-xs sm:text-sm">
                Browse Directory
              </Button>
            </a>
          </div>

          {/* Subtle Trust Bar */}
          <div className="pt-8 border-t border-zinc-800/60 w-full max-w-xl flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>50+ Utilities</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Sub-ms Speed</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Zero Ads</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};



