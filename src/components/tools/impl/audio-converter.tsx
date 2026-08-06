"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AudioFormat,
  BitrateOption,
  SampleRateOption,
  ChannelOption,
  AudioMetadata,
  AudioConversionResult,
  extractAudioMetadata,
  convertAudioFile,
} from "@/lib/audio-converter";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  Music,
  RefreshCw,
  FileAudio,
  Radio,
  Copy,
  XCircle,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import { WaveformPlayer } from "./audio-converter/waveform-player";

const FORMAT_DROPDOWN_OPTIONS: { id: AudioFormat; label: string }[] = [
  { id: "mp3", label: "MP3 (.mp3)" },
  { id: "wav", label: "WAV (.wav)" },
  { id: "ogg", label: "OGG (.ogg)" },
  { id: "aac", label: "AAC (.aac)" },
  { id: "flac", label: "FLAC (.flac)" },
  { id: "m4a", label: "M4A (.m4a)" },
  { id: "opus", label: "OPUS (.opus)" },
];

const BITRATE_OPTIONS: BitrateOption[] = [64, 128, 192, 256, 320];
const SAMPLE_RATE_OPTIONS: { value: SampleRateOption; label: string }[] = [
  { value: 22050, label: "22.05 kHz" },
  { value: 32000, label: "32.00 kHz" },
  { value: 44100, label: "44.10 kHz (CD Standard)" },
  { value: 48000, label: "48.00 kHz (Studio Standard)" },
  { value: 96000, label: "96.00 kHz (High-Res)" },
];

