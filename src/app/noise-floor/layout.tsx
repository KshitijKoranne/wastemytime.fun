import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Noise Floor",
  description:
    "Your room is never silent. 60 seconds. We'll listen to what you've stopped hearing — the hum, the breath, the machinery of your life.",
  openGraph: {
    title: "The Noise Floor | Waste My Time",
    description:
      "Your room is never silent. 60 seconds of ambient sound — measured, named, and reflected back at you.",
    url: "https://wastemytime.fun/noise-floor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
