import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/listing-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Edit listing" };

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser(`/dashboard/listings/${id}/edit`);
  if (user.role !== "LANDLORD" && user.role !== "AGENT") redirect("/dashboard");

  // Only the owner can open this, and removed listings can't be edited.
  const listing = await db.listing.findFirst({
    where: { id, ownerId: user.id, status: { not: "REMOVED" } },
    select: {
      title: true,
      description: true,
      priceKes: true,
      bedrooms: true,
      bathrooms: true,
      propertyType: true,
      contactPhone: true,
      locationId: true,
      amenities: { select: { id: true } },
      images: { select: { url: true, thumbUrl: true }, orderBy: { position: "asc" } },
    },
  });
  if (!listing) notFound();

  const [locations, amenities] = await Promise.all([
    db.location.findMany({
      where: { type: { in: ["AREA", "ESTATE"] } },
      select: { id: true, name: true, parent: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    db.amenity.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const areas = locations.map((l) => ({
    id: l.id,
    label: l.parent ? `${l.name} (${l.parent.name})` : l.name,
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Edit listing</h1>
      <p className="mb-8 mt-2 text-muted-foreground">Changes go live as soon as you save.</p>
      <ListingForm
        listingId={id}
        areas={areas}
        amenities={amenities}
        defaultPhone={user.phoneNumber ?? ""}
        initial={{
          title: listing.title,
          propertyType: listing.propertyType,
          bedrooms: listing.bedrooms ?? 1,
          bathrooms: listing.bathrooms ?? 1,
          priceKes: listing.priceKes,
          locationId: listing.locationId,
          description: listing.description,
          amenityIds: listing.amenities.map((a) => a.id),
          contactPhone: listing.contactPhone,
          images: listing.images.map((i) => ({ url: i.url, thumbUrl: i.thumbUrl ?? i.url })),
        }}
      />
    </div>
  );
}