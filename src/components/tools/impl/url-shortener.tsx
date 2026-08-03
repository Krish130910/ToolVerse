"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Trash2,
  BarChart2,
  Globe,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  displayUrl: string;
  redirectPath: string;
  shortCode: string;
  alias: string | null;
  createdAt: string;
  expiresAt: string | null;
  clicks: number;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

type ExpiresIn = "never" | "1d" | "7d" | "30d";

const EXPIRY_LABELS: Record<ExpiresIn, string> = {
  never: "Never",
  "1d": "1 Day",
  "7d": "7 Days",
  "30d": "30 Days",
};

// ─── Toast Component ─────────────────────────────────────────────────────────

const ToastList: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({
  toasts,
  onRemove,
}) => (
  <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ duration: 0.2, type: "tween" }}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold max-w-xs ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : toast.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-orange-50 border-orange-200 text-orange-800"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          ) : (
            <LinkIcon className="w-4 h-4 shrink-0 text-orange-500" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const UrlShortenerTool: React.FC = () => {
  // Form state
  const [originalUrl, setOriginalUrl] = useState("");
  const [expiresIn, setExpiresIn] = useState<ExpiresIn>("never");

  // UI Flow State: "form" | "result"
  const [activeView, setActiveView] = useState<"form" | "result">("form");

  // UI state
  const [isShortening, setIsShortening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<ShortenedLink | null>(null);
  const [recentLinks, setRecentLinks] = useState<ShortenedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // User-specific history key (isolated in browser localStorage)
  const LOCAL_STORAGE_KEY = "toolverse_user_shortener_history";

  // Load recent links from user-specific localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) setRecentLinks(JSON.parse(saved));
    } catch {}
  }, []);

  const saveLinks = useCallback((links: ShortenedLink[]) => {
    setRecentLinks(links);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(links));
    } catch {}
  }, []);

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      addToast("Short URL copied to clipboard!", "success");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const deleteLink = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = recentLinks.filter((l) => l.id !== id);
    saveLinks(updated);
    if (currentResult?.id === id) {
      setCurrentResult(null);
      setActiveView("form");
    }
    addToast("Link removed from history.", "info");
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const raw = originalUrl.trim();
    if (!raw) {
      setError("Please enter a valid URL.");
      return;
    }

    if (
      /^https?:\/\/\s*$/i.test(raw) ||
      /^https?:\/\/\/+$/i.test(raw) ||
      raw === "https:" ||
      raw === "http:" ||
      raw === "https://" ||
      raw === "http://"
    ) {
      setError("Please enter a valid URL.");
      return;
    }

    if (/^(javascript|data|file|ftp|vbscript|mailto|tel|ssh|blob):/i.test(raw)) {
      setError("Unsupported URL scheme.");
      return;
    }

    setIsShortening(true);

    try {
      const res = await fetch("/api/url-shortener/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: raw,
          expiresIn,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Failed to shorten URL. Please try again.");
        return;
      }

      const d = json.data;
      const newLink: ShortenedLink = {
        id: d.id,
        originalUrl: d.originalUrl,
        shortUrl: d.shortUrl,
        displayUrl: d.displayUrl ?? d.shortUrl,
        redirectPath: d.redirectPath ?? `/${d.shortCode}`,
        shortCode: d.shortCode,
        alias: d.customAlias ?? null,
        createdAt: new Date(d.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        expiresAt: d.expiresAt
          ? new Date(d.expiresAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : null,
        clicks: d.clicks,
      };

      setCurrentResult(newLink);
      saveLinks([newLink, ...recentLinks.filter((l) => l.id !== newLink.id).slice(0, 19)]);

      setOriginalUrl("");
      setExpiresIn("never");

      // Transition to dedicated Result Page view
      setActiveView("result");
      addToast("Short URL generated!", "success");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsShortening(false);
    }
  };

  const openResultView = (link: ShortenedLink) => {
    setCurrentResult(link);
    setActiveView("result");
  };

  return (
    <>
      <ToastList toasts={toasts} onRemove={removeToast} />

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {/* ════════════════════════════════════════════════════════════════════
              VIEW 1: FORM (GENERATE NEW SHORT LINK)
             ════════════════════════════════════════════════════════════════════ */}
          {activeView === "form" ? (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, type: "tween" }}
              className="space-y-6"
            >
              {/* Shortener Form */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
                <form onSubmit={handleShorten} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-800 uppercase tracking-wide flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-orange-500" />
                      Destination Long URL
                    </label>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <Input
                        type="text"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="Paste your long link here... (e.g. linkedin.com/in/username)"
                        className="text-sm bg-zinc-50 border-zinc-200 focus:bg-white h-12 flex-1 rounded-xl shadow-2xs font-mono"
                        autoFocus
                      />
                      <Button
                        type="submit"
                        disabled={isShortening}
                        className="h-12 px-7 font-bold text-sm gap-2 shrink-0 shadow-xs rounded-xl"
                      >
                        {isShortening ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" /> Shortening…</>
                        ) : (
                          <><LinkIcon className="w-4 h-4" /> Shorten URL</>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expiration Options */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">Link Expiry</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(["never", "1d", "7d", "30d"] as ExpiresIn[]).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setExpiresIn(opt)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            expiresIn === opt
                              ? "bg-orange-500 border-orange-500 text-white shadow-xs"
                              : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-orange-300 hover:text-orange-600"
                          }`}
                        >
                          <Clock className="w-3 h-3 inline mr-1 opacity-80" />
                          {EXPIRY_LABELS[opt]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error display */}
                  {error && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </div>
                  )}
                </form>
              </div>

              {/* User History List */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    My Created Short Links ({recentLinks.length})
                  </h3>
                  {recentLinks.length > 0 && (
                    <button
                      onClick={() => saveLinks([])}
                      className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Clear My History
                    </button>
                  )}
                </div>

                {recentLinks.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <LinkIcon className="w-8 h-8 mx-auto text-zinc-300" />
                    <p className="text-xs font-semibold text-zinc-600">No short links created yet</p>
                    <p className="text-[11px] text-zinc-400">Enter a destination URL above to generate your first short link.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {recentLinks.map((link) => (
                      <div
                        key={link.id}
                        onClick={() => openResultView(link)}
                        className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 hover:bg-orange-50/50 hover:border-orange-300 transition-all cursor-pointer group"
                      >
                        <div className="space-y-1 min-w-0 pr-4 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-orange-600 group-hover:underline truncate">
                              {link.displayUrl || link.shortUrl}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 truncate font-mono">
                            {link.originalUrl}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono pt-0.5">
                            <span className="flex items-center gap-1 font-semibold text-zinc-600">
                              <BarChart2 className="w-3 h-3 text-orange-500" /> {link.clicks} clicks
                            </span>
                            <span>•</span>
                            <span>{link.createdAt}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(link.displayUrl || link.shortUrl, link.id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-orange-600 hover:border-orange-300 transition-colors font-bold text-xs flex items-center gap-1 shadow-2xs"
                          >
                            {copiedId === link.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedId === link.id ? "Copied" : "Copy"}</span>
                          </button>
                          <a
                            href={link.redirectPath || `/${link.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-orange-600 hover:border-orange-300 transition-colors shadow-2xs"
                            title="Open Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={(e) => deleteLink(link.id, e)}
                            className="p-2 rounded-lg hover:bg-rose-100 text-rose-500 hover:text-rose-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* ════════════════════════════════════════════════════════════════════
                VIEW 2: DEDICATED LINK CREATED & ANALYTICS PAGE
               ════════════════════════════════════════════════════════════════════ */
            currentResult && (
              <motion.div
                key="result-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, type: "tween" }}
                className="space-y-6"
              >
                {/* Dedicated Top Action Bar */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveView("form")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:text-orange-600 hover:border-orange-300 transition-all shadow-2xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-orange-500" />
                    <span>Back to Link Shortener</span>
                  </button>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Link Active & Live
                  </span>
                </div>

                {/* Main Prominent Short URL Display Screen */}
                <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 text-center sm:text-left">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Your Shortened URL
                    </span>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-orange-50/60 border border-orange-200/80 p-5 rounded-2xl">
                      <a
                        href={currentResult.redirectPath || `/${currentResult.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl sm:text-4xl font-black font-mono text-orange-600 tracking-tight hover:underline break-all"
                      >
                        {currentResult.displayUrl || currentResult.shortUrl}
                      </a>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="lg"
                          onClick={() => copyToClipboard(currentResult.displayUrl || currentResult.shortUrl, currentResult.id)}
                          className="h-12 px-6 font-extrabold text-sm gap-2 shadow-xs rounded-xl cursor-pointer"
                        >
                          {copiedId === currentResult.id ? (
                            <><Check className="w-4 h-4 text-emerald-400" /> Copied!</>
                          ) : (
                            <><Copy className="w-4 h-4" /> Copy Short URL</>
                          )}
                        </Button>
                        <a
                          href={currentResult.redirectPath || `/${currentResult.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 h-12 px-5 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-800 hover:text-orange-600 hover:border-orange-300 transition-all shadow-2xs"
                        >
                          <ExternalLink className="w-4 h-4 text-orange-500" />
                          <span>Open Link</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Destination & Meta Info Cards */}
                  <div className="space-y-4">
                    {/* Destination Long URL */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Original Destination Target
                      </span>
                      <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between gap-3">
                        <p className="text-xs font-mono text-zinc-700 truncate break-all flex-1">
                          {currentResult.originalUrl}
                        </p>
                        <a
                          href={currentResult.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-orange-600 transition-colors"
                          title="Open Target URL"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Analytics Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Total Clicks</span>
                        <div className="text-lg font-extrabold font-mono text-zinc-900 flex items-center gap-1.5">
                          <BarChart2 className="w-4 h-4 text-orange-500" />
                          {currentResult.clicks}
                        </div>
                      </div>

                      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Created Date</span>
                        <div className="text-xs font-bold font-mono text-zinc-800 flex items-center gap-1.5 pt-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {currentResult.createdAt}
                        </div>
                      </div>

                      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Expiry Status</span>
                        <div className="text-xs font-bold font-mono text-zinc-800 flex items-center gap-1.5 pt-1">
                          {currentResult.expiresAt ? (
                            <span className="text-amber-600 font-semibold">{currentResult.expiresAt}</span>
                          ) : (
                            <span className="text-emerald-600 font-semibold">Never Expires</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Create Another Link Button */}
                  <div className="pt-6 border-t border-zinc-100 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setActiveView("form")}
                      className="h-11 px-8 font-bold text-xs gap-2 rounded-xl border-zinc-300 hover:border-orange-400 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-orange-500" />
                      <span>Shorten Another Link</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
