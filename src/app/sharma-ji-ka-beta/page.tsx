"use client";

import { useState } from "react";
import BackLink from "@/components/BackLink";
import YouMayLike from "@/components/YouMayLike";
import ShareButtons from "@/components/ShareButtons";

interface FormState {
  marks: string;
  jobType: string;
  salary: string;
  married: string;
  hobbies: string;
}

interface Result {
  score: number;
  roast: string;
  verdict: string;
}

const JOB_OPTIONS = [
  { value: "government", label: "Government job" },
  { value: "mnc", label: "MNC / corporate" },
  { value: "startup", label: "Startup" },
  { value: "business", label: "Business / self-employed" },
  { value: "student", label: "Still studying" },
  { value: "unemployed", label: "Funemployed" },
];

const MARRIED_OPTIONS = [
  { value: "yes", label: "Married" },
  { value: "no", label: "Not married" },
  { value: "its complicated", label: "It's complicated" },
];

function ScoreMeter({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score <= 30 ? "#EF4444" : score <= 60 ? "#F59E0B" : score <= 85 ? "#10B981" : "#6366F1";

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text
          x="70"
          y="66"
          textAnchor="middle"
          fontSize="26"
          fontWeight="bold"
          fill="#1a1a1a"
          fontFamily="var(--font-fraunces), serif"
        >
          {score}
        </text>
        <text
          x="70"
          y="84"
          textAnchor="middle"
          fontSize="11"
          fill="#1a1a1a"
          opacity="0.5"
          fontFamily="var(--font-inter), sans-serif"
        >
          / 100
        </text>
      </svg>
    </div>
  );
}

