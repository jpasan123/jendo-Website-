import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "jendo_admin";
const SESSION_SECONDS = 12 * 60 * 60;

function sha(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(a: string, b: string) {
  return timingSafeEqual(sha(a), sha(b));
}

function adminPassword() {
  return process.env.BOOKING_ADMIN_PASSWORD?.trim() || "";
}

function sessionSecret() {
  // Falls back to the password so a single env var is enough to get started
  return process.env.BOOKING_SESSION_SECRET?.trim() || `jendo-booking:${adminPassword()}`;
}

export function adminEnabled() {
  return adminPassword().length >= 8;
}

export function passwordMatches(candidate: string) {
  const expected = adminPassword();
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export function createSessionToken(nowMs = Date.now()) {
  const exp = Math.floor(nowMs / 1000) + SESSION_SECONDS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const sig = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined, nowMs = Date.now()) {
  if (!token || !adminEnabled()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp: number };
    return typeof exp === "number" && exp > Math.floor(nowMs / 1000);
  } catch {
    return false;
  }
}

export function isAdminRequest(request: NextRequest) {
  return verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

export const SESSION_MAX_AGE = SESSION_SECONDS;

/** Blocks cross-site form posts: the Origin (when sent) must match this host */
export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(request: NextRequest) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

// ---- tiny in-memory rate limiter (one pm2 process; resets on restart) ----
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    buckets.forEach((v, k) => {
      if (v.resetAt <= now) buckets.delete(k);
    });
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}
