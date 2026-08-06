import { ConversionOptions, DocumentFormat, VALID_CONVERSION_MAP } from "./types";
import { validateDocument } from "./validators";

/**
 * Main conversion entry point that routes to specific conversion pipelines
 */
export function convertDocument(options: ConversionOptions): string {
  const { sourceFormat, targetFormat, inputContent } = options;

  if (!inputContent.trim()) {
    return "";
  }

  // Validate that conversion pair is supported
  const allowedTargets = VALID_CONVERSION_MAP[sourceFormat];
  if (!allowedTargets || !allowedTargets.includes(targetFormat)) {
    throw new Error(
      `Unsupported conversion pair: ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}. Supported conversion pairs are TXT ↔ Markdown, Markdown ↔ HTML, CSV ↔ JSON, TXT ↔ HTML, TXT ↔ JSON, TXT ↔ CSV.`
    );
  }

  // Validate source format input
  const valResult = validateDocument(sourceFormat, inputContent);
  if (!valResult.isValid) {
    throw new Error(valResult.error || `Malformed ${sourceFormat.toUpperCase()} input document`);
  }

  // If same format, pass through (beautify if json)
  if (sourceFormat === targetFormat) {
    if (sourceFormat === "json") {
      try {
        const parsed = JSON.parse(inputContent);
        return JSON.stringify(parsed, null, options.jsonIndent ?? 2);
      } catch {
        return inputContent;
      }
    }
    return inputContent;
  }

  // Route to converter pair
  switch (`${sourceFormat}->${targetFormat}`) {
    // TXT Conversions
    case "txt->markdown":
      return txtToMarkdown(inputContent);
    case "markdown->txt":
      return markdownToTxt(inputContent);

    case "txt->html":
      return txtToHtml(inputContent);
    case "html->txt":
      return htmlToTxt(inputContent);

    case "txt->json":
      return txtToJson(inputContent, options.jsonIndent ?? 2);
    case "json->txt":
      return jsonToTxt(inputContent);

    case "txt->csv":
      return txtToCsv(inputContent);
    case "csv->txt":
      return csvToTxt(inputContent);

    // Markdown Conversions
    case "markdown->html":
      return markdownToHtml(inputContent);
    case "html->markdown":
      return htmlToMarkdown(inputContent);

    // CSV / JSON Conversions
    case "csv->json":
      return csvToJson(inputContent, options.jsonIndent ?? 2);
    case "json->csv":
      return jsonToCsv(inputContent, options.csvDelimiter ?? ",");

    default:
      throw new Error(`Unsupported conversion pipeline: ${sourceFormat} to ${targetFormat}`);
  }
}

// ------------------------------------------------------------------
// 1. TXT ↔ Markdown
// ------------------------------------------------------------------

export function txtToMarkdown(txt: string): string {
  const lines = txt.split("\n");
  const result: string[] = [];

  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      result.push("");
      inList = false;
      continue;
    }

    // Header detection (e.g. underline "===" or "---" under line)
    const nextLine = lines[i + 1]?.trim();
    if (nextLine && /^=+$|^---+$|^---+$/.test(nextLine)) {
      result.push(`# ${line}`);
      i++; // Skip underline line
      continue;
    }

    // Check if line looks like bullet item
    if (/^[-*•]\s+/.test(line)) {
      result.push(line.replace(/^•\s+/, "- "));
      inList = true;
      continue;
    }

    // Check if line looks like numbered item
    if (/^\d+[\.\)]\s+/.test(line)) {
      result.push(line.replace(/^(\d+)[\.\)]\s+/, "$1. "));
      inList = true;
      continue;
    }

    // First non-empty line as main header if capital & short
    if (result.length === 0 && line.length < 60 && !line.includes(".")) {
      result.push(`# ${line}`);
      continue;
    }

    result.push(line);
  }

  return result.join("\n");
}

