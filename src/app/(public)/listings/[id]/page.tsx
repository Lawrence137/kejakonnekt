import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Check, ChevronLeft, MapPin } from "lucide-react";
import { ContactCard } from "@/components/contact-card";
import { ListingGallery } from "@/components/listing-gallery";
import { daysAgo, formatKes, propertyTypeLabels } from "@/lib/format";
import { getListingById } from "@/lib/queries";
import { isStale } from "@/lib/listing-rules";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: "House not found" };

  return {
    title: `${listing.title} - ${formatKes(listing.priceKes)}/month`,
    description: `${propertyTypeLabels[listing.propertyType]} to rent in ${listing.location.name}. ${listing.description.slice(0, 120)}`,
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const taken = listing.availability === "TAKEN";
  const stale = isStale(listing.lastConfirmedAt);
  const where = [listing.location.name, listing.location.parent?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/listings"
        className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Back to houses
      </Link>

      <ListingGallery images={listing.images} title={listing.title} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
              {propertyTypeLabels[listing.propertyType]}
            </span>
            {taken && (
              <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                Taken
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
            {listing.title}
          </h1>
          <p className="mt-2 flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4" /> {where}
          </p>
          <p className="mt-4 text-3xl font-bold text-primary">
            {formatKes(listing.priceKes)}
            <span className="text-base font-medium text-muted-foreground">
              {" "}
              /month
            </span>
          </p>

          <div className="mt-6 flex gap-6 border-y py-4 text-sm">
            <span className="flex items-center gap-2">
              <BedDouble className="size-5 text-primary" />
              {listing.bedrooms === 0
                ? "Bedsitter"
                : `${listing.bedrooms ?? "-"} bedrooms`}
            </span>
            <span className="flex items-center gap-2">
              <Bath className="size-5 text-primary" />
              {listing.bathrooms ?? "-"} bathrooms
            </span>
          </div>

          <h2 className="mt-8 text-lg font-bold">About this house</h2>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">
            {listing.description}
          </p>

          {listing.amenities.length > 0 && (
            <>
              <h2 className="mt-8 text-lg font-bold">Amenities</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {listing.amenities.map((a) => (
                  <li key={a.name} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" /> {a.name}
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-8 text-sm text-muted-foreground">
            Availability last confirmed {daysAgo(listing.lastConfirmedAt)}.
          </p>
        </div>

        {/* Contact */}
        <aside>
          <div className="lg:sticky lg:top-24">
            <ContactCard taken={taken} stale={stale} />
          </div>
        </aside>
      </div>
    </div>
  );
}