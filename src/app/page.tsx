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

        {/* Activity grid — semantic nav for crawlers */}
        <nav aria-label="Interactive experiences">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </nav>

        {/* SEO-visible description block — visually subtle but indexable */}
        <section
          className="mt-20 mb-4"
          aria-label="About Waste My Time"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            color: "#1a1a1a",
          }}
        >
          <h2
            className="text-sm font-semibold mb-4 tracking-wide"
            style={{ opacity: 0.3, textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            What is this?
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed"
            style={{ opacity: 0.35 }}
          >
            <p>
              <strong>Waste My Time</strong> is a collection of interactive web experiments
              built for curious people with a spare afternoon. No accounts, no ads, no
              notifications — just genuinely fun things to do on the internet.
            </p>
            <p>
              Inspired by neal.fun, each experience is a self-contained moment:{" "}
              <strong>draw a freehand circle</strong> and see how close to perfect you are,{" "}
              <strong>listen to your room&apos;s ambient sound</strong> for 60 seconds, or
              discover <strong>how rare your combination of traits</strong> makes you.
            </p>
            <p>
              Built by{" "}
              <a
                href="https://kjrlabs.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                KJR Labs
              </a>{" "}
              with procrastination. New experiences added regularly. Bookmark it and come
              back when you need to waste ten minutes well.
            </p>
          </div>
        </section>

        <footer
          className="mt-6 text-xs text-center"
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
