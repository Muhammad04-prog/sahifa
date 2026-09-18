import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateBookSchema } from "@/lib/validations";

interface Params {
  params: Promise<{ id: string }>;
}

// PATCH — update book
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateBookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { coverImage, pdfUrl, ...rest } = parsed.data;

    const book = await prisma.book.update({
      where: { id },
      data: {
        ...rest,
        ...(coverImage !== undefined && { coverImage: coverImage || null }),
        ...(pdfUrl !== undefined && { pdfUrl: pdfUrl || null }),
      },
    });
    return NextResponse.json(book);
  } catch (error) {
    console.error("[ADMIN /books/:id PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — remove book
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN /books/:id DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
