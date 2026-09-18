import { prisma } from "@/lib/prisma";
import BookCard from "@/components/book-card";
import BrowseFilters from "./browse-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Books",
  description: "Explore our complete collection of books, search by author or title, and filter by price.",
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    filter?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: Props) {
  const { q, sort, filter } = await searchParams;

  // Build Prisma query
  const where: any = { published: true };

  if (q && q.trim()) {
    where.OR = [
      { title: { contains: q.trim(), mode: "insensitive" } },
      { author: { contains: q.trim(), mode: "insensitive" } },
      { description: { contains: q.trim(), mode: "insensitive" } },
    ];
  }

  if (filter === "readable") {
    where.pdfUrl = { not: null };
  } else if (filter === "purchasable") {
    where.stock = { gt: 0 };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "title-asc") orderBy = { title: "asc" };

  const books = await prisma.book.findMany({
    where,
    orderBy,
  });

  const formattedBooks = books.map((b) => ({
    ...b,
    price: Number(b.price),
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Browse Collection
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Explore all available titles, filter by format, search, or sort by price.
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <BrowseFilters initialQuery={q || ""} initialSort={sort || "newest"} initialFilter={filter || "all"} />

      {/* Books Grid */}
      {formattedBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-8">
          {formattedBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border rounded-lg mt-8 p-8">
          <p className="font-heading text-xl text-foreground mb-2">No books found</p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            We couldn&apos;t find any books matching your search or filters. Try adjusting your query or resetting filters.
          </p>
        </div>
      )}
    </main>
  );
}
