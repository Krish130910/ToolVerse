// Pure Document Export Helper Utilities (No ToolVerse UI / Branding Artifacts)

/** Exports pure raw Markdown content without any UI or promotional header/footer */
export function exportMarkdownFile(content: string, filename: string = "document.md"): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  triggerDownload(blob, filename.endsWith(".md") ? filename : `${filename}.md`);
}

/** Wraps parsed HTML body into a clean standalone HTML5 document for export */
export function exportHtmlDocument(renderedBodyHtml: string, filename: string = "document.html", title: string = "Markdown Document"): void {
  const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --bg-color: #ffffff;
      --text-color: #1f2937;
      --border-color: #e5e7eb;
      --code-bg: #18181b;
      --code-text: #f4f4f5;
    }
    body {
      font-family: var(--font-family);
      line-height: 1.6;
      color: var(--text-color);
      background-color: var(--bg-color);
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    h1, h2, h3, h4, h5, h6 { font-weight: 700; line-height: 1.25; margin-top: 1.5em; margin-bottom: 0.5em; }
    h1 { font-size: 2.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
    h2 { font-size: 1.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
    h3 { font-size: 1.35rem; }
    p { margin-top: 0; margin-bottom: 1em; }
    a { color: #f97316; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875em; background-color: #f3f4f6; padding: 0.2em 0.4em; rounded: 4px; }
    pre { background-color: var(--code-bg); color: var(--code-text); padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem; }
    pre code { background-color: transparent; padding: 0; color: inherit; }
    blockquote { border-left: 4px solid #f97316; padding-left: 1rem; margin: 1em 0; color: #4b5563; font-style: italic; }
    ul, ol { padding-left: 2rem; margin-bottom: 1em; }
    li { margin-bottom: 0.25em; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
    th, td { border: 1px solid var(--border-color); padding: 0.5rem 0.75rem; text-align: left; }
    th { background-color: #f9fafb; font-weight: 600; }
    hr { border: 0; border-top: 1px solid var(--border-color); margin: 2em 0; }
    img { max-width: 100%; height: auto; border-radius: 8px; }
  </style>
</head>
<body>
${renderedBodyHtml}
</body>
</html>`;

  const blob = new Blob([standaloneHtml], { type: "text/html;charset=utf-8" });
  triggerDownload(blob, filename.endsWith(".html") ? filename : `${filename}.html`);
}

/** Triggers file download in browser */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Cleanup object URL after download
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
