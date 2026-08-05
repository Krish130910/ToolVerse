"use client";

import React, { useState, useMemo, useCallback } from "react";
import { LoremOptions } from "@/lib/lorem/types";
import { generateLorem, calculateLoremStats } from "@/lib/lorem/generator";
import { ControlsCard } from "./lorem-ipsum-generator/ControlsCard";
import { StatsCard } from "./lorem-ipsum-generator/StatsCard";
import { OutputCard } from "./lorem-ipsum-generator/OutputCard";

const INITIAL_OPTIONS: LoremOptions = {
  theme: "classic",
  mode: "paragraphs",
  count: 3,
  format: "text",
  startWithLorem: true,
  randomStart: false,
  seed: null,
  addHeadings: false,
  includeFormatting: false,
};

export const LoremIpsumGeneratorTool: React.FC = () => {
  const [options, setOptions] = useState<LoremOptions>(INITIAL_OPTIONS);
  const [regenTrigger, setRegenTrigger] = useState<number>(0);

  // Compute live generated placeholder text
  const generatedText = useMemo(() => {
    // regenTrigger dependency forces re-run on explicit regenerate click even if seed/options unchanged
    return generateLorem(options);
  }, [options, regenTrigger]);

  // Compute live statistics
  const stats = useMemo(() => {
    return calculateLoremStats(generatedText);
  }, [generatedText]);

  const handleRegenerate = useCallback(() => {
    setRegenTrigger((prev) => prev + 1);
  }, []);

  const handleClear = useCallback(() => {
    setOptions((prev) => ({ ...prev, count: 0 }));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Live Statistics Metrics Row */}
      <StatsCard stats={stats} />

      {/* 2. Responsive Controls & Output Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customization Controls Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-8">
          <ControlsCard options={options} onChangeOptions={setOptions} />
        </div>

        {/* Right Column: Output Card & Code/Preview Box */}
        <div className="lg:col-span-7 space-y-8">
          <OutputCard
            content={generatedText}
            format={options.format}
            mode={options.mode}
            onRegenerate={handleRegenerate}
            onClear={handleClear}
          />
        </div>
      </div>
    </div>
  );
};
