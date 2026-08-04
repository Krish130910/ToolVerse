"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import PixelTransition from "@/components/ui/pixel-transition";
import { RequestToolModal } from "@/components/tools/request-tool-modal";
import { Zap, ArrowRight, ShieldCheck } from "lucide-react";

interface RequestToolBannerProps {
  onRequestToolClick?: () => void;
}

export const RequestToolBanner: React.FC<RequestToolBannerProps> = ({
  onRequestToolClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    onRequestToolClick?.();
  };

  return (
    <section className="py-8 bg-[#FAF8F5]">
      <Container size="large">
        <PixelTransition
          gridSize={12}
          pixelColor="#f97316"
          animationStepDuration={0.35}
          aspectRatio="14%"
          className="w-full rounded-3xl border border-orange-200/90 bg-white shadow-xs overflow-hidden cursor-pointer group"
          firstContent={
            <div
              onClick={handleOpenModal}
              className="w-full h-full p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-[#FFF5EC] via-[#FFFAF4] to-[#FFF5EC] border border-orange-200/80 rounded-3xl"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-orange-200/90 text-orange-700 text-[11px] font-extrabold tracking-wide uppercase shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-orange-500" />
                  <span>Missing Something?</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-snug">
                  Don’t see your tool?{" "}
                  <span className="text-orange-500 font-extrabold italic">
                    Tell us what to build.
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed">
                  We ship requests fast. Drop a tool idea and we’ll prototype the good ones.
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <span>Request a tool</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          }
          secondContent={
            <div
              onClick={handleOpenModal}
              className="w-full h-full p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 text-white border border-zinc-800 rounded-3xl"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold tracking-wide uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Community Powered &amp; Fast Delivery</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 tracking-tight leading-snug">
                  Have a custom tool in mind?{" "}
                  <span className="italic">We’ll build &amp; launch it.</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
                  Your request goes straight to our dev queue and notifies our team instantly!
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  <span>Submit Tool Idea</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          }
        />
      </Container>

      {/* Internal Modal Instance */}
      <RequestToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
