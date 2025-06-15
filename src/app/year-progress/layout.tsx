import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Year Progress Tracker - Live Real-Time Counter | Waste My Time",
  description: "Watch the current year slip away second by second! Real-time year progress with milestones, time stats, and cosmic theme. See how much of the year is complete.",
  keywords: ["year progress", "time tracker", "real time counter", "year percentage", "time statistics", "live clock", "year milestones"],
  openGraph: {
    title: "Year Progress Tracker - Live Real-Time Counter",
    description: "Watch the current year slip away second by second! Real-time year progress with milestones and time stats.",
    url: "https://wastemytime.fun/year-progress",
  },
  alternates: {
    canonical: '/year-progress',
  },
};

export default function YearProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}