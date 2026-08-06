export type DocumentFormat = "txt" | "markdown" | "html" | "csv" | "json";

export interface FormatMeta {
  id: DocumentFormat;
  name: string;
  extension: string;
  mimeType: string;
  description: string;
  badgeColor: string;
}

export const FORMAT_DETAILS: Record<DocumentFormat, FormatMeta> = {
  txt: {
    id: "txt",
    name: "Plain Text",
    extension: ".txt",
    mimeType: "text/plain",
    description: "Unformatted plain text document",
    badgeColor: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
  },
  markdown: {
    id: "markdown",
    name: "Markdown",
    extension: ".md",
    mimeType: "text/markdown",
    description: "Lightweight markup language with plain text formatting syntax",
    badgeColor: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  html: {
    id: "html",
    name: "HTML Document",
    extension: ".html",
    mimeType: "text/html",
    description: "HyperText Markup Language structure",
    badgeColor: "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  csv: {
    id: "csv",
    name: "CSV Spreadsheet",
    extension: ".csv",
    mimeType: "text/csv",
    description: "Comma-Separated Values tabular data",
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  json: {
    id: "json",
    name: "JSON Data",
    extension: ".json",
    mimeType: "application/json",
    description: "JavaScript Object Notation structured data",
    badgeColor: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
};

// Map of valid conversion targets for each input format
export const VALID_CONVERSION_MAP: Record<DocumentFormat, DocumentFormat[]> = {
  txt: ["txt", "markdown", "html", "csv", "json"],
  markdown: ["markdown", "txt", "html"],
  html: ["html", "txt", "markdown"],
  csv: ["csv", "txt", "json"],
  json: ["json", "txt", "csv"],
};

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  warning?: string | null;
  line?: number;
  column?: number;
}

export interface DocumentStats {
  characterCount: number;
  lineCount: number;
  wordCount: number;
  byteSize: number;
  formattedSize: string;
}

export interface ConversionOptions {
  sourceFormat: DocumentFormat;
  targetFormat: DocumentFormat;
  inputContent: string;
  csvDelimiter?: string;
  jsonIndent?: number;
  prettyHtml?: boolean;
}

export interface ConversionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs: number;
}
