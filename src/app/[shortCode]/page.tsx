"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Clock, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type State =
  | { status: "loading" }
  | { status: "password_required" }
  | { status: "expired" }
  | { status: "not_found" }
  | { status: "redirecting"; url: string }
  | { status: "error"; message: string };

export default function ShortCodePage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.shortCode as string;

  const [state, setState] = useState<State>({ status: "loading" });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resolve = async (pw?: string) => {
    if (pw !== undefined) setIsSubmitting(true);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (pw) headers["x-url-password"] = pw;

      const res = await fetch(`/api/url-shortener/redirect/${code}`, { headers });
      const json = await res.json();

      if (res.status === 401) {
        setPasswordError("Incorrect password. Please try again.");
        setIsSubmitting(false);
        setState({ status: "password_required" });
        return;
      }
      if (res.status === 410) {
        setState({ status: "expired" });
        return;
      }
      if (res.status === 404) {
        setState({ status: "not_found" });
        return;
      }
      if (!res.ok || !json.success) {
        setState({ status: "error", message: json.error ?? "Something went wrong." });
        return;
      }

      const { originalUrl } = json.data;
      setState({ status: "redirecting", url: originalUrl });
      // Small delay so user sees the redirect screen
      setTimeout(() => {
        window.location.href = originalUrl;
      }, 800);
    } catch {
      setState({ status: "error", message: "Network error. Please try again." });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (code) resolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (!password.trim()) {
      setPasswordError("Please enter the password.");
      return;
    }
    resolve(password.trim());
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: "tween" }}
        className="w-full max-w-md"
      >
        {/* Loading */}
        {state.status === "loading" && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center shadow-xs space-y-4">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
            <p className="text-sm font-medium text-zinc-600">Resolving link…</p>
          </div>
        )}

        {/* Password Required */}
        {state.status === "password_required" && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-xs space-y-5">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200">
                <Lock className="w-5 h-5 text-amber-500" />
              </div>
              <h1 className="text-lg font-extrabold text-zinc-900">Password Protected</h1>
              <p className="text-xs text-zinc-500">
                This link is password protected. Enter the password to continue.
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password…"
                className="h-11 bg-zinc-50 border-zinc-200 focus:bg-white text-sm"
                autoFocus
              />
              {passwordError && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {passwordError}
                </p>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 font-bold text-sm"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                ) : (
                  "Continue to Link"
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Expired */}
        {state.status === "expired" && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center shadow-xs space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200">
              <Clock className="w-5 h-5 text-zinc-400" />
            </div>
            <h1 className="text-lg font-extrabold text-zinc-900">Link Expired</h1>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              This short link has expired and is no longer active.
            </p>
            <Button variant="outline" size="sm" onClick={() => router.push("/tools/url-shortener")}>
              Create a New Short Link
            </Button>
          </div>
        )}

        {/* Not Found */}
        {state.status === "not_found" && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center shadow-xs space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-500" />
            </div>
            <h1 className="text-lg font-extrabold text-zinc-900">Link Not Found</h1>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              This short link doesn't exist or may have been deleted.
            </p>
            <Button variant="outline" size="sm" onClick={() => router.push("/")}>
              Back to ToolVerse
            </Button>
          </div>
        )}

        {/* Redirecting */}
        {state.status === "redirecting" && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center shadow-xs space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200">
              <ExternalLink className="w-5 h-5 text-orange-500" />
            </div>
            <h1 className="text-lg font-extrabold text-zinc-900">Redirecting…</h1>
            <p className="text-xs text-zinc-500 font-mono truncate max-w-xs mx-auto">
              {state.url}
            </p>
          </div>
        )}

        {/* Error */}
        {state.status === "error" && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center shadow-xs space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-500" />
            </div>
            <h1 className="text-lg font-extrabold text-zinc-900">Something Went Wrong</h1>
            <p className="text-xs text-zinc-500">{state.message}</p>
            <Button variant="outline" size="sm" onClick={() => resolve()}>
              Try Again
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
