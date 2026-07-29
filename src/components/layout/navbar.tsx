"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Wrench, Search, Menu, X, PlusCircle, Compass, Grid, Info, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onSearchClick?: () => void;
  onRequestToolClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchClick,
  onRequestToolClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 flex flex-col">
      {/* Integrated Header */}
      <header
        className={`transition-all duration-200 ${
          isScrolled
            ? "bg-[#09090B]/85 backdrop-blur-md border-b border-zinc-800/80 shadow-xs py-3"
            : "bg-transparent py-4 backdrop-blur-xs"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo Mark */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xs">
                <Wrench className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-zinc-100">
                  ToolVerse
                </span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-mono font-normal">
                  v1.0
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-zinc-400">
              <Link
                href="/explore"
                className="hover:text-zinc-100 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explore Tools</span>
              </Link>
              <Link
                href="/categories"
                className="hover:text-zinc-100 transition-colors flex items-center gap-1.5"
              >
                <Grid className="w-3.5 h-3.5 text-zinc-400" />
                <span>Categories</span>
              </Link>
              <Link
                href="/tools"
                className="hover:text-zinc-100 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>All Utilities</span>
              </Link>
              <Link
                href="/about"
                className="hover:text-zinc-100 transition-colors flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                <span>About</span>
              </Link>
            </nav>

            {/* Actions & Search */}
            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={onSearchClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer group"
              >
                <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:scale-110 transition-transform" />
                <span>Search...</span>
                <kbd className="hidden lg:inline-block font-mono bg-zinc-950 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800 text-[10px]">
                  ⌘K
                </kbd>
              </button>

              <Button
                size="sm"
                variant="default"
                onClick={onRequestToolClick}
                className="flex items-center gap-1.5 text-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Request Tool</span>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onSearchClick}
                className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-3 pt-3 border-t border-zinc-800 pb-3 space-y-2 text-xs"
              >
                <Link
                  href="/explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-900"
                >
                  Explore Tools
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-900"
                >
                  Categories
                </Link>
                <Link
                  href="/tools"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-900"
                >
                  All Utilities
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-zinc-300 hover:bg-zinc-900"
                >
                  About ToolVerse
                </Link>
                <div className="pt-2">
                  <Button
                    variant="default"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onRequestToolClick?.();
                    }}
                    className="w-full justify-center"
                  >
                    Request a Tool
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </header>
    </div>
  );
};




