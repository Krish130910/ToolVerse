"use client";

import React from "react";
import { LoremStats } from "@/lib/lorem/types";
import { FileText, Type, AlignLeft, Clock } from "lucide-react";

interface StatsCardProps {
  stats: LoremStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Words */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 shrink-0">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Words</div>
          <div className="text-lg font-mono font-bold text-zinc-900">{stats.wordCount}</div>
        </div>
      </div>

      {/* Characters */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
          <Type className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Characters</div>
          <div className="text-lg font-mono font-bold text-zinc-900">{stats.charCountWithSpaces}</div>
          <div className="text-[10px] text-zinc-400 font-mono">{stats.charCountWithoutSpaces} no spaces</div>
        </div>
      </div>

      {/* Paragraphs / Lines */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
          <AlignLeft className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Paragraphs</div>
          <div className="text-lg font-mono font-bold text-zinc-900">{stats.paragraphCount}</div>
        </div>
      </div>

      {/* Reading Time */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Reading Time</div>
          <div className="text-lg font-mono font-bold text-zinc-900">{stats.readingTime}</div>
        </div>
      </div>
    </div>
  );
};
