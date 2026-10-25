import Link from "next/link";
import { BadgeCheck, House } from "lucide-react";
import { formatKes, propertyTypeLabels } from "@/lib/format";
import type { ListingCardData } from "@/lib/queries";

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const image = listing.images[0]?.thumbUrl ?? listing.images[0]?.url;
  const who = listing.owner.role === "AGENT" ? "agent" : "landlord";
  const beds = listing.bedrooms && listing.bedrooms > 0 ? ` · ${listing.bedrooms} bed` : "";

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-accent">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/30">
            <House className="size-14" />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold shadow-sm">
          <BadgeCheck className="size-3.5 text-primary" />
          Verified {who}
        </span>
      </div>

      <div className="mt-3 space-y-0.5">
        <h3 className="line-clamp-1 font-semibold">{listing.location.name}</h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">{listing.title}</p>
        <p className="text-sm text-muted-foreground">
          {propertyTypeLabels[listing.propertyType]}
          {beds} · {listing.bathrooms ?? 0} bath
        </p>
        <p className="pt-1">
          <span className="font-semibold">{formatKes(listing.priceKes)}</span>
          <span className="text-muted-foreground"> / month</span>
        </p>
      </div>
    </Link>
  );
}