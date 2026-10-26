import { cache } from "react";
import type { Prisma, PropertyType } from "@prisma/client";
import { db } from "@/lib/db";
import type { ListingFilters } from "@/lib/filters";
import { freshCutoff } from "@/lib/listing-rules";

// A listing counts as "live" when approved, available and recently confirmed.
function liveWhere(): Prisma.ListingWhereInput {
  return {
    status: "APPROVED",
    availability: "AVAILABLE",
    lastConfirmedAt: { gte: freshCutoff() },
  };
}

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
  owner: { select: { role: true } }, // only the role, never contact details
  images: {
    select: { url: true, thumbUrl: true },
    orderBy: { position: "asc" as const },
    take: 1,
  },
} as const;

export async function getFeaturedListings(limit = 6) {
  return db.listing.findMany({
    where: liveWhere(),
    select: listingCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type ListingCardData = Awaited<
  ReturnType<typeof getFeaturedListings>
>[number];

// How many live houses of each type (used for the homepage chips)
export async function getTypeCounts() {
  const rows = await db.listing.groupBy({
    by: ["propertyType"],
    where: liveWhere(),
    _count: { _all: true },
  });
  return Object.fromEntries(
    rows.map((r) => [r.propertyType, r._count._all]),
  ) as Partial<Record<PropertyType, number>>;
}

export async function getTrustStats() {
  const [listings, landlords] = await Promise.all([
    db.listing.count({ where: liveWhere() }),
    db.user.count({
      where: { role: { in: ["LANDLORD", "AGENT"] }, isVerified: true },
    }),
  ]);
  return { listings, landlords };
}

// Cover photos of the newest live listings, for the hero strip
export async function getHeroPhotos(limit = 4) {
  const rows = await db.listingImage.findMany({
    where: { position: 0, thumbUrl: { not: null }, listing: liveWhere() },
    orderBy: { listing: { createdAt: "desc" } },
    take: limit,
    select: {
      thumbUrl: true,
      listing: { select: { id: true, title: true } },
    },
  });
  return rows.flatMap((r) =>
    r.thumbUrl
      ? [{ id: r.listing.id, title: r.listing.title, url: r.thumbUrl }]
      : [],
  );
}

export const PAGE_SIZE = 12;

export async function searchListings(f: ListingFilters) {
  const where: Prisma.ListingWhereInput = {
    ...liveWhere(),
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

// cache() lets generateMetadata and the page share one database call.
// Note: contactPhone is deliberately NOT selected.
export const getListingById = cache(async (id: string) => {
  return db.listing.findFirst({
    where: { id, status: "APPROVED" },
    select: {
      id: true,
      title: true,
      description: true,
      priceKes: true,
      bedrooms: true,
      bathrooms: true,
      propertyType: true,
      availability: true,
      lastConfirmedAt: true,
      location: {
        select: { name: true, parent: { select: { name: true } } },
      },
      images: {
        select: { url: true, thumbUrl: true },
        orderBy: { position: "asc" },
      },
      amenities: { select: { name: true } },
    },
  });
});