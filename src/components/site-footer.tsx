import Link from "next/link";
import { BadgeCheck, Eye, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { footerNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

const trust = [
  { Icon: BadgeCheck, title: "ID-verified landlords", text: "Checked by our team before they can list." },
  { Icon: Eye, title: "Free to browse", text: "Pay only when you're ready to call." },
  { Icon: ShieldCheck, title: "No deposit before viewing", text: "View first. Never pay a stranger up front." },
];

export function SiteFooter() {
  const { contact, social, company, launchArea } = siteConfig;

  const socials = [
    { label: "Instagram", href: social.instagram },
    { label: "Facebook", href: social.facebook },
    { label: "X", href: social.x },
    { label: "TikTok", href: social.tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="mt-10 border-t bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4">
        {/* Trust strip */}
        <ul className="grid gap-5 border-b py-8 sm:grid-cols-3">
          {trust.map(({ Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Links */}
        <div className="grid grid-cols-2 gap-10 py-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Verified rental houses in {launchArea}, Kiambu County. Browse for free and
              contact landlords directly.
            </p>

            {(contact.email || contact.phone || contact.whatsapp) && (
              <ul className="mt-5 space-y-1.5 text-sm">
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="hover:underline">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone}`} className="hover:underline">
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.whatsapp && (
                  <li>
                    <a
                      href={`https://wa.me/${contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Chat on WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            )}

            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border bg-background px-3.5 py-1.5 text-xs font-medium transition hover:bg-secondary"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition hover:text-foreground hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 border-t py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p>
            {company.odpcRegistration ? `ODPC registration: ${company.odpcRegistration} · ` : ""}
            Made in Kenya 🇰🇪
          </p>
        </div>
        <p className="pb-8 text-xs leading-relaxed text-muted-foreground">
          Houses are posted by independent landlords and agents. Always view a house in person
          before paying any money, and never share your M-Pesa PIN.
        </p>
      </div>
    </footer>
  );
}