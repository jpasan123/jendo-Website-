import { slotStartMs } from "./time";

export type IcsEvent = {
  ref: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  slotMinutes: number;
};

const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const escapeText = (s: string) => s.replace(/[\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

/** iCalendar (.ics) text for one appointment, shared by the website download and the emails */
export function buildIcs(e: IcsEvent): string {
  const start = slotStartMs(e.date, e.time);
  const end = start + e.slotMinutes * 60_000;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jendo//Test Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.ref}@jendo.health`,
    `DTSTAMP:${stamp(Date.now())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeText("Jendo vascular health test")}`,
    `LOCATION:${escapeText(`${e.venueName}, ${e.venueAddress}`)}`,
    `DESCRIPTION:${escapeText(`Booking reference ${e.ref}. Our team will call to confirm your appointment.`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Jendo test appointment",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
