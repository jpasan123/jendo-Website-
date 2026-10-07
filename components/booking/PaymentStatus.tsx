"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CalendarPlus, CheckCircle2, Clock, Download, Loader2, Lock, MapPin, RefreshCw } from "lucide-react";
import { downloadCalendarFile, downloadReceiptPdf } from "@/lib/booking/receipt";
import { formatDateLong, formatTime12h } from "@/lib/booking/time";
import { submitToPayhere } from "./payhere-client";

type Props = {
  mode: "return" | "cancel";
  bookingRef: string;
  token: string;
  fullName: string;
  phone: string;
  date: string;
  time: string;
  paid: boolean;
  expired: boolean;
  venueName: string;
  venueAddress: string;
  priceLkr: number;
  slotMinutes: number;
};

const font = { fontFamily: "var(--font-red-hat-display),sans-serif" } as const;
const money = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;
const gradient = { background: "linear-gradient(135deg,#893A9F,#4a1260)" };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-[#ede8f5] bg-white shadow-xl shadow-purple-900/5">
        <div className="flex justify-center bg-white pb-4 pt-7">
          <div
            role="img"
            aria-label="Jendo"
            className="h-[40px] w-[160px]"
            style={{ backgroundImage: "url(/jendo-icon.png)", backgroundSize: "222px 222px", backgroundPosition: "-31px -89px", backgroundRepeat: "no-repeat" }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}

export function PaymentStatus(props: Props) {
  const { mode, bookingRef, token, fullName, phone, date, time, venueName, venueAddress, priceLkr, slotMinutes } = props;
  const [paid, setPaid] = useState(props.paid);
  const [expired, setExpired] = useState(props.expired);
  const [switched, setSwitched] = useState(false);
  const [waiting, setWaiting] = useState(mode === "return" && !props.paid && !props.expired);
  const [timedOut, setTimedOut] = useState(false);
  const [busy, setBusy] = useState<"" | "retry" | "venue" | "pdf">("");
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const check = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/pay-status?ref=${encodeURIComponent(bookingRef)}&t=${encodeURIComponent(token)}`, { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        if (data.paid) setPaid(true);
        if (data.expired) setExpired(true);
        return !!data.paid || !!data.expired;
      }
    } catch {
      /* try again on the next tick */
    }
    return false;
  }, [bookingRef, token]);

  // PayHere confirms the payment to our server a few seconds after the patient returns: poll for it
  useEffect(() => {
    if (!waiting) return;
    let tries = 0;
    const id = setInterval(async () => {
      tries += 1;
      if (await check()) {
        setWaiting(false);
        clearInterval(id);
      } else if (tries >= 30) {
        setWaiting(false);
        setTimedOut(true);
        clearInterval(id);
      }
    }, 3000);
    return () => clearInterval(id);
  }, [waiting, check]);

  const receipt = {
    ref: bookingRef,
    fullName,
    phone,
    date,
    time,
    venueName,
    venueAddress,
    priceLkr,
    paymentLabel: paid ? "Paid by card (PayHere)" : "Pay at the venue",
    slotMinutes,
  };

  async function post(action: "retry" | "pay_at_venue") {
    setError("");
    setBusy(action === "retry" ? "retry" : "venue");
    try {
      const res = await fetch("/api/bookings/pay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ref: bookingRef, t: token, action }) });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.paid) return setPaid(true);
        if (data.switched) return setSwitched(true);
        if (data.payhere) return submitToPayhere(data.payhere);
      }
      if (data.expired) setExpired(true);
      setError(data.message || "Something went wrong. Please try again.");
    } catch {
      setError("We could not reach the server. Please check your connection and try again.");
    } finally {
      setBusy((b) => (b === "retry" ? "" : b === "venue" ? "" : b));
    }
  }

  const details = (
    <dl className="grid gap-3 text-sm sm:grid-cols-2" style={font}>
      <div className="rounded-xl border border-[#ede8f5] p-4"><dt className="text-xs text-gray-500">Reference</dt><dd className="font-bold text-gray-900">{bookingRef}</dd></div>
      <div className="rounded-xl border border-[#ede8f5] p-4"><dt className="text-xs text-gray-500">Date and time</dt><dd className="font-semibold text-gray-900">{formatDateLong(date)}, {formatTime12h(time)}</dd></div>
      <div className="rounded-xl border border-[#ede8f5] p-4 sm:col-span-2"><dt className="text-xs text-gray-500">Where</dt><dd className="font-semibold text-gray-900">{venueName}</dd><dd className="text-xs text-gray-500">{venueAddress}</dd></div>
    </dl>
  );

  const nextSteps = (
    <div>
      <h2 className="!text-lg !font-bold text-gray-900" style={font}>What happens next</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-600" style={font}>
        <li>We have emailed you a payment confirmation.</li>
        <li>Our team will call you to confirm your appointment time.</li>
        <li>Come to {venueName} on your appointment day. Nothing more to pay.</li>
        <li>Take the ~15 minute test, then we share your report and feedback.</li>
      </ol>
    </div>
  );

  // ------------------------------------------------------------- paid
  if (paid) {
    return (
      <div ref={rootRef}>
        <Shell>
          <div className="px-6 py-10 text-center sm:px-10" style={{ background: "linear-gradient(135deg,#2d0a3e 0%,#4a1260 50%,#893A9F 100%)" }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15"><CheckCircle2 className="h-9 w-9 text-white" /></div>
            <h1 className="!text-2xl !font-bold text-white sm:!text-3xl" style={font}>Payment received</h1>
            <p className="mt-2 text-sm text-white/80 sm:text-base" style={font}>Thank you, {fullName.split(" ")[0]}. Your booking is secured.</p>
          </div>
          <div className="space-y-6 p-6 sm:p-10">
            {details}
            {nextSteps}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button" disabled={busy === "pdf"}
                onClick={async () => {
                  setBusy("pdf");
                  try {
                    await downloadReceiptPdf(receipt, getComputedStyle(rootRef.current ?? document.body).fontFamily);
                  } catch {
                    setError("We could not create the PDF on this device. Please take a screenshot instead.");
                  } finally {
                    setBusy("");
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-[#893A9F] px-5 py-3 text-sm font-bold text-[#893A9F] transition hover:bg-[#f6f1fa] disabled:opacity-60" style={font}
              >
                {busy === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PDF
              </button>
              <button type="button" onClick={() => downloadCalendarFile(receipt)} className="flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50" style={font}>
                <CalendarPlus className="h-4 w-4" /> Add to calendar
              </button>
            </div>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <Link href="/" className="flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-white" style={{ ...gradient, ...font }}>Back to Jendo home</Link>
          </div>
        </Shell>
      </div>
    );
  }

  // ------------------------------------------------------------- switched to pay at venue
  if (switched) {
    return (
      <Shell>
        <div className="space-y-5 p-6 text-center sm:p-10">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
          <h1 className="!text-2xl !font-bold text-[#2d0a3e]" style={font}>Booking kept: pay at TRACE</h1>
          <p className="text-sm text-gray-600" style={font}>Your appointment is saved. Please pay {money(priceLkr)} at {venueName} on the day. We will call to confirm the time.</p>
          {details}
          <Link href="/" className="flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-white" style={{ ...gradient, ...font }}>Back to Jendo home</Link>
        </div>
      </Shell>
    );
  }

  // ------------------------------------------------------------- slot released
  if (expired) {
    return (
      <Shell>
        <div className="space-y-5 p-6 text-center sm:p-10">
          <Clock className="mx-auto h-12 w-12 text-amber-600" />
          <h1 className="!text-2xl !font-bold text-[#2d0a3e]" style={font}>This time slot was released</h1>
          <p className="text-sm text-gray-600" style={font}>
            The payment was not completed in time, so the slot ({formatDateLong(date)}, {formatTime12h(time)}) is free for others again. If you were charged, you will receive an email, or contact us with reference {bookingRef}.
          </p>
          <Link href="/book-test" className="flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold text-white" style={{ ...gradient, ...font }}>Book again</Link>
        </div>
      </Shell>
    );
  }

  // ------------------------------------------------------------- waiting for PayHere's confirmation (return page)
  if (mode === "return") {
    return (
      <Shell>
        <div className="space-y-5 p-6 text-center sm:p-10">
          {waiting ? <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#893A9F]" /> : <AlertCircle className="mx-auto h-12 w-12 text-amber-600" />}
          <h1 className="!text-2xl !font-bold text-[#2d0a3e]" style={font}>{waiting ? "Confirming your payment…" : "We have not received the payment confirmation yet"}</h1>
          <p className="text-sm text-gray-600" style={font}>
            {waiting
              ? "This usually takes a few seconds. Please keep this page open."
              : `If your card was charged, our system will update within a few minutes and you will get an email. You can also contact us with your reference ${bookingRef}.`}
          </p>
          {details}
          {timedOut && !waiting && (
            <button type="button" onClick={async () => { setTimedOut(false); setWaiting(true); await check(); }} className="mx-auto flex items-center gap-2 rounded-full border-2 border-[#893A9F] px-5 py-2.5 text-sm font-bold text-[#893A9F]" style={font}>
              <RefreshCw className="h-4 w-4" /> Check again
            </button>
          )}
        </div>
      </Shell>
    );
  }

  // ------------------------------------------------------------- cancel page: payment not completed
  return (
    <Shell>
      <div className="space-y-5 p-6 sm:p-10">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-600" />
          <h1 className="mt-3 !text-2xl !font-bold text-[#2d0a3e]" style={font}>Payment not completed</h1>
          <p className="mt-2 text-sm text-gray-600" style={font}>Nothing was charged. Your time slot is held for a short while so you can try again.</p>
        </div>
        {details}
        {error && <p role="alert" className="flex items-center gap-1.5 text-sm text-red-600"><AlertCircle className="h-4 w-4" /> {error}</p>}
        <button type="button" disabled={!!busy} onClick={() => post("retry")} className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white disabled:opacity-60" style={{ ...gradient, ...font }}>
          {busy === "retry" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Try the card payment again
        </button>
        <button type="button" disabled={!!busy} onClick={() => post("pay_at_venue")} className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60" style={font}>
          {busy === "venue" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />} Keep my booking and pay at TRACE
        </button>
        <Link href="/book-test" className="block text-center text-sm font-semibold text-[#893A9F] underline">Choose a different time</Link>
      </div>
    </Shell>
  );
}
