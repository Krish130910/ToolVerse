"use client";

import React from "react";

export const BruhGrowBackground: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFF2E6] via-[#FFFAF4] to-[#FAF8F5]">
      {/* Geometric Dot Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(249, 115, 22, 0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* GPU Accelerated Soft Radial Glow Orbs (Pure CSS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-10 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-orange-200/40 via-amber-100/20 to-transparent blur-2xl opacity-60" />
        <div className="absolute top-12 -left-12 w-80 h-80 rounded-full bg-gradient-to-br from-orange-200/30 via-orange-100/10 to-transparent blur-2xl opacity-50" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-orange-200/30 to-transparent blur-xl opacity-40" />
      </div>

      {/* Hero Content Slot */}
      <div className="relative z-10">{children}</div>

      {/* Curved Hero Wave Mask Arc at bottom */}
      <div className="relative w-full overflow-hidden leading-none z-10 -mb-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 text-[#FAF8F5]"
        >
          <path
            d="M0 0C240 70 480 105 720 105C960 105 1200 70 1440 0V120H0V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};
