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
  title: { default: "Waste My Time", template: "%s | Waste My Time" },
  description: "Five genuinely fun interactive experiences to waste your afternoon on. Draw circles, overthink, benchmark yourself against Sharma Ji Ka Beta, and more.",
  keywords: [
    "waste my time", "sharma ji ka beta", "indian childhood score", "overthinking spiral",
    "draw a circle", "how rare are you", "fun website", "interactive games",
    "neal.fun", "procrastination", "time waster", "indian meme", "personality quiz",
    "rarity calculator", "circle drawing game"
  ],
  authors: [{ name: "KJR Labs", url: "https://kjrlabs.in" }],
  creator: "KJR Labs",
  publisher: "KJR Labs",
  metadataBase: new URL("https://wastemytime.fun"),
  alternates: { canonical: "https://wastemytime.fun" },
  openGraph: {
    title: "Waste My Time",
    description: "Five genuinely fun interactive experiences to waste your afternoon on.",
    url: "https://wastemytime.fun",
    siteName: "Waste My Time",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Waste My Time — a corner of the internet for your afternoon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Waste My Time",
    description: "Five genuinely fun interactive experiences to waste your afternoon on.",
    images: ["/og-image.png"],
    creator: "@kjrlabs",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: { google: process.env.GOOGLE_VERIFICATION },
  category: "entertainment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Waste My Time",
    "url": "https://wastemytime.fun",
    "description": "Five genuinely fun interactive experiences to waste your afternoon on.",
    "author": { "@type": "Organization", "name": "KJR Labs", "url": "https://kjrlabs.in" },
    "mainEntity": [
      {
        "@type": "Game",
        "name": "Sharma Ji Ka Beta",
        "url": "https://wastemytime.fun/sharma-ji-ka-beta",
        "description": "Enter your marks, job, and salary. Get benchmarked against the mythical Sharma Ji Ka Beta with a personalised AI roast.",
        "applicationCategory": "EntertainmentApplication",
      },
      {
        "@type": "Game",
        "name": "Indian Childhood Score",
        "url": "https://wastemytime.fun/indian-childhood-score",
        "description": "40 hyperspecific Indian childhood moments. Check off what applies and discover how desi your childhood really was.",
        "applicationCategory": "EntertainmentApplication",
      },
      {
        "@type": "SoftwareApplication",
        "name": "The Overthinking Spiral",
        "url": "https://wastemytime.fun/overthinking-spiral",
        "description": "Type any worry. AI escalates it into five absurd catastrophic steps, then lands with a calm pivot.",
        "applicationCategory": "EntertainmentApplication",
      },
      {
        "@type": "Game",
        "name": "Draw a Circle",
        "url": "https://wastemytime.fun/draw-a-circle",
        "description": "Draw a freehand circle anywhere on screen. Get scored on how close to perfect it is.",
        "applicationCategory": "EntertainmentApplication",
      },
      {
        "@type": "SoftwareApplication",
        "name": "How Rare Are You?",
        "url": "https://wastemytime.fun/how-rare-are-you",
        "description": "Select traits that apply to you. Discover your rarity as 1 in X people — visualised as a glowing dot in a field of thousands.",
        "applicationCategory": "EntertainmentApplication",
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
