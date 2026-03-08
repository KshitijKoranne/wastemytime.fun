"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import BackLink from "@/components/BackLink";
import YouMayLike from "@/components/YouMayLike";

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Name generator ──────────────────────────────────────────────────────────
const GENUS = ["Anxie","Procras","Somni","Dormi","Caffei","Memo","Distrac","Rumina","Oblivi","Veloci","Scrol","Nocturn","Melanchol","Stupefi","Torpid"];
const GSUF = ["tus","inus","icus","ellus","oides","ifer","anus","atus","ax","ix"];
const SPEC = ["nocturn","domestic","digit","brevit","solit","fenestr","retrosp","quotidi","surrept","lament","veloci","perenn","vagan","pigr","immin"];
const SSUF = ["us","alis","icus","ensis","ii","atus","ae","orum","osus","idus"];
const HABITATS = [
  "Found near: a forgotten browser tab",
  "Habitat: the gap between tasks",
  "Observed: 2:47am, near blue light",
  "Specimen collected: during a meeting",
  "Location: the back of the mind",
  "Discovered: while avoiding emails",
  "Origin: the space between thoughts",
  "Found: under a pile of open tabs",
  "Habitat: the bottom of a phone screen",
  "Observed: Sunday evening, cause unknown",
];

function makeName(rng: () => number) {
  const g = GENUS[Math.floor(rng() * GENUS.length)] + GSUF[Math.floor(rng() * GSUF.length)];
  const s = SPEC[Math.floor(rng() * SPEC.length)] + SSUF[Math.floor(rng() * SSUF.length)];
  return { genus: g[0].toUpperCase() + g.slice(1), species: s };
}

