import { Search } from "lucide-react";
import { propertyTypeLabels } from "@/lib/format";

const priceOptions = [10000, 20000, 30000, 50000, 80000];

export function SearchForm() {
  return (
    <form
      action="/listings"
      className="grid gap-2 rounded-2xl border bg-background p-3 shadow-lg sm:grid-cols-[1fr_1fr_auto]"
    >
      <input type="hidden" name="area" value="lower-kabete" />

      <label className="grid gap-1 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground">
        House type
        <select
          name="type"
          className="h-8 bg-transparent text-base text-foreground outline-none"
        >
          <option value="">Any type</option>
          {Object.entries(propertyTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground">
        Max rent per month
        <select
          name="maxPrice"
          className="h-8 bg-transparent text-base text-foreground outline-none"
        >
          <option value="">Any price</option>
          {priceOptions.map((p) => (
            <option key={p} value={p}>
              Up to KES {p.toLocaleString("en-KE")}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-90 sm:h-auto"
      >
        <Search className="size-4" />
        Search
      </button>
    </form>
  );
}