import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { SearchForm } from "@/components/search-form";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getFeaturedListings } from "@/lib/queries";

export const revalidate = 60; // refresh the page data at most once a minute

const steps = [
  {
    n: "1",
    title: "Browse for free",
    text: "Search photos, prices and locations without signing up or paying anything.",
  },
  {
    n: "2",
    title: "Unlock contacts",
    text: `Pay KES ${siteConfig.pass.priceKes} once with M-Pesa for a ${siteConfig.pass.durationDays}-day pass.`,
  },
  {
    n: "3",
    title: "Call the landlord",
    text: "Reach landlords and agents directly, view houses, and move in.",
  },
];

export default async function HomePage() {
  const listings = await getFeaturedListings(6);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary via-background to-background">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-24">
          <p className="mb-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Now serving {siteConfig.launchArea}
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Find your next <span className="text-primary">keja</span> without
            the runaround.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Browse approved rentals in {siteConfig.launchArea} for free. Pay
            once to contact landlords and agents directly.
          </p>
          <div className="mt-10 max-w-3xl">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Latest houses
          </h2>
          <Link
            href="/listings"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {listings.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            No houses yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-10 text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl bg-background p-6 shadow-sm">
                <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {s.n}
                </span>
                <h3 className="mb-1 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landlord CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Got a house to let in {siteConfig.launchArea}?
          </h2>
          <p className="mx-auto mt-3 max-w-md opacity-90">
            List it for free and reach serious tenants who are ready to view.
          </p>
          <Link
            href="/dashboard"
            className={`${buttonVariants({ variant: "secondary", size: "lg" })} mt-6`}
          >
            List your house
          </Link>
        </div>
      </section>
    </>
  );
}