"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Command,
  ArrowRight,
  Braces,
  KeyRound,
  QrCode,
  Lock,
  Binary,
  Layers,
  Palette,
  Zap,
} from "lucide-react";
import { FEATURED_TOOLS } from "@/lib/data";
import { FeaturedTool } from "@/types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: FeaturedTool) => void;
}

const TOOL_ICON_MAP: Record<string, React.ReactNode> = {
  Braces: <Braces className="w-4 h-4 text-orange-500" />,
  KeyRound: <KeyRound className="w-4 h-4 text-orange-500" />,
  QrCode: <QrCode className="w-4 h-4 text-orange-500" />,
  Lock: <Lock className="w-4 h-4 text-orange-500" />,
  Binary: <Binary className="w-4 h-4 text-orange-500" />,
  Layers: <Layers className="w-4 h-4 text-orange-500" />,
  Palette: <Palette className="w-4 h-4 text-orange-500" />,
  Zap: <Zap className="w-4 h-4 text-orange-500" />,
  Link: <Braces className="w-4 h-4 text-orange-500" />,
};


export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = FEATURED_TOOLS.filter((t) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.categoryName.toLowerCase().includes(q) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length > 0 ? (prev + 1) % filtered.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length > 0
            ? (prev - 1 + filtered.length) % filtered.length
            : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelectTool(filtered[selectedIndex]);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, filtered, selectedIndex, onSelectTool]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Glassmorphic Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header Search Input */}
          <div className="flex items-center px-4 border-b border-zinc-200/80">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search tools or commands (e.g. JSON, Password, QR)..."
              className="w-full h-12 bg-transparent px-3 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Tools & Utilities ({filtered.length})
            </div>

            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 space-y-1">
                <p>No tools found matching &quot;{query}&quot;</p>
                <p className="text-[11px] text-zinc-400">
                  Try searching for &quot;JSON&quot;, &quot;Password&quot;, or &quot;QR&quot;
                </p>
              </div>
            ) : (
              filtered.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-orange-50 border-l-2 border-orange-500 text-zinc-900 font-semibold"
                        : "hover:bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/60 shrink-0 group-hover:border-orange-400 transition-colors">
                        {TOOL_ICON_MAP[tool.iconName] || (
                          <Zap className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                          <span className={isSelected ? "text-orange-600" : ""}>
                            {tool.name}
                          </span>
                          {tool.isLive ? (
                            <span className="text-[9px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-200 font-mono">
                              Live
                            </span>
                          ) : (
                            <span className="text-[9px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-200 font-mono">
                              Roadmap
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 line-clamp-1">
                          {tool.tagline}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected
                          ? "text-orange-500 translate-x-1"
                          : "text-zinc-300 opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts Bar */}
          <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 shadow-2xs text-[10px] text-zinc-700">
                  ESC
                </kbd>{" "}
                close
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 shadow-2xs text-[10px] text-zinc-700">
                  ↑↓
                </kbd>{" "}
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 shadow-2xs text-[10px] text-zinc-700">
                  ↵
                </kbd>{" "}
                select
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <Command className="w-3 h-3 text-orange-500" />
              <span>ToolVerse Finder</span>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
