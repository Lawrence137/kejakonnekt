import Link from "next/link";
import { DesktopNav } from "@/components/desktop-nav";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <DesktopNav />
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="hidden rounded-full px-4 py-2 text-sm font-medium transition hover:bg-secondary lg:block"
          >
            List your house
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}