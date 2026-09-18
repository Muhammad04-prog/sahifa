"use client";

import { X, ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <aside
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-card border-l border-border flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 font-heading text-lg font-semibold">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Cart
            {totalItems() > 0 && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                ({totalItems()} {totalItems() === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p className="text-sm">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="text-sm text-primary hover:underline"
              >
                Browse books →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-background rounded-md p-3 border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.author}</p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.title}`}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-lg">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3 text-center bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full py-2.5 text-center border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
