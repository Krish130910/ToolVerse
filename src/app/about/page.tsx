"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import {
  Wrench,
  ShieldCheck,
  Zap,
  Grid,
  Layers,
  Palette,
  FileText,
  Code2,
  Binary,
  Sparkles,
  QrCode,
  PenTool,
  Image as ImageIcon,
  Sliders,
  Scissors,
  FilePlus,
  Minimize2,
  Braces,
  FileCode,
  Type,
  Music,
  Video,
  Receipt,
  AlignLeft,
  KeyRound,
  Barcode,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lock,
} from "lucide-react";

interface ToolChip {
  name: string;
  slug: string;
  icon: React.ReactNode;
}

interface ToolCategoryGroup {
  name: string;
  emoji: string;
  icon: React.ReactNode;
  tools: ToolChip[];
}

const TOOL_CATEGORIES: ToolCategoryGroup[] = [
  {
    name: "AI Developer Tools",
    emoji: "🤖",
    icon: <Sparkles className="w-4 h-4 text-orange-500" />,
    tools: [
      { name: "AI Regex Generator", slug: "ai-regex-generator", icon: <Sparkles className="w-3.5 h-3.5 text-orange-500" /> },
      { name: "AI Commit Message Generator", slug: "ai-commit-message-generator", icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
      { name: "AI Code Explainer", slug: "ai-code-explainer", icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" /> },
      { name: "AI Bug Finder", slug: "ai-bug-finder", icon: <Sparkles className="w-3.5 h-3.5 text-rose-500" /> },
      { name: "AI Code Converter", slug: "ai-code-converter", icon: <Sparkles className="w-3.5 h-3.5 text-blue-500" /> },
      { name: "AI README Generator", slug: "ai-readme-generator", icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> },
      { name: "AI API Docs Generator", slug: "ai-api-docs-generator", icon: <Sparkles className="w-3.5 h-3.5 text-orange-500" /> },
      { name: "AI Email Generator", slug: "ai-email-generator", icon: <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> },
      { name: "AI Test Case Generator", slug: "ai-test-case-generator", icon: <Sparkles className="w-3.5 h-3.5 text-teal-500" /> },
      { name: "AI SQL Query Generator", slug: "ai-sql-query-generator", icon: <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> },
      { name: "AI JSON Analyzer", slug: "ai-json-analyzer", icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
      { name: "AI CSS Generator", slug: "ai-css-generator", icon: <Sparkles className="w-3.5 h-3.5 text-pink-500" /> },
      { name: "AI Database Schema Designer", slug: "ai-database-schema-designer", icon: <Sparkles className="w-3.5 h-3.5 text-orange-500" /> },
      { name: "AI Code Reviewer", slug: "ai-code-reviewer", icon: <Sparkles className="w-3.5 h-3.5 text-violet-500" /> },
      { name: "AI Dockerfile Generator", slug: "ai-dockerfile-generator", icon: <Sparkles className="w-3.5 h-3.5 text-blue-600" /> },
    ],
  },
  {
    name: "Design & Creative",
    emoji: "🎨",
    icon: <Palette className="w-4 h-4 text-orange-500" />,
    tools: [
      { name: "SVG Icons Library", slug: "svg-icons-library", icon: <Palette className="w-3.5 h-3.5 text-orange-500" /> },
      { name: "Color Palette Generator", slug: "color-palette-generator", icon: <Palette className="w-3.5 h-3.5 text-rose-500" /> },
      { name: "AI Flowchart Generator", slug: "ai-flowchart-generator", icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" /> },
    ],
  },
  {
    name: "Image Tools",
    emoji: "🖼️",
    icon: <ImageIcon className="w-4 h-4 text-rose-500" />,
    tools: [
      { name: "Image Processor", slug: "image-processor", icon: <Sliders className="w-3.5 h-3.5 text-blue-500" /> },
      { name: "ImaGrow", slug: "imagrow", icon: <ImageIcon className="w-3.5 h-3.5 text-amber-500" /> },
      { name: "Favicon Converter", slug: "favicon-converter", icon: <Layers className="w-3.5 h-3.5 text-rose-500" /> },
    ],
  },
  {
    name: "PDF Tools",
    emoji: "📄",
    icon: <FileText className="w-4 h-4 text-indigo-500" />,
    tools: [
      { name: "Add Page Numbers to PDF", slug: "pdf-page-numberer", icon: <FileText className="w-3.5 h-3.5 text-indigo-500" /> },
      { name: "PDF Compressor", slug: "pdf-compressor", icon: <Minimize2 className="w-3.5 h-3.5 text-blue-500" /> },
      { name: "PDF Merger", slug: "pdf-merger", icon: <FilePlus className="w-3.5 h-3.5 text-purple-500" /> },
      { name: "PDF Splitter", slug: "pdf-splitter", icon: <Scissors className="w-3.5 h-3.5 text-rose-500" /> },
      { name: "PDF to Multiple Pages", slug: "pdf-multiple-pages", icon: <Grid className="w-3.5 h-3.5 text-orange-500" /> },
    ],
  },
  {
    name: "Developer Tools",
    emoji: "💻",
    icon: <Code2 className="w-4 h-4 text-sky-500" />,
    tools: [
      { name: "JSON Formatter", slug: "json-formatter", icon: <Braces className="w-3.5 h-3.5 text-sky-500" /> },
      { name: "Markdown Editor", slug: "markdown-editor", icon: <FileCode className="w-3.5 h-3.5 text-violet-500" /> },
      { name: "SVG Editor", slug: "svg-editor", icon: <Code2 className="w-3.5 h-3.5 text-indigo-500" /> },
      { name: "Text Formatter", slug: "text-formatter", icon: <Type className="w-3.5 h-3.5 text-teal-500" /> },
    ],
  },
  {
    name: "Format Converters",
    emoji: "🔄",
    icon: <Binary className="w-4 h-4 text-teal-500" />,
    tools: [
      { name: "Audio Converter", slug: "audio-converter", icon: <Music className="w-3.5 h-3.5 text-teal-500" /> },
      { name: "Document Converter", slug: "document-converter", icon: <Binary className="w-3.5 h-3.5 text-emerald-500" /> },
      { name: "Video to GIF Converter", slug: "video-gif-converter", icon: <Video className="w-3.5 h-3.5 text-fuchsia-500" /> },
    ],
  },
  {
    name: "Generators",
    emoji: "⚡",
    icon: <Zap className="w-4 h-4 text-amber-500" />,
    tools: [
      { name: "Invoice Generator", slug: "invoice-generator", icon: <Receipt className="w-3.5 h-3.5 text-amber-500" /> },
      { name: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", icon: <AlignLeft className="w-3.5 h-3.5 text-emerald-500" /> },
      { name: "Password Generator", slug: "password-generator", icon: <KeyRound className="w-3.5 h-3.5 text-teal-500" /> },
    ],
  },
  {
    name: "QR & Barcode",
    emoji: "🏷️",
    icon: <QrCode className="w-4 h-4 text-orange-500" />,
    tools: [
      { name: "QR Code Generator", slug: "qr-generator", icon: <QrCode className="w-3.5 h-3.5 text-orange-500" /> },
      { name: "Barcode Generator", slug: "barcode-generator", icon: <Barcode className="w-3.5 h-3.5 text-amber-500" /> },
    ],
  },
  {
    name: "Productivity",
    emoji: "🛠️",
    icon: <PenTool className="w-4 h-4 text-cyan-500" />,
    tools: [
      { name: "Digital Signature Creator", slug: "digital-signature-creator", icon: <PenTool className="w-3.5 h-3.5 text-cyan-500" /> },
    ],
  },
  {
    name: "Web Utilities",
    emoji: "🌐",
    icon: <Wrench className="w-4 h-4 text-orange-500" />,
    tools: [
      { name: "URL Shortener", slug: "url-shortener", icon: <Wrench className="w-3.5 h-3.5 text-orange-500" /> },
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-12 relative min-h-screen bg-[#FAF8F5]">
      <Container>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-600 shadow-2xs">
              <Wrench className="w-3.5 h-3.5" />
              <span>About ToolVerse</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Privacy-First Web Utilities
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              ToolVerse provides high-performance, client-side developer and creator utilities without intrusive ads, tracking scripts, or paywalls.
            </p>
          </div>

          {/* Platform Overview Stat Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
              <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-2xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 font-mono">25</h4>
                <p className="text-[11px] font-semibold text-zinc-500">Browser-Based Tools</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
              <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-2xs">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900 font-mono">8</h4>
                <p className="text-[11px] font-semibold text-zinc-500">Categories</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
              <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900">Privacy First</h4>
                <p className="text-[11px] font-semibold text-zinc-500">100% Client-Side</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/50 border border-orange-100">
              <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-2xs">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-zinc-900">Fast & Responsive</h4>
                <p className="text-[11px] font-semibold text-zinc-500">Sub-ms Execution</p>
              </div>
            </div>
          </div>

          {/* Available Tools Grid Section */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  <span>Complete 40 Tools Suite</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Browse and launch any of our 40 utilities organized by domain category.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                40 Tools Live
              </span>
            </div>

            {/* Category Groups */}
            <div className="space-y-6">
              {TOOL_CATEGORIES.map((cat) => (
                <div key={cat.name} className="space-y-2.5">
                  {/* Category Subheader */}
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.emoji}</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-900">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400 font-semibold bg-zinc-100 px-2 py-0.5 rounded-full">
                      {cat.tools.length}
                    </span>
                  </div>

                  {/* Tools Chips Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                    {cat.tools.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/tools/${t.slug}`}
                        className="group flex items-center justify-between p-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200/90 hover:bg-white hover:border-orange-400 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-1">
                          <div className="p-1.5 rounded-lg bg-white border border-zinc-200/80 shadow-2xs group-hover:border-orange-200 transition-colors shrink-0">
                            {t.icon}
                          </div>
                          <span className="text-xs font-bold text-zinc-800 group-hover:text-orange-600 transition-colors truncate">
                            {t.name}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Guarantees 4-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 space-y-2 shadow-xs hover:shadow-md hover:border-orange-300 transition-all">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-zinc-900">100% Client-Side Execution</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All algorithms run directly inside your web browser via WebAssembly and JavaScript. Your passwords, tokens, JSON payloads, and image files never touch external servers.
              </p>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 space-y-2 shadow-xs hover:shadow-md hover:border-orange-300 transition-all">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-zinc-900">Zero Ads & Telemetry Trackers</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                No third-party tracking pixels, ad banners, cookie popups, or paywalls. Pure utility designed for maximum focus.
              </p>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 space-y-2 shadow-xs hover:shadow-md hover:border-orange-300 transition-all">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-zinc-900">Sub-Millisecond Performance</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Engineered with Next.js 16 App Router, React 19, and Tailwind CSS for instant load times and keyboard-first workflows.
              </p>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 space-y-2 shadow-xs hover:shadow-md hover:border-orange-300 transition-all">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-zinc-900">100% Free Forever</h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Built for digital creators, engineers, security researchers, and designers worldwide. Free for personal & commercial use.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
