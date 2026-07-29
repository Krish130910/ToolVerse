"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WHY_TOOLVERSE } from "@/lib/data";
import { Shield, Cpu, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const PROP_ICON_MAP: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-5 h-5 text-emerald-400" />,
  Cpu: <Cpu className="w-5 h-5 text-emerald-400" />,
  Sparkle: <Sparkles className="w-5 h-5 text-emerald-400" />,
  Terminal: <Terminal className="w-5 h-5 text-emerald-400" />,
};

export const WhyToolVerse: React.FC = () => {
  return (
    <section id="why" className="py-16 relative">
      <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="emerald" className="px-3.5 py-1 text-xs">
            Built for Modern Workflows
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Why Choose ToolVerse?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Existing tool sites are bloated with ad scripts, cookie popups, and force account signups. ToolVerse is fast, free, and runs entirely in your browser.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {WHY_TOOLVERSE.map((prop, idx) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
            >
              <Card className="h-full p-6 flex flex-col justify-between rounded-xl hover:border-emerald-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 shadow-xs">
                      {PROP_ICON_MAP[prop.iconName] || <Shield className="w-5 h-5 text-emerald-400" />}
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {prop.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-100 mb-2">
                    {prop.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 leading-relaxed">
                    {prop.description}
                  </CardDescription>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};



