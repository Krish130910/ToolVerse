"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/tools/command-palette";
import { RequestToolModal } from "@/components/tools/request-tool-modal";
import { ClickSpark } from "@/components/ui/click-spark";

import { usePathname } from "next/navigation";

export const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [requestToolOpen, setRequestToolOpen] = useState(false);

  const isToolPage = pathname.startsWith("/tools/");

  return (
    <ThemeProvider>
      <ClickSpark
        sparkColor="#F97316"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={8}
        duration={400}
      >
        <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#18181B]">
          <Navbar
            onSearchClick={() => setSearchOpen(true)}
            onRequestToolClick={() => setRequestToolOpen(true)}
          />
          <main className="flex-1">{children}</main>
          {!isToolPage && <Footer />}

          {/* Global Command Palette / Search Modal */}
          <CommandPalette
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            onSelectTool={(tool) => {
              setSearchOpen(false);
              window.location.href = `/tools/${tool.slug}`;
            }}
          />

          {/* Global Request Tool Modal */}
          <RequestToolModal
            isOpen={requestToolOpen}
            onClose={() => setRequestToolOpen(false)}
          />
        </div>
      </ClickSpark>
    </ThemeProvider>
  );
};
