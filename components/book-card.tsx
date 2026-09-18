import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, BookOpen } from "lucide-react";
import { cn, formatPrice, truncate } from "@/lib/utils";

export interface BookCardProps {
  id: string;
  slug: string;
  title: string;
  author: string;
  description?: string | null;
  price: number;
  coverImage?: string | null;
  stock: number;
  className?: string;
}

export default function BookCard({
  slug,
  title,
  author,
  description,
  price,
  coverImage,
  stock,
  className,
}: BookCardProps) {
  const outOfStock = stock === 0;

  return (
    <article
      className={cn(
        "group flex flex-col bg-card border border-border rounded-md overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-200",
        className
      )}
    >
      {/* Cover image */}
      <Link href={`/book/${slug}`} className="block relative aspect-[3/4] bg-muted overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={`Cover of ${title}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-accent/30 text-accent-foreground">
            <BookOpen className="w-12 h-12 opacity-40 mb-2" />
            <span className="text-xs text-muted-foreground text-center px-4">{title}</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute top-2 right-2 bg-destructive text-white text-xs font-medium px-2 py-0.5 rounded">
            Out of Stock
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link href={`/book/${slug}`} className="hover:text-primary transition-colors">
          <h3 className="font-heading font-semibold text-base leading-snug line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">{author}</p>

        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {truncate(description, 100)}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-semibold text-primary">
            {formatPrice(price)}
          </span>
          <button
            disabled={outOfStock}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
