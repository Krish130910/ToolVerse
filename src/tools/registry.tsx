"use client";

import React from "react";
import dynamic from "next/dynamic";

// Standard Utility Implementations
import { SvgIconsLibraryTool } from "@/components/tools/impl/svg-icons-library";
import { ColorPalettesTool } from "@/components/tools/impl/color-palettes";
import { PdfPageNumbererTool } from "@/components/tools/impl/pdf-page-numberer";
import { AiFlowchartGeneratorTool } from "@/components/tools/impl/ai-flowchart-generator";
import { AudioConverterTool } from "@/components/tools/impl/audio-converter";
import { BarcodeGeneratorTool } from "@/components/tools/impl/barcode-generator";
import { DigitalSignatureCreatorTool } from "@/components/tools/impl/digital-signature-creator";
import { DocumentConverterTool } from "@/components/tools/impl/document-converter";
import { FaviconConverterTool } from "@/components/tools/impl/favicon-converter";
import { ImageProcessorTool } from "@/components/tools/impl/image-processor";
import { ImaGrowTool } from "@/components/tools/impl/imagrow";
import { InvoiceGeneratorTool } from "@/components/tools/impl/invoice-generator";
import { JsonFormatterTool } from "@/components/tools/impl/json-formatter";
import { LoremIpsumGeneratorTool } from "@/components/tools/impl/lorem-ipsum-generator";
import { MarkdownEditorTool } from "@/components/tools/impl/markdown-editor";
import { PasswordGeneratorTool } from "@/components/tools/impl/password-generator";
import { PdfCompressorTool } from "@/components/tools/impl/pdf-compressor";
import { PdfMergerTool } from "@/components/tools/impl/pdf-merger";
import { PdfSplitterTool } from "@/components/tools/impl/pdf-splitter";
import { PdfMultiplePagesTool } from "@/components/tools/impl/pdf-multiple-pages";
import { QrGeneratorTool } from "@/components/tools/impl/qr-generator";
import { SvgEditorTool } from "@/components/tools/impl/svg-editor";
import { TextFormatterTool } from "@/components/tools/impl/text-formatter";
import { VideoGifConverterTool } from "@/components/tools/impl/video-gif-converter";
import { Base64EncoderTool } from "@/components/tools/impl/base64-encoder";
import { JwtDecoderTool } from "@/components/tools/impl/jwt-decoder";
import { UrlShortenerTool } from "@/components/tools/impl/url-shortener";
import { OgImageGeneratorTool } from "@/components/tools/impl/og-image-generator";
import { UuidGeneratorTool } from "@/components/tools/impl/uuid-generator";
import { LogExplainerTool } from "@/components/tools/impl/log-explainer";

// Active AI Developer Tools Dynamic Imports
const AICommitMessageGenerator = dynamic(
  () => import("@/components/tools/impl/ai/ai-commit-message-generator").then((mod) => mod.AICommitMessageGenerator),
  { loading: () => <div className="p-8 text-center text-xs font-mono text-zinc-400 animate-pulse">Loading AI Commit Generator...</div> }
);
const AICodeConverter = dynamic(
  () => import("@/components/tools/impl/ai/ai-code-converter").then((mod) => mod.AICodeConverter),
  { loading: () => <div className="p-8 text-center text-xs font-mono text-zinc-400 animate-pulse">Loading AI Code Converter...</div> }
);
const AIReadmeGenerator = dynamic(
  () => import("@/components/tools/impl/ai/ai-readme-generator").then((mod) => mod.AIReadmeGenerator),
  { loading: () => <div className="p-8 text-center text-xs font-mono text-zinc-400 animate-pulse">Loading AI README Generator...</div> }
);
const AIApiDocsGenerator = dynamic(
  () => import("@/components/tools/impl/ai/ai-api-docs-generator").then((mod) => mod.AIApiDocsGenerator),
  { loading: () => <div className="p-8 text-center text-xs font-mono text-zinc-400 animate-pulse">Loading AI API Docs Generator...</div> }
);
const AIEmailGenerator = dynamic(
  () => import("@/components/tools/impl/ai/ai-email-generator").then((mod) => mod.AIEmailGenerator),
  { loading: () => <div className="p-8 text-center text-xs font-mono text-zinc-400 animate-pulse">Loading AI Email Generator...</div> }
);

/**
 * ==============================================================================
 * TOOLVERSE GENERALIZED TOOLS REGISTRY
 * ==============================================================================
 * Maps canonical tool slugs to React components.
 * OpenCode and AI models can easily register new tools by adding a single line entry below.
 */
export const TOOLS_COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  // AI Developer Tools
  "ai-commit-message-generator": AICommitMessageGenerator,
  "ai-code-converter": AICodeConverter,
  "ai-readme-generator": AIReadmeGenerator,
  "ai-api-docs-generator": AIApiDocsGenerator,
  "ai-email-generator": AIEmailGenerator,
  "ai-flowchart-generator": AiFlowchartGeneratorTool,

  // Standard Developer & Web Utilities
  "svg-icons-library": SvgIconsLibraryTool,
  "color-palettes": ColorPalettesTool,
  "color-palette-generator": ColorPalettesTool,
  "pdf-page-numberer": PdfPageNumbererTool,
  "audio-converter": AudioConverterTool,
  "barcode-generator": BarcodeGeneratorTool,
  "digital-signature-creator": DigitalSignatureCreatorTool,
  "document-converter": DocumentConverterTool,
  "favicon-converter": FaviconConverterTool,
  "image-processor": ImageProcessorTool,
  "imagrow": ImaGrowTool,
  "invoice-generator": InvoiceGeneratorTool,
  "json-formatter": JsonFormatterTool,
  "lorem-ipsum-generator": LoremIpsumGeneratorTool,
  "markdown-editor": MarkdownEditorTool,
  "password-generator": PasswordGeneratorTool,
  "pdf-compressor": PdfCompressorTool,
  "pdf-merger": PdfMergerTool,
  "pdf-splitter": PdfSplitterTool,
  "pdf-multiple-pages": PdfMultiplePagesTool,
  "qr-generator": QrGeneratorTool,
  "svg-editor": SvgEditorTool,
  "text-formatter": TextFormatterTool,
  "video-gif-converter": VideoGifConverterTool,
  "base64-encoder": Base64EncoderTool,
  "jwt-decoder": JwtDecoderTool,
  "url-shortener": UrlShortenerTool,
  "og-image-generator": OgImageGeneratorTool,
  "uuid-generator": UuidGeneratorTool,
  "log-explainer": LogExplainerTool,
};

/**
 * Resolves tool component by slug with safe fallback.
 */
export function getToolComponent(slug: string): React.ComponentType<any> {
  const normalizedSlug = slug.toLowerCase().trim();
  return TOOLS_COMPONENT_REGISTRY[normalizedSlug] || JsonFormatterTool;
}

/**
 * Returns all registered tool slugs.
 */
export function getAllRegisteredToolSlugs(): string[] {
  return Object.keys(TOOLS_COMPONENT_REGISTRY);
}

/**
 * Checks if a tool slug is registered.
 */
export function isToolRegistered(slug: string): boolean {
  return Boolean(TOOLS_COMPONENT_REGISTRY[slug.toLowerCase().trim()]);
}
