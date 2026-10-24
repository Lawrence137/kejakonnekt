import { redirect } from "next/navigation";
import { VerificationForm } from "@/components/verification-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Verify your identity" };

export default async function VerifyPage() {
  const user = await requireUser("/dashboard/verify");
  if (user.role !== "SEEKER") redirect("/dashboard");

  const pending = await db.landlordApplication.count({
    where: { userId: user.id, status: "PENDING" },
  });
  if (pending > 0) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Verify your identity</h1>
      <p className="mb-8 mt-2 text-muted-foreground">
        Your phone number is already confirmed. Add your ID so we can approve you as a
        landlord or agent.
      </p>
      <VerificationForm />
    </div>
  );
}