import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings admin | Jendo",
  robots: { index: false, follow: false },
};

export default function BookingsAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
