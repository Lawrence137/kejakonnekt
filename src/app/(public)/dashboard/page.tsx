import Link from "next/link";
import {
  confirmAvailable,
  markAvailable,
  markTaken,
} from "@/app/(public)/dashboard/listings/actions";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { db } from "@/lib/db";
import { daysAgo, formatKes } from "@/lib/format";
import { isStale } from "@/lib/listing-rules";
import { requireUser } from "@/lib/session";

const btn =
  "rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-secondary";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const isVerified = user.role === "LANDLORD" || user.role === "AGENT";

  const [latest, listings] = await Promise.all([
    db.landlordApplication.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { status: true, rejectionReason: true },
    }),
    isVerified
      ? db.listing.findMany({
          where: { ownerId: user.id },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            priceKes: true,
            status: true,
            availability: true,
            lastConfirmedAt: true,
            removedReason: true,
            images: {
              select: { url: true, thumbUrl: true },
              orderBy: { position: "asc" },
              take: 1,
            },
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-extrabold tracking-tight">Landlord dashboard</h1>

      {isVerified ? (
        <>
          <div className="mt-6 flex items-center justify-between rounded-2xl border bg-secondary/40 p-5">
            <p className="text-sm font-semibold text-primary">
              ✓ Verified {String(user.role).toLowerCase()}
            </p>
            <Link href="/dashboard/listings/new" className={buttonVariants()}>
              Add a listing
            </Link>
          </div>

          <h2 className="mb-3 mt-10 font-semibold">My listings ({listings.length})</h2>
          {listings.length === 0 ? (
            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              You haven&apos;t listed any houses yet.
            </p>
          ) : (
            <div className="space-y-3">
              {listings.map((l) => {
                const img = l.images[0]?.thumbUrl ?? l.images[0]?.url;
                const removed = l.status === "REMOVED";
                const taken = l.availability === "TAKEN";
                const stale = isStale(l.lastConfirmedAt);

                const badge = removed
                  ? { text: "Removed", cls: "bg-destructive/10 text-destructive" }
                  : taken
                    ? { text: "Taken", cls: "bg-muted text-muted-foreground" }
                    : stale
                      ? { text: "Expired", cls: "bg-amber-100 text-amber-800" }
                      : { text: "Live", cls: "bg-primary/10 text-primary" };

                return (
                  <div key={l.id} className="rounded-xl border bg-background p-3">
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
                          <Link href={`/listings/${l.id}`} className="block truncate font-semibold hover:underline">
                            {l.title}
                          </Link>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {formatKes(l.priceKes)}/month
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>

                    {removed ? (
                      <p className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm">
                        Removed by KejaKonnect{l.removedReason ? `: ${l.removedReason}` : "."}
                      </p>
                    ) : (
                      <>
                        {!taken && (
                          <p className="mt-3 text-xs text-muted-foreground">
                            {stale
                              ? "Hidden from search. Confirm it's still available to show it again."
                              : `Confirmed ${daysAgo(l.lastConfirmedAt)}. Confirm at least every ${siteConfig.listingFreshDays} days or it's hidden from search.`}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link href={`/dashboard/listings/${l.id}/edit`} className={btn}>
                            Edit
                          </Link>
                          {taken ? (
                            <form action={markAvailable}>
                              <input type="hidden" name="id" value={l.id} />
                              <button type="submit" className={btn}>Mark available</button>
                            </form>
                          ) : (
                            <>
                              <form action={confirmAvailable}>
                                <input type="hidden" name="id" value={l.id} />
                                <button
                                  type="submit"
                                  className={
                                    stale
                                      ? "rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                                      : btn
                                  }
                                >
                                  Confirm still available
                                </button>
                              </form>
                              <form action={markTaken}>
                                <input type="hidden" name="id" value={l.id} />
                                <button type="submit" className={btn}>Mark as taken</button>
                              </form>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-2xl border p-6">
          {latest?.status === "PENDING" ? (
            <>
              <p className="font-semibold">Your application is under review</p>
              <p className="mt-2 text-sm text-muted-foreground">
                An admin will check your details soon. Once approved, you can start listing houses.
              </p>
            </>
          ) : (
            <>
              {latest?.status === "REJECTED" && (
                <div className="mb-5 rounded-xl bg-destructive/10 p-4 text-sm">
                  <p className="font-semibold text-destructive">Your last application was not approved</p>
                  {latest.rejectionReason && <p className="mt-1">{latest.rejectionReason}</p>}
                </div>
              )}
              <p className="font-semibold">Verify your identity to list houses</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We verify every landlord and agent so tenants can trust the listings. It takes
                about two minutes.
              </p>
              <Link href="/dashboard/verify" className={`${buttonVariants({ size: "lg" })} mt-5`}>
                {latest?.status === "REJECTED" ? "Apply again" : "Start verification"}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}