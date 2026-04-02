"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import BackLink from "@/components/BackLink";
import YouMayLike from "@/components/YouMayLike";

// Light speed in km/s
const C_KMS = 299_792;

function formatKm(km: number): string {
  if (km < 1_000)           return `${Math.round(km).toLocaleString()} km`;
  if (km < 1_000_000)       return `${(km / 1_000).toFixed(2)}K km`;
  if (km < 1_000_000_000)   return `${(km / 1_000_000).toFixed(3)}M km`;
  return `${(km / 1_000_000_000).toFixed(4)}B km`;
}

function formatTotal(n: number): string {
  if (n < 1_000)      return n.toLocaleString();
  if (n < 1_000_000)  return `${(n / 1_000).toFixed(1)}K`;
  return `${(n / 1_000_000).toFixed(2)}M`;
}

// Cosmic reference points for distance
function cosmicContext(km: number): string {
  if (km < 384_400)         return "still within Earth's orbit of the Moon";
  if (km < 1_496_000)       return "beyond the Moon — approaching Earth–Sun distance";
  if (km < 588_000_000)     return "past Mars — deep in the inner solar system";
  if (km < 778_000_000)     return "approaching Jupiter";
  if (km < 9_461_000_000)   return "crossing the outer solar system";
  if (km < 40_000_000_000)  return "past the edge of our solar system";
  return "in interstellar space";
}

// Stars (precomputed, stable)
const STARS = Array.from({ length: 120 }, (_, i) => ({
  top:   (Math.sin(i * 2.399) * 0.5 + 0.5) * 100,
  left:  (i * 137.508) % 100,
  size:  i % 12 === 0 ? 2.5 : i % 5 === 0 ? 1.5 : 1,
  op:    0.15 + (i % 8) * 0.08,
  delay: (i * 0.33) % 6,
  dur:   2 + (i % 6),
}));

type Phase = "idle" | "sending" | "sent";

