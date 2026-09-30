import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/** Use in Server Components / layouts. Redirects if not ADMIN. */
export async function requireAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  if ((session.user as any).role !== "ADMIN") {
    redirect("/?error=access_denied");
  }
  return session;
}

/** Use in API Route Handlers. Returns 401/403 NextResponse if not ADMIN. */
export async function requireAdminApi(): Promise<
  { ok: true; session: Awaited<ReturnType<typeof getServerSession>> } |
  { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if ((session.user as any).role !== "ADMIN") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { ok: true, session };
}
