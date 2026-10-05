import { NextRequest, NextResponse } from "next/server";
import { SlotTakenError, updateBooking, type BookingPatch } from "@/lib/booking/store";
import { isAdminRequest, sameOrigin } from "@/lib/booking/security";
import { isScheduledSlot } from "@/lib/booking/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const noStore = { "Cache-Control": "no-store" };

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401, headers: noStore });
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, message: "Request blocked." }, { status: 403 });

  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ ok: false, message: "Invalid booking id." }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON." }, { status: 400 });
  }

  const patch: BookingPatch = {};
  if (typeof body.status === "string") patch.status = body.status as BookingPatch["status"];
  if (typeof body.payment_status === "string") patch.payment_status = body.payment_status as BookingPatch["payment_status"];
  if (typeof body.admin_notes === "string") patch.admin_notes = body.admin_notes;
  if (body.follow_up_on === null || typeof body.follow_up_on === "string") {
    patch.follow_up_on = (body.follow_up_on as string | null) || null;
  }
  if (typeof body.appointment_date === "string" || typeof body.slot_time === "string") {
    patch.appointment_date = String(body.appointment_date ?? "");
    patch.slot_time = String(body.slot_time ?? "");
    // staff may reschedule inside the normal schedule, ignoring the patient lead-time rule
    if (!isScheduledSlot(patch.appointment_date, patch.slot_time)) {
      return NextResponse.json({ ok: false, message: "Choose a valid slot in the opening hours." }, { status: 422 });
    }
  }

  try {
    const item = await updateBooking(id, patch);
    if (!item) return NextResponse.json({ ok: false, message: "Booking not found." }, { status: 404, headers: noStore });
    return NextResponse.json({ ok: true, item }, { headers: noStore });
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ ok: false, message: "That slot is already booked." }, { status: 409, headers: noStore });
    }
    const message = err instanceof Error ? err.message : "Update failed";
    const client = ["Invalid", "Nothing"].some((s) => message.startsWith(s));
    if (!client) console.error("[admin/bookings] update failed:", message);
    return NextResponse.json({ ok: false, message: client ? message : "Could not update the booking." }, { status: client ? 400 : 500, headers: noStore });
  }
}
