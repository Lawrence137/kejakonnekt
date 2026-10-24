import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUser(next = "/account") {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(next)}`);
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser("/admin/applications");
  if (user.role !== "ADMIN") notFound(); // don't reveal that /admin exists
  return user;
}