// SVG Parser, Validation, and Attribute Extraction Utilities

import { ValidationResult, SvgStats } from "./types";

/** Formats byte size into human readable string */
export function formatByteSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Parses SVG XML string using DOMParser and returns validation status */
export function parseAndValidateSvg(svgString: string): ValidationResult {
  const trimmed = svgString.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "SVG code is empty.",
      warning: null,
      elementCount: 0,
      parsedDoc: null,
    };
  }

  if (typeof window === "undefined") {
    return {
      isValid: true,
      error: null,
      warning: null,
      elementCount: 0,
      parsedDoc: null,
    };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "image/svg+xml");

    // Check for XML parser error elements
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      const errorText = parserError.textContent || "XML Syntax Error in SVG code.";
      const cleanError = errorText.split("\n")[0].replace(/Below is a rendering.*/i, "").trim();
      return {
        isValid: false,
        error: cleanError || "Invalid XML markup in SVG code.",
        warning: null,
        elementCount: 0,
        parsedDoc: null,
      };
    }

    const svgElement = doc.querySelector("svg");
    if (!svgElement) {
      return {
        isValid: false,
        error: "Missing root <svg> element tag.",
        warning: null,
        elementCount: 0,
        parsedDoc: null,
      };
    }

    // Count all child elements
    const allElements = doc.querySelectorAll("*");
    const elementCount = allElements.length;

    // Check for script tags or dangerous handlers
    const scripts = doc.querySelectorAll("script");
    let warning: string | null = null;
    if (scripts.length > 0) {
      warning = "SVG contains embedded <script> tags which will be sanitized for safety.";
    }

    return {
      isValid: true,
      error: null,
      warning,
      elementCount,
      parsedDoc: doc,
    };
  } catch (err) {
    return {
      isValid: false,
      error: err instanceof Error ? err.message : "Failed to parse SVG XML.",
      warning: null,
      elementCount: 0,
      parsedDoc: null,
    };
  }
}

/** Extracts SVG dimensions and statistics */
export function extractSvgStats(svgString: string): SvgStats {
  const byteSize = new Blob([svgString]).size;
  const formattedSize = formatByteSize(byteSize);
  const validation = parseAndValidateSvg(svgString);

  if (!validation.isValid || !validation.parsedDoc) {
    return {
      width: "Auto",
      height: "Auto",
      viewBox: "None",
      byteSize,
      formattedSize,
      pathCount: 0,
      nodeCount: 0,
      hasScript: false,
      isValid: false,
    };
  }

  const doc = validation.parsedDoc;
  const svgEl = doc.querySelector("svg");

  const width = svgEl?.getAttribute("width") || "Auto";
  const height = svgEl?.getAttribute("height") || "Auto";
  const viewBox = svgEl?.getAttribute("viewBox") || "None";
  const pathCount = doc.querySelectorAll("path").length;
  const nodeCount = doc.querySelectorAll("*").length;
  const hasScript = doc.querySelectorAll("script").length > 0;

  return {
    width,
    height,
    viewBox,
    byteSize,
    formattedSize,
    pathCount,
    nodeCount,
    hasScript,
    isValid: true,
  };
}
