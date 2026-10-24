import { House } from "lucide-react";

export function ListingGallery({
  images,
  title,
}: {
  images: { url: string }[];
  title: string;
}) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-accent text-primary/30">
        <House className="size-20" />
      </div>
    );
  }

  const [main, ...rest] = images;

  return (
    <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src={main.url}
        alt={title}
        className="aspect-[16/10] w-full rounded-2xl object-cover sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:h-full"
      />
      {rest.slice(0, 4).map((img, i) => (
        <img
          key={img.url}
          src={img.url}
          alt={`${title} photo ${i + 2}`}
          className="hidden aspect-[4/3] w-full rounded-2xl object-cover sm:block"
        />
      ))}
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}