import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationEditScope } from "@/lib/innovation-access";
import { hasPermission } from "@/lib/permission";
import {
  findMissingIndicatorNames,
  getSubmitBlockMessage,
} from "@/lib/innovation-completeness";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit-log";

// Kirim data inovasi langsung dari halaman indikator tanpa membuka form edit.
async function handlePost(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }
  if (!hasPermission(user.role.permission, "innovations", "update")) {
    return NextResponse.json(
      { message: "Anda tidak memiliki akses untuk tindakan ini." },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const innovation = await prisma.innovation.findFirst({
    where: { id, deletedAt: null, ...innovationEditScope(user) },
  });
  if (!innovation) {
    return NextResponse.json(
      { message: "Inovasi tidak ditemukan." },
      { status: 404 },
    );
  }

  const submitBlockMessage = getSubmitBlockMessage(
    innovation as unknown as Record<string, unknown>,
    await findMissingIndicatorNames(id),
  );
  if (submitBlockMessage) {
    return NextResponse.json({ message: submitBlockMessage }, { status: 400 });
  }

  await prisma.innovation.update({
    where: { id },
    data: { submissionStatus: "SUBMITTED" },
  });

  return NextResponse.json({ message: "Data inovasi berhasil dikirim." });
}

export const POST = withAudit("innovations/[id]/send", handlePost);
