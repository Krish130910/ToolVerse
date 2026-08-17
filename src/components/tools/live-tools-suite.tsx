"use client";

import React, { useState, useEffect } from "react";
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

interface LiveToolsSuiteProps {
  initialTool?: string;
  onClose?: () => void;
}

export const LiveToolsSuite: React.FC<LiveToolsSuiteProps> = ({
  initialTool = "json-formatter",
}) => {
  const [activeTab, setActiveTab] = useState(initialTool);

  useEffect(() => {
    if (initialTool) {
      setActiveTab(initialTool);
    }
  }, [initialTool]);

  const renderToolComponent = () => {
    switch (activeTab) {
      // Active AI Developer Tools
      case "ai-commit-message-generator":
        return <AICommitMessageGenerator />;
      case "ai-code-converter":
        return <AICodeConverter />;
      case "ai-readme-generator":
        return <AIReadmeGenerator />;
      case "ai-api-docs-generator":
        return <AIApiDocsGenerator />;
      case "ai-email-generator":
        return <AIEmailGenerator />;

      // Standard In-Browser Utilities
      case "svg-icons-library":
        return <SvgIconsLibraryTool />;
      case "color-palettes":
      case "color-palette-generator":
        return <ColorPalettesTool />;
      case "pdf-page-numberer":
        return <PdfPageNumbererTool />;
      case "ai-flowchart-generator":
        return <AiFlowchartGeneratorTool />;
      case "audio-converter":
        return <AudioConverterTool />;
      case "barcode-generator":
        return <BarcodeGeneratorTool />;
      case "digital-signature-creator":
        return <DigitalSignatureCreatorTool />;
      case "document-converter":
        return <DocumentConverterTool />;
      case "favicon-converter":
        return <FaviconConverterTool />;
      case "image-processor":
        return <ImageProcessorTool />;
      case "imagrow":
        return <ImaGrowTool />;
      case "invoice-generator":
        return <InvoiceGeneratorTool />;
      case "json-formatter":
        return <JsonFormatterTool />;
      case "lorem-ipsum-generator":
        return <LoremIpsumGeneratorTool />;
      case "markdown-editor":
        return <MarkdownEditorTool />;
      case "password-generator":
        return <PasswordGeneratorTool />;
      case "pdf-compressor":
        return <PdfCompressorTool />;
      case "pdf-merger":
        return <PdfMergerTool />;
      case "pdf-splitter":
        return <PdfSplitterTool />;
      case "pdf-multiple-pages":
        return <PdfMultiplePagesTool />;
      case "qr-generator":
        return <QrGeneratorTool />;
      case "svg-editor":
        return <SvgEditorTool />;
      case "text-formatter":
        return <TextFormatterTool />;
      case "video-gif-converter":
        return <VideoGifConverterTool />;
      case "base64-encoder":
        return <Base64EncoderTool />;
      case "jwt-decoder":
        return <JwtDecoderTool />;
      case "url-shortener":
        return <UrlShortenerTool />;
      case "og-image-generator":
        return <OgImageGeneratorTool />;
      case "uuid-generator":
        return <UuidGeneratorTool />;
      default:
        return <JsonFormatterTool />;
    }
  };

  return <div className="w-full">{renderToolComponent()}</div>;
};
