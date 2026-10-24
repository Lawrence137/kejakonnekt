import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { ListingFilters } from "@/lib/filters";

// Public listing fields. contactPhone is deliberately NOT selected here:
// it must only ever be returned by a server action that checks for a paid pass.
export const listingCardSelect = {
  id: true,
  title: true,
  priceKes: true,
  bedrooms: true,
  bathrooms: true,
  propertyType: true,
  location: { select: { name: true } },
  images: {
    select: { url: true },
    orderBy: { position: "asc" as const },
    take: 1,
  },
} as const;

export async function getFeaturedListings(limit = 6) {
  return db.listing.findMany({
    where: { status: "APPROVED", availability: "AVAILABLE" },
    select: listingCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type ListingCardData = Awaited<
  ReturnType<typeof getFeaturedListings>
>[number];

export const PAGE_SIZE = 12;

export async function searchListings(f: ListingFilters) {
  const where: Prisma.ListingWhereInput = {
    status: "APPROVED",
    availability: "AVAILABLE",
    ...(f.area && {
      // matches the area itself, or any area inside a county
      location: { OR: [{ slug: f.area }, { parent: { slug: f.area } }] },
    }),
    ...(f.type && { propertyType: f.type }),
    ...(f.maxPrice !== undefined && { priceKes: { lte: f.maxPrice } }),
    ...(f.bedrooms !== undefined && {
      bedrooms: f.bedrooms >= 4 ? { gte: 4 } : f.bedrooms,
    }),
  };

  const [items, total] = await Promise.all([
    db.listing.findMany({
      where,
      select: listingCardSelect,
      orderBy: { createdAt: "desc" },
      skip: (f.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.listing.count({ where }),
  ]);

  return { items, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getAreas() {
  return db.location.findMany({
    where: { type: "AREA" },
    select: { name: true, slug: true },
    orderBy: { name: "asc" },
  });
}