import { NextRequest, NextResponse } from "next/server";
import { getBookingSlip } from "@/lib/booking/store";
import { readSlip } from "@/lib/booking/storage";
import { isAdminRequest } from "@/lib/booking/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return new NextResponse("Not found", { status: 404 });

  try {
    const row = await getBookingSlip(id);
    if (!row?.slip_file || !row.slip_mime) return new NextResponse("No slip uploaded", { status: 404 });
    const bytes = await readSlip(row.slip_file);
    const ext = row.slip_file.split(".").pop();
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": row.slip_mime,
        "Content-Disposition": `inline; filename="${row.ref}-slip.${ext}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[admin/slip] failed:", err instanceof Error ? err.message : err);
    return new NextResponse("Slip unavailable", { status: 404 });
  }
}
