import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BookingForm } from "@/components/booking/BookingForm";
import { BOOKING, getBankDetails } from "@/lib/booking/config";

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
  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: "linear-gradient(180deg,#f6f1fa 0%,#f9f9fb 320px)" }}>
      <BookingForm
        priceLkr={BOOKING.priceLkr}
        venueName={BOOKING.venueName}
        venueAddress={BOOKING.venueAddress}
        bank={bank}
        maxDaysAhead={BOOKING.maxDaysAhead}
        openWeekdays={[...BOOKING.openWeekdays]}
        slipMaxMb={BOOKING.slipMaxBytes / 1024 / 1024}
        testMinutes={BOOKING.testDurationMinutes}
        slotMinutes={BOOKING.slotMinutes}
        defaultFullName={session.user.name ?? ""}
        defaultEmail={session.user.email ?? ""}
      />
    </main>
  );
}
