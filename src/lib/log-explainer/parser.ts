import { ExtractedInfo, LogAnalysisResult, LogLevel } from "./types";
import { LOG_RULES } from "./rules";

const LOG_LEVEL_REGEX = /\b(FATAL|CRITICAL|ERROR|WARNING|WARN|INFO|DEBUG|TRACE)\b/gi;

const TIMESTAMP_REGEX =
  /\b(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?|\d{2}:\d{2}:\d{2}(?:\.\d+)?)\b/;

const HTTP_STATUS_REGEX = /\b(HTTP\s*\/?\s*1\.[01]\s*)?([45]\d\d)\b/i;

const IP_HOST_PORT_REGEX =
  /\b((?:[0-9]{1,3}\.){3}[0-9]{1,3}|localhost|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?::([0-9]{2,5}))?\b/;

const PORT_ONLY_REGEX = /\b(?:port|port:)\s*([0-9]{2,5})\b/i;

const FILE_PATH_REGEX =
  /(?:\/[a-zA-Z0-9_\-.\/]+|[a-zA-Z]:\\[a-zA-Z0-9_\-\\.]+|\b(?:src|lib|node_modules|app|pages)\/[a-zA-Z0-9_\-./]+)(?::\d+:\d+|\b)/;

const KEYWORDS_REGEX =
  /\b(failed|failure|exception|invalid|rejected|denied|unhandled|crash|timeout|refused|reset|missing|unauthorized|forbidden|not found)\b/gi;

const LEVEL_SEVERITY_WEIGHT: Record<string, number> = {
  FATAL: 5,
  CRITICAL: 5,
  ERROR: 4,
  WARN: 3,
  WARNING: 3,
  INFO: 2,
  DEBUG: 1,
  TRACE: 1,
};

