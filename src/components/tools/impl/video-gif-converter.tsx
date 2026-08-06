"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GifOutputWidth,
  GifFps,
  GifQuality,
  GifLoop,
  VideoMetadata,
  GifConversionResult,
  extractVideoMetadata,
  convertVideoToGif,
} from "@/lib/video-gif-converter";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  Film,
  RefreshCw,
  XCircle,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Copy,
  FileVideo,
  ChevronDown,
  Check,
  ShieldCheck,
} from "lucide-react";
import { VideoPreviewPlayer } from "./video-gif-converter/video-preview-player";

const WIDTH_OPTIONS: { id: GifOutputWidth; label: string }[] = [
  { id: "original", label: "Original Resolution" },
  { id: 320, label: "320px Width" },
  { id: 480, label: "480px Width" },
  { id: 640, label: "640px Width" },
  { id: 720, label: "720px Width" },
];

const FPS_OPTIONS: { id: GifFps; label: string }[] = [
  { id: 10, label: "10 FPS (Compact)" },
  { id: 12, label: "12 FPS" },
  { id: 15, label: "15 FPS (Standard)" },
  { id: 20, label: "20 FPS" },
  { id: 24, label: "24 FPS (Smooth)" },
  { id: 30, label: "30 FPS (High Speed)" },
];

