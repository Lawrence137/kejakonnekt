import Link from "next/link";
import { House } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="KejaKonnect home"
      className={`flex shrink-0 items-center gap-2 ${className}`}
    >
      <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <House className="size-[18px]" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">
        Keja<span className="text-primary">Konnect</span>
      </span>
    </Link>
  );
}