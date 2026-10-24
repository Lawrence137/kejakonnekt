import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { navLinks } from "@/config/nav";

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

        {/* Desktop menu */}
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={buttonVariants({
                variant: link.highlight ? "default" : "ghost",
              })}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        <MobileNav />
      </div>
    </header>
  );
}