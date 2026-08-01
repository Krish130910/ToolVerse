"use client";

import React, { useState, useEffect } from "react";
import { FEATURED_TOOLS } from "@/lib/data";

// Import All 24 Modular Production Tool Implementations
import { SvgIconsLibraryTool } from "@/components/tools/impl/svg-icons-library";
import { ColorPaletteGeneratorTool } from "@/components/tools/impl/color-palette-generator";
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
import { UuidGeneratorTool } from "@/components/tools/impl/uuid-generator";
import { Base64EncoderTool } from "@/components/tools/impl/base64-encoder";
import { JwtDecoderTool } from "@/components/tools/impl/jwt-decoder";

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
      case "svg-icons-library":
        return <SvgIconsLibraryTool />;
      case "color-palette-generator":
        return <ColorPaletteGeneratorTool />;
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
      case "uuid-generator":
        return <UuidGeneratorTool />;
      case "base64-encoder":
        return <Base64EncoderTool />;
      case "jwt-decoder":
        return <JwtDecoderTool />;
      default:
        return <JsonFormatterTool />;
    }
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Scrollable Tool Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-100 no-scrollbar">
        {FEATURED_TOOLS.map((t) => {
          const isActive = activeTab === t.slug;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.slug)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-orange-500 text-white font-bold shadow-2xs"
                  : "bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200/90 hover:border-orange-300"
              }`}
            >
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Tool Implementation */}
      <div className="pt-2">{renderToolComponent()}</div>
    </div>
  );
};