export const parseLogText = (rawText: string): LogAnalysisResult => {
  const text = (rawText || "").trim();
  const lines = text ? text.split("\n") : [];
  const lineCount = lines.length;

  if (!text) {
    return {
      isKnownPattern: false,
      summary: "No log content provided.",
      cause: "Please paste a log text to analyze.",
      checks: ["Paste application or server log text into the input box."],
      extracted: {
        lineCount: 0,
        keywords: [],
      },
      rawText: "",
      formattedCopyText: "",
    };
  }

  // 1. Match against LOG_RULES to find target error pattern line
  let matchedRuleLine: string | undefined;
  let matchedRule = LOG_RULES.find((rule) => {
    for (const line of lines) {
      const isMatch = rule.patterns.some((pattern) => {
        if (typeof pattern === "string") {
          return line.includes(pattern);
        } else if (pattern instanceof RegExp) {
          return pattern.test(line);
        }
        return false;
      });
      if (isMatch) {
        matchedRuleLine = line;
        return true;
      }
    }
    return false;
  });

  // 2. Extract Log Level (prioritize highest severity across log, or line of matched error)
  let logLevel: LogLevel | undefined;
  let maxWeight = 0;

  // First check if target error line has a log level
  if (matchedRuleLine) {
    const errorLineLevelMatch = matchedRuleLine.match(LOG_LEVEL_REGEX);
    if (errorLineLevelMatch) {
      const matchedStr = errorLineLevelMatch[0].toUpperCase();
      const norm = matchedStr === "WARNING" ? "WARN" : matchedStr;
      logLevel = norm as LogLevel;
      maxWeight = LEVEL_SEVERITY_WEIGHT[norm] || 0;
    }
  }

  // If no level on error line or no rule matched, find highest severity across entire text
  if (!logLevel || maxWeight < 4) {
    const allLevelMatches = text.matchAll(LOG_LEVEL_REGEX);
    for (const match of allLevelMatches) {
      const rawLvl = match[0].toUpperCase();
      const norm = rawLvl === "WARNING" ? "WARN" : rawLvl;
      const weight = LEVEL_SEVERITY_WEIGHT[norm] || 0;
      if (weight > maxWeight) {
        maxWeight = weight;
        logLevel = norm as LogLevel;
      }
    }
  }

  // 3. Extract Timestamp (prefer timestamp from matched error line, otherwise first timestamp)
  let timestamp: string | undefined;
  if (matchedRuleLine) {
    const errTsMatch = matchedRuleLine.match(TIMESTAMP_REGEX);
    if (errTsMatch) {
      timestamp = errTsMatch[1];
    }
  }

  if (!timestamp) {
    const tsMatch = text.match(TIMESTAMP_REGEX);
    if (tsMatch) {
      timestamp = tsMatch[1];
    }
  }

  // 4. Extract HTTP Status Code
  let httpStatus: number | undefined;
  const httpMatch = text.match(HTTP_STATUS_REGEX);
  if (httpMatch) {
    const codeNum = parseInt(httpMatch[2], 10);
    if (codeNum >= 400 && codeNum <= 599) {
      httpStatus = codeNum;
    }
  }

  // 5. Extract IP / Host & Port
  let ipOrHost: string | undefined;
  const ipMatch = text.match(IP_HOST_PORT_REGEX);
  let port: number | undefined;

  if (ipMatch) {
    const potentialHost = ipMatch[1];
    if (!/^\d+$/.test(potentialHost)) {
      ipOrHost = potentialHost;
      if (ipMatch[2]) {
        port = parseInt(ipMatch[2], 10);
      }
    }
  }

  if (!port) {
    const portMatch = text.match(PORT_ONLY_REGEX);
    if (portMatch) {
      port = parseInt(portMatch[1], 10);
    }
  }

  // 6. Extract File Path
  let filePath: string | undefined;
  const pathMatch = text.match(FILE_PATH_REGEX);
  if (pathMatch) {
    filePath = pathMatch[0];
  }

  // 7. Extract Keywords
  const foundKeywords = new Set<string>();
  const kwMatches = text.matchAll(KEYWORDS_REGEX);
  for (const m of kwMatches) {
    foundKeywords.add(m[1].toLowerCase());
  }

  const extracted: ExtractedInfo = {
    logLevel,
    errorPattern: matchedRule ? matchedRule.name : undefined,
    timestamp,
    httpStatus,
    ipOrHost,
    port,
    filePath,
    lineCount,
    keywords: Array.from(foundKeywords),
  };

  const isKnownPattern = Boolean(matchedRule);

  const summary = matchedRule
    ? matchedRule.summary
    : "Log detected, but no specific known error pattern was identified.";

  const cause = matchedRule
    ? matchedRule.cause
    : "Review the highlighted section or search the detected error code/message for more details.";

  const checks = matchedRule
    ? matchedRule.checks
    : [
        "Review the detected log level, status code, and keywords",
        "Check surrounding log lines for context before and after the failure",
        "Search the exact error message or exception stack trace",
      ];

  // 8. Build formatted text for clipboard copy
  const copyLines: string[] = [];

  if (logLevel) {
    copyLines.push(`Log Level: ${logLevel}`);
  }

  copyLines.push(`Detected Issue:\n${matchedRule ? matchedRule.name : "Unrecognized Log Pattern"}`);
  copyLines.push(`\nLikely Cause:\n${cause}`);

  if (checks && checks.length > 0) {
    copyLines.push(`\nWhat to Check:\n` + checks.map((c, i) => `${i + 1}. ${c}`).join("\n"));
  }

  if (ipOrHost || port || httpStatus || filePath) {
    copyLines.push(`\nExtracted Details:`);
    if (httpStatus) copyLines.push(`- HTTP Status: ${httpStatus}`);
    if (ipOrHost) copyLines.push(`- Host/IP: ${ipOrHost}`);
    if (port) copyLines.push(`- Port: ${port}`);
    if (filePath) copyLines.push(`- File Path: ${filePath}`);
    if (timestamp) copyLines.push(`- Timestamp: ${timestamp}`);
  }

  const formattedCopyText = copyLines.join("\n");

  return {
    isKnownPattern,
    summary,
    cause,
    checks,
    extracted,
    rawText: text,
    formattedCopyText,
  };
};
