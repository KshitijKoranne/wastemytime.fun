import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draw a Perfect Circle — Get Scored on How Round It Is",
  description:
    "Draw a freehand circle on your screen and get instantly scored on how close to perfect it is. Can you beat 90%? Most people can't. Challenge your friends and share your score.",
  keywords: [
    "draw a perfect circle",
    "draw a circle game",
    "circle drawing test",
    "how round is your circle",
    "perfect circle challenge",
    "freehand circle game",
    "circle accuracy test",
    "draw circle score",
    "circle drawing challenge",
    "neal fun draw circle alternative",
    "perfect circle online",
  ],
  alternates: { canonical: "https://www.wastemytime.fun/draw-a-circle" },
  openGraph: {
    title: "Draw a Perfect Circle — Get Scored on How Round It Is",
    description:
      "Draw a freehand circle and get instantly scored. Can you beat 90%? Most people can't.",
    url: "https://www.wastemytime.fun/draw-a-circle",
    images: [
      {
        url: "/images/draw-a-circle.png",
        width: 1200,
        height: 630,
        alt: "Draw a Perfect Circle game — get scored",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Draw a Perfect Circle — Can You Beat 90%?",
    description:
      "Draw a freehand circle on your screen and get instantly scored. Most people can't beat 90%.",
    images: ["/images/draw-a-circle.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Game",
    "name": "Draw a Circle",
    "url": "https://www.wastemytime.fun/draw-a-circle",
    "description":
      "Draw a freehand circle on screen and get scored on how close to perfect it is. Share your score and challenge friends.",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "gamePlatform": "Web browser",
    "creator": { "@type": "Organization", "name": "KJR Labs", "url": "https://kjrlabs.in" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.wastemytime.fun" },
        { "@type": "ListItem", "position": 2, "name": "Draw a Circle", "item": "https://www.wastemytime.fun/draw-a-circle" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
