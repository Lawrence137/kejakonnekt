import Link from "next/link";
import { removeListing, restoreListing } from "@/app/admin/listings/actions";
import { db } from "@/lib/db";
import { formatKes } from "@/lib/format";
import { normalizeKenyanPhone } from "@/lib/phone";
import { requireAdmin } from "@/lib/session";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; error?: string }>;
}) {
  await requireAdmin();
  const { q, error } = await searchParams;
  const term = q?.trim();
  const phone = term ? normalizeKenyanPhone(term) : null;

  const listings = await db.listing.findMany({
    where: term
      ? {
          OR: [
            { title: { contains: term, mode: "insensitive" } },
            ...(phone ? [{ owner: { phoneNumber: phone } }] : []),
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      priceKes: true,
      status: true,
      availability: true,
      removedReason: true,
      createdAt: true,
      owner: { select: { name: true, phoneNumber: true, isVerified: true, role: true } },
      images: { select: { url: true, thumbUrl: true }, orderBy: { position: "asc" }, take: 1 },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Listings</h1>

      <form action="/admin/listings" className="mt-5 flex gap-2">
        <input
          name="q"
          defaultValue={term}
          placeholder="Search by title or landlord's phone number"
          className="h-11 flex-1 rounded-xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="submit" className="rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">
          Search
        </button>
      </form>

      {error === "reason" && (
        <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          Enter a reason of at least 5 characters to remove a listing.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {listings.length === 0 && (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No listings found.
          </p>
        )}

        {listings.map((l) => {
          const img = l.images[0]?.thumbUrl ?? l.images[0]?.url;
          const removed = l.status === "REMOVED";
          return (
            <div key={l.id} className="rounded-xl border bg-background p-4">
              <div className="flex items-center gap-4">
                <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {removed ? (
                    <p className="truncate font-semibold">{l.title}</p>
                  ) : (
                    <Link href={`/listings/${l.id}`} target="_blank" className="block truncate font-semibold hover:underline">
                      {l.title}
                    </Link>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {formatKes(l.priceKes)} · {l.owner.name} · {l.owner.phoneNumber}
                    {l.owner.isVerified ? " · ✓ verified" : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    removed
                      ? "bg-destructive/10 text-destructive"
                      : l.availability === "TAKEN"
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  {removed ? "Removed" : l.availability === "TAKEN" ? "Taken" : "Live"}
                </span>
              </div>

              {removed ? (
                <form action={restoreListing} className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">Reason: {l.removedReason}</p>
                  <input type="hidden" name="id" value={l.id} />
                  <button type="submit" className="shrink-0 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-secondary">
                    Restore
                  </button>
                </form>
              ) : (
                <form action={removeListing} className="mt-3 flex gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <input
                    name="reason"
                    required
                    minLength={5}
                    maxLength={300}
                    placeholder="Reason (shown to the landlord)"
                    className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg border border-destructive px-3 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}