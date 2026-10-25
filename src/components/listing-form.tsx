"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { propertyTypeLabels } from "@/lib/format";
import { compressImage } from "@/lib/image";

type Photo = {
  id: string;
  preview: string;
  status: "uploading" | "done" | "error";
  url?: string;
  thumbUrl?: string;
};

const MAX_PHOTOS = 8;

// Picking these house types fills in a sensible bedroom count
const defaultBedrooms: Record<string, string> = {
  BEDSITTER: "0",
  STUDIO: "0",
  ONE_BEDROOM: "1",
  TWO_BEDROOM: "2",
  THREE_BEDROOM: "3",
  FOUR_PLUS_BEDROOM: "4",
};

const field =
  "h-12 w-full rounded-xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring";

export function ListingForm({
  areas,
  amenities,
  defaultPhone,
}: {
  areas: { id: string; label: string }[];
  amenities: { id: string; name: string }[];
  defaultPhone: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("ONE_BEDROOM");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [price, setPrice] = useState("");
  const [locationId, setLocationId] = useState(areas[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const [contactPhone, setContactPhone] = useState(defaultPhone);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const uploading = photos.some((p) => p.status === "uploading");
  const ready = photos.filter((p) => p.status === "done");

  async function addFiles(files: FileList | null) {
    if (!files) return;
    setError("");
    const chosen = Array.from(files).slice(0, MAX_PHOTOS - photos.length);

    for (const file of chosen) {
      const id = crypto.randomUUID();
      setPhotos((p) => [...p, { id, preview: URL.createObjectURL(file), status: "uploading" }]);
      try {
        const [full, thumb] = await Promise.all([
          compressImage(file, 1600, 0.8),
          compressImage(file, 600, 0.75),
        ]);
        const fd = new FormData();
        fd.set("full", full, "full.jpg");
        fd.set("thumb", thumb, "thumb.jpg");

        const res = await fetch("/api/listing-photos", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Upload failed.");

        setPhotos((p) =>
          p.map((x) =>
            x.id === id ? { ...x, status: "done", url: data.url, thumbUrl: data.thumbUrl } : x,
          ),
        );
      } catch (e) {
        setPhotos((p) => p.map((x) => (x.id === id ? { ...x, status: "error" } : x)));
        setError(e instanceof Error ? e.message : "A photo failed to upload.");
      }
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (ready.length === 0) {
      setError("Add at least one photo.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priceKes: Number(price),
          propertyType,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          locationId,
          amenityIds,
          contactPhone,
          images: ready.map((p) => ({ url: p.url, thumbUrl: p.thumbUrl })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push(`/listings/${data.id}`);
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block text-sm font-medium">
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Spacious 1 bedroom near Kabete Road"
          className={`${field} mt-1`}
          required
          maxLength={80}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          House type
          <select
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              const b = defaultBedrooms[e.target.value];
              if (b !== undefined) setBedrooms(b);
            }}
            className={`${field} mt-1`}
          >
            {Object.entries(propertyTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Location
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className={`${field} mt-1`}
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium">
          Rent per month (KES)
          <input
            type="number"
            inputMode="numeric"
            min={1000}
            max={1000000}
            step={500}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${field} mt-1`}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Bedrooms
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={`${field} mt-1`}>
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? "0 (Bedsitter/Studio)" : n}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Bathrooms
          <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={`${field} mt-1`}>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Describe the house, the compound, security, water, nearby stages and shops..."
          className="mt-1 w-full rounded-xl border bg-background p-4 outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Amenities</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {amenities.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={amenityIds.includes(a.id)}
                onChange={(e) =>
                  setAmenityIds((ids) =>
                    e.target.checked ? [...ids, a.id] : ids.filter((x) => x !== a.id),
                  )
                }
                className="size-4"
              />
              {a.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="mb-2 text-sm font-medium">
          Photos ({ready.length}/{MAX_PHOTOS})
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.preview} alt="" className="h-full w-full object-cover" />
              {p.status !== "done" && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 px-1 text-center text-xs font-medium">
                  {p.status === "uploading" ? "Uploading..." : "Failed"}
                </div>
              )}
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => setPhotos((list) => list.filter((x) => x.id !== p.id))}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-secondary/40 px-2 text-center text-xs text-muted-foreground hover:bg-secondary">
              + Add photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          The first photo is the cover. Photos are shrunk on your phone first, so uploads are light on data.
        </p>
      </div>

      <label className="block text-sm font-medium">
        Phone number tenants will call
        <input
          type="tel"
          inputMode="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className={`${field} mt-1`}
          required
        />
        <span className="mt-1 block text-xs font-normal text-muted-foreground">
          Only people who pay for a pass can see this number.
        </span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading || uploading}
        className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {uploading ? "Uploading photos..." : loading ? "Publishing..." : "Publish listing"}
      </button>
    </form>
  );
}