"use client";

import React, { useRef, useState, useEffect } from "react";
import { PenTool, Undo2, Redo2, RotateCcw, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DrawModeOptions {
  penColor: string;
  penWidth: number;
  smoothing: boolean;
}

interface DrawModeCardProps {
  options: DrawModeOptions;
  onChangeOptions: (updater: (prev: DrawModeOptions) => DrawModeOptions) => void;
  onCanvasUpdate: (dataUrl: string | null) => void;
}

const INK_PRESETS = [
  { name: "Midnight Black", color: "#18181B" },
  { name: "Royal Blue", color: "#1E40AF" },
  { name: "Classic Navy", color: "#1E1B4B" },
  { name: "Emerald Green", color: "#059669" },
  { name: "Crimson Red", color: "#DC2626" },
  { name: "Dark Violet", color: "#6B21A8" },
];

interface Point {
  x: number;
  y: number;
}

export const DrawModeCard: React.FC<DrawModeCardProps> = ({
  options,
  onChangeOptions,
  onCanvasUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const points = useRef<Point[]>([]);

  // History stack for Undo & Redo
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina DPI sizing
    canvas.width = 700;
    canvas.height = 320;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHistoryStep(0);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(currentState);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);

    onCanvasUpdate(canvas.toDataURL("image/png"));
  };

  const handleUndo = () => {
    if (historyStep <= 0) return;
    const newStep = historyStep - 1;
    setHistoryStep(newStep);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.putImageData(history[newStep], 0, 0);
    onCanvasUpdate(canvas.toDataURL("image/png"));
  };

  const handleRedo = () => {
    if (historyStep >= history.length - 1) return;
    const newStep = historyStep + 1;
    setHistoryStep(newStep);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.putImageData(history[newStep], 0, 0);
    onCanvasUpdate(canvas.toDataURL("image/png"));
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  // Drawing event listeners with quadratic curve interpolation
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pt = getCoordinates(e);
    if (!pt) return;
    isDrawing.current = true;
    points.current = [pt];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, options.penWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = options.penColor;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const pt = getCoordinates(e);
    if (!pt) return;

    points.current.push(pt);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = options.penColor;
    ctx.lineWidth = options.penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (points.current.length < 3) {
      const b = points.current[0];
      ctx.beginPath();
      ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !1);
      ctx.fill();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points.current[0].x, points.current[0].y);

    for (let i = 1; i < points.current.length - 2; i++) {
      const xc = (points.current[i].x + points.current[i + 1].x) / 2;
      const yc = (points.current[i].y + points.current[i + 1].y) / 2;
      ctx.quadraticCurveTo(points.current[i].x, points.current[i].y, xc, yc);
    }

    ctx.quadraticCurveTo(
      points.current[points.current.length - 2].x,
      points.current[points.current.length - 2].y,
      points.current[points.current.length - 1].x,
      points.current[points.current.length - 1].y
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    points.current = [];
    saveState();
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <PenTool className="w-4 h-4 text-orange-500" />
            <span>Draw Freehand Signature</span>
          </h3>
          <p className="text-[11px] font-medium text-zinc-500">
            Use your mouse, trackpad, or touch screen to draw your signature.
          </p>
        </div>

        {/* Action controls: Undo, Redo, Clear */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            disabled={historyStep <= 0}
            onClick={handleUndo}
            className="h-8 px-2.5 text-xs font-bold gap-1 rounded-xl cursor-pointer"
            title="Undo stroke"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={historyStep >= history.length - 1}
            onClick={handleRedo}
            className="h-8 px-2.5 text-xs font-bold gap-1 rounded-xl cursor-pointer"
            title="Redo stroke"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Redo</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            className="h-8 px-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer gap-1"
            title="Clear canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      {/* Pen Styling Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pen Width */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <label className="font-bold text-zinc-700">Pen Thickness</label>
            <span className="font-mono text-zinc-500">{options.penWidth}px</span>
          </div>
          <input
            type="range"
            min={1}
            max={14}
            value={options.penWidth}
            onChange={(e) =>
              onChangeOptions((prev) => ({ ...prev, penWidth: Number(e.target.value) }))
            }
            className="w-full accent-orange-500 cursor-pointer"
          />
        </div>

        {/* Ink Color */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">Ink Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={options.penColor}
              onChange={(e) =>
                onChangeOptions((prev) => ({ ...prev, penColor: e.target.value }))
              }
              className="w-8 h-8 rounded-lg border border-zinc-200 cursor-pointer p-0.5"
            />
            <div className="grid grid-cols-6 gap-1 flex-1">
              {INK_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() =>
                    onChangeOptions((prev) => ({ ...prev, penColor: preset.color }))
                  }
                  className={`h-7 rounded-md border transition-all cursor-pointer flex items-center justify-center ${
                    options.penColor === preset.color
                      ? "border-orange-500 ring-2 ring-orange-500/30 scale-105"
                      : "border-zinc-200 hover:scale-105"
                  }`}
                  style={{ backgroundColor: preset.color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drawing Pad Canvas Container */}
      <div className="relative rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 overflow-hidden cursor-crosshair group hover:border-orange-300 transition-colors">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[220px] touch-none block"
        />
        <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] font-mono text-zinc-400">
          Draw inside box &bull; Touch / Mouse
        </div>
      </div>
    </div>
  );
};
