import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth-user";
import { slugifyNewsCategory } from "@/lib/news-category";
import { NEWS_PERMISSION } from "@/lib/news";
import { hasPermission } from "@/lib/permission";
import { prisma } from "@/lib/prisma";

const canManage = async () => { const user = await getAuthenticatedUser(); return user && hasPermission(user.role.permission, NEWS_PERMISSION.model, NEWS_PERMISSION.action); };
const uniqueSlug = async (base: string, exceptId?: string) => { let candidate = base || "kategori"; let suffix = 2; while (await prisma.newsCategoryEntity.findFirst({ where: { slug: candidate, ...(exceptId ? { id: { not: exceptId } } : {}) }, select: { id: true } })) candidate = `${base.slice(0, 115)}-${suffix++}`; return candidate; };

export async function GET() {
  if (!(await canManage())) return NextResponse.json({ message: "Tidak memiliki akses kategori berita." }, { status: 403 });
  const data = await prisma.newsCategoryEntity.findMany({ orderBy: [{ isActive: "desc" }, { name: "asc" }], include: { _count: { select: { news: true } } } });
  return NextResponse.json({ data: data.map((item) => ({ id: item.id, name: item.name, slug: item.slug, isActive: item.isActive, newsCount: item._count.news })) });
}

export async function POST(request: NextRequest) {
  if (!(await canManage())) return NextResponse.json({ message: "Tidak memiliki akses kategori berita." }, { status: 403 });
  try { const payload = await request.json() as { name?: unknown }; const name = typeof payload.name === "string" ? payload.name.trim() : ""; if (!name) throw new Error("Nama kategori wajib diisi."); const category = await prisma.newsCategoryEntity.create({ data: { name, slug: await uniqueSlug(slugifyNewsCategory(name)) } }); return NextResponse.json({ message: "Kategori berhasil ditambahkan.", data: category }, { status: 201 }); } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Gagal menambah kategori." }, { status: 400 }); }
}
