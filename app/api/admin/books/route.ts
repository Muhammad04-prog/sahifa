import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBookSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

// GET all books (admin — includes unpublished)
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error("[ADMIN /books GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create new book
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createBookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { coverImage, pdfUrl, ...rest } = parsed.data;

    // Auto-generate slug from title
    let slug = slugify(rest.title);
    // Ensure uniqueness
    const existing = await prisma.book.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const book = await prisma.book.create({
      data: {
        ...rest,
        slug,
        coverImage: coverImage || null,
        pdfUrl: pdfUrl || null,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("[ADMIN /books POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
