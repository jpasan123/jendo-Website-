import { NextRequest, NextResponse } from "next/server";
import { createBooking, getBooking, getBookingCounts, listBookings, SlotTakenError } from "@/lib/booking/store";
import { emailConfigured, sendBookingEmailWithin, maskEmail } from "@/lib/booking/mailer";
import { validateBooking } from "@/lib/booking/validation";
import { isAdminRequest, sameOrigin } from "@/lib/booking/security";
import { formatTime12h } from "@/lib/booking/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

function csvCell(value: unknown) {
  let s = value == null ? "" : String(value);
  // stop spreadsheet formula injection from patient-entered text
  if (/^[=@\t\r]|^[+-](?!\d+$)/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401, headers: noStore });

  const p = request.nextUrl.searchParams;
  try {
    const items = await listBookings({
      status: p.get("status") || undefined,
      paymentStatus: p.get("payment") || undefined,
      date: p.get("date") || undefined,
      q: (p.get("q") || "").trim().slice(0, 80) || undefined,
      upcoming: p.get("upcoming") === "1",
      followUpDue: p.get("followup") === "1",
    });

    if (p.get("format") === "csv") {
      const header = ["Ref", "Date", "Time", "Name", "Phone", "Email", "Status", "Payment status", "Payment method", "PayHere payment id", "Amount LKR", "Notes", "Admin notes", "Follow-up on", "Booked at"];
      const lines = [header.map(csvCell).join(",")];
      for (const b of items) {
        lines.push(
          [b.ref, b.appointment_date, formatTime12h(b.slot_time), b.full_name, b.phone, b.email, b.status, b.payment_status, b.payment_method, b.payhere_payment_id, b.amount_lkr, b.notes, b.admin_notes, b.follow_up_on, new Date(b.created_at).toISOString()]
            .map(csvCell)
            .join(",")
        );
      }
      return new NextResponse("﻿" + lines.join("\r\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="jendo-bookings-${new Date().toISOString().slice(0, 10)}.csv"`,
          ...noStore,
        },
      });
    }

    return NextResponse.json({ ok: true, items, counts: await getBookingCounts(), emailConfigured: emailConfigured() }, { headers: noStore });
  } catch (err) {
    console.error("[admin/bookings] list failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: "Could not load bookings." }, { status: 500, headers: noStore });
  }
}

/** Staff add a booking taken over the phone or in person */
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401, headers: noStore });
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, message: "Request blocked." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON." }, { status: 400 });
  }

  const { ok, errors, value } = validateBooking(
    {
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      notes: body.notes,
      date: body.date,
      time: body.time,
      paymentMethod: body.paymentMethod === "bank_transfer" ? "bank_transfer" : "pay_at_venue",
      consent: true,
    },
    Date.now(),
    { staff: true }
  );
  if (!ok) return NextResponse.json({ ok: false, message: "Please fix the highlighted fields.", errors }, { status: 422, headers: noStore });

  try {
    const created = await createBooking({
      fullName: value.fullName,
      phone: value.phone,
      email: value.email,
      notes: value.notes,
      date: value.date,
      time: value.time,
      paymentMethod: value.paymentMethod,
      slipFile: null,
      slipMime: null,
      ip: "staff",
      staff: true,
      status: "confirmed",
      paymentStatus: body.paid === true ? "paid" : "unpaid",
    });
    const row = await getBooking(created.id);
    const email = row && row.email ? await sendBookingEmailWithin("confirmed", row) : null;
    return NextResponse.json(
      { ok: true, ref: created.ref, email: email ? { kind: "confirmed", status: email.status, to: row?.email ? maskEmail(row.email) : undefined } : null },
      { status: 201, headers: noStore }
    );
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ ok: false, message: "That slot is already booked.", errors: { date: "That slot is already booked." } }, { status: 409, headers: noStore });
    }
    console.error("[admin/bookings] create failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: "Could not save the booking." }, { status: 500, headers: noStore });
  }
}
