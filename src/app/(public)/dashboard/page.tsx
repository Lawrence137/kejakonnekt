import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatKes } from "@/lib/format";
import { requireUser } from "@/lib/session";

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
                const badge =
                  l.status === "REMOVED"
                    ? { text: "Removed", cls: "bg-destructive/10 text-destructive" }
                    : l.availability === "TAKEN"
                      ? { text: "Taken", cls: "bg-muted text-muted-foreground" }
                      : { text: "Live", cls: "bg-primary/10 text-primary" };
                return (
                  <Link
                    key={l.id}
                    href={`/listings/${l.id}`}
                    className="flex items-center gap-4 rounded-xl border bg-background p-3 hover:shadow-md"
                  >
                    <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{l.title}</p>
                      <p className="text-sm text-muted-foreground">{formatKes(l.priceKes)}/month</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.cls}`}>
                      {badge.text}
                    </span>
                  </Link>
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