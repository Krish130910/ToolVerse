"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Binary,
  Copy,
  Check,
  Download,
  Eye,
  Code,
  Bold,
  Italic,
  List,
  Heading,
  Link as LinkIcon,
  FileCode,
} from "lucide-react";

export const MarkdownEditorTool: React.FC = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to ToolVerse Markdown Editor

## Production Features
- Live **Split View** preview
- Instant *syntax formatting*
- Code blocks & table rendering
- Export to Markdown, HTML, or PDF

\`\`\`javascript
const greeting = "Build faster with ToolVerse!";
console.log(greeting);
\`\`\`
`);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copied, setCopied] = useState(false);

  // Parse Markdown to HTML
  const renderedHtml = useMemo(() => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-2">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/```javascript([\s\S]*?)```/gim, '<pre class="bg-zinc-900 text-orange-400 p-3 rounded-lg font-mono text-xs my-2">$1</pre>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-zinc-900 text-zinc-100 p-3 rounded-lg font-mono text-xs my-2">$1</pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, '<br/>');
  }, [markdown]);

  const wordCount = useMemo(() => {
    return markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  }, [markdown]);

  const insertFormat = (prefix: string, suffix: string = "") => {
    setMarkdown((prev) => prev + `${prefix}text${suffix}`);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
  };

  const downloadHtml = () => {
    const blob = new Blob([renderedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Format Toolbar */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <button onClick={() => insertFormat("**", "**")} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-700" title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button onClick={() => insertFormat("*", "*")} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-700" title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <button onClick={() => insertFormat("# ")} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-700" title="Heading">
            <Heading className="w-4 h-4" />
          </button>
          <button onClick={() => insertFormat("- ")} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-700" title="List">
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => insertFormat("```\n", "\n```")} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-700" title="Code Block">
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Metrics & Exports */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-zinc-500 font-mono">
            <span>{wordCount} words</span> • <span>{markdown.length} chars</span>
          </div>

          <Button onClick={copyHtml} variant="outline" size="sm" className="text-xs font-bold gap-1">
            {copied ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied HTML!" : "Copy HTML"}</span>
          </Button>

          <Button onClick={downloadMarkdown} variant="default" size="sm" className="text-xs font-bold gap-1 shadow-2xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export .md</span>
          </Button>
        </div>
      </div>

      {/* Split Editor & Live Preview View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Box */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Markdown Source Editor</h4>
          </div>
          <textarea
            rows={16}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/40"
          />
        </div>

        {/* Rendered Preview Box */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              <span>Live Rendered View</span>
            </h4>
          </div>
          <div
            className="w-full p-5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 text-xs min-h-[380px] overflow-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      </div>
    </div>
  );
};
