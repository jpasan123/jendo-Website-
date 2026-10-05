import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  adminEnabled,
  clientIp,
  createSessionToken,
  passwordMatches,
  rateLimit,
  sameOrigin,
} from "@/lib/booking/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, message: "Request blocked." }, { status: 403 });
  if (!adminEnabled()) {
    return NextResponse.json({ ok: false, message: "Admin access is not configured on this server." }, { status: 503 });
  }

  const limit = rateLimit(`admin-login:${clientIp(request)}`, 8, 15 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, message: `Too many attempts. Try again in ${Math.ceil(limit.retryAfterSec / 60)} minute(s).` },
      { status: 429 }
    );
  }

  let password = "";
  try {
    password = String((await request.json()).password ?? "");
  } catch {
    /* fall through */
  }
  if (!passwordMatches(password)) {
    return NextResponse.json({ ok: false, message: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
