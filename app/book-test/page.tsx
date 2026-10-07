import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccountBar } from "@/components/auth/AccountBar";
import { BookingForm } from "@/components/booking/BookingForm";
import { BOOKING, getBankDetails, priceFor } from "@/lib/booking/config";
import { cardPaymentsEnabled } from "@/lib/booking/payhere";

export const metadata: Metadata = {
  title: "Book a Jendo Test at TRACE | Jendo",
  description:
    "Book your non-invasive Jendo vascular health test at TRACE. Choose a date and time, pay online or at the venue, and our team will call to confirm.",
};

// Bank details come from env at request time, so never prerender this page.
export const dynamic = "force-dynamic";

export default async function BookTestPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=%2Fbook-test");

  const bank = getBankDetails();
  const price = priceFor(session.user.email);
  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: "linear-gradient(180deg,#f6f1fa 0%,#f9f9fb 320px)" }}>
      {price !== BOOKING.priceLkr && (
        <p className="mx-auto mb-4 max-w-6xl px-4 text-sm font-semibold text-amber-700 sm:px-6 lg:px-8">
          Test pricing is active for your account (Rs. {price.toLocaleString("en-US")}). Other patients pay Rs. {BOOKING.priceLkr.toLocaleString("en-US")}.
        </p>
      )}
      <AccountBar name={session.user.name ?? ""} email={session.user.email ?? ""} />
      <BookingForm
        priceLkr={price}
        venueName={BOOKING.venueName}
        venueAddress={BOOKING.venueAddress}
        bank={bank}
        maxDaysAhead={BOOKING.maxDaysAhead}
        openWeekdays={[...BOOKING.openWeekdays]}
        slipMaxMb={BOOKING.slipMaxBytes / 1024 / 1024}
        testMinutes={BOOKING.testDurationMinutes}
        slotMinutes={BOOKING.slotMinutes}
        cardEnabled={cardPaymentsEnabled()}
        cardHoldMinutes={BOOKING.cardHoldMinutes}
        minLeadHours={BOOKING.minLeadHours}
        defaultFullName={session.user.name ?? ""}
        defaultEmail={session.user.email ?? ""}
      />
    </main>
  );
}
