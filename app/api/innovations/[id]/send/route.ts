import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { innovationOwnerScope } from "@/lib/innovation-access";
import {
  findMissingIndicatorNames,
  getSubmitBlockMessage,
} from "@/lib/innovation-completeness";
import { prisma } from "@/lib/prisma";

// Kirim data inovasi langsung dari halaman indikator tanpa membuka form edit.
export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });
  }

  const { id } = await context.params;
  const innovation = await prisma.innovation.findFirst({
    where: { id, deletedAt: null, ...innovationOwnerScope(user) },
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
