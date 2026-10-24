import type { Metadata } from "next";
import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { ListingFiltersBar } from "@/components/listing-filters";
import { listingsHref, parseFilters } from "@/lib/filters";
import { getAreas, searchListings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Houses to rent in Lower Kabete",
  description: "Browse approved rental houses in Lower Kabete, Kiambu County.",
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  const [{ items, total, totalPages }, areas] = await Promise.all([
    searchListings(filters),
    getAreas(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Houses to rent</h1>
      <p className="mt-1 mb-6 text-muted-foreground">
        {total} {total === 1 ? "house" : "houses"} found
      </p>

      <ListingFiltersBar filters={filters} areas={areas} />

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed p-12 text-center">
          <p className="font-semibold">No houses match those filters.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a higher price or a different house type.
          </p>
          <Link href="/listings" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
            Clear all filters
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-between" aria-label="Pagination">
          {filters.page > 1 ? (
            <Link href={listingsHref(filters, filters.page - 1)} className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-secondary">
              ← Previous
            </Link>
          ) : <span />}
          <span className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
          </span>
          {filters.page < totalPages ? (
            <Link href={listingsHref(filters, filters.page + 1)} className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-secondary">
              Next →
            </Link>
          ) : <span />}
        </nav>
      )}
    </div>
  );
}