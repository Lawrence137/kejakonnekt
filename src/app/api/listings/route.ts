import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseListingInput } from "@/lib/listing-input";
import { getSession } from "@/lib/session";

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });
const DAILY_LIMIT = 20;

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

  const parsed = await parseListingInput(await request.json().catch(() => null), user.id);
  if ("error" in parsed) return fail(parsed.error);
  const d = parsed.data;

  const listing = await db.listing.create({
    data: {
      title: d.title,
      description: d.description,
      priceKes: d.priceKes,
      bedrooms: d.bedrooms,
      bathrooms: d.bathrooms,
      propertyType: d.propertyType,
      contactPhone: d.contactPhone,
      status: "APPROVED", // verified landlords publish instantly; admins can take down
      ownerId: user.id,
      locationId: d.locationId,
      images: {
        create: d.images.map((img, i) => ({ url: img.url, thumbUrl: img.thumbUrl, position: i })),
      },
      amenities: { connect: d.amenityIds.map((aid) => ({ id: aid })) },
    },
    select: { id: true },
  });

  revalidatePath("/");
  revalidatePath("/listings");
  return NextResponse.json({ id: listing.id });
}