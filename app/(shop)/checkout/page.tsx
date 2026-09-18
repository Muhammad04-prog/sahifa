"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { useCartStore } from "@/lib/store/cart";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutInput) => {
    // TODO: POST to /api/orders
    console.log("Order data:", data, items);
    clearCart();
    alert("Order placed! (API integration coming soon)");
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-heading font-semibold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {[
          { label: "Full Name", field: "name" as const, type: "text" },
          { label: "Email Address", field: "email" as const, type: "email" },
          { label: "Address", field: "address" as const, type: "text" },
          { label: "City", field: "city" as const, type: "text" },
          { label: "Postal Code", field: "postalCode" as const, type: "text" },
          { label: "Country", field: "country" as const, type: "text" },
        ].map(({ label, field, type }) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium mb-1.5 text-foreground"
            >
              {label}
            </label>
            <input
              id={field}
              type={type}
              {...register(field)}
              className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={label}
            />
            {errors[field] && (
              <p className="mt-1 text-sm text-destructive">
                {errors[field]?.message}
              </p>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-border flex justify-between items-center">
          <p className="font-semibold text-lg">
            Total: ${totalPrice().toFixed(2)}
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </form>
    </main>
  );
}
