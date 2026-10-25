import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

// Temporary debugging: logs why a request was refused (dev only).
const notFound = (reason: string) => {
  if (process.env.NODE_ENV !== "production") console.warn("[id-image]", reason);
  return new NextResponse("Not found", { status: 404 });
};

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return notFound("no session");
  if (session.user.role !== "ADMIN") return notFound(`role is ${session.user.role}`);

  const id = request.nextUrl.searchParams.get("application");
  const side = request.nextUrl.searchParams.get("side");
  if (!id || (side !== "front" && side !== "back")) return notFound("bad params");

  const application = await db.landlordApplication.findUnique({
    where: { id },
    select: { idFrontPath: true, idBackPath: true },
  });
  if (!application) return notFound("application not found");

  const pathname = side === "front" ? application.idFrontPath : application.idBackPath;

  let result;
  try {
    result = await get(pathname, { access: "private" });
  } catch (err) {
    console.error("[id-image] blob error:", err);
    return new NextResponse("Storage error", { status: 500 });
  }
  if (!result) return notFound(`blob missing: ${pathname}`);
  if (result.statusCode !== 200) return notFound(`blob status ${result.statusCode}`);

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