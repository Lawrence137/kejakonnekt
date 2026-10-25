import Link from "next/link";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <nav className="flex items-center gap-5 text-sm font-medium">
            <span className="font-extrabold">
              Keja<span className="text-primary">Konnect</span> Admin
            </span>
            <Link href="/admin/applications" className="hover:text-primary">
              Applications
            </Link>
            <Link href="/admin/listings" className="hover:text-primary">
              Listings
            </Link>
          </nav>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            Back to site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}