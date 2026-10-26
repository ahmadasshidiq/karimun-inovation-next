import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

const hasPermission = (permission: unknown, action: string) =>
  Array.isArray(permission) && permission.some((item) =>
    typeof item === "object" && item !== null &&
    (item as { model?: unknown }).model === "innovation-approvals" &&
    Array.isArray((item as { actions?: unknown }).actions) &&
    (item as { actions: unknown[] }).actions.includes(action),
  );

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const body = (await request.json()) as { action?: string; note?: string };
  const action = body.action === "approve" || body.action === "reject" ? body.action : null;
  if (!action || !hasPermission(user.role.permission, action))
    return NextResponse.json({ message: "Anda tidak memiliki permission approval." }, { status: 403 });
  if (action === "reject" && !body.note?.trim())
    return NextResponse.json({ message: "Catatan revisi wajib diisi." }, { status: 400 });

  const { id } = await context.params;
  const innovation = await prisma.innovation.findFirst({
    where: { id, deletedAt: null },
    select: { id: true },
  });
  if (!innovation) return NextResponse.json({ message: "Inovasi tidak ditemukan." }, { status: 404 });

  const data = action === "approve"
    ? { approvalStatus: "APPROVED", approvalNote: null, approvedById: user.id, approvedAt: new Date() }
    : { approvalStatus: "REVISION_REQUIRED", approvalNote: body.note?.trim(), approvedById: null, approvedAt: null };
  const updated = await prisma.innovation.update({ where: { id }, data });
  return NextResponse.json({ message: action === "approve" ? "Inovasi disetujui." : "Inovasi dikembalikan untuk revisi.", data: updated });
}
