import { NextRequest, NextResponse } from "next/server";
import { getAvailability, getSlots } from "@/lib/booking/store";
import { isDateString } from "@/lib/booking/time";
import { clientIp, rateLimit } from "@/lib/booking/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/** GET /api/bookings/slots            -> { availability: { "2026-10-12": 14, ... } }
 *  GET /api/bookings/slots?date=...   -> { date, slots: [{ time, available }] } */
export async function GET(request: NextRequest) {
  const limit = rateLimit(`slots:${clientIp(request)}`, 90, 60_000);
  if (!limit.ok) return NextResponse.json({ ok: false, message: "Too many requests." }, { status: 429, headers: noStore });

  try {
    const date = request.nextUrl.searchParams.get("date");
    if (date) {
      if (!isDateString(date)) return NextResponse.json({ ok: false, message: "Invalid date." }, { status: 400, headers: noStore });
      return NextResponse.json({ ok: true, date, slots: await getSlots(date) }, { headers: noStore });
    }
    return NextResponse.json({ ok: true, availability: await getAvailability() }, { headers: noStore });
  } catch (err) {
    console.error("[bookings/slots] failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, message: "Booking is temporarily unavailable. Please try again shortly." },
      { status: 503, headers: noStore }
    );
  }
}
