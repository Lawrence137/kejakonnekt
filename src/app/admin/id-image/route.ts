import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

const notFound = () => new NextResponse("Not found", { status: 404 });

export async function GET(request: NextRequest) {
  // Auth is checked here, right next to the blob read, not in middleware.
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") return notFound();

  const id = request.nextUrl.searchParams.get("application");
  const side = request.nextUrl.searchParams.get("side");
  if (!id || (side !== "front" && side !== "back")) return notFound();

  // The path comes from OUR database, never from the URL.
  const application = await db.landlordApplication.findUnique({
    where: { id },
    select: { idFrontPath: true, idBackPath: true },
  });
  if (!application) return notFound();

  const pathname = side === "front" ? application.idFrontPath : application.idBackPath;
  const result = await get(pathname, { access: "private" });
  if (result?.statusCode !== 200) return notFound();

  await db.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "ID_VIEWED",
      targetType: "LandlordApplication",
      targetId: id,
    },
  });

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}