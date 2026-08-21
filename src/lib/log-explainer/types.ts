export type LogLevel =
  | "ERROR"
  | "WARN"
  | "WARNING"
  | "INFO"
  | "DEBUG"
  | "TRACE"
  | "FATAL"
  | "CRITICAL";

export interface LogRule {
  id: string;
  name: string;
  patterns: (string | RegExp)[];
  summary: string;
  cause: string;
  checks: string[];
}

export interface ExtractedInfo {
  logLevel?: LogLevel;
  errorPattern?: string;
  timestamp?: string;
  httpStatus?: number;
  ipOrHost?: string;
  port?: number;
  filePath?: string;
  lineCount: number;
  keywords: string[];
}

export interface LogAnalysisResult {
  isKnownPattern: boolean;
  summary: string;
  cause: string;
  checks: string[];
  extracted: ExtractedInfo;
  rawText: string;
  formattedCopyText: string;
}
