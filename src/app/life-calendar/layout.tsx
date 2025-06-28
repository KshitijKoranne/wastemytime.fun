import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Life in Weeks - Visualize Your Life Timeline | Waste My Time",
  description: "Visualize your entire life as 4,000 interactive weeks! Explore historical events, AI insights, and personal timeline with this awe-inspiring life calendar visualization.",
  keywords: [
    "life visualization", "life calendar", "4000 weeks", "life timeline", "mortality",
    "life expectancy", "personal timeline", "historical events", "AI insights", "life stages",
    "time visualization", "existential", "life perspective", "human lifespan", "interactive timeline"
  ],
  openGraph: {
    title: "Life in Weeks - Visualize Your Life Timeline",
    description: "Visualize your entire life as 4,000 interactive weeks with historical events and AI insights!",
    url: "https://wastemytime.fun/life-calendar",
    type: "website",
    images: [
      {
        url: "/images/life in weeks.png",
        width: 1200,
        height: 630,
        alt: "Life in Weeks - Interactive Life Timeline Visualization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Life in Weeks - Visualize Your Life Timeline",
    description: "Visualize your entire life as 4,000 interactive weeks with AI insights!",
    images: ["/images/life in weeks.png"],
  },
  alternates: {
    canonical: '/life-calendar',
  },
};

export default function LifeCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Life in Weeks",
    "url": "https://wastemytime.fun/life-calendar",
    "description": "Interactive life visualization showing your entire life as 4,000 weeks with historical events and AI-powered insights",
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
    },
    "featureList": [
      "4,000 week life visualization",
      "Historical events integration",
      "AI-powered insights",
      "Personal timeline tracking",
      "Interactive week selection"
    ]
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