export default function SignTheVoid() {
  const [phase, setPhase]           = useState<Phase>("idle");
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [travelKm, setTravelKm]     = useState(0);
  const [lastSignalAt, setLastSignalAt] = useState(Date.now());
  const [liveKm, setLiveKm]         = useState(0);
  const [alreadySent, setAlreadySent] = useState(false);
  const frameRef = useRef<number>(0);
  const sentKey = "void_sent_today";

  // Check if already sent today (localStorage gate — soft, not enforced server-side)
  useEffect(() => {
    const stored = localStorage.getItem(sentKey);
    if (stored === new Date().toDateString()) setAlreadySent(true);
  }, []);

  // Fetch current counts on mount
  useEffect(() => {
    fetch("/api/sign-the-void")
      .then(r => r.json())
      .then(data => {
        setTodayCount(data.today);
        setTotalCount(data.total);
        setTravelKm(data.travelKm);
        setLastSignalAt(data.lastSignalAt);
      })
      .catch(() => {
        setTodayCount(0);
        setTotalCount(0);
      });
  }, []);

  // Live km counter — extrapolates at light speed from last known value
  useEffect(() => {
    const animate = () => {
      const elapsed = (Date.now() - lastSignalAt) / 1000;
      setLiveKm(travelKm + elapsed * C_KMS);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [travelKm, lastSignalAt]);

  const sendSignal = useCallback(async () => {
    if (phase !== "idle" || alreadySent) return;
    setPhase("sending");

    try {
      const res = await fetch("/api/sign-the-void", { method: "POST" });
      const data = await res.json();
      setTodayCount(data.today);
      setTotalCount(data.total);
      setTravelKm(data.travelKm);
      setLastSignalAt(data.lastSignalAt);
      localStorage.setItem(sentKey, new Date().toDateString());
      setAlreadySent(true);
    } catch {
      // Still show sent state even on error
    }

    setPhase("sent");
  }, [phase, alreadySent]);

  const sent = phase === "sent" || alreadySent;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,300;0,400;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #03040A; }

        @keyframes fadeUp    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes twinkle   { from { opacity:0.1; } to { opacity:1; } }
        @keyframes ripple    { 0% { transform:scale(0.8); opacity:0.8; } 100% { transform:scale(3.5); opacity:0; } }
        @keyframes orbit     { from { transform:rotate(0deg) translateX(54px); } to { transform:rotate(360deg) translateX(54px); } }
        @keyframes pulse     { 0%,100%{transform:scale(1);} 50%{transform:scale(1.06);} }
        @keyframes sentGlow  { 0%,100%{box-shadow:0 0 30px rgba(140,180,255,0.3);} 50%{box-shadow:0 0 60px rgba(140,180,255,0.6);} }
        @keyframes signalOut { 0%{transform:scale(1);opacity:1;} 60%{transform:scale(1.4);opacity:0.4;} 100%{transform:scale(1.6);opacity:0;} }
        @keyframes kmTick    { 0%{opacity:0.6;} 50%{opacity:1;} 100%{opacity:0.6;} }

        .send-btn {
          position: relative;
          width: 140px; height: 140px;
          border-radius: 50%;
          border: 1.5px solid rgba(140,180,255,0.35);
          background: rgba(140,180,255,0.04);
          cursor: pointer;
          transition: border-color 0.3s, background 0.3s;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 6px;
        }
        .send-btn:hover:not(:disabled) {
          border-color: rgba(140,180,255,0.7);
          background: rgba(140,180,255,0.08);
        }
        .send-btn:disabled { cursor: default; }
        .send-btn.sent {
          border-color: rgba(140,180,255,0.5);
          background: rgba(140,180,255,0.06);
          animation: sentGlow 3s ease-in-out infinite;
        }
        .send-btn.sending .ripple-ring {
          animation: signalOut 0.8s ease forwards;
        }
        .ripple-ring {
          position: absolute; inset: -1px;
          border-radius: 50%;
          border: 1px solid rgba(140,180,255,0.5);
          pointer-events: none;
        }
      `}</style>

      {/* Background */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", background: "#03040A" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(10,15,40,0.9) 0%, #03040A 65%)" }} />
        {/* Nebula hint */}
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,20,80,0.25) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,40,60,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: s.size, height: s.size,
            background: `rgba(255,255,255,${s.op})`, borderRadius: "50%",
            top: `${s.top}%`, left: `${s.left}%`,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
          }} />
        ))}
      </div>

      <BackLink />

      <main style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 24px 64px",
        fontFamily: "'Lora', serif",
        color: "rgba(220,230,255,0.9)",
        textAlign: "center",
        gap: 0,
      }}>

        {/* Header */}
        <div style={{ animation: "fadeUp 0.7s ease both", marginBottom: 16 }}>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "rgba(140,180,255,0.5)",
            marginBottom: 16,
          }}>
            Transmission · Deep Space · {new Date().toDateString()}
          </div>
          <h1 style={{
            fontFamily: "'Lora', serif", fontWeight: 300,
            fontSize: "clamp(2.2rem, 7vw, 3.8rem)",
            letterSpacing: "0.08em", lineHeight: 1.1,
            color: "rgba(220,230,255,0.95)",
          }}>
            Sign the Void
          </h1>
          <p style={{
            marginTop: 12, fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(0.88rem, 2.5vw, 1rem)",
            color: "rgba(180,200,255,0.5)",
            lineHeight: 1.7,
            maxWidth: 420, margin: "12px auto 0",
          }}>
            {sent
              ? "Your signal is out there. It won't come back."
              : "Click once. Send a signal into the cosmos. No message required."}
          </p>
        </div>

        {/* The Button */}
        <div style={{ animation: "fadeUp 0.7s ease 0.15s both", margin: "44px 0" }}>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {/* Orbit ring — visible after sent */}
            {sent && (
              <div style={{ position: "absolute", width: 108, height: 108, borderRadius: "50%", border: "1px dashed rgba(140,180,255,0.15)" }}>
                <div style={{
                  position: "absolute", top: -3, left: "50%", marginLeft: -3,
                  width: 6, height: 6, borderRadius: "50%",
                  background: "rgba(180,210,255,0.7)",
                  animation: "orbit 8s linear infinite",
                }} />
              </div>
            )}

            <button
              onClick={sendSignal}
              disabled={sent || phase === "sending"}
              className={`send-btn ${sent ? "sent" : ""} ${phase === "sending" ? "sending" : ""}`}
              aria-label={sent ? "Signal sent" : "Send signal into the void"}
            >
              {phase === "sending" && <div className="ripple-ring" />}

              {/* Inner icon */}
              <div style={{
                fontSize: sent ? "1.8rem" : "1.6rem",
                transition: "font-size 0.3s",
                animation: sent ? "pulse 3s ease-in-out infinite" : "none",
                lineHeight: 1,
              }}>
                {sent ? "✦" : "◌"}
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.52rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: sent ? "rgba(140,180,255,0.8)" : "rgba(140,180,255,0.45)",
              }}>
                {phase === "sending" ? "sending..." : sent ? "transmitted" : "transmit"}
              </div>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ animation: "fadeUp 0.7s ease 0.28s both", width: "100%", maxWidth: 520 }}>

          {/* Today / Total */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 16, marginBottom: 20,
          }}>
            {[
              {
                label: "signals today",
                value: todayCount === null ? "—" : formatTotal(todayCount),
                sub: "resets at midnight IST",
              },
              {
                label: "total signals",
                value: totalCount === null ? "—" : formatTotal(totalCount),
                sub: "since the beginning",
              },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "rgba(140,180,255,0.04)",
                border: "1px solid rgba(140,180,255,0.1)",
                borderRadius: 14,
                padding: "18px 16px",
              }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
                  fontWeight: 700,
                  color: "rgba(200,220,255,0.95)",
                  lineHeight: 1,
                  marginBottom: 8,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.54rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(140,180,255,0.5)",
                  marginBottom: 4,
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: "italic",
                  fontSize: "0.7rem",
                  color: "rgba(140,180,255,0.3)",
                }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Light-speed distance card */}
          <div style={{
            background: "rgba(140,180,255,0.03)",
            border: "1px solid rgba(140,180,255,0.08)",
            borderRadius: 14,
            padding: "20px 20px 16px",
            marginBottom: 20,
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.54rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(140,180,255,0.4)",
              marginBottom: 10,
            }}>
              collective signal — distance traveled
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "clamp(1.3rem, 4vw, 2rem)",
              fontWeight: 700,
              color: "rgba(180,210,255,0.9)",
              letterSpacing: "0.04em",
              animation: "kmTick 2s ease-in-out infinite",
              marginBottom: 8,
            }}>
              {formatKm(liveKm)}
            </div>
            <div style={{
              fontFamily: "'Lora', serif",
              fontStyle: "italic",
              fontSize: "clamp(0.75rem, 2vw, 0.82rem)",
              color: "rgba(140,180,255,0.38)",
              lineHeight: 1.6,
            }}>
              {cosmicContext(liveKm)}
            </div>
            <div style={{
              marginTop: 10,
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.14em",
              color: "rgba(140,180,255,0.22)",
              textTransform: "uppercase",
            }}>
              traveling at 299,792 km/s · accumulated since first signal
            </div>
          </div>

          {/* Flavour text */}
          <p style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(0.78rem, 2vw, 0.86rem)",
            color: "rgba(140,180,255,0.28)",
            lineHeight: 1.8,
            maxWidth: 400,
            margin: "0 auto",
          }}>
            {sent
              ? `You are one of ${todayCount !== null ? todayCount.toLocaleString() : "many"} people who sent a signal today. None of them know each other. All of them looked up.`
              : "No message. No destination. Just the fact that you were here, on this particular afternoon, and decided to say something to the universe."}
          </p>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: 56,
          width: "100%",
          animation: "fadeUp 0.7s ease 0.4s both",
        }}>
          <YouMayLike currentId="sign-the-void" labelColor="rgba(140,180,255,0.25)" />
        </footer>

      </main>
    </>
  );
}
