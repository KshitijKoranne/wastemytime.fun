import { NextRequest, NextResponse } from "next/server";

export interface OverthinkingResponse {
  steps: string[];
  calm: string;
}

const MODEL = "google/gemma-3-12b-it:free";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const worry: string = body.worry;

    if (!worry || worry.trim().length < 3) {
      return NextResponse.json({ error: "Need a real worry." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Line-based format — far more reliable than asking for JSON
    const prompt = `Take this worry: "${worry.trim()}"

Catastrophize it in exactly 5 steps. Each step follows causally from the last but gets progressively more absurd and dramatic. Each step is one sentence, max 15 words.

Then write one CALM line — a simple, warm, grounding alternative take on the original worry.

Respond in this exact format, nothing else:
STEP1: [sentence]
STEP2: [sentence]
STEP3: [sentence]
STEP4: [sentence]
STEP5: [sentence]
CALM: [sentence]`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://wastemytime.fun",
        "X-Title": "Waste My Time - Overthinking Spiral",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.92,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter error:", response.status, await response.text());
      return NextResponse.json(getFallback(worry));
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!content) {
      return NextResponse.json(getFallback(worry));
    }

    // Parse line-based format
    const lines = content.split("\n").map((l: string) => l.trim()).filter(Boolean);
    const steps: string[] = [];
    let calm = "";

    for (const line of lines) {
      const stepMatch = line.match(/^STEP\d:\s*(.+)/i);
      const calmMatch = line.match(/^CALM:\s*(.+)/i);
      if (stepMatch) steps.push(stepMatch[1].trim());
      else if (calmMatch) calm = calmMatch[1].trim();
    }

    if (steps.length === 5 && calm) {
      return NextResponse.json({ steps, calm });
    }

    // Partial parse — try to salvage what we got
    if (steps.length >= 3) {
      while (steps.length < 5) steps.push("The situation continued to spiral beyond comprehension.");
      if (!calm) calm = "Or maybe it all just... worked out fine.";
      return NextResponse.json({ steps, calm });
    }

    return NextResponse.json(getFallback(worry));
  } catch (err) {
    console.error("Overthinking API error:", err);
    return NextResponse.json(getFallback("things"));
  }
}

function getFallback(worry: string): OverthinkingResponse {
  const w = worry.toLowerCase();
  return {
    steps: [
      "Everyone around you immediately sensed something was wrong.",
      "They started a group chat about it, without telling you.",
      "The group chat became a podcast with surprising listenership.",
      "A Netflix documentary producer reached out to the podcast.",
      "You are now the subject of a three-part true crime series.",
    ],
    calm: `Or: nobody noticed, and ${w.length < 30 ? `"${w}"` : "this"} will not matter in a week.`,
  };
}
