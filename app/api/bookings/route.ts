import { NextRequest, NextResponse } from "next/server";
import { BOOKING } from "@/lib/booking/config";
import { validateBooking, sniffSlip, type FieldErrors } from "@/lib/booking/validation";
import { createBooking, getBooking, SlotTakenError, TooManyBookingsError } from "@/lib/booking/store";
import { sendBookingEmail } from "@/lib/booking/mailer";
import { buildCheckout, cardPaymentsEnabled } from "@/lib/booking/payhere";
import { deleteSlip, saveSlip } from "@/lib/booking/storage";
import { notifyTeam } from "@/lib/booking/notify";
import { clientIp, rateLimit, sameOrigin } from "@/lib/booking/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(status: number, message: string, errors?: FieldErrors, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, message, errors, ...extra }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return fail(403, "Request blocked.");

  const ip = clientIp(request);
  const limit = rateLimit(`book:${ip}`, 12, 30 * 60_000);
  if (!limit.ok) {
    return fail(429, "Too many booking attempts. Please try again in a few minutes.", undefined, {
      retryAfterSec: limit.retryAfterSec,
    });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "We could not read your form. Please try again.");
  }

  // Honeypot: real people never fill this hidden field. Pretend success so bots move on.
  if (String(form.get("website") ?? "").trim() !== "") {
    return NextResponse.json({ ok: true, booking: { ref: "JB-000000" } });
  }

  const { ok, errors, value } = validateBooking({
    fullName: form.get("fullName"),
    phone: form.get("phone"),
    email: form.get("email"),
    notes: form.get("notes"),
    date: form.get("date"),
    time: form.get("time"),
    paymentMethod: form.get("paymentMethod"),
    consent: form.get("consent"),
  });

  // ---- slip (optional unless the patient chose bank transfer) ----
  let slipBytes: Uint8Array | null = null;
  let slipKind: ReturnType<typeof sniffSlip> = null;
  const slip = form.get("slip");
  if (slip instanceof File && slip.size > 0) {
    if (slip.size > BOOKING.slipMaxBytes) {
      errors.slip = `The slip is too large. Maximum size is ${BOOKING.slipMaxBytes / 1024 / 1024} MB.`;
    } else {
      slipBytes = new Uint8Array(await slip.arrayBuffer());
      slipKind = sniffSlip(slipBytes);
      if (!slipKind) errors.slip = "Upload the slip as a JPG, PNG, WebP image or a PDF.";
    }
  }
  if (value.paymentMethod === "bank_transfer" && !slipBytes && !errors.slip) {
    errors.slip = "Please upload your payment slip, or choose “Pay at TRACE”.";
  }

  if (value.paymentMethod === "card" && !cardPaymentsEnabled()) {
    errors.paymentMethod = "Card payment is not available right now. Please choose another way to pay.";
  }

  if (!ok || Object.keys(errors).length > 0) {
    return fail(422, "Please fix the highlighted fields.", errors);
  }

  let slipFile: string | null = null;
  try {
    if (slipBytes && slipKind) slipFile = await saveSlip(slipBytes, slipKind.ext);

    const created = await createBooking({
      fullName: value.fullName,
      phone: value.phone,
      email: value.email,
      notes: value.notes,
      date: value.date,
      time: value.time,
      paymentMethod: value.paymentMethod,
      slipFile,
      slipMime: slipKind?.mime ?? null,
      ip,
    });

    // Card bookings: nothing is emailed yet. The patient goes to PayHere now, and the emails
    // (patient + team) are sent when PayHere confirms the payment.
    if (value.paymentMethod === "card" && created.payToken) {
      return NextResponse.json(
        {
          ok: true,
          booking: { ref: created.ref, date: value.date, time: value.time, paymentMethod: "card", slipUploaded: false },
          payhere: buildCheckout({ ref: created.ref, full_name: value.fullName, email: value.email, phone: value.phone }, created.payToken),
        },
        { status: 201, headers: { "Cache-Control": "no-store" } }
      );
    }

    // patient confirmation email (if they gave an address); runs in the background
    void getBooking(created.id).then((row) => (row ? sendBookingEmail("received", row) : undefined)).catch(() => undefined);

    void notifyTeam({
      ref: created.ref,
      fullName: value.fullName,
      phone: value.phone,
      email: value.email,
      date: value.date,
      time: value.time,
      paymentMethod: value.paymentMethod,
      hasSlip: !!slipFile,
      notes: value.notes,
    });

    return NextResponse.json(
      {
        ok: true,
        booking: {
          ref: created.ref,
          date: value.date,
          time: value.time,
          paymentMethod: value.paymentMethod,
          slipUploaded: !!slipFile,
        },
      },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    if (slipFile) await deleteSlip(slipFile);
    if (err instanceof SlotTakenError) {
      return fail(409, "Sorry, that time slot was just booked by someone else. Please choose another time.", {
        date: "That slot was just taken. Please pick another time.",
      });
    }
    if (err instanceof TooManyBookingsError) {
      return fail(429, "This phone number already has several upcoming bookings. Please call us to make changes.");
    }
    console.error("[bookings] create failed:", err instanceof Error ? err.message : err);
    return fail(500, "Something went wrong on our side. Your booking was not saved, please try again in a moment.");
  }
}
