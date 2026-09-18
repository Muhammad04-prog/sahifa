"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, BookOpen, Eye } from "lucide-react";
import { cn, formatPrice, truncate } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";

export interface BookCardProps {
  id: string;
  slug: string;
  title: string;
  author: string;
  description?: string | null;
  price: number;
  coverImage?: string | null;
  pdfUrl?: string | null;
  stock: number;
  className?: string;
}

export default function BookCard({
  id,
  slug,
  title,
  author,
  description,
  price,
  coverImage,
  pdfUrl,
  stock,
  className,
}: BookCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const outOfStock = stock === 0;

  const handleAddToCart = () => {
    addItem({ id, slug, title, author, price, coverImage: coverImage ?? null });
    openCart();
  };

  return (
    <article
      className={cn(
        "group flex flex-col bg-card border border-border rounded-md overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-200",
        className
      )}
    >
      {/* ── Cover ─────────────────────────────────────────── */}
      <Link
        href={`/book/${slug}`}
        className="block relative aspect-[3/4] bg-muted overflow-hidden flex-shrink-0"
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`Cover of ${title}`}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-accent/30 text-accent-foreground gap-2">
            <BookOpen className="w-10 h-10 opacity-30" />
            <span className="text-xs text-muted-foreground text-center px-3 leading-snug line-clamp-2">
              {title}
            </span>
          </div>
        )}

        {/* "Read online" badge */}
        {pdfUrl && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/90 text-primary-foreground text-[10px] font-semibold rounded uppercase tracking-wide backdrop-blur-sm">
              <Eye className="w-2.5 h-2.5" />
              Read online
            </span>
          </div>
        )}

        {/* Out of stock */}
        {outOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="px-3 py-1 bg-destructive text-white text-xs font-semibold rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* ── Info ──────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <Link href={`/book/${slug}`} className="block hover:text-primary transition-colors">
          <h3 className="font-heading font-semibold text-sm leading-snug line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground">{author}</p>

        {description && (
          <p className="text-xs text-muted-foreground/80 line-clamp-2 hidden sm:block">
            {truncate(description, 80)}
          </p>
        )}

        {/* ── Price + Actions ──────────────────────────────── */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-base font-semibold text-primary font-heading">
            {formatPrice(price)} <span className="text-xs font-normal text-muted-foreground">TJS</span>
          </span>

          <div className="flex items-center gap-1.5">
            {pdfUrl && (
              <Link
                href={`/read/${slug}`}
                className="flex items-center gap-1 px-2 py-1 border border-primary/30 text-primary rounded text-xs font-medium hover:bg-primary/10 transition-colors"
                title="Read online"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">Read</span>
              </Link>
            )}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={`Add ${title} to cart`}
            >
              <ShoppingCart className="w-3 h-3" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
