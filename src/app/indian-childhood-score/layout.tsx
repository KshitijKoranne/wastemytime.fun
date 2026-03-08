import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indian Childhood Score — How Desi Was Your Childhood?",
  description:
    "40 hyperspecific Indian childhood moments — steel tiffin boxes, DD National, chappals near the door, Bournvita, load-shedding homework. Check off what applies and get your desi score.",
  keywords: [
    "indian childhood quiz",
    "indian childhood score",
    "desi childhood memories",
    "how indian is your childhood",
    "desi quiz",
    "indian 90s nostalgia quiz",
    "dd national childhood",
    "indian school memories",
    "desi nostalgia test",
    "how desi are you",
    "indian upbringing quiz",
  ],
  alternates: { canonical: "https://wastemytime.fun/indian-childhood-score" },
  openGraph: {
    title: "Indian Childhood Score — How Desi Was Your Childhood?",
    description:
      "40 hyperspecific Indian childhood moments. Check off what applies and discover your true desi score.",
    url: "https://wastemytime.fun/indian-childhood-score",
    images: [
      {
        url: "/images/indian-childhood-score.jpg",
        width: 1200,
        height: 630,
        alt: "Indian Childhood Score quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Indian Childhood Score — How Desi Was Your Childhood?",
    description:
      "40 hyperspecific Indian childhood moments. How many did you experience?",
    images: ["/images/indian-childhood-score.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": "Indian Childhood Score",
    "url": "https://wastemytime.fun/indian-childhood-score",
    "description":
      "40 hyperspecific Indian childhood moments — check off what applies and discover your desi childhood score.",
    "educationalAlignment": {
      "@type": "AlignmentObject",
      "alignmentType": "assesses",
      "targetDescription": "Indian cultural upbringing knowledge",
    },
    "isAccessibleForFree": true,
    "inLanguage": "en-IN",
    "creator": { "@type": "Organization", "name": "KJR Labs", "url": "https://kjrlabs.in" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wastemytime.fun" },
        { "@type": "ListItem", "position": 2, "name": "Indian Childhood Score", "item": "https://wastemytime.fun/indian-childhood-score" },
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
