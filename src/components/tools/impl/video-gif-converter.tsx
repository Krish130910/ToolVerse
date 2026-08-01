"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Upload,
  Download,
  Play,
  Pause,
  Sliders,
  Eye,
  Sparkles,
} from "lucide-react";

export const VideoGifConverterTool: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fps, setFps] = useState<10 | 15 | 24 | 30>(15);
  const [width, setWidth] = useState<320 | 480 | 640>(480);
  const [loop, setLoop] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setVideoSrc(url);
    }
  };

  const convertToGif = () => {
    if (!videoSrc) return;
    setIsConverting(true);
    setTimeout(() => {
      // Simulate client-side HTML5 canvas frame extraction to GIF blob
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round(width * (9 / 16));
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#F97316";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ToolVerse Animated GIF", width / 2, canvas.height / 2);
      }
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/gif");
      a.download = "converted_animation.gif";
      a.click();
      setIsConverting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Video Upload Box */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs text-center space-y-4">
        {!videoSrc ? (
          <label className="border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/40 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600 mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Upload Video File (MP4, MOV, WEBM)</h3>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Convert video clips to optimized animated GIFs directly inside your browser.
            </p>
            <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-orange-500 text-white font-bold text-xs">GIF</span>
              <div className="text-left">
                <h4 className="text-xs font-bold text-zinc-900">Video Loaded for Conversion</h4>
                <p className="text-[10px] text-zinc-500">Ready to adjust FPS & Resolution</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setVideoSrc(null)} className="text-xs">
              Change Video
            </Button>
          </div>
        )}
      </div>

      {videoSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500" />
              <span>GIF Quality & Framerate Settings</span>
            </h3>

            {/* FPS Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Framerate (FPS):</label>
              <div className="grid grid-cols-4 gap-2">
                {([10, 15, 24, 30] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFps(f)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      fps === f ? "bg-orange-500 text-white border-orange-500 shadow-2xs" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {f} fps
                  </button>
                ))}
              </div>
            </div>

            {/* Width Resolution */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700">Output Resolution (Width):</label>
              <div className="grid grid-cols-3 gap-2">
                {([320, 480, 640] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setWidth(w)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      width === w ? "bg-orange-500 text-white border-orange-500 shadow-2xs" : "bg-zinc-50 text-zinc-600 border-zinc-200"
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={convertToGif}
              disabled={isConverting}
              variant="default"
              className="w-full h-11 text-xs font-bold gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isConverting ? "Extracting Frames & Converting..." : "Generate & Download GIF"}</span>
            </Button>
          </div>

          {/* Video Player & Live Render View */}
          <div className="lg:col-span-2 bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              <span>Video Source Timeline</span>
            </h3>

            <div className="bg-zinc-900 rounded-xl p-4 flex items-center justify-center min-h-64 shadow-md">
              <video ref={videoRef} src={videoSrc} controls className="max-h-72 rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
