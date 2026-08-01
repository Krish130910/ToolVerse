"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BrandIcon } from "@/components/ui/brand-icon";
import { ShieldCheck, Terminal, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-orange-100 bg-[#FAF8F5] pt-12 pb-8 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-orange-100/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8.5 w-8.5 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-2xs">
                <BrandIcon className="w-4.5 h-4.5 text-orange-600" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-zinc-900">
                ToolVerse
              </span>
            </div>

            <p className="text-xs text-zinc-600 max-w-sm leading-relaxed">
              The modern open tool platform built for developers, designers, and digital creators. Pure client-side execution, zero trackers, 100% free.
            </p>
            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[11px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Platform & Tools
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-600">
              <li>
                <Link href="/explore" className="hover:text-orange-600 transition-colors">
                  Explore Directory
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-orange-600 transition-colors">
                  Tool Categories
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-orange-600 transition-colors">
                  All 25 Utilities
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-600 transition-colors">
                  About Platform
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-orange-600 transition-colors">
                  Changelog & Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Guarantees
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Client-Side Execution</span>
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>Zero Ads or Trackers</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>100% Free</span>
              </li>


            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} ToolVerse. Built for creators & developers.</p>
          <div className="flex items-center gap-3">
            <Link href="/about" className="hover:text-orange-600 transition-colors underline underline-offset-2">
              Terms
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-orange-600 transition-colors underline underline-offset-2">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-orange-600 transition-colors">
              Contact & Support
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
