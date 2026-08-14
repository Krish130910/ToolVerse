"use client";

import React, { useState, useMemo, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Heart,
  Copy,
  Check,
  Star,
  Sparkles,
  Palette as PaletteIcon,
} from "lucide-react";

export interface PaletteDef {
  id: string;
  name: string;
  category: string;
  colors: [string, string, string, string, string]; // 5 hex colors
  isCurated?: boolean;
}

const CATEGORIES = [
  { id: "all", label: "All Palettes", dot: "bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500" },
  { id: "red", label: "Red", dot: "bg-red-500" },
  { id: "pink", label: "Pink", dot: "bg-pink-500" },
  { id: "purple", label: "Purple", dot: "bg-purple-500" },
  { id: "blue", label: "Blue", dot: "bg-blue-500" },
  { id: "cyan", label: "Cyan", dot: "bg-cyan-400" },
  { id: "teal", label: "Teal", dot: "bg-teal-500" },
  { id: "green", label: "Green", dot: "bg-emerald-500" },
  { id: "lime", label: "Lime", dot: "bg-lime-500" },
  { id: "yellow", label: "Yellow", dot: "bg-amber-400" },
  { id: "orange", label: "Orange", dot: "bg-orange-500" },
  { id: "analogous", label: "Analogous", dot: "bg-gradient-to-r from-orange-400 to-pink-500" },
  { id: "curated", label: "Emir's Pick", dot: "bg-yellow-400", isStar: true },
  { id: "saved", label: "Saved", dot: "bg-rose-500", isHeart: true },
];

