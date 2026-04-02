"use client";

import { useState, useEffect, useRef } from "react";
import BackLink from "@/components/BackLink";
import YouMayLike from "@/components/YouMayLike";

// ─── Constants ────────────────────────────────────────────────────────────────
// 1 Miller HOUR = 7 Earth years
// → 7 Earth years in seconds = 7 × 365.25 × 24 × 3600 = 220,903,200
// → Per Miller SECOND        = 220,903,200 / 3600 ≈ 61,362 Earth seconds
const EARTH_SECS_PER_MILLER_HOUR = 7 * 365.25 * 24 * 3600;
const EARTH_SECS_PER_MILLER_SEC  = EARTH_SECS_PER_MILLER_HOUR / 3600;
const INTERSTELLAR_RELEASE_MS    = new Date("2014-11-07T00:00:00Z").getTime();
const AVG_BPM = 75;

// ─── Math ─────────────────────────────────────────────────────────────────────
const earthToMiller = (earthSec: number) => earthSec / EARTH_SECS_PER_MILLER_SEC;
const millerToEarth = (millerSec: number) => millerSec * EARTH_SECS_PER_MILLER_SEC;

function fmtEarth(totalSec: number) {
  const abs = Math.abs(totalSec);
  const y = Math.floor(abs / (365.25 * 24 * 3600));
  const d = Math.floor((abs % (365.25 * 24 * 3600)) / (24 * 3600));
  const h = Math.floor((abs % (24 * 3600)) / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.floor(abs % 60);
  return { y, d, h, m, s };
}

function fmtMiller(totalMillerSec: number) {
  const abs       = Math.abs(totalMillerSec);
  const totalMs   = Math.round(abs * 1000);
  const ms        = totalMs % 1000;
  const totalS    = Math.floor(totalMs / 1000);
  const s         = totalS % 60;
  const totalM    = Math.floor(totalS / 60);
  const m         = totalM % 60;
  const h         = Math.floor(totalM / 60);
  return { h, m, s, ms };
}

function readableMiller(millerSec: number): string {
  const abs = Math.abs(millerSec);
  if (abs === 0)        return "0 seconds";
  if (abs < 0.000001)  return `${(abs * 1e9).toFixed(2)} nanoseconds`;
  if (abs < 0.001)     return `${(abs * 1e6).toFixed(2)} microseconds`;
  if (abs < 1)         return `${(abs * 1000).toFixed(2)} milliseconds`;
  if (abs < 60)        return `${abs.toFixed(3)} seconds`;
  if (abs < 3600)      return `${Math.floor(abs / 60)}m ${(abs % 60).toFixed(1)}s`;
  return `${Math.floor(abs / 3600)}h ${Math.floor((abs % 3600) / 60)}m ${Math.floor(abs % 60)}s`;
}

function readableEarth(earthSec: number): string {
  const abs = Math.abs(earthSec);
  if (abs === 0)                    return "0 seconds";
  if (abs < 60)                     return `${Math.round(abs)} seconds`;
  if (abs < 3600)                   return `${Math.floor(abs / 60)}m ${Math.floor(abs % 60)}s`;
  if (abs < 86400)                  return `${Math.floor(abs / 3600)}h ${Math.floor((abs % 3600) / 60)}m`;
  if (abs < 365.25 * 86400) {
    const d = Math.floor(abs / 86400);
    const h = Math.floor((abs % 86400) / 3600);
    return `${d} day${d !== 1 ? "s" : ""} ${h}h`;
  }
  const y = Math.floor(abs / (365.25 * 86400));
  const d = Math.floor((abs % (365.25 * 86400)) / 86400);
  return `${y} year${y !== 1 ? "s" : ""}, ${d} day${d !== 1 ? "s" : ""}`;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           "#080A0E",
  cardBg:       "rgba(16, 19, 24, 0.88)",
  text:         "#F0E6D0",
  textMid:      "#C4B8A8",
  textDim:      "#9A8C7E",
  textFaint:    "#6E6258",
  amber:        "#FFD580",
  amberDim:     "#C87828",
  blue:         "#7AAECC",
  border:       "rgba(255,255,255,0.07)",
  borderAccent: "rgba(255,213,128,0.18)",
};

// ─── Static data ──────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 70 }, (_, i) => ({
  top:   (Math.sin(i * 2.399) * 0.5 + 0.5) * 100,
  left:  (i * 137.508) % 100,
  size:  i % 9 === 0 ? 2 : 1,
  delay: (i * 0.41) % 5,
  dur:   2 + (i % 5),
  op:    0.2 + (i % 7) * 0.08,
}));

