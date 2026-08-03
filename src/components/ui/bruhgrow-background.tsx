"use client";

import React from "react";

export const BruhGrowBackground: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-b from-[#FFF2E6] via-[#FFFAF4] to-[#FAF8F5] ${className}`}>
      {/* Geometric Dot Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(249, 115, 22, 0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Floating 3D Ambient Glass Bubbles (Hardware-Accelerated CSS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Ambient Glow Orbs */}
        <div className="absolute -top-10 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-orange-300/40 via-amber-200/20 to-transparent blur-2xl opacity-60" />
        <div className="absolute top-12 -left-12 w-80 h-80 rounded-full bg-gradient-to-br from-orange-300/30 via-orange-200/10 to-transparent blur-2xl opacity-50" />

        {/* 3D Floating Glass Bubbles */}
        <div className="absolute top-10 left-[12%] w-24 h-24 rounded-full bg-gradient-to-br from-white/70 via-orange-200/30 to-orange-400/20 backdrop-blur-md border border-white/60 shadow-xl shadow-orange-500/10 animate-float-slow" />
        <div className="absolute top-28 right-[15%] w-32 h-32 rounded-full bg-gradient-to-tr from-white/80 via-amber-200/40 to-orange-300/30 backdrop-blur-lg border border-white/80 shadow-2xl shadow-orange-500/15 animate-float-medium" />
        <div className="absolute bottom-16 left-[20%] w-16 h-16 rounded-full bg-gradient-to-bl from-white/60 via-orange-100/40 to-orange-300/20 backdrop-blur-sm border border-white/50 shadow-lg shadow-orange-500/10 animate-float-fast" />
        <div className="absolute top-1/2 right-[8%] w-20 h-20 rounded-full bg-gradient-to-br from-white/70 via-orange-200/20 to-amber-300/20 backdrop-blur-md border border-white/60 shadow-xl shadow-orange-500/10 animate-float-slow" />
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
