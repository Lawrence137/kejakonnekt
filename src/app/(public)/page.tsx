import type { CSSProperties } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Building2,
  Check,
  ChevronDown,
  Eye,
  House,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion";
import { SearchForm } from "@/components/search-form";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type { PropertyType } from "@/generated/prisma/client";
import { propertyTypeLabels } from "@/lib/format";
import {
  getAreas,
  getFeaturedListings,
  getHeroPhotos,
  getTrustStats,
  getTypeCounts,
} from "@/lib/queries";

export const revalidate = 60; // refresh the page data at most once a minute

const rise = (ms: number) => ({ "--kk-delay": `${ms}ms` }) as CSSProperties;

const typeIcons: Partial<Record<PropertyType, LucideIcon>> = {
  BEDSITTER: BedDouble,
  STUDIO: BedDouble,
  ONE_BEDROOM: House,
  TWO_BEDROOM: House,
  THREE_BEDROOM: Building2,
  FOUR_PLUS_BEDROOM: Building2,
  MAISONETTE: Building2,
  BUNGALOW: House,
};

const { pass, listingFreshDays } = siteConfig;

const trustPoints = [
  {
    Icon: BadgeCheck,
    title: "ID-verified landlords and agents",
    text: "Everyone who lists confirms their phone number and submits their national ID or passport. Our team reviews each application by hand before a single house goes live.",
  },
  {
    Icon: RefreshCw,
    title: "Listings are kept fresh",
    text: `Landlords must confirm a house is still available at least every ${listingFreshDays} days. Houses that are taken or unconfirmed disappear from search.`,
  },
  {
    Icon: Eye,
    title: "See everything before you pay",
    text: "Photos, prices, locations and amenities are free to browse. You only pay when you're ready to call a landlord.",
  },
  {
    Icon: ShieldCheck,
    title: "Never pay before you view",
    text: "A real landlord doesn't need a deposit before a viewing. View the house first, and walk away from anyone who asks for money up front.",
  },
];

const steps = [
  {
    Icon: Search,
    title: "Browse for free",
    text: "Search by area, house type and budget. No sign-up needed to look.",
  },
  {
    Icon: Smartphone,
    title: "Unlock contacts",
    text: `Pay KES ${pass.priceKes} once with M-Pesa. Your pass works on every listing for ${pass.durationDays} days.`,
  },
  {
    Icon: Phone,
    title: "Call and view",
    text: "Speak to the landlord or agent directly, book a viewing, and move in.",
  },
];

const faqs = [
  {
    q: "How are landlords and agents verified?",
    a: "Before anyone can list a house, they confirm their phone number by SMS and submit their national ID or passport. Our team reviews every application by hand, and only approved landlords and agents can post.",
  },
  {
    q: "What exactly do I pay for?",
    a: `Browsing is free: photos, prices, locations and amenities. A pass costs KES ${pass.priceKes} and lets you see landlords' and agents' phone numbers for ${pass.durationDays} days.`,
  },
  {
    q: "How do I know a house is still available?",
    a: `Landlords must confirm availability at least every ${listingFreshDays} days, otherwise the house disappears from search. When a house is taken, it's marked as taken and hidden.`,
  },
  {
    q: "Should I pay a deposit before viewing?",
    a: "No. Always view the house first and never send money to someone you haven't met. A request for a deposit before a viewing is a warning sign.",
  },
  {
    q: "What if a number doesn't work or the house is already taken?",
    a: "Report it from the listing page and we'll make it right.",
  },
];

