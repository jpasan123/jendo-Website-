"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Loader2, UserRound } from "lucide-react";

/** Shows who is signed in on the booking page, with a Sign out button. */
export function AccountBar({ name, email }: { name: string; email: string }) {
  const [loading, setLoading] = useState(false);

  async function onSignOut() {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <p className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
        <UserRound className="h-4 w-4 shrink-0 text-[#893A9F]" />
        <span className="truncate">
          Signed in as <span className="font-semibold text-gray-900">{name || email}</span>
          {name && email ? <span className="hidden text-gray-400 sm:inline"> &middot; {email}</span> : null}
        </span>
      </p>
      <button
        type="button"
        onClick={onSignOut}
        disabled={loading}
        className="flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:border-[#893A9F] hover:text-[#893A9F] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        Sign out
      </button>
    </div>
  );
}
