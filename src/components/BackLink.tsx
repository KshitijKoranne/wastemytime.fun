"use client";

import Link from "next/link";

export default function BackLink() {
  return (
    <Link
      href="/"
      className="fixed top-4 left-4 z-50 text-xs font-semibold transition-all duration-200"
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 999,
        padding: "6px 12px",
        color: "#ffffff",
        opacity: 0.65,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.65")}
    >
      ← wmt
    </Link>
  );
}
