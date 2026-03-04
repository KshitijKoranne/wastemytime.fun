import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Overthinking Spiral",
  description: "Type any worry. AI escalates it into five increasingly absurd catastrophic steps, then lands with a calm, grounding pivot. Watch your anxiety become comedy.",
  openGraph: {
    title: "The Overthinking Spiral | Waste My Time",
    description: "Type a worry. Watch it spiral into chaos. Then find calm.",
    url: "https://wastemytime.fun/overthinking-spiral",
  },
  twitter: {
    title: "The Overthinking Spiral | Waste My Time",
    description: "Type a worry. Watch it spiral into chaos. Then find calm.",
  },
  alternates: { canonical: "https://wastemytime.fun/overthinking-spiral" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
