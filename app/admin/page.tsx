import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { BookOpen, ShoppingBag, TrendingUp, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [bookCount, orderCount, totalRevenue, userCount] = await Promise.all([
    prisma.book.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.user.count(),
  ]);

  const revenue = Number(totalRevenue._sum.total ?? 0);

  const stats = [
    {
      label: "Total Books",
      value: bookCount,
      icon: BookOpen,
      href: "/admin/books",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Orders",
      value: orderCount,
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Revenue",
      value: `${formatPrice(revenue)} TJS`,
      icon: TrendingUp,
      href: "/admin/orders",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Users",
      value: userCount,
      icon: Users,
      href: "/admin",
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
  ];

  return (
    <main className="p-6 sm:p-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-3xl font-semibold mb-8 text-foreground">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group p-5 bg-card border border-border rounded-md card-shadow hover:card-shadow-hover transition-shadow"
          >
            <div className={`inline-flex p-2 rounded-md ${s.bg} mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {s.label}
            </p>
            <p className="font-heading text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link
          href="/admin/books"
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity text-sm"
        >
          Manage Books →
        </Link>
        <Link
          href="/admin/orders"
          className="px-5 py-2.5 border border-border rounded-md font-medium hover:bg-muted transition-colors text-sm"
        >
          View Orders →
        </Link>
      </div>
    </main>
  );
}
