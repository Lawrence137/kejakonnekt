import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Rentals in{" "}
          {siteConfig.launchArea}, Kiambu County.
        </p>
        <p>Never pay a landlord a deposit before viewing the house.</p>
      </div>
    </footer>
  );
}