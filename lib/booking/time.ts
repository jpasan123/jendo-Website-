import { BOOKING, COLOMBO_OFFSET_MINUTES } from "./config";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isDateString(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function isTimeString(value: string): boolean {
  return TIME_RE.test(value);
}

/** "now" shifted so that the getUTC* getters return Colombo wall-clock values */
function colomboWallClock(nowMs: number): Date {
  return new Date(nowMs + COLOMBO_OFFSET_MINUTES * 60_000);
}

export function formatDate(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function todayInColombo(nowMs = Date.now()): string {
  const c = colomboWallClock(nowMs);
  return formatDate(c.getUTCFullYear(), c.getUTCMonth() + 1, c.getUTCDate());
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return formatDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Epoch ms of a Colombo local date + "HH:MM" */
export function slotStartMs(date: string, time: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, hh, mm) - COLOMBO_OFFSET_MINUTES * 60_000;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Every slot start time of a working day, ignoring the date */
export function dailySlotTimes(): string[] {
  const out: string[] = [];
  for (let t = toMinutes(BOOKING.firstSlot); t <= toMinutes(BOOKING.lastSlot); t += BOOKING.slotMinutes) {
    out.push(fromMinutes(t));
  }
  return out;
}

export function isOpenDay(date: string): boolean {
  return (BOOKING.openWeekdays as readonly number[]).includes(weekdayOf(date));
}

export function isWithinBookingWindow(date: string, nowMs = Date.now()): boolean {
  const today = todayInColombo(nowMs);
  return date >= today && date <= addDays(today, BOOKING.maxDaysAhead);
}

/** True if a slot exists in the schedule and is far enough in the future */
export function isBookableSlot(date: string, time: string, nowMs = Date.now()): boolean {
  if (!isDateString(date) || !isTimeString(time)) return false;
  if (!isOpenDay(date) || !isWithinBookingWindow(date, nowMs)) return false;
  if (!dailySlotTimes().includes(time)) return false;
  return slotStartMs(date, time) >= nowMs + BOOKING.minLeadHours * 3_600_000;
}

/** Staff rescheduling: any real slot of the schedule from today onwards (no lead-time rule) */
export function isScheduledSlot(date: string, time: string, nowMs = Date.now()): boolean {
  if (!isDateString(date) || !isTimeString(time)) return false;
  return isOpenDay(date) && date >= todayInColombo(nowMs) && dailySlotTimes().includes(time);
}

export function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatDateLong(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
