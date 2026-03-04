import { activities } from "@/data/activities";
import ActivityCard from "@/components/ActivityCard";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <div className="max-w-4xl mx-auto px-5 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <h1
            className="text-5xl md:text-7xl font-bold leading-none tracking-tight mb-3"
            style={{ fontFamily: "var(--font-fraunces), serif", color: "#1a1a1a" }}
          >
            Waste My Time
          </h1>
          <p
            className="text-base md:text-lg"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#1a1a1a",
              opacity: 0.4,
            }}
          >
            a corner of the internet for your afternoon
          </p>
        </header>

        {/* Equal 3-col tile grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>

        <footer
          className="mt-16 text-xs text-center"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            color: "#1a1a1a",
            opacity: 0.2,
          }}
        >
          made with procrastination by{" "}
          <a
            href="https://kjrlabs.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            KJR Labs
          </a>
        </footer>
      </div>
    </main>
  );
}
