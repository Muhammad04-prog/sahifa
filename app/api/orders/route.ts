import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { book: { select: { title: true } } } },
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
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // TODO: validate cart items against DB stock, create real order
    return NextResponse.json({ message: "Order endpoint ready" }, { status: 201 });
  } catch (error) {
    console.error("[API /orders POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
