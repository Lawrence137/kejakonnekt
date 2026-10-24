import Link from "next/link";
import { Bath, BedDouble, House, MapPin } from "lucide-react";
import { formatKes, propertyTypeLabels } from "@/lib/format";
import type { ListingCardData } from "@/lib/queries";

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const image = listing.images[0]?.url;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-2xl border bg-background transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-secondary to-accent">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/30">
            <House className="size-14" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
          {propertyTypeLabels[listing.propertyType]}
        </span>
      </div>

      <div className="space-y-2 p-4">
        <p className="text-lg font-bold text-primary">
          {formatKes(listing.priceKes)}
          <span className="text-sm font-medium text-muted-foreground"> /month</span>
        </p>
        <h3 className="line-clamp-1 font-semibold">{listing.title}</h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          {listing.location.name}
        </p>
        <div className="flex gap-4 pt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble className="size-4" />
            {listing.bedrooms === 0 ? "Bedsitter" : `${listing.bedrooms ?? "-"} bed`}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-4" />
            {listing.bathrooms ?? "-"} bath
          </span>
        </div>
      </div>
    </Link>
  );
}