import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await prisma.book.findUnique({
    where: { slug },
    select: { title: true },
  });
  return {
    title: book ? `Reading: ${book.title}` : `Reading: ${slug.replace(/-/g, " ")}`,
    robots: "noindex", // Prevent indexing of reader pages
  };
}

export default async function ReadPage({ params }: Props) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);

  // Requirement: If user is NOT logged in, redirect to /login (return here after login)
  if (!session?.user) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/read/${slug}`)}&message=${encodeURIComponent("Please log in to read this book online.")}`
    );
  }

  const book = await prisma.book.findUnique({
    where: { slug },
  });

  // Requirement: if the book has no pdfUrl, show "not available" message
  if (!book || !book.pdfUrl) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full card-shadow flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl font-semibold text-foreground mb-2">
            PDF Not Available
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {book
              ? `An online PDF version of "${book.title}" is not available yet.`
              : "This book could not be found."}
          </p>
          <Link
            href={book ? `/book/${book.slug}` : "/"}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            {book ? "Back to Book Details" : "Back to Store"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shadow-sm shrink-0">
        <div className="flex items-center gap-3 truncate">
          <Link
            href={`/book/${book.slug}`}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Back to book detail"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 truncate">
            <BookOpen className="w-4 h-4 text-primary shrink-0" />
            <h1 className="font-heading font-semibold text-base text-foreground truncate">
              {book.title}
            </h1>
            <span className="text-xs text-muted-foreground truncate hidden sm:inline">
              by {book.author}
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          Store Home →
        </Link>
      </header>

      {/* Embedded PDF Viewer */}
      <div className="flex-1 relative bg-neutral-950/90 w-full h-full">
        <iframe
          src={book.pdfUrl}
          title={`PDF Reader - ${book.title}`}
          className="w-full h-full border-0"
        />
      </div>
    </main>
  );
}
