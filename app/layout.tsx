import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: {
    default: "Sahifa — Your Online Bookstore",
    template: "%s | Sahifa",
  },
  description:
    "Discover, buy, and read books online. Sahifa is your premium digital bookstore for Arabic and international titles.",
  keywords: ["bookstore", "books", "online reading", "e-books", "sahifa"],
  openGraph: {
    title: "Sahifa — Your Online Bookstore",
    description: "Discover, buy, and read books online.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
