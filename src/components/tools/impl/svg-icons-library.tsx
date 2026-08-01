"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Copy,
  Check,
  Download,
  Star,
  Grid,
  List,
  Sliders,
  Sparkles,
  Code,
  FileCode,
  RefreshCw,
  // Icon collection icons
  Code2,
  Terminal,
  ShieldCheck,
  Zap,
  Heart,
  Palette,
  Binary,
  Layers,
  FileText,
  Braces,
  KeyRound,
  QrCode,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy as CopyIcon,
  Search as SearchIcon,
  Settings,
  Trash2,
  Eye,
  Download as DownloadIcon,
  Folder,
  Image as ImageIcon,
  Mail,
  Phone,
  Globe,
  Share2,
  Cpu,
  Database,
  Cloud,
  Server,
  Wifi,
  Bookmark,
  Clock,
  User,
  Users,
  Compass,
  LayoutGrid,
  Box,
  Sliders as SlidersIcon,
} from "lucide-react";

interface IconDef {
  id: string;
  name: string;
  category: string;
  tags: string[];
  svg: string;
  IconComponent: React.ComponentType<any>;
}

const ICONS_COLLECTION: IconDef[] = [
  { id: "code", name: "Code2", category: "Dev", tags: ["code", "developer", "brackets"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`, IconComponent: Code2 },
  { id: "terminal", name: "Terminal", category: "Dev", tags: ["terminal", "cli", "command"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`, IconComponent: Terminal },
  { id: "shield", name: "ShieldCheck", category: "Security", tags: ["shield", "security", "check", "lock"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 12 14 22 4"/></svg>`, IconComponent: ShieldCheck },
  { id: "zap", name: "Zap", category: "UI", tags: ["fast", "zap", "lightning", "energy"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`, IconComponent: Zap },
  { id: "heart", name: "Heart", category: "UI", tags: ["heart", "like", "favorite"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`, IconComponent: Heart },
  { id: "palette", name: "Palette", category: "Design", tags: ["palette", "color", "design", "art"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.72 1.7-1.65 0-.43-.17-.83-.46-1.14-.3-.3-.46-.71-.46-1.17 0-.92.73-1.67 1.66-1.67h1.9c3.08 0 5.66-2.58 5.66-5.66 0-5.23-4.48-9.71-10-9.71Z"/></svg>`, IconComponent: Palette },
  { id: "binary", name: "Binary", category: "Dev", tags: ["binary", "data", "code"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="6" rx="2"/><rect x="6" y="14" width="4" height="6" rx="2"/><path d="M6 4h4v6H6z"/><path d="M14 14h4v6h-4z"/></svg>`, IconComponent: Binary },
  { id: "layers", name: "Layers", category: "Design", tags: ["layers", "stack", "design"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`, IconComponent: Layers },
  { id: "file", name: "FileText", category: "System", tags: ["file", "text", "document"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`, IconComponent: FileText },
  { id: "braces", name: "Braces", category: "Dev", tags: ["braces", "json", "object"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>`, IconComponent: Braces },
  { id: "key", name: "KeyRound", category: "Security", tags: ["key", "pass", "security"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4L2 18z"/><circle cx="16.5" cy="7.5" r=".5"/></svg>`, IconComponent: KeyRound },
  { id: "qrcode", name: "QrCode", category: "UI", tags: ["qr", "barcode", "scan"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`, IconComponent: QrCode },
  { id: "lock", name: "Lock", category: "Security", tags: ["lock", "auth", "security"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, IconComponent: Lock },
  { id: "globe", name: "Globe", category: "Media", tags: ["globe", "web", "internet"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`, IconComponent: Globe },
  { id: "database", name: "Database", category: "Dev", tags: ["database", "sql", "storage"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`, IconComponent: Database },
  { id: "cpu", name: "Cpu", category: "Dev", tags: ["cpu", "chip", "hardware"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>`, IconComponent: Cpu },
  { id: "cloud", name: "Cloud", category: "Media", tags: ["cloud", "storage", "server"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`, IconComponent: Cloud },
  { id: "wifi", name: "Wifi", category: "Media", tags: ["wifi", "network", "signal"], svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`, IconComponent: Wifi },
];

export const SvgIconsLibraryTool: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [size, setSize] = useState(24);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [color, setColor] = useState("#F97316");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<IconDef>(ICONS_COLLECTION[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["All", "Dev", "Security", "Design", "UI", "Media", "System"];

  const filteredIcons = useMemo(() => {
    return ICONS_COLLECTION.filter((icon) => {
      const matchesCategory = selectedCategory === "All" || icon.category === selectedCategory;
      const matchesSearch =
        icon.name.toLowerCase().includes(search.toLowerCase()) ||
        icon.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const copySvg = () => {
    const customizedSvg = selectedIcon.svg
      .replace('width="24"', `width="${size}"`)
      .replace('height="24"', `height="${size}"`)
      .replace('stroke="currentColor"', `stroke="${color}"`)
      .replace('stroke-width="2"', `stroke-width="${strokeWidth}"`);
    navigator.clipboard.writeText(customizedSvg);
    setCopiedType("svg");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const copyJsx = () => {
    const jsx = `<${selectedIcon.name} size={${size}} color="${color}" strokeWidth={${strokeWidth}} />`;
    navigator.clipboard.writeText(jsx);
    setCopiedType("jsx");
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadSvg = () => {
    const customizedSvg = selectedIcon.svg
      .replace('width="24"', `width="${size}"`)
      .replace('height="24"', `height="${size}"`)
      .replace('stroke="currentColor"', `stroke="${color}"`)
      .replace('stroke-width="2"', `stroke-width="${strokeWidth}"`);
    const blob = new Blob([customizedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedIcon.name.toLowerCase()}.svg`;
    a.click();
  };

  const downloadPng = () => {
    const svgStr = selectedIcon.svg
      .replace('width="24"', `width="${size * 4}"`)
      .replace('height="24"', `height="${size * 4}"`)
      .replace('stroke="currentColor"', `stroke="${color}"`)
      .replace('stroke-width="2"', `stroke-width="${strokeWidth * 2}"`);

    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const URLObj = window.URL || window.webkitURL || window;
    const blobURL = URLObj.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size * 4;
      canvas.height = size * 4;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(image, 0, 0);
        const png = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = png;
        a.download = `${selectedIcon.name.toLowerCase()}.png`;
        a.click();
      }
    };
    image.src = blobURL;
  };

  const SelectedIconComp = selectedIcon.IconComponent;

  return (
    <div className="space-y-6">
      {/* Search & Customization Toolbar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 100+ SVG icons by name or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            />
          </div>

          {/* Controls: Size, Stroke, Color */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-between sm:justify-start">
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-zinc-500 font-semibold">Size:</span>
              <input
                type="range"
                min="16"
                max="64"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-20 accent-orange-500"
              />
              <span className="font-mono text-zinc-700">{size}px</span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-zinc-500 font-semibold">Stroke:</span>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-16 accent-orange-500"
              />
              <span className="font-mono text-zinc-700">{strokeWidth}px</span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-zinc-500 font-semibold">Color:</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-zinc-700">{color}</span>
            </div>
          </div>
        </div>

        {/* Category Filters & View Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white shadow-2xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-white shadow-2xs text-orange-600" : "text-zinc-500"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-white shadow-2xs text-orange-600" : "text-zinc-500"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout: Grid + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Icons Grid / List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Showing {filteredIcons.length} icons</span>
            {favorites.length > 0 && <span>{favorites.length} Starred</span>}
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredIcons.map((icon) => {
                const IconC = icon.IconComponent;
                const isSelected = selectedIcon.id === icon.id;
                const isFav = favorites.includes(icon.id);

                return (
                  <button
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all relative group cursor-pointer ${
                      isSelected
                        ? "bg-orange-50/80 border-orange-400 shadow-xs"
                        : "bg-white border-zinc-200/90 hover:border-orange-300 hover:shadow-xs"
                    }`}
                  >
                    <button
                      onClick={(e) => toggleFavorite(icon.id, e)}
                      className="absolute top-2 right-2 text-zinc-300 hover:text-amber-400"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
                    </button>
                    <div style={{ color }}>
                      <IconC size={size} strokeWidth={strokeWidth} />
                    </div>
                    <span className="text-[11px] font-medium text-zinc-700 truncate w-full text-center">
                      {icon.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredIcons.map((icon) => {
                const IconC = icon.IconComponent;
                const isSelected = selectedIcon.id === icon.id;
                return (
                  <div
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected ? "bg-orange-50 border-orange-400" : "bg-white border-zinc-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ color }}>
                        <IconC size={size} strokeWidth={strokeWidth} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900">{icon.name}</h4>
                        <span className="text-[10px] text-zinc-400">{icon.category} • {icon.tags.join(", ")}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">Select</Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Icon Inspector Panel */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5 h-fit sticky top-20">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>{selectedIcon.name}</span>
            </h3>
            <span className="text-[10px] font-mono bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-md font-bold">
              {selectedIcon.category}
            </span>
          </div>

          {/* Large Live Preview Box */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 flex items-center justify-center shadow-inner">
            <div style={{ color }}>
              <SelectedIconComp size={Math.max(size, 48)} strokeWidth={strokeWidth} />
            </div>
          </div>

          {/* Actions: Copy & Download */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={copySvg} variant="default" className="text-xs font-bold gap-1.5 w-full">
                {copiedType === "svg" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === "svg" ? "Copied!" : "Copy SVG"}</span>
              </Button>
              <Button onClick={copyJsx} variant="outline" className="text-xs font-bold gap-1.5 w-full">
                {copiedType === "jsx" ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
                <span>{copiedType === "jsx" ? "Copied!" : "Copy JSX"}</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadSvg} variant="secondary" className="text-xs font-semibold gap-1.5 w-full">
                <Download className="w-3.5 h-3.5" />
                <span>SVG File</span>
              </Button>
              <Button onClick={downloadPng} variant="secondary" className="text-xs font-semibold gap-1.5 w-full">
                <Download className="w-3.5 h-3.5" />
                <span>PNG Image</span>
              </Button>
            </div>
          </div>

          {/* Raw Code Snippet Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600">SVG Code:</label>
            <pre className="p-3 bg-zinc-900 text-zinc-100 rounded-xl text-[10px] font-mono overflow-x-auto max-h-32 no-scrollbar">
              {selectedIcon.svg
                .replace('width="24"', `width="${size}"`)
                .replace('height="24"', `height="${size}"`)
                .replace('stroke="currentColor"', `stroke="${color}"`)
                .replace('stroke-width="2"', `stroke-width="${strokeWidth}"`)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
