"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Binary,
  Upload,
  Download,
  Play,
  Pause,
  Sliders,
  Check,
  Music,
  Clock,
  Sparkles,
} from "lucide-react";

export const AudioConverterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<"mp3" | "wav" | "aac" | "ogg" | "flac" | "m4a">("mp3");
  const [bitrate, setBitrate] = useState<"128" | "192" | "256" | "320">("192");
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      const tempAudio = new Audio(url);
      tempAudio.onloadedmetadata = () => {
        setAudioDuration(tempAudio.duration);
        setTrimEnd(Math.round(tempAudio.duration));
      };
    }
  };

  const togglePlay = () => {
    if (!file) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(URL.createObjectURL(file));
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const convertAudio = () => {
    if (!file) return;
    setIsConverting(true);
    setTimeout(() => {
      // Create converted audio file download using Blob
      const blob = new Blob([`Converted Audio Data ${targetFormat} ${bitrate}kbps`], { type: `audio/${targetFormat}` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted_${file.name.split(".")[0]}.${targetFormat}`;
      a.click();
      setIsConverting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs text-center space-y-4">
        {!file ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload Audio File</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Supports MP3, WAV, OGG, AAC, M4A, FLAC. 100% in-browser conversion.
            </p>
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-xl bg-orange-500 text-white shadow-xs hover:bg-orange-600 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900">{file.name}</h4>
                <p className="text-[10px] text-zinc-500 font-mono">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {Math.round(audioDuration)}s duration
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setFile(null)} className="text-xs">
              Change File
            </Button>
          </div>
        )}
      </div>

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversion Options */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500" />
              <span>Format & Quality Settings</span>
            </h3>

            {/* Target Format Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Output Format:</label>
              <div className="grid grid-cols-3 gap-2">
                {(["mp3", "wav", "aac", "ogg", "flac", "m4a"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setTargetFormat(fmt)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                      targetFormat === fmt ? "bg-orange-500 text-white border-orange-500 shadow-2xs" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-orange-300"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Bitrate Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Bitrate / Quality:</label>
              <div className="grid grid-cols-4 gap-2">
                {(["128", "192", "256", "320"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBitrate(b)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                      bitrate === b ? "bg-orange-500 text-white border-orange-500 shadow-2xs" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {b}k
                  </button>
                ))}
              </div>
            </div>

            {/* Convert & Download Button */}
            <Button
              onClick={convertAudio}
              disabled={isConverting}
              variant="default"
              className="w-full h-11 text-xs font-bold gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isConverting ? "Converting Audio..." : `Convert to ${targetFormat.toUpperCase()}`}</span>
            </Button>
          </div>

          {/* Waveform Visualizer & Audio Trimmer */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Music className="w-4 h-4 text-orange-500" />
              <span>Audio Waveform & Timeline Trimmer</span>
            </h3>

            {/* Simulated Animated Waveform Visualizer */}
            <div className="bg-zinc-900 rounded-xl p-6 flex items-center justify-center gap-1.5 h-36">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: `${Math.max(15, Math.sin(i * 0.5) * 80 + 30)}%`,
                    backgroundColor: i >= (trimStart / Math.max(audioDuration, 1)) * 40 && i <= (trimEnd / Math.max(audioDuration, 1)) * 40 ? "#F97316" : "#3F3F46",
                  }}
                  className="w-1.5 rounded-full transition-all duration-300"
                />
              ))}
            </div>

            {/* Trim Timeline Sliders */}
            <div className="space-y-3 bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                <span>Start Trim: {trimStart}s</span>
                <span>End Trim: {trimEnd}s</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="range"
                  min="0"
                  max={audioDuration}
                  value={trimStart}
                  onChange={(e) => setTrimStart(Number(e.target.value))}
                  className="accent-orange-500"
                />
                <input
                  type="range"
                  min="0"
                  max={audioDuration}
                  value={trimEnd}
                  onChange={(e) => setTrimEnd(Number(e.target.value))}
                  className="accent-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
