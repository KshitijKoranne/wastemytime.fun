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
  description: "Discover amazing interactive experiences and time-wasting activities! Life visualizations, Earth's heartbeat, achievements, scroll challenges & more awe-inspiring experiments.",
  keywords: [
    "life visualization", "earth statistics", "interactive timeline", "global data", "life calendar",
    "time waster games", "fun interactive activities", "browser games", "procrastination", 
    "stress relief games", "entertainment", "neal.fun alternatives", "pointless websites",
    "interactive experiments", "online time killers", "casual games", "awe inspiring",
    "real time data", "personal insights", "data visualization", "creative activities"
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
    description: "Discover amazing interactive experiences! Life visualizations, Earth's heartbeat, achievements, scroll challenges & more awe-inspiring experiments.",
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
    description: "Discover amazing interactive experiences! Life visualizations, Earth's heartbeat, achievements & more awe-inspiring experiments.",
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
        "@type": "SoftwareApplication",
        "name": "Earth's Heartbeat",
        "url": "https://wastemytime.fun/earths-heartbeat",
        "description": "Feel the pulse of our living planet with real-time global statistics",
        "applicationCategory": "DataVisualization",
        "operatingSystem": "Web Browser"
      },
      {
        "@type": "SoftwareApplication",
        "name": "Life in Weeks",
        "url": "https://wastemytime.fun/life-calendar",
        "description": "Visualize your entire life as 4,000 interactive weeks with AI insights",
        "applicationCategory": "DataVisualization",
        "operatingSystem": "Web Browser"
      },
      {
        "@type": "Game",
        "name": "Pointless Achievements",
        "url": "https://wastemytime.fun/achievements",
        "description": "Feel validated for doing nothing important with silly achievements"
      },
      {
        "@type": "SoftwareApplication",
        "name": "100 Indian Experiences",
        "url": "https://wastemytime.fun/indian-experiences",
        "description": "Hilarious moments every Indian has lived through",
        "applicationCategory": "Entertainment"
      },
      {
        "@type": "Game",
        "name": "Year Progress Tracker",
        "url": "https://wastemytime.fun/year-progress",
        "description": "Watch the current year slip away, second by second"
      },
      {
        "@type": "Game",
        "name": "Scroll Speed Challenge",
        "url": "https://wastemytime.fun/scroll-speed",
        "description": "Test how fast you can scroll and break speed records"
      },
      {
        "@type": "Game",
        "name": "Snake with a Twist",
        "url": "https://wastemytime.fun/snake-fade",
        "description": "Classic Snake game that gradually fades away as you play"
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
