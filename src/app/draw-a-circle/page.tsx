"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import BackLink from "@/components/BackLink";
import YouMayLike from "@/components/YouMayLike";

type GameState = "idle" | "drawing" | "result";

interface Point { x: number; y: number }

interface CircleResult {
  score: number;
  centroidX: number;
  centroidY: number;
  radius: number;
}

const VERDICTS = [
  { min: 0,    text: "That's a potato." },
  { min: 20,   text: "Somewhere between blob and circle." },
  { min: 40,   text: "More of an oval, honestly." },
  { min: 55,   text: "Not terrible." },
  { min: 68,   text: "Getting there." },
  { min: 78,   text: "That's actually pretty good." },
  { min: 87,   text: "Impressive control." },
  { min: 93,   text: "Are you using a compass?" },
  { min: 97,   text: "Genuinely suspicious." },
  { min: 99.5, text: "You are not human." },
];

function getVerdict(score: number) {
  for (let i = VERDICTS.length - 1; i >= 0; i--) {
    if (score >= VERDICTS[i].min) return VERDICTS[i].text;
  }
  return VERDICTS[0].text;
}

const COLORS = [
  "#f87171", // red
  "#fb923c", // orange
  "#facc15", // yellow
  "#4ade80", // green
  "#34d399", // emerald
  "#22d3ee", // cyan
  "#60a5fa", // blue
  "#a78bfa", // violet
  "#f472b6", // pink
  "#e879f9", // fuchsia
];

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function calculateResult(points: Point[]): CircleResult | null {
  if (points.length < 16) return null;

  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
  const radii = points.map(p => Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2));
  const meanR = radii.reduce((s, r) => s + r, 0) / radii.length;

  if (meanR < 8) return null;

  const variance = radii.reduce((s, r) => s + (r - meanR) ** 2, 0) / radii.length;
  const stddev = Math.sqrt(variance);

  const start = points[0];
  const end = points[points.length - 1];
  const closureDist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  const closureFactor = Math.max(0.4, 1 - (closureDist / (2 * meanR)) * 0.9);

  const rawScore = Math.max(0, 1 - stddev / meanR);
  const score = Math.min(99.9, rawScore * closureFactor * 100);

  return { score: Math.round(score * 10) / 10, centroidX: cx, centroidY: cy, radius: meanR };
}

