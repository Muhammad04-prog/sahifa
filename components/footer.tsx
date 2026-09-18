import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-card border-t border-border py-12 text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <BookOpen className="w-5 h-5" />
            Sahifa
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Sahifa is a modern online bookstore built for book lovers. Discover physical paperbacks, enjoy digital PDF reading, and manage your library with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground">
            Explore
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/browse" className="text-muted-foreground hover:text-primary transition-colors">
                Browse Books
              </Link>
            </li>
            <li>
              <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                Shopping Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Account */}
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-foreground">
            Support & Account
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                Frequently Asked Questions (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                My Profile
              </Link>
            </li>
            <li>
              <Link href="/settings" className="text-muted-foreground hover:text-primary transition-colors">
                Account Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
        <p>© {new Date().getFullYear()} Sahifa Bookstore. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-secondary fill-secondary" /> for readers everywhere.
        </p>
      </div>
    </footer>
  );
}
