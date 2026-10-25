import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseListingInput } from "@/lib/listing-input";
import { getSession } from "@/lib/session";

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return fail("Please log in first.", 401);
  const user = session.user;
  if (user.role !== "LANDLORD" && user.role !== "AGENT") return fail("Not allowed.", 403);

  // Only the owner can edit, and removed listings can't be edited.
  const existing = await db.listing.findFirst({
    where: { id, ownerId: user.id, status: { not: "REMOVED" } },
    select: { id: true },
  });
  if (!existing) return fail("Listing not found.", 404);

  const parsed = await parseListingInput(await request.json().catch(() => null), user.id);
  if ("error" in parsed) return fail(parsed.error);
  const d = parsed.data;

  await db.$transaction([
    db.listingImage.deleteMany({ where: { listingId: id } }),
    db.listing.update({
      where: { id },
      data: {
        title: d.title,
        description: d.description,
        priceKes: d.priceKes,
        bedrooms: d.bedrooms,
        bathrooms: d.bathrooms,
        propertyType: d.propertyType,
        contactPhone: d.contactPhone,
        locationId: d.locationId,
        amenities: { set: d.amenityIds.map((aid) => ({ id: aid })) },
        images: {
          create: d.images.map((img, i) => ({ url: img.url, thumbUrl: img.thumbUrl, position: i })),
        },
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/listings/${id}`);
  return NextResponse.json({ id });
}