import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth-guard";
import { z } from "zod";

interface Params {
  params: Promise<{ id: string }>;
}

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const patchSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

// PATCH — update order status (admin only)
export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            book: { select: { title: true, coverImage: true } },
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[API /orders/:id PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET — fetch single order (admin only)
export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            book: { select: { title: true, coverImage: true, slug: true } },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[API /orders/:id GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
