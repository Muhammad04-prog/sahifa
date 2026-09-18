"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCartStore();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <ShoppingBag className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="font-heading text-3xl font-semibold mb-3">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven&apos;t added any books yet.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity"
        >
          Browse Books
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Item list */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-card rounded-md border border-border card-shadow"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold font-heading truncate">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.author}</p>
                <p className="text-sm font-semibold text-primary mt-1">
                  {formatPrice(item.price)} TJS
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Line total */}
              <p className="w-24 text-right font-semibold shrink-0">
                {formatPrice(item.price * item.quantity)} TJS
              </p>

              <button
                onClick={() => removeItem(item.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                aria-label={`Remove ${item.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-card border border-border rounded-md p-5 card-shadow sticky top-20">
          <h2 className="font-heading text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="text-foreground font-medium">
                {formatPrice(totalPrice())} TJS
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-foreground font-medium">Free</span>
            </div>
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-semibold text-base mb-5">
            <span>Total</span>
            <span className="text-primary font-heading text-lg">
              {formatPrice(totalPrice())} TJS
            </span>
          </div>
          <Link
            href="/checkout"
            className="block w-full py-3 text-center bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/"
            className="block w-full py-2.5 text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