export function markdownToTxt(md: string): string {
  let txt = md;
  // Code blocks
  txt = txt.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/, "");
  });

  // Inline code
  txt = txt.replace(/`([^`]+)`/g, "$1");

  // Headers
  txt = txt.replace(/^#+\s+(.*$)/gim, "$1");

  // Bold & Italic
  txt = txt.replace(/(\*\*|__)(.*?)\1/g, "$2");
  txt = txt.replace(/(\*|_)(.*?)\1/g, "$2");

  // Links [text](url) -> text
  txt = txt.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Blockquotes > text
  txt = txt.replace(/^\s*>\s+/gim, "");

  // Unordered lists
  txt = txt.replace(/^\s*[-*+]\s+/gim, "• ");

  // Markdown tables header separators |---|---|
  txt = txt.replace(/^\s*\|?\s*:?-+:?\s*\|\s*:?-+:?\s*\|?.*$/gim, "");

  // Strip remaining pipes for table rows
  txt = txt.replace(/^\s*\|/gm, "").replace(/\|\s*$/gm, "").replace(/\|/g, "  |  ");

  return txt.trim();
}

// ------------------------------------------------------------------
// 2. Markdown ↔ HTML
// ------------------------------------------------------------------

export function markdownToHtml(md: string): string {
  let html = md.replace(/\r\n/g, "\n");

  // Escape basic HTML entity angle brackets inside code blocks
  const codeBlocks: string[] = [];
  html = html.replace(/```([a-z0-9_-]*)\n?([\s\S]*?)```/gi, (_, lang, code) => {
    const placeholder = `XCODEBLOCKX${codeBlocks.length}XCODEBLOCKX`;
    const cleanCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    codeBlocks.push(`<pre><code class="language-${lang}">${cleanCode}</code></pre>`);
    return placeholder;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const clean = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<code>${clean}</code>`;
  });

  // Headers (h1-h6)
  html = html.replace(/^###### (.*$)/gim, "<h6>$1</h6>");
  html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
  html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Blockquotes
  html = html.replace(/^\s*>\s+(.*$)/gim, "<blockquote>$1</blockquote>");

  // Horizontal Rule
  html = html.replace(/^---$/gim, "<hr />");

  // Unordered Lists
  html = html.replace(/^\s*[-*+]\s+(.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>\n$&</ul>\n");

  // Paragraphs
  const lines = html.split("\n");
  const wrapped: string[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (
      line.startsWith("<h") ||
      line.startsWith("<ul") ||
      line.startsWith("</ul") ||
      line.startsWith("<ol") ||
      line.startsWith("</ol") ||
      line.startsWith("<li") ||
      line.startsWith("</li") ||
      line.startsWith("<pre") ||
      line.startsWith("</pre") ||
      line.startsWith("<blockquote") ||
      line.startsWith("</blockquote") ||
      line.startsWith("<hr") ||
      line.startsWith("</") ||
      line.startsWith("XCODEBLOCKX")
    ) {
      wrapped.push(line);
    } else {
      wrapped.push(`<p>${line}</p>`);
    }
  }

  html = wrapped.join("\n");

  // Restore Code Blocks
  codeBlocks.forEach((cb, idx) => {
    html = html.replace(`XCODEBLOCKX${idx}XCODEBLOCKX`, cb);
  });

  return html;
}

export function htmlToMarkdown(html: string): string {
  let md = html;

  // Code blocks <pre><code>...</code></pre>
  md = md.replace(/<pre><code(?:\s+class="language-([a-z0-9_-]+)")?>([\s\S]*?)<\/code><\/pre>/gi, (_, lang, code) => {
    const rawCode = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    return `\n\`\`\`${lang || ""}\n${rawCode.trim()}\n\`\`\`\n`;
  });

  // Inline code <code>...</code>
  md = md.replace(/<code>([\s\S]*?)<\/code>/gi, (_, code) => {
    const raw = code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    return `\`${raw}\``;
  });

  // Headings h1-h6
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n");
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "#### $1\n");
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "##### $1\n");
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "###### $1\n");

  // Bold & Italic
  md = md.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, "**$1**");
  md = md.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, "*$1*");

  // Links <a href="url">text</a>
  md = md.replace(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n");

  // Lists
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");
  md = md.replace(/<\/?(?:ul|ol)[^>]*>/gi, "\n");

  // Paragraphs & Line Breaks
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n");
  md = md.replace(/<br\s*\/?>/gi, "\n");

  // Horizontal Rules
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");

  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");

  // Clean HTML entities
  md = md
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Collapse 3+ newlines into 2
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

// ------------------------------------------------------------------
// 3. CSV ↔ JSON
// ------------------------------------------------------------------

export function parseCSVToRows(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
    } else if (char === '\r') {
      // Ignore carriage return
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows.filter((r) => r.some((field) => field.trim().length > 0));
}

export function csvToJson(csv: string, indent = 2): string {
  const rows = parseCSVToRows(csv);
  if (rows.length === 0) return "[]";

  const headers = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  const result = dataRows.map((row) => {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      let val: any = row[index] !== undefined ? row[index] : "";
      // Convert number/boolean types if applicable
      if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (val !== "" && !isNaN(Number(val)) && !val.startsWith("0") && val.trim() === val) {
        val = Number(val);
      }
      obj[header || `col_${index + 1}`] = val;
    });
    return obj;
  });

  return JSON.stringify(result, null, indent);
}

