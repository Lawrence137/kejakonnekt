"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { sendSms } from "@/lib/sms";

const LIST = "/admin/applications";

async function loadPending(id: string) {
  return db.landlordApplication.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      applicantType: true,
      status: true,
      user: { select: { phoneNumber: true } },
    },
  });
}

export async function approveApplication(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const app = await loadPending(id);
  if (!app || app.status !== "PENDING") redirect(LIST);
  if (app.userId === admin.id) redirect(`${LIST}/${id}?error=own`);

  let ok = true;
  try {
    // One atomic batch. If the application was already decided, update() throws
    // and nothing is changed.
    await db.$transaction([
      db.landlordApplication.update({
        where: { id, status: "PENDING" },
        data: {
          status: "APPROVED",
          reviewedById: admin.id,
          reviewedAt: new Date(),
          rejectionReason: null,
        },
      }),
      db.user.update({
        where: { id: app.userId },
        data: { role: app.applicantType, isVerified: true },
      }),
      db.auditLog.create({
        data: {
          actorId: admin.id,
          action: "APPLICATION_APPROVED",
          targetType: "LandlordApplication",
          targetId: id,
        },
      }),
    ]);
  } catch {
    ok = false;
  }
  if (!ok) redirect(`${LIST}/${id}?error=done`);

  const phone = app.user.phoneNumber;
  if (phone) {
    after(() =>
      sendSms(phone, "KejaKonnect: your verification is approved. Log in to start listing houses."),
    );
  }

  revalidatePath(LIST);
  redirect(LIST);
}

export async function rejectApplication(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (reason.length < 5 || reason.length > 300) redirect(`${LIST}/${id}?error=reason`);

  const app = await loadPending(id);
  if (!app || app.status !== "PENDING") redirect(LIST);
  if (app.userId === admin.id) redirect(`${LIST}/${id}?error=own`);

  let ok = true;
  try {
    await db.$transaction([
      db.landlordApplication.update({
        where: { id, status: "PENDING" },
        data: {
          status: "REJECTED",
          rejectionReason: reason,
          reviewedById: admin.id,
          reviewedAt: new Date(),
        },
      }),
      db.auditLog.create({
        data: {
          actorId: admin.id,
          action: "APPLICATION_REJECTED",
          targetType: "LandlordApplication",
          targetId: id,
        },
      }),
    ]);
  } catch {
    ok = false;
  }
  if (!ok) redirect(`${LIST}/${id}?error=done`);

  const phone = app.user.phoneNumber;
  if (phone) {
    after(() =>
      sendSms(phone, "KejaKonnect: there is an update on your verification. Log in to see the details."),
    );
  }

  revalidatePath(LIST);
  redirect(LIST);
}