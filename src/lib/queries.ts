import { db } from "@/lib/db";

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