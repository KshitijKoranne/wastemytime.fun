"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "#F5F0E8", color: "#1a1a1a" }}
    >
      <div className="text-center">
        <div
          className="text-8xl font-bold mb-4 leading-none"
          style={{ fontFamily: "var(--font-fraunces), serif", opacity: 0.15 }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          You found nothing
        </h1>
        <p
          className="text-base mb-8"
          style={{ fontFamily: "var(--font-inter), sans-serif", opacity: 0.5 }}
        >
          This page doesn&apos;t exist, but the rest of the site does.
        </p>
        <Link
          href="/"
          className="inline-block rounded-2xl px-6 py-3 text-sm font-semibold"
          style={{
            background: "#1a1a1a",
            color: "#F5F0E8",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          ← back home
        </Link>
      </div>
    </main>
  );
}
