import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indian Childhood Score",
  description: "40 hyperspecific Indian childhood moments — steel tiffin boxes, DD National, chappals near the door. Check off what applies and discover your desi score.",
  openGraph: {
    title: "Indian Childhood Score | Waste My Time",
    description: "How desi was your childhood? 40 hyperspecific Indian moments to check off.",
    url: "https://wastemytime.fun/indian-childhood-score",
  },
  twitter: {
    title: "Indian Childhood Score | Waste My Time",
    description: "How desi was your childhood? 40 hyperspecific Indian moments to check off.",
  },
  alternates: { canonical: "https://wastemytime.fun/indian-childhood-score" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
