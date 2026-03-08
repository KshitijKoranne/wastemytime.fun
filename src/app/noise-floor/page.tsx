"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import BackLink from "@/components/BackLink";
import YouMayLike from "@/components/YouMayLike";
import ShareButtons from "@/components/ShareButtons";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Screen = "intro" | "denied" | "listening" | "result";

interface Reading {
  avg: number;
  min: number;
  max: number;
}

interface Observation {
  time: number;
  text: string;
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const DURATION = 30; // seconds

const OBSERVATION_POOL: { threshold: number; text: string }[] = [
  { threshold: 5,  text: "Almost nothing. Silence has its own texture." },
  { threshold: 15, text: "A breath. The room holds itself still." },
  { threshold: 25, text: "The hum of something electrical, always on." },
  { threshold: 35, text: "Somewhere, a fan turns without asking." },
  { threshold: 42, text: "That's the baseline of modern life." },
  { threshold: 50, text: "Someone exists nearby. You can feel it." },
  { threshold: 56, text: "The city finds its way in." },
  { threshold: 62, text: "A door. A chair. Something shifting." },
  { threshold: 68, text: "You moved, didn't you?" },
  { threshold: 74, text: "That was a moment. It won't come back." },
  { threshold: 82, text: "Something happened just now." },
  { threshold: 90, text: "The world is very loud, it turns out." },
];

function getVerdict(avg: number): string {
  if (avg < 15) return "Quieter than an anechoic chamber. Almost unnatural. Are you sure you're still here?";
  if (avg < 28) return "Quieter than a whisper. Your room is breathing, barely. Most people never hear it.";
  if (avg < 40) return "Quieter than a library. The machinery of your life runs on a low hum.";
  if (avg < 50) return "The baseline of modern living. This is what 'quiet' actually sounds like.";
  if (avg < 60) return "Comparable to a normal conversation happening somewhere nearby. The world leaks in.";
  if (avg < 70) return "Your environment is alive. Traffic, appliances, the building itself — all talking.";
  if (avg < 80) return "Louder than most offices. You've stopped noticing it. That's how it works.";
  return "This is not a quiet room. But you knew that, somewhere.";
}

function getComparison(avg: number): string {
  if (avg < 18) return "an anechoic lab";
  if (avg < 32) return "a recording studio";
  if (avg < 42) return "a library";
  if (avg < 52) return "a quiet home";
  if (avg < 60) return "a normal conversation";
  if (avg < 68) return "an open office";
  if (avg < 78) return "city traffic";
  return "a busy restaurant";
}

function rmsToDb(rms: number): number {
  if (rms < 0.00001) return -96;
  return 20 * Math.log10(rms);
}

// Map raw dB (-60 to 0) → perceptual 0–100 display scale
function normalizeDb(rawDb: number): number {
  const mapped = ((rawDb + 60) / 60) * 100;
  return Math.max(0, Math.min(100, Math.round(mapped)));
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function NoiseFloor() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [liveDb, setLiveDb] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [obsTicker, setObsTicker] = useState("");
  const [obsVisible, setObsVisible] = useState(true);
  const [result, setResult] = useState<Reading | null>(null);
  const [resultObs, setResultObs] = useState<Observation[]>([]);
  const [shareCardUrl, setShareCardUrl] = useState<string | null>(null);
  const [sharePreviewOpen, setSharePreviewOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "generating" | "ready">("idle");

  const waveSnapshotRef = useRef<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const dbReadingsRef = useRef<number[]>([]);
  const peakRef = useRef<number>(-Infinity);
  const minRef = useRef<number>(Infinity);
  const capturedObsRef = useRef<Observation[]>([]);
  const lastObsTimeRef = useRef<number>(-999);
  const waveHistoryRef = useRef<number[]>(new Array(200).fill(0));
  const ctx2dRef = useRef<CanvasRenderingContext2D | null>(null);

  /* ── Canvas setup ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx2dRef.current = ctx;

    const onResize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Stop all audio ── */
  const stopAudio = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
    analyserRef.current = null;
  }, []);

  /* ── Waveform draw loop ── */
  const drawWaveform = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = ctx2dRef.current;
    if (!analyser || !canvas || !ctx) return;

