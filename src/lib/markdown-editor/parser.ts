// Comprehensive Client-Side Markdown Parser & Stat Calculator

import { MarkdownStats } from "./types";
import { sanitizeHtml } from "./sanitizer";

/** Calculates word count, character count, line count, and estimated reading time */
export function calculateMarkdownStats(markdown: string): MarkdownStats {
  const trimmed = markdown.trim();
  const chars = markdown.length;
  const lines = markdown ? markdown.split("\n").length : 0;
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    chars,
    lines,
    readingTimeMinutes,
  };
}

/** Converts raw Markdown string to sanitized HTML */
export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown.trim()) return "";

  let raw = markdown;

  // 1. Preserve Code Blocks first to avoid inner syntax replacement
  const codeBlocks: string[] = [];
  raw = raw.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    const escapedCode = escapeHtml(code.trim());
    const langAttr = lang ? ` data-language="${escapeHtml(lang)}"` : "";
    const html = `<pre className="code-block" ${langAttr}><code class="language-${escapeHtml(lang || "text")}">${escapedCode}</code></pre>`;
    codeBlocks.push(html);
    return placeholder;
  });

  // 2. Preserve Inline Code (`code`)
  const inlineCodes: string[] = [];
  raw = raw.replace(/`([^`\n]+)`/g, (_, code) => {
    const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
    const html = `<code class="inline-code">${escapeHtml(code)}</code>`;
    inlineCodes.push(html);
    return placeholder;
  });

  // 3. Process Tables
  raw = raw.replace(/^\|(.+)\|\r?\n\|[-:\s|]+\|\r?\n((?:\|.+\|\r?\n?)+)/gm, (_, headerRow, bodyRows) => {
    const headers = headerRow.split("|").filter((h: string) => h.trim() !== "").map((h: string) => `<th>${parseInline(h.trim())}</th>`).join("");
    const rows = bodyRows.trim().split("\n").map((row: string) => {
      const cells = row.split("|").filter((c: string) => c.trim() !== "").map((c: string) => `<td>${parseInline(c.trim())}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("");

    return `<div class="table-container"><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });

  // 4. Split into block lines
  const lines = raw.split("\n");
  const result: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;
  let inBlockquote = false;

  const closeLists = () => {
    if (inUnorderedList) {
      result.push("</ul>");
      inUnorderedList = false;
    }
    if (inOrderedList) {
      result.push("</ol>");
      inOrderedList = false;
    }
    if (inBlockquote) {
      result.push("</blockquote>");
      inBlockquote = false;
    }
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    // Empty line closes open list / quote containers
    if (!trimmedLine) {
      closeLists();
      return;
    }

    // Horizontal Rule (---, ***, ___)
    if (/^(?:---|\*\*\*|___)$/.test(trimmedLine)) {
      closeLists();
      result.push("<hr/>");
      return;
    }

    // Headings (# H1 to ###### H6)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeLists();
      const level = headingMatch[1].length;
      const content = parseInline(headingMatch[2]);
      result.push(`<h${level}>${content}</h${level}>`);
      return;
    }

    // Blockquotes (> Quote)
    const quoteMatch = line.match(/^>\s+(.+)$/);
    if (quoteMatch) {
      if (!inBlockquote) {
        closeLists();
        result.push("<blockquote>");
        inBlockquote = true;
      }
      result.push(`<p>${parseInline(quoteMatch[1])}</p>`);
      return;
    }

    // Task List Items (- [ ] or - [x])
    const taskMatch = line.match(/^(?:-|\*)\s+\[([ xX])\]\s+(.+)$/);
    if (taskMatch) {
      if (!inUnorderedList) {
        closeLists();
        result.push('<ul class="task-list">');
        inUnorderedList = true;
      }
      const isChecked = taskMatch[1].toLowerCase() === "x";
      const checkedAttr = isChecked ? 'checked="" disabled=""' : 'disabled=""';
      const itemClass = isChecked ? 'class="task-item completed"' : 'class="task-item"';
      result.push(`<li ${itemClass}><input type="checkbox" ${checkedAttr}/> <span>${parseInline(taskMatch[2])}</span></li>`);
      return;
    }

    // Unordered List Items (- item or * item)
    const ulMatch = line.match(/^(?:-|\*|\+)\s+(.+)$/);
    if (ulMatch) {
      if (!inUnorderedList) {
        closeLists();
        result.push("<ul>");
        inUnorderedList = true;
      }
      result.push(`<li>${parseInline(ulMatch[1])}</li>`);
      return;
    }

    // Ordered List Items (1. item)
    const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      if (!inOrderedList) {
        closeLists();
        result.push("<ol>");
        inOrderedList = true;
      }
      result.push(`<li>${parseInline(olMatch[2])}</li>`);
      return;
    }

    // Standard Paragraph
    closeLists();

    // Check if line contains block placeholders
    if (trimmedLine.startsWith("__CODE_BLOCK_")) {
      result.push(trimmedLine);
    } else {
      result.push(`<p>${parseInline(line)}</p>`);
    }
  });

  closeLists();

  let html = result.join("\n");

  // Restore Inline Codes
  inlineCodes.forEach((codeHtml, idx) => {
    html = html.replace(`__INLINE_CODE_${idx}__`, codeHtml);
  });

  // Restore Code Blocks
  codeBlocks.forEach((blockHtml, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, blockHtml);
  });

  // Final HTML Sanitization pass for XSS protection
  return sanitizeHtml(html);
}

/** Parses inline formatting (bold, italic, strikethrough, links, images) */
function parseInline(text: string): string {
  let s = text;

  // Images: ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="preview-image"/>');

  // Links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Bold + Italic: ***text*** or ___text___
  s = s.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  s = s.replace(/___(.*?)___/g, "<strong><em>$1</em></strong>");

  // Bold: **text** or __text__
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italic: *text* or _text_
  s = s.replace(/\*(.*?)\*/g, "<em>$1</em>");
  s = s.replace(/_(.*?)_/g, "<em>$1</em>");

  // Strikethrough: ~~text~~
  s = s.replace(/~~(.*?)~~/g, "<del>$1</del>");

  return s;
}

/** Escapes special HTML characters */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
