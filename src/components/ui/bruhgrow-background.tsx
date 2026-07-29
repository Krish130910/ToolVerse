"use client";

import React from "react";
import { motion } from "framer-motion";

export const BruhGrowBackground: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFF2E6] via-[#FFFAF4] to-[#FAF8F5]">
      {/* Geometric Dot Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(249, 115, 22, 0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 3D Floating Glass Orbs with Orange Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Right Large Floating Orb */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-10 -right-16 w-80 h-80 rounded-full border border-orange-200/50 bg-gradient-to-br from-orange-100/40 via-amber-50/20 to-transparent shadow-2xl backdrop-blur-xs opacity-75"
          style={{
            boxShadow: "inset 0 0 30px rgba(249, 115, 22, 0.12), 0 20px 40px rgba(249, 115, 22, 0.08)",
          }}
        />

        {/* Top Left Floating Orb */}
        <motion.div
          animate={{
            y: [0, 18, 0],
            x: [0, -8, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-12 -left-12 w-64 h-64 rounded-full border border-orange-200/40 bg-gradient-to-br from-orange-100/30 via-orange-50/10 to-transparent shadow-xl backdrop-blur-xs opacity-70"
          style={{
            boxShadow: "inset 0 0 24px rgba(249, 115, 22, 0.1), 0 15px 35px rgba(249, 115, 22, 0.06)",
          }}
        />

        {/* Center Small Floating Orb */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            x: [0, 12, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 right-1/4 w-36 h-36 rounded-full border border-orange-200/50 bg-gradient-to-br from-orange-100/35 to-transparent shadow-md backdrop-blur-xs opacity-60"
          style={{
            boxShadow: "inset 0 0 15px rgba(249, 115, 22, 0.15)",
          }}
        />
      </div>

      {/* Hero Content Slot */}
      <div className="relative z-10">{children}</div>

      {/* Curved Hero Wave Mask Arc at bottom */}
      <div className="relative w-full overflow-hidden leading-none z-10 -mb-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 text-[#FAF8F5] preserve-3d"
        >
          <path
            d="M0,32 C360,110 1080,110 1440,32 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

    </div>
  );
};