export const AudioConverterTool: React.FC = () => {
  // Source State
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceMetadata, setSourceMetadata] = useState<AudioMetadata | null>(null);
  const [sourceAudioBuffer, setSourceAudioBuffer] = useState<AudioBuffer | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  // Conversion Settings State
  const [targetFormat, setTargetFormat] = useState<AudioFormat>("mp3");
  const [bitrate, setBitrate] = useState<BitrateOption>(192);
  const [sampleRate, setSampleRate] = useState<SampleRateOption>(44100);
  const [channels, setChannels] = useState<ChannelOption>("stereo");
  const [preserveMetadata, setPreserveMetadata] = useState<boolean>(true);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Conversion Execution & Feedback State
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [etaSec, setEtaSec] = useState<number>(0);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<AudioConversionResult | null>(null);
  const [copiedInfo, setCopiedInfo] = useState<boolean>(false);

  // UI Drag & Drop State
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle Source Audio File Load
  const processAudioFile = async (file: File) => {
    setConversionError(null);
    setConversionResult(null);

    try {
      const { metadata, audioBuffer } = await extractAudioMetadata(file);
      setSourceFile(file);
      setSourceMetadata(metadata);
      setSourceAudioBuffer(audioBuffer);

      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      const url = URL.createObjectURL(file);
      setSourceUrl(url);

      if (metadata.sampleRate) {
        const closestSR = SAMPLE_RATE_OPTIONS.find((s) => s.value === metadata.sampleRate)?.value || 44100;
        setSampleRate(closestSR);
      }
      setChannels(metadata.numberOfChannels === 1 ? "mono" : "stereo");
    } catch (err: any) {
      setConversionError(err?.message || "Failed to process audio file.");
      handleRemoveAudio();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAudioFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processAudioFile(file);
  };

  // Execute Transcoding
  const handleStartConversion = async () => {
    if (!sourceFile) return;

    setIsConverting(true);
    setProgressPercent(0);
    setEtaSec(0);
    setConversionError(null);

    abortControllerRef.current = new AbortController();

    try {
      const result = await convertAudioFile({
        file: sourceFile,
        targetFormat,
        bitrateKbps: bitrate,
        targetSampleRate: sampleRate,
        channels,
        preserveMetadata,
        onProgress: (pct, _elapsedSec, eta) => {
          setProgressPercent(pct);
          setEtaSec(Math.ceil(eta));
        },
        signal: abortControllerRef.current.signal,
      });

      setConversionResult(result);
    } catch (err: any) {
      if (err?.message !== "Conversion cancelled by user.") {
        setConversionError(err?.message || "An unexpected error occurred during audio conversion.");
      }
    } finally {
      setIsConverting(false);
      abortControllerRef.current = null;
    }
  };

  // Cancel Ongoing Conversion
  const handleCancelConversion = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsConverting(false);
      setProgressPercent(0);
    }
  };

  // Remove Audio / Clear File
  const handleRemoveAudio = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setSourceFile(null);
    setSourceMetadata(null);
    setSourceAudioBuffer(null);
    setSourceUrl(null);
    setConversionResult(null);
    setConversionError(null);
  };

  // Copy Summary Information
  const handleCopySummary = () => {
    if (!conversionResult || !sourceMetadata) return;
    const text = `ToolVerse Audio Conversion Summary:
Input File: ${sourceMetadata.filename} (${sourceMetadata.formattedSize}, ${sourceMetadata.formattedDuration})
Output Format: ${conversionResult.outputFormat.toUpperCase()}
Output File: ${conversionResult.filename} (${conversionResult.formattedSize})`;
    navigator.clipboard.writeText(text);
    setCopiedInfo(true);
    setTimeout(() => setCopiedInfo(false), 2000);
  };

  return (
    <div className="w-full text-zinc-900 font-sans space-y-6" role="region" aria-label="Audio Converter Workstation">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.aac,.flac,.m4a,.opus,.wma"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* ERROR ALERT DISPLAY */}
      {conversionError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{conversionError}</span>
          </div>
          <button onClick={() => setConversionError(null)} className="text-rose-500 hover:text-rose-800 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* STATE 1: BEFORE UPLOAD — ELEGANT AUDIO UPLOAD HERO BANNER (BETWEEN INTRO & WORKSPACE) */}
      {!sourceFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full min-h-[380px] bg-white border-2 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-5 cursor-pointer transition-all shadow-2xs ${
            isDragOver ? "border-orange-500 bg-orange-50/40" : "border-zinc-200 hover:border-orange-400 bg-white"
          }`}
        >
          {/* Headphones Icon Badge from Image 4 */}
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200 shadow-2xs">
            <FileAudio className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Select Audio File</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
              Upload an audio file to analyze duration, sample rate, bitrate, and reveal output conversion options.
            </p>
          </div>

          <Button
            type="button"
            variant="default"
            size="lg"
            className="text-xs font-bold px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Browse Audio File</span>
          </Button>

          <span className="text-[11px] font-mono text-zinc-400 font-semibold pt-2 border-t border-zinc-100">
            Supports MP3 • WAV • AAC • FLAC • OGG • OPUS
          </span>
        </div>
      ) : (
        /* STATE 2: AFTER UPLOAD — FULL AUDIO STUDIO WORKSPACE */
        <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
          
          {/* SIDEBAR: METADATA & CONVERSION CONTROLS */}
          <aside className="w-full lg:w-72 shrink-0 bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-2xs space-y-5 h-fit">
            {/* SOURCE METADATA INFORMATION CARD */}
            {sourceMetadata && (
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700 border-b border-zinc-200/60 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-orange-500" /> File Details
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                    {sourceMetadata.format}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Duration:</span>
                    <span className="font-mono font-semibold text-zinc-800">{sourceMetadata.formattedDuration}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">File Size:</span>
                    <span className="font-mono font-semibold text-zinc-800">{sourceMetadata.formattedSize}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Sample Rate:</span>
                    <span className="font-mono font-semibold text-zinc-800">{sourceMetadata.sampleRate} Hz</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Channels:</span>
                    <span className="font-mono font-semibold text-zinc-800">{sourceMetadata.numberOfChannels === 1 ? "Mono" : "Stereo"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* START CONVERSION BUTTON */}
            <Button
              onClick={handleStartConversion}
              disabled={isConverting}
              variant="default"
              size="sm"
              className="w-full text-xs font-bold gap-2 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isConverting ? "animate-spin" : ""}`} />
              <span>{isConverting ? "Transcoding..." : "Convert Audio →"}</span>
            </Button>

            {/* CONVERSION SETTINGS */}
            <div className="space-y-4 pt-2 border-t border-zinc-100">
              <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                CONVERSION SETTINGS
              </span>

              {/* OUTPUT FORMAT PICKER */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Output Format:</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as AudioFormat)}
                  className="w-full h-9 px-3 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none focus:border-orange-500 shadow-2xs cursor-pointer"
                >
                  {FORMAT_DROPDOWN_OPTIONS.map((fmt) => (
                    <option key={fmt.id} value={fmt.id}>
                      {fmt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* ADVANCED SETTINGS ACCORDION */}
              <div className="pt-2 border-t border-zinc-100">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-xs font-bold text-zinc-600 hover:text-orange-600 py-1 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-orange-500" />
                    Advanced Settings
                  </span>
                  {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 pt-3 overflow-hidden"
                    >
                      {/* Bitrate Selector */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-600 block">Bitrate:</label>
                        <select
                          value={bitrate}
                          onChange={(e) => setBitrate(Number(e.target.value) as BitrateOption)}
                          className="w-full h-8 px-2.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-800"
                        >
                          {BITRATE_OPTIONS.map((b) => (
                            <option key={b} value={b}>
                              {b} kbps {b === 192 ? "(Default)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sample Rate Selector */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-600 block">Sample Rate:</label>
                        <select
                          value={sampleRate}
                          onChange={(e) => setSampleRate(Number(e.target.value) as SampleRateOption)}
                          className="w-full h-8 px-2.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-800"
                        >
                          {SAMPLE_RATE_OPTIONS.map((sr) => (
                            <option key={sr.value} value={sr.value}>
                              {sr.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Audio Channels */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-600 block">Channels:</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => setChannels("stereo")}
                            className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              channels === "stereo"
                                ? "bg-orange-50 text-orange-600 border-orange-400"
                                : "bg-white text-zinc-700 border-zinc-200"
                            }`}
                          >
                            Stereo
                          </button>
                          <button
                            onClick={() => setChannels("mono")}
                            className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              channels === "mono"
                                ? "bg-orange-50 text-orange-600 border-orange-400"
                                : "bg-white text-zinc-700 border-zinc-200"
                            }`}
                          >
                            Mono
                          </button>
                        </div>
                      </div>

                      {/* Preserve Metadata Toggle */}
                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-600">Preserve Metadata</span>
                        <button
                          onClick={() => setPreserveMetadata(!preserveMetadata)}
                          className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${
                            preserveMetadata ? "bg-orange-500" : "bg-zinc-300"
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                              preserveMetadata ? "translate-x-3.5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Replace / Remove Audio Buttons */}
            <div className="pt-4 border-t border-zinc-100 space-y-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-xl border border-zinc-200 text-zinc-700 hover:border-orange-400 hover:text-orange-600 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Replace Audio</span>
              </button>

              <button
                onClick={handleRemoveAudio}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-1.5 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Audio</span>
              </button>
            </div>
          </aside>

          {/* MAIN PANEL WORKSPACE */}
          <main className="flex-1 space-y-6 w-full">
            {/* REAL-TIME CONVERSION PROGRESS CARD */}
            {isConverting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-white border border-orange-200 rounded-2xl shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-600 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Transcoding to {targetFormat.toUpperCase()}...
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-800">
                    {progressPercent}% {etaSec > 0 && `(ETA ~${etaSec}s)`}
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-orange-100 overflow-hidden">
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
                    className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel Conversion
                  </Button>
                </div>
              </motion.div>
            )}

            {/* WAVEFORM TIMELINE PLAYER */}
            <div className="space-y-6">
              <WaveformPlayer
                audioUrl={sourceUrl}
                audioBuffer={sourceAudioBuffer}
                title={sourceFile.name}
                themeColor="#EA580C"
                height={160}
              />

              {/* CONVERTED AUDIO RESULT SECTION */}
              {conversionResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white border border-emerald-200/90 rounded-2xl shadow-sm space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900">Converted Audio Output</h3>
                        <p className="text-[11px] text-zinc-500">Transcoded to {conversionResult.outputFormat.toUpperCase()} in {conversionResult.conversionTimeMs}ms</p>
                      </div>
                    </div>

                    <a href={conversionResult.downloadUrl} download={conversionResult.filename}>
                      <Button variant="default" size="sm" className="text-xs font-bold px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs gap-2">
                        <Download className="w-4 h-4" />
                        <span>Download {conversionResult.filename}</span>
                      </Button>
                    </a>
                  </div>

                  <WaveformPlayer
                    audioUrl={conversionResult.downloadUrl}
                    title={`Output: ${conversionResult.filename}`}
                    themeColor="#10B981"
                    height={120}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Output Format:</span>
                      <span className="block font-mono font-bold text-zinc-800 text-xs">{conversionResult.outputFormat.toUpperCase()}</span>
                    </div>

                    <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Output File Size:</span>
                      <span className="block font-mono font-bold text-zinc-800 text-xs">{conversionResult.formattedSize}</span>
                    </div>

                    <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Bitrate / Sample Rate:</span>
                      <span className="block font-mono font-bold text-zinc-800 text-xs">{bitrate} kbps @ {sampleRate} Hz</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={handleCopySummary}
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-100 rounded-xl gap-2"
                    >
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{copiedInfo ? "Summary Copied!" : "Copy Audio Info"}</span>
                    </Button>

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-100 rounded-xl gap-2"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Replace Audio</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};
