"use client";

import Link from "next/link";
import Image from "next/image";
import { Activity } from "@/data/activities";

function BarsShape() {
  return (
    <div className="flex items-end justify-center gap-3 h-full pb-1">
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-[9px] font-semibold tracking-tight"
          style={{ opacity: 0.5, fontFamily: "var(--font-inter), sans-serif" }}
        >
          you
        </span>
        <div
          className="w-8 rounded-t-md"
          style={{ height: "44px", background: "rgba(0,0,0,0.22)" }}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-[9px] font-semibold tracking-tight"
          style={{ opacity: 0.5, fontFamily: "var(--font-inter), sans-serif" }}
        >
          sharma ji
        </span>
        <div
          className="w-8 rounded-t-md"
          style={{ height: "76px", background: "rgba(0,0,0,0.32)" }}
        />
      </div>
    </div>
  );
}

function ChecklistShape() {
  const rows = [
    [true, true, false],
    [true, false, true],
    [false, true, true],
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          {row.map((checked, j) => (
            <div
              key={j}
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                background: checked ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.08)",
                border: "1.5px solid rgba(0,0,0,0.15)",
              }}
            >
              {checked && (
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7L5.5 10L11.5 4"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SpiralShape() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative flex items-center justify-center">
        {[60, 46, 32, 20, 10].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              border: `2px solid rgba(255,255,255,${0.12 + i * 0.17})`,
              transform: `rotate(${i * 18}deg)`,
            }}
          />
        ))}
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.5)" }}
        />
      </div>
    </div>
  );
}

function CircleShape() {
  // A slightly imperfect drawn circle + a dashed perfect reference circle
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative flex items-center justify-center">
        {/* Perfect reference circle — dashed */}
        <div
          className="absolute rounded-full"
          style={{
            width: 80,
            height: 80,
            border: "2px dashed rgba(255,255,255,0.2)",
          }}
        />
        {/* "Hand-drawn" circle — slightly oval to hint at imperfection */}
        <div
          className="rounded-full"
          style={{
            width: 62,
            height: 70,
            border: "2.5px solid rgba(255,255,255,0.65)",
            transform: "rotate(-8deg)",
          }}
        />
        {/* Score hint */}
        <span
          className="absolute text-xs font-bold"
          style={{
            fontFamily: "var(--font-fraunces), serif",
            color: "rgba(255,255,255,0.5)",
            top: -4,
            right: -8,
          }}
        >
          ?%
        </span>
      </div>
    </div>
  );
}

// Precomputed dot positions for the "How Rare Are You?" card
const DOT_POSITIONS = [
  { x: 12, y: 18 }, { x: 28, y: 8 }, { x: 44, y: 22 }, { x: 60, y: 12 }, { x: 76, y: 25 },
  { x: 8, y: 38 }, { x: 22, y: 50 }, { x: 38, y: 42 }, { x: 54, y: 55 }, { x: 70, y: 38 },
  { x: 84, y: 50 }, { x: 16, y: 65 }, { x: 32, y: 72 }, { x: 48, y: 60 }, { x: 64, y: 70 },
  { x: 80, y: 62 }, { x: 6, y: 82 }, { x: 20, y: 88 }, { x: 36, y: 78 }, { x: 52, y: 85 },
  { x: 68, y: 80 }, { x: 88, y: 75 }, { x: 92, y: 20 }, { x: 94, y: 45 }, { x: 90, y: 90 },
];
const USER_DOT = { x: 50, y: 45 };

function DotsShape() {
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }}>
        {DOT_POSITIONS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.2} fill="rgba(255,255,255,0.18)" />
        ))}
        {/* User dot — glowing */}
        <circle cx={USER_DOT.x} cy={USER_DOT.y} r={3} fill="rgba(255,255,255,0.9)" />
        <circle cx={USER_DOT.x} cy={USER_DOT.y} r={6} fill="rgba(255,255,255,0.08)" />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          color: "rgba(255,255,255,0.4)",
          bottom: 8,
          right: 12,
          fontSize: 9,
          letterSpacing: "0.08em",
        }}
      >
        1 in ?
      </span>
    </div>
  );
}

const shapes = {
  bars: BarsShape,
  checklist: ChecklistShape,
  spiral: SpiralShape,
  circle: CircleShape,
  dots: DotsShape,
};

export default function ActivityCard({ activity }: { activity: Activity }) {
  const ShapeComponent = shapes[activity.shape];

  return (
    <Link href={activity.path} className="group block">
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: activity.bg,
          color: activity.text,
          boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
          transition: "box-shadow 0.25s ease, transform 0.25s ease",
          height: "280px",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "0 14px 40px rgba(0,0,0,0.16)";
          el.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.07)";
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Illustration — image if available, else CSS shape */}
        <div className="flex-1 overflow-hidden relative">
          {activity.image ? (
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="px-6 pt-5 h-full">
              <ShapeComponent />
            </div>
          )}
        </div>

        {/* Text — fixed at bottom */}
        <div className="px-5 pb-5 pt-2 flex-shrink-0">
          <div className="flex items-end justify-between">
            <div>
              <h2
                className="text-lg font-bold leading-tight mb-0.5"
                style={{ fontFamily: "var(--font-fraunces), serif" }}
              >
                {activity.title}
              </h2>
              <p
                className="text-xs"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  opacity: 0.6,
                }}
              >
                {activity.tagline}
              </p>
            </div>
            <span
              className="text-lg ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
