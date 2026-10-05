/**
 * Client-side booking confirmation: a one-page A4 PDF and an .ics calendar file.
 * The page is drawn on a canvas (so any script, e.g. Sinhala/Tamil names, renders correctly)
 * and wrapped into a minimal PDF; no PDF library is needed.
 */
import { buildIcs } from "./ics";
import { formatDateLong, formatTime12h } from "./time";

export type Receipt = {
  ref: string;
  fullName: string;
  phone: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  priceLkr: number;
  paymentLabel: string;
  slotMinutes: number;
};

const PURPLE = "#893A9F";
const INK = "#2d0a3e";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function drawReceipt(r: Receipt, fontFamily: string): Promise<HTMLCanvasElement> {
  const W = 1240; // A4 @ 150 dpi
  const H = 1754;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // logo (purple on transparent) on white, cropped to the wordmark
  try {
    const logo = await loadImage("/jendo-icon.png");
    ctx.drawImage(logo, 28, 80, 144, 35, 90, 60, 320, 77.8);
  } catch {
    ctx.fillStyle = PURPLE;
    ctx.font = `800 56px ${fontFamily}`;
    ctx.fillText("JENDO", 90, 125);
  }

  // header band
  const band = ctx.createLinearGradient(0, 180, W, 360);
  band.addColorStop(0, "#2d0a3e");
  band.addColorStop(0.5, "#4a1260");
  band.addColorStop(1, PURPLE);
  ctx.fillStyle = band;
  ctx.fillRect(0, 180, W, 170);
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 62px ${fontFamily}`;
  ctx.fillText("Booking confirmation", 90, 265);
  ctx.font = `500 30px ${fontFamily}`;
  ctx.globalAlpha = 0.85;
  ctx.fillText("Jendo vascular health test", 90, 315);
  ctx.globalAlpha = 1;

  // reference box
  ctx.fillStyle = "#f6f1fa";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(90, 410, W - 180, 170, 28);
  else ctx.rect(90, 410, W - 180, 170);
  ctx.fill();
  ctx.fillStyle = PURPLE;
  ctx.font = `700 26px ${fontFamily}`;
  ctx.fillText("BOOKING REFERENCE", 130, 466);
  ctx.fillStyle = INK;
  ctx.font = `800 84px ${fontFamily}`;
  ctx.fillText(r.ref, 130, 548);

  // details
  const rows: [string, string][] = [
    ["Patient", r.fullName],
    ["Phone", r.phone],
    ["Date", formatDateLong(r.date)],
    ["Time", formatTime12h(r.time)],
    ["Venue", `${r.venueName}, ${r.venueAddress}`],
    ["Test fee", `Rs. ${r.priceLkr.toLocaleString("en-US")}`],
    ["Payment", r.paymentLabel],
  ];
  let y = 670;
  for (const [label, value] of rows) {
    ctx.fillStyle = "#6b7280";
    ctx.font = `600 26px ${fontFamily}`;
    ctx.fillText(label.toUpperCase(), 90, y);
    ctx.fillStyle = INK;
    ctx.font = `700 34px ${fontFamily}`;
    const lines = wrapText(ctx, value, W - 180 - 330);
    lines.forEach((l, i) => ctx.fillText(l, 420, y + i * 44));
    y += Math.max(1, lines.length) * 44 + 26;
    ctx.strokeStyle = "#ede8f5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, y - 36);
    ctx.lineTo(W - 90, y - 36);
    ctx.stroke();
  }

  // what happens next
  y += 10;
  ctx.fillStyle = INK;
  ctx.font = `800 36px ${fontFamily}`;
  ctx.fillText("What happens next", 90, y);
  y += 52;
  const steps = [
    "Our team will call you to confirm your appointment time.",
    `Come to ${r.venueName} on your appointment day.`,
    "Pay the test fee online or at the venue, if not already paid.",
    "Take the test (about 15 minutes) with a doctor present.",
    "We will share your report and feedback.",
  ];
  ctx.font = `500 30px ${fontFamily}`;
  steps.forEach((s, i) => {
    ctx.fillStyle = PURPLE;
    ctx.beginPath();
    ctx.arc(108, y - 10, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 22px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.fillText(String(i + 1), 108, y - 2);
    ctx.textAlign = "left";
    ctx.fillStyle = "#374151";
    ctx.font = `500 30px ${fontFamily}`;
    const lines = wrapText(ctx, s, W - 260);
    lines.forEach((l, li) => ctx.fillText(l, 150, y + li * 38));
    y += lines.length * 38 + 20;
  });

  // footer
  ctx.fillStyle = "#9ca3af";
  ctx.font = `500 24px ${fontFamily}`;
  ctx.fillText("Please keep this reference handy.  jendo.health", 90, H - 70);
  return canvas;
}

/** Wraps one JPEG into a single-page A4 PDF */
function jpegToPdf(jpeg: Uint8Array, wPx: number, hPx: number): Blob {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (data: Uint8Array | string) => {
    const bytes = typeof data === "string" ? enc.encode(data) : data;
    parts.push(bytes);
    length += bytes.length;
  };
  const obj = (n: number, body: string) => {
    offsets[n] = length;
    push(`${n} 0 obj\n${body}\nendobj\n`);
  };

  push("%PDF-1.4\n");
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  obj(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>");
  offsets[4] = length;
  push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${wPx} /Height ${hPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  push(jpeg);
  push("\nendstream\nendobj\n");
  const content = "q\n595.28 0 0 841.89 0 0 cm\n/Im0 Do\nQ";
  obj(5, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const xrefAt = length;
  let xref = "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i <= 5; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  push(xref);
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`);

  const out = new Uint8Array(length);
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return new Blob([out], { type: "application/pdf" });
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function downloadReceiptPdf(r: Receipt, fontFamily: string) {
  try {
    // make sure the weights used below are loaded before drawing
    await Promise.all(["500", "600", "700", "800"].map((w) => document.fonts.load(`${w} 30px ${fontFamily}`)));
  } catch {
    /* fall back to whatever is available */
  }
  const canvas = await drawReceipt(r, fontFamily);
  const jpegBlob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create the image"))), "image/jpeg", 0.92)
  );
  const bytes = new Uint8Array(await jpegBlob.arrayBuffer());
  saveBlob(jpegToPdf(bytes, canvas.width, canvas.height), `Jendo-Test-Booking-${r.ref}.pdf`);
}

export function downloadCalendarFile(r: Receipt) {
  saveBlob(new Blob([buildIcs(r)], { type: "text/calendar;charset=utf-8" }), `Jendo-Test-${r.ref}.ics`);
}