export const VideoGifConverterTool: React.FC = () => {
  // Source State
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceMetadata, setSourceMetadata] = useState<VideoMetadata | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  // Trim State
  const [startTimeSec, setStartTimeSec] = useState<number>(0);
  const [endTimeSec, setEndTimeSec] = useState<number>(5);

  // Settings State
  const [outputWidth, setOutputWidth] = useState<GifOutputWidth>(640);
  const [fps, setFps] = useState<GifFps>(15);
  const [quality, setQuality] = useState<GifQuality>("high");
  const [loop, setLoop] = useState<GifLoop>(0);

  // Custom ToolVerse Popover Dropdown States
  const [isWidthDropdownOpen, setIsWidthDropdownOpen] = useState<boolean>(false);
  const [isFpsDropdownOpen, setIsFpsDropdownOpen] = useState<boolean>(false);

  // Transcoding Feedback State
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [frameCount, setFrameCount] = useState<number>(0);
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<GifConversionResult | null>(null);
  const [copiedInfo, setCopiedInfo] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // File Loader
  const processVideoFile = async (file: File) => {
    setConversionError(null);
    setConversionResult(null);

    try {
      const { metadata, videoUrl } = await extractVideoMetadata(file);
      setSourceFile(file);
      setSourceMetadata(metadata);

      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      setSourceUrl(videoUrl);

      setStartTimeSec(0);
      setEndTimeSec(Math.min(10, metadata.durationSec));
    } catch (err: any) {
      setConversionError(err?.message || "Failed to load video file.");
      handleRemoveVideo();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processVideoFile(file);
  };

  // Convert Executer
  const handleStartConversion = async () => {
    if (!sourceFile || !sourceUrl) return;

    setIsConverting(true);
    setProgressPercent(0);
    setFrameCount(0);
    setTotalFrames(0);
    setConversionError(null);

    abortControllerRef.current = new AbortController();

    try {
      const result = await convertVideoToGif({
        videoFile: sourceFile,
        videoUrl: sourceUrl,
        startTimeSec,
        endTimeSec,
        outputWidth,
        fps,
        quality,
        loop,
        onProgress: (pct, count, total) => {
          setProgressPercent(pct);
          setFrameCount(count);
          setTotalFrames(total);
        },
        signal: abortControllerRef.current.signal,
      });

      setConversionResult(result);
    } catch (err: any) {
      if (err?.message !== "Conversion cancelled by user.") {
        setConversionError(err?.message || "Failed to generate GIF.");
      }
    } finally {
      setIsConverting(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelConversion = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsConverting(false);
    }
  };

  const handleRemoveVideo = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceFile(null);
    setSourceMetadata(null);
    setSourceUrl(null);
    setConversionResult(null);
    setConversionError(null);
  };

  const handleCopySummary = () => {
    if (!conversionResult || !sourceMetadata) return;
    const text = `ToolVerse GIF Summary:
Input: ${sourceMetadata.filename} (${sourceMetadata.formattedSize})
Output: ${conversionResult.filename} (${conversionResult.resolutionLabel}, ${conversionResult.formattedSize})
FPS: ${fps} | Frames: ${conversionResult.frameCount}`;
    navigator.clipboard.writeText(text);
    setCopiedInfo(true);
    setTimeout(() => setCopiedInfo(false), 2000);
  };

  const currentWidthLabel = WIDTH_OPTIONS.find((w) => w.id === outputWidth)?.label || "640px Width";
  const currentFpsLabel = FPS_OPTIONS.find((f) => f.id === fps)?.label || "15 FPS (Standard)";

  return (
    <div className="w-full text-zinc-900 font-sans" role="region" aria-label="Video to GIF Converter">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,.mp4,.mov,.webm,.avi,.mkv,.m4v"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* ERROR DISPLAY */}
      {conversionError && (
        <div className="mb-4">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{conversionError}</span>
            </div>
            <button onClick={() => setConversionError(null)} className="font-semibold text-rose-600 hover:text-rose-900">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* WORKSPACE AREA: BALANCED STRETCH & PERFECT PROPORTIONS */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
        
        {/* LEFT SIDEBAR: PERFECTLY BALANCED STRETCH CARD */}
        <aside className="w-full lg:w-72 shrink-0 bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-5">
          <div className="space-y-5">
            {/* SOURCE FILE METADATA */}
            {sourceMetadata && (
              <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-200/60 pb-1.5 font-bold text-zinc-700">
                  <span className="truncate max-w-[140px]">{sourceMetadata.filename}</span>
                  <span className="font-mono text-[10px] bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-700">
                    {sourceMetadata.format}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-zinc-500 font-mono">
                  <div>Duration: {sourceMetadata.formattedDuration}</div>
                  <div>Size: {sourceMetadata.formattedSize}</div>
                </div>
              </div>
            )}

            {/* PRIMARY CONVERT ACTION BUTTON */}
            <Button
              onClick={handleStartConversion}
              disabled={!sourceFile || isConverting}
              variant="default"
              size="sm"
              className="w-full text-xs font-bold gap-2 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl shadow-2xs cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isConverting ? "animate-spin" : ""}`} />
              <span>{isConverting ? "Converting..." : "Convert to GIF →"}</span>
            </Button>

            {/* GIF SETTINGS */}
            <div className="space-y-4 pt-2 border-t border-zinc-100">
              <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase block">
                Conversion Settings
              </span>

              {/* OUTPUT WIDTH */}
              <div className="space-y-1 relative">
                <label className="text-xs font-semibold text-zinc-700 block">Output Width:</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsWidthDropdownOpen(!isWidthDropdownOpen);
                    setIsFpsDropdownOpen(false);
                  }}
                  className="w-full h-9 px-3 rounded-xl border border-zinc-200 bg-white hover:border-orange-400 text-xs font-semibold text-zinc-800 flex items-center justify-between shadow-2xs transition-all cursor-pointer"
                >
                  <span className="truncate">{currentWidthLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isWidthDropdownOpen ? "rotate-180 text-orange-600" : ""}`} />
                </button>

                <AnimatePresence>
                  {isWidthDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-0 top-full mt-1 z-[100] w-full bg-white border border-zinc-200 rounded-xl shadow-xl p-1 space-y-0.5"
                    >
                      {WIDTH_OPTIONS.map((w) => {
                        const isSelected = outputWidth === w.id;
                        return (
                          <button
                            key={String(w.id)}
                            type="button"
                            onClick={() => {
                              setOutputWidth(w.id);
                              setIsWidthDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            <span>{w.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* FRAMERATE (FPS) */}
              <div className="space-y-1 relative">
                <label className="text-xs font-semibold text-zinc-700 block">Framerate (FPS):</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsFpsDropdownOpen(!isFpsDropdownOpen);
                    setIsWidthDropdownOpen(false);
                  }}
                  className="w-full h-9 px-3 rounded-xl border border-zinc-200 bg-white hover:border-orange-400 text-xs font-semibold text-zinc-800 flex items-center justify-between shadow-2xs transition-all cursor-pointer"
                >
                  <span className="truncate">{currentFpsLabel}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isFpsDropdownOpen ? "rotate-180 text-orange-600" : ""}`} />
                </button>

                <AnimatePresence>
                  {isFpsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute left-0 top-full mt-1 z-[100] w-full bg-white border border-zinc-200 rounded-xl shadow-xl p-1 space-y-0.5"
                    >
                      {FPS_OPTIONS.map((f) => {
                        const isSelected = fps === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              setFps(f.id);
                              setIsFpsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                              isSelected
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            <span>{f.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* QUALITY PRESET */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 block">Quality:</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["low", "medium", "high"] as GifQuality[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`py-1.5 rounded-lg text-[11px] font-medium capitalize border transition-all cursor-pointer ${
                        quality === q
                          ? "bg-orange-50 text-orange-600 border-orange-300 font-bold shadow-2xs"
                          : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* LOOP OPTION */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 block">Looping:</label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setLoop(0)}
                    className={`py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                      loop === 0
                        ? "bg-orange-50 text-orange-600 border-orange-300 font-bold shadow-2xs"
                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    Infinite
                  </button>
                  <button
                    onClick={() => setLoop(-1)}
                    className={`py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                      loop === -1
                        ? "bg-orange-50 text-orange-600 border-orange-300 font-bold shadow-2xs"
                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    Once
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM FOOTER CALLOUT / ACTIONS */}
          {sourceFile ? (
            <div className="pt-3 border-t border-zinc-100 space-y-1.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 text-zinc-600 hover:text-orange-600 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Replace Video</span>
              </button>

              <button
                onClick={handleRemoveVideo}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium py-1 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove Video</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% In-Browser Transcoder • Zero Data Uploaded</span>
            </div>
          )}
        </aside>

        {/* MAIN PANEL WORKSPACE */}
        <main className="flex-1 space-y-5 w-full flex flex-col justify-between">
          {/* TRANSCODING PROGRESS CARD */}
          {isConverting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-white border border-orange-200 rounded-2xl shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-bold text-orange-600">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Rendering GIF frames ({frameCount}/{totalFrames})...
                </span>
                <span className="font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-orange-100 overflow-hidden">
                <div
                  className="h-full bg-orange-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleCancelConversion}
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 h-7"
                >
                  <XCircle className="w-3 h-3 mr-1" /> Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* EMPTY HERO DROPZONE (WELL-PROPORTIONED HEIGHT MATCHING SIDEBAR) */}
          {!sourceFile ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full flex-1 min-h-[420px] bg-white border-2 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 cursor-pointer transition-all shadow-2xs ${
                isDragOver ? "border-orange-500 bg-orange-50/30" : "border-zinc-200 hover:border-orange-400"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
                <FileVideo className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">Drop your video here</h3>
                <p className="text-xs text-zinc-500">or click to browse from your computer</p>
              </div>

              <Button type="button" variant="default" size="sm" className="text-xs font-bold px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-2xs">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Browse Video File
              </Button>

              <span className="text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-100">
                Supports MP4 • MOV • WebM • AVI • MKV
              </span>
            </div>
          ) : (
            /* LOADED VIDEO WORKSPACE */
            <div className="space-y-5 flex-1">
              {sourceUrl && sourceMetadata && (
                <VideoPreviewPlayer
                  videoUrl={sourceUrl}
                  durationSec={sourceMetadata.durationSec}
                  startTimeSec={startTimeSec}
                  endTimeSec={endTimeSec}
                  onTrimChange={(start, end) => {
                    setStartTimeSec(start);
                    setEndTimeSec(end);
                  }}
                />
              )}

              {/* CONVERTED RESULT */}
              {conversionResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-white border border-emerald-200/90 rounded-2xl space-y-4 shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-zinc-900">Exported Animated GIF</span>
                    </div>

                    <a href={conversionResult.downloadUrl} download={conversionResult.filename}>
                      <Button variant="default" size="sm" className="text-xs font-bold px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download GIF</span>
                      </Button>
                    </a>
                  </div>

                  <div className="bg-zinc-900 rounded-xl p-3 flex items-center justify-center min-h-[220px]">
                    <img
                      src={conversionResult.downloadUrl}
                      alt={conversionResult.filename}
                      className="max-h-[300px] w-auto mx-auto block rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                    <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg">
                      <span className="text-[10px] text-zinc-400 block uppercase font-sans">Resolution</span>
                      <span className="font-bold text-zinc-800">{conversionResult.resolutionLabel}</span>
                    </div>
                    <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg">
                      <span className="text-[10px] text-zinc-400 block uppercase font-sans">Size</span>
                      <span className="font-bold text-zinc-800">{conversionResult.formattedSize}</span>
                    </div>
                    <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg">
                      <span className="text-[10px] text-zinc-400 block uppercase font-sans">Frames</span>
                      <span className="font-bold text-zinc-800">{conversionResult.frameCount}</span>
                    </div>
                    <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg">
                      <span className="text-[10px] text-zinc-400 block uppercase font-sans">FPS</span>
                      <span className="font-bold text-zinc-800">{conversionResult.fps}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      onClick={handleCopySummary}
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold text-zinc-700 rounded-xl gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{copiedInfo ? "Copied!" : "Copy Details"}</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
