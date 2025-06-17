import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, Fredoka } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waste My Time - Fun Interactive Games & Time Wasting Activities",
  description: "Discover hilarious interactive games and time-wasting activities! Click counters, bubble wrap, Indian mom chatbot, procrastination calculator & more fun experiments.",
  keywords: [
    "time waster games", "fun interactive activities", "browser games", "procrastination", 
    "bubble wrap popping", "click counter", "indian mom chatbot", "funny games",
    "stress relief games", "entertainment", "neal.fun alternatives", "pointless websites",
    "interactive experiments", "online time killers", "casual games", "humor"
  ],
  authors: [{ name: "Waste My Time" }],
  creator: "Waste My Time",
  publisher: "Waste My Time",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wastemytime.fun'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Waste My Time - Fun Interactive Games & Time Wasting Activities",
    description: "Discover hilarious interactive games and time-wasting activities! Click counters, bubble wrap, Indian mom chatbot, procrastination calculator & more.",
    url: "https://wastemytime.fun",
    siteName: "Waste My Time",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Waste My Time - Fun Interactive Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Waste My Time - Fun Interactive Games & Time Wasting Activities",
    description: "Discover hilarious interactive games and time-wasting activities! Click counters, bubble wrap, Indian mom chatbot & more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Waste My Time",
    "url": "https://wastemytime.fun",
    "description": "A collection of playful, absurd, interactive micro-experiences that capture your curiosity and hold your attention",
    "publisher": {
      "@type": "Organization",
      "name": "Waste My Time"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://wastemytime.fun/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": [
      {
        "@type": "Game",
        "name": "Click Me Forever",
        "url": "https://wastemytime.fun/click-me",
        "description": "Infinite click counter game with motivational messages"
      },
      {
        "@type": "Game", 
        "name": "Virtual Bubble Wrap",
        "url": "https://wastemytime.fun/bubble-wrap",
        "description": "Stress relief bubble popping game"
      },
      {
        "@type": "SoftwareApplication",
        "name": "Procrastination Calculator",
        "url": "https://wastemytime.fun/procrastination-calculator",
        "description": "Generate creative excuses to avoid tasks"
      },
      {
        "@type": "Game",
        "name": "Indian Mom GPT",
        "url": "https://wastemytime.fun/indian-mom-gpt", 
        "description": "Chat with a hilarious virtual Indian mom"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${fredoka.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
