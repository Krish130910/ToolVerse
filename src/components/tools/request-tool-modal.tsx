"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Zap, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RequestToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestToolModal: React.FC<RequestToolModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [toolName, setToolName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !email.trim() || !description.trim()) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/request-tool", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolName: toolName.trim(),
          name: name.trim(),
          email: email.trim(),
          message: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit tool request.");
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setToolName("");
        setName("");
        setEmail("");
        setDescription("");
        setErrorMsg(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isSubmitting) onClose();
          }}
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-lg bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-2xl space-y-5 text-zinc-900"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-zinc-900">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Request a Utility Tool</span>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-orange-500 mx-auto animate-bounce" />
              <h4 className="text-base font-extrabold text-zinc-900">Tool Request Received!</h4>
              <p className="text-xs text-zinc-600 max-w-xs mx-auto leading-relaxed">
                Thank you for contributing to ToolVerse. We queue requests for high-priority browser client-side development.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Tool Name <span className="text-rose-500">*</span></label>
                  <Input
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="e.g. SVG Icon Minifier"
                    className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Your Name (Optional)</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Krish Savaliya"
                    className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Email Address <span className="text-rose-500">*</span></label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="krish@example.com"
                  className="bg-zinc-50 border-zinc-200 focus:bg-white text-xs"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Brief Description & Use Case <span className="text-rose-500">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what inputs and outputs this tool should handle..."
                  className="w-full h-24 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all disabled:opacity-50"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={isSubmitting}
                  className="font-bold text-xs gap-1.5 shadow-2xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Request</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
