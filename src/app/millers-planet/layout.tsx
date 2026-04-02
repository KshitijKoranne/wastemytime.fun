import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Miller's Planet — Time Dilation | Waste My Time",
  description:
    "1 hour on Miller's Planet equals 7 years on Earth. See how much time has passed since Interstellar, since you opened this page, your heartbeats, sleep, screen time — all converted through Gargantua's gravity.",
  keywords: [
    "Miller's planet time dilation",
    "Interstellar time dilation calculator",
    "Gargantua gravity time",
    "1 hour 7 years Interstellar",
    "gravitational time dilation",
    "Interstellar science",
    "Kip Thorne relativity",
    "time calculator Interstellar",
  ],
  alternates: { canonical: "https://www.wastemytime.fun/millers-planet" },
  openGraph: {
    title: "Miller's Planet — Time Dilation",
    description: "1 hour here. 7 years on Earth. Explore how Gargantua's gravity bends time.",
    url: "https://www.wastemytime.fun/millers-planet",
    images: [
      {
        url: "/images/millers-planet.png",
        width: 1200,
        height: 630,
        alt: "Miller's Planet — gravitational time dilation from Interstellar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Miller's Planet — Time Dilation",
    description: "1 hour here. 7 years on Earth. See how little time passes on Miller's Planet.",
    images: ["/images/millers-planet.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Miller's Planet — Time Dilation",
    url: "https://www.wastemytime.fun/millers-planet",
    description:
      "An interactive time dilation calculator based on Miller's Planet from Interstellar. 1 hour on Miller's Planet equals 7 years on Earth due to Gargantua's gravitational field.",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "KJR Labs", url: "https://kjrlabs.in" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.wastemytime.fun" },
        { "@type": "ListItem", position: 2, name: "Miller's Planet", item: "https://www.wastemytime.fun/millers-planet" },
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
