import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Keja<span className="text-primary">Konnect</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/listings"
            className={`${buttonVariants({ variant: "ghost" })} hidden sm:inline-flex`}
          >
            Browse houses
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
            List your house
          </Link>
        </nav>
      </div>
    </header>
  );
}