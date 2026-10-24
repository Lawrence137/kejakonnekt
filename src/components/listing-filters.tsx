import Link from "next/link";
import { propertyTypeLabels } from "@/lib/format";
import type { ListingFilters } from "@/lib/filters";

const priceOptions = [10000, 20000, 30000, 50000, 80000, 120000];
const bedroomOptions = [
  { value: 0, label: "Bedsitter" },
  { value: 1, label: "1 bedroom" },
  { value: 2, label: "2 bedrooms" },
  { value: 3, label: "3 bedrooms" },
  { value: 4, label: "4+ bedrooms" },
];

const selectClass =
  "h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export function ListingFiltersBar({
  filters,
  areas,
}: {
  filters: ListingFilters;
  areas: { name: string; slug: string }[];
}) {
  const hasFilters =
    filters.area ||
    filters.type ||
    filters.maxPrice !== undefined ||
    filters.bedrooms !== undefined;

  return (
    <form
      action="/listings"
      className="grid grid-cols-2 gap-3 rounded-2xl border bg-background p-4 shadow-sm lg:grid-cols-[repeat(4,1fr)_auto]"
    >
      <select name="area" defaultValue={filters.area ?? ""} className={selectClass} aria-label="Area">
        <option value="">All areas</option>
        {areas.map((a) => (
          <option key={a.slug} value={a.slug}>{a.name}</option>
        ))}
      </select>

      <select name="type" defaultValue={filters.type ?? ""} className={selectClass} aria-label="House type">
        <option value="">Any type</option>
        {Object.entries(propertyTypeLabels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select name="bedrooms" defaultValue={filters.bedrooms?.toString() ?? ""} className={selectClass} aria-label="Bedrooms">
        <option value="">Any bedrooms</option>
        {bedroomOptions.map((b) => (
          <option key={b.value} value={b.value}>{b.label}</option>
        ))}
      </select>

      <select name="maxPrice" defaultValue={filters.maxPrice?.toString() ?? ""} className={selectClass} aria-label="Maximum rent">
        <option value="">Any price</option>
        {priceOptions.map((p) => (
          <option key={p} value={p}>Up to KES {p.toLocaleString("en-KE")}</option>
        ))}
      </select>

      <div className="col-span-2 flex items-center gap-3 lg:col-span-1">
        <button
          type="submit"
          className="h-11 flex-1 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Apply
        </button>
        {hasFilters && (
          <Link href="/listings" className="text-sm font-medium text-muted-foreground hover:underline">
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}