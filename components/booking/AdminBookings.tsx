"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  BellRing,
  CalendarClock,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  FileCheck2,
  Loader2,
  LogOut,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";
import { formatDateLong, formatTime12h } from "@/lib/booking/time";

type Booking = {
  id: string;
  ref: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  appointment_date: string;
  slot_time: string;
  amount_lkr: number;
  status: "new" | "confirmed" | "completed" | "no_show" | "cancelled";
  payment_status: "unpaid" | "slip_uploaded" | "paid";
  payment_method: "pay_at_venue" | "bank_transfer";
  has_slip: boolean;
  slip_mime: string | null;
  slip_uploaded_at: string | null;
  admin_notes: string | null;
  follow_up_on: string | null;
  created_at: string;
};
type Counts = { new_count: number; upcoming: number; slips_to_verify: number; follow_ups_due: number };

const font = { fontFamily: "var(--font-red-hat-display),sans-serif" } as const;

const STATUS_LABEL: Record<Booking["status"], string> = {
  new: "New",
  confirmed: "Confirmed",
  completed: "Completed",
  no_show: "No-show",
  cancelled: "Cancelled",
};
const STATUS_STYLE: Record<Booking["status"], string> = {
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  no_show: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};
const PAY_LABEL: Record<Booking["payment_status"], string> = {
  unpaid: "Unpaid",
  slip_uploaded: "Slip to verify",
  paid: "Paid",
};
const PAY_STYLE: Record<Booking["payment_status"], string> = {
  unpaid: "bg-gray-100 text-gray-600",
  slip_uploaded: "bg-purple-100 text-purple-800",
  paid: "bg-emerald-100 text-emerald-800",
};

const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

