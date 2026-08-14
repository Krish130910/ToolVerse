"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  ImageIcon,
  Sliders,
  Upload,
  Trash2,
  Palette,
  Sparkles,
  Eye,
  Check,
} from "lucide-react";

interface ThemePreset {
  id: string;
  label: string;
  bg1: string;
  bg2: string;
  text: string;
  subtitleText: string;
  badgeBg: string;
  badgeText: string;
  glowColor?: string;
  isLight?: boolean;
}

const THEMES: ThemePreset[] = [
  {
    id: "orange",
    label: "ToolVerse Orange",
    bg1: "#FFF7ED", // Light Warm Orange (orange-50)
    bg2: "#FFEDD5", // Soft Light Orange (orange-100)
    text: "#18181B", // Dark Zinc text
    subtitleText: "#52525B", // Dark Zinc subtitle
    badgeBg: "#F97316", // ToolVerse Orange badge
    badgeText: "#FFFFFF",
    glowColor: "rgba(249, 115, 22, 0.15)",
    isLight: true,
  },
  {
    id: "dark",
    label: "Dark Slate",
    bg1: "#18181B",
    bg2: "#09090B",
    text: "#FAFAFA",
    subtitleText: "#A1A1AA",
    badgeBg: "#EA580C",
    badgeText: "#FFFFFF",
  },
  {
    id: "cyber",
    label: "Emerald Cyber",
    bg1: "#064E3B",
    bg2: "#022C22",
    text: "#ECFDF5",
    subtitleText: "#A7F3D0",
    badgeBg: "#10B981",
    badgeText: "#064E3B",
  },
  {
    id: "sapphire",
    label: "Sapphire Blue",
    bg1: "#1E3A8A",
    bg2: "#172554",
    text: "#EFF6FF",
    subtitleText: "#BFDBFE",
    badgeBg: "#3B82F6",
    badgeText: "#FFFFFF",
  },
  {
    id: "violet",
    label: "Royal Violet",
    bg1: "#581C87",
    bg2: "#3B0764",
    text: "#FAF5FF",
    subtitleText: "#E9D5FF",
    badgeBg: "#A855F7",
    badgeText: "#FFFFFF",
  },
  {
    id: "light",
    label: "Minimal Light",
    bg1: "#FFFFFF",
    bg2: "#F4F4F5",
    text: "#18181B",
    subtitleText: "#52525B",
    badgeBg: "#EA580C",
    badgeText: "#FFFFFF",
    isLight: true,
  },
];

type BgStyle = "solid" | "gradient" | "grid";
type LayoutMode = "classic" | "centered" | "split";

