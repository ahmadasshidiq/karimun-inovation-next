import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { sanitizeAnnouncementContent } from "@/lib/helper/announcement-content";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const access = await requirePermission("announcements", "update");
  if (!access.user) return access.response;
  const { id } = await context.params;
  const payload = (await request.json()) as Record<string, string>;
  const title = payload.title?.trim();
  const content = sanitizeAnnouncementContent(payload.content || "");
  if (!title || !content || !payload.announcementDate)
    return NextResponse.json({ message: "Judul, deskripsi, dan tanggal pengumuman wajib diisi." }, { status: 400 });

  const existing = await prisma.announcement.findFirst({ where: { id, deletedAt: null } });
  if (!existing)
    return NextResponse.json({ message: "Pengumuman tidak ditemukan." }, { status: 404 });
  const data = await prisma.announcement.update({
    where: { id },
    data: {
      title,
      content,
      announcementDate: new Date(`${payload.announcementDate}T00:00:00+07:00`),
      status: payload.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    },
  });
  return NextResponse.json({ message: "Pengumuman berhasil diperbarui.", data });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const access = await requirePermission("announcements", "delete");
  if (!access.user) return access.response;
  const { id } = await context.params;
  const result = await prisma.announcement.updateMany({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  if (!result.count)
    return NextResponse.json({ message: "Pengumuman tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ message: "Pengumuman berhasil dihapus." });
}