export function AdminBookings({ slotTimes }: { slotTimes: string[] }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [items, setItems] = useState<Booking[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [date, setDate] = useState("");
  const [upcoming, setUpcoming] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const knownNew = useRef<number | null>(null);
  const [newAlert, setNewAlert] = useState(0);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (status) p.set("status", status);
    if (payment) p.set("payment", payment);
    if (date) p.set("date", date);
    else if (upcoming) p.set("upcoming", "1");
    return p.toString();
  }, [q, status, payment, date, upcoming]);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`/api/admin/bookings?${query}`, { cache: "no-store" });
        if (res.status === 401) {
          setAuthed(false);
          return;
        }
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || "Could not load bookings.");
        setAuthed(true);
        setItems(data.items);
        setCounts(data.counts);
        setError("");
        setLastLoaded(new Date());
        // alert when new bookings arrive while the panel is open
        if (knownNew.current !== null && data.counts.new_count > knownNew.current) {
          setNewAlert(data.counts.new_count - knownNew.current);
        }
        knownNew.current = data.counts.new_count;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load bookings.");
        setAuthed((a) => (a === null ? true : a));
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    const t = setTimeout(() => load(), q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => load(true), 30_000);
    return () => clearInterval(id);
  }, [authed, load]);

  useEffect(() => {
    document.title = counts && counts.new_count > 0 ? `(${counts.new_count}) Bookings admin | Jendo` : "Bookings admin | Jendo";
  }, [counts]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/bookings/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLoginError(data.message || "Login failed.");
        return;
      }
      setPassword("");
      setAuthed(true);
      load();
    } catch {
      setLoginError("Could not reach the server.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/bookings/logout", { method: "POST" });
    setAuthed(false);
    setItems([]);
    setCounts(null);
    knownNew.current = null;
  }

  async function patch(id: string, body: Record<string, unknown>): Promise<string | null> {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        setAuthed(false);
        return "Your session expired. Please sign in again.";
      }
      const data = await res.json();
      if (!res.ok || !data.ok) return data.message || "Update failed.";
      setItems((list) => list.map((b) => (b.id === id ? data.item : b)));
      load(true);
      return null;
    } catch {
      return "Could not reach the server.";
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<string, Booking[]>();
    items.forEach((b) => map.set(b.appointment_date, [...(map.get(b.appointment_date) ?? []), b]));
    return Array.from(map.entries());
  }, [items]);

  // ---------------------------------------------------------------- login screen
  if (authed === null) {
    return <div className="flex justify-center py-32"><Loader2 className="h-6 w-6 animate-spin text-[#893A9F]" /></div>;
  }
  if (authed === false) {
    return (
      <div className="mx-auto max-w-sm px-4 pt-16">
        <form onSubmit={login} className="space-y-4 rounded-3xl border border-[#ede8f5] bg-white p-8 shadow-sm">
          <h1 className="!text-2xl !font-bold text-[#2d0a3e]" style={font}>Bookings admin</h1>
          <p className="text-sm text-gray-500">Sign in to see and manage test bookings.</p>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-gray-800">Password</label>
            <input
              id="admin-password" type="password" autoComplete="current-password" autoFocus value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#893A9F] focus:ring-4 focus:ring-[#893A9F]/15"
            />
          </div>
          {loginError && <p role="alert" className="flex items-center gap-1.5 text-sm text-red-600"><AlertCircle className="h-4 w-4" /> {loginError}</p>}
          <button
            type="submit" disabled={loggingIn || !password}
            className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#893A9F,#4a1260)", ...font }}
          >
            {loggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Sign in
          </button>
        </form>
      </div>
    );
  }

  // ---------------------------------------------------------------- dashboard
  const stat = (label: string, value: number | undefined, tone: string, onClick?: () => void) => (
    <button type="button" onClick={onClick} className={`rounded-2xl border border-[#ede8f5] bg-white p-4 text-left shadow-sm transition ${onClick ? "hover:-translate-y-0.5 hover:shadow-md" : "cursor-default"}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500" style={font}>{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${tone}`} style={font}>{value ?? "–"}</p>
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="!text-2xl !font-extrabold text-[#2d0a3e] sm:!text-3xl" style={font}>Test bookings</h1>
          <p className="text-sm text-gray-500">
            TRACE appointments{lastLoaded ? ` · updated ${lastLoaded.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => load()} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <a href={`/api/admin/bookings?${query}&format=csv`} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" /> Export CSV
          </a>
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {newAlert > 0 && (
        <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="flex items-center gap-2 font-semibold"><BellRing className="h-4 w-4" /> {newAlert} new booking{newAlert > 1 ? "s" : ""} just arrived. Please call to confirm.</span>
          <button type="button" onClick={() => setNewAlert(0)} className="font-semibold underline">Dismiss</button>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stat("New (to call)", counts?.new_count, "text-amber-600", () => { setStatus("new"); setPayment(""); setDate(""); setUpcoming(false); })}
        {stat("Upcoming", counts?.upcoming, "text-[#893A9F]", () => { setStatus(""); setPayment(""); setDate(""); setUpcoming(true); })}
        {stat("Slips to verify", counts?.slips_to_verify, "text-purple-700", () => { setStatus(""); setPayment("slip_uploaded"); setDate(""); setUpcoming(false); })}
        {stat("Follow-ups due", counts?.follow_ups_due, "text-emerald-600")}
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border border-[#ede8f5] bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, ref…" aria-label="Search bookings"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#893A9F]" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#893A9F]">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={payment} onChange={(e) => setPayment(e.target.value)} aria-label="Filter by payment" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#893A9F]">
          <option value="">All payments</option>
          {Object.entries(PAY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Filter by date" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#893A9F]" />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={upcoming && !date} disabled={!!date} onChange={(e) => setUpcoming(e.target.checked)} className="h-4 w-4 accent-[#893A9F]" />
          Upcoming only
        </label>
      </div>

      {error && <p role="alert" className="mb-4 flex items-center gap-2 text-sm text-red-600"><AlertCircle className="h-4 w-4" /> {error}</p>}

      {!loading && items.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">No bookings match these filters.</div>
      )}

      <div className="space-y-6">
        {grouped.map(([day, list]) => (
          <section key={day} aria-label={formatDateLong(day)}>
            <h2 className="mb-2 flex items-center gap-2 !text-sm !font-bold uppercase tracking-wider text-gray-500" style={font}>
              <CalendarClock className="h-4 w-4 text-[#893A9F]" /> {formatDateLong(day)} <span className="font-normal normal-case">· {list.length}</span>
            </h2>
            <ul className="space-y-2">
              {list.map((b) => (
                <BookingRowItem key={b.id} b={b} open={openId === b.id} onToggle={() => setOpenId(openId === b.id ? null : b.id)} patch={patch} slotTimes={slotTimes} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</span>;
}

function BookingRowItem({
  b, open, onToggle, patch, slotTimes,
}: {
  b: Booking;
  open: boolean;
  onToggle: () => void;
  patch: (id: string, body: Record<string, unknown>) => Promise<string | null>;
  slotTimes: string[];
}) {
  const [notes, setNotes] = useState(b.admin_notes ?? "");
  const [followUp, setFollowUp] = useState(b.follow_up_on ?? "");
  const [rDate, setRDate] = useState(b.appointment_date);
  const [rTime, setRTime] = useState(b.slot_time);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setNotes(b.admin_notes ?? "");
    setFollowUp(b.follow_up_on ?? "");
    setRDate(b.appointment_date);
    setRTime(b.slot_time);
  }, [b.admin_notes, b.follow_up_on, b.appointment_date, b.slot_time]);

  async function run(label: string, body: Record<string, unknown>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(label);
    setMsg(null);
    const err = await patch(b.id, body);
    setBusy("");
    setMsg(err ? { ok: false, text: err } : { ok: true, text: "Saved" });
  }

  const actionBtn = "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition disabled:opacity-50";

  return (
    <li className="overflow-hidden rounded-2xl border border-[#ede8f5] bg-white shadow-sm">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:gap-4">
        <span className="w-[74px] shrink-0 text-sm font-extrabold text-[#2d0a3e]" style={font}>{formatTime12h(b.slot_time)}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-gray-900" style={font}>{b.full_name}</span>
          <span className="block truncate text-xs text-gray-500">{b.phone} · {b.ref}</span>
        </span>
        <span className="hidden flex-wrap justify-end gap-1.5 sm:flex">
          <Badge className={STATUS_STYLE[b.status]}>{STATUS_LABEL[b.status]}</Badge>
          <Badge className={PAY_STYLE[b.payment_status]}>{PAY_LABEL[b.payment_status]}</Badge>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="flex gap-1.5 px-4 pb-3 sm:hidden">
        <Badge className={STATUS_STYLE[b.status]}>{STATUS_LABEL[b.status]}</Badge>
        <Badge className={PAY_STYLE[b.payment_status]}>{PAY_LABEL[b.payment_status]}</Badge>
      </div>

      {open && (
        <div className="space-y-5 border-t border-[#ede8f5] bg-[#fbf9fd] p-4 sm:p-5">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div><p className="text-xs text-gray-500">Phone</p><p className="font-semibold text-gray-900">{b.phone}</p></div>
            <div><p className="text-xs text-gray-500">Email</p><p className="break-all font-semibold text-gray-900">{b.email || "–"}</p></div>
            <div><p className="text-xs text-gray-500">Payment</p><p className="font-semibold text-gray-900">{b.payment_method === "bank_transfer" ? "Online (bank transfer)" : "At TRACE"} · Rs. {b.amount_lkr.toLocaleString("en-US")}</p></div>
            <div><p className="text-xs text-gray-500">Booked</p><p className="font-semibold text-gray-900">{new Date(b.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p></div>
            {b.notes && <div className="sm:col-span-2"><p className="text-xs text-gray-500">Patient notes</p><p className="whitespace-pre-wrap text-gray-800">{b.notes}</p></div>}
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={`tel:${b.phone}`} className={`${actionBtn} border-[#893A9F] bg-[#893A9F] text-white`}><Phone className="h-3.5 w-3.5" /> Call</a>
            <a href={waLink(b.phone)} target="_blank" rel="noopener noreferrer" className={`${actionBtn} border-emerald-600 text-emerald-700`}><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>
            {b.has_slip && (
              <a href={`/api/admin/bookings/${b.id}/slip`} target="_blank" rel="noopener noreferrer" className={`${actionBtn} border-purple-300 text-purple-800`}>
                <ExternalLink className="h-3.5 w-3.5" /> View payment slip
              </a>
            )}
          </div>

          {b.has_slip && b.slip_mime?.startsWith("image/") && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/admin/bookings/${b.id}/slip`} alt={`Payment slip for ${b.ref}`} className="max-h-72 rounded-xl border border-gray-200 bg-white object-contain" loading="lazy" />
          )}

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Status</p>
            <div className="flex flex-wrap gap-2">
              {b.status !== "confirmed" && b.status !== "completed" && (
                <button type="button" disabled={!!busy} onClick={() => run("confirm", { status: "confirmed" })} className={`${actionBtn} border-blue-600 text-blue-700`}>
                  {busy === "confirm" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Confirm (called)
                </button>
              )}
              {b.status !== "completed" && (
                <button type="button" disabled={!!busy} onClick={() => run("complete", { status: "completed" })} className={`${actionBtn} border-emerald-600 text-emerald-700`}>
                  <FileCheck2 className="h-3.5 w-3.5" /> Test completed
                </button>
              )}
              {b.status !== "no_show" && (
                <button type="button" disabled={!!busy} onClick={() => run("noshow", { status: "no_show" }, "Mark as no-show? The time slot will be released.")} className={`${actionBtn} border-gray-400 text-gray-700`}>No-show</button>
              )}
              {b.status !== "cancelled" && (
                <button type="button" disabled={!!busy} onClick={() => run("cancel", { status: "cancelled" }, "Cancel this booking? The time slot will be released.")} className={`${actionBtn} border-red-400 text-red-700`}>Cancel booking</button>
              )}
              {(b.status === "cancelled" || b.status === "no_show") && (
                <button type="button" disabled={!!busy} onClick={() => run("restore", { status: "new" })} className={`${actionBtn} border-amber-500 text-amber-700`}>Restore</button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`pay-${b.id}`} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Payment status</label>
              <select
                id={`pay-${b.id}`} value={b.payment_status} disabled={!!busy}
                onChange={(e) => run("pay", { payment_status: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#893A9F]"
              >
                {Object.entries(PAY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`fu-${b.id}`} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Follow-up reminder</label>
              <div className="flex gap-2">
                <input id={`fu-${b.id}`} type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#893A9F]" />
                <button type="button" disabled={!!busy} onClick={() => run("fu", { follow_up_on: followUp || null })} className={`${actionBtn} border-gray-300 text-gray-700`}>Save</button>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">Reschedule</p>
            <div className="flex flex-wrap gap-2">
              <input type="date" value={rDate} onChange={(e) => setRDate(e.target.value)} aria-label="New date" className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#893A9F]" />
              <select value={rTime} onChange={(e) => setRTime(e.target.value)} aria-label="New time" className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#893A9F]">
                {slotTimes.map((t) => <option key={t} value={t}>{formatTime12h(t)}</option>)}
              </select>
              <button
                type="button" disabled={!!busy || (rDate === b.appointment_date && rTime === b.slot_time)}
                onClick={() => run("resched", { appointment_date: rDate, slot_time: rTime }, `Move this booking to ${formatDateLong(rDate)} at ${formatTime12h(rTime)}?`)}
                className={`${actionBtn} border-gray-300 text-gray-700`}
              >Move</button>
            </div>
          </div>

          <div>
            <label htmlFor={`notes-${b.id}`} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Internal notes</label>
            <textarea id={`notes-${b.id}`} rows={3} value={notes} maxLength={2000} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#893A9F]" placeholder="Call outcome, risk level, reminders…" />
            <button type="button" disabled={!!busy || notes === (b.admin_notes ?? "")} onClick={() => run("notes", { admin_notes: notes })} className={`${actionBtn} mt-2 border-[#893A9F] text-[#893A9F]`}>Save notes</button>
          </div>

          {msg && (
            <p role="status" className={`flex items-center gap-1.5 text-sm ${msg.ok ? "text-emerald-700" : "text-red-600"}`}>
              {msg.ok ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {msg.text}
            </p>
          )}
        </div>
      )}
    </li>
  );
}