    rafRef.current = requestAnimationFrame(drawWaveform);

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const buf = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatTimeDomainData(buf);

    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    const disp = normalizeDb(rmsToDb(rms));

    waveHistoryRef.current.push(disp / 100);
    if (waveHistoryRef.current.length > 200) waveHistoryRef.current.shift();

    ctx.clearRect(0, 0, W, H);
    const cy = H / 2;
    const step = W / (waveHistoryRef.current.length - 1);

    // Centre line
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(W, cy);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const last = waveHistoryRef.current[waveHistoryRef.current.length - 1];

    // Fill above
    ctx.beginPath();
    ctx.moveTo(0, cy);
    waveHistoryRef.current.forEach((v, i) => ctx.lineTo(i * step, cy - v * H * 0.44));
    ctx.lineTo(W, cy);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(184,169,154,0.18)");
    grad.addColorStop(1, "rgba(184,169,154,0)");
    ctx.fillStyle = grad;
    ctx.fill();

    // Top stroke
    ctx.beginPath();
    waveHistoryRef.current.forEach((v, i) => {
      const x = i * step, y = cy - v * H * 0.44;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = `rgba(184,169,154,${0.3 + last * 0.7})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Mirror stroke (subtler)
    ctx.beginPath();
    waveHistoryRef.current.forEach((v, i) => {
      const x = i * step, y = cy + v * H * 0.44;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = `rgba(184,169,154,${0.1 + last * 0.25})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    setLiveDb(disp);
  }, []);

  /* ── 1-second data sampling loop ── */
  const sampleLoop = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const now = (performance.now() - startTimeRef.current) / 1000;
    const remaining = Math.max(0, DURATION - now);

    // Sample dB
    const buf = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const disp = normalizeDb(rmsToDb(Math.sqrt(sum / buf.length)));

    dbReadingsRef.current.push(disp);
    if (disp > peakRef.current) peakRef.current = disp;
    if (disp < minRef.current) minRef.current = disp;

    setElapsed(Math.min(now, DURATION));

    // Observation ticker
    const matched = OBSERVATION_POOL.filter(o => disp >= o.threshold);
    if (matched.length > 0 && now - lastObsTimeRef.current > 8) {
      const obs = matched[Math.floor(Math.random() * matched.length)];
      setObsVisible(false);
      setTimeout(() => { setObsTicker(obs.text); setObsVisible(true); }, 500);
      capturedObsRef.current.push({ time: Math.round(now), text: obs.text });
      lastObsTimeRef.current = now;
    }

