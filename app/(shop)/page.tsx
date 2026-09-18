import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-heading font-semibold leading-tight">
            Every Page,<br />
            <span className="text-accent">A New World</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Sahifa brings you a curated collection of the finest books — browse,
            buy, and read online in one beautiful place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/books"
              className="inline-flex items-center px-6 py-3 bg-primary-foreground text-primary rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              Browse Books
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-primary-foreground/40 text-primary-foreground rounded-md font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured section placeholder */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-heading font-semibold mb-8 text-foreground">
          Featured Books
        </h2>
        <p className="text-muted-foreground">
          Books will appear here once added to the store.
        </p>
      </section>
    </main>
  );
}
