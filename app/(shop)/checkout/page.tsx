"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

const fields = [
  { label: "Full Name", field: "name" as const, type: "text", placeholder: "Rustam Nazarov" },
  { label: "Email Address", field: "email" as const, type: "email", placeholder: "rustam@example.com" },
  { label: "Address", field: "address" as const, type: "text", placeholder: "123 Rudaki Ave" },
  { label: "City", field: "city" as const, type: "text", placeholder: "Dushanbe" },
  { label: "Postal Code", field: "postalCode" as const, type: "text", placeholder: "734000" },
  { label: "Country", field: "country" as const, type: "text", placeholder: "Tajikistan" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutInput) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, items }),
      });
      if (res.ok) {
        clearCart();
        router.push("/?ordered=1");
      }
    } catch {
      // graceful fallback — still clear cart locally
      clearCart();
      router.push("/?ordered=1");
    }
  };

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-heading text-3xl font-semibold mb-3">Nothing to checkout</h1>
        <p className="text-muted-foreground mb-6">Your cart is empty.</p>
        <a href="/" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity">
          Browse Books
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-heading text-4xl font-semibold mb-10 text-foreground">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
        {/* ── Form ──────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div className="bg-card border border-border rounded-md p-6 card-shadow space-y-5">
            <h2 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-3">
              Delivery Details
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              {fields.map(({ label, field, type, placeholder }) => (
                <div key={field} className={field === "address" ? "sm:col-span-2" : ""}>
                  <label
                    htmlFor={`field-${field}`}
                    className="block text-sm font-medium mb-1.5 text-foreground"
                  >
                    {label}
                    <span className="text-destructive ml-0.5">*</span>
                  </label>
                  <input
                    id={`field-${field}`}
                    type={type}
                    {...register(field)}
                    placeholder={placeholder}
                    className={`w-full px-3.5 py-2.5 rounded-md border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                      errors[field]
                        ? "border-destructive ring-2 ring-destructive/20"
                        : "border-input hover:border-ring/50"
                    }`}
                  />
                  {errors[field] && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                      <span>⚠</span>
                      {errors[field]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-md font-semibold text-base hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-heading tracking-wide"
          >
            {isSubmitting ? "Placing Order…" : "Place Order"}
          </button>
        </form>

        {/* ── Order Summary ──────────────────────────────────── */}
        <div className="bg-card border border-border rounded-md p-5 card-shadow sticky top-20 space-y-4">
          <h2 className="font-heading text-lg font-semibold border-b border-border pb-3">
            Order Summary
          </h2>

          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <span className="text-foreground line-clamp-2 flex-1">
                  {item.title}
                  {item.quantity > 1 && (
                    <span className="text-muted-foreground"> ×{item.quantity}</span>
                  )}
                </span>
                <span className="font-medium shrink-0">
                  {formatPrice(item.price * item.quantity)} TJS
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice())} TJS</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>

          <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
            <span>Total</span>
            <span className="text-primary font-heading text-lg">
              {formatPrice(totalPrice())} TJS
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
