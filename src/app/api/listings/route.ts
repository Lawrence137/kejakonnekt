import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { PropertyType } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { propertyTypeLabels } from "@/lib/format";
import { normalizeKenyanPhone } from "@/lib/phone";
import { getSession } from "@/lib/session";
import { isOwnPhotoUrl } from "@/lib/upload";

const fail = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });

const DAILY_LIMIT = 20;

const isInt = (v: unknown, min: number, max: number): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return fail("Please log in first.", 401);
  const user = session.user;
  if (user.role !== "LANDLORD" && user.role !== "AGENT")
    return fail("Only verified landlords and agents can add listings.", 403);

  const recent = await db.listing.count({
    where: { ownerId: user.id, createdAt: { gte: new Date(Date.now() - 86_400_000) } },
  });
  if (recent >= DAILY_LIMIT) return fail("Daily listing limit reached. Try again tomorrow.", 429);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Invalid request.");

  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const { priceKes, bedrooms, bathrooms } = body;
  const propertyType = String(body.propertyType ?? "");
  const locationId = String(body.locationId ?? "");
  const contactPhone = normalizeKenyanPhone(String(body.contactPhone ?? ""));
  const amenityIds: string[] = Array.isArray(body.amenityIds)
    ? body.amenityIds.map(String).slice(0, 20)
    : [];
  const images: { url: string; thumbUrl: string }[] = Array.isArray(body.images)
    ? body.images.map((i: { url?: unknown; thumbUrl?: unknown }) => ({
        url: String(i?.url ?? ""),
        thumbUrl: String(i?.thumbUrl ?? ""),
      }))
    : [];

  if (title.length < 5 || title.length > 80) return fail("Title must be 5-80 characters.");
  if (description.length < 20 || description.length > 2000)
    return fail("Description must be 20-2000 characters.");
  if (!isInt(priceKes, 1000, 1_000_000)) return fail("Enter a monthly rent between KES 1,000 and 1,000,000.");
  if (!isInt(bedrooms, 0, 10)) return fail("Choose the number of bedrooms.");
  if (!isInt(bathrooms, 0, 10)) return fail("Choose the number of bathrooms.");
  if (!(propertyType in propertyTypeLabels)) return fail("Choose a house type.");
  if (!contactPhone) return fail("Enter a valid Kenyan phone number for tenants to call.");
  if (images.length < 1 || images.length > 8) return fail("Add 1 to 8 photos.");
  if (!images.every((i) => isOwnPhotoUrl(i.url, user.id) && isOwnPhotoUrl(i.thumbUrl, user.id)))
    return fail("One of the photos is invalid. Please upload it again.");

  const [location, amenityCount] = await Promise.all([
    db.location.findFirst({
      where: { id: locationId, type: { in: ["AREA", "ESTATE"] } },
      select: { id: true },
    }),
    db.amenity.count({ where: { id: { in: amenityIds } } }),
  ]);
  if (!location) return fail("Choose a valid location.");
  if (amenityCount !== new Set(amenityIds).size) return fail("Invalid amenities selected.");

  const listing = await db.listing.create({
    data: {
      title,
      description,
      priceKes,
      bedrooms,
      bathrooms,
      propertyType: propertyType as PropertyType,
      contactPhone,
      status: "APPROVED", // verified landlords publish instantly; admins can take down
      ownerId: user.id,
      locationId: location.id,
      images: {
        create: images.map((img, i) => ({ url: img.url, thumbUrl: img.thumbUrl, position: i })),
      },
      amenities: { connect: [...new Set(amenityIds)].map((id) => ({ id })) },
    },
    select: { id: true },
  });

  revalidatePath("/");
  revalidatePath("/listings");

  return NextResponse.json({ id: listing.id });
}