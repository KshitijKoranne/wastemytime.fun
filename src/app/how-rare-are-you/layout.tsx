import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Rare Are You?",
  description: "Select traits that are true about you — left-handed, synesthesia, identical twin, lucid dreamer. Discover your rarity as 1 in X people, visualised as a glowing dot in a crowd.",
  openGraph: {
    title: "How Rare Are You? | Waste My Time",
    description: "Find out how rare your combination of traits makes you. Are you 1 in 100 or 1 in a million?",
    url: "https://wastemytime.fun/how-rare-are-you",
  },
  twitter: {
    title: "How Rare Are You? | Waste My Time",
    description: "Find out how rare your combination of traits makes you. Are you 1 in 100 or 1 in a million?",
  },
  alternates: { canonical: "https://wastemytime.fun/how-rare-are-you" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
