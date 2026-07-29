"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LiveToolsSuite } from "./live-tools-suite";

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolActionKey?: string;
}

export const ToolModal: React.FC<ToolModalProps> = ({
  isOpen,
  onClose,
  toolActionKey,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto my-auto"
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <LiveToolsSuite initialTool={toolActionKey || "json-formatter"} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
