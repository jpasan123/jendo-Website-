import type { Metadata } from "next";
import Link from "next/link";
import { PaymentStatus } from "@/components/booking/PaymentStatus";
import { BOOKING } from "@/lib/booking/config";
import { getBookingForPayment } from "@/lib/booking/store";

export const metadata: Metadata = {
  title: "Payment | Jendo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PaymentCancelPage({ searchParams }: { searchParams: Promise<{ ref?: string; t?: string }> }) {
  const { ref = "", t = "" } = await searchParams;
  let booking = null;
  try {
    booking = await getBookingForPayment(ref, t);
  } catch (err) {
    console.error("[payment-page] lookup failed:", err instanceof Error ? err.message : err);
  }

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: "linear-gradient(180deg,#f6f1fa 0%,#f9f9fb 320px)" }}>
      {booking ? (
        <PaymentStatus
          mode="cancel"
          bookingRef={booking.ref}
          token={t}
          fullName={booking.full_name}
          phone={booking.phone}
          date={booking.appointment_date}
          time={booking.slot_time}
          paid={booking.payment_status === "paid"}
          expired={booking.status === "cancelled" && booking.payment_status !== "paid"}
          venueName={BOOKING.venueName}
          venueAddress={BOOKING.venueAddress}
          priceLkr={booking.amount_lkr}
          slotMinutes={BOOKING.slotMinutes}
        />
      ) : (
        <div className="mx-auto max-w-md rounded-3xl border border-[#ede8f5] bg-white p-8 text-center shadow-sm">
          <h1 className="!text-xl !font-bold text-[#2d0a3e]">We could not find that booking</h1>
          <p className="mt-2 text-sm text-gray-600">The payment link is not valid. If you paid, please contact us with your booking reference.</p>
          <Link href="/book-test" className="mt-5 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#893A9F,#4a1260)" }}>Go to booking</Link>
        </div>
      )}
    </main>
  );
}
