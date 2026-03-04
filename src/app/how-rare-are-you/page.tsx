"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import BackLink from "@/components/BackLink";
import YouMayLike from "@/components/YouMayLike";

interface Trait {
  id: string;
  label: string;
  p: number;
  category: "Body" | "Mind" | "Life" | "Quirks";
}

const TRAITS: Trait[] = [
  // Body — physical traits
  { id: "left-handed",      label: "Left-handed",                      p: 0.10,  category: "Body" },
  { id: "red-hair",         label: "Natural red hair",                  p: 0.02,  category: "Body" },
  { id: "green-eyes",       label: "Green or grey eyes",                p: 0.04,  category: "Body" },
  { id: "blue-eyes",        label: "Blue eyes",                         p: 0.08,  category: "Body" },
  { id: "colorblind",       label: "Colorblind",                        p: 0.045, category: "Body" },
  { id: "dimples",          label: "Has dimples",                       p: 0.65,  category: "Body" },
  { id: "tongue-roll",      label: "Can roll tongue",                   p: 0.68,  category: "Body" },
  { id: "ear-wiggle",       label: "Can wiggle ears",                   p: 0.22,  category: "Body" },
  { id: "ambidextrous",     label: "Ambidextrous",                      p: 0.01,  category: "Body" },
  { id: "double-jointed",   label: "Double-jointed",                    p: 0.10,  category: "Body" },
  { id: "twin",             label: "Identical twin",                    p: 0.003, category: "Body" },
  { id: "freckles",         label: "Has freckles",                      p: 0.20,  category: "Body" },
  { id: "hitchhiker-thumb", label: "Hitchhiker's thumb",                p: 0.25,  category: "Body" },
  { id: "photic-sneeze",    label: "Sneezes in bright light",           p: 0.25,  category: "Body" },
  { id: "outie",            label: "Outie belly button",                p: 0.10,  category: "Body" },
  { id: "curly-hair",       label: "Naturally curly hair",              p: 0.15,  category: "Body" },

  // Mind — psychological traits
  { id: "night-owl",        label: "Night owl",                         p: 0.25,  category: "Mind" },
  { id: "introvert",        label: "Strong introvert",                  p: 0.30,  category: "Mind" },
  { id: "lucid-dreamer",    label: "Regular lucid dreamer",             p: 0.11,  category: "Mind" },
  { id: "synesthesia",      label: "Has synesthesia",                   p: 0.04,  category: "Mind" },
  { id: "photographic",     label: "Near-photographic memory",          p: 0.02,  category: "Mind" },
  { id: "sleep-paralysis",  label: "Experienced sleep paralysis",       p: 0.08,  category: "Mind" },
  { id: "aphantasia",       label: "Aphantasia (can't visualize)",      p: 0.04,  category: "Mind" },
  { id: "phobia",           label: "Has a specific phobia",             p: 0.10,  category: "Mind" },
  { id: "hsp",              label: "Highly sensitive person",           p: 0.15,  category: "Mind" },
  { id: "face-blind",       label: "Struggles to recognise faces",      p: 0.025, category: "Mind" },

  // Life — biographical facts
  { id: "only-child",       label: "Only child",                        p: 0.20,  category: "Life" },
  { id: "multilingual",     label: "Speaks 3+ languages",               p: 0.03,  category: "Life" },
  { id: "never-broken",     label: "Never broken a bone",               p: 0.65,  category: "Life" },
  { id: "vegetarian",       label: "Vegetarian or vegan",               p: 0.05,  category: "Life" },
  { id: "born-abroad",      label: "Born outside home country",         p: 0.035, category: "Life" },
  { id: "tattoo",           label: "Has a tattoo",                      p: 0.21,  category: "Life" },
  { id: "homeschooled",     label: "Was homeschooled",                  p: 0.035, category: "Life" },
  { id: "firstborn",        label: "Firstborn child",                   p: 0.33,  category: "Life" },
  { id: "never-flown",      label: "Never been on a plane",             p: 0.17,  category: "Life" },
  { id: "manual-car",       label: "Can drive a manual/stick shift",    p: 0.18,  category: "Life" },

  // Quirks — habits and behaviours
  { id: "nail-biter",       label: "Bites nails",                       p: 0.25,  category: "Quirks" },
  { id: "self-talk",        label: "Talks to themselves out loud",       p: 0.25,  category: "Quirks" },
  { id: "misophonia",       label: "Rage at chewing sounds (misophonia)", p: 0.20, category: "Quirks" },
  { id: "leg-bounce",       label: "Bounces leg constantly",            p: 0.30,  category: "Quirks" },
  { id: "no-alarm",         label: "Wakes up before alarm",             p: 0.22,  category: "Quirks" },
  { id: "eye-twitch",       label: "Gets eye twitches under stress",    p: 0.40,  category: "Quirks" },
  { id: "cant-whistle",     label: "Can't whistle",                     p: 0.33,  category: "Quirks" },
  { id: "vivid-daydreamer", label: "Vivid, immersive daydreamer",       p: 0.18,  category: "Quirks" },
];

