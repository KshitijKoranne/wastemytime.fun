import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Noise Floor — Your Room Is Never Silent",
  description:
    "30 seconds of ambient listening. We measure what you've stopped hearing — the hum, the breath, the machinery of your life. Discover your room's true sound level. No audio is ever recorded.",
  keywords: [
    "noise floor",
    "ambient sound experiment",
    "room noise level",
    "decibel measurement online",
    "how loud is my room",
    "ambient noise test",
    "sound level meter online",
    "db meter browser",
    "silence experiment",
    "microphone sound test",
    "interactive sound experiment",
    "room acoustics test",
  ],
  alternates: { canonical: "https://wastemytime.fun/noise-floor" },
  openGraph: {
    title: "The Noise Floor — Your Room Is Never Silent",
    description:
      "60 seconds. We listen to what you've stopped hearing — the hum, the breath, the machinery of your life.",
    url: "https://wastemytime.fun/noise-floor",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Noise Floor — ambient sound experiment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Noise Floor — Your Room Is Never Silent",
    description:
      "60 seconds of ambient listening. Discover what your room sounds like when you stop ignoring it.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "The Noise Floor",
    "url": "https://wastemytime.fun/noise-floor",
    "description":
      "An ambient sound experiment. 30 seconds of listening to your room's actual noise level, measured and reflected back to you. No audio recorded or stored.",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires microphone access, JavaScript",
    "isAccessibleForFree": true,
    "creator": { "@type": "Organization", "name": "KJR Labs", "url": "https://kjrlabs.in" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wastemytime.fun" },
        { "@type": "ListItem", "position": 2, "name": "The Noise Floor", "item": "https://wastemytime.fun/noise-floor" },
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
