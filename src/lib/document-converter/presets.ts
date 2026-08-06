import { DocumentFormat } from "./types";

export const SAMPLE_DOCUMENTS: Record<DocumentFormat, { title: string; content: string }> = {
  txt: {
    title: "Sample Plain Text",
    content: `ToolVerse Production Document Converter
======================================

Welcome to the ToolVerse offline Document Converter!
This tool allows you to convert plain text documents into Markdown, HTML, JSON, and CSV formats instantly within your browser.

Key Features:
- 100% Client-side processing with zero server calls
- Support for TXT, Markdown, HTML, CSV, and JSON
- Automatic format detection and error validation
- High performance for large files (100,000+ characters)
- Zero data tracking or external dependencies

Instructions:
1. Paste or upload your source text in Card 1.
2. Select your desired target format in Card 2.
3. Copy, preview, or download your converted output from Card 3.`,
  },

  markdown: {
    title: "Sample Markdown Document",
    content: `# ToolVerse Document Engine

> **Notice:** All document conversions run completely client-side in your web browser.

## Supported Capabilities

- **TXT ↔ Markdown**: Convert structured markdown to clean plain text or vice versa.
- **Markdown ↔ HTML**: Convert rich Markdown to styled HTML tags.
- **CSV ↔ JSON**: Transform spreadsheet data into structured JSON objects.
- **TXT ↔ HTML**: Package text lines into valid HTML markup.
- **TXT ↔ JSON**: Convert line data into JSON documents.
- **TXT ↔ CSV**: Parse plain text columns into CSV format.

### Quick Start Code Snippet

\`\`\`typescript
import { convertDocument } from "@/lib/document-converter";

const output = convertDocument({
  sourceFormat: "markdown",
  targetFormat: "html",
  inputContent: "# Hello ToolVerse",
});
console.log(output);
\`\`\`

### Data Summary Table

| Format | Category | Offline Ready |
| ------ | -------- | ------------- |
| Plain Text | Text | Yes |
| Markdown | Markup | Yes |
| HTML | Web | Yes |
| CSV | Data | Yes |
| JSON | Data | Yes |

*Built for maximum performance, privacy, and speed.*`,
  },

  html: {
    title: "Sample HTML Document",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ToolVerse Architecture Overview</title>
</head>
<body>
    <h1>ToolVerse Web Utilities</h1>
    <p>ToolVerse is a high-performance suite of client-side web tools designed for modern developers and creators.</p>
    
    <h2>Primary Goals</h2>
    <ul>
        <li><strong>Privacy:</strong> No sensitive document data ever leaves your device.</li>
        <li><strong>Speed:</strong> Instantaneous processing under 5ms.</li>
        <li><strong>Accessibility:</strong> Full ARIA keyboard compliance and screen reader support.</li>
    </ul>

    <blockquote>
        "Building tools that respect user privacy and deliver desktop-grade performance directly in the web browser."
    </blockquote>

    <h2>Code Example</h2>
    <pre><code>const status = "Production Ready";</code></pre>
</body>
</html>`,
  },

  csv: {
    title: "Sample CSV Dataset",
    content: `"id","name","category","price","inStock","rating"
"101","Wireless Mechanical Keyboard","Hardware","129.99","true","4.8"
"102","Ultra-Wide 4K Monitor","Hardware","599.50","true","4.9"
"103","Ergonomic Desk Chair","Furniture","349.00","false","4.7"
"104","USB-C Multi-Port Hub","Accessories","45.25","true","4.5"
"105","Noise-Canceling Headphones","Audio","249.99","true","4.8"`,
  },

  json: {
    title: "Sample JSON Data",
    content: `{
  "app": "ToolVerse",
  "utility": "Document Converter",
  "version": "2.0.0",
  "settings": {
    "offlineMode": true,
    "maxBufferSize": 1000000,
    "theme": "dark"
  },
  "metrics": [
    { "metric": "Latency", "value": "sub-millisecond", "unit": "ms" },
    { "metric": "Privacy", "value": "100%", "unit": "local" },
    { "metric": "Security", "value": "Zero Network Calls", "unit": "status" }
  ],
  "supportedFormats": ["txt", "markdown", "html", "csv", "json"]
}`,
  },
};
