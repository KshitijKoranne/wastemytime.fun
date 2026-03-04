import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waste My Time",
  description: "Three genuinely fun things to do with your afternoon.",
  keywords: [
    "sharma ji ka beta", "indian childhood", "overthinking", "fun indian website",
    "indian meme", "procrastination", "interactive", "neal.fun", "time waster"
  ],
  authors: [{ name: "Waste My Time" }],
  metadataBase: new URL("https://wastemytime.fun"),
  alternates: { canonical: "https://wastemytime.fun" },
  openGraph: {
    title: "Waste My Time",
    description: "Three genuinely fun things to do with your afternoon.",
    url: "https://wastemytime.fun",
    siteName: "Waste My Time",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Waste My Time" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Waste My Time",
    description: "Three genuinely fun things to do with your afternoon.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  verification: { google: process.env.GOOGLE_VERIFICATION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Waste My Time",
    "url": "https://wastemytime.fun",
    "description": "Three genuinely fun interactive experiences.",
    "mainEntity": [
      {
        "@type": "Game",
        "name": "Sharma Ji Ka Beta",
        "url": "https://wastemytime.fun/sharma-ji-ka-beta",
        "description": "Benchmark yourself against the mythical Sharma Ji Ka Beta",
      },
      {
        "@type": "Game",
        "name": "Indian Childhood Score",
        "url": "https://wastemytime.fun/indian-childhood-score",
        "description": "Check off Indian childhood experiences and see your score",
      },
      {
        "@type": "SoftwareApplication",
        "name": "The Overthinking Spiral",
        "url": "https://wastemytime.fun/overthinking-spiral",
        "description": "Type a worry and watch it spiral into absurdity",
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="SIhSFzG-_wB5brnoEV_CRi-ovHUfjB-lJ9ziBDyJYeQ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${fraunces.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
