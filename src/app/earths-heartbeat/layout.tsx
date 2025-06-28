import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earth's Heartbeat - Real-Time Global Statistics | Waste My Time",
  description: "Feel the pulse of our living planet! Watch real-time global statistics: births, deaths, heartbeats, CO₂ emissions, lightning strikes & more. AI-powered insights included.",
  keywords: [
    "earth statistics", "real time data", "global statistics", "planet earth", "environmental data",
    "birth rate", "death rate", "lightning strikes", "co2 emissions", "earth heartbeat",
    "data visualization", "interactive statistics", "world data", "live statistics", "planet facts"
  ],
  openGraph: {
    title: "Earth's Heartbeat - Real-Time Global Statistics",
    description: "Feel the pulse of our living planet! Watch real-time global statistics with AI-powered insights about our world.",
    url: "https://wastemytime.fun/earths-heartbeat",
    type: "website",
    images: [
      {
        url: "/images/earths_heartbeat.png",
        width: 1200,
        height: 630,
        alt: "Earth's Heartbeat - Real-Time Global Statistics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Earth's Heartbeat - Real-Time Global Statistics",
    description: "Feel the pulse of our living planet! Watch real-time global statistics with AI insights.",
    images: ["/images/earths_heartbeat.png"],
  },
  alternates: {
    canonical: '/earths-heartbeat',
  },
};

export default function EarthsHeartbeatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Earth's Heartbeat",
    "url": "https://wastemytime.fun/earths-heartbeat",
    "description": "Interactive real-time visualization of global statistics including births, deaths, environmental data, and human activities",
    "applicationCategory": "DataVisualization",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript enabled",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Waste My Time"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}