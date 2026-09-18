import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ShoppingBag, User as UserIcon, Calendar, Mail, ShieldCheck, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your Sahifa account details and order history.",
};

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  DELIVERED: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  CANCELLED: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile&message=Please log in to view your profile.");
  }

  const userId = (session.user as any).id;

  // Fetch user details and order history
  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            book: {
              select: { title: true, slug: true, coverImage: true, pdfUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">My Account</h1>

      <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* User Card */}
        <div className="bg-card border border-border rounded-lg p-6 card-shadow space-y-4 sticky top-20">
          <div className="flex flex-col items-center text-center pb-4 border-b border-border">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground font-heading text-2xl font-bold flex items-center justify-center mb-3 shadow-md">
              {initials}
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              {user?.name || "Member"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent text-accent-foreground uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              {user?.role || "CUSTOMER"}
            </span>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-primary" />
              <span>Account: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="truncate">{user?.email}</span>
            </div>
            {user?.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <Link
              href="/settings"
              className="block w-full text-center py-2 px-4 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Account Settings
            </Link>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Order History
            </h2>
            <span className="text-sm text-muted-foreground">
              {orders.length} {orders.length === 1 ? "order" : "orders"} total
            </span>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg p-5 card-shadow space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground block">
                        Order #{order.id.slice(-8)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          statusColors[order.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-heading font-bold text-base text-primary">
                        {formatPrice(Number(order.total))} TJS
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <ul className="divide-y divide-border/60">
                    {order.items.map((item) => (
                      <li key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <Link
                              href={`/book/${item.book.slug}`}
                              className="font-medium text-sm text-foreground hover:text-primary transition-colors truncate block"
                            >
                              {item.book.title}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × {formatPrice(Number(item.price))} TJS
                            </span>
                          </div>
                        </div>

                        {item.book.pdfUrl && (
                          <Link
                            href={`/read/${item.book.slug}`}
                            className="text-xs font-medium text-primary hover:underline shrink-0"
                          >
                            Read PDF →
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-lg p-8">
              <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-30 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                No orders yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                You haven&apos;t placed any book orders on Sahifa yet.
              </p>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Browse Collection
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
