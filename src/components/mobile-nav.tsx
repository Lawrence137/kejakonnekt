"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { navLinks } from "@/config/nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="inline-flex size-10 items-center justify-center rounded-lg border md:hidden"
      >
        <Menu className="size-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              Keja<span className="text-primary">Konnect</span>
            </SheetTitle>
          </SheetHeader>

          <nav className="mt-6 flex flex-col gap-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={
                  link.highlight
                    ? "mt-3 rounded-xl bg-primary px-4 py-3 text-center font-semibold text-primary-foreground"
                    : "rounded-xl px-4 py-3 text-lg font-medium hover:bg-secondary"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}