export const OgImageGeneratorTool: React.FC = () => {
  // Content Inputs
  const [title, setTitle] = useState("Build Modern Web Apps Faster with ToolVerse");
  const [subtitle, setSubtitle] = useState("Explore 30+ browser-first client-side developer utilities.");
  const [categoryTag, setCategoryTag] = useState("DEVELOPER UTILITIES");
  const [authorName, setAuthorName] = useState("Krish Savaliya");

  // Component Visibility Toggles
  const [showBadge, setShowBadge] = useState<boolean>(true);
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const [showSubtitle, setShowSubtitle] = useState<boolean>(true);
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [showGraphic, setShowGraphic] = useState<boolean>(true);

  // Style Options
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(THEMES[0]);
  const [bgStyle, setBgStyle] = useState<BgStyle>("gradient");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("classic");

  // Logo / Image Upload
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [logoSize, setLogoSize] = useState<number>(80);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle Logo Upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setLogoImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Render OG Image Canvas (1200x630)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    const isThemeLight = selectedTheme.isLight || selectedTheme.id === "light" || selectedTheme.id === "orange";

    // 1. Draw Background (Solid, Gradient, or Grid)
    if (bgStyle === "solid") {
      ctx.fillStyle = selectedTheme.bg1;
      ctx.fillRect(0, 0, width, height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, selectedTheme.bg1);
      grad.addColorStop(1, selectedTheme.bg2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Soft ambient glow overlay
    if (selectedTheme.glowColor) {
      const radial = ctx.createRadialGradient(250, 150, 20, 250, 150, 650);
      radial.addColorStop(0, selectedTheme.glowColor);
      radial.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);
    }

    // Grid Pattern Overlay
    if (bgStyle === "grid") {
      ctx.strokeStyle = isThemeLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 48) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Outer Frame Border
    ctx.strokeStyle = isThemeLight ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.12)";
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // 2. Render Components Based on Toggles & Layout Mode
    ctx.textBaseline = "top";

    if (layoutMode === "centered") {
      ctx.textAlign = "center";

      // Category Badge
      let badgeBottomY = 70;
      if (showBadge && categoryTag.trim()) {
        const badgeText = categoryTag.trim().toUpperCase();
        ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
        const badgeWidth = ctx.measureText(badgeText).width + 36;
        const badgeHeight = 40;
        const badgeX = (width - badgeWidth) / 2;
        const badgeY = 70;

        ctx.fillStyle = selectedTheme.badgeBg;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 20);
        ctx.fill();

        ctx.fillStyle = selectedTheme.badgeText;
        ctx.fillText(badgeText, width / 2, badgeY + 11);
        badgeBottomY = badgeY + badgeHeight + 30;
      }

      // Uploaded Logo (if present)
      let titleStartY = (showBadge && categoryTag.trim()) ? badgeBottomY : 110;
      if (logoImage) {
        const lSize = logoSize;
        const logoX = (width - lSize) / 2;
        const logoY = (showBadge && categoryTag.trim()) ? 125 : 80;
        ctx.drawImage(logoImage, logoX, logoY, lSize, lSize);
        titleStartY = logoY + lSize + 25;
      }

      // Title
      let curY = titleStartY;
      if (showTitle && title.trim()) {
        ctx.fillStyle = selectedTheme.text;
        ctx.font = "bold 52px system-ui, -apple-system, sans-serif";
        const words = title.trim().split(" ");
        let line = "";
        const maxWidth = 1000;
        const lineHeight = 64;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), width / 2, curY);
            line = words[n] + " ";
            curY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), width / 2, curY);
        curY += 55;
      }

      // Subtitle
      if (showSubtitle && subtitle.trim()) {
        ctx.fillStyle = selectedTheme.subtitleText;
        ctx.font = "normal 24px system-ui, -apple-system, sans-serif";
        ctx.fillText(subtitle.trim(), width / 2, curY);
      }

      // Footer
      if (showFooter) {
        const footerText = authorName.trim() ? `ToolVerse  •  ${authorName.trim()}` : "ToolVerse";
        ctx.fillStyle = isThemeLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";
        ctx.fillRect(200, 520, width - 400, 2);

        ctx.fillStyle = selectedTheme.text;
        ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
        ctx.fillText(footerText, width / 2, 555);
      }

    } else if (layoutMode === "split") {
      ctx.textAlign = "left";

      // Badge
      let titleStartY = 90;
      if (showBadge && categoryTag.trim()) {
        const badgeText = categoryTag.trim().toUpperCase();
        ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
        const badgeWidth = ctx.measureText(badgeText).width + 36;
        const badgeHeight = 40;
        const badgeX = 80;
        const badgeY = 80;

        ctx.fillStyle = selectedTheme.badgeBg;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 20);
        ctx.fill();

        ctx.fillStyle = selectedTheme.badgeText;
        ctx.fillText(badgeText, badgeX + 18, badgeY + 11);
        titleStartY = 150;
      }

      // Title
      let curY = titleStartY;
      if (showTitle && title.trim()) {
        ctx.fillStyle = selectedTheme.text;
        ctx.font = "bold 48px system-ui, -apple-system, sans-serif";
        const words = title.trim().split(" ");
        let line = "";
        const maxWidth = 640;
        const lineHeight = 60;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), 80, curY);
            line = words[n] + " ";
            curY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), 80, curY);
        curY += 50;
      }

      // Subtitle
      if (showSubtitle && subtitle.trim()) {
        ctx.fillStyle = selectedTheme.subtitleText;
        ctx.font = "normal 22px system-ui, -apple-system, sans-serif";
        ctx.fillText(subtitle.trim(), 80, curY);
      }

      // Footer
      if (showFooter) {
        const footerText = authorName.trim() ? `ToolVerse  •  ${authorName.trim()}` : "ToolVerse";
        ctx.fillStyle = isThemeLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";
        ctx.fillRect(80, 520, 640, 2);

        ctx.fillStyle = selectedTheme.text;
        ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
        ctx.fillText(footerText, 80, 555);
      }

      // Right Column (Logo / Visual Graphic)
      const rightCenterX = 960;
      const rightCenterY = 315;

      if (logoImage) {
        const lSize = Math.min(logoSize * 2.2, 280);
        ctx.drawImage(logoImage, rightCenterX - lSize / 2, rightCenterY - lSize / 2, lSize, lSize);
      } else if (showGraphic) {
        // Decorative Brand Container when no logo uploaded
        ctx.fillStyle = isThemeLight ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.roundRect(rightCenterX - 110, rightCenterY - 110, 220, 220, 36);
        ctx.fill();
        ctx.strokeStyle = isThemeLight ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.15)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = isThemeLight ? "#F97316" : selectedTheme.text;
        ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TV", rightCenterX, rightCenterY - 22);
      }

    } else {
      // Classic Layout (Default)
      ctx.textAlign = "left";

      // Logo top right if present
      if (logoImage) {
        const lSize = logoSize;
        ctx.drawImage(logoImage, 1120 - lSize, 70, lSize, lSize);
      }

      // Badge top left
      let titleStartY = 90;
      if (showBadge && categoryTag.trim()) {
        const badgeText = categoryTag.trim().toUpperCase();
        ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
        const badgeWidth = ctx.measureText(badgeText).width + 36;
        const badgeHeight = 40;
        const badgeX = 80;
        const badgeY = 80;

        ctx.fillStyle = selectedTheme.badgeBg;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 20);
        ctx.fill();

        ctx.fillStyle = selectedTheme.badgeText;
        ctx.fillText(badgeText, badgeX + 18, badgeY + 11);
        titleStartY = 160;
      }

      // Title
      let curY = titleStartY;
      if (showTitle && title.trim()) {
        ctx.fillStyle = selectedTheme.text;
        ctx.font = "bold 52px system-ui, -apple-system, sans-serif";
        const words = title.trim().split(" ");
        let line = "";
        const maxWidth = logoImage ? 920 : 1040;
        const lineHeight = 64;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line.trim(), 80, curY);
            line = words[n] + " ";
            curY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), 80, curY);
        curY += 55;
      }

      // Subtitle
      if (showSubtitle && subtitle.trim()) {
        ctx.fillStyle = selectedTheme.subtitleText;
        ctx.font = "normal 24px system-ui, -apple-system, sans-serif";
        ctx.fillText(subtitle.trim(), 80, curY);
      }

      // Footer
      if (showFooter) {
        const footerText = authorName.trim() ? `ToolVerse  •  ${authorName.trim()}` : "ToolVerse";
        ctx.fillStyle = isThemeLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";
        ctx.fillRect(80, 520, width - 160, 2);

        ctx.fillStyle = selectedTheme.text;
        ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
        ctx.fillText(footerText, 80, 555);
      }
    }

  }, [
    title,
    subtitle,
    categoryTag,
    authorName,
    showBadge,
    showTitle,
    showSubtitle,
    showFooter,
    showGraphic,
    selectedTheme,
    bgStyle,
    layoutMode,
    logoImage,
    logoSize,
  ]);

  // Export handlers
  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `og-image-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadWebp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `og-image-${Date.now()}.webp`;
    link.href = canvas.toDataURL("image/webp");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Controls Left */}
      <div className="lg:col-span-6 bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-500" />
            <span>OG Image Card Customizer</span>
          </h3>
        </div>

        {/* Component Visibility Toggles */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            <span>Card Components (Add / Remove)</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowBadge(!showBadge)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showBadge
                  ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                  : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {showBadge && <Check className="w-3.5 h-3.5" />}
              <span>Category Badge</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTitle(!showTitle)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showTitle
                  ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                  : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {showTitle && <Check className="w-3.5 h-3.5" />}
              <span>Title</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSubtitle(!showSubtitle)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showSubtitle
                  ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                  : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {showSubtitle && <Check className="w-3.5 h-3.5" />}
              <span>Subtitle</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFooter(!showFooter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showFooter
                  ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                  : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
              }`}
            >
              {showFooter && <Check className="w-3.5 h-3.5" />}
              <span>Brand Footer</span>
            </button>

            {layoutMode === "split" && !logoImage && (
              <button
                type="button"
                onClick={() => setShowGraphic(!showGraphic)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  showGraphic
                    ? "bg-orange-500 text-white border-orange-500 shadow-2xs"
                    : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                {showGraphic && <Check className="w-3.5 h-3.5" />}
                <span>Graphic Box</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Content Inputs */}
        <div className="space-y-3.5 pt-2 border-t border-zinc-100">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Card Content</span>
          </h4>

          {showTitle && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Card Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Main social card title..."
                className="bg-zinc-50 border-zinc-200 text-xs h-10 rounded-xl"
              />
            </div>
          )}

          {showSubtitle && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Subtitle / Tagline</label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Short description..."
                className="bg-zinc-50 border-zinc-200 text-xs h-10 rounded-xl"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {showBadge && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Category Tag</label>
                <Input
                  value={categoryTag}
                  onChange={(e) => setCategoryTag(e.target.value)}
                  placeholder="e.g. DEVELOPER UTILITIES"
                  className="bg-zinc-50 border-zinc-200 text-xs h-10 rounded-xl"
                />
              </div>
            )}

            {showFooter && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Author / Brand</label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Krish Savaliya"
                  className="bg-zinc-50 border-zinc-200 text-xs h-10 rounded-xl"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Style & Layout Options */}
        <div className="space-y-3.5 pt-2 border-t border-zinc-100">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-orange-500" />
            <span>Theme & Style</span>
          </h4>

          {/* Theme Preset Grid */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Theme Preset</label>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedTheme.id === theme.id
                      ? "border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20 shadow-2xs"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Style Options */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-zinc-700">Background Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(["solid", "gradient", "grid"] as BgStyle[]).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setBgStyle(style)}
                  className={`p-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                    bgStyle === style
                      ? "border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Presets */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-zinc-700">Layout Composition</label>
            <div className="grid grid-cols-3 gap-2">
              {(["classic", "centered", "split"] as LayoutMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLayoutMode(mode)}
                  className={`p-2 rounded-xl text-xs font-bold capitalize border transition-all cursor-pointer ${
                    layoutMode === mode
                      ? "border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Optional Logo Upload */}
        <div className="space-y-3.5 pt-2 border-t border-zinc-100">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-orange-500" />
            <span>Brand Logo (Optional)</span>
          </h4>

          {logoImage ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-3">
                <img
                  src={logoImage.src}
                  alt="Uploaded Logo"
                  className="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-zinc-200"
                />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-800">Logo Uploaded</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-medium">Size:</span>
                    <input
                      type="range"
                      min="50"
                      max="140"
                      value={logoSize}
                      onChange={(e) => setLogoSize(Number(e.target.value))}
                      className="w-24 accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={removeLogo}
                className="text-xs text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50 h-8 px-2.5 rounded-xl gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </Button>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="og-logo-upload"
              />
              <label
                htmlFor="og-logo-upload"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-zinc-300 hover:border-orange-400 bg-zinc-50 hover:bg-orange-50/50 text-xs font-bold text-zinc-600 hover:text-orange-600 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-orange-500" />
                <span>Upload Brand Logo / Icon</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview & Export Right (Sticky on Desktop) */}
      <div className="lg:col-span-6 lg:sticky lg:top-[72px] bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-orange-500" />
            <span>1200×630 Social Card Preview</span>
          </h3>
        </div>

        {/* Live Canvas Box */}
        <div className="bg-zinc-100 rounded-2xl p-2 border border-zinc-200 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-xl shadow-md border border-zinc-200 bg-white"
          />
        </div>

        {/* Download Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Button
            onClick={handleDownloadPng}
            className="w-full h-11 text-xs font-bold gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </Button>

          <Button
            onClick={handleDownloadWebp}
            variant="outline"
            className="w-full h-11 text-xs font-bold gap-2 border-zinc-200 hover:bg-zinc-50 text-zinc-800 rounded-xl cursor-pointer"
          >
            <Download className="w-4 h-4 text-zinc-500" />
            <span>Download WebP</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
