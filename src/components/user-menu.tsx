"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { House, LayoutDashboard, LogIn, LogOut, Menu, Search, ShieldCheck, User } from "lucide-react";
import { mainNav } from "@/config/nav";
import { authClient } from "@/lib/auth-client";

const roleLabels: Record<string, string> = {
  SEEKER: "Tenant",
  LANDLORD: "Landlord",
  AGENT: "Agent",
  ADMIN: "Admin",
};

const item =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-secondary";
const divider = "my-2 h-px bg-border";

export function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const user = session?.user as
    | { role?: string; phoneNumber?: string | null }
    | undefined;
  const role = user?.role ?? "SEEKER";
  const isLandlord = role === "LANDLORD" || role === "AGENT";
  const phone = user?.phoneNumber?.replace(/^(\+254)(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4");

  // Close on outside click and Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  async function signOut() {
    close();
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open menu"
        className="flex items-center gap-2 rounded-full border bg-background py-1.5 pl-3.5 pr-1.5 transition hover:shadow-md"
      >
        <Menu className="size-4" />
        <span
          className={`flex size-8 items-center justify-center rounded-full ${
            user ? "bg-primary text-primary-foreground" : "bg-muted-foreground/70 text-background"
          }`}
        >
          <User className="size-4" />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="kk-pop absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-2xl border bg-background p-2 shadow-xl"
        >
          {user ? (
            <>
              <div className="px-3 pb-2 pt-1">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="font-semibold">{phone ?? "Your account"}</p>
                <p className="text-xs text-muted-foreground">{roleLabels[role] ?? role}</p>
              </div>
              <div className={divider} />

              <Link href="/account" role="menuitem" onClick={close} className={item}>
                <User className="size-4" /> My account
              </Link>
              {isLandlord ? (
                <>
                  <Link href="/dashboard" role="menuitem" onClick={close} className={item}>
                    <LayoutDashboard className="size-4" /> My listings
                  </Link>
                  <Link href="/dashboard/listings/new" role="menuitem" onClick={close} className={item}>
                    <House className="size-4" /> Add a listing
                  </Link>
                </>
              ) : role === "SEEKER" ? (
                <Link href="/dashboard" role="menuitem" onClick={close} className={item}>
                  <LayoutDashboard className="size-4" /> Become a landlord or agent
                </Link>
              ) : null}
              {role === "ADMIN" && (
                <Link href="/admin/applications" role="menuitem" onClick={close} className={item}>
                  <ShieldCheck className="size-4" /> Admin
                </Link>
              )}
            </>
          ) : !isPending ? (
            <Link href="/login" role="menuitem" onClick={close} className={`${item} font-semibold`}>
              <LogIn className="size-4" /> Log in or sign up
            </Link>
          ) : null}

          {/* Main links: shown here on small screens, in the bar on larger ones */}
          <div className="md:hidden">
            <div className={divider} />
            {mainNav.map(({ label, href }) => (
              <Link key={href} href={href} role="menuitem" onClick={close} className={item}>
                {href === "/listings" ? <Search className="size-4" /> : <span className="size-4" />}
                {label}
              </Link>
            ))}
          </div>
          <div className="lg:hidden">
            <div className={divider} />
            <Link href="/dashboard" role="menuitem" onClick={close} className={item}>
              <House className="size-4" /> List your house
            </Link>
          </div>

          {user && (
            <>
              <div className={divider} />
              <button type="button" role="menuitem" onClick={signOut} className={item}>
                <LogOut className="size-4" /> Log out
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}