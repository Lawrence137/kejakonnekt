import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // only allow internal redirects
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";

  if (await getSession()) redirect(safeNext);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary to-background px-4">
      <div className="w-full max-w-sm rounded-3xl border bg-background p-8 shadow-lg">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Keja<span className="text-primary">Konnect</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold">Log in or sign up</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">
          Enter your phone number and we&apos;ll text you a code. No password needed.
        </p>
        <LoginForm next={safeNext} />
      </div>
    </div>
  );
}