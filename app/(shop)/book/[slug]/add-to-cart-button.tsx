"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  book: {
    id: string;
    slug: string;
    title: string;
    author: string;
    price: number;
    coverImage: string | null;
  };
  outOfStock: boolean;
}

export default function AddToCartButton({ book, outOfStock }: Props) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleClick = () => {
    if (status !== "authenticated") {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(pathname)}&message=${encodeURIComponent(
          "Please log in to add books to your cart."
        )}`
      );
      return;
    }
    addItem(book);
    openCart();
  };

  return (
    <button
      onClick={handleClick}
      disabled={outOfStock}
      className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="w-4 h-4" />
      {outOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
