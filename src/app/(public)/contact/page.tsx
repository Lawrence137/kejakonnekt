import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  const { contact } = siteConfig;
  const rows: { label: string; value: string; href: string }[] = [];
  if (contact.email) rows.push({ label: "Email", value: contact.email, href: `mailto:${contact.email}` });
  if (contact.phone) rows.push({ label: "Phone", value: contact.phone, href: `tel:${contact.phone}` });
  if (contact.whatsapp)
    rows.push({ label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${contact.whatsapp}` });

  return (
    <InfoPage
      title="Contact us"
      intro="Questions, problems with a listing, or feedback? We'd like to hear from you."
    >
      {rows.length > 0 ? (
        <ul className="!list-none !pl-0">
          {rows.map((r) => (
            <li key={r.label} className="rounded-xl border bg-background p-4">
              <p className="text-xs text-muted-foreground">{r.label}</p>
              <a href={r.href} className="font-semibold">
                {r.value}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Our contact details will appear here soon.</p>
      )}

      <h2>Reporting a listing</h2>
      <p>
        Tell us the house title or link and what&apos;s wrong, such as a number that doesn&apos;t
        work, a house that&apos;s already taken, or a suspected scam.
      </p>
    </InfoPage>
  );
}