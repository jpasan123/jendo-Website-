"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

const font = { fontFamily: "var(--font-red-hat-display),sans-serif" } as const;
const PURPLE = "#893A9F";

export function SignInForm({ callbackUrl, googleEnabled }: { callbackUrl: string; googleEnabled: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"credentials" | "google" | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading("credentials");
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl });
    setLoading(null);
    if (!res || res.error) {
      setError("Incorrect email or password.");
      return;
    }
    window.location.href = res.url ?? callbackUrl;
  }

  async function onGoogle() {
    setError("");
    setLoading("google");
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="!text-2xl !font-bold text-[#2d0a3e]" style={font}>Sign in</h1>
      <p className="mt-1 text-sm text-gray-500">Sign in to book your Jendo vascular health test.</p>

      {googleEnabled && (
        <>
          <button
            type="button"
            onClick={onGoogle}
            disabled={loading !== null}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-300 disabled:opacity-60"
          >
            {loading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.64v3h3.88c2.27-2.09 3.57-5.17 3.57-8.83Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A12 12 0 0 0 12 24Z" />
                <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.6H1.26A12 12 0 0 0 0 12c0 1.93.46 3.76 1.26 5.4l4.01-3.11Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.26 6.6l4.01 3.11C6.22 6.86 8.87 4.75 12 4.75Z" />
              </svg>
            )}
            Sign in with Google
          </button>
          <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200" />or<div className="h-px flex-1 bg-gray-200" />
          </div>
        </>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-800" style={font}>Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="email" type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#893A9F]"
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-800" style={font}>Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="password" type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#893A9F]"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="flex items-start gap-1.5 text-sm text-red-600"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}</p>
        )}

        <button
          type="submit" disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition disabled:opacity-60"
          style={{ background: PURPLE }}
        >
          {loading === "credentials" && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&rsquo;t have an account?{" "}
        <a href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-[#893A9F]">Sign up</a>
      </p>
    </div>
  );
}
