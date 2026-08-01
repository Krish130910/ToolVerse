"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ROADMAP_CATEGORIES, FEATURED_TOOLS } from "@/lib/data";

const CATEGORY_DOT_COLORS: Record<string, string> = {
  "pdf-tools": "bg-rose-500",
  "image-tools": "bg-purple-500",
  "css-ui": "bg-amber-500",
  "developer-tools": "bg-orange-500",
  "security": "bg-blue-500",
  "text-utilities": "bg-cyan-500",
  "ai-tools": "bg-teal-500",
  "web-utilities": "bg-orange-500",
  "productivity": "bg-fuchsia-500",
};

export const CategoriesDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Clean Text Link Trigger (No pill border) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer py-1"
        aria-expanded={isOpen}
      >
        <span>Categories</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-orange-500" : ""
          }`}
        />
      </button>

      {/* Floating Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 mt-2 w-64 rounded-2xl bg-white border border-zinc-200/90 shadow-xl p-2 z-50 overflow-hidden"
          >
            <div className="space-y-0.5">
              {ROADMAP_CATEGORIES.map((cat) => {
                const dotColor =
                  CATEGORY_DOT_COLORS[cat.slug] || "bg-orange-500";
                const count = FEATURED_TOOLS.filter(
                  (t) => t.categorySlug === cat.slug
                ).length;

                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-orange-50/70 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor} group-hover:scale-125 transition-transform`}
                      />
                      <span className="text-xs font-medium text-zinc-700 group-hover:text-orange-600 transition-colors">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 group-hover:text-zinc-600 transition-colors">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
