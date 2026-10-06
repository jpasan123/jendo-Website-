import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = { title: "Sign up | Jendo" };
export const dynamic = "force-dynamic";

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const dest = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/book-test";
  if (session?.user) redirect(dest);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pb-20 pt-28" style={{ background: "linear-gradient(180deg,#f6f1fa 0%,#f9f9fb 320px)" }}>
      <div className="w-full max-w-sm rounded-2xl border border-[#ede8f5] bg-white p-8 shadow-sm">
        <SignUpForm callbackUrl={dest} googleEnabled={!!process.env.GOOGLE_CLIENT_ID} />
      </div>
    </main>
  );
}
