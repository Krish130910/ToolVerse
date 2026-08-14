"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Wrench, Heart, ShieldCheck, Zap, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-zinc-200/80 pt-8 pb-6 w-full">
      <Container size="large">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-6 border-b border-zinc-200/80">
          {/* Brand Col */}
          <div className="space-y-2.5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-extrabold text-zinc-900 tracking-tight">
                ToolVerse
              </span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Fast, privacy-first developer utilities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Platform &amp; Tools
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600">
              <li>
                <Link href="/" className="hover:text-orange-600 transition-colors">
                  All Tools Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Guarantees
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% Client-Side Processing</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Zero Server Bottlenecks</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>No User Tracking or Ads</span>
              </li>
            </ul>
          </div>

          {/* Legal & Open Source */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Open Source
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Designed &amp; engineered for modern software teams, engineers, and creators worldwide.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <p>© {new Date().getFullYear()} ToolVerse Platform. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for developers</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
