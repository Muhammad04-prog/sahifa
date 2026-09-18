import Link from "next/link";

export default function AdminBooksPage() {
  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-semibold">Books</h1>
        <Link
          href="/admin/books/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          + Add Book
        </Link>
      </div>
      <p className="text-muted-foreground">No books yet. Add your first book.</p>
    </main>
  );
}
