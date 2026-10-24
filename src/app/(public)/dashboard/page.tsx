import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const isVerified = user.role === "LANDLORD" || user.role === "AGENT";

  const latest = await db.landlordApplication.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { status: true, rejectionReason: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-extrabold tracking-tight">Landlord dashboard</h1>

      <div className="mt-8 rounded-2xl border p-6">
        {isVerified ? (
          <>
            <p className="font-semibold text-primary">✓ You&apos;re a verified {String(user.role).toLowerCase()}.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Adding and managing listings is the next thing we&apos;re building.
            </p>
          </>
        ) : latest?.status === "PENDING" ? (
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
              We verify every landlord and agent so tenants can trust the listings.
              It takes about two minutes.
            </p>
            <Link href="/dashboard/verify" className={`${buttonVariants({ size: "lg" })} mt-5`}>
              {latest?.status === "REJECTED" ? "Apply again" : "Start verification"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}