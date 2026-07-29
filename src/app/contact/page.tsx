"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-10 sm:py-16 relative min-h-screen">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact & Feedback</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
              Request a Tool or Feedback
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
              Have an idea for a new developer utility or feedback on existing tools? Send us a message directly.
            </p>
          </div>

          {submitted ? (
            <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-zinc-100">Feedback Submitted!</h3>
              <p className="text-xs text-zinc-400">
                Thank you for your feedback. We review all requests for upcoming platform releases.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
                className="mt-2"
              >
                Send Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Tool Name / Title</label>
                <Input placeholder="e.g. SVG Optimizer, Diff Checker, Cron Generator..." required />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Category</label>
                <select className="flex h-9 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-100 focus:ring-2 focus:ring-emerald-500/50">
                  <option>Developer Tools</option>
                  <option>Security & Cryptography</option>
                  <option>Text & Markdown</option>
                  <option>CSS & UI Design</option>
                  <option>Image & Asset Tools</option>
                  <option>PDF Utilities</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Description & Desired Features</label>
                <textarea
                  rows={4}
                  placeholder="Describe what the tool should do, input/output formats, and features..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                />
              </div>

              <Button type="submit" variant="default" className="w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                <span>Submit Tool Request</span>
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
