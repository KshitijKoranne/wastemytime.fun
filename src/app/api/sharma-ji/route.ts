import { NextRequest, NextResponse } from "next/server";

export interface SharmaJiRequest {
  marks: number;       // percentage or CGPA (normalised to %)
  jobType: string;     // "government" | "mnc" | "startup" | "business" | "student" | "unemployed"
  salary: number;      // monthly in INR, 0 if student/unemployed
  married: string;     // "yes" | "no" | "its complicated"
  hobbies: string;     // free text, 1-2 words
}

export interface SharmaJiResponse {
  score: number;       // 0-100
  roast: string;       // 2-3 punchy sentences
  verdict: string;     // 1 word label
}

const IDEAL = {
  marks: 95,
  salary: 200000, // ₹2L/month
};

function calculateScore(req: SharmaJiRequest): number {
  let score = 0;

  // Marks (40 pts)
  const markPct = Math.min(req.marks, 100);
  score += (markPct / 100) * 40;

  // Job type (30 pts)
  const jobScores: Record<string, number> = {
    government: 30,
    mnc: 25,
    business: 22,
    startup: 15,
    student: 10,
    unemployed: 0,
  };
  score += jobScores[req.jobType] ?? 10;

  // Salary (20 pts)
  const salaryScore = Math.min(req.salary / IDEAL.salary, 1) * 20;
  score += salaryScore;

  // Married (10 pts) — Sharma Ji's beta is always either married or "about to get married"
  if (req.married === "yes") score += 10;
  else if (req.married === "its complicated") score += 4;

  return Math.round(Math.min(score, 100));
}

export async function POST(request: NextRequest) {
  try {
    const body: SharmaJiRequest = await request.json();
    const { marks, jobType, salary, married, hobbies } = body;

    if (marks === undefined || !jobType || salary === undefined || !married) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const score = calculateScore({ marks, jobType, salary, married, hobbies });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const toneGuide =
      score <= 30
        ? "Be absolutely savage. This person is a complete disappointment to their parents. Reference their specific numbers mercilessly."
        : score <= 60
        ? "Be sharp and critical but with a tiny bit of reluctant acknowledgment. They're mediocre and they know it."
        : score <= 85
        ? "Be suspicious and backhanded. They're doing well but something must be wrong. Compare them condescendingly."
        : "Be sarcastically over-the-top proud, like their mom is going to laminate this. Slightly suspicious of perfection.";

    const jobLabel: Record<string, string> = {
      government: "government job (very respectable, dadi is impressed)",
      mnc: "MNC job (acceptable, decent package)",
      startup: "startup (which means nothing to parents)",
      business: "business (risky, but okay if money comes)",
      student: "still studying (ticking clock)",
      unemployed: "unemployed (Haaye Ram)",
    };

    const prompt = `You are Sharma Ji's mom benchmarking someone's life against her son.

The person's stats:
- Marks/CGPA: ${marks}%
- Job: ${jobLabel[jobType] || jobType}
- Monthly salary: ₹${salary.toLocaleString("en-IN")}
- Married: ${married}
- Hobbies: ${hobbies || "unclear"}
- Their Sharma Ji Ka Beta score: ${score}/100

${toneGuide}

Write EXACTLY 2-3 sentences as Sharma Ji's mom. Rules:
- Reference their actual numbers (marks, salary)
- Mention Sharma Ji's beta at least once with a specific made-up achievement
- End with a devastating or suspicious conclusion
- No emojis. No "Beta". Just pure, cutting Indian aunty energy.
- Maximum 60 words total.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://www.wastemytime.fun",
        "X-Title": "Waste My Time - Sharma Ji Ka Beta",
      },
      body: JSON.stringify({
        model: "google/gemma-3-12b-it:free",
        messages: [
          {
            role: "system",
            content:
              "You are Sharma Ji's mom. You speak in perfect English but with intense aunty energy. Short, devastating, specific.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 120,
        temperature: 0.85,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      // Fallback roasts by score range
      const fallbacks: Record<string, string> = {
        low: `${marks}% marks and ₹${salary.toLocaleString("en-IN")} salary. Sharma Ji's beta got into IIT with 98.6% and is now in the US earning in dollars. I'm not saying anything, I'm just saying.`,
        mid: `Not bad, but Sharma Ji's beta also had a job and he still did his MBA from IIM. You've done okay. Okay.`,
        high: `Impressive. Suspiciously impressive. I'll need to verify these numbers with your mother.`,
      };
      const roast =
        score <= 30 ? fallbacks.low : score <= 70 ? fallbacks.mid : fallbacks.high;
      return NextResponse.json({ score, roast, verdict: getVerdict(score) });
    }

    const data = await response.json();
    const roast = data.choices?.[0]?.message?.content?.trim() || "No comment. Just... no comment.";

    return NextResponse.json({ score, roast, verdict: getVerdict(score) });
  } catch (err) {
    console.error("Sharma Ji API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getVerdict(score: number): string {
  if (score <= 20) return "Disgrace";
  if (score <= 40) return "Disappointing";
  if (score <= 60) return "Average";
  if (score <= 80) return "Acceptable";
  if (score <= 90) return "Impressive";
  return "Suspicious";
}
