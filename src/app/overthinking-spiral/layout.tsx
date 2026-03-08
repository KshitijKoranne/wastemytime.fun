import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Overthinking Spiral — Type a Worry, Watch It Get Worse",
  description:
    "Type any worry. AI escalates it into five increasingly absurd, catastrophic steps — then lands with a calm, grounding pivot. Watch your anxiety become dark comedy.",
  keywords: [
    "overthinking spiral",
    "anxiety spiral game",
    "funny overthinking website",
    "overthinking ai",
    "worry escalator",
    "ai anxiety humor",
    "catastrophising game",
    "overthinking meme game",
    "spiral of overthinking",
    "funny anxiety website",
    "type a worry",
  ],
  alternates: { canonical: "https://www.wastemytime.fun/overthinking-spiral" },
  openGraph: {
    title: "The Overthinking Spiral — Type a Worry, Watch It Get Worse",
    description:
      "Type any worry. AI escalates it into five absurd catastrophic steps — then finds the calm. Watch anxiety become comedy.",
    url: "https://www.wastemytime.fun/overthinking-spiral",
    images: [
      {
        url: "/images/overthinking-spiral.jpg",
        width: 1200,
        height: 630,
        alt: "The Overthinking Spiral interactive experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Overthinking Spiral — Type a Worry, Watch It Get Worse",
    description:
      "Type any worry. AI escalates it into five absurd catastrophic steps. Then finds calm.",
    images: ["/images/overthinking-spiral.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "The Overthinking Spiral",
    "url": "https://www.wastemytime.fun/overthinking-spiral",
    "description":
      "Type any worry. AI escalates it into five increasingly absurd catastrophic steps, then lands with a calm, grounding pivot.",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Any",
    "isAccessibleForFree": true,
    "creator": { "@type": "Organization", "name": "KJR Labs", "url": "https://kjrlabs.in" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.wastemytime.fun" },
        { "@type": "ListItem", "position": 2, "name": "The Overthinking Spiral", "item": "https://www.wastemytime.fun/overthinking-spiral" },
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