// Fast HSL to HEX Converter
function hslToHex(h: number, s: number, l: number): string {
  const normH = (h % 360 + 360) % 360;
  const normS = Math.max(0, Math.min(100, s)) / 100;
  const normL = Math.max(0, Math.min(100, l)) / 100;

  const a = normS * Math.min(normL, 1 - normL);
  const f = (n: number) => {
    const k = (n + normH / 30) % 12;
    const color = normL - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Generate 5-shade palette from base HSL
function make5Shades(h: number, s: number, l: number): [string, string, string, string, string] {
  return [
    hslToHex(h, Math.max(18, s - 18), Math.min(94, l + 26)),
    hslToHex(h, Math.max(22, s - 10), Math.min(83, l + 13)),
    hslToHex(h, s, l),
    hslToHex(h, Math.min(100, s + 12), Math.max(18, l - 15)),
    hslToHex(h, Math.min(100, s + 22), Math.max(8, l - 30)),
  ];
}

// Generate 5-shade gradient for Analogous & Curated
function make5Gradient(baseH: number, s: number, l: number, step = 16): [string, string, string, string, string] {
  return [
    hslToHex(baseH - step * 2, s, Math.min(90, l + 16)),
    hslToHex(baseH - step, s, Math.min(80, l + 8)),
    hslToHex(baseH, s, l),
    hslToHex(baseH + step, s, Math.max(24, l - 12)),
    hslToHex(baseH + step * 2, s, Math.max(12, l - 24)),
  ];
}

// 999 Unique Category Seeds with Distinct Name Vocabularies
const CATEGORY_DEFINITIONS = [
  {
    category: "red",
    baseHue: 0,
    count: 85,
    names: [
      "Crimson Tide", "Ruby Fire", "Scarlet Velvet", "Burgundy Ember", "Maroon Spice", "Cherry Bloom",
      "Cardinal Flame", "Garnet Shadow", "Merlot Vintage", "Rust Copper", "Neon Inferno", "Electric Cayenne",
      "Soft Coral Red", "Bold Sangria", "Rich Crimson", "Pure Cardinal", "Fresh Paprika", "Dynamic Lava",
      "Modern Carmine", "Classic Mahogany", "Imperial Scarlet", "Rosewood Dusk", "Tuscan Brick", "Venetian Crimson",
      "Chili Pepper", "Ember Glow", "Blood Orange Red", "Bordeaux Elegance", "Siren Crimson", "Cranberry Fizz",
      "Firebrick Red", "Vermilion Sun", "Poppy Red", "Coquelicot", "Amaranth Flare", "Madder Red", "Barn Red Warmth",
      "Alizarin Glow", "Jam Crimson", "Rust Flame", "Mahogany Dark", "Coral Heat", "Persimmon Red", "Dragonfruit Red",
      "Redcurrant", "Apple Red", "Candy Red", "Cadmium Red", "Cerise Red", "Terracotta Red", "Blush Crimson",
    ],
  },
  {
    category: "pink",
    baseHue: 335,
    count: 85,
    names: [
      "Rose Petal", "Blush Satin", "Fuchsia Glow", "Magenta Velvet", "Raspberry Crisp", "Cotton Candy Dream",
      "Coral Pink Dawn", "Hot Pink Pulse", "Soft Pink Whisper", "Bubblegum Sweet", "Pastel Pink Bloom", "Flaming Pink",
      "Rose Gold Luxe", "Cherry Blossom Pink", "Baby Pink Cloud", "Flamingo Feather", "Orchid Pink Bloom", "Deep Pink Dusk",
      "Carnation Pink", "Punch Pink", "Watermelon Fizz", "Mauve Satin", "Sweet Pink Silk", "Neon Pink Glow",
      "Blush Rose Petal", "Dusty Rose Velvet", "Taffy Pink", "Sugar Pink Cloud", "Peony Blossom", "Rouge Pink",
      "Rose Quartz", "Pink Lemonade", "Sorbet Pink", "Thistle Pink", "Plum Pink", "Azalea Bloom", "Magenta Sunset",
    ],
  },
  {
    category: "purple",
    baseHue: 275,
    count: 90,
    names: [
      "Purple Dusk", "Purple Twilight", "Purple Midnight", "Purple Magic", "Purple Mystery", "Purple Enchantment",
      "Purple Whisper", "Purple Echo", "Purple Shadow", "Purple Mist", "Bold Purple", "Rich Purple", "Pure Purple",
      "Fresh Purple", "Dynamic Purple", "Modern Purple", "Classic Purple", "Elegant Purple", "Lively Purple",
      "Subtle Purple", "Violet Veil", "Lavender Mist", "Orchid Dusk", "Plum Jam", "Iris Glow", "Grape Velvet",
      "Amethyst Spark", "Mulberry Wine", "Indigo Night", "Jam Purple", "Raisin Dark", "Thistle Bloom", "Lilac Breeze",
    ],
  },
  {
    category: "blue",
    baseHue: 215,
    count: 90,
    names: [
      "Ocean Blue", "Royal Blue", "Sky Blue", "Midnight Blue", "Sapphire", "Cobalt", "Azure", "Deep Blue",
      "Ice Blue", "Navy", "Electric Blue", "Slate Blue", "Denim", "Cornflower", "Cerulean", "Prussian Blue",
      "Steel Blue", "Powder Blue", "Maya Blue", "Yale Blue", "Ultramarine", "Marine Blue", "Capri Blue", "Glacier Blue",
      "Polar Blue", "Horizon Blue", "Abyssal Blue", "Aegean Sea", "True Blue", "Nordic Blue", "Bermuda Ocean",
    ],
  },
  {
    category: "cyan",
    baseHue: 185,
    count: 75,
    names: [
      "Cyan Glow", "Electric Cyan", "Ice Cyan", "Aqua Spark", "Turquoise Wave", "Deep Cyan", "Bright Cyan", "Ocean Cyan",
      "Breeze Cyan", "Glacier Frost", "Tropical Cyan", "Lagoon Blue", "Celeste Mint", "Robin Egg Blue", "Tiffany Cyan",
      "Diamond Aqua", "Vaporwave Cyan", "Neon Cyan", "Pure Cyan", "Arctic Cyan", "Cyan Sparkle", "Hyper Cyan",
    ],
  },
  {
    category: "teal",
    baseHue: 165,
    count: 75,
    names: [
      "Teal Green", "Deep Sea Teal", "Sea Foam Teal", "Dark Teal", "Jade Teal", "Soft Teal", "Mystic Teal", "Tropical Teal",
      "Pacific Teal", "Emerald Teal", "Pine Teal", "Spruce Teal", "Peacock Teal", "Tidewater Teal", "Malachite Teal",
      "Oceanic Teal", "Vivid Teal", "Beryl Teal", "Verdigris Teal", "Deep Lagoon Teal", "Teal Shadow", "Teal Bloom",
    ],
  },
  {
    category: "green",
    baseHue: 130,
    count: 90,
    names: [
      "Pale Mint Green", "Bright Mint Green", "Dark Forest Green", "Slate Green", "Mist Green", "Sage Green",
      "Forest Green", "Mint Green", "Lime Green", "Bright Green", "Emerald Green", "Olive Green", "Moss Green",
      "Evergreen", "Botanical Green", "Pine Green", "Fern Green", "Clover Green", "Seaweed Green", "Basil Green",
      "Pistachio Green", "Jade Green", "Shamrock Green", "Viridian Green", "Hunter Green", "Kelly Green",
    ],
  },
  {
    category: "lime",
    baseHue: 85,
    count: 75,
    names: [
      "Lime Spark", "Neon Lime", "Acid Green", "Fresh Lime", "Electric Lime", "Citrus Lime", "Golden Lime",
      "Solar Lime", "Bright Lime", "Chartreuse", "Peridot Lime", "Volt Lime", "Kiwi Lime", "Pear Lime", "Key Lime",
      "Radioactive Lime", "Zesty Lime", "Spring Lime", "Green Apple Lime", "Cyber Lime", "Vivid Lime",
    ],
  },
  {
    category: "yellow",
    baseHue: 48,
    count: 75,
    names: [
      "Sunflower Yellow", "Honey Gold", "Mustard Yellow", "Amber Gold", "Canary Yellow", "Banana Yellow",
      "Sunset Yellow", "Soft Yellow", "Warm Gold", "Saffron Yellow", "Blonde Gold", "Flax Yellow", "Corn Yellow",
      "Dandelion Yellow", "Citron Yellow", "Butter Yellow", "Lemon Drop", "Mallow Yellow", "Goldenrod",
    ],
  },
  {
    category: "orange",
    baseHue: 25,
    count: 75,
    names: [
      "ToolVerse Orange", "Sunset Orange", "Tangerine", "Coral Orange", "Apricot", "Burnt Orange", "Peach Orange",
      "Rust Orange", "Amber Glow Orange", "Terracotta", "Persimmon Orange", "Pumpkin Orange", "Marigold Orange",
      "Ochre Orange", "Cider Orange", "Safety Orange", "Melon Orange", "Tiger Orange", "Yam Orange",
    ],
  },
  {
    category: "analogous",
    baseHue: 15,
    count: 94,
    names: [
      "Warm Sunset Gradient", "Ocean Gradient Harmony", "Berry Harmony", "Spring Bloom Gradient", "Forest Mist Gradient",
      "Neon Glow Gradient", "Twilight Dusk Gradient", "Desert Oasis Gradient", "Aurora Borealis Gradient", "Golden Hour",
      "Coral Reef Gradient", "Solar Flare Gradient", "Cosmic Dust Gradient", "Pastel Dawn Gradient", "Tropical Punch",
    ],
  },
  {
    category: "curated",
    baseHue: 210,
    count: 90,
    isCurated: true,
    names: [
      "Pro Studio Pick", "Nordic Minimal", "Cyberpunk OLED", "Editorial Warmth", "Tokyo Neon Pick", "Silicon Valley",
      "Cyber Mint Pick", "Slate Luxury", "Sunset OLED", "Deep Monochrome", "Vaporwave 84", "Kyoto Garden",
      "Minimal Slate", "Royal Sapphire Pick", "Golden Emerald", "Modern SaaS Pick", "Velvet Obsidian",
    ],
  },
];

// Build Exactly 999 Unique Palettes (No Duplicates)
function build999UniquePalettes(): PaletteDef[] {
  const result: PaletteDef[] = [];
  const usedNames = new Set<string>();

  CATEGORY_DEFINITIONS.forEach((seed) => {
    for (let i = 0; i < seed.count; i++) {
      const rawName = seed.names[i % seed.names.length];
      const cycle = Math.floor(i / seed.names.length);

      let name = rawName;
      if (cycle === 1) name = `Vivid ${rawName}`;
      else if (cycle === 2) name = `Deep ${rawName}`;
      else if (cycle === 3) name = `Light ${rawName}`;
      else if (cycle === 4) name = `Soft ${rawName}`;
      else if (cycle >= 5) name = `Shade ${i + 1} ${rawName}`;

      // Deduplicate name guaranteed
      let finalName = name;
      let dupCounter = 1;
      while (usedNames.has(finalName)) {
        finalName = `${name} #${dupCounter}`;
        dupCounter++;
      }
      usedNames.add(finalName);

      const hueOffset = (i * 4.231 + seed.baseHue) % 360;
      const sat = 55 + ((i * 13) % 40);
      const light = 42 + ((i * 9) % 28);

      const colors = seed.category === "analogous" || seed.category === "curated"
        ? make5Gradient(hueOffset, sat, light, 16)
        : make5Shades(hueOffset, sat, light);

      result.push({
        id: `${seed.category}-${i + 1}`,
        name: finalName,
        category: seed.category,
        colors,
        isCurated: seed.isCurated || i % 6 === 0,
      });
    }
  });

  return result.slice(0, 999);
}

const MASTER_999_PALETTES = build999UniquePalettes();

// Memoized Card Component for 60fps Smooth Rendering
interface CardProps {
  palette: PaletteDef;
  isSaved: boolean;
  onCopyColor: (hex: string, e: React.MouseEvent) => void;
  onCopyPalette: (palette: PaletteDef, e: React.MouseEvent) => void;
  onToggleSave: (id: string, e?: React.MouseEvent) => void;
  copiedHex: string | null;
  copiedPaletteId: string | null;
}

const PaletteCard = memo<CardProps>(({
  palette,
  isSaved,
  onCopyColor,
  onCopyPalette,
  onToggleSave,
  copiedHex,
  copiedPaletteId,
}) => {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col group">
      {/* 5 Stacked Vertical Color Bands Container */}
      <div className="h-52 w-full flex flex-col relative cursor-pointer overflow-hidden">
        {palette.colors.map((hex, idx) => (
          <div
            key={idx}
            onClick={(e) => onCopyColor(hex, e)}
            style={{ backgroundColor: hex }}
            className="flex-1 w-full relative transition-all hover:brightness-105 hover:scale-[1.01] group/band"
          >
            {/* Pure CSS Hover Tooltip */}
            <div className="opacity-0 group-hover/band:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
              <span className="text-[10px] font-mono font-bold bg-black/80 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                {copiedHex === hex ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-300" />
                    <span>{hex}</span>
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Card Footer: Palette Name & Action Buttons */}
      <div className="p-3 flex items-center justify-between border-t border-zinc-100 bg-white">
        <div className="min-w-0 pr-2">
          <h4 className="text-xs font-bold text-zinc-900 truncate">
            {palette.name}
          </h4>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => onCopyPalette(palette, e)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
            title="Copy all 5 hex codes"
          >
            {copiedPaletteId === palette.id ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => onToggleSave(palette.id, e)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            title={isSaved ? "Remove from saved" : "Save palette"}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all ${
                isSaved
                  ? "text-rose-500 fill-rose-500 scale-110"
                  : "text-zinc-300 hover:text-rose-500"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
});

PaletteCard.displayName = "PaletteCard";

export const ColorPalettesTool: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedPaletteId, setCopiedPaletteId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Load saved favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("toolverse_saved_palettes");
      if (stored) setSavedIds(JSON.parse(stored));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toggleSave = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("toolverse_saved_palettes", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  }, []);

  // Category palette counts calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: MASTER_999_PALETTES.length,
      saved: savedIds.length,
    };

    CATEGORIES.forEach((cat) => {
      if (cat.id !== "all" && cat.id !== "saved") {
        if (cat.id === "curated") {
          counts[cat.id] = MASTER_999_PALETTES.filter((p) => p.isCurated).length;
        } else {
          counts[cat.id] = MASTER_999_PALETTES.filter((p) => p.category === cat.id).length;
        }
      }
    });

    return counts;
  }, [savedIds]);

  // Fast Filtered Palettes Memo (All 999 loaded at once)
  const filteredPalettes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return MASTER_999_PALETTES.filter((palette) => {
      // Category Match
      if (selectedCategory === "saved") {
        if (!savedIds.includes(palette.id)) return false;
      } else if (selectedCategory === "curated") {
        if (!palette.isCurated) return false;
      } else if (selectedCategory !== "all") {
        if (palette.category !== selectedCategory) return false;
      }

      // Search Query Match
      if (q) {
        const matchesName = palette.name.toLowerCase().includes(q);
        const matchesColor = palette.colors.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesColor) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, savedIds]);

  // Copy Single Color Hex
  const handleCopyColor = useCallback((hex: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  }, []);

  // Copy Full Palette Hexes
  const handleCopyPalette = useCallback((palette: PaletteDef, e: React.MouseEvent) => {
    e.stopPropagation();
    const formatted = palette.colors.join(", ");
    navigator.clipboard.writeText(formatted);
    setCopiedPaletteId(palette.id);
    setTimeout(() => setCopiedPaletteId(null), 1800);
  }, []);

  return (
    <div className="w-full relative space-y-5">
      {/* Top Header Bar: Title, Search & Saved Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 shadow-2xs">
            <PaletteIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
              <span>Color Palettes</span>
              <span className="text-[11px] font-mono font-bold bg-orange-50 text-orange-600 border border-orange-200/60 px-2 py-0.5 rounded-full">
                999 PALETTES
              </span>
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Browse 999 unique color palettes. Click any shade to copy hex codes instantly.
            </p>
          </div>
        </div>

        {/* Search Bar & Saved Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search 999 palettes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-zinc-50 border-zinc-200 rounded-xl font-medium focus:ring-orange-500/30"
            />
          </div>

          <Button
            size="sm"
            variant={selectedCategory === "saved" ? "default" : "outline"}
            onClick={() => setSelectedCategory(selectedCategory === "saved" ? "all" : "saved")}
            className={`h-9 text-xs font-bold gap-1.5 rounded-xl transition-all cursor-pointer ${
              selectedCategory === "saved"
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-2xs"
                : "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${selectedCategory === "saved" ? "fill-white" : "text-rose-500"}`} />
            <span>Saved ({savedIds.length})</span>
          </Button>
        </div>
      </div>

      {/* Main Workspace Grid: Left Sidebar Categories + Right Palettes Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT SIDEBAR: CATEGORIES LIST */}
        <aside className="lg:col-span-3 bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs space-y-3 lg:sticky lg:top-[80px]">
          <h3 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold px-2">
            Categories
          </h3>

          <nav className="space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {cat.isStar ? (
                      <Star className={`w-3.5 h-3.5 ${isActive ? "text-amber-400 fill-amber-400" : "text-amber-500"}`} />
                    ) : cat.isHeart ? (
                      <Heart className={`w-3.5 h-3.5 ${isActive ? "text-rose-400 fill-rose-400" : "text-rose-500"}`} />
                    ) : (
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.dot}`} />
                    )}
                    <span className="truncate">{cat.label}</span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                    isActive ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* RIGHT PALETTES GALLERY GRID */}
        <main className="lg:col-span-9 space-y-4">
          {/* Section Subheader */}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>
                {selectedCategory === "all"
                  ? "All 999 Palettes"
                  : selectedCategory === "saved"
                  ? "Your Saved Palettes"
                  : `${CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory} Palettes`}
              </span>
              <span className="text-zinc-400 font-normal text-[11px]">
                ({filteredPalettes.length} total)
              </span>
            </h3>
          </div>

          {/* Empty State */}
          {filteredPalettes.length === 0 ? (
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <PaletteIcon className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-zinc-800">No palettes found</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {selectedCategory === "saved"
                  ? "You haven't saved any palettes yet. Click the heart icon on any palette card to save it."
                  : "No palettes matched your filter or search query. Try clearing your search."}
              </p>
              {searchQuery && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold rounded-xl border-zinc-200 mt-2 cursor-pointer"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            /* Palettes Responsive Grid (All 999 loaded at once with memoized Cards) */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPalettes.map((palette) => (
                <PaletteCard
                  key={palette.id}
                  palette={palette}
                  isSaved={savedIds.includes(palette.id)}
                  onCopyColor={handleCopyColor}
                  onCopyPalette={handleCopyPalette}
                  onToggleSave={toggleSave}
                  copiedHex={copiedHex}
                  copiedPaletteId={copiedPaletteId}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
