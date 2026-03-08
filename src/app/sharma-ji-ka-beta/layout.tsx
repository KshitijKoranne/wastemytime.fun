import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sharma Ji Ka Beta — The Ultimate Comparison Test",
  description:
    "Enter your marks, job, and salary. Get ruthlessly benchmarked against the mythical Sharma Ji Ka Beta with a personalised AI roast. How much of a Sharma Ji Ka Beta are you?",
  keywords: [
    "sharma ji ka beta",
    "sharma ji ka beta quiz",
    "indian comparison test",
    "desi meme quiz",
    "sharma ji ka beta score",
    "indian parent comparison",
    "ai roast india",
    "funny indian quiz",
    "marks comparison india",
    "sharma ji ka beta game",
  ],
  alternates: { canonical: "https://www.wastemytime.fun/sharma-ji-ka-beta" },
  openGraph: {
    title: "Sharma Ji Ka Beta — The Ultimate Comparison Test",
    description:
      "Enter your marks, job, and salary. Get ruthlessly benchmarked against the mythical Sharma Ji Ka Beta with a personalised AI roast.",
    url: "https://www.wastemytime.fun/sharma-ji-ka-beta",
    images: [
      {
        url: "/images/sharma-ji-ka-beta.jpg",
        width: 1200,
        height: 630,
        alt: "Sharma Ji Ka Beta comparison quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sharma Ji Ka Beta — How Do You Measure Up?",
    description:
      "Enter your marks, job, and salary. Get an AI roast comparing you to the mythical Sharma Ji Ka Beta.",
    images: ["/images/sharma-ji-ka-beta.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Sharma Ji Ka Beta",
    "url": "https://www.wastemytime.fun/sharma-ji-ka-beta",
    "description":
      "Enter your marks, job, and salary. Get ruthlessly benchmarked against the mythical Sharma Ji Ka Beta with a personalised AI roast.",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "isAccessibleForFree": true,
    "creator": { "@type": "Organization", "name": "KJR Labs", "url": "https://kjrlabs.in" },
    "inLanguage": "en-IN",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.wastemytime.fun" },
        { "@type": "ListItem", "position": 2, "name": "Sharma Ji Ka Beta", "item": "https://www.wastemytime.fun/sharma-ji-ka-beta" },
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
