"use client";

import React, { useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Scissors } from "lucide-react";
import { formatDuration } from "@/lib/video-gif-converter";

interface VideoPreviewPlayerProps {
  videoUrl: string;
  durationSec: number;
  startTimeSec: number;
  endTimeSec: number;
  onTrimChange: (start: number, end: number) => void;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  videoUrl,
  durationSec,
  startTimeSec,
  endTimeSec,
  onTrimChange,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const updateTime = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= endTimeSec) {
        video.currentTime = startTimeSec;
      }
      if (!video.paused) {
        animFrameRef.current = requestAnimationFrame(updateTime);
      }
    }
  }, [endTimeSec, startTimeSec]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      if (video.currentTime < startTimeSec || video.currentTime >= endTimeSec) {
        video.currentTime = startTimeSec;
      }
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          animFrameRef.current = requestAnimationFrame(updateTime);
        })
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) videoRef.current.currentTime = val;
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (videoRef.current) videoRef.current.volume = next ? 0 : volume;
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Video Container */}
      <div className="relative w-full bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center min-h-[280px]">
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          className="max-h-[340px] w-auto mx-auto block rounded-lg"
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <span className="font-mono font-medium text-zinc-600 text-[11px] shrink-0">
          {formatDuration(currentTime)} / {formatDuration(durationSec)}
        </span>

        <input
          type="range"
          min={0}
          max={durationSec}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 accent-orange-600 h-1 bg-zinc-200 rounded-lg cursor-pointer"
        />

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={toggleMute} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button onClick={handleFullscreen} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Minimal Trim Range Controls */}
      <div className="pt-3 border-t border-zinc-100 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-700 font-medium">
          <span className="flex items-center gap-1.5 text-zinc-600">
            <Scissors className="w-3.5 h-3.5 text-orange-500" />
            Trim Clip Range
          </span>
          <span className="font-mono text-[11px] text-orange-600 font-semibold">
            {startTimeSec.toFixed(1)}s – {endTimeSec.toFixed(1)}s ({(endTimeSec - startTimeSec).toFixed(1)}s)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Start</label>
            <input
              type="range"
              min={0}
              max={Math.max(0, endTimeSec - 0.2)}
              step={0.1}
              value={startTimeSec}
              onChange={(e) => onTrimChange(parseFloat(e.target.value), endTimeSec)}
              className="w-full accent-orange-600 h-1 bg-zinc-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">End</label>
            <input
              type="range"
              min={Math.min(durationSec, startTimeSec + 0.2)}
              max={durationSec}
              step={0.1}
              value={endTimeSec}
              onChange={(e) => onTrimChange(startTimeSec, parseFloat(e.target.value))}
              className="w-full accent-orange-600 h-1 bg-zinc-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
