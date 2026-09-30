"use client";

import { useState, useEffect, useCallback } from "react";
import { formatPrice } from "@/lib/utils";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  book: { title: string; coverImage: string | null };
}

interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  user: { name: string | null; email: string | null };
  items: OrderItem[];
}

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

function StatusSelect({
  orderId,
  current,
  onChange,
}: {
  orderId: string;
  current: OrderStatus;
  onChange: (id: string, status: OrderStatus) => void;
}) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onChange(orderId, newStatus);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex items-center gap-1.5">
      {saving && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground shrink-0" />}
      <select
        value={current}
        onChange={handleChange}
        disabled={saving}
        className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 ${STATUS_COLORS[current]}`}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} className="bg-background text-foreground">
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}

function OrderRow({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-4 py-3">
          <p className="font-medium text-foreground">{order.user.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{order.user.email}</p>
        </td>
        <td className="px-4 py-3 text-muted-foreground text-xs">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </td>
        <td className="px-4 py-3 font-semibold text-primary">
          {formatPrice(Number(order.total))} TJS
        </td>
        <td
          className="px-4 py-3"
          onClick={(e) => e.stopPropagation()} // don't toggle row when clicking select
        >
          <StatusSelect
            orderId={order.id}
            current={order.status}
            onChange={onStatusChange}
          />
        </td>
        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(order.createdAt))}
        </td>
        <td className="px-4 py-3 text-muted-foreground">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </td>
      </tr>

      {expanded && (
        <tr className="bg-muted/20">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Order Details — <span className="font-mono text-foreground/70">{order.id}</span>
              </p>

              {/* Customer info */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Customer</p>
                  <p className="font-medium">{order.user.name ?? "—"}</p>
                  <p className="text-muted-foreground text-xs">{order.user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Order Total</p>
                  <p className="font-semibold text-primary text-lg">
                    {formatPrice(Number(order.total))} TJS
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      {["Book", "Qty", "Unit Price", "Subtotal"].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {order.items.map((item) => (
                      <tr key={item.id} className="bg-card">
                        <td className="px-3 py-2 flex items-center gap-2">
                          {item.book.coverImage && (
                            <img
                              src={item.book.coverImage}
                              alt={item.book.title}
                              className="w-8 h-10 object-cover rounded shrink-0"
                            />
                          )}
                          <span className="font-medium text-foreground">{item.book.title}</span>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{item.quantity}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {formatPrice(Number(item.price))} TJS
                        </td>
                        <td className="px-3 py-2 font-medium text-foreground">
                          {formatPrice(Number(item.price) * item.quantity)} TJS
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  return (
    <main className="p-6 sm:p-8 max-w-6xl mx-auto">
      <h1 className="font-heading text-3xl font-semibold mb-8">Orders</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No orders yet.</p>
      ) : (
        <div className="bg-card border border-border rounded-md overflow-hidden card-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {["Customer", "Items", "Total", "Status", "Date", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
