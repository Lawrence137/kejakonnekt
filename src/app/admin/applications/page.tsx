import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const select = {
  id: true,
  fullName: true,
  applicantType: true,
  status: true,
  createdAt: true,
  user: { select: { phoneNumber: true } },
} as const;

const fmt = (d: Date) => d.toLocaleDateString("en-KE", { dateStyle: "medium" });

export default async function ApplicationsPage() {
  await requireAdmin();

  const [pending, decided] = await Promise.all([
    db.landlordApplication.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" }, // oldest first
      select,
    }),
    db.landlordApplication.findMany({
      where: { status: { not: "PENDING" } },
      orderBy: { reviewedAt: "desc" },
      take: 20,
      select,
    }),
  ]);

  const row = (a: (typeof pending)[number]) => (
    <Link
      key={a.id}
      href={`/admin/applications/${a.id}`}
      className="flex items-center justify-between rounded-xl border bg-background p-4 hover:shadow-md"
    >
      <div>
        <p className="font-semibold">{a.fullName}</p>
        <p className="text-sm text-muted-foreground">
          {a.applicantType === "AGENT" ? "Agent" : "Landlord"} · {a.user.phoneNumber} · {fmt(a.createdAt)}
        </p>
      </div>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          a.status === "PENDING"
            ? "bg-amber-100 text-amber-800"
            : a.status === "APPROVED"
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
        }`}
      >
        {a.status}
      </span>
    </Link>
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Applications</h1>

      <h2 className="mb-3 mt-8 font-semibold">Pending ({pending.length})</h2>
      <div className="space-y-3">
        {pending.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Nothing waiting for review.
          </p>
        ) : (
          pending.map(row)
        )}
      </div>

      {decided.length > 0 && (
        <>
          <h2 className="mb-3 mt-10 font-semibold">Recently decided</h2>
          <div className="space-y-3">{decided.map(row)}</div>
        </>
      )}
    </div>
  );
}