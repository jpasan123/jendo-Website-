import { AdminBookings } from "@/components/booking/AdminBookings";
import { dailySlotTimes } from "@/lib/booking/time";

export const dynamic = "force-dynamic";

export default function BookingsAdminPage() {
  return (
    <main className="min-h-screen bg-[#f6f4f9] pt-24 pb-16">
      <AdminBookings slotTimes={dailySlotTimes()} />
    </main>
  );
}
