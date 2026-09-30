import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "./add-to-cart-button";
import { BookOpen, Download, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await prisma.book.findUnique({
    where: { slug },
    select: { title: true, author: true, description: true },
  });
  if (!book) return { title: "Book not found" };
  return {
    title: book.title,
    description: book.description ?? `${book.title} by ${book.author}`,
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;

  const book = await prisma.book.findUnique({
    where: { slug, published: true },
  });

  if (!book) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-heading text-3xl font-semibold mb-3">Book not found</h1>
        <p className="text-muted-foreground mb-8">
          This book doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity"
        >
          ← Back to store
        </Link>
      </main>
    );
  }

  // Check server-side if user is logged in and has purchased this book
  const session = await getServerSession(authOptions);
  let hasPurchased = false;

  if (session?.user) {
    const userId = (session.user as any).id;
    if (userId) {
      const purchase = await prisma.orderItem.findFirst({
        where: {
          bookId: book.id,
          order: {
            userId: userId,
            status: { not: "CANCELLED" },
          },
        },
      });
      hasPurchased = !!purchase;
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted-foreground flex items-center gap-2">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-xs">{book.title}</span>
      </nav>

      <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-10 items-start">
        {/* ── Cover ────────────────────────────────────── */}
        <div className="md:sticky md:top-24">
          <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-muted card-shadow">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 320px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
                <span className="text-muted-foreground font-heading text-xl opacity-40">
                  No Cover
                </span>
              </div>
            )}
          </div>

          {/* Stock badge */}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {book.stock > 0 ? (
              <span className="text-primary font-medium">✓ In stock ({book.stock} left)</span>
            ) : (
              <span className="text-destructive font-medium">Out of stock</span>
            )}
          </p>
        </div>

        {/* ── Details ───────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-heading text-4xl font-semibold leading-tight text-foreground mb-2">
              {book.title}
            </h1>
            <p className="text-lg text-muted-foreground">by {book.author}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-semibold text-primary">
              {formatPrice(Number(book.price))}
            </span>
            <span className="text-sm text-muted-foreground">TJS</span>
          </div>

          {book.description && (
            <div className="bg-card border border-border rounded-md p-5 card-shadow">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                About this book
              </h2>
              <p className="text-foreground/80 leading-relaxed text-sm">
                {book.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <AddToCartButton
              book={{
                id: book.id,
                slug: book.slug,
                title: book.title,
                author: book.author,
                price: Number(book.price),
                coverImage: book.coverImage,
              }}
              outOfStock={book.stock === 0}
            />
          </div>

          {/* PDF Format & Download Access */}
          {book.pdfUrl && (
            <div className="border-t border-border pt-4 mt-2 space-y-3">
              <h2 className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Digital Edition Access
              </h2>
              <div className="flex flex-wrap gap-3">
                {/* Read online button - always visible/clickable */}
                <Link
                  href={`/read/${book.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary text-primary hover:bg-primary/10 rounded-md font-semibold text-sm transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Online
                </Link>

                {/* Download PDF button/section based on access */}
                {!session?.user ? (
                  <Link
                    href={`/login?callbackUrl=${encodeURIComponent(`/book/${book.slug}`)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md font-medium text-sm transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Log in to check download access
                  </Link>
                ) : hasPurchased ? (
                  <a
                    href={book.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-md font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-muted text-muted-foreground rounded-md font-medium text-sm border border-border cursor-not-allowed opacity-75">
                    <Lock className="w-4 h-4 text-muted-foreground/70" />
                    Purchase to download PDF
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {hasPurchased
                  ? "✓ You have purchased this book. PDF download is enabled."
                  : "Purchase this book to unlock direct PDF downloading."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
