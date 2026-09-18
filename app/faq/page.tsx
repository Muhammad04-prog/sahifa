import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, BookOpen, ShoppingBag, UserCheck, ShieldCheck, Moon } from "lucide-react";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ)",
  description: "Find answers to common questions about browsing, purchasing, online reading, and accounts on Sahifa.",
};

const faqs = [
  {
    icon: BookOpen,
    question: "How do I browse and search for books on Sahifa?",
    answer:
      "You can explore our entire catalog using the 'Browse' page link in the header. Use the search bar to filter by title, author, or keyword, and use the filter dropdown to view books available for online reading or physical purchase.",
  },
  {
    icon: UserCheck,
    question: "Do I need an account to add books to my cart or read online?",
    answer:
      "Yes. To ensure your saved items, reading history, and purchases stay linked to your personal library, you must log in or register before adding books to your cart. You can quickly register with your email or sign in with Google.",
  },
  {
    icon: BookOpen,
    question: "How does the Online PDF Reader work?",
    answer:
      "Books tagged with 'Read online' include a digital version. After purchase or for free reading samples, clicking 'Read Online' opens our built-in web reader with page navigation, zoom options, and fullscreen mode.",
  },
  {
    icon: ShoppingBag,
    question: "How are prices displayed and what currency is used?",
    answer:
      "All book prices across Sahifa are listed in Tajik Somoni (ТJS) with standard formatting (e.g. 44,00 ТJS). Prices displayed in your cart and during checkout accurately reflect the total in TJS.",
  },
  {
    icon: ShieldCheck,
    question: "How does checkout and order processing work?",
    answer:
      "When you proceed to checkout, enter your delivery address and contact information. Once submitted, your order status is set to 'CONFIRMED' and our team prepares your physical book shipment.",
  },
  {
    icon: ShoppingBag,
    question: "How can I view my past order history?",
    answer:
      "Log into your account and navigate to 'Profile' from the top right avatar menu. Your profile page displays your complete order history, including item details, total price in TJS, order dates, and current delivery status.",
  },
  {
    icon: Moon,
    question: "How do I switch between Light and Dark modes?",
    answer:
      "Visit the 'Settings' page from your user menu. Under Appearance, you can choose between 'Warm Light' (warm parchment style), 'Ink Dark' (deep night style), or synchronize with your device's system preference.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Everything you need to know about purchasing, reading, and managing your account on Sahifa.
          </p>
        </div>

        {/* Q&A List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 card-shadow hover:card-shadow-hover transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-md bg-accent text-accent-foreground shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 text-center bg-accent/40 border border-accent rounded-lg p-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">
            Still have questions?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Explore our collection or check out your account profile to learn more.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/browse"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Browse Books
            </Link>
            <Link
              href="/profile"
              className="px-5 py-2.5 border border-border bg-card text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
