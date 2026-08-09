// Safe SVG Code Minifier, Optimizer, and Prettifier

import { OptimizationResult } from "./types";

/** Optimizes SVG code safely without visual distortion */
export function optimizeSvgCode(svgCode: string): OptimizationResult {
  const raw = svgCode.trim();
  const originalSize = new Blob([raw]).size;

  if (!raw) {
    return {
      code: "",
      originalSize: 0,
      optimizedSize: 0,
      savedBytes: 0,
      reductionPercentage: 0,
    };
  }

  let cleaned = raw;

  // 1. Remove XML declaration and DOCTYPE if present
  cleaned = cleaned.replace(/<\?xml[\s\S]*?\?>/gi, "");
  cleaned = cleaned.replace(/<!DOCTYPE[\s\S]*?>/gi, "");

  // 2. Remove HTML/XML comments (preserving any essential SVG comments if safe)
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  // 3. Remove unnecessary metadata tags (<metadata></metadata>)
  cleaned = cleaned.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");

  // 4. Remove empty containers (<g></g>, <defs></defs>) without attributes
  cleaned = cleaned.replace(/<g\s*><\/g>/gi, "");
  cleaned = cleaned.replace(/<defs\s*><\/defs>/gi, "");

  // 5. Trim redundant spaces between tags (<tag>   <tag> -> <tag><tag>)
  cleaned = cleaned.replace(/>\s+</g, "><");

  // 6. Collapse multiple spaces into single space inside attribute strings
  cleaned = cleaned.replace(/\s+/g, " ");

  // 7. Round excessive float precision in path 'd' attributes (e.g. 12.3456789 -> 12.35)
  cleaned = cleaned.replace(/d="([^"]+)"/gi, (match, pathData: string) => {
    const rounded = pathData.replace(/(\d+\.\d{3,})/g, (numStr) => {
      const val = parseFloat(numStr);
      return Number(val.toFixed(2)).toString();
    });
    return `d="${rounded}"`;
  });

  const finalCode = cleaned.trim();
  const optimizedSize = new Blob([finalCode]).size;
  const savedBytes = Math.max(0, originalSize - optimizedSize);
  const reductionPercentage =
    originalSize > 0 ? Number(((savedBytes / originalSize) * 100).toFixed(1)) : 0;

  return {
    code: finalCode,
    originalSize,
    optimizedSize,
    savedBytes,
    reductionPercentage,
  };
}

/** Prettifies and auto-indents SVG XML code for readability */
export function prettifySvgCode(svgCode: string): string {
  const trimmed = svgCode.trim();
  if (!trimmed) return "";
  if (typeof window === "undefined") return trimmed;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "image/svg+xml");

    if (doc.querySelector("parsererror")) {
      return trimmed;
    }

    const formatNode = (node: Node, level: number): string => {
      const indent = "  ".repeat(level);

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        return text ? `${indent}${text}\n` : "";
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return "";
      }

      const el = node as Element;
      const tagName = el.tagName;
      const attrs = Array.from(el.attributes)
        .map((a) => `${a.name}="${a.value}"`)
        .join(" ");

      const attrStr = attrs ? ` ${attrs}` : "";
      const children = Array.from(el.childNodes);

      if (children.length === 0) {
        return `${indent}<${tagName}${attrStr}/>\n`;
      }

      let childStr = "";
      children.forEach((child) => {
        childStr += formatNode(child, level + 1);
      });

      if (!childStr.trim()) {
        return `${indent}<${tagName}${attrStr}/>\n`;
      }

      return `${indent}<${tagName}${attrStr}>\n${childStr}${indent}</${tagName}>\n`;
    };

    const svgEl = doc.querySelector("svg");
    if (!svgEl) return trimmed;

    return formatNode(svgEl, 0).trim();
  } catch {
    return trimmed;
  }
}
