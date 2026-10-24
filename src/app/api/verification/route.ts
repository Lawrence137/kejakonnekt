import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import type { ApplicantType, IdType } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

const MAX_BYTES = 2 * 1024 * 1024; // per photo, after client-side compression
const MAX_ATTEMPTS = 3;

const fail = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });

// Real JPEG files start with FF D8 FF, so a renamed file is rejected.
async function isJpeg(file: File) {
  const head = new Uint8Array(await file.slice(0, 3).arrayBuffer());
  return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return fail("Please log in first.", 401);
  const user = session.user;

  if (user.role !== "SEEKER") return fail("Your account is already verified.", 409);

  const [pending, attempts] = await Promise.all([
    db.landlordApplication.count({ where: { userId: user.id, status: "PENDING" } }),
    db.landlordApplication.count({ where: { userId: user.id } }),
  ]);
  if (pending > 0) return fail("You already have an application under review.", 409);
  if (attempts >= MAX_ATTEMPTS)
    return fail("Too many attempts. Please contact KejaKonnect support.", 429);

  const form = await request.formData();
  const text = (key: string) => String(form.get(key) ?? "").trim();

  const applicantType = text("applicantType");
  const idType = text("idType");
  const fullName = text("fullName");
  const idNumber = text("idNumber").replace(/\s/g, "");
  const businessName = text("businessName") || null;
  const idFront = form.get("idFront");
  const idBack = form.get("idBack");

  if (!["LANDLORD", "AGENT"].includes(applicantType)) return fail("Choose landlord or agent.");
  if (!["NATIONAL_ID", "PASSPORT"].includes(idType)) return fail("Choose an ID type.");
  if (fullName.length < 3 || fullName.length > 100) return fail("Enter your full name as on your ID.");
  if (!/^[A-Za-z0-9]{5,15}$/.test(idNumber)) return fail("Enter a valid ID number.");
  if (businessName && businessName.length > 100) return fail("Agency name is too long.");
  if (form.get("consent") !== "true") return fail("Please accept the consent notice.");

  if (!(idFront instanceof File) || !(idBack instanceof File))
    return fail("Upload both the front and back of your ID.");
  for (const file of [idFront, idBack]) {
    if (file.size === 0 || file.size > MAX_BYTES) return fail("Each photo must be under 2 MB.");
    if (file.type !== "image/jpeg" || !(await isJpeg(file)))
      return fail("Photos must be JPG images.");
  }

  // The path has an unguessable id; files can only be read through our admin route anyway.
  const folder = `id-verification/${user.id}/${crypto.randomUUID()}`;
  const [front, back] = await Promise.all([
    put(`${folder}-front.jpg`, idFront, { access: "private", contentType: "image/jpeg" }),
    put(`${folder}-back.jpg`, idBack, { access: "private", contentType: "image/jpeg" }),
  ]);

  await db.landlordApplication.create({
    data: {
      userId: user.id,
      applicantType: applicantType as ApplicantType,
      idType: idType as IdType,
      fullName,
      idNumber,
      businessName,
      idFrontPath: front.pathname,
      idBackPath: back.pathname,
    },
  });

  return NextResponse.json({ ok: true });
}