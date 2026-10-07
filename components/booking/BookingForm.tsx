"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  FileText,
  Loader2,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { addDays, formatDate, formatDateLong, formatTime12h, todayInColombo, weekdayOf } from "@/lib/booking/time";
import { formatPhoneInput, suggestEmailFix, validateBooking, type FieldErrors } from "@/lib/booking/validation";
import { downloadCalendarFile, downloadReceiptPdf } from "@/lib/booking/receipt";
import { submitToPayhere, type PayherePayload } from "./payhere-client";
import type { BankDetails, PaymentMethod } from "@/lib/booking/config";

type Props = {
  priceLkr: number;
  venueName: string;
  venueAddress: string;
  bank: BankDetails;
  maxDaysAhead: number;
  openWeekdays: number[];
  slipMaxMb: number;
  testMinutes: number;
  slotMinutes: number;
  /** Card payments (PayHere) are offered only when the server has PayHere configured */
  cardEnabled?: boolean;
  cardHoldMinutes?: number;
  /** Prefilled from the signed-in user's account, if any - fields stay editable. */
  defaultFullName?: string;
  defaultEmail?: string;
};

type Slot = { time: string; available: boolean };
type TextKey = "fullName" | "phone" | "email" | "notes";
type Done = { ref: string; date: string; time: string; paymentMethod: PaymentMethod; slipUploaded: boolean };

const font = { fontFamily: "var(--font-red-hat-display),sans-serif" } as const;
const PURPLE = "#893A9F";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const SLIP_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const money = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;

