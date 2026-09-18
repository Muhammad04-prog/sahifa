"use client";

import Link from "next/link";
import { ShoppingCart, BookOpen, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Browse" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-semibold text-primary hover:opacity-80 transition-opacity shrink-0"
        >
          <BookOpen className="w-5 h-5" aria-hidden />
          Sahifa
        </Link>

        {/* Search bar — desktop */}
        <div className="hidden md:flex flex-1 max-w-md items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background/60 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 transition-all">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden />
          <input
            id="search-input"
            type="search"
            placeholder="Search books, authors…"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
            aria-label="Search books"
          />
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-5 shrink-0">
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
        <div className="flex items-center gap-2 ml-auto md:ml-0 shrink-0">
          {/* Cart */}
          <button
            id="cart-button"
            onClick={toggleCart}
            aria-label={`Open cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            className="relative p-2 rounded-md hover:bg-muted transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile expanded menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-200 border-t border-border",
          mobileOpen ? "max-h-56" : "max-h-0 border-t-0"
        )}
      >
        {/* Mobile search */}
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background/60">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden />
            <input
              type="search"
              placeholder="Search books, authors…"
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              aria-label="Search books (mobile)"
            />
          </div>
        </div>
        <nav className="flex flex-col px-4 py-3 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-2 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
