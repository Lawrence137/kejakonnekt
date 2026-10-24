export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-secondary" />
      <div className="mt-3 mb-6 h-5 w-32 animate-pulse rounded-lg bg-secondary" />
      <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border">
            <div className="aspect-[4/3] animate-pulse bg-secondary" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-1/3 animate-pulse rounded bg-secondary" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}