export default async function HomePage() {
  const [listings, typeCounts, stats, heroPhotos, areas] = await Promise.all([
    getFeaturedListings(6),
    getTypeCounts(),
    getTrustStats(),
    getHeroPhotos(4),
    getAreas(),
  ]);

  const typeChips = (Object.keys(propertyTypeLabels) as PropertyType[])
    .filter((t) => (typeCounts[t] ?? 0) > 0)
    .map((t) => ({ type: t, count: typeCounts[t] ?? 0, Icon: typeIcons[t] ?? House }));

  const showStats =
    stats.listings >= siteConfig.statsMin.listings &&
    stats.landlords >= siteConfig.statsMin.landlords;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 left-1/2 h-[30rem] w-[64rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-14 text-center sm:pt-24">
          <p
            className="kk-rise mx-auto inline-flex items-center gap-1.5 rounded-full border bg-background px-3.5 py-1.5 text-sm font-medium shadow-sm"
            style={rise(0)}
          >
            <BadgeCheck className="size-4 text-primary" />
            Every landlord ID-verified
          </p>

          <h1
            className="kk-rise mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
            style={rise(80)}
          >
            Rentals you can trust in{" "}
            <span className="text-primary">{siteConfig.launchArea}</span>.
          </h1>

          <p
            className="kk-rise mx-auto mt-5 max-w-xl text-lg text-muted-foreground"
            style={rise(160)}
          >
            Browse real photos and prices for free. Pay only when you&apos;re
            ready to call a verified landlord or agent.
          </p>

          <div className="kk-rise mt-10" style={rise(240)}>
            <SearchForm areas={areas} />
          </div>

          <ul
            className="kk-rise mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            style={rise(320)}
          >
            {["ID-checked by our team", "Free to browse", "No deposit before viewing"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Real photos of the newest houses (only when there are four) */}
        {heroPhotos.length === 4 && (
          <div className="relative mx-auto mt-12 hidden max-w-6xl grid-cols-4 gap-4 px-4 pb-4 md:grid">
            {heroPhotos.map((p, i) => (
              <Link
                key={p.id}
                href={`/listings/${p.id}`}
                className={`kk-rise group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-secondary ${
                  i % 2 === 1 ? "mt-8" : ""
                }`}
                style={rise(400 + i * 90)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* House types */}
      {typeChips.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-10">
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {typeChips.map(({ type, count, Icon }) => (
              <Link
                key={type}
                href={`/listings?type=${type}`}
                className="flex shrink-0 items-center gap-2.5 rounded-full border bg-background px-5 py-3 text-sm font-medium transition hover:border-foreground/40 hover:shadow-sm"
              >
                <Icon className="size-5 text-primary" />
                {propertyTypeLabels[type]}
                <span className="text-muted-foreground">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest houses (no animation, so it never depends on JavaScript) */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Latest houses in {siteConfig.launchArea}
            </h2>
            <p className="mt-1 text-muted-foreground">
              Fresh listings from verified landlords and agents.
            </p>
          </div>
          <Link
            href="/listings"
            className="hidden items-center gap-1 text-sm font-semibold hover:underline sm:inline-flex"
          >
            Show all <ArrowRight className="size-4" />
          </Link>
        </div>

        {listings.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            No houses yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <Link
          href="/listings"
          className="mt-8 block rounded-xl border py-3 text-center font-semibold hover:bg-secondary sm:hidden"
        >
          Show all houses
        </Link>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-[2rem] bg-secondary/60 px-6 py-14 sm:px-12 sm:py-16">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Why KejaKonnect
            </p>
            <h2 className="mt-2 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Rentals you can trust, before you pay a shilling.
            </h2>
          </Reveal>

          {showStats && (
            <Reveal delay={0.1} className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { value: String(stats.landlords), label: "verified landlords and agents" },
                { value: String(stats.listings), label: "houses available right now" },
                { value: `${listingFreshDays} days`, label: "max time before availability is rechecked" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-background px-6 py-5 shadow-sm">
                  <p className="text-3xl font-extrabold text-primary">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </Reveal>
          )}

          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
            {trustPoints.map(({ Icon, title, text }) => (
              <RevealItem key={title} className="rounded-2xl bg-background p-6 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
          <p className="mt-1 text-muted-foreground">
            Simple, and you stay in control of when you pay.
          </p>
        </Reveal>
        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map(({ Icon, title, text }, i) => (
            <RevealItem key={title}>
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* FAQ (plain HTML, no JavaScript needed) */}
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Good to know</h2>
        <div className="mt-6 border-t">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-5 shrink-0 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Landlord CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground sm:px-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Got a house to let in {siteConfig.launchArea}?
              </h2>
              <p className="mt-3 max-w-md opacity-90">
                List it for free and reach tenants who are ready to view.
              </p>
              <Link
                href="/dashboard"
                className={`${buttonVariants({ variant: "secondary", size: "lg" })} mt-6`}
              >
                List your house
              </Link>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Free to list, with photos from your phone",
                "A Verified badge builds trust with tenants",
                "Tenants pay to reach you, so calls are serious",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
    </>
  );
}