export function jsonToCsv(jsonStr: string, delimiter = ","): string {
  const parsed = JSON.parse(jsonStr);

  let items: Record<string, any>[] = [];
  if (Array.isArray(parsed)) {
    items = parsed.map((item) => (typeof item === "object" && item !== null ? item : { value: item }));
  } else if (typeof parsed === "object" && parsed !== null) {
    items = [parsed];
  } else {
    items = [{ value: parsed }];
  }

  if (items.length === 0) return "";

  // Collect all unique keys
  const keysSet = new Set<string>();
  items.forEach((item) => {
    Object.keys(item).forEach((k) => keysSet.add(k));
  });
  const headers = Array.from(keysSet);

  const escapeCSVField = (field: any): string => {
    if (field === null || field === undefined) return '""';
    let str = typeof field === "object" ? JSON.stringify(field) : String(field);
    if (str.includes('"') || str.includes(delimiter) || str.includes("\n") || str.includes("\r")) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const headerRow = headers.map(escapeCSVField).join(delimiter);
  const dataRows = items.map((item) => {
    return headers.map((key) => escapeCSVField(item[key])).join(delimiter);
  });

  return [headerRow, ...dataRows].join("\n");
}

// ------------------------------------------------------------------
// 4. TXT ↔ HTML
// ------------------------------------------------------------------

export function txtToHtml(txt: string): string {
  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const cleanTxt = txt.replace(/\r\n/g, "\n");
  const lines = cleanTxt.split("\n");
  const paragraphs: string[] = [];
  let currentP: string[] = [];

  for (const line of lines) {
    if (!line.trim()) {
      if (currentP.length > 0) {
        paragraphs.push(`<p>${currentP.join("<br />\n")}</p>`);
        currentP = [];
      }
    } else {
      currentP.push(escapeHtml(line));
    }
  }

  if (currentP.length > 0) {
    paragraphs.push(`<p>${currentP.join("<br />\n")}</p>`);
  }

  return paragraphs.join("\n\n");
}

export function htmlToTxt(html: string): string {
  let txt = html;

  // Convert linebreaks & paragraph breaks
  txt = txt.replace(/<br\s*\/?>/gi, "\n");
  txt = txt.replace(/<\/p>/gi, "\n\n");
  txt = txt.replace(/<\/div>/gi, "\n");
  txt = txt.replace(/<\/h[1-6]>/gi, "\n\n");
  txt = txt.replace(/<\/li>/gi, "\n");

  // Strip remaining tags
  txt = txt.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  txt = txt
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return txt.replace(/\n{3,}/g, "\n\n").trim();
}

// ------------------------------------------------------------------
// 5. TXT ↔ JSON
// ------------------------------------------------------------------

export function txtToJson(txt: string, indent = 2): string {
  const lines = txt.split("\n");
  const result = {
    documentTitle: lines[0]?.trim() || "Untitled Document",
    totalLines: lines.length,
    characterCount: txt.length,
    lines: lines,
    fullContent: txt,
  };

  return JSON.stringify(result, null, indent);
}

export function jsonToTxt(jsonStr: string): string {
  const parsed = JSON.parse(jsonStr);

  if (typeof parsed === "string") return parsed;
  if (parsed && typeof parsed === "object") {
    if (parsed.fullContent && typeof parsed.fullContent === "string") {
      return parsed.fullContent;
    }
    if (Array.isArray(parsed.lines)) {
      return parsed.lines.join("\n");
    }
    // Formatted key: value text
    return Object.entries(parsed)
      .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
      .join("\n");
  }

  return String(parsed);
}

// ------------------------------------------------------------------
// 6. TXT ↔ CSV
// ------------------------------------------------------------------

export function txtToCsv(txt: string): string {
  const lines = txt.split("\n");
  const escapeCSV = (str: string) => {
    let clean = str.replace(/"/g, '""');
    if (clean.includes(",") || clean.includes('"') || clean.includes("\n")) {
      return `"${clean}"`;
    }
    return `"${clean}"`;
  };

  const header = `"LineNumber","TextContent"`;
  const rows = lines.map((line, idx) => `"${idx + 1}",${escapeCSV(line)}`);

  return [header, ...rows].join("\n");
}

export function csvToTxt(csv: string): string {
  const rows = parseCSVToRows(csv);
  if (rows.length === 0) return "";

  // If 2 columns (e.g. LineNumber, TextContent), extract 2nd column
  if (rows[0].length >= 2 && /line/i.test(rows[0][0])) {
    return rows.slice(1).map((row) => row[1] ?? row.join("\t")).join("\n");
  }

  // Fallback join row values with tab delimiter
  return rows.map((row) => row.join("\t")).join("\n");
}
