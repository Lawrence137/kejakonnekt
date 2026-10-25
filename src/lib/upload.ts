// Real JPEG files start with FF D8 FF, so a renamed file is rejected.
export async function isJpeg(file: File) {
  const head = new Uint8Array(await file.slice(0, 3).arrayBuffer());
  return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
}

// A photo URL is only accepted if it points at a public Blob store AND sits
// inside this user's own folder.
export function isOwnPhotoUrl(raw: string, userId: string) {
  try {
    const u = new URL(raw);
    return (
      u.protocol === "https:" &&
      u.hostname.endsWith(".public.blob.vercel-storage.com") &&
      u.pathname.startsWith(`/listings/${userId}/`)
    );
  } catch {
    return false;
  }
}