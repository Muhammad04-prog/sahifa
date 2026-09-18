import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Reading: ${slug.replace(/-/g, " ")}`,
    robots: "noindex", // Prevent indexing of reader pages
  };
}

export default async function ReadPage({ params }: Props) {
  const { slug } = await params;

  // TODO: fetch book pdfUrl from DB and validate user has purchased it
  // const book = await prisma.book.findUnique({ where: { slug } });
  // if (!book || !book.pdfUrl) notFound();

  return (
    <main className="h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <h1 className="font-heading font-semibold text-lg truncate">
          Reading: {slug.replace(/-/g, " ")}
        </h1>
        <a
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to store
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            PDF reader will embed here once a{" "}
            <code className="font-mono bg-muted-foreground/10 px-1 rounded">pdfUrl</code>{" "}
            is available.
          </p>
        </div>
        {/* TODO: Replace with an <iframe src={book.pdfUrl} /> or a PDF.js viewer */}
      </div>
    </main>
  );
}
