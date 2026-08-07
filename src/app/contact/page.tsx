"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [toolName, setToolName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Developer Utilities");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !email.trim() || !description.trim()) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const fullMessage = category
        ? `[Category: ${category}]\n\n${description.trim()}`
        : description.trim();

      const res = await fetch("/api/request-tool", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolName: toolName.trim(),
          name: name.trim(),
          email: email.trim(),
          message: fullMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit tool request.");
      }

      setSubmitted(true);
      setToolName("");
      setName("");
      setEmail("");
      setDescription("");
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 relative min-h-screen bg-[#FAF8F5]">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-600">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact &amp; Feedback</span>
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
              <h3 className="text-xl font-bold text-zinc-900">Request Submitted Successfully!</h3>
              <p className="text-xs text-zinc-600 leading-relaxed max-w-md mx-auto">
                Thank you for contributing to ToolVerse. Your request has been queued in our database and dispatched to our engineering team.
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
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">
                    Tool Name / Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="e.g. SVG Optimizer, Diff Checker"
                    required
                    disabled={isSubmitting}
                    className="bg-white text-zinc-900 border-zinc-200 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">
                    Your Name <span className="text-zinc-400 font-normal">(Optional)</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Krish Savaliya"
                    disabled={isSubmitting}
                    className="bg-white text-zinc-900 border-zinc-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="krish@example.com"
                    required
                    disabled={isSubmitting}
                    className="bg-white text-zinc-900 border-zinc-200 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isSubmitting}
                    className="flex h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-800 focus:ring-2 focus:ring-orange-500/40"
                  >
                    <option>Developer Utilities</option>
                    <option>Security &amp; Cryptography</option>
                    <option>Data &amp; Text Utilities</option>
                    <option>CSS &amp; Visual Tools</option>
                    <option>Asset &amp; File Tools</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-800">
                  Description &amp; Use Case <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what the tool should do and why it is useful..."
                  required
                  disabled={isSubmitting}
                  className="flex w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 focus:ring-2 focus:ring-orange-500/40 outline-none disabled:opacity-50"
                />
              </div>

              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className="w-full h-10 text-xs font-bold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
