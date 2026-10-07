/**
 * Jendo test booking — single place for the rules of the TRACE booking flow.
 * Change the values here (or the BOOKING_* env vars) to adjust the schedule.
 */

export const BOOKING = {
  priceLkr: 9500,
  currency: "LKR",
  venueName: "TRACE, Sri Lanka",
  venueAddress: "Bay 09, Trace Expert City, Colombo 10, Sri Lanka",
  testDurationMinutes: 15,

  /** Days patients can book: 0 = Sunday … 6 = Saturday */
  openWeekdays: [1, 2, 3, 4, 5, 6],
  firstSlot: "09:00",
  lastSlot: "16:30",
  slotMinutes: 30,
  /** How many patients can be booked into one slot */
  capacityPerSlot: 1,

  /** Earliest bookable moment, in hours from now (gives the team time to call back) */
  minLeadHours: 12,
  maxDaysAhead: 60,

  /** A card booking holds its slot for this long while the patient pays; then the slot is released */
  cardHoldMinutes: 30,

  /** Slip upload limits */
  slipMaxBytes: 5 * 1024 * 1024,
  slipTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const,
} as const;

/** Sri Lanka has no daylight saving: always UTC+05:30 */
export const COLOMBO_OFFSET_MINUTES = 330;

export const BOOKING_STATUSES = ["new", "confirmed", "completed", "no_show", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = ["unpaid", "slip_uploaded", "paid"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_METHODS = ["pay_at_venue", "bank_transfer", "card"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Statuses that hold a slot. Cancelled / no-show bookings free it up. */
export const SLOT_HOLDING_STATUSES: BookingStatus[] = ["new", "confirmed", "completed"];

export type BankDetails = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  note: string;
} | null;

/** Bank transfer details come from env so they never live in git. */
export function getBankDetails(): BankDetails {
  const accountNumber = process.env.BOOKING_BANK_ACCOUNT_NUMBER?.trim();
  const accountName = process.env.BOOKING_BANK_ACCOUNT_NAME?.trim();
  // account number + account name are enough; bank name and branch are shown when set
  if (!accountNumber || !accountName) return null;
  return {
    bankName: process.env.BOOKING_BANK_NAME?.trim() || "",
    accountName,
    accountNumber,
    branch: process.env.BOOKING_BANK_BRANCH?.trim() || "",
    note: process.env.BOOKING_BANK_NOTE?.trim() || "",
  };
}
