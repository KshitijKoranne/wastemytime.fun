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
  title: {
    default: "Waste My Time — Fun Interactive Experiences",
    template: "%s | Waste My Time",
  },
  description:
    "Six genuinely fun, interactive web experiments to waste your afternoon on. Draw circles, listen to your room's silence, discover how rare you are, and more. No ads, no sign-up.",
  keywords: [
    "waste my time",
    "wastemytime fun",
    "fun interactive website",
    "bored online games",
    "neal fun alternative",
    "draw a perfect circle",
    "sharma ji ka beta",
    "indian childhood quiz",
    "overthinking spiral",
    "how rare are you personality quiz",
    "ambient sound experiment",
    "noise floor",
    "procrastination website",
    "time waster games",
    "fun web experiments",
    "interactive games no signup",
    "boredom killer website",
    "cool websites 2025",
    "kjrlabs",
  ],
  authors: [{ name: "KJR Labs", url: "https://kjrlabs.in" }],
  creator: "KJR Labs",
  publisher: "KJR Labs",
  metadataBase: new URL("https://www.wastemytime.fun"),
  alternates: { canonical: "https://www.wastemytime.fun" },
  openGraph: {
    title: "Waste My Time — Fun Interactive Experiences",
    description:
      "Six genuinely fun, interactive web experiments. Draw circles, listen to your room, discover how rare you are. No ads, no sign-up.",
    url: "https://www.wastemytime.fun",
    siteName: "Waste My Time",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Waste My Time — a corner of the internet for your afternoon",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Waste My Time — Fun Interactive Experiences",
    description:
      "Six genuinely fun, interactive web experiments. Draw circles, listen to your room, discover how rare you are.",
    images: ["/og-image.png"],
    creator: "@kjrlabs",
    site: "@kjrlabs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: { google: process.env.GOOGLE_VERIFICATION },
  category: "entertainment",
  applicationName: "Waste My Time",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.wastemytime.fun/#website",
    "name": "Waste My Time",
    "alternateName": "wastemytime.fun",
    "url": "https://www.wastemytime.fun",
    "description": "Six genuinely fun, interactive web experiments to waste your afternoon on. No ads, no sign-up.",
    "author": {
      "@type": "Organization",
      "name": "KJR Labs",
      "url": "https://kjrlabs.in",
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.wastemytime.fun/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Interactive Experiences on Waste My Time",
    "description": "A collection of fun, interactive web experiments",
    "url": "https://www.wastemytime.fun",
    "numberOfItems": 6,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Sharma Ji Ka Beta",
        "description": "Benchmark yourself against the mythical Sharma Ji Ka Beta with a personalised AI roast. Enter your marks, job, and salary.",
        "url": "https://www.wastemytime.fun/sharma-ji-ka-beta",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Indian Childhood Score",
        "description": "40 hyperspecific Indian childhood moments — steel tiffin boxes, DD National, chappals near the door. Discover your desi score.",
        "url": "https://www.wastemytime.fun/indian-childhood-score",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "The Overthinking Spiral",
        "description": "Type any worry. Watch AI escalate it into five increasingly absurd catastrophic steps, then find calm.",
        "url": "https://www.wastemytime.fun/overthinking-spiral",
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Draw a Circle",
        "description": "Draw a freehand circle on screen and get scored on how close to perfect it is. Can you beat 90%?",
        "url": "https://www.wastemytime.fun/draw-a-circle",
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "How Rare Are You?",
        "description": "Select traits that apply to you and discover your rarity as 1 in X people, visualised as a glowing dot in a crowd.",
        "url": "https://www.wastemytime.fun/how-rare-are-you",
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "The Noise Floor",
        "description": "60 seconds of ambient listening. Discover what your room actually sounds like when you stop ignoring it.",
        "url": "https://www.wastemytime.fun/noise-floor",
      },
    ],
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://kjrlabs.in/#organization",
    "name": "KJR Labs",
    "url": "https://kjrlabs.in",
    "sameAs": ["https://www.wastemytime.fun"],
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="SIhSFzG-_wB5brnoEV_CRi-ovHUfjB-lJ9ziBDyJYeQ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F5F0E8" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#080808" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className={`${fraunces.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