const FAMOUS = [
  { label: "Interstellar runtime",        earthH: 2.8,    note: "the film that started it all" },
  { label: "A full workday",              earthH: 8,      note: "8 hours" },
  { label: "A night's sleep",             earthH: 8,      note: "same as a workday — depressing" },
  { label: "Lunch break",                 earthH: 1,      note: "1 hour" },
  { label: "A cricket Test match day",    earthH: 6,      note: "6 hours of play" },
  { label: "Mumbai to Delhi flight",      earthH: 2,      note: "approx. 2 hrs" },
  { label: "Cooper on Miller's surface",  earthH: 3.283,  note: "23 yrs 4 mo 8 days passed on Earth" },
  { label: "Average daily phone usage",   earthH: 4,      note: "Indian avg. screen time" },
  { label: "A Bollywood film",            earthH: 3,      note: "credits included" },
  { label: "A full day on Earth",         earthH: 24,     note: "24 hours" },
];

const SLEEP_OPTIONS = [5, 6, 7, 8, 9, 10];

function funCommentPage(pageSec: number, millerSec: number): string {
  if (pageSec < 10)   return "You just arrived. The waves haven't reached your boots yet.";
  if (pageSec < 30)   return `${Math.floor(pageSec)} seconds on Earth. On Miller's, a hummingbird hasn't finished one wingbeat.`;
  if (pageSec < 60)   return `${Math.floor(pageSec)} seconds here. On Miller's: ${(millerSec * 1000).toFixed(3)} milliseconds. The planet hasn't noticed.`;
  if (pageSec < 180)  return `${Math.floor(pageSec / 60)}m ${Math.floor(pageSec % 60)}s on Earth. Miller's clock shows ${(millerSec * 1000).toFixed(2)} ms. A wave just thought about forming.`;
  if (pageSec < 600)  return `${Math.floor(pageSec / 60)} minutes on Earth. On Miller's: ${millerSec.toFixed(4)} seconds. Gargantua remains unimpressed.`;
  if (pageSec < 1800) return `${Math.floor(pageSec / 60)} minutes here. Miller's clock: ${millerSec.toFixed(3)} seconds. You are, by Miller's standards, basically a rumour.`;
  const h = Math.floor(pageSec / 3600);
  const m = Math.floor((pageSec % 3600) / 60);
  return `${h > 0 ? h + "h " : ""}${m}m on Earth. Miller's clock: ${millerSec.toFixed(2)} seconds. Gargantua has taken note. Barely.`;
}

function funCommentCustom(millerSec: number): string | null {
  if (millerSec <= 0)        return null;
  if (millerSec < 0.0001)   return "Gargantua blinked slower than that.";
  if (millerSec < 0.001)    return "That's not even a blink on Miller's. A photon laughed.";
  if (millerSec < 0.1)      return "Gargantua didn't notice. You barely existed there.";
  if (millerSec < 1)        return "Less than a second on Miller's. A wave hadn't even crested yet.";
  if (millerSec < 30)       return "A handful of seconds. The planet yawned exactly once.";
  if (millerSec < 120)      return "A couple of minutes. Enough time for one very confused seagull on Miller's.";
  if (millerSec < 3600)     return "Almost an hour there — that's 7 years on Earth. Hope nobody was waiting.";
  if (millerSec < 86400)    return "Hours on Miller's. Decades vanished on Earth. Cooper understands.";
  return "You've been gone long enough that your name is a myth back on Earth.";
}

