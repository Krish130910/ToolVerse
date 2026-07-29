"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Wrench, ShieldCheck, Terminal, Code2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/80 pt-12 pb-8 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-800/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shadow-xs">
                <Wrench className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-zinc-100">
                ToolVerse
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              The modern open tool platform built for developers, designers, and digital creators. Pure client-side execution, zero trackers, 100% free.
            </p>
            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Platform & Tools
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition-colors">
                  Explore Directory
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-400 transition-colors">
                  Tool Categories
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-emerald-400 transition-colors">
                  All 20+ Utilities
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Platform
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-emerald-400 transition-colors">
                  Changelog & Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              Guarantees
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Client-Side Execution</span>
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Ads or Trackers</span>
              </li>
              <li className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next.js 16 & React 19</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} ToolVerse. Built for creators & developers.</p>
          <div className="flex items-center gap-5">
            <Link href="/about" className="hover:text-emerald-400 transition-colors">
              Privacy First
            </Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Contact & Support
            </Link>
            <a href="#github" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};




