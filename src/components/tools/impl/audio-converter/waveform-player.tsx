"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Square, Volume2, VolumeX, Radio } from "lucide-react";
import { formatDuration } from "@/lib/audio-converter";

interface WaveformPlayerProps {
  audioUrl?: string | null;
  audioBuffer?: AudioBuffer | null;
  title?: string;
  themeColor?: string;
  height?: number;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  audioUrl,
  audioBuffer,
  title = "Audio Preview",
  themeColor = "#EA580C",
  height = 140,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize or update audio object when audioUrl changes
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  // Sync duration from audioBuffer if provided
  useEffect(() => {
    if (audioBuffer) {
      setDuration(audioBuffer.duration);
    }
  }, [audioBuffer]);

  // Live playhead update loop
  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!audioRef.current.paused) {
        animFrameRef.current = requestAnimationFrame(updateProgress);
      }
    }
  }, []);

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current && audioUrl) {
      audioRef.current = new Audio(audioUrl);
    }
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        animFrameRef.current = requestAnimationFrame(updateProgress);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  // Stop playback
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
  };

  // Handle waveform click seek
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !duration) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;

    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVol;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
  };

  // Draw Audio Waveform onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const canvasHeight = canvas.height;

    // Clear Canvas
    ctx.clearRect(0, 0, width, canvasHeight);

    // Draw background grid lines
    ctx.strokeStyle = "#F4F4F5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(width, canvasHeight / 2);
    ctx.stroke();

    const barWidth = 3;
    const gap = 2;
    const numBars = Math.floor(width / (barWidth + gap));
    const progressRatio = duration > 0 ? currentTime / duration : 0;

    // Extract amplitude samples from audioBuffer or fallback synthetic waveform
    let peaks: number[] = [];
    if (audioBuffer) {
      const pcm = audioBuffer.getChannelData(0);
      const step = Math.floor(pcm.length / numBars);
      for (let i = 0; i < numBars; i++) {
        let max = 0;
        const start = i * step;
        for (let j = 0; j < step && start + j < pcm.length; j++) {
          const val = Math.abs(pcm[start + j]);
          if (val > max) max = val;
        }
        peaks.push(max);
      }
    } else {
      // High quality fallback visualization pattern
      for (let i = 0; i < numBars; i++) {
        const val = Math.sin(i * 0.15) * 0.4 + Math.cos(i * 0.08) * 0.4 + 0.2;
        peaks.push(Math.abs(val));
      }
    }

    // Render Waveform Bars
    for (let i = 0; i < numBars; i++) {
      const x = i * (barWidth + gap);
      const isPassed = x / width <= progressRatio;
      const barHeight = Math.max(6, peaks[i] * (canvasHeight - 30));

      const y = (canvasHeight - barHeight) / 2;

      ctx.fillStyle = isPassed ? themeColor : "#E4E4E7";
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }

    // Render Playhead Cursor
    const playheadX = progressRatio * width;
    ctx.fillStyle = themeColor;
    ctx.fillRect(playheadX - 1.5, 0, 3, canvasHeight);

    // Playhead head handle
    ctx.beginPath();
    ctx.arc(playheadX, 8, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [audioBuffer, currentTime, duration, themeColor]);

  return (
    <div className="w-full bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-orange-500 animate-pulse" />
          <h3 className="text-xs font-bold text-zinc-900 truncate max-w-xs">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative w-full cursor-pointer group rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200/80 p-2">
        <canvas
          ref={canvasRef}
          width={800}
          height={height}
          onClick={handleCanvasClick}
          className="w-full h-32 block"
        />

        {/* Hover Cue */}
        <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity flex items-center justify-center">
          <span className="text-[10px] font-bold text-orange-700 bg-white/90 px-2 py-0.5 rounded-full shadow-2xs">
            Click Waveform to Seek
          </span>
        </div>
      </div>

      {/* Audio Playback Controls */}
      <div className="flex items-center justify-between pt-1">
        {/* Play / Pause / Stop Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            disabled={!audioUrl}
            className="w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-2xs transition-all disabled:opacity-40 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={handleStop}
            disabled={!audioUrl}
            className="w-9 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 text-zinc-500">
          <button onClick={toggleMute} className="hover:text-zinc-900 transition-colors">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-zinc-600" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 accent-orange-600 h-1.5 rounded-lg bg-zinc-200 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