function funCommentInverse(earthSec: number): string | null {
  if (earthSec <= 0)                        return null;
  if (earthSec < 3600)                      return "Not even an hour on Earth — for that, Miller's barely registered a millisecond.";
  if (earthSec < 86400)                     return "A few hours on Earth — on Miller's, that's microseconds of existence.";
  if (earthSec < 365.25 * 86400)            return "Months on Earth — barely a heartbeat's worth on Miller's Planet.";
  if (earthSec < 10 * 365.25 * 86400)      return "Years on Earth — on Miller's, someone stretched and yawned.";
  return "Decades on Earth. On Miller's, Gargantua noticed. Barely.";
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Seg({ val, lbl, bright, small }: { val: number; lbl: string; bright?: boolean; small?: boolean }) {
  const safe = isNaN(val) || val == null ? 0 : val;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: small ? "clamp(1.1rem, 3vw, 1.8rem)" : "clamp(1.6rem, 4.5vw, 2.8rem)",
        fontWeight: 700,
        color: bright ? C.amber : C.text,
        lineHeight: 1,
        letterSpacing: "0.02em",
        textShadow: bright ? "0 0 20px rgba(255,213,128,0.4)" : "none",
      }}>
        {String(safe).padStart(2, "0")}
      </span>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.52rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        color: C.textDim,
      }}>{lbl}</span>
    </div>
  );
}

function Colon({ small }: { small?: boolean }) {
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: small ? "clamp(0.9rem, 2.5vw, 1.5rem)" : "clamp(1.2rem, 3.5vw, 2rem)",
      color: "#3D3328",
      alignSelf: "flex-start",
      marginTop: small ? 2 : 4,
      lineHeight: 1,
      userSelect: "none" as const,
    }}>:</span>
  );
}

interface SegDef { val: number; lbl: string; bright?: boolean }
function ClockRow({ segs, small }: { segs: SegDef[]; small?: boolean }) {
  return (
    <div style={{ display: "flex", gap: small ? 10 : 14, alignItems: "flex-start", flexWrap: "wrap" as const }}>
      {segs.map((seg, i) => (
        <span key={i} style={{ display: "contents" }}>
          {i > 0 && <Colon small={small} />}
          <Seg val={seg.val} lbl={seg.lbl} bright={seg.bright} small={small} />
        </span>
      ))}
    </div>
  );
}

function Card({ children, delay = 0, accent = false }: { children: React.ReactNode; delay?: number; accent?: boolean }) {
  return (
    <div style={{
      background: C.cardBg,
      border: `1px solid ${accent ? C.borderAccent : C.border}`,
      borderRadius: 16,
      padding: "26px 28px 22px",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      position: "relative",
      overflow: "hidden",
      animation: `fadeUp 0.65s ease ${delay}s both`,
    }}>
      <div style={{
        position: "absolute", top: 0, left: "12%", right: "12%", height: 1,
        background: `linear-gradient(90deg, transparent, ${accent ? "rgba(255,213,128,0.3)" : "rgba(255,255,255,0.07)"}, transparent)`,
        pointerEvents: "none",
      }} />
      {children}
    </div>
  );
}

function SectionLabel({ children, color = C.textDim }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: "0.6rem",
      letterSpacing: "0.22em",
      textTransform: "uppercase" as const,
      color,
      marginBottom: 16,
    }}>{children}</div>
  );
}

function PlanetLabel({ miller }: { miller?: boolean }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: "0.58rem",
      letterSpacing: "0.18em",
      textTransform: "uppercase" as const,
      color: miller ? C.amberDim : C.blue,
      marginBottom: 10,
    }}>
      {miller ? "On Miller's Planet" : "On Earth"}
    </div>
  );
}

function HDivider() {
  return <div style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, margin: "18px 0" }} />;
}

function FunFact({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p style={{
      fontFamily: "'Lora', serif",
      fontSize: "clamp(0.82rem, 2.2vw, 0.9rem)",
      color: C.textMid,
      fontStyle: "italic",
      lineHeight: 1.75,
      marginTop: 14,
    }}>{children}</p>
  );
}

