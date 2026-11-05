import { NextRequest, NextResponse } from "next/server";
import { clientErrorMessage } from "@/lib/api-error";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { slugifyNewsCategory } from "@/lib/news-category";
import { NEWS_PERMISSION } from "@/lib/news";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";
import { withAudit } from "@/lib/audit-log";

const canManage = async () => {
  const user = await getAuthenticatedUser();
  return (
    user &&
    hasPermission(
      user.role.permission,
      NEWS_PERMISSION.model,
      NEWS_PERMISSION.action,
    )
  );
};
const uniqueSlug = async (base: string, exceptId?: string) => {
  let candidate = base || "kategori";
  let suffix = 2;
  while (
    await prisma.newsCategoryEntity.findFirst({
      where: {
        slug: candidate,
        ...(exceptId ? { id: { not: exceptId } } : {}),
      },
      select: { id: true },
    })
  )
    candidate = `${base.slice(0, 115)}-${suffix++}`;
  return candidate;
};

export async function GET(request: NextRequest) {
  if (!(await canManage())) {
    return NextResponse.json(
      { message: "Tidak memiliki akses kategori berita." },
      { status: 403 },
    );
  }

  const params = request.nextUrl.searchParams;
  const paginated = params.has("page");
  const page = Math.max(1, Number(params.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 10));
  const search = params.get("search")?.trim() || "";
  const status = params.get("status");

  const where = {
    ...(status === "ACTIVE" || status === "INACTIVE"
      ? { isActive: status === "ACTIVE" }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.newsCategoryEntity.findMany({
      where,
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      include: { _count: { select: { news: true } } },
      ...(paginated ? { skip: (page - 1) * limit, take: limit } : {}),
    }),
    prisma.newsCategoryEntity.count({ where }),
  ]);

  return NextResponse.json({
    data: data.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      isActive: item.isActive,
      newsCount: item._count.news,
    })),
    total,
  });
}

async function handlePost(request: NextRequest) {
  if (!(await canManage()))
    return NextResponse.json(
      { message: "Tidak memiliki akses kategori berita." },
      { status: 403 },
    );
  try {
    const payload = (await request.json()) as { name?: unknown };
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    if (!name) throw new Error("Nama kategori wajib diisi.");
    const category = await prisma.newsCategoryEntity.create({
      data: { name, slug: await uniqueSlug(slugifyNewsCategory(name)) },
    });
    return NextResponse.json(
      { message: "Kategori berhasil ditambahkan.", data: category },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: clientErrorMessage(error, "Gagal menambah kategori.") },
      { status: 400 },
    );
  }
}

export const POST = withAudit("news-categories", handlePost);
