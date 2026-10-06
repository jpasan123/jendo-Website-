import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUserWithPassword } from "@/lib/auth/db";
import { clientIp, rateLimit, sameOrigin } from "@/lib/booking/security";
import { sendWelcomeEmail } from "@/lib/auth/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(status: number, message: string) {
  return NextResponse.json({ ok: false, message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return fail(403, "Request blocked.");

  const ip = clientIp(request);
  const limit = rateLimit(`register:${ip}`, 8, 30 * 60_000);
  if (!limit.ok) return fail(429, "Too many sign-up attempts. Please try again in a few minutes.");

  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return fail(400, "We could not read your request.");
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!name) return fail(400, "Please enter your name.");
  if (!EMAIL_RE.test(email)) return fail(400, "Please enter a valid email address.");
  if (password.length < 8) return fail(400, "Password must be at least 8 characters.");

  const existing = await findUserByEmail(email);
  if (existing) {
    return fail(409, existing.password_hash
      ? "An account with this email already exists. Please sign in instead."
      : "This email is already linked to a Google account. Please use “Sign in with Google”.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await createUserWithPassword(email, name, passwordHash);
  // Not awaited: the account exists either way, a mail hiccup must not fail the sign-up.
  void sendWelcomeEmail(email, name);

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