type Direction = "earth-to-miller" | "miller-to-earth";
function DirectionToggle({ value, onChange }: { value: Direction; onChange: (v: Direction) => void }) {
  return (
    <div style={{
      display: "inline-flex",
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${C.border}`,
      borderRadius: 999,
      padding: 3,
      gap: 2,
      marginBottom: 18,
    }} role="group" aria-label="Conversion direction">
      {([
        { val: "earth-to-miller" as Direction, label: "Earth → Miller's" },
        { val: "miller-to-earth" as Direction, label: "Miller's → Earth" },
      ]).map(opt => (
        <button
          key={opt.val}
          onClick={() => onChange(opt.val)}
          aria-pressed={value === opt.val}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            padding: "6px 14px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            transition: "all 0.18s",
            background: value === opt.val ? "rgba(255,213,128,0.2)" : "transparent",
            color: value === opt.val ? C.amber : C.textDim,
            boxShadow: value === opt.val ? `0 0 0 1px rgba(255,213,128,0.35)` : "none",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Background() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 55% at 72% 12%, rgba(28,16,6,0.95) 0%, ${C.bg} 58%)` }} />
      <div style={{ position: "absolute", top: "4%", right: "6%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,175,55,0.11) 0%, rgba(200,95,15,0.05) 42%, transparent 70%)", animation: "glowPulse 7s ease-in-out infinite alternate" }} />
      <div style={{ position: "absolute", top: "6.5%", right: "9%", width: 175, height: 175, borderRadius: "50%", border: "1px solid rgba(255,148,36,0.07)", background: "radial-gradient(circle, rgba(255,110,10,0.04) 0%, transparent 65%)" }} />
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{
          position: "absolute", bottom: `${-28 + i * 10}%`, left: "-18%", right: "-18%",
          height: "56%", borderRadius: "44%",
          border: `1px solid rgba(50,100,155,${0.045 + i * 0.022})`,
          background: `radial-gradient(ellipse at 50% 86%, rgba(18,42,78,${0.04 + i * 0.009}) 0%, transparent 70%)`,
          animation: `wave ${9 + i * 2.8}s ease-in-out ${i * 1.7}s infinite alternate`,
        }} />
      ))}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: s.size, height: s.size,
          background: `rgba(255,255,255,${s.op})`, borderRadius: "50%",
          top: `${s.top}%`, left: `${s.left}%`,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MillersPlanet() {
  const [nowMs, setNowMs]       = useState(Date.now());
  const [pageOpenMs]            = useState(Date.now());
  const [sleepHrs, setSleepHrs] = useState(8);
  const [sleepDir, setSleepDir] = useState<Direction>("earth-to-miller");
  const [customVal, setCustomVal]   = useState("");
  const [customUnit, setCustomUnit] = useState("hours");
  const [customDir, setCustomDir]   = useState<Direction>("earth-to-miller");
  const [screenHrs, setScreenHrs]   = useState(3);

  const secondRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef  = useRef<number>(0);

  useEffect(() => {
    secondRef.current = setInterval(() => setNowMs(Date.now()), 1000);
    return () => { if (secondRef.current) clearInterval(secondRef.current); };
  }, []);

  useEffect(() => {
    const animate = () => { setNowMs(Date.now()); frameRef.current = requestAnimationFrame(animate); };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // Derived
  const releaseSec     = (Date.now() - INTERSTELLAR_RELEASE_MS) / 1000;
  const earthRel       = fmtEarth(releaseSec);
  const millerRel      = fmtMiller(earthToMiller(releaseSec));

  const pageSec        = (nowMs - pageOpenMs) / 1000;
  const millerPageSec  = earthToMiller(pageSec);
  const earthPage      = fmtEarth(pageSec);
  const millerPage     = fmtMiller(millerPageSec);

  const beatsEarth     = Math.floor(pageSec * (AVG_BPM / 60));
  const beatsMiller    = (millerPageSec * (AVG_BPM / 60)).toFixed(6);

  const sleepEarthSec  = sleepHrs * 3600;
  const sleepMillerSec = earthToMiller(sleepEarthSec);

  const screenMillerSec = earthToMiller(screenHrs * 3600);

  const unitToSec: Record<string, number> = {
    seconds: 1, minutes: 60, hours: 3600, days: 86400, years: 365.25 * 86400
  };
  const customRaw   = parseFloat(customVal);
  const customValid = !isNaN(customRaw) && customRaw > 0;
  const customBase  = customValid ? customRaw * (unitToSec[customUnit] ?? 3600) : 0;
  const customMillerSec       = earthToMiller(customBase);
  const customEarthFromMiller = millerToEarth(customBase);

  const inputBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: `1px solid rgba(255,255,255,0.13)`,
    borderRadius: 8, color: C.text,
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.88rem", padding: "9px 13px",
    outline: "none", width: "100%",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; -webkit-font-smoothing: antialiased; }

        @keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glowPulse { from { transform:scale(1); opacity:0.65; } to { transform:scale(1.32); opacity:1; } }
        @keyframes wave      { from { transform:translateY(0) rotate(-2deg); } to { transform:translateY(-16px) rotate(2deg); } }
        @keyframes twinkle   { from { opacity:0.12; } to { opacity:1; } }
        @keyframes dotPulse  { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(1.5);} }

        :focus-visible { outline: 2px solid rgba(255,213,128,0.7); outline-offset: 3px; border-radius: 4px; }
        input:focus, select:focus { border-color: rgba(255,213,128,0.45) !important; box-shadow: 0 0 0 3px rgba(255,213,128,0.12); }

        input[type=range] { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:4px; background:rgba(255,255,255,0.1); outline:none; cursor:pointer; border:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:${C.amber}; cursor:pointer; box-shadow:0 0 12px rgba(255,213,128,0.55); }
        input[type=range]::-moz-range-thumb { width:20px; height:20px; border:none; border-radius:50%; background:${C.amber}; cursor:pointer; }
        input[type=range]:focus { box-shadow:none; border-color:transparent !important; }
        input[type=range]:focus-visible { outline: 2px solid rgba(255,213,128,0.7); outline-offset: 4px; }

        .pill { background:rgba(255,213,128,0.07); border:1px solid rgba(255,213,128,0.22); border-radius:999px; color:${C.textMid}; font-family:'Space Mono',monospace; font-size:0.68rem; letter-spacing:0.1em; padding:6px 16px; cursor:pointer; transition:all 0.16s; }
        .pill:hover { background:rgba(255,213,128,0.14); border-color:rgba(255,213,128,0.38); color:${C.amber}; }
        .pill.on { background:rgba(255,213,128,0.2); border-color:rgba(255,213,128,0.55); color:${C.amber}; }

        .fcard { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.065); border-radius:12px; padding:13px 16px; transition:border-color 0.18s, background 0.18s; }
        .fcard:hover { background:rgba(255,213,128,0.04); border-color:rgba(255,213,128,0.14); }

        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
        select option { background:#111318; color:${C.text}; }
      `}</style>

      <Background />
      <BackLink />

      <main style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh",
        padding: "52px 20px 72px",
        maxWidth: 700, margin: "0 auto",
        display: "flex", flexDirection: "column", gap: 22,
      }}>

        {/* Header */}
        <header style={{ textAlign: "center", animation: "fadeUp 0.65s ease both", marginBottom: 6 }}>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
            letterSpacing: "0.28em", color: C.amberDim,
            textTransform: "uppercase", marginBottom: 14,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <span style={{
              display: "inline-block", width: 7, height: 7, borderRadius: "50%",
              background: C.amber, boxShadow: `0 0 10px ${C.amber}`,
              animation: "dotPulse 2s ease-in-out infinite",
              flexShrink: 0,
            }} />
            Gravitational Time Dilation · Gargantua
          </div>
          <h1 style={{
            fontFamily: "'Lora', serif", fontWeight: 400,
            fontSize: "clamp(2.4rem, 8vw, 4rem)",
            color: C.text, letterSpacing: "0.05em", lineHeight: 1.1,
          }}>
            Miller&apos;s Planet
          </h1>
          <p style={{
            marginTop: 12, fontFamily: "'Lora', serif",
            fontStyle: "italic", color: C.textDim,
            fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
          }}>
            1 hour here · 7 years on Earth · Gargantua doesn&apos;t care about your schedule
          </p>
        </header>

        {/* 1 — Since Interstellar released */}
        <Card delay={0.08} accent>
          <SectionLabel color={C.amberDim}>Since Interstellar released — Nov 7, 2014</SectionLabel>
          <PlanetLabel />
          <ClockRow segs={[
            { val: earthRel.y, lbl: "years" },
            { val: earthRel.d, lbl: "days" },
            { val: earthRel.h, lbl: "hrs" },
            { val: earthRel.m, lbl: "min" },
            { val: earthRel.s, lbl: "sec", bright: true },
          ]} />
          <HDivider />
          <PlanetLabel miller />
          <ClockRow segs={[
            { val: millerRel.h, lbl: "hrs" },
            { val: millerRel.m, lbl: "min" },
            { val: millerRel.s, lbl: "sec" },
            { val: millerRel.ms, lbl: "ms", bright: true },
          ]} />
          <FunFact>
            {earthRel.y} years, {earthRel.d} days have passed on Earth since the film opened.
            On Miller&apos;s Planet: {millerRel.h}h {millerRel.m}m {millerRel.s}s.
            Romilly is still in the same chair, holding the same coffee, watching the same stars.
          </FunFact>
        </Card>

        {/* 2 — Since page opened */}
        <Card delay={0.16}>
          <SectionLabel color={C.blue}>Since you opened this page</SectionLabel>
          <PlanetLabel />
          <ClockRow segs={[
            { val: earthPage.h, lbl: "hrs" },
            { val: earthPage.m, lbl: "min" },
            { val: earthPage.s, lbl: "sec", bright: true },
          ]} />
          <HDivider />
          <PlanetLabel miller />
          {millerPage.h === 0 && millerPage.m === 0 && millerPage.s === 0 ? (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1rem, 3.5vw, 1.4rem)", fontWeight: 700, color: C.amber, letterSpacing: "0.04em" }}>
              {(millerPageSec * 1000).toFixed(4)}{" "}
              <span style={{ fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.18em", textTransform: "uppercase" }}>milliseconds</span>
            </div>
          ) : (
            <ClockRow segs={[
              { val: millerPage.h, lbl: "hrs" },
              { val: millerPage.m, lbl: "min" },
              { val: millerPage.s, lbl: "sec" },
              { val: millerPage.ms, lbl: "ms", bright: true },
            ]} />
          )}
          <FunFact>{funCommentPage(pageSec, millerPageSec)}</FunFact>
        </Card>

        {/* 3 — Heartbeats */}
        <Card delay={0.22}>
          <SectionLabel color="#A07888">Your heartbeats since you arrived</SectionLabel>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div>
              <PlanetLabel />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.6rem, 5vw, 2.8rem)", fontWeight: 700, color: C.text, lineHeight: 1 }}>
                {beatsEarth.toLocaleString()}
              </span>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.14em", color: C.textDim, marginTop: 5 }}>beats</div>
            </div>
            <div>
              <PlanetLabel miller />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.6rem, 5vw, 2.8rem)", fontWeight: 700, color: C.amber, lineHeight: 1, textShadow: "0 0 18px rgba(255,213,128,0.35)" }}>
                {beatsMiller}
              </span>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.14em", color: C.textDim, marginTop: 5 }}>beats</div>
            </div>
          </div>
          <FunFact>
            {pageSec < 30
              ? `Your heart has beaten ${beatsEarth.toLocaleString()} times since you arrived. On Miller's, your heart would have managed just ${beatsMiller} beats — less than a single pulse.`
              : pageSec < 300
              ? `${beatsEarth.toLocaleString()} heartbeats on Earth since you opened this page. On Miller's: ${beatsMiller} beats. Your heart is working hard for absolutely no reason on that planet.`
              : `Your heart has now beaten ${beatsEarth.toLocaleString()} times since you arrived. Miller's clock shows ${beatsMiller} beats — a number so small it doesn't have feelings about it.`}
          </FunFact>
        </Card>

        {/* 4 — Sleep */}
        <Card delay={0.28}>
          <SectionLabel color={C.blue}>While you slept</SectionLabel>
          <DirectionToggle value={sleepDir} onChange={setSleepDir} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
            {SLEEP_OPTIONS.map(h => (
              <button
                key={h} onClick={() => setSleepHrs(h)}
                className={`pill ${sleepHrs === h ? "on" : ""}`}
                aria-pressed={sleepHrs === h}
              >
                {h}h
              </button>
            ))}
          </div>
          {sleepDir === "earth-to-miller" ? (
            <>
              <PlanetLabel />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.4rem, 4vw, 2.2rem)", fontWeight: 700, color: C.text, marginBottom: 16, lineHeight: 1 }}>
                {sleepHrs} hour{sleepHrs !== 1 ? "s" : ""} on Earth
              </div>
              <PlanetLabel miller />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.4rem, 4vw, 2.2rem)", fontWeight: 700, color: C.amber, lineHeight: 1, textShadow: "0 0 18px rgba(255,213,128,0.3)" }}>
                {readableMiller(sleepMillerSec)}
              </div>
              <FunFact>
                {sleepHrs <= 5 ? "Rough night. At least on Miller's, you barely closed your eyes." :
                 sleepHrs === 6 ? "Six hours — light sleep. On Miller's, you'd barely have blinked." :
                 sleepHrs === 7 ? "A solid 7 hours. On Miller's, less than a yawn." :
                 sleepHrs === 8 ? "The recommended 8 hours. On Miller's, you'd have just blinked." :
                 sleepHrs === 9 ? "9 hours — indulgent. Miller's planet: utterly unbothered." :
                                  "10 hours. Pure luxury. Gargantua approves of this pace."}
              </FunFact>
            </>
          ) : (
            <>
              <PlanetLabel miller />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.4rem, 4vw, 2.2rem)", fontWeight: 700, color: C.amber, marginBottom: 16, lineHeight: 1 }}>
                {sleepHrs} hour{sleepHrs !== 1 ? "s" : ""} on Miller&apos;s
              </div>
              <PlanetLabel />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.4rem, 4vw, 2.2rem)", fontWeight: 700, color: C.text, lineHeight: 1 }}>
                {readableEarth(millerToEarth(sleepHrs * 3600))}
              </div>
              <FunFact>
                If you slept {sleepHrs} hour{sleepHrs !== 1 ? "s" : ""} on Miller&apos;s Planet,{" "}
                {readableEarth(millerToEarth(sleepHrs * 3600))} would have passed on Earth.
                {sleepHrs >= 3 ? " Everyone you know would be long gone." : " Your friends aged. Noticeably."}
              </FunFact>
            </>
          )}
        </Card>

        {/* 5 — Screen time */}
        <Card delay={0.34}>
          <SectionLabel color={C.blue}>Your screen time today</SectionLabel>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: C.textMid, letterSpacing: "0.1em" }}>
                {screenHrs}h {Math.round((screenHrs % 1) * 60)}m
              </span>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.58rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: screenHrs >= 7 ? "#E8A060" : screenHrs >= 4 ? C.textDim : "#7ABEAA",
                border: `1px solid currentColor`, borderRadius: 4,
                padding: "2px 9px", opacity: 0.85,
              }}>
                {screenHrs >= 7 ? "that's a lot" : screenHrs >= 4 ? "average" : "healthy"}
              </span>
            </div>
            <input
              type="range" min={0.5} max={12} step={0.5}
              value={screenHrs}
              onChange={e => setScreenHrs(parseFloat(e.target.value))}
              aria-label={`Screen time: ${screenHrs} hours`}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", color: C.textFaint, marginTop: 5, letterSpacing: "0.1em" }}>
              <span>30 min</span><span>6 hrs</span><span>12 hrs</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div>
              <PlanetLabel />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.3rem, 4vw, 2rem)", fontWeight: 700, color: C.text, lineHeight: 1 }}>
                {screenHrs}h scrolling
              </span>
            </div>
            <div>
              <PlanetLabel miller />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.3rem, 4vw, 2rem)", fontWeight: 700, color: C.amber, lineHeight: 1, textShadow: "0 0 16px rgba(255,213,128,0.3)" }}>
                {readableMiller(screenMillerSec)}
              </span>
            </div>
          </div>
          <FunFact>
            {screenHrs <= 1
              ? `${screenHrs}h on your phone. On Miller's: ${readableMiller(screenMillerSec)}. Even Gargantua respects this restraint.`
              : screenHrs <= 3
              ? `${screenHrs}h of scrolling. On Miller's: ${readableMiller(screenMillerSec)}. A thin slice of planet-time, wasted on reels.`
              : screenHrs <= 6
              ? `${screenHrs}h staring at a screen. On Miller's: ${readableMiller(screenMillerSec)}. Miller's planet has no Wi-Fi. This is not a coincidence.`
              : screenHrs <= 9
              ? `${screenHrs}h on your phone today. On Miller's: ${readableMiller(screenMillerSec)}. That's a lot of Earth time to spend on something.`
              : `${screenHrs}h? On Miller's: ${readableMiller(screenMillerSec)}. Gargantua is concerned. Primarily about the ${screenHrs} Earth hours.`}
          </FunFact>
        </Card>

        {/* 6 — Famous durations */}
        <Card delay={0.40}>
          <SectionLabel color="#9A8070">Famous durations — on Miller's Planet</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {FAMOUS.map((item, i) => {
              const ms = earthToMiller(item.earthH * 3600);
              return (
                <div key={i} className="fcard">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Lora', serif", fontSize: "clamp(0.83rem, 2.3vw, 0.93rem)", color: C.textMid, lineHeight: 1.3 }}>
                        {item.label}
                      </div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.52rem", color: C.textFaint, letterSpacing: "0.1em", marginTop: 3 }}>
                        {item.earthH}h on Earth · {item.note}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(0.78rem, 2.3vw, 0.9rem)", fontWeight: 700, color: C.amber }}>
                        {readableMiller(ms)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 7 — Custom converter */}
        <Card delay={0.46} accent>
          <SectionLabel color={C.amberDim}>Custom time converter</SectionLabel>
          <DirectionToggle value={customDir} onChange={setCustomDir} />
          <p style={{ fontFamily: "'Lora', serif", fontSize: "0.88rem", color: C.textDim, marginBottom: 14, fontStyle: "italic" }}>
            {customDir === "earth-to-miller"
              ? "Enter Earth time — see how little passes on Miller's"
              : "Enter Miller's time — see how much passes on Earth"}
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <input
              type="number" min={0} step="any"
              placeholder="e.g. 8"
              value={customVal}
              onChange={e => setCustomVal(e.target.value)}
              aria-label="Duration value"
              style={{ ...inputBase, flex: "1 1 100px", minWidth: 100 }}
            />
            <select
              value={customUnit}
              onChange={e => setCustomUnit(e.target.value)}
              aria-label="Duration unit"
              style={{
                ...inputBase,
                width: "auto", cursor: "pointer",
                appearance: "none" as const,
                WebkitAppearance: "none" as const,
                paddingRight: 32, flex: "1 1 130px",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239A8C7E'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 11px center",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              <option value="seconds">seconds</option>
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
              <option value="years">years</option>
            </select>
          </div>
          {customValid ? (
            <>
              <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start", marginBottom: 6 }}>
                {customDir === "earth-to-miller" ? (
                  <>
                    <div>
                      <PlanetLabel />
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.3rem, 4vw, 1.9rem)", fontWeight: 700, color: C.text, lineHeight: 1 }}>
                        {customVal} {customUnit}
                      </span>
                    </div>
                    <div>
                      <PlanetLabel miller />
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.3rem, 4vw, 1.9rem)", fontWeight: 700, color: C.amber, lineHeight: 1, textShadow: "0 0 16px rgba(255,213,128,0.3)" }}>
                        {readableMiller(customMillerSec)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <PlanetLabel miller />
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.3rem, 4vw, 1.9rem)", fontWeight: 700, color: C.amber, lineHeight: 1 }}>
                        {customVal} {customUnit}
                      </span>
                    </div>
                    <div>
                      <PlanetLabel />
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(1.3rem, 4vw, 1.9rem)", fontWeight: 700, color: C.text, lineHeight: 1 }}>
                        {readableEarth(customEarthFromMiller)}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <FunFact>
                {customDir === "earth-to-miller"
                  ? funCommentCustom(customMillerSec)
                  : funCommentInverse(customEarthFromMiller)}
              </FunFact>
            </>
          ) : (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: C.textFaint, letterSpacing: "0.12em" }}>
              Enter a number above to convert
            </div>
          )}
        </Card>

        {/* Footer */}
        <footer style={{ textAlign: "center", animation: "fadeUp 0.65s ease 0.54s both", paddingTop: 4 }}>
          <p style={{
            fontFamily: "'Lora', serif", fontStyle: "italic",
            fontSize: "clamp(0.78rem, 2vw, 0.86rem)",
            color: C.textFaint, lineHeight: 1.9,
          }}>
            Cooper &amp; crew spent 3h 17m on Miller&apos;s surface.<br />
            23 years, 4 months, 8 days passed on Earth.<br />
            Each tick in Hans Zimmer&apos;s score = one Earth day.
          </p>
          <div style={{
            marginTop: 16,
            fontFamily: "'Space Mono', monospace", fontSize: "0.5rem",
            letterSpacing: "0.24em", color: "#2E2820", textTransform: "uppercase",
          }}>
            wastemytime.fun · gravitational physics by Kip Thorne · Interstellar (2014)
          </div>

          <div style={{ marginTop: 48 }}>
            <YouMayLike currentId="millers-planet" labelColor="rgba(255,255,255,0.25)" />
          </div>
        </footer>
      </main>
    </>
  );
}
