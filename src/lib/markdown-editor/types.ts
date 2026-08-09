// Markdown Editor Types & Interface Definitions

export interface MarkdownStats {
  words: number;
  chars: number;
  lines: number;
  readingTimeMinutes: number;
}

export interface MarkdownTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
}

export type FormattingAction =
  | "bold"
  | "italic"
  | "strikethrough"
  | "h1"
  | "h2"
  | "h3"
  | "unordered-list"
  | "ordered-list"
  | "task-list"
  | "quote"
  | "code-inline"
  | "code-block"
  | "link"
  | "image"
  | "table"
  | "hr";
