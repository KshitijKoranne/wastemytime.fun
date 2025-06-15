import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Click Me Forever - Infinite Click Counter Game | Waste My Time",
  description: "The most addictive infinite click counter! Watch numbers grow, get motivational messages, and learn random facts. A pointless but satisfying time waster.",
  keywords: ["click counter", "infinite clicker", "number game", "addictive game", "time waster", "click me game"],
  openGraph: {
    title: "Click Me Forever - Infinite Click Counter Game",
    description: "The most addictive infinite click counter! Watch numbers grow and learn random facts.",
    url: "https://wastemytime.fun/click-me",
  },
  alternates: {
    canonical: '/click-me',
  },
};

export default function ClickMeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}