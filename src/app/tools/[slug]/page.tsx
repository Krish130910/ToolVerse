"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { LiveToolsSuite } from "@/components/tools/live-tools-suite";
import { FEATURED_TOOLS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Clock, PlusCircle } from "lucide-react";

export default function DedicatedToolPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const tool = FEATURED_TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-100">Tool Not Found</h2>
        <p className="text-xs text-zinc-400">
          The requested tool route <code className="text-emerald-400">/tools/{slug}</code> does not exist.
        </p>
        <a href="/tools">
          <Button variant="default" size="sm">
            Back to Tools Directory
          </Button>
        </a>
      </div>
    );
  }

  return (
    <ToolLayout tool={tool}>
      {tool.isLive ? (
        <LiveToolsSuite initialTool={slug} />
      ) : (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-10 text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-emerald-400">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100">
            {tool.name} is in Development
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            This utility is currently scheduled on our Phase 2 release roadmap. Vote or request high-priority release below.
          </p>
          <div className="pt-2">
            <Button
              variant="default"
              onClick={() => alert(`Upvoted priority for ${tool.name}!`)}
              className="flex items-center gap-1.5 mx-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upvote Priority for {tool.name}</span>
            </Button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
