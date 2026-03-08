import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Rare Are You? — Find Out If You're 1 in a Million",
  description:
    "Select traits that apply to you — left-handed, synesthesia, identical twin, lucid dreamer, perfect pitch. Discover your rarity as 1 in X people, visualised as your glowing dot in a crowd of thousands.",
  keywords: [
    "how rare are you",
    "rarity calculator",
    "how rare am i",
    "rare traits quiz",
    "personality rarity test",
    "1 in a million quiz",
    "rare human traits",
    "left handed rare",
    "synesthesia quiz",
    "unique traits calculator",
    "rare personality traits test",
    "how unique are you quiz",
  ],
  alternates: { canonical: "https://www.wastemytime.fun/how-rare-are-you" },
  openGraph: {
    title: "How Rare Are You? — Find Out If You're 1 in a Million",
    description:
      "Select traits that apply to you and discover your rarity as 1 in X people. Are you common or extraordinary?",
    url: "https://www.wastemytime.fun/how-rare-are-you",
    images: [
      {
        url: "/images/how-rare-are-you.png",
        width: 1200,
        height: 630,
        alt: "How Rare Are You — rarity calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Rare Are You? — Are You 1 in a Million?",
    description:
      "Select your traits and discover your rarity score. Visualised as your dot in a crowd of thousands.",
    images: ["/images/how-rare-are-you.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "How Rare Are You?",
    "url": "https://www.wastemytime.fun/how-rare-are-you",
    "description":
      "Select traits that apply to you and discover your statistical rarity as 1 in X people, visualised in a crowd.",
    "isAccessibleForFree": true,
    "creator": { "@type": "Organization", "name": "KJR Labs", "url": "https://kjrlabs.in" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.wastemytime.fun" },
        { "@type": "ListItem", "position": 2, "name": "How Rare Are You?", "item": "https://www.wastemytime.fun/how-rare-are-you" },
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
