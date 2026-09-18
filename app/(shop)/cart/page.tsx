"use client";

import { useCartStore } from "@/lib/store/cart";

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCartStore();

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-heading font-semibold mb-4">Your Cart</h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-heading font-semibold mb-8">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-card rounded-md border border-border card-shadow"
          >
            <div className="flex-1">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.author}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-destructive hover:opacity-70 transition-opacity text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <div className="text-right space-y-2">
          <p className="text-lg font-semibold">
            Total: ${totalPrice().toFixed(2)}
          </p>
          <a
            href="/checkout"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity"
          >
            Proceed to Checkout
          </a>
        </div>
      </div>
    </main>
  );
}
