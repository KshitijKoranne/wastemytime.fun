import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Indian Mom GPT - Hilarious Virtual Indian Mom Chatbot | Waste My Time",
  description: "Chat with a hilariously dramatic virtual Indian mom! Experience guilt trips, emotional blackmail, and classic mom responses. 4 different mood modes available.",
  keywords: ["indian mom", "chatbot", "funny chat", "indian humor", "mom simulator", "desi mom", "guilt trip bot", "indian comedy"],
  openGraph: {
    title: "Indian Mom GPT - Hilarious Virtual Indian Mom Chatbot",
    description: "Chat with a hilariously dramatic virtual Indian mom! Experience guilt trips and classic mom responses.",
    url: "https://wastemytime.fun/indian-mom-gpt",
  },
  alternates: {
    canonical: '/indian-mom-gpt',
  },
};

export default function IndianMomGPTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}