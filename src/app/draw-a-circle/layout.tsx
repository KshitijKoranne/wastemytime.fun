import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draw a Circle",
  description: "Draw a freehand circle anywhere on screen. Get scored on how close to perfect it is. Can you beat 90%? Most people can't.",
  openGraph: {
    title: "Draw a Circle | Waste My Time",
    description: "Draw a freehand circle. Get scored. Most people can't beat 90%.",
    url: "https://wastemytime.fun/draw-a-circle",
  },
  twitter: {
    title: "Draw a Circle | Waste My Time",
    description: "Draw a freehand circle. Get scored. Most people can't beat 90%.",
  },
  alternates: { canonical: "https://wastemytime.fun/draw-a-circle" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
