"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CategoriesDropdown } from "@/components/layout/categories-dropdown";
import { StarredDropdown } from "@/components/layout/starred-dropdown";
import { Wrench, Search, Menu, X, PlusCircle } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

interface NavbarProps {
  onSearchClick?: () => void;
  onRequestToolClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchClick,
  onRequestToolClick,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > 120) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
    { href: "/about", label: "About" },
  ];

  return (
    <motion.header
      className="sticky top-0 z-50 h-16 flex items-center bg-[#FAF8F5]/95 backdrop-blur-md border-b border-black/[0.06] shadow-2xs transition-shadow"
      animate={{
        y: hidden ? -64 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Container size="large" className="w-full">
          <div className="flex items-center justify-between">
            {/* Left: Logo Only */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="h-8.5 w-8.5 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-2xs group-hover:border-orange-400/40 group-hover:bg-orange-500/20 transition-all">
                <Wrench className="w-4.5 h-4.5 text-orange-600 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 group-hover:text-orange-600 transition-colors">
                ToolVerse
              </span>
            </Link>

            {/* Center: Navigation Text Links */}
            <nav className="hidden lg:flex items-center gap-8 lg:gap-10 text-sm sm:text-[15px] font-bold text-zinc-700">
              {/* Categories Dropdown Text Link */}
              <CategoriesDropdown />

              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 transition-colors ${
                      isActive ? "text-zinc-900 font-extrabold" : "hover:text-zinc-900"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Starred, Search & Primary CTA */}
            <div className="hidden sm:flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Starred Tools Dropdown */}
              <StarredDropdown />

              {/* Clean search trigger */}
              <button
                onClick={onSearchClick}
                className="flex items-center gap-2 w-32 sm:w-40 lg:w-52 h-9 px-3 rounded-xl bg-white/90 border border-zinc-200/90 text-xs sm:text-sm text-zinc-500 hover:text-zinc-800 hover:border-orange-300 transition-all cursor-pointer group shadow-2xs"
              >
                <Search className="w-4 h-4 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                <span className="text-zinc-500 group-hover:text-zinc-800 transition-colors text-xs sm:text-sm truncate">
                  Search tools...
                </span>
              </button>

              {/* Primary CTA */}
              <Button
                size="sm"
                variant="default"
                onClick={onRequestToolClick}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold rounded-xl px-4 h-9 shadow-2xs shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Request Tool</span>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex sm:hidden items-center gap-2">
              <StarredDropdown />
              <button
                onClick={onSearchClick}
                className="p-2 rounded-xl bg-white border border-zinc-200/90 text-zinc-700 hover:text-orange-600 shadow-2xs"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white border border-zinc-200/90 text-zinc-700 hover:text-orange-600 shadow-2xs"
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
                className="md:hidden mt-3 pt-3 border-t border-zinc-200 pb-3 space-y-1.5 text-xs bg-white rounded-2xl p-3 border shadow-lg"
              >
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-zinc-700 font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  All Tools
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-zinc-700 font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors"
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
    </motion.header>
  );
};
