import { DocumentFormat, ValidationResult } from "./types";

/**
 * Validate JSON string syntax with exact line and column diagnostic details
 */
export function validateJSON(input: string): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: true, error: null };
  }

  try {
    JSON.parse(input);
    return { isValid: true, error: null };
  } catch (err: any) {
    const message = err?.message || "Invalid JSON syntax";
    let line = 1;
    let column = 1;

    // Extract position from error message if available (e.g. "at position 42" or "line 2 column 5")
    const posMatch = message.match(/at position (\d+)/i) || message.match(/position (\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = input.slice(0, pos).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    } else {
      const lineColMatch = message.match(/line (\d+) column (\d+)/i);
      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      }
    }

    return {
      isValid: false,
      error: `Malformed JSON at Line ${line}, Col ${column}: ${message}`,
      line,
      column,
    };
  }
}

/**
 * Validate CSV string syntax (quote balancing, row column consistency)
 */
export function validateCSV(input: string): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: true, error: null };
  }

  const lines = input.split(/\r?\n/);
  let inQuotes = false;
  let expectedCols = -1;
  let currentCols = 1;
  let lineNum = 1;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote ("")
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentCols++;
    } else if (char === '\n' && !inQuotes) {
      if (expectedCols === -1) {
        expectedCols = currentCols;
      } else if (currentCols !== expectedCols && lines[lineNum - 1].trim().length > 0) {
        return {
          isValid: false,
          error: `Malformed CSV at Line ${lineNum}: Inconsistent column count (${currentCols} columns, expected ${expectedCols}). Check for unquoted commas or missing fields.`,
          line: lineNum,
        };
      }
      currentCols = 1;
      lineNum++;
    }
  }

  if (inQuotes) {
    return {
      isValid: false,
      error: `Malformed CSV: Unclosed quotation mark found near line ${lineNum}. All quoted strings must have closing quotes.`,
      line: lineNum,
    };
  }

  if (expectedCols !== -1 && currentCols !== expectedCols && lines[lineNum - 1]?.trim().length > 0) {
    return {
      isValid: false,
      error: `Malformed CSV at Line ${lineNum}: Inconsistent column count (${currentCols} columns, expected ${expectedCols}).`,
      line: lineNum,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validate HTML string syntax (detect broken tags, unclosed tags, malformed syntax)
 */
export function validateHTML(input: string): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: true, error: null };
  }

  // Check for basic unclosed tag syntax like '<div' without closing '>'
  const unclosedBracketRegex = /<[a-zA-Z0-9_-]+(?:\s+[^>]*?)?(?:$|\n(?![^<]*>))/;
  if (unclosedBracketRegex.test(trimmed)) {
    const lines = trimmed.split("\n");
    for (let l = 0; l < lines.length; l++) {
      if (/<[a-zA-Z0-9_-]+[^>]*$/.test(lines[l]) && !lines[l].includes(">")) {
        return {
          isValid: false,
          error: `Broken HTML at Line ${l + 1}: Unclosed tag bracket '<' without matching '>'.`,
          line: l + 1,
        };
      }
    }
  }

  // In browser environment, use DOMParser or XMLSerializer check
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/html");
      const parserErrors = doc.querySelectorAll("parsererror");
      if (parserErrors.length > 0) {
        return {
          isValid: false,
          error: `Broken HTML: ${parserErrors[0].textContent || "HTML Parsing Error"}`,
        };
      }
    } catch {
      // Fallback
    }
  }

  return { isValid: true, error: null };
}

/**
 * Validate UTF-8 String encoding integrity
 */
export function validateUTF8(input: string): ValidationResult {
  if (input.includes("\uFFFD")) {
    return {
      isValid: false,
      error: "Invalid UTF-8 Encoding: Document contains replacement characters (\\uFFFD). File may be corrupted or use unsupported character encoding.",
    };
  }

  // Check for unpaired surrogate pairs
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const nextCode = input.charCodeAt(i + 1);
      if (isNaN(nextCode) || nextCode < 0xdc00 || nextCode > 0xdfff) {
        return {
          isValid: false,
          error: `Invalid UTF-8 Encoding: High surrogate without matching low surrogate at index ${i}.`,
        };
      }
      i++; // Skip matched low surrogate
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return {
        isValid: false,
        error: `Invalid UTF-8 Encoding: Unmatched low surrogate character at index ${i}.`,
      };
    }
  }

  return { isValid: true, error: null };
}

/**
 * Master Format Validator dispatcher
 */
export function validateDocument(format: DocumentFormat, content: string): ValidationResult {
  if (!content.trim()) {
    return { isValid: true, error: null };
  }

  // First check UTF-8 integrity
  const utf8Result = validateUTF8(content);
  if (!utf8Result.isValid) {
    return utf8Result;
  }

  switch (format) {
    case "json":
      return validateJSON(content);
    case "csv":
      return validateCSV(content);
    case "html":
      return validateHTML(content);
    case "markdown":
    case "txt":
    default:
      return { isValid: true, error: null };
  }
}

/**
 * Automatically detect format from content snippet or file extension
 */
export function detectFormatFromContent(content: string, fileName?: string): DocumentFormat {
  if (fileName) {
    const ext = fileName.toLowerCase().slice(fileName.lastIndexOf("."));
    if (ext === ".json") return "json";
    if (ext === ".csv") return "csv";
    if (ext === ".html" || ext === ".htm") return "html";
    if (ext === ".md" || ext === ".markdown") return "markdown";
    if (ext === ".txt") return "txt";
  }

  const trimmed = content.trim();
  if (!trimmed) return "txt";

  // Check JSON
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
      // Not JSON
    }
  }

  // Check HTML
  if (/<[a-z][\s\S]*>/i.test(trimmed) && (trimmed.includes("<!DOCTYPE") || trimmed.includes("<html") || trimmed.includes("</") || trimmed.includes("<p>") || trimmed.includes("<h1>"))) {
    return "html";
  }

  // Check CSV (has header row with commas, multiple lines with matching comma counts)
  const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length > 1) {
    const firstLineCommas = (lines[0].match(/,/g) || []).length;
    const secondLineCommas = (lines[1].match(/,/g) || []).length;
    if (firstLineCommas > 0 && firstLineCommas === secondLineCommas) {
      return "csv";
    }
  }

  // Check Markdown (headers #, bold **, list bullets -, links [], code blocks ```)
  if (/^#+\s+|\*\*[\s\S]+\*\*|```[\s\S]*```|^\s*[-*+]\s+|^>|\[.+\]\(.+\)/m.test(trimmed)) {
    return "markdown";
  }

  return "txt";
}
