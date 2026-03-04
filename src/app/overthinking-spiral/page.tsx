"use client";

import { useState, useRef, useEffect } from "react";
import BackLink from "@/components/BackLink";
import YouMayLike from "@/components/YouMayLike";

interface SpiralResult {
  steps: string[];
  calm: string;
}

const EXAMPLES = [
  "I forgot to reply to a message",
  "I said 'you too' when the waiter said enjoy your meal",
  "I waved back at someone who wasn't waving at me",
  "I laughed at something that wasn't funny in a meeting",
  "I sent a text to the wrong person",
];

export default function OverthinkingSpiral() {
  const [worry, setWorry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpiralResult | null>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [showCalm, setShowCalm] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSpiral() {
    if (!worry.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setVisibleSteps(0);
    setShowCalm(false);
    setError("");

    try {
      const res = await fetch("/api/overthinking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ worry: worry.trim() }),
      });

      if (!res.ok) throw new Error("API failed");
      const data: SpiralResult = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Reveal steps one by one
  useEffect(() => {
    if (!result) return;

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setVisibleSteps(step);

      if (step >= result.steps.length) {
        clearInterval(interval);
        setTimeout(() => setShowCalm(true), 700);
      }
    }, 900);

    return () => clearInterval(interval);
  }, [result]);

  function reset() {
    setResult(null);
    setVisibleSteps(0);
    setShowCalm(false);
    setWorry("");
    setError("");
  }

  return (
    <main
      className="min-h-screen"
      style={{ background: "#1e1b4b", color: "#ffffff" }}
    >
      <BackLink />

      <div className="max-w-xl mx-auto px-5 py-16 md:py-24">
        {/* Header */}
        <header className="mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-3"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            The Overthinking Spiral
          </h1>
          <p
            className="text-base"
            style={{ fontFamily: "var(--font-inter), sans-serif", opacity: 0.5 }}
          >
            Type a worry. Watch it get out of hand.
          </p>
        </header>

        {/* Input */}
        {!result && (
          <div className="flex flex-col gap-4">
            <textarea
              placeholder="I forgot to reply to a message..."
              value={worry}
              onChange={(e) => {
                setWorry(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSpiral();
                }
              }}
              rows={3}
              maxLength={200}
              className="w-full rounded-2xl px-5 py-4 text-base resize-none outline-none"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.12)",
                fontFamily: "var(--font-inter), sans-serif",
                color: "#ffffff",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.8)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            />

            {/* Examples */}
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setWorry(ex)}
                  className="rounded-full px-3 py-1.5 text-xs transition-all duration-150"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-inter), sans-serif",
                    color: "rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.13)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.07)";
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>

            {error && (
              <p
                className="text-sm"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#f87171",
                }}
              >
                {error}
              </p>
            )}

            <button
              onClick={handleSpiral}
              disabled={!worry.trim() || loading}
              className="w-full py-4 rounded-2xl font-bold transition-all duration-200"
              style={{
                background:
                  worry.trim() && !loading ? "#6366F1" : "rgba(255,255,255,0.08)",
                color: "#ffffff",
                fontFamily: "var(--font-fraunces), serif",
                fontSize: "1.05rem",
                cursor: worry.trim() && !loading ? "pointer" : "not-allowed",
                opacity: worry.trim() && !loading ? 1 : 0.4,
                boxShadow:
                  worry.trim() && !loading
                    ? "0 4px 24px rgba(99,102,241,0.45)"
                    : "none",
              }}
            >
              {loading ? "Spiraling..." : "Start the spiral →"}
            </button>
          </div>
        )}

        {/* Spiral result */}
        {result && (
          <div ref={resultRef} className="flex flex-col gap-3">
            {/* Original worry */}
            <div
              className="rounded-2xl px-5 py-4 text-sm"
              style={{
                background: "rgba(255,255,255,0.07)",
                fontFamily: "var(--font-inter), sans-serif",
                color: "rgba(255,255,255,0.6)",
                borderLeft: "3px solid rgba(99,102,241,0.5)",
              }}
            >
              <span className="opacity-50 text-xs block mb-1">you said:</span>
              {worry}
            </div>

            {/* Steps */}
            {result.steps.slice(0, visibleSteps).map((step, i) => {
              const intensity = (i + 1) / result.steps.length;
              const scale = 1 + intensity * 0.06;
              const bgOpacity = 0.08 + intensity * 0.14;

              return (
                <div
                  key={i}
                  className="rounded-2xl px-5 py-4"
                  style={{
                    background: `rgba(99,102,241,${bgOpacity})`,
                    border: `2px solid rgba(99,102,241,${0.2 + intensity * 0.4})`,
                    transform: `scale(${scale})`,
                    fontFamily: "var(--font-inter), sans-serif",
                    animation: "fadeSlideIn 0.4s ease",
                  }}
                >
                  <span
                    className="text-xs font-semibold block mb-1.5 opacity-50"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    step {i + 1}
                  </span>
                  <p className="text-sm md:text-base leading-snug">{step}</p>
                </div>
              );
            })}

            {/* Calm pivot */}
            {showCalm && (
              <div
                className="rounded-2xl px-5 py-5 mt-2"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  border: "2px solid rgba(16,185,129,0.35)",
                  fontFamily: "var(--font-inter), sans-serif",
                  animation: "fadeSlideIn 0.5s ease",
                }}
              >
                <span className="text-xs font-semibold block mb-2" style={{ color: "#34d399" }}>
                  or maybe...
                </span>
                <p
                  className="text-base md:text-lg leading-snug"
                  style={{ color: "#a7f3d0" }}
                >
                  {result.calm}
                </p>
              </div>
            )}

            {showCalm && (
              <button
                onClick={reset}
                className="w-full mt-2 py-3 rounded-2xl text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                spiral again
              </button>
            )}

            {showCalm && (
              <div className="mt-4">
                <YouMayLike currentId="overthinking-spiral" />
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px) scale(var(--card-scale, 1)); }
          to { opacity: 1; transform: translateY(0) scale(var(--card-scale, 1)); }
        }
      `}</style>
    </main>
  );
}
