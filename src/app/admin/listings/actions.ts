"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { sendSms } from "@/lib/sms";

const LIST = "/admin/listings";

function refresh(id: string) {
  revalidatePath(LIST);
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/listings/${id}`);
  revalidatePath("/dashboard");
}

export async function removeListing(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 5 || reason.length > 300) redirect(`${LIST}?error=reason`);

  const listing = await db.listing.findUnique({
    where: { id },
    select: { owner: { select: { phoneNumber: true } } },
  });
  if (!listing) redirect(LIST);

  await db.$transaction([
    db.listing.update({
      where: { id },
      data: { status: "REMOVED", removedReason: reason, removedAt: new Date() },
    }),
    db.auditLog.create({
      data: { actorId: admin.id, action: "LISTING_REMOVED", targetType: "Listing", targetId: id },
    }),
  ]);

  const phone = listing.owner.phoneNumber;
  if (phone) {
    after(() =>
      sendSms(phone, "KejaKonnect: one of your listings was removed. Log in to see why."),
    );
  }

  refresh(id);
  redirect(LIST);
}

export async function restoreListing(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  await db.$transaction([
    db.listing.update({
      where: { id },
      data: { status: "APPROVED", removedReason: null, removedAt: null },
    }),
    db.auditLog.create({
      data: { actorId: admin.id, action: "LISTING_RESTORED", targetType: "Listing", targetId: id },
    }),
  ]);

  refresh(id);
  redirect(LIST);
}