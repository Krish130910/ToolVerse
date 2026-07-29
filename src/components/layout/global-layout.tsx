"use client";

import React, { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/tools/command-palette";
import { RequestToolModal } from "@/components/tools/request-tool-modal";

export const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [requestToolOpen, setRequestToolOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-[#09090B] text-[#FAFAFA]">
        <Navbar
          onSearchClick={() => setSearchOpen(true)}
          onRequestToolClick={() => setRequestToolOpen(true)}
        />
        <main className="flex-1">{children}</main>
        <Footer />

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
    </ThemeProvider>
  );
};