    if (remaining > 0) {
      timerRef.current = setTimeout(sampleLoop, 1000);
    } else {
      finishListening();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Finish ── */
  const finishListening = useCallback(() => {
    // Snapshot waveform BEFORE stopping audio (last live frame)
    if (canvasRef.current) {
      waveSnapshotRef.current = canvasRef.current.toDataURL("image/png");
    }
    stopAudio();
    const readings = dbReadingsRef.current;
    const avg = readings.length
      ? Math.round(readings.reduce((a, b) => a + b, 0) / readings.length)
      : 0;
    const min = minRef.current === Infinity ? 0 : Math.round(minRef.current);
    const max = peakRef.current === -Infinity ? 0 : Math.round(peakRef.current);

    // Deduplicate observations by text
    const unique = [...new Map(capturedObsRef.current.map(o => [o.text, o])).values()];
    if (unique.length === 0) unique.push({ time: 15, text: "The room revealed nothing unusual. Or everything." });

    setResult({ avg, min, max });
    setResultObs(unique.slice(0, 5));
    setScreen("result");
  }, [stopAudio]);

  /* ── Request mic ── */
  const requestMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;
      ctx.createMediaStreamSource(stream).connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      // Reset state
      dbReadingsRef.current = [];
      peakRef.current = -Infinity;
      minRef.current = Infinity;
      capturedObsRef.current = [];
      lastObsTimeRef.current = -999;
      waveHistoryRef.current = new Array(200).fill(0);
      startTimeRef.current = performance.now();
      setElapsed(0);
      setObsTicker("");
      setObsVisible(true);
      setLiveDb(null);

      setScreen("listening");
      drawWaveform();
      timerRef.current = setTimeout(sampleLoop, 1000);
    } catch {
      setScreen("denied");
    }
  }, [drawWaveform, sampleLoop]);

  const goHome = useCallback(() => {
    stopAudio();
    setScreen("intro");
    setResult(null);
    setElapsed(0);
    setLiveDb(null);
    setShareCardUrl(null);
    setSharePreviewOpen(false);
    setShareStatus("idle");
    waveSnapshotRef.current = null;
  }, [stopAudio]);


  /* ── Generate share card ── */
  const generateShareCard = useCallback(async () => {
    if (!result || !waveSnapshotRef.current) return;
    setShareStatus("generating");

    const W = 900, H = 500;
    const offscreen = document.createElement("canvas");
    offscreen.width = W;
    offscreen.height = H;
    const c = offscreen.getContext("2d")!;

    // Background
    c.fillStyle = "#080808";
    c.fillRect(0, 0, W, H);

    // Subtle grain via noise pattern
    for (let i = 0; i < 18000; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const alpha = Math.random() * 0.025;
      c.fillStyle = `rgba(255,255,255,${alpha})`;
      c.fillRect(x, y, 1, 1);
    }

    // Waveform image — top 55% of card
    const waveImg = new Image();
    await new Promise<void>((res) => {
      waveImg.onload = () => res();
      waveImg.src = waveSnapshotRef.current!;
    });
    const waveH = H * 0.52;
    c.globalAlpha = 0.85;
    c.drawImage(waveImg, 0, 0, W, waveH);
    c.globalAlpha = 1;

    // Fade waveform out at bottom with gradient
    const fadeGrad = c.createLinearGradient(0, waveH * 0.55, 0, waveH);
    fadeGrad.addColorStop(0, "rgba(8,8,8,0)");
    fadeGrad.addColorStop(1, "rgba(8,8,8,1)");
    c.fillStyle = fadeGrad;
    c.fillRect(0, 0, W, waveH);

    // Divider line
    c.strokeStyle = "rgba(184,169,154,0.18)";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(48, waveH + 1);
    c.lineTo(W - 48, waveH + 1);
    c.stroke();

    // Bottom section y-anchor
    const by = waveH + 28;

    // dB label (small caps)
    c.font = "500 13px 'Inter', monospace";
    c.letterSpacing = "4px";
    c.fillStyle = "rgba(255,255,255,0.22)";
    c.fillText("NOISE FLOOR", 52, by + 18);

    // Big dB number
    c.font = `200 ${H * 0.28}px 'Inter', monospace`;
    c.fillStyle = "#f0f0f0";
    c.fillText(`${result.avg}`, 48, by + 22 + H * 0.28);

    // dB unit label
    c.font = "300 18px 'Inter', monospace";
    c.fillStyle = "rgba(184,169,154,0.6)";
    c.fillText("dB avg", 52, by + H * 0.28 + 50);

    // Comparable to
    c.font = "300 16px 'Inter', monospace";
    c.fillStyle = "rgba(255,255,255,0.35)";
    c.fillText(`comparable to ${getComparison(result.avg)}`, 52, by + H * 0.28 + 78);

    // Right side stats block
    const rx = W - 52;
    const statsY = by + 14;

    const stats = [
      { label: "QUIETEST", value: `${result.min}dB` },
      { label: "AVERAGE",  value: `${result.avg}dB` },
      { label: "LOUDEST",  value: `${result.max}dB` },
    ];

    stats.forEach((s, i) => {
      const sy = statsY + i * 56;
      c.font = "500 11px 'Inter', monospace";
      c.fillStyle = "rgba(255,255,255,0.2)";
      c.textAlign = "right";
      c.fillText(s.label, rx, sy + 14);
      c.font = `200 28px 'Inter', monospace`;
      c.fillStyle = "#c8c8c8";
      c.fillText(s.value, rx, sy + 42);
    });

    // URL watermark bottom right
    c.font = "300 13px 'Inter', monospace";
    c.fillStyle = "rgba(255,255,255,0.15)";
    c.textAlign = "right";
    c.fillText("wastemytime.fun/noise-floor", rx, H - 20);

    // Bottom-left timestamp
    c.font = "300 13px 'Inter', monospace";
    c.fillStyle = "rgba(255,255,255,0.12)";
    c.textAlign = "left";
    c.fillText(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), 52, H - 20);

    const url = offscreen.toDataURL("image/png");
    setShareCardUrl(url);
    setShareStatus("ready");
    setSharePreviewOpen(true);
  }, [result]);

  /* ── Share/download card ── */
  const downloadCard = useCallback(() => {
    if (!shareCardUrl) return;
    const a = document.createElement("a");
    a.href = shareCardUrl;
    a.download = `noise-floor-${result?.avg ?? 0}db.png`;
    a.click();
  }, [shareCardUrl, result]);

  const nativeShare = useCallback(async () => {
    if (!shareCardUrl || !navigator.share) return;
    try {
      const res = await fetch(shareCardUrl);
      const blob = await res.blob();
      const file = new File([blob], `noise-floor-${result?.avg ?? 0}db.png`, { type: "image/png" });
      await navigator.share({
        title: "The Noise Floor",
        text: `My room averaged ${result?.avg}dB — comparable to ${getComparison(result?.avg ?? 0)}. Your room is never silent.`,
        files: [file],
      });
    } catch {
      // fallback: just download
      downloadCard();
    }
  }, [shareCardUrl, result, downloadCard]);

  /* ── Progress ── */
  const progressPct = Math.min((elapsed / DURATION) * 100, 100);
  const remaining = Math.max(0, Math.ceil(DURATION - elapsed));

  /* ─────────────────────────────────────────────
     STYLES (inline to keep single-file pattern)
  ───────────────────────────────────────────── */
  const base: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    transition: "opacity 0.7s ease",
  };

  const mono = `var(--font-inter), 'DM Mono', monospace`;
  const serif = `var(--font-fraunces), 'Cormorant Garamond', serif`;
  const accent = "#b8a99a";
  const dim = "#3a3a3a";
  const mid = "#787878";
  const bright = "#c8c8c8";

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.8rem 2.2rem",
    border: `1px solid ${dim}`,
    background: "transparent",
    color: bright,
    fontFamily: mono,
    fontSize: "0.78rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "border-color 0.25s, color 0.25s",
  };

  const ghostBtn: React.CSSProperties = {
    ...btnStyle,
    padding: "0.65rem 1.6rem",
    color: mid,
    fontSize: "0.74rem",
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div style={{ background: "#080808", color: "#f0f0f0", width: "100vw", height: "100vh", overflow: "hidden", position: "relative", fontFamily: mono }}>

      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9000,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.025,
      }} />

      {/* Persistent back link — reuses existing component */}
      {screen !== "intro" && <BackLink />}

      {/* ══ INTRO ══ */}
      <div style={{ ...base, opacity: screen === "intro" ? 1 : 0, pointerEvents: screen === "intro" ? "all" : "none", textAlign: "center", gap: 0 }}>

        <p style={{ fontFamily: mono, fontSize: "0.82rem", letterSpacing: "0.35em", textTransform: "uppercase", color: mid, marginBottom: "2.5rem" }}>
          An ambient experiment
        </p>

        <h1 style={{ fontFamily: serif, fontSize: "clamp(3.5rem,10vw,7rem)", fontWeight: 300, fontStyle: "italic", lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>
          The Noise Floor
        </h1>

        <p style={{ fontFamily: serif, fontSize: "clamp(1rem,2.5vw,1.4rem)", fontWeight: 300, color: accent, letterSpacing: "0.05em", margin: "0.4rem 0 3rem" }}>
          your room is never silent
        </p>

        <p style={{ fontFamily: mono, fontSize: "0.82rem", fontWeight: 300, color: mid, lineHeight: 2.1, letterSpacing: "0.02em", maxWidth: 360, marginBottom: "3.5rem" }}>
          Place your device still.<br />
          <span style={{ color: bright }}>30 seconds.</span> That&apos;s all.<br /><br />
          We&apos;ll listen to what you&apos;ve stopped hearing —<br />
          the hum, the breath, the machinery of your life.
        </p>

        {/* Privacy note */}
        <p style={{ fontFamily: mono, fontSize: "0.82rem", color: dim, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
          🔒 &nbsp;no audio is ever recorded or sent anywhere
        </p>

        <button
          style={btnStyle}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = accent; (e.currentTarget as HTMLButtonElement).style.color = accent; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = dim; (e.currentTarget as HTMLButtonElement).style.color = bright; }}
          onClick={requestMic}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
          begin listening
        </button>

        <div style={{ marginTop: "2.5rem" }}>
          <ShareButtons
            theme="dark"
            label="Share this activity"
            text="The Noise Floor — how loud is your room, really? 30 seconds to find out."
            url="https://www.wastemytime.fun/noise-floor"
          />
        </div>
      </div>

      {/* ══ DENIED ══ */}
      <div style={{ ...base, opacity: screen === "denied" ? 1 : 0, pointerEvents: screen === "denied" ? "all" : "none", textAlign: "center", gap: "1.2rem" }}>
        <div style={{ fontSize: "2rem", color: "#c0392b", marginBottom: "0.5rem" }}>◌</div>
        <h2 style={{ fontFamily: serif, fontWeight: 300, fontStyle: "italic", fontSize: "2rem", margin: 0 }}>Microphone needed</h2>
        <p style={{ fontSize: "0.7rem", color: mid, lineHeight: 2.2, maxWidth: 300 }}>
          This experience lives entirely in your browser.<br />
          <strong style={{ color: bright, fontWeight: 400 }}>No audio is recorded or sent anywhere.</strong><br /><br />
          Please allow microphone access and try again.
        </p>
        <button style={btnStyle}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = accent; (e.currentTarget as HTMLButtonElement).style.color = accent; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = dim; (e.currentTarget as HTMLButtonElement).style.color = bright; }}
          onClick={requestMic}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
          try again
        </button>
        <button style={ghostBtn}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = bright; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = mid; }}
          onClick={goHome}>← back</button>
      </div>

      {/* ══ LISTENING ══ */}
      <div style={{ ...base, opacity: screen === "listening" ? 1 : 0, pointerEvents: screen === "listening" ? "all" : "none", justifyContent: "center", gap: 0 }}>

        {/* Header label */}
        <p style={{ position: "absolute", top: "2.5rem", fontFamily: mono, fontSize: "0.82rem", letterSpacing: "0.3em", textTransform: "uppercase", color: dim }}>
          listening to your room
        </p>

        {/* Stay quiet notice — fades out after 5s */}
        {elapsed < 6 && (
          <div style={{
            position: "absolute",
            top: "5rem",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            opacity: elapsed > 4 ? 0 : 1,
            transition: "opacity 1s ease",
            pointerEvents: "none",
          }}>
            <p style={{
              fontFamily: serif,
              fontSize: "clamp(0.85rem,2vw,1rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: accent,
              letterSpacing: "0.04em",
              margin: 0,
            }}>
              stay quiet — let the room speak
            </p>
          </div>
        )}

        {/* Waveform canvas */}
        <canvas
          ref={canvasRef}
          style={{ width: "min(680px,90vw)", height: 110, display: "block", marginBottom: "2rem" }}
        />

        {/* Live dB */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            fontFamily: mono, fontSize: "clamp(3rem,8vw,5rem)", fontWeight: 300,
            lineHeight: 1, letterSpacing: "-0.03em", minWidth: "3ch", textAlign: "center",
            color: liveDb !== null && liveDb > 70 ? "#e88" : liveDb !== null && liveDb > 50 ? "#d4b98a" : "#f0f0f0",
            transition: "color 0.4s",
          }}>
            {liveDb ?? "—"}
          </div>
          <div style={{ fontFamily: mono, fontSize: "0.7rem", letterSpacing: "0.25em", color: dim, textTransform: "uppercase", marginTop: "0.3rem" }}>
            dB current
          </div>
        </div>

        {/* Progress */}
        <div style={{ width: "min(340px,85vw)", marginBottom: "1rem" }}>
          <div style={{ width: "100%", height: 1, background: "#1a1a1a", position: "relative", marginBottom: "0.5rem" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", background: accent, width: `${progressPct}%`, transition: "width 1s linear" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: mono, fontSize: "0.7rem", letterSpacing: "0.15em", color: dim, textTransform: "uppercase" }}>0s</span>
            <span style={{ fontFamily: mono, fontSize: "0.7rem", letterSpacing: "0.15em", color: mid, textTransform: "uppercase" }}>{remaining}s</span>
          </div>
        </div>

        {/* Privacy reassurance during listening */}
        <p style={{ fontFamily: mono, fontSize: "0.7rem", color: "#2a2a2a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
          🔒 &nbsp;audio never leaves your device
        </p>

        {/* Observation ticker */}
        <div style={{ position: "absolute", bottom: "2.5rem", textAlign: "center", width: "min(480px,90vw)" }}>
          <p style={{
            fontFamily: serif, fontSize: "1rem", fontStyle: "italic", fontWeight: 300,
            color: mid, minHeight: "1.5rem",
            opacity: obsVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}>
            {obsTicker}
          </p>
        </div>
      </div>

      {/* ══ RESULT ══ */}
      <div style={{
        ...base,
        opacity: screen === "result" ? 1 : 0,
        pointerEvents: screen === "result" ? "all" : "none",
        justifyContent: "flex-start",
        overflowY: "auto",
        paddingTop: "max(5rem, 8vh)",
        paddingBottom: "3rem",
        textAlign: "center",
        gap: 0,
      }}>
        {result && (
          <>
            <p style={{ fontFamily: mono, fontSize: "0.82rem", letterSpacing: "0.35em", textTransform: "uppercase", color: dim, marginBottom: "2rem" }}>
              your room has spoken
            </p>

            <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 300, lineHeight: 1.2, margin: "0 0 0.2rem" }}>
              Your silence was<br />
              <span style={{ color: accent, fontStyle: "italic" }}>{result.avg}dB</span>
            </h2>

            {/* Big number */}
            <div style={{ fontFamily: mono, fontSize: "clamp(5rem,15vw,9rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.04em", margin: "1rem 0 0.2rem" }}>
              {result.avg}
            </div>
            <p style={{ fontFamily: mono, fontSize: "0.74rem", letterSpacing: "0.28em", color: dim, textTransform: "uppercase", marginBottom: "1.8rem" }}>
              average dB · 60 second reading
            </p>

            {/* Verdict */}
            <p style={{ fontFamily: serif, fontSize: "clamp(1rem,2.2vw,1.3rem)", fontWeight: 300, fontStyle: "italic", color: accent, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 2.5rem" }}>
              {getVerdict(result.avg)}
            </p>

            {/* Stats grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)",
              gap: 1, background: "#1a1a1a", border: "1px solid #1a1a1a",
              width: "min(480px,90vw)", margin: "0 auto 2.5rem",
            }}>
              {[
                { label: "Quietest\nmoment", value: `${result.min}dB` },
                { label: "Average\nlevel",   value: `${result.avg}dB` },
                { label: "Loudest\nspike",   value: `${result.max}dB` },
              ].map(s => (
                <div key={s.label} style={{ background: "#0e0e0e", padding: "1.1rem 0.8rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div style={{ fontFamily: mono, fontSize: "clamp(1rem,4vw,1.4rem)", fontWeight: 400, color: "#f0f0f0", letterSpacing: "-0.02em" }}>
                    {s.value}
                  </div>
                  <div style={{ fontFamily: mono, fontSize: "0.78rem", letterSpacing: "0.18em", color: dim, textTransform: "uppercase", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Comparable to */}
            <p style={{ fontFamily: mono, fontSize: "0.76rem", color: mid, letterSpacing: "0.1em", marginBottom: "2.5rem" }}>
              comparable to <span style={{ color: bright }}>{getComparison(result.avg)}</span>
            </p>

            {/* Observations */}
            <div style={{ width: "min(480px,90vw)", margin: "0 auto 2.5rem", textAlign: "left" }}>
              <p style={{ fontFamily: mono, fontSize: "0.7rem", letterSpacing: "0.28em", color: dim, textTransform: "uppercase", borderBottom: "1px solid #1a1a1a", paddingBottom: "0.7rem", marginBottom: "0.8rem" }}>
                moments noticed
              </p>
              {resultObs.map((o, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", padding: "0.55rem 0", borderBottom: "1px solid #131313", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: mono, fontSize: "0.82rem", color: dim, whiteSpace: "nowrap", paddingTop: "0.1rem", flexShrink: 0 }}>{o.time}s</span>
                  <span style={{ fontFamily: serif, fontSize: "0.95rem", fontStyle: "italic", color: mid, lineHeight: 1.4 }}>{o.text}</span>
                </div>
              ))}
            </div>

            {/* Privacy note on result too */}
            <p style={{ fontFamily: mono, fontSize: "0.7rem", color: "#2a2a2a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              🔒 &nbsp;no audio was recorded or stored
            </p>

            {/* Share as image */}
            <div style={{ marginBottom: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: mono, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                Share your result
              </span>

              {/* Preview card */}
              {sharePreviewOpen && shareCardUrl && (
                <div style={{
                  width: "min(480px,90vw)",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                  animation: "fadeIn 0.3s ease",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shareCardUrl} alt="Share card preview" style={{ width: "100%", display: "block" }} />
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {!sharePreviewOpen ? (
                  <button
                    onClick={generateShareCard}
                    disabled={shareStatus === "generating"}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "9px 20px",
                      background: shareStatus === "generating" ? "rgba(184,169,154,0.1)" : "rgba(184,169,154,0.15)",
                      border: "1px solid rgba(184,169,154,0.3)",
                      borderRadius: 3, color: accent,
                      fontFamily: mono, fontSize: "0.72rem", letterSpacing: "0.15em",
                      textTransform: "uppercase", cursor: shareStatus === "generating" ? "default" : "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => shareStatus !== "generating" && ((e.currentTarget as HTMLElement).style.background = "rgba(184,169,154,0.22)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(184,169,154,0.15)")}
                  >
                    {shareStatus === "generating" ? (
                      <>
                        <span style={{ width: 10, height: 10, border: `1.5px solid ${accent}`, borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                        generating…
                      </>
                    ) : (
                      <>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                        </svg>
                        Generate share card
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    {typeof navigator !== "undefined" && "share" in navigator ? (
                      <button
                        onClick={nativeShare}
                        style={{
                          display: "flex", alignItems: "center", gap: 7,
                          padding: "9px 20px",
                          background: "rgba(184,169,154,0.15)",
                          border: "1px solid rgba(184,169,154,0.3)",
                          borderRadius: 3, color: accent,
                          fontFamily: mono, fontSize: "0.72rem", letterSpacing: "0.15em",
                          textTransform: "uppercase", cursor: "pointer",
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(184,169,154,0.22)")}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(184,169,154,0.15)")}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
                        </svg>
                        Share
                      </button>
                    ) : null}
                    <button
                      onClick={downloadCard}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "9px 20px",
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 3, color: "rgba(255,255,255,0.5)",
                        fontFamily: mono, fontSize: "0.72rem", letterSpacing: "0.15em",
                        textTransform: "uppercase", cursor: "pointer",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={() => { setSharePreviewOpen(false); setShareStatus("idle"); setShareCardUrl(null); }}
                      style={{
                        padding: "9px 14px",
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 3, color: "rgba(255,255,255,0.25)",
                        fontFamily: mono, fontSize: "0.72rem", letterSpacing: "0.12em",
                        textTransform: "uppercase", cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              <button style={{ ...ghostBtn, color: bright, borderColor: mid }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#f0f0f0"; (e.currentTarget as HTMLButtonElement).style.color = "#f0f0f0"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = mid; (e.currentTarget as HTMLButtonElement).style.color = bright; }}
                onClick={goHome}>← listen again</button>
            </div>

            {/* You May Like */}
            <div style={{ width: "min(90vw,680px)", margin: "0 auto" }}>
              <YouMayLike currentId="noise-floor" />
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.6)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
