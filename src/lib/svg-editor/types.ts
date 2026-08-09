// SVG Editor Types & Interface Definitions

export type PreviewBg = "checkerboard" | "light" | "dark" | "transparent";

export interface SvgStats {
  width: string;
  height: string;
  viewBox: string;
  byteSize: number;
  formattedSize: string;
  pathCount: number;
  nodeCount: number;
  hasScript: boolean;
  isValid: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  warning: string | null;
  elementCount: number;
  parsedDoc: Document | null;
}

export interface OptimizationResult {
  code: string;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  reductionPercentage: number;
}

export interface SvgTemplate {
  id: string;
  name: string;
  category: string;
  svg: string;
}
