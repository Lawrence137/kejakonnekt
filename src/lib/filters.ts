import type { PropertyType } from "@prisma/client";
import { propertyTypeLabels } from "@/lib/format";

export type ListingFilters = {
  area?: string;
  type?: PropertyType;
  maxPrice?: number;
  bedrooms?: number; // 0 = bedsitter, 4 means "4 or more"
  page: number;
};

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const toInt = (v?: string) => {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function parseFilters(sp: SearchParams): ListingFilters {
  const type = first(sp.type);
  const area = first(sp.area);

  return {
    area: area && /^[a-z0-9-]+$/.test(area) ? area : undefined,
    type:
      type && type in propertyTypeLabels ? (type as PropertyType) : undefined,
    maxPrice: toInt(first(sp.maxPrice)),
    bedrooms: toInt(first(sp.bedrooms)),
    page: Math.max(1, toInt(first(sp.page)) ?? 1),
  };
}

export function listingsHref(f: Partial<ListingFilters>, page = 1) {
  const p = new URLSearchParams();
  if (f.area) p.set("area", f.area);
  if (f.type) p.set("type", f.type);
  if (f.maxPrice !== undefined) p.set("maxPrice", String(f.maxPrice));
  if (f.bedrooms !== undefined) p.set("bedrooms", String(f.bedrooms));
  if (page > 1) p.set("page", String(page));
  const qs = p.toString();
  return qs ? `/listings?${qs}` : "/listings";
}