function computeRarity(selected: Set<string>): number {
  if (selected.size === 0) return 1;
  let prob = 1;
  for (const id of selected) {
    const trait = TRAITS.find((t) => t.id === id);
    if (trait) prob *= trait.p;
  }
  return Math.min(1 / prob, 7_800_000_000);
}

function formatRarity(n: number): string {
  if (n <= 1) return "1 in 1";
  if (n < 100) return `1 in ${Math.round(n)}`;
  if (n < 1000) return `1 in ${Math.round(n / 10) * 10}`;
  if (n < 10_000) return `1 in ${Math.round(n / 100) * 100}`;
  if (n < 100_000) return `1 in ${(n / 1_000).toFixed(1)}k`;
  if (n < 1_000_000) return `1 in ${Math.round(n / 1_000)}k`;
  if (n < 1_000_000_000) return `1 in ${(n / 1_000_000).toFixed(1)}M`;
  return "1 in 7.8B";
}

function rarityLabel(n: number): string {
  if (n < 5) return "You blend right in.";
  if (n < 20) return "Quite common, actually.";
  if (n < 100) return "A little different.";
  if (n < 1_000) return "Notably rare.";
  if (n < 10_000) return "Quite rare.";
  if (n < 100_000) return "Very rare.";
  if (n < 1_000_000) return "Exceptionally rare.";
  if (n < 7_800_000_000) return "Nearly one of a kind.";
  return "One of a kind.";
}

const BG = "#07071a";
const DOT_COUNT = 2800;

interface Dot {
  x: number;
  y: number;
  r: number;
  targetOpacity: number;
}

