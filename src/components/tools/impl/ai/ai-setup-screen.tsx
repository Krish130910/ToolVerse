"use client";

import React from "react";
import { KeyRound, Zap, Terminal, ExternalLink, ShieldCheck } from "lucide-react";

interface AISetupScreenProps {
  message?: string;
  toolName?: string;
}

export const AISetupScreen: React.FC<AISetupScreenProps> = ({
  message = "No AI Provider API Key Configured.",
  toolName = "AI Developer Tool",
}) => {
  return (
    <div className="w-full p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-6 text-zinc-900">
      {/* Header Badge */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600">
          <KeyRound className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <span>{toolName} Setup Required</span>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-extrabold uppercase tracking-wider">
              API Key Missing
            </span>
          </h3>
          <p className="text-xs text-zinc-500">{message}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15 space-y-3">
        <p className="text-xs text-zinc-700 leading-relaxed font-medium">
          ToolVerse AI features connect directly to official AI APIs (Google Gemini, OpenAI, Groq, Anthropic, or OpenRouter) to deliver real, production-ready code generation with zero simulated fallbacks.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-orange-700">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure &amp; Private
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Free Gemini 1.5 Flash Tier Available
          </span>
        </div>
      </div>

      {/* Quick Setup Instructions */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-orange-500" />
          Quick 1-Minute Setup Instructions
        </h4>

        <div className="p-3.5 rounded-xl bg-[#121215] text-zinc-200 text-xs font-mono overflow-x-auto space-y-1.5 border border-zinc-800">
          <p className="text-zinc-500"># 1. Open or create .env.local in your ToolVerse project root</p>
          <p className="text-emerald-400">GEMINI_API_KEY=&quot;your_google_gemini_api_key_here&quot;</p>
          <p className="text-zinc-500"># Or add OpenAI / Groq keys:</p>
          <p className="text-zinc-400">OPENAI_API_KEY=&quot;sk-...&quot;</p>
          <p className="text-zinc-400">GROQ_API_KEY=&quot;gsk_...&quot;</p>
        </div>
      </div>

      {/* Action links */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100">
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          Get Free Gemini API Key <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          Get OpenAI API Key <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
