export interface Activity {
  id: string;
  title: string;
  tagline: string;
  path: string;
  bg: string;
  text: string;
  shape: "bars" | "checklist" | "spiral" | "circle" | "dots";
  image?: string;
}

export const activities: Activity[] = [
  // Newest first
  {
    id: "millers-planet",
    title: "Miller's Planet",
    tagline: "1 hour here. 7 years on Earth.",
    path: "/millers-planet",
    bg: "#080A0E",
    text: "#F0E6D0",
    shape: "dots",
    image: "/images/millers-planet.png",
  },
  {
    id: "noise-floor",
    title: "The Noise Floor",
    tagline: "Your room is never silent.",
    path: "/noise-floor",
    bg: "#0a0a0a",
    text: "#f0f0f0",
    shape: "bars",
    image: "/images/noise-floor.png",
  },
  {
    id: "your-bug",
    title: "Your Bug",
    tagline: "A new species. Only yours.",
    path: "/your-bug",
    bg: "#F5EDD6",
    text: "#2a1a0a",
    shape: "dots",
    image: "/images/your-bug.png",
  },
  {
    id: "how-rare-are-you",
    title: "How Rare Are You?",
    tagline: "Find your dot in the crowd.",
    path: "/how-rare-are-you",
    bg: "#07071a",
    text: "#ffffff",
    shape: "dots",
    image: "/images/how-rare-are-you.png",
  },
  {
    id: "draw-a-circle",
    title: "Draw a Circle",
    tagline: "How perfect is your circle?",
    path: "/draw-a-circle",
    bg: "#2a2a3e",
    text: "#ffffff",
    shape: "circle",
    image: "/images/draw-a-circle.png",
  },
  {
    id: "overthinking-spiral",
    title: "The Overthinking Spiral",
    tagline: "Type a worry. Watch it get worse.",
    path: "/overthinking-spiral",
    bg: "#1a1a4e",
    text: "#ffffff",
    shape: "spiral",
    image: "/images/overthinking-spiral.jpg",
  },
  {
    id: "indian-childhood-score",
    title: "Indian Childhood Score",
    tagline: "How desi was your childhood?",
    path: "/indian-childhood-score",
    bg: "#F5DEB3",
    text: "#1a1a1a",
    shape: "checklist",
    image: "/images/indian-childhood-score.jpg",
  },
  {
    id: "sharma-ji-ka-beta",
    title: "Sharma Ji Ka Beta",
    tagline: "How do you measure up?",
    path: "/sharma-ji-ka-beta",
    bg: "#F5E6C0",
    text: "#1a1a1a",
    shape: "bars",
    image: "/images/sharma-ji-ka-beta.jpg",
  },
];
