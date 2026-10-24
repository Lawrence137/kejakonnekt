import { SignOutButton } from "@/components/sign-out-button";
import { requireUser } from "@/lib/session";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <h1 className="text-2xl font-extrabold">My account</h1>
      <dl className="mt-6 space-y-3 rounded-2xl border p-6 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="font-medium">{user.phoneNumber}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Role</dt>
          <dd className="font-medium">{String(user.role)}</dd>
        </div>
      </dl>
      <div className="mt-6">
        <SignOutButton />
      </div>
    </div>
  );
}