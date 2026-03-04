import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sharma Ji Ka Beta",
  description: "Enter your marks, job, and salary. Get benchmarked against the mythical Sharma Ji Ka Beta with a personalised AI roast. How much of Sharma Ji Ka Beta are you?",
  openGraph: {
    title: "Sharma Ji Ka Beta | Waste My Time",
    description: "Get benchmarked against the mythical Sharma Ji Ka Beta with a personalised AI roast.",
    url: "https://wastemytime.fun/sharma-ji-ka-beta",
  },
  twitter: {
    title: "Sharma Ji Ka Beta | Waste My Time",
    description: "Get benchmarked against the mythical Sharma Ji Ka Beta with a personalised AI roast.",
  },
  alternates: { canonical: "https://wastemytime.fun/sharma-ji-ka-beta" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
