import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { publicBlobOptions } from "@/lib/blob";
import { getSession } from "@/lib/session";
import { isJpeg } from "@/lib/upload";

const fail = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return fail("Please log in first.", 401);

  const user = session.user;
  if (user.role !== "LANDLORD" && user.role !== "AGENT")
    return fail("Only verified landlords and agents can upload photos.", 403);

  const form = await request.formData();
  const full = form.get("full");
  const thumb = form.get("thumb");
  if (!(full instanceof File) || !(thumb instanceof File)) return fail("Photo is missing.");

  if (full.size === 0 || full.size > 1_500_000 || thumb.size === 0 || thumb.size > 300_000)
    return fail("That photo is too large.");
  if (!(await isJpeg(full)) || !(await isJpeg(thumb)))
    return fail("Photos must be JPG images.");

  const base = `listings/${user.id}/${crypto.randomUUID()}`;
  const [a, b] = await Promise.all([
    put(`${base}.jpg`, full, publicBlobOptions()),
    put(`${base}-thumb.jpg`, thumb, publicBlobOptions()),
  ]);

  return NextResponse.json({ url: a.url, thumbUrl: b.url });
}