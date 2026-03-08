import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Bug — Discover Your Unique Specimen",
  description:
    "Every visit generates a never-before-seen insect, drawn in Victorian naturalist style. It gets a Latin name. Name it. Add it to your collection. No two bugs are alike.",
  keywords: [
    "procedurally generated bug",
    "your bug",
    "insect generator",
    "generative art",
    "Victorian entomology",
    "name a bug",
    "interactive experiment",
    "procedural insect",
    "specimen collector",
    "waste my time",
  ],
  alternates: { canonical: "https://wastemytime.fun/your-bug" },
  openGraph: {
    title: "Your Bug — Discover Your Unique Specimen",
    description:
      "Every visit generates a never-before-seen insect. Give it a name. Add it to your collection. No two alike.",
    url: "https://wastemytime.fun/your-bug",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Bug — Discover Your Unique Specimen",
    description:
      "Every visit generates a never-before-seen insect. Name it. Catalogue it.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Your Bug",
    url: "https://wastemytime.fun/your-bug",
    description:
      "A procedural insect generator. Every visit creates a unique, never-before-seen specimen with a Latin name. Name it and add it to your personal collection.",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "KJR Labs", url: "https://kjrlabs.in" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://wastemytime.fun" },
        { "@type": "ListItem", position: 2, name: "Your Bug", item: "https://wastemytime.fun/your-bug" },
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