export default function DrawACircle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);

  const [gameState, setGameState] = useState<GameState>("idle");
  const [result, setResult] = useState<CircleResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [newBest, setNewBest] = useState(false);
  const strokeColorRef = useRef(pickColor());

  useEffect(() => {
    const stored = localStorage.getItem("circle-best");
    if (stored) setBestScore(parseFloat(stored));
  }, []);

  // Size canvas to full viewport
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    setupCanvas();
    const onResize = () => {
      setupCanvas(); // clears canvas on resize — acceptable
      setGameState(s => s === "result" ? "idle" : s);
      setResult(null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setupCanvas]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }, []);

  const drawUserPath = useCallback((ctx: CanvasRenderingContext2D, points: Point[], color: string, alpha = 1) => {
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    // Parse hex color and apply alpha
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }, []);

  const drawIdealCircle = useCallback((ctx: CanvasRenderingContext2D, res: CircleResult) => {
    ctx.beginPath();
    ctx.arc(res.centroidX, res.centroidY, res.radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(34,197,94,0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(res.centroidX, res.centroidY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(34,197,94,0.7)";
    ctx.fill();
  }, []);

  const showResult = useCallback((points: Point[]) => {
    const res = calculateResult(points);
    if (!res) { clearCanvas(); setGameState("idle"); return; }

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawUserPath(ctx, points, strokeColorRef.current, 0.4);
    drawIdealCircle(ctx, res);

    setResult(res);
    setGameState("result");

    let current = 0;
    const step = res.score / (800 / 16);
    const interval = setInterval(() => {
      current = Math.min(current + step, res.score);
      setDisplayScore(Math.round(current * 10) / 10);
      if (current >= res.score) clearInterval(interval);
    }, 16);

    setBestScore(prev => {
      if (prev === null || res.score > prev) {
        localStorage.setItem("circle-best", String(res.score));
        setNewBest(true);
        return res.score;
      }
      return prev;
    });
  }, [clearCanvas, drawUserPath, drawIdealCircle]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (gameState === "result") return;
    e.preventDefault();
    strokeColorRef.current = pickColor();
    isDrawingRef.current = true;
    pointsRef.current = [{ x: e.clientX, y: e.clientY }];
    clearCanvas();
    setGameState("drawing");
    setNewBest(false);
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }, [gameState, clearCanvas]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    pointsRef.current.push({ x: e.clientX, y: e.clientY });
    const ctx = canvasRef.current!.getContext("2d")!;
    const c = strokeColorRef.current;
    const r = parseInt(c.slice(1,3),16), g = parseInt(c.slice(3,5),16), b = parseInt(c.slice(5,7),16);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }, []);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    isDrawingRef.current = false;
    showResult(pointsRef.current);
  }, [showResult]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  function reset() {
    clearCanvas();
    pointsRef.current = [];
    isDrawingRef.current = false;
    strokeColorRef.current = pickColor();
    setResult(null);
    setDisplayScore(0);
    setNewBest(false);
    setGameState("idle");
  }

  const scoreColor = !result ? "#fff"
    : result.score >= 90 ? "#4ade80"
    : result.score >= 70 ? "#facc15"
    : result.score >= 50 ? "#fb923c"
    : "#f87171";

  // Clamp score card position so it stays within viewport
  const scoreCardW = 180;
  const scoreCardH = 100;
  const scoreLeft = result
    ? Math.min(Math.max(result.centroidX - scoreCardW / 2, 12), window.innerWidth - scoreCardW - 12)
    : 0;
  const scoreTop = result
    ? Math.min(Math.max(result.centroidY - result.radius - scoreCardH - 16, 60), window.innerHeight - scoreCardH - 60)
    : 0;

  return (
    <div style={{ background: "#0f0f0f", color: "#ffffff", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      {/* Full-viewport canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          display: "block",
          cursor: gameState === "result" ? "default" : "crosshair",
          touchAction: "none",
        }}
      />

      {/* Back link — always visible */}
      <BackLink />

      {/* Idle state — centered instruction */}
      {gameState === "idle" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            gap: 8,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#fff",
              margin: 0,
            }}
          >
            Draw a Circle
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.35)",
              margin: 0,
            }}
          >
            draw anywhere on the screen
          </p>
          {bestScore !== null && (
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.2)",
                margin: 0,
                marginTop: 4,
              }}
            >
              best: {bestScore}%
            </p>
          )}
        </div>
      )}

      {/* Score card — floats near the drawn circle */}
      {gameState === "result" && result && (
        <div
          style={{
            position: "fixed",
            left: scoreLeft,
            top: scoreTop,
            pointerEvents: "none",
            textAlign: "center",
            width: scoreCardW,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: 700,
              color: scoreColor,
              lineHeight: 1,
              transition: "color 0.5s ease",
            }}
          >
            {displayScore}
            <span style={{ fontSize: "0.55em" }}>%</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              marginTop: 4,
            }}
          >
            {getVerdict(result.score)}
          </div>
          {newBest && (
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 10,
                color: "#4ade80",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginTop: 4,
                opacity: 0.8,
              }}
            >
              personal best
            </div>
          )}
        </div>
      )}

      {/* Try again + suggestion — fixed bottom center */}
      {gameState === "result" && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ width: "min(90vw, 680px)" }}>
            <YouMayLike currentId="draw-a-circle" />
          </div>
          <button
            onClick={reset}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: "rgba(255,255,255,0.1)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "10px 28px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            try again
          </button>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-inter), sans-serif" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ display: "inline-block", width: 14, height: 2, background: "rgba(255,255,255,0.5)" }} />
              your circle
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ display: "inline-block", width: 14, borderTop: "1.5px dashed rgba(34,197,94,0.6)" }} />
              ideal circle
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
