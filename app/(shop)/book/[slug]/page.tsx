import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " "),
  };
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;

  // TODO: fetch book from DB using slug
  // const book = await prisma.book.findUnique({ where: { slug } });
  // if (!book) notFound();

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-heading font-semibold mb-4">Book: {slug}</h1>
      <p className="text-muted-foreground">Book details will appear here.</p>
    </main>
  );
}
