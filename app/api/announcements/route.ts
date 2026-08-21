import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { sanitizeAnnouncementContent } from "@/lib/helper/announcement-content";

const dateOnly = (value: Date) => value.toISOString().slice(0, 10);

export async function GET(request: NextRequest) {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 10));
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const status = request.nextUrl.searchParams.get("status");
  const dashboard = request.nextUrl.searchParams.get("dashboard") === "true";
  const where = {
    deletedAt: null,
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
    ...(dashboard ? { status: "ACTIVE" as const } : status && status !== "all" ? { status: status as "ACTIVE" | "INACTIVE" } : {}),
  };
  const [records, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: [{ announcementDate: "desc" }, { createdAt: "desc" }],
      skip: dashboard ? 0 : (page - 1) * limit,
      take: dashboard ? 5 : limit,
    }),
    prisma.announcement.count({ where }),
  ]);

  return NextResponse.json({
    data: records.map((item) => ({
      ...item,
      announcementDate: dateOnly(item.announcementDate),
    })),
    total,
  });
}

export async function POST(request: NextRequest) {
  if (!(await getAuthenticatedUser()))
    return NextResponse.json({ message: "Sesi tidak valid." }, { status: 401 });

  const payload = (await request.json()) as Record<string, string>;
  const title = payload.title?.trim();
  const content = sanitizeAnnouncementContent(payload.content || "");
  if (!title || !content || !payload.announcementDate)
    return NextResponse.json({ message: "Judul, deskripsi, dan tanggal pengumuman wajib diisi." }, { status: 400 });

  const data = await prisma.announcement.create({
    data: {
      title,
      content,
      announcementDate: new Date(`${payload.announcementDate}T00:00:00+07:00`),
      status: payload.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    },
  });
  return NextResponse.json({ message: "Pengumuman berhasil ditambahkan.", data }, { status: 201 });
}