// ─── Bug drawing ─────────────────────────────────────────────────────────────
function drawBug(canvas: HTMLCanvasElement, seed: number) {
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 + 10;
  ctx.clearRect(0, 0, W, H);

  const rng = mulberry32(seed);
  const r = (a: number, b: number) => a + rng() * (b - a);
  const ri = (a: number, b: number) => Math.floor(r(a, b + 1));
  const inkAlpha = r(0.82, 1.0);
  const ink = `rgba(42,26,10,${inkAlpha})`;

  function ellipse(x: number, y: number, rx: number, ry: number, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function leg(sx: number, sy: number, side: number) {
    ctx.strokeStyle = ink;
    ctx.lineWidth = r(0.7, 1.2);
    const segs = ri(2, 3);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    let x = sx, y = sy;
    for (let i = 0; i < segs; i++) {
      const len = r(14, 26);
      const base = side > 0 ? r(0.2, 1.0) : r(Math.PI - 1.0, Math.PI - 0.2);
      const ang = base + i * r(0.1, 0.3) * (i % 2 ? -1 : 1);
      const nx = x + Math.cos(ang) * len;
      const ny = y + Math.sin(ang) * len * r(0.5, 0.9);
      ctx.quadraticCurveTo((x + nx) / 2 + side * r(2, 7), (y + ny) / 2 + r(-5, 5), nx, ny);
      x = nx; y = ny;
    }
    ctx.stroke();
  }

  const bodyLen = r(46, 70);
  const bodyW = r(24, 42);
  const headR = r(11, 18);
  const bugType = ri(0, 3);

  function antenna(side: number) {
    const ax = cx + side * r(3, 7);
    const ay = cy - bodyLen * 0.5 - headR * 1.2;
    ctx.strokeStyle = ink;
    ctx.lineWidth = r(0.6, 1.0);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    const len = r(20, 38);
    const ang = side > 0 ? r(-1.7, -0.7) : r(Math.PI + 0.7, Math.PI + 1.7);
    const mx = ax + Math.cos(ang) * len;
    const my = ay + Math.sin(ang) * len;
    ctx.quadraticCurveTo(ax + side * r(4, 12), ay - r(8, 18), mx, my);
    ctx.stroke();
    if (ri(0, 1) === 0) {
      ctx.beginPath();
      ctx.arc(mx, my, r(2, 4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(42,26,10,${r(0.4, 0.8)})`;
      ctx.fill();
    } else {
      for (let i = 0; i < ri(3, 5); i++) {
        const a = r(0, Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(mx + Math.cos(a) * r(3, 7), my + Math.sin(a) * r(3, 7));
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  ctx.strokeStyle = ink;
  ctx.fillStyle = `rgba(42,26,10,0.07)`;
  ctx.lineWidth = r(1.1, 1.6);

  // Legs
  const pairs = ri(2, 4);
  for (let i = 0; i < pairs; i++) {
    const ly = cy - bodyLen * 0.3 + (i / (pairs - 1 || 1)) * bodyLen * 0.6;
    leg(cx - bodyW * 0.42, ly, -1);
    leg(cx + bodyW * 0.42, ly, 1);
  }

  // Wings
  if (bugType === 0 || bugType === 1) {
    const ws = r(bugType === 1 ? 65 : 44, bugType === 1 ? 100 : 72);
    const wh = r(bugType === 1 ? 50 : 28, bugType === 1 ? 78 : 52);
    const wy = cy - bodyLen * 0.1;
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.beginPath();
      if (bugType === 1) {
        ctx.moveTo(cx, wy);
        ctx.bezierCurveTo(cx + s * ws * 0.3, wy - wh * 0.3, cx + s * ws, wy - wh * 0.5, cx + s * ws * 0.9, wy + wh * 0.6);
        ctx.bezierCurveTo(cx + s * ws * 0.5, wy + wh, cx + s * ws * 0.1, wy + wh * 0.3, cx, wy);
      } else {
        ctx.moveTo(cx + s * 3, cy - bodyLen * 0.33);
        ctx.bezierCurveTo(cx + s * ws * 0.6, cy - bodyLen * 0.38, cx + s * ws * 0.72, cy, cx + s * ws * 0.5, cy + bodyLen * 0.33);
        ctx.bezierCurveTo(cx + s * ws * 0.2, cy + bodyLen * 0.43, cx + s * 5, cy + bodyLen * 0.38, cx + s * 3, cy - bodyLen * 0.33);
      }
      ctx.fillStyle = `rgba(42,26,10,${r(0.04, 0.09)})`;
      ctx.fill();
      ctx.lineWidth = r(1.0, 1.5);
      ctx.strokeStyle = ink;
      ctx.stroke();
      if (bugType === 1) {
        for (let v = 0; v < ri(3, 5); v++) {
          ctx.beginPath();
          ctx.moveTo(cx, wy + r(-5, 8));
          ctx.quadraticCurveTo(cx + s * ws * r(0.3, 0.7), wy + r(-wh * 0.3, wh * 0.3), cx + s * ws * r(0.6, 1.0), wy + r(-wh * 0.2, wh * 0.5));
          ctx.lineWidth = r(0.3, 0.6);
          ctx.strokeStyle = `rgba(42,26,10,${r(0.15, 0.4)})`;
          ctx.stroke();
        }
      }
      ctx.restore();
      ctx.strokeStyle = ink;
    }
  }

  // Abdomen
  ctx.save();
  ctx.translate(cx, cy + bodyLen * 0.3);
  ctx.rotate(r(-0.12, 0.12));
  const abdSegs = ri(3, 6);
  const abdLen = r(38, 62);
  for (let i = 0; i < abdSegs; i++) {
    const sy = (i / abdSegs) * abdLen;
    const srx = bodyW * (0.45 + 0.45 * Math.sin((i / abdSegs) * Math.PI)) * r(0.8, 1.0);
    const sry = (abdLen / abdSegs) * r(0.44, 0.54);
    ctx.fillStyle = i % 2 === 0 ? `rgba(42,26,10,${r(0.06, 0.12)})` : `rgba(42,26,10,${r(0.02, 0.06)})`;
    ctx.strokeStyle = ink;
    ctx.lineWidth = r(0.7, 1.2);
    ellipse(0, sy, srx, sry);
  }
  ctx.restore();

  // Thorax
  ctx.fillStyle = `rgba(42,26,10,${r(0.06, 0.13)})`;
  ctx.strokeStyle = ink;
  ctx.lineWidth = r(1.2, 1.7);
  ellipse(cx, cy, bodyW * 0.5, bodyLen * 0.5);

  // Thorax detail
  const dt = ri(0, 2);
  if (dt === 0) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - bodyLen * 0.42);
    ctx.lineTo(cx, cy + bodyLen * 0.42);
    ctx.lineWidth = r(0.3, 0.6);
    ctx.strokeStyle = `rgba(42,26,10,${r(0.2, 0.4)})`;
    ctx.stroke();
  } else if (dt === 1) {
    for (let i = 0; i < ri(2, 5); i++) {
      ctx.beginPath();
      ctx.arc(cx + r(-bodyW * 0.22, bodyW * 0.22), cy - bodyLen * 0.3 + (i / 4) * bodyLen * 0.6, r(1.5, 4.5), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(42,26,10,${r(0.12, 0.3)})`;
      ctx.fill();
    }
  }

  // Head
  ctx.fillStyle = `rgba(42,26,10,${r(0.08, 0.17)})`;
  ctx.strokeStyle = ink;
  ctx.lineWidth = r(1.1, 1.6);
  ellipse(cx, cy - bodyLen * 0.5 - headR * 0.65, headR, headR * r(0.75, 1.05));

  // Eyes
  const eo = headR * r(0.33, 0.52);
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cx + s * eo, cy - bodyLen * 0.5 - headR * 0.65, r(1.8, 3.5), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(42,26,10,${r(0.5, 0.9)})`;
    ctx.fill();
  }

  antenna(-1);
  antenna(1);

  // Hatch texture
  for (let i = 0; i < ri(4, 9); i++) {
    const hx = cx + r(-bodyW * 0.32, bodyW * 0.32);
    const hy = cy + r(-bodyLen * 0.33, bodyLen * 0.33);
    const ha = r(0, Math.PI);
    const hl = r(2, 5);
    ctx.beginPath();
    ctx.moveTo(hx + Math.cos(ha) * hl, hy + Math.sin(ha) * hl);
    ctx.lineTo(hx - Math.cos(ha) * hl, hy - Math.sin(ha) * hl);
    ctx.lineWidth = r(0.3, 0.7);
    ctx.strokeStyle = `rgba(42,26,10,${r(0.1, 0.22)})`;
    ctx.stroke();
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ArchiveEntry {
  seed: number;
  commonName: string;
  genus: string;
  species: string;
  habitat: string;
  date: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function YourBugPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 999999));
  const [name, setName] = useState({ genus: "", species: "" });
  const [habitat, setHabitat] = useState("");
  const [commonName, setCommonName] = useState("");
  const [screen, setScreen] = useState<"discover" | "name" | "archive">("discover");
  const [archive, setArchive] = useState<ArchiveEntry[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const archiveRefs = useRef<Record<number, HTMLCanvasElement | null>>({});

  const regen = useCallback(() => {
    setSeed(Math.floor(Math.random() * 999999));
    setCommonName("");
    setSubmitted(false);
    setScreen("discover");
  }, []);

  useEffect(() => {
    const rng = mulberry32(seed);
    setName(makeName(rng));
    setHabitat(HABITATS[Math.floor(rng() * HABITATS.length)]);
  }, [seed]);

  useEffect(() => {
    if (canvasRef.current && screen === "discover") {
      drawBug(canvasRef.current, seed);
    }
  }, [seed, screen]);

  useEffect(() => {
    archive.forEach((e) => {
      const c = archiveRefs.current[e.seed];
      if (c) drawBug(c, e.seed);
    });
  }, [archive, screen]);

  function submit() {
    if (!commonName.trim()) return;
    setArchive((prev) => [
      ...prev,
      {
        seed,
        commonName: commonName.trim(),
        genus: name.genus,
        species: name.species,
        habitat,
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      },
    ]);
    setSubmitted(true);
  }

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F5EDD6",
        fontFamily: "'IM Fell English', Georgia, serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 16px 80px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        .bug-btn { font-family: 'IM Fell English', Georgia, serif; cursor: pointer; transition: opacity 0.15s; }
        .bug-btn:hover { opacity: 0.75; }
        .bug-input:focus { outline: none; border-color: rgba(42,26,10,0.55) !important; }
        .bug-input::placeholder { color: rgba(42,26,10,0.3); font-style: italic; }
        @keyframes bugFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .bug-fade { animation: bugFadeIn 0.4s ease forwards; }
      `}</style>

      {/* Nav */}
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(42,26,10,0.15)",
          padding: "22px 0 14px",
          marginBottom: 36,
        }}
      >
        <BackLink />
        <span
          onClick={() => setScreen(screen === "archive" ? "discover" : "archive")}
          style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "rgba(42,26,10,0.38)", cursor: "pointer" }}
        >
          {screen === "archive" ? "← back" : `archive (${archive.length})`}
        </span>
      </div>

      {/* ── Archive view ── */}
      {screen === "archive" ? (
        <div className="bug-fade" style={{ width: "100%", maxWidth: 560 }}>
          <h2 style={{ textAlign: "center", fontStyle: "italic", fontSize: 30, color: "rgba(42,26,10,0.8)", marginBottom: 4 }}>
            Your Collection
          </h2>
          <p style={{ textAlign: "center", fontStyle: "italic", fontSize: 13, color: "rgba(42,26,10,0.4)", marginBottom: 36 }}>
            {archive.length === 0 ? "Nothing catalogued yet." : `${archive.length} specimen${archive.length !== 1 ? "s" : ""} discovered`}
          </p>
          {archive.length === 0 ? (
            <div style={{ textAlign: "center", padding: 48 }}>
              <p style={{ fontStyle: "italic", color: "rgba(42,26,10,0.35)", fontSize: 15, marginBottom: 20 }}>
                Go find something.
              </p>
              <button
                onClick={() => setScreen("discover")}
                className="bug-btn"
                style={{ padding: "11px 28px", background: "rgba(42,26,10,0.82)", color: "#F5EDD6", border: "none", borderRadius: 3, letterSpacing: 1.5, textTransform: "uppercase", fontSize: 12 }}
              >
                Discover
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {archive.map((e) => (
                <div
                  key={e.seed}
                  style={{ background: "#FBF5E4", border: "1px solid rgba(42,26,10,0.18)", borderRadius: 3, padding: "14px 12px 10px", boxShadow: "2px 3px 10px rgba(42,26,10,0.07)" }}
                >
                  <canvas
                    ref={(el) => { archiveRefs.current[e.seed] = el; }}
                    width={150}
                    height={130}
                    style={{ width: "100%", display: "block" }}
                  />
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(42,26,10,0.12)" }}>
                    <div style={{ fontSize: 14, fontWeight: "bold", color: "rgba(42,26,10,0.82)" }}>{e.commonName}</div>
                    <div style={{ fontSize: 10, fontStyle: "italic", color: "rgba(42,26,10,0.45)", marginTop: 2 }}>{e.genus} {e.species}</div>
                    <div style={{ fontSize: 10, color: "rgba(42,26,10,0.3)", marginTop: 3 }}>{e.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 48 }}>
            <YouMayLike currentId="your-bug" />
          </div>
        </div>
      ) : (
        /* ── Discover / Name view ── */
        <div className="bug-fade" style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(42,26,10,0.35)", marginBottom: 6 }}>
              new species
            </div>
            <h1 style={{ fontSize: 38, margin: 0, color: "rgba(42,26,10,0.82)", lineHeight: 1.1 }}>
              {screen === "discover" ? "Your Bug" : "Name It"}
            </h1>
          </div>

          {/* Specimen card */}
          <div
            style={{
              width: "100%",
              background: "#FBF5E4",
              border: "1px solid rgba(42,26,10,0.2)",
              borderRadius: 4,
              padding: "28px 24px 22px",
              boxShadow: "3px 5px 24px rgba(42,26,10,0.09)",
              position: "relative",
            }}
          >
            {/* Corner brackets */}
            {(["top","bottom"] as const).flatMap(v =>
              (["left","right"] as const).map(h => (
                <div
                  key={v+h}
                  style={{
                    position: "absolute", [v]: 8, [h]: 8, width: 14, height: 14,
                    borderTop: v === "top" ? "1px solid rgba(42,26,10,0.22)" : undefined,
                    borderBottom: v === "bottom" ? "1px solid rgba(42,26,10,0.22)" : undefined,
                    borderLeft: h === "left" ? "1px solid rgba(42,26,10,0.22)" : undefined,
                    borderRight: h === "right" ? "1px solid rgba(42,26,10,0.22)" : undefined,
                  }}
                />
              ))
            )}

            <canvas
              ref={canvasRef}
              width={360}
              height={300}
              style={{ width: "100%", maxWidth: 360, display: "block", margin: "0 auto" }}
            />

            <div style={{ textAlign: "center", marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(42,26,10,0.13)" }}>
              <div style={{ fontSize: 18, fontStyle: "italic", color: "rgba(42,26,10,0.7)" }}>
                {name.genus} {name.species}
              </div>
              {submitted && commonName && (
                <div style={{ fontSize: 24, fontWeight: "bold", color: "rgba(42,26,10,0.85)", marginTop: 4 }}>
                  &ldquo;{commonName}&rdquo;
                </div>
              )}
              <div style={{ fontSize: 12, fontStyle: "italic", color: "rgba(42,26,10,0.38)", marginTop: 5 }}>
                {habitat}
              </div>
              <div style={{ fontSize: 11, letterSpacing: 0.5, color: "rgba(42,26,10,0.27)", marginTop: 3 }}>
                {today}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 24, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {!submitted ? (
              screen === "discover" ? (
                <>
                  <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 360 }}>
                    <button
                      onClick={regen}
                      className="bug-btn"
                      style={{ flex: 1, padding: "11px 0", background: "transparent", border: "1px solid rgba(42,26,10,0.28)", borderRadius: 3, fontSize: 12, color: "rgba(42,26,10,0.55)", letterSpacing: 1.5, textTransform: "uppercase" }}
                    >
                      Next →
                    </button>
                    <button
                      onClick={() => setScreen("name")}
                      className="bug-btn"
                      style={{ flex: 1, padding: "11px 0", background: "rgba(42,26,10,0.83)", border: "none", borderRadius: 3, fontSize: 12, color: "#F5EDD6", letterSpacing: 1.5, textTransform: "uppercase" }}
                    >
                      Name it
                    </button>
                  </div>
                  <p style={{ fontSize: 12, fontStyle: "italic", color: "rgba(42,26,10,0.32)", textAlign: "center", margin: 0, maxWidth: 320 }}>
                    Every specimen exists only once. Name it before it disappears.
                  </p>
                </>
              ) : (
                <>
                  <input
                    autoFocus
                    value={commonName}
                    onChange={(e) => setCommonName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="What do you call it?"
                    className="bug-input"
                    style={{ width: "100%", maxWidth: 360, padding: "12px 16px", fontSize: 16, fontFamily: "'IM Fell English', Georgia, serif", fontStyle: "italic", background: "#FBF5E4", border: "1px solid rgba(42,26,10,0.28)", borderRadius: 3, color: "rgba(42,26,10,0.85)" }}
                  />
                  <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 360 }}>
                    <button
                      onClick={() => setScreen("discover")}
                      className="bug-btn"
                      style={{ flex: 1, padding: "11px 0", background: "transparent", border: "1px solid rgba(42,26,10,0.28)", borderRadius: 3, fontSize: 12, color: "rgba(42,26,10,0.45)", letterSpacing: 1.5, textTransform: "uppercase" }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={submit}
                      disabled={!commonName.trim()}
                      className="bug-btn"
                      style={{ flex: 1, padding: "11px 0", background: commonName.trim() ? "rgba(42,26,10,0.83)" : "rgba(42,26,10,0.18)", border: "none", borderRadius: 3, fontSize: 12, color: "#F5EDD6", letterSpacing: 1.5, textTransform: "uppercase" }}
                    >
                      Catalogue it
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                <p style={{ fontSize: 13, fontStyle: "italic", color: "rgba(42,26,10,0.5)", textAlign: "center", margin: 0 }}>
                  Added to your collection.
                </p>
                <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 360 }}>
                  <button
                    onClick={() => setScreen("archive")}
                    className="bug-btn"
                    style={{ flex: 1, padding: "11px 0", background: "transparent", border: "1px solid rgba(42,26,10,0.28)", borderRadius: 3, fontSize: 12, color: "rgba(42,26,10,0.55)", letterSpacing: 1.5, textTransform: "uppercase" }}
                  >
                    View Archive
                  </button>
                  <button
                    onClick={regen}
                    className="bug-btn"
                    style={{ flex: 1, padding: "11px 0", background: "rgba(42,26,10,0.83)", border: "none", borderRadius: 3, fontSize: 12, color: "#F5EDD6", letterSpacing: 1.5, textTransform: "uppercase" }}
                  >
                    Find Another
                  </button>
                </div>
              </>
            )}
          </div>

          {/* YouMayLike only after submitting */}
          {submitted && (
            <div style={{ marginTop: 56, width: "100%" }}>
              <YouMayLike currentId="your-bug" />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
