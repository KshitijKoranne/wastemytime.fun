import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Returns today's date string in IST (UTC+5:30)
function todayIST(): string {
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export async function GET() {
  try {
    const today = todayIST();
    const [todayCount, totalCount, travelKm] = await Promise.all([
      kv.get<number>(`void:day:${today}`),
      kv.get<number>("void:total"),
      kv.get<number>("void:travel_km"),
    ]);

    // Light travels ~300,000 km/s. Each signal notionally sent at speed of light.
    // We accumulate distance since the first signal was ever sent.
    // We store the last-computed km at last signal time, then extrapolate live on client.
    const lastSignalAt = await kv.get<number>("void:last_signal_at");

    return NextResponse.json({
      today: todayCount ?? 0,
      total: totalCount ?? 0,
      travelKm: travelKm ?? 0,
      lastSignalAt: lastSignalAt ?? Date.now(),
    });
  } catch {
    return NextResponse.json({ today: 0, total: 0, travelKm: 0, lastSignalAt: Date.now() });
  }
}

export async function POST(_req: NextRequest) {
  try {
    const today = todayIST();
    const nowMs = Date.now();

    // Increment both counters atomically
    const [todayCount, totalCount] = await Promise.all([
      kv.incr(`void:day:${today}`),
      kv.incr("void:total"),
    ]);

    // Set TTL on daily key: 48 hours (generous buffer for timezone edge cases)
    await kv.expire(`void:day:${today}`, 48 * 60 * 60);

    // Accumulate travel distance: light travels 300,000 km/s
    // Store km at moment of this signal, so client can extrapolate forward
    const prevKm = (await kv.get<number>("void:travel_km")) ?? 0;
    const prevTs = (await kv.get<number>("void:last_signal_at")) ?? nowMs;
    const elapsed = (nowMs - prevTs) / 1000; // seconds since last signal
    const newKm = prevKm + elapsed * 299_792; // light speed km/s
    await kv.set("void:travel_km", newKm);
    await kv.set("void:last_signal_at", nowMs);

    return NextResponse.json({
      today: todayCount,
      total: totalCount,
      travelKm: newKm,
      lastSignalAt: nowMs,
    });
  } catch {
    return NextResponse.json({ error: "Failed to record signal" }, { status: 500 });
  }
}
