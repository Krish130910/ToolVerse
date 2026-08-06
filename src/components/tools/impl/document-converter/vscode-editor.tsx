"use client";

import React, { useRef, useCallback } from "react";

interface VSCodeInputEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  theme?: "dark" | "light";
}

export const VSCodeInputEditor: React.FC<VSCodeInputEditorProps> = ({
  value,
  onChange,
  placeholder = "Type or paste content here...",
  minHeight = "380px",
  className = "",
  theme = "dark",
}) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = value ? value.split("\n") : [""];
  const lineCount = lines.length;
  const isDark = theme === "dark";

  const handleScroll = useCallback(() => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  return (
    <div
      className={`relative font-mono text-xs flex w-full overflow-hidden transition-colors ${
        isDark ? "bg-[#1e1e2e] text-zinc-100" : "bg-white text-zinc-900 border border-zinc-200 rounded-xl"
      } ${className}`}
      style={{ minHeight }}
    >
      {/* Line Numbers Sidebar */}
      <div
        ref={lineNumbersRef}
        className={`w-12 shrink-0 py-3 pr-3 text-right select-none border-r font-mono text-[11px] leading-relaxed overflow-hidden ${
          isDark
            ? "bg-[#181825] text-[#585b70] border-zinc-800"
            : "bg-zinc-100/80 text-zinc-400 border-zinc-200"
        }`}
        aria-hidden="true"
      >
        {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
          <div key={i} className="h-5 flex items-center justify-end">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code Textarea */}
      <div className="relative flex-1 h-full w-full overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          spellCheck={false}
          className={`w-full h-full p-3 font-mono text-xs leading-relaxed focus:outline-none resize-none tab-size-2 ${
            isDark
              ? "bg-transparent text-zinc-100 placeholder:text-zinc-600 selection:bg-orange-500/30 caret-orange-400"
              : "bg-transparent text-zinc-900 placeholder:text-zinc-400 selection:bg-orange-200 caret-orange-600"
          }`}
          style={{ minHeight }}
        />
      </div>
    </div>
  );
};