function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  required,
  valid,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  required?: boolean;
  valid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center justify-between text-sm font-semibold text-gray-800" style={font}>
        <span>
          {label}
          {required && (
            <>
              <span className="ml-0.5 text-red-600" aria-hidden="true">*</span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </span>
        {optional && <span className="text-xs font-normal text-gray-400">Optional</span>}
        {valid && !error && <Check className="h-4 w-4 text-emerald-600" aria-label="Looks good" />}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

const inputClass = (invalid?: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-4 ${
    invalid ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-gray-200 focus:border-[#893A9F] focus:ring-[#893A9F]/15"
  }`;

export function BookingForm({ priceLkr, venueName, venueAddress, bank, maxDaysAhead, openWeekdays, slipMaxMb, testMinutes, slotMinutes, cardEnabled = false, cardHoldMinutes = 30, defaultFullName, defaultEmail }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [done, setDone] = useState<Done | null>(null);

  // step 1
  const today = useMemo(() => todayInColombo(), []);
  const lastDay = useMemo(() => addDays(today, maxDaysAhead), [today, maxDaysAhead]);
  const [availability, setAvailability] = useState<Record<string, number> | null>(null);
  const [availabilityError, setAvailabilityError] = useState("");
  const [monthOffset, setMonthOffset] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  // step 2
  const [fullName, setFullName] = useState(defaultFullName ?? "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [notes, setNotes] = useState("");

  // step 3
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pay_at_venue");
  const [slip, setSlip] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<TextKey, boolean>>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const dialogBtnRef = useRef<HTMLButtonElement>(null);
  const timeRef = useRef("");
  const redirectingRef = useRef(false);
  const [conflict, setConflict] = useState<{ date: string; time: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState("");
  timeRef.current = time;
  redirectingRef.current = redirecting;

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const loadAvailability = useCallback(async () => {
    setAvailabilityError("");
    try {
      const res = await fetch("/api/bookings/slots", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "failed");
      setAvailability(data.availability as Record<string, number>);
    } catch {
      setAvailability(null);
      setAvailabilityError("We could not load the available dates. Please check your connection and try again.");
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const loadSlots = useCallback(async (d: string) => {
    setSlotsLoading(true);
    setSlotsError("");
    setSlots(null);
    try {
      const res = await fetch(`/api/bookings/slots?date=${d}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "failed");
      setSlots(data.slots as Slot[]);
    } catch {
      setSlotsError("We could not load the times for this day. Please try again.");
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) loadSlots(date);
  }, [date, loadSlots]);

  const fetchSlots = useCallback(async (d: string): Promise<Slot[] | null> => {
    try {
      const res = await fetch(`/api/bookings/slots?date=${d}`, { cache: "no-store" });
      const data = await res.json();
      return res.ok && data.ok ? (data.slots as Slot[]) : null;
    } catch {
      return null;
    }
  }, []);

  // While choosing a time, re-check every 20s so a slot taken by someone else is flagged straight away
  useEffect(() => {
    if (step !== 1 || !date || done) return;
    const id = setInterval(async () => {
      const fresh = await fetchSlots(date);
      if (!fresh) return;
      setSlots(fresh);
      const chosen = timeRef.current;
      if (chosen && !fresh.find((s) => s.time === chosen)?.available) {
        setTime("");
        setConflict({ date, time: chosen });
      }
    }, 20_000);
    return () => clearInterval(id);
  }, [step, date, done, fetchSlots]);

  // slot-taken dialog: focus the button, close on Escape
  useEffect(() => {
    if (!conflict) return;
    dialogBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setConflict(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [conflict]);

  // Back button from PayHere can restore this page from cache: drop the "redirecting" state
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setRedirecting(false);
        setSubmitting(false);
      }
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // slip preview URL lifecycle
  useEffect(() => {
    if (slip && slip.type.startsWith("image/")) {
      const url = URL.createObjectURL(slip);
      setSlipPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setSlipPreview("");
  }, [slip]);

  // ------------------------------------------------------------------ calendar
  const month = useMemo(() => {
    const [ty, tm] = today.split("-").map(Number);
    const base = new Date(Date.UTC(ty, tm - 1 + monthOffset, 1));
    const y = base.getUTCFullYear();
    const m = base.getUTCMonth();
    const firstWeekday = base.getUTCDay();
    const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const cells: (string | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(formatDate(y, m + 1, d));
    return { y, m, cells };
  }, [today, monthOffset]);

  const lastMonthOffset = useMemo(() => {
    const [ty, tm] = today.split("-").map(Number);
    const [ly, lm] = lastDay.split("-").map(Number);
    return (ly - ty) * 12 + (lm - tm);
  }, [today, lastDay]);

  function dayState(d: string): "ok" | "full" | "closed" | "past" {
    if (d < today) return "past";
    if (d > lastDay || !openWeekdays.includes(weekdayOf(d))) return "closed";
    if (!availability) return "closed";
    return (availability[d] ?? 0) > 0 ? "ok" : "full";
  }

  function pickDate(d: string) {
    if (d === date) return;
    setDate(d);
    setTime("");
    setErrors((e) => ({ ...e, date: undefined }));
    setServerError("");
  }

  // ------------------------------------------------------------------ step control
  function fieldErrorsFor(keys: (keyof FieldErrors)[]) {
    const result = validateBooking({ fullName, phone, email, notes, date, time, paymentMethod, consent });
    const picked: FieldErrors = {};
    for (const k of keys) if (result.errors[k]) picked[k] = result.errors[k];
    return picked;
  }

  /** Validates one text field against the same rules the server uses */
  function validateOne(key: TextKey, overrides: Partial<Record<TextKey, string>> = {}) {
    const result = validateBooking({ fullName, phone, email, notes, date: "x", time: "x", paymentMethod, consent, ...overrides });
    return result.errors[key];
  }

  function onChangeText(key: TextKey, value: string, set: (v: string) => void) {
    set(value);
    // once a field has been visited (or flagged), re-check on every keystroke so errors clear as soon as it is fixed
    if (touched[key] || errors[key]) setErrors((e) => ({ ...e, [key]: validateOne(key, { [key]: value }) }));
  }

  function onBlurText(key: TextKey) {
    let value = { fullName, phone, email, notes }[key];
    if (key === "fullName") {
      value = fullName.trim().replace(/\s+/g, " ");
      // all-lowercase Latin names get capital letters; names typed with their own capitals are left alone
      if (/^[a-z .'-]+$/.test(value)) value = value.replace(/(^|[\s'-])([a-z])/g, (_m, sep: string, ch: string) => sep + ch.toUpperCase());
      setFullName(value);
    } else if (key === "email") {
      value = email.trim().toLowerCase();
      setEmail(value);
    } else if (key === "notes") {
      value = notes.trim();
      setNotes(value);
    }
    setTouched((t) => ({ ...t, [key]: true }));
    // an untouched optional field that is still empty is not an error
    setErrors((e) => ({ ...e, [key]: value || key !== "notes" ? validateOne(key, { [key]: value }) : undefined }));
  }

  async function goNext() {
    setServerError("");
    if (step === 1) {
      const e = fieldErrorsFor(["date"]);
      if (Object.keys(e).length) {
        setErrors(e);
        return;
      }
      setErrors({});
      // make sure nobody took this slot while the page was open
      setChecking(true);
      const fresh = await fetchSlots(date);
      setChecking(false);
      if (fresh) {
        setSlots(fresh);
        if (!fresh.find((s) => s.time === time)?.available) {
          setConflict({ date, time });
          setTime("");
          loadAvailability();
          return;
        }
      }
      setStep(2);
      scrollToTop();
    } else if (step === 2) {
      setTouched({ fullName: true, phone: true, email: true, notes: true });
      const e = fieldErrorsFor(["fullName", "phone", "email", "notes"]);
      if (Object.keys(e).length) {
        setErrors(e);
        const first = (["fullName", "phone", "email", "notes"] as const).find((k) => e[k]);
        if (first) document.getElementById(first)?.focus();
        return;
      }
      setErrors({});
      setStep(3);
      scrollToTop();
    }
  }

  function goBack() {
    setServerError("");
    setErrors({});
    setStep((s) => (s === 3 ? 2 : 1));
    scrollToTop();
  }

  // ------------------------------------------------------------------ slip
  function acceptSlip(file: File | undefined | null) {
    if (!file) return;
    if (!SLIP_TYPES.includes(file.type)) {
      setErrors((e) => ({ ...e, slip: "Please upload a JPG, PNG, WebP image or a PDF." }));
      return;
    }
    if (file.size > slipMaxMb * 1024 * 1024) {
      setErrors((e) => ({ ...e, slip: `That file is too large. Maximum size is ${slipMaxMb} MB.` }));
      return;
    }
    setErrors((e) => ({ ...e, slip: undefined }));
    setSlip(file);
  }

  function removeSlip() {
    setSlip(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      /* clipboard blocked: the number is still visible to copy by hand */
    }
  }

  // ------------------------------------------------------------------ submit
  async function submit() {
    if (submitting) return;
    setServerError("");

    const result = validateBooking({ fullName, phone, email, notes, date, time, paymentMethod, consent });
    const e: FieldErrors = { ...result.errors };
    if (paymentMethod === "bank_transfer" && !slip) e.slip = "Please upload your payment slip, or choose “Pay at TRACE”.";
    if (Object.keys(e).length) {
      setErrors(e);
      if (e.date) {
        setStep(1);
        scrollToTop();
      } else if (e.fullName || e.phone || e.email || e.notes) {
        setStep(2);
        scrollToTop();
      }
      return;
    }

    const body = new FormData();
    body.append("fullName", fullName);
    body.append("phone", phone);
    body.append("email", email);
    body.append("notes", notes);
    body.append("date", date);
    body.append("time", time);
    body.append("paymentMethod", paymentMethod);
    body.append("consent", String(consent));
    body.append("website", website);
    if (paymentMethod === "bank_transfer" && slip) body.append("slip", slip);

    setSubmitting(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60_000);
    try {
      const res = await fetch("/api/bookings", { method: "POST", body, signal: controller.signal });
      let data: { ok?: boolean; message?: string; errors?: FieldErrors; booking?: Done; payhere?: PayherePayload } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON (e.g. proxy error page) handled below */
      }

      if (res.ok && data.ok && data.booking && data.payhere) {
        // card booking saved (slot held): hand over to PayHere's secure checkout
        redirectingRef.current = true;
        setRedirecting(true);
        submitToPayhere(data.payhere);
        return;
      }
      if (res.ok && data.ok && data.booking) {
        setDone({ ...data.booking, date, time, paymentMethod });
        scrollToTop();
        return;
      }
      if (res.status === 413) {
        setErrors({ slip: `The slip is too large. Please upload a file under ${slipMaxMb} MB.` });
        setServerError("The slip file is too large.");
      } else if (res.status === 409) {
        setConflict({ date, time });
        setTime("");
        setStep(1);
        loadAvailability();
        if (date) loadSlots(date);
        scrollToTop();
      } else if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setServerError(data.message || "Please fix the highlighted fields.");
        if (data.errors.date) setStep(1);
        else if (data.errors.fullName || data.errors.phone || data.errors.email || data.errors.notes) setStep(2);
      } else {
        setServerError(data.message || "Something went wrong. Your booking was not saved. Please try again.");
      }
    } catch (err) {
      setServerError(
        err instanceof DOMException && err.name === "AbortError"
          ? "The request took too long. Please check your connection and try again."
          : "We could not reach the server. Please check your connection and try again."
      );
    } finally {
      clearTimeout(timer);
      setSubmitting((cur) => (redirectingRef.current ? cur : false));
    }
  }

  // ------------------------------------------------------------------ success
  if (done) {
    const steps = [
      "Our team will call you shortly to confirm your appointment time.",
      `Come to ${venueName} on the day of your appointment.`,
      done.slipUploaded
        ? "We will verify your payment slip. Nothing more to pay."
        : `Pay ${money(priceLkr)} at the venue before your test.`,
      "Take the ~15 minute test, with a doctor present where possible.",
      "We share your report and feedback, and follow up if needed.",
    ];
    const receipt = {
      ref: done.ref,
      fullName,
      phone,
      date: done.date,
      time: done.time,
      venueName,
      venueAddress,
      priceLkr,
      paymentLabel: done.slipUploaded ? "Slip uploaded, pending verification" : done.paymentMethod === "bank_transfer" ? "Bank transfer" : "Pay at the venue",
      slotMinutes,
    };
    return (
      <div ref={topRef} className="mx-auto max-w-2xl px-4 sm:px-6">
        <div ref={successRef} className="overflow-hidden rounded-3xl border border-[#ede8f5] bg-white shadow-xl shadow-purple-900/5">
          <div className="flex justify-center bg-white pb-4 pt-7">
            <div
              role="img"
              aria-label="Jendo"
              className="h-[40px] w-[160px]"
              style={{ backgroundImage: "url(/jendo-icon.png)", backgroundSize: "222px 222px", backgroundPosition: "-31px -89px", backgroundRepeat: "no-repeat" }}
            />
          </div>
          <div className="px-6 py-10 text-center sm:px-10" style={{ background: "linear-gradient(135deg,#2d0a3e 0%,#4a1260 50%,#893A9F 100%)" }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <CheckCircle2 className="h-9 w-9 text-white" />
            </div>
            <h1 className="!text-2xl !font-bold text-white sm:!text-3xl" style={font}>Booking received</h1>
            <p className="mt-2 text-sm text-white/80 sm:text-base" style={font}>
              Thank you, {fullName.split(" ")[0]}. We will call you to confirm.
            </p>
          </div>

          <div className="space-y-6 p-6 sm:p-10">
            <div className="rounded-2xl bg-[#f6f1fa] p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={font}>Your booking reference</p>
              <p className="mt-1 text-3xl font-extrabold tracking-wider text-[#2d0a3e]" style={font}>{done.ref}</p>
              <p className="mt-1 text-xs text-gray-500">Please keep this reference handy.</p>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-2" style={font}>
              <div className="flex items-start gap-3 rounded-xl border border-[#ede8f5] p-4">
                <CalendarDays className="mt-0.5 h-5 w-5 text-[#893A9F]" />
                <div><dt className="text-xs text-gray-500">Date</dt><dd className="font-semibold text-gray-900">{formatDateLong(done.date)}</dd></div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#ede8f5] p-4">
                <Clock className="mt-0.5 h-5 w-5 text-[#893A9F]" />
                <div><dt className="text-xs text-gray-500">Time</dt><dd className="font-semibold text-gray-900">{formatTime12h(done.time)}</dd></div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#ede8f5] p-4">
                <MapPin className="mt-0.5 h-5 w-5 text-[#893A9F]" />
                <div><dt className="text-xs text-gray-500">Where</dt><dd className="font-semibold text-gray-900">{venueName}</dd><dd className="text-xs text-gray-500">{venueAddress}</dd></div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#ede8f5] p-4">
                <CreditCard className="mt-0.5 h-5 w-5 text-[#893A9F]" />
                <div>
                  <dt className="text-xs text-gray-500">Payment</dt>
                  <dd className="font-semibold text-gray-900">{done.slipUploaded ? "Slip uploaded, pending verification" : `${money(priceLkr)} at the venue`}</dd>
                </div>
              </div>
            </dl>

            <div>
              <h2 className="!text-lg !font-bold text-gray-900" style={font}>What happens next</h2>
              <ol className="mt-3 space-y-3">
                {steps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-sm text-gray-600 sm:text-base" style={font}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: PURPLE }}>{i + 1}</span>
                    <span className="!text-sm sm:!text-base">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={pdfBusy}
                onClick={async () => {
                  setPdfBusy(true);
                  setPdfError("");
                  try {
                    await downloadReceiptPdf(receipt, getComputedStyle(successRef.current ?? document.body).fontFamily);
                  } catch {
                    setPdfError("We could not create the PDF on this device. Please take a screenshot of this page instead.");
                  } finally {
                    setPdfBusy(false);
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-[#893A9F] px-5 py-3 text-sm font-bold text-[#893A9F] transition hover:bg-[#f6f1fa] disabled:opacity-60"
                style={font}
              >
                {pdfBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download PDF
              </button>
              <button
                type="button"
                onClick={() => downloadCalendarFile(receipt)}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                style={font}
              >
                <CalendarPlus className="h-4 w-4" /> Add to calendar
              </button>
            </div>
            {pdfError && <p role="alert" className="text-sm text-red-600">{pdfError}</p>}

            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#893A9F,#4a1260)", ...font }}
            >
              Back to Jendo home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------ form
  const stepLabels = ["Date & time", "Your details", "Payment"];

  return (
    <div ref={topRef} className="mx-auto max-w-6xl scroll-mt-28 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#893A9F]" style={font}>
          <span className="h-px w-8 bg-[#893A9F]" /> Book a test
        </p>
        <h1 className="!text-3xl !font-extrabold text-[#2d0a3e] sm:!text-4xl" style={font}>Book your Jendo vascular health test</h1>
        <p className="mt-3 !text-base text-gray-600" style={font}>
          A non-invasive, AI-powered screening at {venueName}. It takes about {testMinutes} minutes. Pick a time, tell us how to reach you, and our team will call to confirm.
        </p>
      </div>

      {redirecting && (
        <div role="status" aria-live="polite" className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-3 bg-white/95 px-6 text-center backdrop-blur-sm">
          <Loader2 className="h-9 w-9 animate-spin text-[#893A9F]" />
          <p className="!text-lg font-bold text-[#2d0a3e]" style={font}>Taking you to PayHere&apos;s secure payment page…</p>
          <p className="max-w-sm !text-sm text-gray-500" style={font}>Please do not close this window. Your time slot is held for {cardHoldMinutes} minutes.</p>
        </div>
      )}

      {conflict && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={() => setConflict(null)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="taken-title"
            aria-describedby="taken-desc"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <h2 id="taken-title" className="!text-xl !font-extrabold text-[#2d0a3e]" style={font}>That time is already booked</h2>
            <p id="taken-desc" className="mt-2 !text-sm text-gray-600" style={font}>
              Someone else has just booked <strong>{formatDateLong(conflict.date)}</strong> at <strong>{formatTime12h(conflict.time)}</strong>.
              Please choose another time. Your details are kept, so you will not need to type them again.
            </p>
            <button
              ref={dialogBtnRef}
              type="button"
              onClick={() => { setConflict(null); setStep(1); scrollToTop(); }}
              className="mt-6 w-full rounded-full px-6 py-3 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#893A9F,#4a1260)", ...font }}
            >
              Choose another time
            </button>
          </div>
        </div>
      )}

      {/* Stepper */}
      <ol className="mb-8 grid grid-cols-3 gap-2 sm:gap-4" aria-label="Booking progress">
        {stepLabels.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const complete = step > n;
          return (
            <li key={label} className="flex items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                  complete || active ? "text-white" : "bg-gray-200 text-gray-500"
                }`}
                style={complete || active ? { background: PURPLE } : undefined}
              >
                {complete ? <Check className="h-4 w-4" /> : n}
              </span>
              <span className={`text-xs font-semibold sm:text-sm ${active ? "text-[#2d0a3e]" : "text-gray-500"}`} style={font}>{label}</span>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="rounded-3xl border border-[#ede8f5] bg-white p-5 shadow-sm sm:p-8">
          {serverError && (
            <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* ---------------- STEP 1 ---------------- */}
          {step === 1 && (
            <section aria-labelledby="step1-title">
              <h2 id="step1-title" className="!text-xl !font-bold text-[#2d0a3e]" style={font}>Choose a date and time</h2>
              <p className="mt-1 text-sm text-gray-500">Times are in Sri Lanka time. Bookings need at least 12 hours notice.</p>

              {availabilityError ? (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <p>{availabilityError}</p>
                  <button type="button" onClick={loadAvailability} className="mt-2 font-semibold underline">Try again</button>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMonthOffset((o) => Math.max(0, o - 1))}
                      disabled={monthOffset === 0}
                      aria-label="Previous month"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <p className="font-bold text-gray-900" style={font}>{MONTHS[month.m]} {month.y}</p>
                    <button
                      type="button"
                      onClick={() => setMonthOffset((o) => Math.min(lastMonthOffset, o + 1))}
                      disabled={monthOffset >= lastMonthOffset}
                      aria-label="Next month"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400" aria-hidden="true">
                    {WEEKDAYS.map((w) => <div key={w} className="py-1">{w}</div>)}
                  </div>
                  <div className="mt-1 grid grid-cols-7 gap-1" role="grid" aria-label="Choose a date">
                    {month.cells.map((d, i) => {
                      if (!d) return <div key={`b${i}`} />;
                      const state = availability ? dayState(d) : "closed";
                      const selected = d === date;
                      const clickable = state === "ok";
                      return (
                        <button
                          key={d}
                          type="button"
                          disabled={!clickable}
                          onClick={() => pickDate(d)}
                          aria-pressed={selected}
                          aria-label={`${formatDateLong(d)}${state === "full" ? ", fully booked" : ""}`}
                          className={`relative h-11 rounded-xl text-sm font-semibold transition sm:h-12 ${
                            selected
                              ? "text-white shadow-md"
                              : clickable
                                ? "bg-[#f6f1fa] text-[#2d0a3e] hover:bg-[#ebdff3]"
                                : "text-gray-300"
                          } ${state === "full" ? "line-through" : ""}`}
                          style={selected ? { background: PURPLE } : undefined}
                        >
                          {Number(d.slice(8))}
                          {d === today && !selected && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#893A9F]" />}
                        </button>
                      );
                    })}
                  </div>
                  {!availability && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading available dates…</p>
                  )}
                </div>
              )}

              {date && (
                <div className="mt-8">
                  <h3 className="!text-base !font-bold text-gray-900" style={font}>Available times on {formatDateLong(date)}</h3>
                  {slotsLoading && <p className="mt-3 flex items-center gap-2 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading times…</p>}
                  {slotsError && (
                    <p className="mt-3 text-sm text-red-600">
                      {slotsError}{" "}
                      <button type="button" onClick={() => loadSlots(date)} className="font-semibold underline">Retry</button>
                    </p>
                  )}
                  {slots && (
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label="Available times">
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => { setTime(s.time); setErrors((e) => ({ ...e, date: undefined })); }}
                          aria-pressed={time === s.time}
                          className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${
                            time === s.time
                              ? "border-transparent text-white shadow-md"
                              : s.available
                                ? "border-gray-200 text-gray-800 hover:border-[#893A9F] hover:text-[#893A9F]"
                                : "border-gray-100 bg-gray-50 text-gray-300 line-through"
                          }`}
                          style={time === s.time ? { background: PURPLE } : undefined}
                        >
                          {formatTime12h(s.time)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {errors.date && (
                <p role="alert" className="mt-4 flex items-center gap-1.5 text-sm text-red-600"><AlertCircle className="h-4 w-4" /> {errors.date}</p>
              )}
            </section>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 2 && (
            <section aria-labelledby="step2-title" className="space-y-5">
              <div>
                <h2 id="step2-title" className="!text-xl !font-bold text-[#2d0a3e]" style={font}>Your details</h2>
                <p className="mt-1 text-sm text-gray-500">
                  We will call you to confirm your appointment. Fields marked <span className="font-bold text-red-600">*</span> are required.
                </p>
              </div>

              <Field label="Full name" htmlFor="fullName" required error={errors.fullName} valid={!!touched.fullName && !!fullName}>
                <input
                  id="fullName" name="fullName" type="text" autoComplete="name" autoCapitalize="words" value={fullName}
                  onChange={(e) => onChangeText("fullName", e.target.value, setFullName)}
                  onBlur={() => onBlurText("fullName")}
                  className={inputClass(!!errors.fullName)} placeholder="e.g. Nimal Perera" maxLength={80}
                  required aria-required="true" aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined}
                />
              </Field>

              <Field label="Mobile number" htmlFor="phone" required error={errors.phone} hint="We will call this number, e.g. 077 123 4567." valid={!!touched.phone && !!phone}>
                <input
                  id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone}
                  onChange={(e) => onChangeText("phone", formatPhoneInput(e.target.value), setPhone)}
                  onBlur={() => onBlurText("phone")}
                  className={inputClass(!!errors.phone)} placeholder="077 123 4567" maxLength={20}
                  required aria-required="true" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </Field>

              <div>
                <Field label="Email" htmlFor="email" required error={errors.email} hint="We will email your booking confirmation and updates here." valid={!!touched.email && !!email}>
                  <input
                    id="email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} value={email}
                    onChange={(e) => onChangeText("email", e.target.value, setEmail)}
                    onBlur={() => onBlurText("email")}
                    className={inputClass(!!errors.email)} placeholder="you@example.com" maxLength={120}
                    required aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </Field>
                {!errors.email && touched.email && suggestEmailFix(email) && (
                  <p className="mt-1.5 text-sm text-amber-700">
                    Did you mean{" "}
                    <button type="button" className="font-semibold underline" onClick={() => { const fix = suggestEmailFix(email)!; setEmail(fix); setErrors((e) => ({ ...e, email: undefined })); }}>
                      {suggestEmailFix(email)}
                    </button>
                    ?
                  </p>
                )}
              </div>

              <Field label="Anything we should know?" htmlFor="notes" error={errors.notes} optional hint={`${notes.length}/500`}>
                <textarea
                  id="notes" name="notes" rows={3} value={notes} maxLength={500}
                  onChange={(e) => onChangeText("notes", e.target.value, setNotes)}
                  onBlur={() => onBlurText("notes")}
                  className={inputClass(!!errors.notes)} placeholder="Medical history, medications, or questions for the doctor"
                />
              </Field>
            </section>
          )}

          {/* ---------------- STEP 3 ---------------- */}
          {step === 3 && (
            <section aria-labelledby="step3-title" className="space-y-6">
              <div>
                <h2 id="step3-title" className="!text-xl !font-bold text-[#2d0a3e]" style={font}>Payment</h2>
                <p className="mt-1 text-sm text-gray-500">The test fee is {money(priceLkr)}. Pay online now or at {venueName} on the day.</p>
              </div>

              <div role="radiogroup" aria-label="Payment option" className={`grid gap-3 ${cardEnabled ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                {([
                  ...(cardEnabled ? [{ id: "card", title: "Pay by card", desc: "Visa or Mastercard, secure PayHere checkout", icon: CreditCard }] : []),
                  { id: "bank_transfer", title: "Bank transfer", desc: "Transfer, then upload your slip", icon: Upload },
                  { id: "pay_at_venue", title: `Pay at ${venueName.split(",")[0]}`, desc: "Pay when you arrive for the test", icon: MapPin },
                ] as { id: PaymentMethod; title: string; desc: string; icon: typeof CreditCard }[]).map((o) => {
                  const selected = paymentMethod === o.id;
                  return (
                    <button
                      key={o.id} type="button" role="radio" aria-checked={selected}
                      onClick={() => { setPaymentMethod(o.id); setErrors((e) => ({ ...e, slip: undefined })); }}
                      className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${selected ? "border-[#893A9F] bg-[#f6f1fa]" : "border-gray-200 hover:border-[#893A9F]/50"}`}
                    >
                      <o.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#893A9F]" />
                      <span>
                        <span className="block text-sm font-bold text-gray-900" style={font}>{o.title}</span>
                        <span className="block text-xs text-gray-500">{o.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-2 rounded-2xl border border-[#ede8f5] bg-[#fbf9fd] p-5 text-sm text-gray-700">
                  <p className="flex items-center gap-2 font-bold text-gray-900" style={font}><Lock className="h-4 w-4 text-[#893A9F]" /> Secure card payment with PayHere</p>
                  <ul className="list-disc space-y-1 pl-5 text-gray-600">
                    <li>You will be taken to PayHere to pay {money(priceLkr)} by Visa or Mastercard.</li>
                    <li>Your time slot is held for {cardHoldMinutes} minutes while you pay.</li>
                    <li>Jendo never sees or stores your card details.</li>
                    <li>You get a confirmation email as soon as the payment is received.</li>
                  </ul>
                </div>
              )}

              {paymentMethod === "bank_transfer" && (
                <div className="space-y-5 rounded-2xl border border-[#ede8f5] bg-[#fbf9fd] p-5">
                  {bank ? (
                    <div>
                      <p className="text-sm font-bold text-gray-900" style={font}>1. Transfer {money(priceLkr)} to</p>
                      <dl className="mt-3 space-y-2 text-sm">
                        {[
                          ...(bank.bankName ? [["Bank", bank.bankName, "bank"]] : []),
                          ["Account name", bank.accountName, "name"],
                          ["Account number", bank.accountNumber, "number"],
                          ...(bank.branch ? [["Branch", bank.branch, "branch"]] : []),
                        ].map(([k, v, key]) => (
                          <div key={key} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2">
                            <div><dt className="text-xs text-gray-500">{k}</dt><dd className={`font-semibold text-gray-900 ${key === "number" ? "text-base tracking-wider" : ""}`}>{v}</dd></div>
                            <button type="button" onClick={() => copy(v, key)} aria-label={`Copy ${k}`} className="flex items-center gap-1 text-xs font-semibold text-[#893A9F]">
                              {copied === key ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                            </button>
                          </div>
                        ))}
                      </dl>
                      {bank.note && <p className="mt-2 text-xs text-gray-500">{bank.note}</p>}
                    </div>
                  ) : (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                      Our team will share the bank details when they call you. You can upload your slip below afterwards, or choose “Pay at TRACE”.
                    </p>
                  )}

                  <div>
                    <p className="text-sm font-bold text-gray-900" style={font}>{bank ? "2. " : ""}Upload your payment slip</p>
                    <input
                      ref={fileRef} id="slip" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                      className="sr-only" onChange={(e) => acceptSlip(e.target.files?.[0])}
                    />
                    {!slip ? (
                      <label
                        htmlFor="slip"
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setDragging(false); acceptSlip(e.dataTransfer.files?.[0]); }}
                        className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                          dragging ? "border-[#893A9F] bg-[#f6f1fa]" : errors.slip ? "border-red-300 bg-red-50/40" : "border-gray-300 bg-white hover:border-[#893A9F]"
                        }`}
                      >
                        <Upload className="h-7 w-7 text-[#893A9F]" />
                        <span className="text-sm font-semibold text-gray-800">Tap to choose a file or drop it here</span>
                        <span className="text-xs text-gray-500">JPG, PNG, WebP or PDF, up to {slipMaxMb} MB</span>
                      </label>
                    ) : (
                      <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                        {slipPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={slipPreview} alt="Payment slip preview" className="h-16 w-16 rounded-lg object-cover" />
                        ) : (
                          <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#f6f1fa]"><FileText className="h-7 w-7 text-[#893A9F]" /></span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900">{slip.name}</p>
                          <p className="text-xs text-gray-500">{(slip.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button type="button" onClick={removeSlip} aria-label="Remove slip" className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {errors.slip && (
                      <p role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-red-600"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {errors.slip}</p>
                    )}
                  </div>
                </div>
              )}

              {/* honeypot: hidden from people, bots fill it */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox" checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setErrors((x) => ({ ...x, consent: undefined })); }}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 accent-[#893A9F]"
                    aria-invalid={!!errors.consent}
                  />
                  <span>I agree that Jendo may call me on the number above to confirm my appointment and share my results.</span>
                </label>
                {errors.consent && (
                  <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-red-600"><AlertCircle className="h-4 w-4" /> {errors.consent}</p>
                )}
              </div>
            </section>
          )}

          {/* ---------------- actions ---------------- */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button type="button" onClick={goBack} disabled={submitting} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50" style={font}>
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : <span />}

            {step < 3 ? (
              <button type="button" onClick={goNext} disabled={(step === 1 && (!date || !time)) || checking} className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none" style={{ background: "linear-gradient(135deg,#893A9F,#4a1260)", ...font }}>
                {checking ? <><Loader2 className="h-4 w-4 animate-spin" /> Checking…</> : <>Continue <ArrowRight className="h-4 w-4" /></>}
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={submitting} className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70" style={{ background: "linear-gradient(135deg,#893A9F,#4a1260)", ...font }}>
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {paymentMethod === "card" ? "Opening PayHere…" : "Booking…"}</> : paymentMethod === "card" ? <>Continue to payment <Lock className="h-4 w-4" /></> : <>Confirm booking <Check className="h-4 w-4" /></>}
              </button>
            )}
          </div>
        </div>

        {/* ---------------- summary ---------------- */}
        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-3xl border border-[#ede8f5] bg-white p-6 shadow-sm">
            <h2 className="!text-base !font-bold text-[#2d0a3e]" style={font}>Your appointment</h2>
            <ul className="mt-4 space-y-3 text-sm" style={font}>
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#893A9F]" /><span className="text-gray-700">{venueName}<span className="block text-xs text-gray-500">{venueAddress}</span></span></li>
              <li className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#893A9F]" />
                <span className={date ? "font-semibold text-gray-900" : "text-gray-400"}>{date ? formatDateLong(date) : "Choose a date"}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#893A9F]" />
                <span className={time ? "font-semibold text-gray-900" : "text-gray-400"}>{time ? formatTime12h(time) : "Choose a time"}</span>
              </li>
              {fullName && step > 1 && <li className="flex items-start gap-3"><User className="mt-0.5 h-4 w-4 shrink-0 text-[#893A9F]" /><span className="text-gray-700">{fullName}</span></li>}
              {phone && step > 2 && <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#893A9F]" /><span className="text-gray-700">{phone}</span></li>}
            </ul>
            <div className="mt-5 flex items-center justify-between border-t border-[#ede8f5] pt-4">
              <span className="text-sm text-gray-500">Test fee</span>
              <span className="text-xl font-extrabold text-[#2d0a3e]" style={font}>{money(priceLkr)}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-[#ede8f5] bg-white p-6 text-sm text-gray-600 shadow-sm" style={font}>
            <p className="mb-3 flex items-center gap-2 font-bold text-[#2d0a3e]"><ShieldCheck className="h-4 w-4 text-[#893A9F]" /> How it works</p>
            <ol className="list-decimal space-y-1.5 pl-5 !text-sm">
              <li>Book online</li>
              <li>We call you to confirm the time</li>
              <li>Visit {venueName.split(",")[0]} on the day</li>
              <li>Pay {money(priceLkr)} (online or at the venue)</li>
              <li>Take the test, with a doctor present</li>
              <li>Get your report and feedback</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
