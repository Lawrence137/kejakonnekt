"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { compressImage } from "@/lib/image";

type Pic = { file: File; preview: string } | null;

const field =
  "h-12 w-full rounded-xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring";

function PhotoPicker({
  label,
  value,
  onPick,
  onError,
}: {
  label: string;
  value: Pic;
  onPick: (p: Pic) => void;
  onError: (msg: string) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium">{label}</p>
      <label className="flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-secondary/40 px-4 text-center text-sm text-muted-foreground hover:bg-secondary">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.preview} alt={label} className="h-full w-full object-cover" />
        ) : (
          "Tap to take or choose a photo"
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              const file = await compressImage(f);
              onPick({ file, preview: URL.createObjectURL(file) });
            } catch {
              onError("Could not read that photo. Try a JPG or PNG.");
            }
          }}
        />
      </label>
    </div>
  );
}

export function VerificationForm() {
  const router = useRouter();
  const [applicantType, setApplicantType] = useState("LANDLORD");
  const [fullName, setFullName] = useState("");
  const [idType, setIdType] = useState("NATIONAL_ID");
  const [idNumber, setIdNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [front, setFront] = useState<Pic>(null);
  const [back, setBack] = useState<Pic>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!front || !back) {
      setError("Add photos of both sides of your ID.");
      return;
    }
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.set("applicantType", applicantType);
    fd.set("fullName", fullName);
    fd.set("idType", idType);
    fd.set("idNumber", idNumber);
    fd.set("businessName", businessName);
    fd.set("consent", String(consent));
    fd.set("idFront", front.file, "front.jpg");
    fd.set("idBack", back.file, "back.jpg");

    try {
      const res = await fetch("/api/verification", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block text-sm font-medium">
        I am a
        <select
          value={applicantType}
          onChange={(e) => setApplicantType(e.target.value)}
          className={`${field} mt-1`}
        >
          <option value="LANDLORD">Landlord (I own the house)</option>
          <option value="AGENT">Agent / house manager</option>
        </select>
      </label>

      {applicantType === "AGENT" && (
        <label className="block text-sm font-medium">
          Agency name (optional)
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className={`${field} mt-1`}
            maxLength={100}
          />
        </label>
      )}

      <label className="block text-sm font-medium">
        Full name (as on your ID)
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`${field} mt-1`}
          required
          maxLength={100}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          ID type
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className={`${field} mt-1`}
          >
            <option value="NATIONAL_ID">National ID</option>
            <option value="PASSPORT">Passport</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          ID number
          <input
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className={`${field} mt-1`}
            required
            maxLength={20}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PhotoPicker label="ID front" value={front} onPick={setFront} onError={setError} />
        <PhotoPicker label="ID back" value={back} onPick={setBack} onError={setError} />
      </div>
      <p className="text-xs text-muted-foreground">
        Photos are shrunk on your phone before upload, so this won&apos;t use much data.
      </p>

      <label className="flex gap-3 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 size-4"
        />
        <span>
          I agree that KejaKonnect may store my ID details to verify my identity. They
          are only seen by KejaKonnect administrators and are never shown publicly.
        </span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading || !consent}
        className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit for verification"}
      </button>
    </form>
  );
}