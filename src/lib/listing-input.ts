import type { PropertyType } from "@prisma/client";
import { db } from "@/lib/db";
import { propertyTypeLabels } from "@/lib/format";
import { normalizeKenyanPhone } from "@/lib/phone";
import { isOwnPhotoUrl } from "@/lib/upload";

export type ListingInput = {
  title: string;
  description: string;
  priceKes: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: PropertyType;
  contactPhone: string;
  locationId: string;
  amenityIds: string[];
  images: { url: string; thumbUrl: string }[];
};

const isInt = (v: unknown, min: number, max: number): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;

export async function parseListingInput(
  body: unknown,
  userId: string,
): Promise<{ error: string } | { data: ListingInput }> {
  if (!body || typeof body !== "object") return { error: "Invalid request." };
  const b = body as Record<string, unknown>;

  const title = String(b.title ?? "").trim();
  const description = String(b.description ?? "").trim();
  const propertyType = String(b.propertyType ?? "");
  const locationId = String(b.locationId ?? "");
  const contactPhone = normalizeKenyanPhone(String(b.contactPhone ?? ""));
  const amenityIds = Array.isArray(b.amenityIds)
    ? [...new Set(b.amenityIds.map(String))].slice(0, 20)
    : [];
  const images = Array.isArray(b.images)
    ? b.images.map((i: { url?: unknown; thumbUrl?: unknown }) => ({
        url: String(i?.url ?? ""),
        thumbUrl: String(i?.thumbUrl ?? ""),
      }))
    : [];

  if (title.length < 5 || title.length > 80) return { error: "Title must be 5-80 characters." };
  if (description.length < 20 || description.length > 2000)
    return { error: "Description must be 20-2000 characters." };
  if (!isInt(b.priceKes, 1000, 1_000_000))
    return { error: "Enter a monthly rent between KES 1,000 and 1,000,000." };
  if (!isInt(b.bedrooms, 0, 10)) return { error: "Choose the number of bedrooms." };
  if (!isInt(b.bathrooms, 0, 10)) return { error: "Choose the number of bathrooms." };
  if (!(propertyType in propertyTypeLabels)) return { error: "Choose a house type." };
  if (!contactPhone) return { error: "Enter a valid Kenyan phone number for tenants to call." };
  if (images.length < 1 || images.length > 8) return { error: "Add 1 to 8 photos." };
  if (!images.every((i) => isOwnPhotoUrl(i.url, userId) && isOwnPhotoUrl(i.thumbUrl, userId)))
    return { error: "One of the photos is invalid. Please upload it again." };

  const [location, amenityCount] = await Promise.all([
    db.location.findFirst({
      where: { id: locationId, type: { in: ["AREA", "ESTATE"] } },
      select: { id: true },
    }),
    db.amenity.count({ where: { id: { in: amenityIds } } }),
  ]);
  if (!location) return { error: "Choose a valid location." };
  if (amenityCount !== amenityIds.length) return { error: "Invalid amenities selected." };

  return {
    data: {
      title,
      description,
      priceKes: b.priceKes as number,
      bedrooms: b.bedrooms as number,
      bathrooms: b.bathrooms as number,
      propertyType: propertyType as PropertyType,
      contactPhone,
      locationId: location.id,
      amenityIds,
      images,
    },
  };
}