export default function HowRareAreYou() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<"select" | "reveal">("select");
  const [showResult, setShowResult] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const userDotRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const rarity = useMemo(() => computeRarity(selected), [selected]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Canvas animation on reveal
  useEffect(() => {
    if (phase !== "reveal") return;

    setShowResult(false);
    const resultTimer = setTimeout(() => setShowResult(true), 1800);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // User dot near center with slight random offset
    const ux = W / 2 + (Math.random() - 0.5) * 60;
    const uy = H / 2 + (Math.random() - 0.5) * 60;
    userDotRef.current = { x: ux, y: uy };

    // Scatter other dots, keeping a clear zone around user dot
    const dots: Dot[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      let x: number, y: number;
      do {
        x = Math.random() * W;
        y = Math.random() * H;
      } while (Math.hypot(x - ux, y - uy) < 30);
      dots.push({
        x,
        y,
        r: Math.random() * 1.4 + 0.4,
        targetOpacity: Math.random() * 0.13 + 0.04,
      });
    }
    dotsRef.current = dots;
    startTimeRef.current = null;

    const FADE_MS = 1400;
    const PULSE_START = 1600;

    function draw(ts: number) {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const progress = Math.min(elapsed / FADE_MS, 1);

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // Background dots
      for (const d of dotsRef.current) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,185,230,${d.targetOpacity * progress})`;
        ctx.fill();
      }

      // User dot — glowing white
      const { x: ux, y: uy } = userDotRef.current;
      let r = 4;
      let glow = 0;
      if (elapsed > PULSE_START) {
        const t = (elapsed - PULSE_START) / 1000;
        const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
        r = 4 + pulse * 2;
        glow = 18 + pulse * 18;
      }
      ctx.save();
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = glow;
      ctx.beginPath();
      ctx.arc(ux, uy, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.min(progress * 2, 1)})`;
      ctx.fill();
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(resultTimer);
    };
  }, [phase]);

  const categories = ["Body", "Mind", "Life", "Quirks"] as const;
  const minTraits = 2;
  const canReveal = selected.size >= minTraits;

  // ── Reveal screen ────────────────────────────────────────────────────────────
  if (phase === "reveal") {
    return (
      <div style={{ background: BG, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <BackLink />
        <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, display: "block" }} />

        {/* Result overlay — fades in after dots settle */}
        <div
          style={{
            position: "fixed",
            bottom: "8vh",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            zIndex: 10,
            transition: "opacity 0.8s ease",
            opacity: showResult ? 1 : 0,
            pointerEvents: showResult ? "auto" : "none",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "rgba(255,255,255,0.45)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            You are
          </p>
          <p
            style={{
              fontFamily: "var(--font-fraunces), serif",
              color: "#ffffff",
              fontSize: "clamp(40px, 9vw, 80px)",
              fontWeight: 700,
              lineHeight: 1,
              marginBottom: 14,
            }}
          >
            {formatRarity(rarity)}
          </p>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              marginBottom: 36,
            }}
          >
            {rarityLabel(rarity)}
          </p>
          <button
            onClick={() => {
              setPhase("select");
              setShowResult(false);
            }}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              padding: "10px 28px",
              color: "rgba(255,255,255,0.8)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Try different traits
          </button>

          <div style={{ width: "min(90vw, 680px)", marginTop: 8 }}>
            <YouMayLike currentId="how-rare-are-you" />
          </div>
        </div>
      </div>
    );
  }

  // ── Selection screen ─────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: BG,
        minHeight: "100vh",
        padding: "80px 24px 140px",
        color: "#ffffff",
      }}
    >
      <BackLink />
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "clamp(32px, 7vw, 58px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          How Rare Are You?
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            color: "rgba(255,255,255,0.4)",
            fontSize: 14,
            marginBottom: 52,
          }}
        >
          Select everything that's true about you.
        </p>

        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: 44 }}>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                color: "rgba(255,255,255,0.28)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              {cat}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {TRAITS.filter((t) => t.category === cat).map((trait) => {
                const on = selected.has(trait.id);
                return (
                  <button
                    key={trait.id}
                    onClick={() => toggle(trait.id)}
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 13,
                      padding: "8px 18px",
                      borderRadius: 999,
                      border: `1px solid ${on ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.16)"}`,
                      background: on ? "rgba(255,255,255,0.12)" : "transparent",
                      color: on ? "#ffffff" : "rgba(255,255,255,0.45)",
                      cursor: "pointer",
                      transition: "border-color 0.15s, color 0.15s, background 0.15s",
                    }}
                  >
                    {trait.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "24px 24px 28px",
          background: `linear-gradient(to top, ${BG} 55%, transparent)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          zIndex: 10,
        }}
      >
        {selected.size > 0 && (
          <p
            style={{
              fontFamily: "var(--font-fraunces), serif",
              color: "rgba(255,255,255,0.6)",
              fontSize: 20,
              margin: 0,
            }}
          >
            {formatRarity(rarity)}
          </p>
        )}
        <button
          onClick={() => canReveal && setPhase("reveal")}
          disabled={!canReveal}
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            background: canReveal ? "#ffffff" : "rgba(255,255,255,0.12)",
            color: canReveal ? BG : "rgba(255,255,255,0.3)",
            border: "none",
            borderRadius: 999,
            padding: "13px 36px",
            fontSize: 14,
            fontWeight: 600,
            cursor: canReveal ? "pointer" : "not-allowed",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {!canReveal
            ? `Pick ${minTraits - selected.size} more`
            : "Reveal →"}
        </button>
      </div>
    </div>
  );
}
