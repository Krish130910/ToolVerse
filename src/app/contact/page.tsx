"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
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
    <div className="py-10 sm:py-16 relative min-h-screen bg-[#FAF8F5]">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact & Feedback</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Request a Tool or Feedback
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg mx-auto">
              Have an idea for a new developer utility or feedback on existing tools? Send us a message directly.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white border border-orange-200 rounded-2xl p-8 text-center space-y-3 shadow-xs">
              <CheckCircle className="w-10 h-10 text-orange-500 mx-auto" />
              <h3 className="text-xl font-bold text-zinc-900">Feedback Submitted!</h3>
              <p className="text-xs text-zinc-600">
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
            <form onSubmit={handleSubmit} className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">Tool Name / Title</label>
                <Input placeholder="e.g. SVG Optimizer, Diff Checker, Cron Generator..." required className="bg-white text-zinc-900 border-zinc-200" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">Category</label>
                <select className="flex h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-800 focus:ring-2 focus:ring-orange-500/40">
                  <option>Developer Utilities</option>
                  <option>Security & Cryptography</option>
                  <option>Data & Text Utilities</option>
                  <option>CSS & Visual Tools</option>
                  <option>Asset & File Tools</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">Description & Use Case</label>
                <textarea
                  rows={4}
                  placeholder="Explain what the tool should do and why it is useful..."
                  required
                  className="flex w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 focus:ring-2 focus:ring-orange-500/40 outline-none"
                />
              </div>

              <Button type="submit" variant="default" className="w-full h-10 text-xs font-bold flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                <span>Submit Request</span>
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
