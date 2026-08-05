export type LoremTheme = "classic" | "developer" | "startup" | "ai" | "english";

export type LoremMode = "words" | "sentences" | "paragraphs" | "list_unordered" | "list_ordered";

export type OutputFormat = "text" | "html" | "markdown";

export interface LoremOptions {
  theme: LoremTheme;
  mode: LoremMode;
  count: number;
  format: OutputFormat;
  startWithLorem: boolean;
  randomStart: boolean;
  seed: number | null;
  addHeadings: boolean;
  includeFormatting: boolean;
}

export interface LoremStats {
  wordCount: number;
  charCountWithSpaces: number;
  charCountWithoutSpaces: number;
  paragraphCount: number;
  lineCount: number;
  readingTime: string;
}
