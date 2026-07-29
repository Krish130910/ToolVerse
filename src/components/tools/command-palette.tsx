"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command, Sparkles, ArrowRight } from "lucide-react";
import { FEATURED_TOOLS } from "@/lib/data";
import { FeaturedTool } from "@/types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: FeaturedTool) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open trigger handled by parent or shortcut
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = FEATURED_TOOLS.filter((t) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.categoryName.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative z-10 w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header Input */}
          <div className="flex items-center px-4 border-b border-zinc-800">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search tools or commands (e.g. JSON, Password, JWT)..."
              className="w-full h-14 bg-transparent px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Tools & Utilities ({filtered.length})
            </div>

            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400 space-y-1">
                <p>No tools found matching &quot;{query}&quot;</p>
                <p className="text-[11px] text-zinc-500">Try searching for &quot;JSON&quot;, &quot;Password&quot;, or &quot;QR&quot;</p>
              </div>
            ) : (
              filtered.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/80 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                      <Sparkles className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                        <span>{tool.name}</span>
                        {tool.isLive && (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        {tool.tagline}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[10px]">
                ESC
              </kbd>
              <span>to close</span>
            </div>
            <div className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              <span>ToolVerse Quick Finder</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
