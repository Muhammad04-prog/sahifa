"use client";

import Link from "next/link";
import { ShoppingCart, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          <BookOpen className="w-6 h-6" aria-hidden />
          Sahifa
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            id="cart-button"
            onClick={toggleCart}
            aria-label={`Open cart — ${totalItems} items`}
            className="relative p-2 rounded-md hover:bg-muted transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-200",
          mobileOpen ? "max-h-48 border-t border-border" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-6 py-4 gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
