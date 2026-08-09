// Preset Markdown Templates for Quick Import

import { MarkdownTemplate } from "./types";

export const SAMPLE_MARKDOWN_TEMPLATES: MarkdownTemplate[] = [
  {
    id: "welcome-docs",
    name: "ToolVerse Guide",
    category: "Documentation",
    content: `# Welcome to ToolVerse Markdown Editor

A production-grade, privacy-first **Markdown Editor & Live Preview** utility.

## Key Features
- **100% Client-Side**: Zero server roundtrips, instant local parsing & HTML rendering.
- **Split Workspace**: Dual-column raw Markdown editor with live styled document preview.
- **Rich Formatting Toolbar**: Quick insertion for headings, lists, tables, code blocks & images.
- **Clean Export Options**: Download pure \`.md\` files or standalone standalone \`.html\` documents without branding artifacts.

---

### Code Highlighting Example
\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  isVerified: boolean;
}

const formatUser = (user: UserProfile): string => {
  return \`User: \${user.name} (\${user.id})\`;
};
\`\`\`

### Interactive Task Progress
- [x] Integrate safe DOM parser HTML sanitizer
- [x] Fix line wrapping & min-width layout bounds
- [ ] Add custom CSS export themes

### Data Table Example
| Feature | Supported | Status |
| :--- | :---: | :--- |
| Live Preview | Yes | Ready |
| XSS Security | Yes | Hardened |
| Client Export | Yes | Active |

> "Simplicity is prerequisite for reliability." — *Edsger W. Dijkstra*
`,
  },
  {
    id: "project-readme",
    name: "GitHub README",
    category: "Templates",
    content: `# Project Name 🚀

An awesome open-source project built with modern web technologies.

## Features
- ⚡ **Ultra Fast**: Optimized for maximum runtime performance.
- 🔒 **Secure**: Hardened against XSS vectors.
- 🎨 **Modern Design**: Clean aesthetic matching production standards.

## Installation

\`\`\`bash
npm install my-awesome-library
npm run dev
\`\`\`

## Quick Usage

\`\`\`javascript
import { initializeApp } from "my-awesome-library";

initializeApp({
  mode: "production",
  telemetry: false
});
\`\`\`

## License
MIT © ${new Date().getFullYear()} ToolVerse Team
`,
  },
  {
    id: "release-notes",
    name: "Release Notes",
    category: "Changelog",
    content: `# Release v2.4.0 — Production Update

### 🚀 What's New
- Added live property tweaker controls for real-time vector graphics modification.
- Hardened client-side XSS sanitizer across all user input components.

### 🐛 Bug Fixes
- Fixed horizontal scrollbar page movement across all mobile and tablet breakpoints.
- Resolved SVG element size calculation for un-dimensioned viewBox graphics.

### ⚡ Performance
- Reduced bundle size by removing redundant server dependencies.
- Optimized DOMParser re-rendering pipeline.
`,
  },
];
