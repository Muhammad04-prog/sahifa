import { prisma } from "@/lib/prisma";
import BookCard from "@/components/book-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sahifa — Your Online Bookstore",
  description:
    "Browse and buy a curated collection of books. Read online or purchase your favourites.",
};

// Revalidate every hour so new books appear without redeploy
export const revalidate = 3600;

export default async function HomePage() {
  const books = await prisma.book.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      author: true,
      description: true,
      price: true,
      coverImage: true,
      pdfUrl: true,
      stock: true,
    },
  });

  return (
    <main className="flex-1 bg-background">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden
        />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-primary-foreground/60 mb-4">
            Welcome to Sahifa
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
            Every Page,
            <br />
            <span className="text-accent">A New World</span>
          </h1>
          <p className="text-lg text-primary-foreground/75 max-w-xl mx-auto">
            A curated bookstore for curious minds — browse, buy, and read
            online all in one place.
          </p>
        </div>
      </section>

      {/* ── Book Grid ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-baseline justify-between mb-8 gap-4 flex-wrap">
          <h2 className="font-heading text-3xl font-semibold text-foreground">
            Our Collection
          </h2>
          <p className="text-sm text-muted-foreground">
            {books.length} book{books.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg">No books yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                slug={book.slug}
                title={book.title}
                author={book.author}
                description={book.description}
                price={Number(book.price)}
                coverImage={book.coverImage}
                pdfUrl={book.pdfUrl}
                stock={book.stock}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
