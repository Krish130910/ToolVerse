"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ToolLayout } from "@/components/tool-layout/tool-layout";
import { LiveToolsSuite } from "@/components/tools/live-tools-suite";
import { FEATURED_TOOLS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Clock, PlusCircle } from "lucide-react";

export default function DedicatedToolPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const unwrappedParams = React.use ? React.use(params as any) : params;
  const slug = (unwrappedParams as any)?.slug || "";

  const tool = FEATURED_TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    return (
      <div className="py-20 text-center space-y-4 bg-[#FAF8F5] min-h-screen">
        <h2 className="text-2xl font-bold text-zinc-900">Tool Not Found</h2>
        <p className="text-xs text-zinc-600">
          The requested tool route <code className="text-orange-600 font-mono">/tools/{slug}</code> does not exist.
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
    <ToolLayout tool={tool} hideRelatedTools={true} containerSize="large">
      {tool.isLive ? (
        <LiveToolsSuite initialTool={slug} />
      ) : (
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-10 text-center space-y-4 shadow-xs">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-orange-50 border border-orange-200 text-orange-500">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900">
            {tool.name} is in Development
          </h3>
          <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
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
