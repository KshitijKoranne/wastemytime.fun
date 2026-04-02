import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign the Void | Waste My Time",
  description:
    "Send a signal into the cosmos. See how many others have done it today, and watch how far your collective signals have traveled at the speed of light.",
  alternates: { canonical: "https://www.wastemytime.fun/sign-the-void" },
  openGraph: {
    title: "Sign the Void",
    description: "One click. A signal into the cosmos. See how far it's traveled.",
    url: "https://www.wastemytime.fun/sign-the-void",
    images: [{ url: "/images/sign-the-void.png", width: 1200, height: 630, alt: "Sign the Void" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign the Void",
    description: "One click. A signal into the cosmos.",
    images: ["/images/sign-the-void.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
