import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Virtual Bubble Wrap Popping Game - Stress Relief | Waste My Time",
  description: "Pop infinite virtual bubble wrap! The most satisfying stress relief game online. Different grid sizes, completion tracking, and therapeutic bubble popping.",
  keywords: ["bubble wrap", "stress relief", "popping game", "satisfying game", "anxiety relief", "bubble pop", "virtual bubble wrap"],
  openGraph: {
    title: "Virtual Bubble Wrap Popping Game - Stress Relief",
    description: "Pop infinite virtual bubble wrap! The most satisfying stress relief game online.",
    url: "https://wastemytime.fun/bubble-wrap",
  },
  alternates: {
    canonical: '/bubble-wrap',
  },
};

export default function BubbleWrapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}