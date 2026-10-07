import { NextRequest, NextResponse } from "next/server";
import { getBookingForPayment } from "@/lib/booking/store";
import { clientIp, rateLimit } from "@/lib/booking/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/** GET ?ref=&t=  ->  { paid, expired }  (the return page polls this while PayHere's notification arrives) */
export async function GET(request: NextRequest) {
  if (!rateLimit(`paystatus:${clientIp(request)}`, 90, 60_000).ok) return NextResponse.json({ ok: false }, { status: 429, headers: noStore });
  const ref = request.nextUrl.searchParams.get("ref") ?? "";
  const t = request.nextUrl.searchParams.get("t") ?? "";
  const b = await getBookingForPayment(ref, t);
  if (!b) return NextResponse.json({ ok: false }, { status: 404, headers: noStore });
  return NextResponse.json({ ok: true, paid: b.payment_status === "paid", expired: b.status === "cancelled" && b.payment_status !== "paid" }, { headers: noStore });
}