export default function SharmaJiKaBeta() {
  const [form, setForm] = useState<FormState>({
    marks: "",
    jobType: "",
    salary: "",
    married: "",
    hobbies: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setResult(null);
    setError("");
  }

  const isValid =
    form.marks !== "" &&
    Number(form.marks) >= 0 &&
    Number(form.marks) <= 100 &&
    form.jobType !== "" &&
    form.salary !== "" &&
    form.married !== "";

  async function handleSubmit() {
    if (!isValid) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sharma-ji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marks: Number(form.marks),
          jobType: form.jobType,
          salary: Number(form.salary),
          married: form.married,
          hobbies: form.hobbies,
        }),
      });

      if (!res.ok) throw new Error("API failed");
      const data: Result = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const verdictColors: Record<string, string> = {
    Disgrace: "#EF4444",
    Disappointing: "#F97316",
    Average: "#F59E0B",
    Acceptable: "#84CC16",
    Impressive: "#10B981",
    Suspicious: "#6366F1",
  };
  const verdictColor = result ? verdictColors[result.verdict] || "#1a1a1a" : "#1a1a1a";

  return (
    <main
      className="min-h-screen"
      style={{ background: "#FFFBEB", color: "#1a1a1a" }}
    >
      <BackLink />

      <div className="max-w-xl mx-auto px-5 py-16 md:py-24">
        {/* Header */}
        <header className="mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-3"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Sharma Ji Ka Beta
          </h1>
          <p
            className="text-base"
            style={{ fontFamily: "var(--font-inter), sans-serif", opacity: 0.5 }}
          >
            Enter your stats. Let Sharma Ji's mom judge you.
          </p>
        </header>

        {!result ? (
          <div className="flex flex-col gap-5">
            {/* Marks */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Your marks / CGPA (as a %)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                placeholder="e.g. 74"
                value={form.marks}
                onChange={(e) => update("marks", e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-base outline-none"
                style={{
                  background: "rgba(0,0,0,0.05)",
                  border: "2px solid transparent",
                  fontFamily: "var(--font-inter), sans-serif",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#FBBF24")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
              />
            </div>

            {/* Job type */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Current situation
              </label>
              <div className="grid grid-cols-2 gap-2">
                {JOB_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("jobType", opt.value)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-left transition-all duration-150"
                    style={{
                      background:
                        form.jobType === opt.value ? "#FBBF24" : "rgba(0,0,0,0.05)",
                      border: `2px solid ${form.jobType === opt.value ? "#FBBF24" : "transparent"}`,
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: form.jobType === opt.value ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Monthly salary (₹) — put 0 if studying/unemployed
              </label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 65000"
                value={form.salary}
                onChange={(e) => update("salary", e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-base outline-none"
                style={{
                  background: "rgba(0,0,0,0.05)",
                  border: "2px solid transparent",
                  fontFamily: "var(--font-inter), sans-serif",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#FBBF24")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
              />
            </div>

            {/* Married */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Marital status
              </label>
              <div className="flex gap-2">
                {MARRIED_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("married", opt.value)}
                    className="flex-1 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-150"
                    style={{
                      background:
                        form.married === opt.value ? "#FBBF24" : "rgba(0,0,0,0.05)",
                      border: `2px solid ${form.married === opt.value ? "#FBBF24" : "transparent"}`,
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: form.married === opt.value ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hobbies (optional) */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Hobbies{" "}
                <span style={{ fontWeight: 400, opacity: 0.5 }}>(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. cricket, Netflix, sleeping"
                value={form.hobbies}
                onChange={(e) => update("hobbies", e.target.value)}
                maxLength={50}
                className="w-full rounded-2xl px-4 py-3 text-base outline-none"
                style={{
                  background: "rgba(0,0,0,0.05)",
                  border: "2px solid transparent",
                  fontFamily: "var(--font-inter), sans-serif",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#FBBF24")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
              />
            </div>

            {error && (
              <p
                className="text-sm text-red-500"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              className="w-full py-4 rounded-2xl text-base font-bold transition-all duration-200"
              style={{
                background: isValid ? "#FBBF24" : "rgba(0,0,0,0.08)",
                color: "#1a1a1a",
                fontFamily: "var(--font-fraunces), serif",
                fontSize: "1.05rem",
                cursor: isValid ? "pointer" : "not-allowed",
                opacity: isValid ? 1 : 0.5,
                boxShadow: isValid ? "0 4px 20px rgba(251,191,36,0.45)" : "none",
              }}
            >
              {loading ? "Sharma Ji's mom is judging..." : "Benchmark me →"}
            </button>
          </div>
        ) : (
          /* Result */
          <div className="flex flex-col gap-5">
            <div
              className="rounded-3xl p-8 text-center"
              style={{
                background: "#FBBF24",
                boxShadow: "0 8px 40px rgba(251,191,36,0.4)",
              }}
            >
              <ScoreMeter score={result.score} />

              <div
                className="mt-4 text-xl font-bold"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  color: verdictColor,
                }}
              >
                {result.verdict}
              </div>

              <div
                className="mt-5 px-2 text-sm md:text-base leading-relaxed text-left"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontStyle: "italic",
                  color: "#1a1a1a",
                  opacity: 0.85,
                  borderLeft: "3px solid rgba(0,0,0,0.2)",
                  paddingLeft: 16,
                }}
              >
                {result.roast}
              </div>

              <div
                className="mt-6 pt-4 text-xs opacity-50"
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.12)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                wastemytime.fun · Sharma Ji Ka Beta
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setForm({
                  marks: "",
                  jobType: "",
                  salary: "",
                  married: "",
                  hobbies: "",
                });
              }}
              className="w-full py-3 rounded-2xl text-sm font-medium"
              style={{
                background: "rgba(0,0,0,0.06)",
                fontFamily: "var(--font-inter), sans-serif",
                opacity: 0.7,
              }}
            >
              try again
            </button>

            <YouMayLike currentId="sharma-ji-ka-beta" labelColor="rgba(0,0,0,0.35)" />
            <div className="mt-4">
              <ShareButtons
                theme="light"
                label="Share your result"
                text={`I scored ${result.score}/100 on Sharma Ji Ka Beta test — ${result.verdict}. Are you a better beta than me?`}
                url="https://www.wastemytime.fun/sharma-ji-ka-beta"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
