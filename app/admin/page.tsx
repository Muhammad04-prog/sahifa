import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-heading font-semibold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Books", value: "—", href: "/admin/books" },
          { label: "Total Orders", value: "—", href: "/admin/orders" },
          { label: "Total Revenue", value: "—", href: "/admin/orders" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-6 bg-card border border-border rounded-md card-shadow hover:card-shadow-hover transition-shadow group"
          >
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-3xl font-heading font-semibold group-hover:text-primary transition-colors">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
