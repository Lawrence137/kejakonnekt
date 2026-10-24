import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          href="/"
          className="shrink-0 text-xl font-extrabold tracking-tight"
        >
          Keja<span className="text-primary">Konnect</span>
        </Link>

        <nav className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Link href="/listings" className={buttonVariants({ variant: "ghost" })}>
              Browse houses
            </Link>
          </div>
          <Link
            href="/dashboard"
            className={`${buttonVariants({ variant: "outline" })} whitespace-nowrap`}
          >
            <span className="sm:hidden">List house</span>
            <span className="hidden sm:inline">List your house</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}