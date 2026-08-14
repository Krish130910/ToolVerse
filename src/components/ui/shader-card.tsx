"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import Link from "next/link";
import { Zap, ArrowRight, Sparkles } from "lucide-react";

export interface BulletItem {
  icon?: React.ReactNode;
  text: string;
}

export interface ShaderCardProps {
  badgeLabel?: string;
  title?: string;
  description?: string;
  bullets?: BulletItem[];
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  className?: string;
  color1?: [number, number, number];
  color2?: [number, number, number];
  color3?: [number, number, number];
}

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; ++i) {
    v += a * noise(p);
    p = rot * p * 2.1 + vec2(100.0);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 st = gl_FragCoord.xy / iResolution.xy;
  vec2 mouse = uMouse / iResolution.xy;

  // Upward flowing flame & warm energy motion
  float t = iTime * 0.4;
  vec2 flamePos = st;
  flamePos.y -= t * 0.15;

  vec2 q = vec2(0.0);
  q.x = fbm(flamePos + 0.1 * t);
  q.y = fbm(flamePos + vec2(1.0));

  vec2 r = vec2(0.0);
  r.x = fbm(flamePos + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t + mouse * 0.15);
  r.y = fbm(flamePos + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

  float f = fbm(flamePos + r);

  // Pure clean off-white card background
  vec3 whiteBg = vec3(0.99, 0.98, 0.96);

  // Soft warm orange/amber flame blend
  vec3 flameColor = mix(uColor1, uColor2, clamp(f * 1.5, 0.0, 1.0));
  flameColor = mix(flameColor, uColor3, clamp(length(r.x), 0.0, 1.0));

  // Controlled opacity so black/dark text on white card is crisp and 100% readable
  float alpha = clamp(f * f * 0.32 + length(q) * 0.12, 0.0, 0.42);

  vec3 finalCol = mix(whiteBg, flameColor, alpha);

  fragColor = vec4(finalCol, 1.0);
}
`;

const defaultBullets: BulletItem[] = [
  { icon: <Zap className="w-4 h-4 text-orange-500 shrink-0" />, text: "Fast browser-based tools" },
  { icon: <Zap className="w-4 h-4 text-orange-500 shrink-0" />, text: "Simple, focused workflows" },
  { icon: <Zap className="w-4 h-4 text-orange-500 shrink-0" />, text: "One platform for everyday tasks" },
];

export const ShaderCard: React.FC<ShaderCardProps> = ({
  badgeLabel = "BUILT FOR DEVELOPERS",
  title = "Build faster.",
  description = "Powerful browser-based utilities, designed to keep your workflow moving.",
  bullets = defaultBullets,
  buttonText = "Explore Tools",
  buttonHref = "/tools",
  onButtonClick,
  className = "",
  color1 = [0.97, 0.45, 0.08], // Orange (#F97316)
  color2 = [0.96, 0.62, 0.04], // Amber (#F59E0B)
  color3 = [0.98, 0.75, 0.15], // Golden Amber (#FBBF24)
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;
    let renderer: Renderer | null = null;

    try {
      renderer = new Renderer({
        canvas,
        width: container.clientWidth,
        height: container.clientHeight,
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });

      const gl = renderer.gl;
      const geometry = new Triangle(gl);

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          iResolution: { value: [container.clientWidth, container.clientHeight] },
          iTime: { value: 0 },
          uMouse: { value: [0, 0] },
          uColor1: { value: color1 },
          uColor2: { value: color2 },
          uColor3: { value: color3 },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });

      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        program.uniforms.iResolution.value = [w, h];
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseRef.current = [e.clientX - rect.left, rect.height - (e.clientY - rect.top)];
      };

      window.addEventListener("resize", handleResize);
      container.addEventListener("mousemove", handleMouseMove);

      let startTime = performance.now();

      const update = (now: number) => {
        const elapsed = (now - startTime) * 0.001;
        program.uniforms.iTime.value = elapsed;
        program.uniforms.uMouse.value = mouseRef.current;

        renderer?.render({ scene: mesh });
        animationFrameId = requestAnimationFrame(update);
      };

      animationFrameId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", handleResize);
        container.removeEventListener("mousemove", handleMouseMove);
        if (gl) {
          const ext = gl.getExtension("WEBGL_lose_context");
          if (ext) ext.loseContext();
        }
      };
    } catch (e) {
      console.warn("WebGL initialization failed for ShaderCard:", e);
    }
  }, [color1, color2, color3]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-8 shadow-xs text-zinc-900 flex flex-col justify-between min-h-[380px] group transition-all duration-300 hover:border-orange-300 hover:shadow-md ${className}`}
    >
      {/* Animated WebGL Shader Canvas Background (Warm Flame Energy) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl opacity-85 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Light Overlay Gradient for Crisp Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/80 pointer-events-none rounded-3xl" />

      {/* Card Content Layer */}
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          {badgeLabel && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-600 text-[10px] font-mono uppercase tracking-wider font-extrabold shadow-2xs">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>{badgeLabel}</span>
            </div>
          )}
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            {title}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm font-medium">
              {description}
            </p>
          )}
        </div>

        {/* Feature Bullets List */}
        {bullets && bullets.length > 0 && (
          <div className="space-y-2.5 pt-2">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-zinc-800">
                {bullet.icon || <Zap className="w-4 h-4 text-orange-500 shrink-0" />}
                <span>{bullet.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="relative z-10 pt-6">
        {buttonHref ? (
          <Link
            href={buttonHref}
            className="w-full h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        ) : (
          <button
            onClick={onButtonClick}
            className="w-full h-11 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-xs hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};
