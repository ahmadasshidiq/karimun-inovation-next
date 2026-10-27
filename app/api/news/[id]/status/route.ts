import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { isNewsStatus, NEWS_PERMISSION } from "@/lib/news";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthenticatedUser();
  if (!user || !hasPermission(user.role.permission, NEWS_PERMISSION.model, NEWS_PERMISSION.action)) {
    return NextResponse.json({ message: "Tidak memiliki akses berita." }, { status: 403 });
  }

  const { id } = await params;
  const payload = (await request.json()) as { status?: unknown };
  if (!isNewsStatus(payload.status) || payload.status === "ARCHIVED") {
    return NextResponse.json({ message: "Status berita tidak valid." }, { status: 400 });
  }

  const result = await prisma.news.updateMany({
    where: { id, deletedAt: null },
    data: { status: payload.status, publishedAt: payload.status === "PUBLISHED" ? new Date() : undefined },
  });
  if (!result.count) return NextResponse.json({ message: "Berita tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ message: payload.status === "PUBLISHED" ? "Berita berhasil dipublikasikan." : "Berita disimpan sebagai draft." });
}
