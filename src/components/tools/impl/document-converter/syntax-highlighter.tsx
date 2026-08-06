"use client";

import React, { useMemo } from "react";
import { DocumentFormat } from "@/lib/document-converter";

interface SyntaxHighlighterProps {
  code: string;
  format: DocumentFormat;
  className?: string;
  theme?: "dark" | "light";
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  code,
  format,
  className = "",
  theme = "dark",
}) => {
  const isDark = theme === "dark";

  const highlightedLines = useMemo(() => {
    if (!code) return null;
    const lines = code.split("\n");

    return lines.map((line, lIdx) => {
      let lineElements: React.ReactNode = line;

      if (format === "json") {
        try {
          const jsonRegex =
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

          let lastIdx = 0;
          const parts: React.ReactNode[] = [];
          let match: RegExpExecArray | null;

          jsonRegex.lastIndex = 0;
          while ((match = jsonRegex.exec(line)) !== null) {
            const matchStr = match[0];
            const startIdx = match.index;

            if (startIdx > lastIdx) {
              parts.push(line.slice(lastIdx, startIdx));
            }

            if (/^"/.test(matchStr)) {
              if (/:$/.test(matchStr)) {
                const keyName = matchStr.slice(0, -1);
                parts.push(
                  <span key={`${lIdx}-${startIdx}`} className={isDark ? "text-[#89b4fa] font-semibold" : "text-blue-600 font-semibold"}>
                    {keyName}
                  </span>
                );
                parts.push(<span key={`${lIdx}-${startIdx}-colon`} className={isDark ? "text-[#cdd6f4]" : "text-zinc-700"}>:</span>);
              } else {
                parts.push(
                  <span key={`${lIdx}-${startIdx}`} className={isDark ? "text-[#a6e3a1]" : "text-emerald-600"}>
                    {matchStr}
                  </span>
                );
              }
            } else if (/true|false/.test(matchStr)) {
              parts.push(
                <span key={`${lIdx}-${startIdx}`} className={isDark ? "text-[#fab387] font-bold" : "text-amber-600 font-bold"}>
                  {matchStr}
                </span>
              );
            } else if (/null/.test(matchStr)) {
              parts.push(
                <span key={`${lIdx}-${startIdx}`} className={isDark ? "text-[#f38ba8] italic" : "text-rose-500 italic"}>
                  {matchStr}
                </span>
              );
            } else {
              parts.push(
                <span key={`${lIdx}-${startIdx}`} className={isDark ? "text-[#cba6f7] font-medium" : "text-purple-600 font-medium"}>
                  {matchStr}
                </span>
              );
            }

            lastIdx = jsonRegex.lastIndex;
          }

          if (lastIdx < line.length) {
            parts.push(line.slice(lastIdx));
          }

          lineElements = parts;
        } catch {
          lineElements = line;
        }
      } else if (format === "html") {
        const parts = line.split(/(<[^>]+>)/g);
        lineElements = parts.map((part, pIdx) => {
          if (part.startsWith("<") && part.endsWith(">")) {
            return (
              <span key={pIdx} className={isDark ? "text-[#f38ba8] font-semibold" : "text-orange-600 font-semibold"}>
                {part}
              </span>
            );
          }
          return <span key={pIdx} className={isDark ? "text-[#cdd6f4]" : "text-zinc-800"}>{part}</span>;
        });
      } else if (format === "markdown") {
        if (/^#+\s/.test(line)) {
          lineElements = <span className={isDark ? "text-[#fab387] font-bold" : "text-orange-600 font-bold"}>{line}</span>;
        } else if (/^\s*[-*+]\s/.test(line)) {
          lineElements = <span className={isDark ? "text-[#89b4fa] font-medium" : "text-blue-600 font-medium"}>{line}</span>;
        } else if (/^>/.test(line)) {
          lineElements = <span className={isDark ? "text-[#a6e3a1] italic" : "text-emerald-600 italic"}>{line}</span>;
        } else if (/```/.test(line)) {
          lineElements = <span className={isDark ? "text-[#cba6f7] font-semibold" : "text-purple-600 font-semibold"}>{line}</span>;
        } else {
          lineElements = <span className={isDark ? "text-[#cdd6f4]" : "text-zinc-800"}>{line}</span>;
        }
      } else {
        lineElements = <span className={isDark ? "text-[#cdd6f4]" : "text-zinc-800"}>{line}</span>;
      }

      return (
        <div key={lIdx} className={`flex items-start min-w-full font-mono text-xs leading-6 hover:${isDark ? "bg-zinc-800/40" : "bg-zinc-100/60"}`}>
          <span className={`w-12 shrink-0 pr-3 text-right select-none text-[11px] border-r sticky left-0 py-0.5 ${
            isDark ? "text-[#585b70] bg-[#181825] border-zinc-800" : "text-zinc-400 bg-zinc-100 border-zinc-200"
          }`}>
            {lIdx + 1}
          </span>
          <span className="pl-3 py-0.5 whitespace-pre overflow-x-auto flex-1 break-words">
            {lineElements}
          </span>
        </div>
      );
    });
  }, [code, format, isDark]);

  return (
    <div
      className={`font-mono text-xs overflow-auto py-2 rounded-xl border leading-relaxed shadow-inner w-full ${
        isDark ? "bg-[#1e1e2e] text-[#cdd6f4] border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
      } ${className}`}
      style={{ maxHeight: "450px" }}
    >
      <div className="w-full min-w-full flex flex-col">{highlightedLines}</div>
    </div>
  );
};
