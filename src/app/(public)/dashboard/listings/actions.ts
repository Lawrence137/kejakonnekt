"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

async function update(formData: FormData, data: Prisma.ListingUpdateManyMutationInput) {
  const user = await requireUser("/dashboard");
  if (user.role !== "LANDLORD" && user.role !== "AGENT") return;

  const id = String(formData.get("id") ?? "");
  // Ownership is part of the query, so nobody can change someone else's listing.
  await db.listing.updateMany({
    where: { id, ownerId: user.id, status: { not: "REMOVED" } },
    data,
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/listings");
  revalidatePath(`/listings/${id}`);
}

export async function markTaken(formData: FormData) {
  await update(formData, { availability: "TAKEN" });
}

export async function markAvailable(formData: FormData) {
  await update(formData, { availability: "AVAILABLE", lastConfirmedAt: new Date() });
}

export async function confirmAvailable(formData: FormData) {
  await update(formData, { lastConfirmedAt: new Date() });
}