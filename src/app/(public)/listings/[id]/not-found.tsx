import Link from "next/link";

export default function ListingNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">House not found</h1>
      <p className="mt-2 text-muted-foreground">
        It may have been taken or removed.
      </p>
      <Link
        href="/listings"
        className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
      >
        Browse other houses
      </Link>
    </div>
  );
}