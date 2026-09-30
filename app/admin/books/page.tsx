"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookSchema, type CreateBookInput } from "@/lib/validations";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  published: boolean;
  coverImage: string | null;
  pdfUrl: string | null;
  description: string | null;
}

function BookFormDialog({
  book,
  onClose,
  onSaved,
}: {
  book?: Book;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [coverMode, setCoverMode] = useState<"file" | "url">("file");
  const [pdfMode, setPdfMode] = useState<"file" | "url">("file");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
    defaultValues: book
      ? {
          title: book.title,
          author: book.author,
          description: book.description ?? "",
          price: Number(book.price),
          coverImage: book.coverImage ?? "",
          pdfUrl: book.pdfUrl ?? "",
          stock: book.stock,
          published: book.published,
        }
      : { published: false, stock: 0, coverImage: "", pdfUrl: "" },
  });

  const coverUrl = watch("coverImage");
  const pdfUrl = watch("pdfUrl");

  const handleFileUpload = async (
    file: File,
    field: "coverImage" | "pdfUrl",
    setUploading: (loading: boolean) => void
  ) => {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file");
      }
      setValue(field, data.url, { shouldValidate: true });
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: CreateBookInput) => {
    const url = book ? `/api/admin/books/${book.id}` : "/api/admin/books";
    const method = book ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json();
      setUploadError(errData.error || "Failed to save book");
      return;
    }
    onSaved();
    onClose();
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 rounded-md border text-sm bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
      hasError ? "border-destructive" : "border-input hover:border-ring/50"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto card-shadow">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-heading text-lg font-semibold">
            {book ? "Edit Book" : "Add New Book"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {uploadError && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded-md">
              {uploadError}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground uppercase tracking-wide">
              Title<span className="text-destructive ml-0.5">*</span>
            </label>
            <input
              {...register("title")}
              className={inputClass(!!errors.title)}
              placeholder="Book Title"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground uppercase tracking-wide">
              Author<span className="text-destructive ml-0.5">*</span>
            </label>
            <input
              {...register("author")}
              className={inputClass(!!errors.author)}
              placeholder="Author Name"
            />
            {errors.author && (
              <p className="mt-1 text-xs text-destructive">{errors.author.message}</p>
            )}
          </div>

          {/* Cover Image Upload / URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Cover Image (JPG/PNG)
              </label>
              <button
                type="button"
                onClick={() => setCoverMode(coverMode === "file" ? "url" : "file")}
                className="text-xs text-primary hover:underline"
              >
                {coverMode === "file" ? "or paste a URL instead" : "or upload a file instead"}
              </button>
            </div>
            {coverMode === "file" ? (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleFileUpload(e.target.files[0], "coverImage", setUploadingCover)
                  }
                  disabled={uploadingCover}
                  className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {uploadingCover && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    Uploading cover image...
                  </div>
                )}
                {coverUrl && !uploadingCover && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded border text-xs">
                    <span className="truncate max-w-[280px] text-foreground">{coverUrl}</span>
                    <button
                      type="button"
                      onClick={() => setValue("coverImage", "")}
                      className="text-destructive hover:underline ml-2 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                {...register("coverImage")}
                className={inputClass(!!errors.coverImage)}
                placeholder="https://example.com/cover.jpg"
              />
            )}
            {errors.coverImage && (
              <p className="mt-1 text-xs text-destructive">{errors.coverImage.message}</p>
            )}
          </div>

          {/* PDF File Upload / URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                PDF Book File (optional)
              </label>
              <button
                type="button"
                onClick={() => setPdfMode(pdfMode === "file" ? "url" : "file")}
                className="text-xs text-primary hover:underline"
              >
                {pdfMode === "file" ? "or paste a URL instead" : "or upload a file instead"}
              </button>
            </div>
            {pdfMode === "file" ? (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleFileUpload(e.target.files[0], "pdfUrl", setUploadingPdf)
                  }
                  disabled={uploadingPdf}
                  className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {uploadingPdf && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    Uploading PDF file...
                  </div>
                )}
                {pdfUrl && !uploadingPdf && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded border text-xs">
                    <span className="truncate max-w-[280px] text-foreground">{pdfUrl}</span>
                    <button
                      type="button"
                      onClick={() => setValue("pdfUrl", "")}
                      className="text-destructive hover:underline ml-2 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                {...register("pdfUrl")}
                className={inputClass(!!errors.pdfUrl)}
                placeholder="https://example.com/book.pdf"
              />
            )}
            {errors.pdfUrl && (
              <p className="mt-1 text-xs text-destructive">{errors.pdfUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground uppercase tracking-wide">
              Description<span className="text-destructive ml-0.5">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className={`${inputClass(!!errors.description)} resize-none`}
              placeholder="Short book description…"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground uppercase tracking-wide">
                Price (TJS)<span className="text-destructive ml-0.5">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("price")}
                className={inputClass(!!errors.price)}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-muted-foreground uppercase tracking-wide">
                Stock<span className="text-destructive ml-0.5">*</span>
              </label>
              <input
                type="number"
                min="0"
                {...register("stock")}
                className={inputClass(!!errors.stock)}
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-xs text-destructive">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("published")}
              className="w-4 h-4 rounded border-input accent-primary"
            />
            <span className="text-sm text-foreground">Published (visible on store)</span>
          </label>

          <div className="flex gap-3 pt-2 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting || uploadingCover || uploadingPdf}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-md font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {book ? "Save Changes" : "Add Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-border rounded-md text-sm hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogBook, setDialogBook] = useState<Book | "new" | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/books");
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
    fetchBooks();
  };

  return (
    <main className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4">
        <h1 className="font-heading text-3xl font-semibold">Books</h1>
        <button
          onClick={() => setDialogBook("new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : books.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No books yet.</p>
      ) : (
        <div className="bg-card border border-border rounded-md overflow-hidden card-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {["Title", "Author", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">
                      {book.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{book.author}</td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {formatPrice(book.price)} TJS
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{book.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        book.published
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {book.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDialogBook(book)}
                          className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id, book.title)}
                          className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors text-muted-foreground hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {dialogBook && (
        <BookFormDialog
          book={dialogBook === "new" ? undefined : dialogBook}
          onClose={() => setDialogBook(null)}
          onSaved={fetchBooks}
        />
      )}
    </main>
  );
}
