"use client";

import { useState, useRef } from "react";
import BackLink from "@/components/BackLink";
import YouMayLike from "@/components/YouMayLike";
import ShareButtons from "@/components/ShareButtons";

const items = [
  // Food & Eating
  "You mixed your dal-chawal before eating it — badly mixed was sin",
  "Your mom reused Bournvita/Horlicks tins to store random stuff",
  "You had to finish the last bite of roti no matter what",
  "You ate Maggi as a 'treat' and it felt luxurious",
  "Pickle was a legitimate side dish that made any meal better",
  "You drank Rasna or Rooh Afza in summer like it was water",
  "Your dabba had a steel tiffin with 3 compartments",
  "You ate raw mango with salt and chilli and it was peak cuisine",

  // School & Studies
  "You got a 'distinction' in one subject and it was a big deal",
  "Your parents compared your marks to Sharma ji ka beta at least once",
  "You memorized the multiplication tables up to 20",
  "You had a geometry box with a compass you used maybe twice",
  "Your teacher hit your palm with a scale and it was just normal",
  "You went to tuition even if you were good at studies",
  "Your report card remarks said 'can do better' every year",
  "You studied on the bed and fell asleep, notebook still open",

  // Home & Family
  "Your mom had a 'guest room' no one was allowed in normally",
  "Your parents saved every plastic bag from every shopping trip",
  "You addressed every adult as uncle or aunty, no exceptions",
  "Your house had a fridge magnet collection from random places",
  "Your dad had a 'good shirt' that came out only for weddings",
  "You have at least one relative who pinches your cheeks and gives ₹10",
  "Your mom had a steel almirah with a key that she kept somewhere mysterious",
  "You watched DD National because there was no other option",

  // Habits & Childhood Things
  "You collected Tazos from Lays packets with genuine ambition",
  "You played antakshari on road trips and it was genuinely competitive",
  "You had a Nokia phone with Snake and it was peak entertainment",
  "You asked your parents for money and got a lecture instead",
  "You wore a uniform that was too big because 'you'll grow into it'",
  "You attended at least one function where you knew no one",
  "You got new clothes specifically for Diwali or Eid",
  "You pretended to be sick to skip school and it sometimes worked",

  // Cultural Moments
  "You watched Shaktimaan or Ramayan with the whole family",
  "You've been told 'log kya kahenge' at least once in your life",
  "You were forbidden from stepping out after a certain time for no clear reason",
  "Your birthday meant cutting cake at midnight with family, no party",
  "You wore a bindi or tilak for every religious occasion, willing or not",
  "You've sat through a 3-hour wedding and eaten food from a banana leaf",
  "You received at least one Archies greeting card from a friend",
  "Summer vacation meant going to your nani or dadi's house",
];

const tiers = [
  { min: 0, max: 19, name: "Coconut", desc: "Brown on the outside, white on the inside. Are you sure you grew up in India?", color: "#8B6914", emoji: "🥥" },
  { min: 20, max: 29, name: "Chai Wala", desc: "You've had the Indian experience, but clearly missed a few classes.", color: "#C25A00", emoji: "☕" },
  { min: 30, max: 36, name: "Pav Bhaji", desc: "Solid. Reliably Indian. Slightly chaotic. Exactly right.", color: "#D44000", emoji: "🍛" },
  { min: 37, max: 40, name: "Full Desi", desc: "Your childhood was a Bollywood movie. You didn't have a choice.", color: "#B22222", emoji: "🇮🇳" },
];

function getTier(score: number) {
  return tiers.find((t) => score >= t.min && score <= t.max) || tiers[0];
}

export default function IndianChildhoodScore() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const score = checked.size;
  const percent = Math.round((score / items.length) * 100);
  const tier = getTier(score);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function handleReveal() {
    setShowResult(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  return (
    <main
      className="min-h-screen"
      style={{ background: "#FFF8F0", color: "#1a1a1a" }}
    >
      <BackLink />

      <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-3"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Indian Childhood Score
          </h1>
          <p
            className="text-base md:text-lg"
            style={{ fontFamily: "var(--font-inter), sans-serif", opacity: 0.5 }}
          >
            Check everything that applies. Be honest.
          </p>
        </header>

        {/* Live counter */}
        <div
          className="sticky top-4 z-10 rounded-2xl px-5 py-3 mb-8 flex items-center justify-between"
          style={{
            background: "#F97316",
            color: "#1a1a1a",
            boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
          }}
        >
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {score} / {items.length} checked
          </span>
          <div className="flex items-center gap-3">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ width: 120, background: "rgba(0,0,0,0.15)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${percent}%`,
                  background: "rgba(0,0,0,0.4)",
                }}
              />
            </div>
            <span
              className="text-sm font-bold"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {percent}%
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-2 mb-10">
          {items.map((item, i) => {
            const isChecked = checked.has(i);
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="w-full text-left rounded-2xl px-5 py-4 flex items-start gap-4 transition-all duration-150"
                style={{
                  background: isChecked
                    ? "rgba(249,115,22,0.12)"
                    : "rgba(0,0,0,0.04)",
                  border: `2px solid ${isChecked ? "#F97316" : "transparent"}`,
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-all duration-150"
                  style={{
                    background: isChecked ? "#F97316" : "rgba(0,0,0,0.1)",
                    border: `2px solid ${isChecked ? "#F97316" : "rgba(0,0,0,0.15)"}`,
                  }}
                >
                  {isChecked && (
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2.5 7L5.5 10L11.5 4"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm md:text-base leading-snug"
                  style={{ opacity: isChecked ? 1 : 0.7 }}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </div>

        {/* Reveal button */}
        {!showResult && (
          <button
            onClick={handleReveal}
            className="w-full py-4 rounded-2xl text-base font-bold transition-all duration-200"
            style={{
              background: "#F97316",
              color: "#1a1a1a",
              fontFamily: "var(--font-fraunces), serif",
              fontSize: "1.1rem",
              boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            Show my score →
          </button>
        )}

        {/* Result card */}
        {showResult && (
          <div
            ref={resultRef}
            className="rounded-3xl p-8 mt-4 text-center"
            style={{
              background: tier.color,
              color: "#fff",
              boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div className="text-5xl mb-4">{tier.emoji}</div>
            <div
              className="text-6xl font-bold mb-1"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {score}/{items.length}
            </div>
            <div
              className="text-2xl font-bold mb-3 opacity-90"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              {tier.name}
            </div>
            <p
              className="text-sm md:text-base opacity-80 max-w-sm mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {tier.desc}
            </p>

            <div
              className="mt-6 pt-6 text-xs opacity-60"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.2)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              wastemytime.fun · Indian Childhood Score
            </div>
          </div>
        )}

        {showResult && (
          <button
            onClick={() => {
              setChecked(new Set());
              setShowResult(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full mt-4 py-3 rounded-2xl text-sm font-medium transition-opacity duration-200"
            style={{
              background: "rgba(0,0,0,0.06)",
              color: "#1a1a1a",
              fontFamily: "var(--font-inter), sans-serif",
              opacity: 0.7,
            }}
          >
            try again
          </button>
        )}

        {showResult && (
          <div className="mt-6">
            <YouMayLike currentId="indian-childhood-score" labelColor="rgba(0,0,0,0.35)" />
          </div>
        )}
        {showResult && (
          <div className="mt-4">
            <ShareButtons
              theme="light"
              label="Share your score"
              text={`I scored ${score}/${items.length} on the Indian Childhood Score — ${tier.name}. How desi was your childhood?`}
              url="https://www.wastemytime.fun/indian-childhood-score"
            />
          </div>
        )}
      </div>
    </main>
  );
}
