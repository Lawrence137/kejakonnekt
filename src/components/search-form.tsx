import { Search } from "lucide-react";
import { propertyTypeLabels } from "@/lib/format";

const priceOptions = [10000, 20000, 30000, 50000, 80000, 120000];

const segment =
  "flex flex-col gap-0.5 px-6 py-3 text-left transition sm:flex-1 sm:rounded-full sm:hover:bg-secondary/70";
const label = "text-xs font-semibold";
const field =
  "w-full cursor-pointer bg-transparent text-[15px] text-muted-foreground outline-none";

export function SearchForm({
  areas,
}: {
  areas: { name: string; slug: string }[];
}) {
  return (
    <form
      action="/listings"
      className="mx-auto flex max-w-3xl flex-col rounded-3xl border bg-background shadow-xl shadow-black/5 sm:flex-row sm:items-center sm:rounded-full sm:p-1.5"
    >
      <label className={segment}>
        <span className={label}>Where</span>
        <select name="area" className={field} defaultValue={areas[0]?.slug}>
          {areas.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
      </label>

      <span className="mx-6 h-px bg-border sm:mx-0 sm:h-8 sm:w-px" />

      <label className={segment}>
        <span className={label}>House type</span>
        <select name="type" className={field}>
          <option value="">Any type</option>
          {Object.entries(propertyTypeLabels).map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </label>

      <span className="mx-6 h-px bg-border sm:mx-0 sm:h-8 sm:w-px" />

      <label className={segment}>
        <span className={label}>Max rent</span>
        <select name="maxPrice" className={field}>
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
        aria-label="Search houses"
        className="m-3 flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-90 sm:m-0 sm:size-12 sm:shrink-0 sm:px-0"
      >
        <Search className="size-5" />
        <span className="sm:hidden">Search</span>
      </button>
    </form>
  );
}