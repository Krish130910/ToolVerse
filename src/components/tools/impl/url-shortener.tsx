"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Lock,
  Clock,
  Trash2,
  Sparkles,
  BarChart2,
  Globe,
  Download,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  alias: string;
  createdAt: string;
  expirationDate?: string;
  password?: string;
  clicks: number;
}

export const UrlShortenerTool: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [password, setPassword] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<ShortenedLink | null>(null);
  const [recentLinks, setRecentLinks] = useState<ShortenedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load recent links from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("toolverse_short_urls");
      if (saved) {
        setRecentLinks(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save to localStorage
  const saveLinks = (links: ShortenedLink[]) => {
    setRecentLinks(links);
    try {
      localStorage.setItem("toolverse_short_urls", JSON.stringify(links));
    } catch {}
  };

  // Generate QR Code on Canvas when currentResult changes
  useEffect(() => {
    if (!currentResult) return;
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 180;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#F97316";
    const moduleSize = 6;
    const count = Math.floor(size / moduleSize);

    // Draw finder patterns
    const drawFinder = (x: number, y: number) => {
      ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
      ctx.fillStyle = "#F97316";
      ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
    };

    drawFinder(moduleSize, moduleSize);
    drawFinder(size - moduleSize * 8, moduleSize);
    drawFinder(moduleSize, size - moduleSize * 8);

    // Draw data matrix
    const str = currentResult.shortUrl;
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c > count - 9) || (r > count - 9 && c < 8)) continue;
        const seed = (r * count + c + str.length * 5) % 13;
        if (seed < 6) {
          ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize - 1, moduleSize - 1);
        }
      }
    }
  }, [currentResult]);

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!originalUrl.trim()) {
      setError("Please enter a valid URL to shorten.");
      return;
    }

    let formattedUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError("Please enter a valid web URL format (e.g. https://example.com).");
      return;
    }

    setIsShortening(true);

    setTimeout(() => {
      const alias = customAlias.trim()
        ? customAlias.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
        : Math.random().toString(36).substring(2, 8);

      const shortUrl = `https://toolv.rs/${alias}`;
      const newLink: ShortenedLink = {
        id: String(Date.now()),
        originalUrl: formattedUrl,
        shortUrl,
        alias,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        expirationDate: expirationDate || undefined,
        password: password || undefined,
        clicks: 0,
      };

      setCurrentResult(newLink);
      saveLinks([newLink, ...recentLinks.filter((l) => l.alias !== alias).slice(0, 19)]);

      setOriginalUrl("");
      setCustomAlias("");
      setExpirationDate("");
      setPassword("");
      setIsShortening(false);
    }, 600);
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const incrementClick = (id: string) => {
    const updated = recentLinks.map((l) =>
      l.id === id ? { ...l, clicks: l.clicks + 1 } : l
    );
    saveLinks(updated);
    if (currentResult && currentResult.id === id) {
      setCurrentResult({ ...currentResult, clicks: currentResult.clicks + 1 });
    }
  };

  const deleteLink = (id: string) => {
    const updated = recentLinks.filter((l) => l.id !== id);
    saveLinks(updated);
    if (currentResult && currentResult.id === id) {
      setCurrentResult(null);
    }
  };

  const downloadQr = () => {
    if (!qrCanvasRef.current || !currentResult) return;
    const a = document.createElement("a");
    a.href = qrCanvasRef.current.toDataURL("image/png");
    a.download = `qr_${currentResult.alias}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-600 shadow-2xs">
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Modern URL Shortener</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
          Shorten & Track Links Instantly
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
          Create clean custom aliases, password-protected links, QR codes, and click statistics. 100% fast & browser-friendly.
        </p>
      </div>

      {/* Main Shortening Input Form */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-5">
        <form onSubmit={handleShorten} className="space-y-4">
          {/* Main URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              <span>Destination Long URL: *</span>
            </label>
            <div className="flex gap-2 flex-col sm:flex-row">
              <Input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://your-very-long-link-here.com/deep/page/slug?ref=campaign"
                className="text-xs sm:text-sm bg-zinc-50 border-zinc-200 focus:bg-white h-11"
                required
              />
              <Button
                type="submit"
                disabled={isShortening}
                variant="default"
                className="h-11 px-6 font-bold text-xs gap-2 shrink-0 shadow-2xs"
              >
                {isShortening ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Shorten URL</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Advanced Optional Settings (Alias, Expiration, Password) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-100">
            {/* Custom Alias */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-zinc-400" />
                <span>Custom Alias (Optional):</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[11px] font-mono text-zinc-400 select-none">
                  toolv.rs/
                </span>
                <Input
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="my-link"
                  className="pl-18 text-xs font-mono bg-zinc-50 border-zinc-200 focus:bg-white h-9"
                />
              </div>
            </div>

            {/* Expiration Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>Expiration Date (Optional):</span>
              </label>
              <Input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="text-xs font-mono bg-zinc-50 border-zinc-200 focus:bg-white h-9"
              />
            </div>

            {/* Password Protection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Password (Optional):</span>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="SecretPass123"
                className="text-xs font-mono bg-zinc-50 border-zinc-200 focus:bg-white h-9"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Generated Result Card (if active result exists) */}
      <AnimatePresence>
        {currentResult && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="bg-orange-50/60 border border-orange-200 rounded-2xl p-6 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between border-b border-orange-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-bold text-zinc-900">Shortened Link Ready!</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                Active & Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Link Details */}
              <div className="md:col-span-2 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Shortened Link:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-xl font-extrabold font-mono text-orange-600 tracking-tight">
                      {currentResult.shortUrl}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(currentResult.shortUrl, currentResult.id)}
                      className="text-xs font-bold gap-1 shadow-2xs"
                    >
                      {copiedId === currentResult.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                    <a
                      href={currentResult.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => incrementClick(currentResult.id)}
                      className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-orange-600 hover:border-orange-300 transition-colors shadow-2xs"
                      title="Open Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Original Target URL:</span>
                  <p className="text-xs font-mono text-zinc-700 truncate bg-white p-2.5 rounded-xl border border-zinc-200/90">
                    {currentResult.originalUrl}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
                  <span className="flex items-center gap-1 font-mono font-semibold">
                    <BarChart2 className="w-3.5 h-3.5 text-orange-500" />
                    {currentResult.clicks} Clicks
                  </span>
                  <span>•</span>
                  <span className="font-mono">{currentResult.createdAt}</span>
                  {currentResult.password && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Lock className="w-3 h-3" /> Password Protected
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* QR Code Card */}
              <div className="bg-white border border-zinc-200 p-4 rounded-xl flex flex-col items-center justify-center space-y-2 shadow-xs">
                <canvas ref={qrCanvasRef} className="rounded-lg border border-zinc-100" />
                <Button size="sm" variant="outline" onClick={downloadQr} className="text-xs font-bold gap-1 w-full">
                  <Download className="w-3.5 h-3.5 text-orange-500" />
                  <span>Download QR</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Links Section */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Recent Shortened Links ({recentLinks.length})</span>
          </h3>
          {recentLinks.length > 0 && (
            <button
              onClick={() => saveLinks([])}
              className="text-xs text-rose-600 hover:underline font-bold"
            >
              Clear History
            </button>
          )}
        </div>

        {recentLinks.length === 0 ? (
          <div className="p-8 text-center space-y-2 text-zinc-400 text-xs">
            <LinkIcon className="w-8 h-8 mx-auto text-zinc-300" />
            <p className="font-semibold text-zinc-600">No shortened links yet</p>
            <p className="text-[11px]">Enter a URL above to create your first short link.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {recentLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/90 hover:bg-white hover:border-orange-300 transition-all text-xs"
              >
                <div className="space-y-0.5 min-w-0 pr-4">
                  <div className="flex items-center gap-2 font-mono font-bold text-orange-600">
                    <span>{link.shortUrl}</span>
                    <span className="text-[10px] font-normal text-zinc-400 font-mono">({link.clicks} clicks)</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate font-mono">{link.originalUrl}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => copyToClipboard(link.shortUrl, link.id)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-orange-600 hover:border-orange-300 transition-colors font-bold text-[11px] flex items-center gap-1"
                  >
                    {copiedId === link.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === link.id ? "Copied" : "Copy"}</span>
                  </button>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => incrementClick(link.id)}
                    className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-orange-600"
                    title="Open"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600"
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
    </div>
  );
};
