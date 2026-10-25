/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  approveApplication,
  rejectApplication,
} from "@/app/admin/applications/actions";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

const errors: Record<string, string> = {
  reason: "Enter a reason of at least 5 characters.",
  own: "You can't decide your own application.",
  done: "This application was already decided.",
};

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;

  const app = await db.landlordApplication.findUnique({
    where: { id },
    include: {
      user: { select: { phoneNumber: true, createdAt: true } },
      reviewedBy: { select: { name: true, phoneNumber: true } },
    },
  });
  if (!app) notFound();

  const [sameId, history] = await Promise.all([
    // the same ID number on a different account is a red flag
    db.landlordApplication.findMany({
      where: { idNumber: app.idNumber, userId: { not: app.userId } },
      select: { id: true, fullName: true, status: true, user: { select: { phoneNumber: true } } },
    }),
    db.landlordApplication.findMany({
      where: { userId: app.userId, id: { not: app.id } },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, createdAt: true, rejectionReason: true },
    }),
  ]);

  const detail = (label: string, value: string) => (
    <div className="flex justify-between gap-4 border-b py-2 text-sm last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );

  return (
    <div>
      <Link href="/admin/applications" className="text-sm text-muted-foreground hover:underline">
        ← All applications
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold">{app.fullName}</h1>

      {error && errors[error] && (
        <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {errors[error]}
        </p>
      )}

      {sameId.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">⚠ This ID number is used on {sameId.length} other account(s)</p>
          <ul className="mt-1 list-disc pl-5">
            {sameId.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/applications/${s.id}`} className="underline">
                  {s.fullName}
                </Link>{" "}
                · {s.user.phoneNumber} · {s.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["front", "back"] as const).map((side) => (
            <figure key={side}>
              <img
                src={`/api/admin/id-image?application=${app.id}&side=${side}`}
                alt={`ID ${side}`}
                className="w-full rounded-xl border bg-secondary"
              />
              <figcaption className="mt-1 text-center text-xs capitalize text-muted-foreground">
                {side}
              </figcaption>
            </figure>
          ))}
        </div>

        <aside className="space-y-6">
          <dl className="rounded-xl border bg-background p-4">
            {detail("Applying as", app.applicantType === "AGENT" ? "Agent" : "Landlord")}
            {detail("Phone (verified)", app.user.phoneNumber ?? "-")}
            {detail("ID type", app.idType === "PASSPORT" ? "Passport" : "National ID")}
            {detail("ID number", app.idNumber)}
            {app.businessName && detail("Agency", app.businessName)}
            {detail("Submitted", app.createdAt.toLocaleString("en-KE"))}
            {detail("Status", app.status)}
            {app.reviewedAt && detail("Reviewed", app.reviewedAt.toLocaleString("en-KE"))}
            {app.rejectionReason && detail("Reason", app.rejectionReason)}
          </dl>

          {history.length > 0 && (
            <div className="rounded-xl border bg-background p-4 text-sm">
              <p className="mb-2 font-semibold">Earlier applications</p>
              {history.map((h) => (
                <p key={h.id} className="text-muted-foreground">
                  {h.createdAt.toLocaleDateString("en-KE")} · {h.status}
                  {h.rejectionReason ? ` · ${h.rejectionReason}` : ""}
                </p>
              ))}
            </div>
          )}

          {app.status === "PENDING" && (
            <div className="space-y-4">
              <form action={approveApplication}>
                <input type="hidden" name="id" value={app.id} />
                <button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:opacity-90"
                >
                  Approve
                </button>
              </form>

              <form action={rejectApplication} className="space-y-2">
                <input type="hidden" name="id" value={app.id} />
                <textarea
                  name="reason"
                  required
                  minLength={5}
                  maxLength={300}
                  rows={3}
                  placeholder="Reason (shown to the applicant), e.g. ID photo is blurry"
                  className="w-full rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="h-12 w-full rounded-xl border border-destructive font-semibold text-destructive hover:bg-destructive/10"
                >
                  Reject
                </button>
              </form>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}