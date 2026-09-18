import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        author: true,
        description: true,
        price: true,
        coverImage: true,
        stock: true,
      },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error("[API /books GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
