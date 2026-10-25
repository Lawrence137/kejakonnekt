import { redirect } from "next/navigation";
import { ListingForm } from "@/components/listing-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Add a listing" };

export default async function NewListingPage() {
  const user = await requireUser("/dashboard/listings/new");
  if (user.role !== "LANDLORD" && user.role !== "AGENT") redirect("/dashboard");

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
      <h1 className="text-3xl font-extrabold tracking-tight">Add a listing</h1>
      <p className="mb-8 mt-2 text-muted-foreground">
        Your listing goes live as soon as you publish it.
      </p>
      <ListingForm areas={areas} amenities={amenities} defaultPhone={user.phoneNumber ?? ""} />
    </div>
  );
}