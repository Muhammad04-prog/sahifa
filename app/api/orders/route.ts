import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { book: { select: { title: true, coverImage: true, slug: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("[API /orders GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { name, email, items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Find or obtain user ID
    let userId = (session?.user as any)?.id;

    if (!userId && email) {
      const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (existing) {
        userId = existing.id;
      } else {
        const newUser = await prisma.user.create({
          data: { email: email.toLowerCase(), name: name || "Customer" },
        });
        userId = newUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "User authentication or email required" }, { status: 400 });
    }

    // Calculate total price
    const total = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        status: "CONFIRMED",
        total,
        items: {
          create: items.map((item: any) => ({
            bookId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("[API /orders POST]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
